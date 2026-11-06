"""Phase 2 (Cantona) : finales, mesures et planche de contrôle. Local, gratuit, reproductible.
Usage : python3 -I scripts/illustrations/finals.py <dossier_bruts> <dossier_sortie_public> <dossier_planche>
- Encre : même calcul qu'ink2.py pour les 7 visuels (papier local sur 9 px, seuil 0,06, poussière < 40 px).
  Un seul paramètre varie d'un visuel à l'autre : le gain d'encre, réglé par dichotomie pour que l'épaisseur
  mesurée du trait atteigne la cible (0,85 px CSS). C'est ce qui garantit « une seule main » à l'écran.
- Recadrage au ratio du §3 (05-illustrations-cantona.md), export 2× en PNG transparent à palette (lot C : plus de WebP
  en double, next/image sert le WebP).
- Mesures à la taille 2× (équivalent écran Retina de la taille d'affichage) :
  * trait : médiane de la largeur des segments d'encre (lignes et colonnes, opacité > 0,35,
    segments de 1 à 8 px, largeur sous-pixel = somme des opacités) ; rapportée en px CSS (÷ 2) ;
  * aplat noir : part de la surface couverte par de l'encre opaque (> 0,85) qui survit à une
    ouverture morphologique 5 × 5 px (≥ 2,5 px CSS d'épaisseur pleine) ;
  * grenat : nombre de pixels dont la teinte s'écarte de l'encre #251C19 (doit être 0 par construction).
- Planche : les 7 visuels à leur taille CSS réelle, rendus à 2× (1 px CSS = 2 px), sur crème et sur crème soutenu.
Revue n° 2 (A27, A28, §8bis), sans aucun appel d'IA :
- ILL-01 : RETOUCHES appliquées à la source avant l'encrage (touffes de branchages gommées, bordure de trottoir
  du pavillon gommée, pavillon descendu sur la ligne de trottoir de l'immeuble : une seule ligne de sol continue).
- ILL-03 : dessin SVG à la main (scripts/illustrations/ill03_devanture.py), trait de 1,25 px en #251C19. Ici, seule
  l'opacité du groupe est réglée par dichotomie (même mesure, même cible que le gain des autres visuels) ;
  le SVG livré dans public/illustrations/ill-03.svg porte cette opacité, et le PNG/WebP 2× en est le rendu exact.
- ILL-04 : hors service (A27), toujours exportée et mesurée, marquée « réserve » sur la planche.
Revue du lot C, tour 1 (correction 1), sans aucun appel d'IA :
- ILL-09 : ton ramené à celui du lot par une courbe d'opacité propre (TONS) : genou à 0,6 (pente 0,3 au-dessus),
  toiture à 60 % de l'encre des murs (les souches sont exclues de la zone), léger flou d'encre (σ 0,7 px à 2×) qui
  étale le trait au lieu de le noircir, gain plafonné à 2. Recadrage sur le sujet : 320 × 245 px CSS (ratio natif).
- Deux mesures de ton ajoutées pour les 8 visuels, dans le cadre du dessin (boîte des pixels d'opacité > 0,02) :
  sombre_cadre_pct (part des pixels d'opacité > 0,6, cible < 8 %) et couverture_cadre_pct (opacité moyenne, < 16 %).
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi

RAW, OUT, PL = (Path(p) for p in sys.argv[1:4])
OUT.mkdir(parents=True, exist_ok=True)
PL.mkdir(parents=True, exist_ok=True)

# id, source brute, recadrage (x0, y0, x1, y1) en px source ou None, taille CSS (l, h), ancrage
FINALS = [
    ("ill-01", "ILL01d-s1909-p50.png", (0, 21, 1216, 832), (760, 507), "remplir"),
    ("ill-02", "ILL02-s2009.png", None, (280, 350), "centre"),
    ("ill-03", "ill-03-devanture.svg", None, (360, 480), "svg"),
    ("ill-04", "ILL04c-s1909.png", None, (400, 500), "bas"),
    ("ill-05", "ILL05-s2009.png", None, (400, 500), "bas"),
    ("ill-06", "ILL06-s2009.png", (0, 0, 1536, 461), (1200, 360), "remplir"),
    ("ill-08", "ILL08-s2009.png", None, (240, 300), "bas"),
    # Lot C (implémentation, enveloppe de 0,40 $) : pavillon en meulière différent d'ILL-01, pour l'en-tête de Vendre.
    # Revue lot C (tour 1) : recadré sur le sujet, ratio natif proche de 4:3 (avant : 280 × 350, maison dans le bas 54 %).
    ("ill-09", "../../illustrations-phase3/sources/ILL09e-s1909-p68.png", None, (320, 245), "bas"),
]


CIBLE = 0.74  # épaisseur de trait visée, px CSS


def quantifie(im: Image.Image) -> Image.Image:
    """Lot C (optimisation) : opacité < 8/255 ramenée à 0 (invisible sur crème), puis 64 niveaux (écart ≤ 7/255)."""
    a = np.asarray(im.getchannel("A")).astype(np.int32)
    a[a < 8] = 0
    a = np.where(a > 0, np.clip((a // 4) * 4 + 2, 0, 255), 0)
    return depuis_alpha(a.astype(np.float32) / 255)


def exporte(im: Image.Image, chemin: Path) -> None:
    """PNG à palette sans perte : une seule encre #251C19, l'index de palette porte l'opacité (256 entrées).
    C'est la source de next/image, qui sert du WebP au navigateur : aucun WebP n'est exporté en double."""
    a = im.getchannel("A")
    p = Image.frombytes("P", a.size, a.tobytes())
    p.putpalette([0x25, 0x1C, 0x19] * 256)
    p.save(chemin, "PNG", optimize=True, transparency=bytes(range(256)))


def depuis_alpha(a: np.ndarray) -> Image.Image:
    """Une seule encre #251C19, seule l'opacité varie (zéro grenat par construction)."""
    img = Image.new("RGBA", (a.shape[1], a.shape[0]), (0x25, 0x1C, 0x19, 255))
    img.putalpha(Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)))
    return img


