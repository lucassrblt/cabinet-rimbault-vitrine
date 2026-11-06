"""Propositions de logotype et de monogramme (Cantona, phase 2) : SVG vectorisés depuis Spectral (OFL), sans IA.
Usage : python3 -I scripts/illustrations/logotypes.py <dossier_polices> <dossier_sortie>
Polices attendues : Spectral-Medium.ttf, Spectral-Regular.ttf, SpectralSC-Medium.ttf (google/fonts, licence OFL 1.1).
Les lettres sont converties en contours : le SVG ne dépend d'aucune police installée.
Couleurs : grenat #5F1A24 (Pirlo), crème #F8F2E9. Aucune autre couleur.
"""
import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

FONTS, OUT = Path(sys.argv[1]), Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)
GRENAT, CREME = "#5F1A24", "#F8F2E9"


class Face:
    def __init__(self, file):
        self.f = TTFont(FONTS / file)
        self.gs = self.f.getGlyphSet()
        self.cmap = self.f.getBestCmap()
        self.upm = self.f["head"].unitsPerEm
        self.kern = self._kern()

    def _kern(self):
        # Paires de crénage simples (GPOS PairPos format 1) ; suffisant pour un mot-symbole.
        pairs = {}
        if "GPOS" not in self.f:
            return pairs
        for lookup in self.f["GPOS"].table.LookupList.Lookup:
            for st in lookup.SubTable:
                st = getattr(st, "ExtSubTable", st)
                if getattr(st, "Format", None) == 1 and lookup.LookupType in (2, 9) and hasattr(st, "PairSet"):
                    cov = st.Coverage.glyphs
                    for g1, ps in zip(cov, st.PairSet):
                        for rec in ps.PairValueRecord:
                            v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 else 0
                            if v:
                                pairs[(g1, rec.SecondGlyph)] = v
        return pairs

    def path(self, text, size, x=0.0, y=0.0, tracking=0.0):
        """Renvoie (d, largeur) pour `text` en corps `size` px, ligne de base en y. tracking en em."""
        s = size / self.upm
        pen = SVGPathPen(self.gs)
        cx = 0.0
        prev = None
        for ch in text:
            g = self.cmap[ord(ch)]
            if prev is not None:
                cx += self.kern.get((prev, g), 0)
            tp = TransformPen(pen, (s, 0, 0, -s, x + cx * s, y))
            self.gs[g].draw(tp)
            cx += self.gs[g].width + tracking * self.upm
            prev = g
        return pen.getCommands(), (cx - tracking * self.upm) * s

    def bounds(self, text, size):
        from fontTools.pens.boundsPen import BoundsPen
        bp = BoundsPen(self.gs)
        s = size / self.upm
        cx = 0.0
        for ch in text:
            g = self.cmap[ord(ch)]
            self.gs[g].draw(TransformPen(bp, (s, 0, 0, -s, cx * s, 0)))
            cx += self.gs[g].width
        return bp.bounds  # xmin, ymin, xmax, ymax (y vers le bas)


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" width="{w:.2f}" height="{h:.2f}" '
            f'role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n')


med, reg, sc = Face("Spectral-Medium.ttf"), Face("Spectral-Regular.ttf"), Face("SpectralSC-Medium.ttf")
written = []

# Proposition A : « Cabinet Rimbault » en Spectral 500, une ligne, sans ornement (référence Pirlo : 23 px desktop).
# Dessiné au corps 23 ; hauteur de boîte = ascendante du « b »/« l » à la descendante (aucune ici) + marge 1 px.
for name, face, text, size, track in (
    ("logotype-A-spectral-500", med, "Cabinet Rimbault", 23, 0.0),
    ("logotype-B-petites-capitales", sc, "Cabinet Rimbault", 21, 0.06),
):
    xmin, ymin, xmax, ymax = face.bounds(text, size)
    d, w = face.path(text, size, x=-xmin, y=-ymin + 0.5, tracking=track)
    W, H = w - xmin + 0.5, (ymax - ymin) + 1
    open(OUT / f"{name}.svg", "w").write(svg(W, H, f'<path fill="{GRENAT}" d="{d}"/>', "Cabinet Rimbault"))
    written.append((name, W, H))

# Proposition C : monogramme + mot-symbole. Filet vertical de 1 px entre les deux (le seul ornement : un filet, comme Pirlo).
def monogramme(size, fg, bg, x0=0.0, y0=0.0):
    """« C » et « R » de Spectral 500 entrelacés : le R entre dans l'ouverture du C et en est détaché par
    un filet de la couleur du fond (contour peint sous le R), comme un chiffre gravé. Renvoie (svg, largeur)."""
    c_d, c_w = med.path("C", size, x=x0, y=y0)
    r_x = x0 + c_w * 0.66
    r_d, r_w = med.path("R", size, x=r_x, y=y0)
    gap = size * 0.045
    body = (f'<path fill="{fg}" d="{c_d}"/>'
            f'<path fill="{fg}" stroke="{bg}" stroke-width="{gap:.2f}" stroke-linejoin="round" paint-order="stroke" d="{r_d}"/>')
    rb = med.bounds("R", size)
    return body, r_x + rb[2] - x0


# bornes réelles des capitales
cap = med.bounds("CR", 100)
cap_h = -cap[1] / 100  # hauteur de capitale en em (y vers le bas, ymin négatif)

size_m = 24 / cap_h * 0.92  # capitales de 22 px environ dans une boîte de 24
cb = med.bounds("C", size_m)
d_m, w_m = monogramme(size_m, GRENAT, CREME, x0=-cb[0], y0=23)
xmin, ymin, xmax, ymax = med.bounds("Cabinet Rimbault", 19)
d_t, w_t = med.path("Cabinet Rimbault", 19, x=w_m + 13, y=23 - 3)
body = (d_m +
        f'<rect x="{w_m + 6:.2f}" y="3" width="1" height="20" fill="{GRENAT}"/>'
        f'<path fill="{GRENAT}" d="{d_t}"/>')
W = w_m + 13 + w_t + 1
open(OUT / "logotype-C-monogramme-et-nom.svg", "w").write(svg(W, 25, body, "Cabinet Rimbault"))
written.append(("logotype-C-monogramme-et-nom", W, 25))

# Monogramme seul : icône carrée 64 × 64, deux variantes (crème sur grenat, grenat sur crème). Angles droits (Pirlo : 0 arrondi sur les images ; 3 px pour les contrôles : l'icône n'est pas un contrôle).
for name, fg, bg in (("monogramme-CR-grenat", CREME, GRENAT), ("monogramme-CR-creme", GRENAT, CREME)):
    size = 64 * 0.56 / cap_h  # capitales = 56 % de la hauteur, lisibles à 16 px
    cb = med.bounds("C", size)
    _, w0 = monogramme(size, fg, bg)
    x0 = (64 - (w0 - cb[0])) / 2 - cb[0]
    y0 = 32 + (size * cap_h) / 2
    d, _ = monogramme(size, fg, bg, x0=x0, y0=y0)
    open(OUT / f"{name}.svg", "w").write(
        svg(64, 64, f'<rect width="64" height="64" fill="{bg}"/>{d}', "CR"))
    written.append((name, 64, 64))

for n, w, h in written:
    print(f"{n}: {w:.1f} × {h:.1f}")
