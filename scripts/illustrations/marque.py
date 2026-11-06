"""Intégration de la marque validée (A26, revue n° 2) : logotype A et monogramme crème sur grenat. Sans IA, 0 $.
Usage : python3 -I scripts/illustrations/marque.py <dossier_polices> <racine_vitrine>
Polices : Spectral-Medium.ttf et Spectral-Regular.ttf (google/fonts, OFL 1.1), vectorisées avec fontTools.
Écrit :
- src/components/brand/Logotype.tsx : « Cabinet Rimbault » en Spectral 500, ton grenat (en-tête) ou crème (pied grenat) ;
- src/components/brand/Monogram.tsx : monogramme CR crème sur grenat (réservé aux icônes, jamais dans la page) ;
- src/app/icon.svg (64 × 64) et src/app/apple-icon.png (180 × 180) : même monogramme ;
- src/app/opengraph-image.png (1200 × 630) et opengraph-image.alt.txt : ILL-01 retouchée à droite, logotype A à gauche.
Le monogramme reprend exactement le dessin de logotypes.py (R logé dans l'ouverture du C, détaché par un filet de fond).
"""
import base64
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

FONTS, ROOT = Path(sys.argv[1]), Path(sys.argv[2])
GRENAT, CREME, ENCRE_DOUCE = "#5F1A24", "#F8F2E9", "#574A43"


def r2(d: str) -> str:
    return re.sub(r"-?\d+\.\d+", lambda m: f"{float(m.group()):.2f}".rstrip("0").rstrip("."), d)


class Face:
    def __init__(self, file):
        self.f = TTFont(FONTS / file)
        self.gs = self.f.getGlyphSet()
        self.cmap = self.f.getBestCmap()
        self.upm = self.f["head"].unitsPerEm
        self.kern = {}
        if "GPOS" in self.f:
            for lk in self.f["GPOS"].table.LookupList.Lookup:
                for st in lk.SubTable:
                    st = getattr(st, "ExtSubTable", st)
                    if getattr(st, "Format", None) == 1 and lk.LookupType in (2, 9) and hasattr(st, "PairSet"):
                        for g1, ps in zip(st.Coverage.glyphs, st.PairSet):
                            for rec in ps.PairValueRecord:
                                v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 else 0
                                if v:
                                    self.kern[(g1, rec.SecondGlyph)] = v

    def _run(self, pen, text, size, x, y):
        s = size / self.upm
        cx, prev = 0.0, None
        for ch in text:
            g = self.cmap[ord(ch)]
            if prev is not None:
                cx += self.kern.get((prev, g), 0)
            self.gs[g].draw(TransformPen(pen, (s, 0, 0, -s, x + cx * s, y)))
            cx += self.gs[g].width
            prev = g
        return cx * s

    def path(self, text, size, x=0.0, y=0.0):
        pen = SVGPathPen(self.gs)
        w = self._run(pen, text, size, x, y)
        return r2(pen.getCommands()), w

    def bounds(self, text, size):
        bp = BoundsPen(self.gs)
        self._run(bp, text, size, 0, 0)
        return bp.bounds


med, reg = Face("Spectral-Medium.ttf"), Face("Spectral-Regular.ttf")
NOM = "Cabinet Rimbault"

# --- Logotype A : corps 23 (desktop, 182 × 18,5) ; en mobile, la largeur CSS de 158 px donne le corps 20. ----
xmin, ymin, xmax, ymax = med.bounds(NOM, 23)
LOGO_D, _ = med.path(NOM, 23, x=-xmin, y=-ymin + 0.5)
LW, LH = round(xmax - xmin + 0.5, 2), round(ymax - ymin + 1, 2)


# --- Monogramme : même construction que logotypes.py ---------------------------------------------------------
def monogramme(size, x0, y0):
    c_d, c_w = med.path("C", size, x=x0, y=y0)
    r_x = x0 + c_w * 0.66
    r_d, _ = med.path("R", size, x=r_x, y=y0)
    return c_d, r_d, size * 0.045, r_x + med.bounds("R", size)[2] - x0


cap_h = -med.bounds("CR", 100)[1] / 100
msize = 64 * 0.56 / cap_h
cb = med.bounds("C", msize)
*_, w0 = monogramme(msize, 0, 0)
mx0 = (64 - (w0 - cb[0])) / 2 - cb[0]
my0 = 32 + (msize * cap_h) / 2
MC, MR, MGAP, _ = monogramme(msize, mx0, my0)


def mono_svg(bg=GRENAT, fg=CREME):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="{bg}"/>'
            f'<path fill="{fg}" d="{MC}"/><path fill="{fg}" stroke="{bg}" stroke-width="{MGAP:.2f}" '
            f'stroke-linejoin="round" paint-order="stroke" d="{MR}"/></svg>\n')