PAPIER = (249, 243, 233)  # couleur du papier des bruts flux-dev (mesurée sur ILL01d)

# Retouches de la source, avant l'encrage (coordonnées de la source). ("gomme", boîte) peint le papier ;
# ("decale", boîte, dy) descend la boîte de dy px (le haut libéré est peint en papier).
RETOUCHES = {
    "ILL01d-s1909-p50.png": [
        # (1) touffes de branchages griffonnées de part et d'autre du pavillon, et herbes au pied des piliers.
        #     Les piliers (cap 355-381 / 732-760 à partir de y 677, fût 361-379 / 739-756) et les murs sont épargnés.
        ("gomme", (296, 590, 355, 768)), ("gomme", (355, 590, 382, 677)), ("gomme", (355, 688, 360, 768)),
        ("gomme", (719, 590, 800, 676)), ("gomme", (761, 676, 812, 768)), ("gomme", (757, 692, 761, 768)),
        ("gomme", (719, 590, 732, 688)),
        # (2) une seule ligne de trottoir : la bordure du pavillon (y 765-784) est gommée, puis le pavillon
        #     (pied à y 765) descend de 19 px pour poser sur la ligne de l'immeuble (y 785-786, x 300-1215).
        ("gomme", (296, 765, 880, 785)),
        ("decale", (296, 280, 880, 766), 19),
    ],
    # Lot C : ILL-09 (img2img force 0,68 d'ILL09-s4009, arbre et buisson déjà gommés dans le guide).
    "ILL09e-s1909-p68.png": [
        ("gomme", (0, 0, 12, 1120)),  # filet vertical du bord gauche de la feuille
        ("gomme", (707, 636, 724, 684)),  # applique (lanterne ou plaque) sur l'angle droit du mur : objet, gommé
        # touffes d'herbe au pied du muret et des piliers ; la ligne de sol (y ≥ 890) est conservée
        ("gomme", (126, 862, 170, 889)), ("gomme", (336, 862, 382, 889)), ("gomme", (544, 862, 584, 889)),
        ("gomme", (702, 862, 724, 889)), ("gomme", (777, 862, 799, 889)), ("gomme", (862, 850, 900, 889)),
        # cheminées en brique : rendues presque pleines par le gain élevé ; écart au papier ramené à 45 %
        ("eclaircit", (238, 200, 292, 452), 0.45), ("eclaircit", (646, 200, 702, 468), 0.45),
    ],
}


