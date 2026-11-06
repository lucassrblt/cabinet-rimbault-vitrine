"""Ramène une illustration générée à la palette exacte du site (gratuit, local).
Usage : python3 -I ink.py source.png sortie.png [--fond F8F2E9] [--seuil 0.18]
- La luminance devient l'opacité d'une encre unique #251C19 (toute couleur parasite disparaît).
- Sortie : PNG à fond transparent (le crème vient du CSS), ou aplati sur --fond pour contrôle visuel.
"""
import sys
from PIL import Image, ImageOps
src, out = sys.argv[1], sys.argv[2]
args = sys.argv[3:]
fond = args[args.index("--fond") + 1] if "--fond" in args else None
seuil = float(args[args.index("--seuil") + 1]) if "--seuil" in args else 0.18
g = ImageOps.autocontrast(Image.open(src).convert("L"), cutoff=1)
# encre = 1 - luminance ; on coupe le voile du papier sous le seuil
lut = [0 if (1 - v / 255) < seuil else min(255, int(((1 - v / 255) - seuil) / (1 - seuil) * 255 * 1.15)) for v in range(256)]
alpha = g.point(lut)
ink = Image.new("RGBA", g.size, (0x25, 0x1C, 0x19, 255)); ink.putalpha(alpha)
if fond:
    bg = Image.new("RGBA", g.size, "#" + fond); bg.alpha_composite(ink); ink = bg.convert("RGB")
ink.save(out, optimize=True)
