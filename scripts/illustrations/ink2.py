"""Encre unique, version 2 (phase 2) : supprime lavis, ombres et aplats, garde le trait.
Usage : python3 -I ink2.py source.png sortie.png [--fond F8F2E9] [--fenetre 13] [--seuil 0.12] [--gain 2.2] [--min 24]
1. Luminance L, puis division par le « papier local » (maximum glissant sur --fenetre px, lissé) :
   tout ce qui est plus large que la fenêtre (lavis, ombre portée, aplat de vitre) redevient papier ;
   seuls les traits plus fins que la fenêtre survivent.
2. Encre = (1 - L/papier), coupée sous --seuil, multipliée par --gain -> opacité d'une encre #251C19.
3. Composantes connexes de moins de --min px supprimées (poussière, grain du papier généré).
Sortie : PNG transparent (le crème vient du CSS), ou aplati sur --fond pour contrôle.
Dépendances : Pillow, numpy, scipy (local, gratuit).
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

src, out = sys.argv[1], sys.argv[2]
a = sys.argv[3:]
opt = lambda k, d: type(d)(a[a.index(k) + 1]) if k in a else d
fond = a[a.index("--fond") + 1] if "--fond" in a else None
win, seuil, gain, mn = opt("--fenetre", 13), opt("--seuil", 0.12), opt("--gain", 2.2), opt("--min", 24)

L = np.asarray(Image.open(src).convert("L"), dtype=np.float32) / 255.0
paper = ndi.gaussian_filter(ndi.maximum_filter(L, size=win), win / 3)
ink = np.clip(1.0 - L / np.maximum(paper, 1e-3), 0, 1)
ink = np.clip((ink - seuil) / (1 - seuil) * gain, 0, 1)
lab, n = ndi.label(ink > 0.02)
if n:
    sizes = ndi.sum(np.ones_like(ink), lab, index=np.arange(1, n + 1))
    small = np.isin(lab, np.where(sizes < mn)[0] + 1)
    ink[small] = 0
alpha = Image.fromarray((ink * 255).astype(np.uint8))
img = Image.new("RGBA", alpha.size, (0x25, 0x1C, 0x19, 255)); img.putalpha(alpha)
if fond:
    bg = Image.new("RGBA", img.size, "#" + fond); bg.alpha_composite(img); img = bg.convert("RGB")
img.save(out, optimize=True)