def source(src: Path) -> Image.Image:
    im = Image.open(src).convert("RGB")
    for op in RETOUCHES.get(src.name, []):
        if op[0] == "gomme":
            im.paste(PAPIER, op[1])
        elif op[0] == "eclaircit":  # ("eclaircit", boîte, k) : l'écart au papier est multiplié par k (< 1)
            box, k = op[1], op[2]
            a = np.asarray(im.crop(box), dtype=np.float32)
            p = np.array(PAPIER, dtype=np.float32)
            im.paste(Image.fromarray(np.clip(p - (p - a) * k, 0, 255).astype(np.uint8)), box[:2])
        else:
            box, dy = op[1], op[2]
            bloc = im.crop(box)
            im.paste(PAPIER, box)
            im.paste(bloc, (box[0], box[1] + dy))
    return im


def prepare(src: Path):
    """Même calcul que ink2.py : division par le papier local (fenêtre 9), seuil 0,06. Le gain est réglé ensuite."""
    L = np.asarray(source(src).convert("L"), dtype=np.float32) / 255.0
    paper = ndi.gaussian_filter(ndi.maximum_filter(L, size=9), 3)
    return np.clip((np.clip(1.0 - L / np.maximum(paper, 1e-3), 0, 1) - 0.06) / 0.94, 0, 1)


# Revue lot C (tour 1) : courbe d'opacité propre à un visuel, appliquée à l'encre (coordonnées de la source).
# genou : au-dessus de `seuil`, l'opacité ne croît plus qu'avec la `pente` ; `toiture` : boîtes multipliées par k ;
# `flou` : sigma (px à 2×) appliqué après le recadrage ; `plafond` : gain maximal de la dichotomie.
TONS = {
    "ill-09": {
        "seuil": 0.6, "pente": 0.3, "flou": 0.7, "plafond": 2.0,
        # toiture à croupe et lucarne (y 255-500), souches de brique exclues (x 238-292 et 646-702 jusqu'à leur pied)
        "toiture": ([(185, 255, 238, 500), (292, 255, 646, 500), (702, 255, 745, 500),
                     (238, 452, 292, 500), (646, 468, 702, 500)], 0.6),
    },
}


def encre(base: np.ndarray, gain: float, ton: dict | None = None) -> Image.Image:
    ink = np.clip(base * gain, 0, 1)
    if ton:
        ink = np.where(ink > ton["seuil"], ton["seuil"] + (ink - ton["seuil"]) * ton["pente"], ink)
        boites, k = ton["toiture"]
        for x0, y0, x1, y1 in boites:
            ink[y0:y1, x0:x1] *= k
    lab, n = ndi.label(ink > 0.02)
    if n:
        sizes = ndi.sum(np.ones_like(ink), lab, index=np.arange(1, n + 1))
        ink[np.isin(lab, np.where(sizes < 40)[0] + 1)] = 0
    return depuis_alpha(ink)


# Gommages locaux (coordonnées de l'image source) : éléments hors registre retirés à la main.
GOMMAGES = {
    "ILL04c-s1909.png": [(15, 640, 116, 772), (732, 630, 756, 770), (756, 580, 880, 741), (790, 741, 880, 770),
                         (25, 800, 76, 905), (805, 800, 858, 905),
                         (0, 952, 896, 1088)],  # lavis d'arbres, griffures des murs latéraux et sous le trottoir
}


def gomme(im: Image.Image, src: str) -> Image.Image:
    for box in GOMMAGES.get(src, []):
        im.paste((0x25, 0x1C, 0x19, 0), box)
    return im


