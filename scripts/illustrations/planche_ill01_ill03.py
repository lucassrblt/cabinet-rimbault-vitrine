"""Lot C (brief §8ter, A35) : planche de contrôle ILL-01 + ILL-03 côte à côte, à taille réelle, sur crème.
Usage : python3 -I scripts/illustrations/planche_ill01_ill03.py <public/illustrations> <sortie.png>
Rendu 2× (1 px CSS = 2 px) : ILL-01 en 760 × 507, ILL-03 en 360 × 480, posées sur la même ligne de base,
séparées par une gouttière de 48 px CSS, comme deux dessins d'une même série. Aucun traitement : ce sont les
fichiers livrés dans public/illustrations/.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
G = 48 * 2
a = Image.open(SRC / "ill-01.png").convert("RGBA")
b = Image.open(SRC / "ill-03.png").convert("RGBA")
H = max(a.height, b.height)
W = G + a.width + G + b.width + G
pl = Image.new("RGBA", (W, H + 2 * G + 60), "#F8F2E9")
pl.alpha_composite(a, (G, G + H - a.height))
pl.alpha_composite(b, (G + a.width + G, G + H - b.height))
try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 22)
except OSError:
    font = ImageFont.load_default()
mes = {}
m = SRC.parent.parent / "docs/refonte/illustrations-phase3/mesures.json"
if m.exists():
    mes = {r["id"]: r for r in json.load(open(m))["visuels"]}
d = ImageDraw.Draw(pl)
for x, i, size in ((G, "ill-01", "760×507"), (G + a.width + G, "ill-03", "360×480")):
    r = mes.get(i, {})
    d.text((x, G + H + 16), f"{i.upper()}  {size} px CSS · trait {r.get('trait_px_css', '?')} px · encre {r.get('encre_pct', '?')} %",
           fill="#6F6259", font=font)
OUT.parent.mkdir(parents=True, exist_ok=True)
pl.convert("RGB").save(OUT, optimize=True)
print(OUT, pl.size)