def png(svg: str, w: int, h: int, out: Path):
    with tempfile.TemporaryDirectory() as t:
        f = Path(t) / "i.svg"
        f.write_text(svg)
        subprocess.run(["rsvg-convert", "-w", str(w), "-h", str(h), str(f), "-o", str(out)], check=True)


brand = ROOT / "src/components/brand"
brand.mkdir(parents=True, exist_ok=True)
(brand / "Logotype.tsx").write_text(f'''// Généré par scripts/illustrations/marque.py (A26) : ne pas éditer à la main.
// Logotype A : « Cabinet Rimbault » en Spectral 500 vectorisé (OFL 1.1), sans ornement.
// Grenat dans l'en-tête, crème sur le pied grenat. 182 × 18,5 px au corps 23 ; en mobile, width={{158}} (corps 20).

const D =
  "{LOGO_D}";

type LogotypeProps = {{
  tone?: "grenat" | "creme";
  width?: number;
  className?: string;
}};

export function Logotype({{ tone = "grenat", width = {LW}, className }}: LogotypeProps) {{
  const height = Math.round(((width * {LH}) / {LW}) * 100) / 100;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 {LW} {LH}"
      width={{width}}
      height={{height}}
      role="img"
      aria-label="Cabinet Rimbault"
      className={{className}}
    >
      <path fill={{tone === "creme" ? "var(--creme, {CREME})" : "var(--grenat, {GRENAT})"}} d={{D}} />
    </svg>
  );
}}
''')
(brand / "Monogram.tsx").write_text(f'''// Généré par scripts/illustrations/marque.py (A26) : ne pas éditer à la main.
// Monogramme CR crème sur grenat (Spectral 500 vectorisé). Réservé aux icônes : jamais affiché dans la page.

const C =
  "{MC}";
const R =
  "{MR}";

export function Monogram({{ size = 64, className }}: {{ size?: number; className?: string }}) {{
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={{size}}
      height={{size}}
      aria-hidden="true"
      className={{className}}
    >
      <rect width="64" height="64" fill="var(--grenat, {GRENAT})" />
      <path fill="var(--creme, {CREME})" d={{C}} />
      <path
        fill="var(--creme, {CREME})"
        stroke="var(--grenat, {GRENAT})"
        strokeWidth={{{MGAP:.2f}}}
        strokeLinejoin="round"
        paintOrder="stroke"
        d={{R}}
      />
    </svg>
  );
}}
''')
app = ROOT / "src/app"
(app / "icon.svg").write_text(mono_svg())
png(mono_svg(), 180, 180, app / "apple-icon.png")

# --- Open Graph 1200 × 630 ------------------------------------------------------------------------------------
# ILL-01 retouchée, 3:2, posée à droite sur la ligne de base (bord droit à fond perdu, comme sur l'accueil) ;
# le pavillon commence à 25 % de la largeur de l'image, ce qui laisse la colonne de gauche libre pour le texte.
ill = base64.b64encode((ROOT / "public/illustrations/ill-01.png").read_bytes()).decode()
IW = 840
IH = round(IW * 1014 / 1520)
IX, IY = 1200 - IW, 630 - IH - 6
k = 2.0  # logotype à 2× le corps 23 (46 px)
ox, oy = 72, 252
s1 = "Vente, location et estimation"
s2 = "à Asnières-sur-Seine, depuis 2009"
t1, _ = reg.path(s1, 25, x=72, y=oy + LH * k + 52)
t2, _ = reg.path(s2, 25, x=72, y=oy + LH * k + 52 + 36)
og = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 630" width="1200" height="630">'
      f'<rect width="1200" height="630" fill="{CREME}"/>'
      f'<image x="{IX}" y="{IY}" width="{IW}" height="{IH}" xlink:href="data:image/png;base64,{ill}"/>'
      f'<g transform="translate({ox} {oy}) scale({k})"><path fill="{GRENAT}" d="{LOGO_D}"/></g>'
      f'<path fill="{ENCRE_DOUCE}" d="{t1}"/><path fill="{ENCRE_DOUCE}" d="{t2}"/></svg>\n')
png(og, 1200, 630, app / "opengraph-image.png")
(app / "opengraph-image.alt.txt").write_text(
    "Cabinet Rimbault, vente, location et estimation à Asnières-sur-Seine. Dessin au trait d'une rue bordée d'un pavillon et d'un immeuble.")
subprocess.run(["npx", "biome", "check", "--write", "src/components/brand"], cwd=ROOT, check=True)  # mise en forme du dépôt
print("logotype", LW, LH, "· monogramme filet", round(MGAP, 2), "· OG ill", IW, IH, IX, IY)