def cadre(im: Image.Image, box, size, anchor, k: float = 1.0) -> Image.Image:
    W, H = size[0] * 2, size[1] * 2
    if box:
        im = im.crop(box)
    if anchor == "remplir":  # recadrage plein cadre au ratio exact
        r = W / H
        w, h = im.size
        if w / h > r:
            nw = int(h * r); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
        else:
            nh = int(w / r); im = im.crop((0, 0, w, nh))
        return im.resize((W, H), Image.LANCZOS)
    bb = im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
    im = im.crop(bb)
    marge = 0.06
    s = k * min(W * (1 - 2 * marge) / im.width, H * (1 - marge) / im.height)
    im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
    cv = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    x = (W - im.width) // 2
    y = H - im.height - int(H * 0.02) if anchor == "bas" else (H - im.height) // 2
    cv.alpha_composite(im, (x, y))
    return cv


def largeur(a: np.ndarray) -> float:
    widths = []
    for arr in (a, a.T):
        m = arr > 0.35
        for row, mrow in zip(arr, m):
            if not mrow.any():
                continue
            d = np.diff(np.concatenate(([0], mrow.astype(np.int8), [0])))
            st, en = np.where(d == 1)[0], np.where(d == -1)[0]
            for s_, e_ in zip(st, en):
                if 1 <= e_ - s_ <= 8:
                    widths.append(row[max(0, s_ - 1):e_ + 1].sum())
    return float(np.median(widths)) / 2 if widths else 0.0


def mesures(im: Image.Image) -> dict:
    a = np.asarray(im.getchannel("A"), dtype=np.float32) / 255
    w = largeur(a) * 2
    plein = ndi.binary_opening(a > 0.85, structure=np.ones((5, 5)))
    sombre = ndi.binary_opening(a > 0.60, structure=np.ones((5, 5)))
    rgb = np.asarray(im.convert("RGB"), dtype=np.int16)
    vis = a > 0.05
    hors = (np.abs(rgb - np.array([0x25, 0x1C, 0x19])).max(axis=2) > 2) & vis
    ys, xs = np.where(a > 0.02)  # cadre du dessin : boîte des pixels visibles
    c = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    return {"trait_px_css": round(w / 2, 3), "aplat_noir_pct": round(100 * plein.mean(), 2), "masse_sombre_pct": round(100 * sombre.mean(), 2),
            "encre_pct": round(100 * (a > 0.35).mean(), 1), "pixels_hors_encre": int(hors.sum()),
            "sombre_cadre_pct": round(100 * float((c > 0.6).mean()), 1), "couverture_cadre_pct": round(100 * float(c.mean()), 1)}


def floute(im: Image.Image, ton: dict | None) -> Image.Image:
    if not ton:
        return im
    return depuis_alpha(ndi.gaussian_filter(np.asarray(im.getchannel("A"), dtype=np.float32) / 255, ton["flou"]))


def rendu_svg(svg: str, opacite: float, size) -> Image.Image:
    """Rendu 2× exact du SVG (rsvg-convert), reconstruit sur l'encre unique à partir de l'alpha."""
    with tempfile.TemporaryDirectory() as t:
        f = Path(t) / "i.svg"
        f.write_text(svg.replace("__OPACITE__", f"{opacite:.3f}"))
        subprocess.run(["rsvg-convert", "-w", str(size[0] * 2), "-h", str(size[1] * 2), str(f), "-o", str(Path(t) / "i.png")], check=True)
        a = np.asarray(Image.open(Path(t) / "i.png").getchannel("A"), dtype=np.float32) / 255
    return depuis_alpha(a)


rows = []
finals = {}
for fid, src, box, size, anchor in FINALS:
    if anchor == "svg":
        svg = (RAW / src).read_text()
        lo, hi = 0.3, 1.0  # opacité du groupe : un seul paramètre, réglé sur la même cible d'épaisseur
        for _ in range(12):
            g = (lo + hi) / 2
            if largeur(np.asarray(rendu_svg(svg, g, size).getchannel("A"), dtype=np.float32) / 255) > CIBLE: hi = g
            else: lo = g
        gain = round((lo + hi) / 2, 3)
        im = quantifie(rendu_svg(svg, gain, size))
        (OUT / f"{fid}.svg").write_text(svg.replace("__OPACITE__", f"{gain:.3f}"))
        exporte(im, OUT / f"{fid}.png")
        finals[fid] = (im, size)
        rows.append({"id": fid, "source": src, "css": f"{size[0]}×{size[1]}", "opacite_trait_1_25px": gain, **mesures(im)})
        continue
    base = prepare(RAW / src)
    k = 1.0
    # gain d'encre : un seul paramètre, réglé pour atteindre la cible d'épaisseur. Plafond 1,5 (au-delà, ILL-04
    # dépasse 2 % d'aplat) ; ILL-09, réduite 1,6 fois, n'atteint la cible qu'au-delà : plafond 3, aplat contrôlé.
    # Revue lot C : ILL-09 a sa courbe de ton (TONS), qui fixe son propre plafond (2).
    ton = TONS.get(fid)
    lo, hi = 0.6, (ton["plafond"] if ton else 1.5)
    for _ in range(10):
        g = (lo + hi) / 2
        im = floute(cadre(gomme(encre(base, g, ton), src), box, size, anchor, k), ton)
        if largeur(np.asarray(im.getchannel("A"), dtype=np.float32) / 255) > CIBLE: hi = g
        else: lo = g
    gain = (lo + hi) / 2
    im = floute(cadre(gomme(encre(base, gain, ton), src), box, size, anchor, k), ton)
    im = quantifie(im)
    exporte(im, OUT / f"{fid}.png")
    finals[fid] = (im, size)
    m = mesures(im)
    rows.append({"id": fid, "source": src, "css": f"{size[0]}×{size[1]}", "gain": round(gain, 3), **m})

ws = [r["trait_px_css"] for r in rows]
ref = float(np.median(ws))
for r in rows:
    r["ecart_vs_mediane_pct"] = round(100 * (r["trait_px_css"] - ref) / ref, 1)
ecart_max = round(100 * (max(ws) - min(ws)) / min(ws), 1)
json.dump({"mediane_trait_px_css": round(ref, 3), "ecart_max_min_pct": ecart_max, "visuels": rows},
          open(PL / "mesures.json", "w"), indent=1, ensure_ascii=False)

# Planche : taille CSS réelle, rendue à 2×
try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 22)
except OSError:
    font = ImageFont.load_default()
for nom, hexa in (("creme", "#F8F2E9"), ("creme-soutenu", "#EFE6D7")):
    G = 48 * 2
    lignes = [["ill-01", "ill-02", "ill-03"], ["ill-09", "ill-04", "ill-05", "ill-08"], ["ill-06"]]
    W = max(sum(finals[i][0].width for i in l) + G * (len(l) + 1) for l in lignes)
    H = sum(max(finals[i][0].height for i in l) + G + 84 for l in lignes) + G
    pl = Image.new("RGBA", (W, H), hexa)
    d = ImageDraw.Draw(pl)
    y = G
    for l in lignes:
        x = G
        for i in l:
            im, size = finals[i]
            pl.alpha_composite(im, (x, y))
            r = next(r for r in rows if r["id"] == i)
            note = " · réserve, non appelée (A27)" if i == "ill-04" else (" · Vendre (lot C)" if i == "ill-09" else (" · SVG à la main" if i == "ill-03" else ""))
            d.text((x, y + im.height + 12),
                   f"{i.upper()}  {size[0]}×{size[1]} px CSS · trait {r['trait_px_css']:.2f} px · aplat {r['aplat_noir_pct']} %{note}",
                   fill="#6F6259", font=font)
            d.text((x, y + im.height + 40),
                   f"> 0,6 dans le cadre {r['sombre_cadre_pct']} % · couverture {r['couverture_cadre_pct']} %",
                   fill="#6F6259", font=font)
            x += im.width + G
        y += max(finals[i][0].height for i in l) + G + 84
    pl.convert("RGB").save(PL / f"planche-illustrations-{nom}.png", optimize=True)
print(json.dumps({"mediane": ref, "ecart_max_min_pct": ecart_max}, ensure_ascii=False))
for r in rows:
    print(r)
