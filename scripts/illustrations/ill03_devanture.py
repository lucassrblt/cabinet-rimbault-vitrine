"""ILL-03 (Cantona, revue n° 3, A35 et brief §8ter) : élévation frontale de la devanture du 117 bd Voltaire,
dessinée à la main en SVG, avec la main de gravure du lot.
Usage : python3 -I scripts/illustrations/ill03_devanture.py <fichier_svg_sortie>
D'après la photo docs/refonte/references/devanture-provisoire.jpg, redressée en élévation (aucune perspective) :
amorce des étages (deux baies à chambranle, petits bois, garde-corps, appuis moulurés sur consoles, refends sur les
trumeaux), corniche à trois moulures et denticules, consoles d'about, bandeau VIERGE, larmier, trumeaux carrelés,
porte vitrée en retrait à gauche, vitrine et porte vitrée à droite (panneaux et petits bois), soubassement carrelé,
ligne de trottoir. Aucun nom, chiffre, plaque ni enseigne.
Une seule encre #251C19 (--encre), deux graisses : contours de masse 1,25 px, détails et hachures 0,75 px.
Ombres en hachures parallèles régulières à 45° (lumière en haut à gauche, comme les autres planches) : sous la
corniche et le larmier, dans les embrasures des baies et des portes, sous les appuis. Jamais d'aplat.
Le groupe porte opacity="__OPACITE__" : finals.py règle cette opacité par mesure pour que l'épaisseur médiane
perçue rejoigne celle des finales (même calcul, même cible), puis écrit le SVG livré.
Viewbox 360 × 480 (3:4). Réserve crème : 36 px de part et d'autre de la corniche, étages coupés à 40 px du haut.
"""
import sys
from pathlib import Path

OUT = Path(sys.argv[1])
M: list[str] = []  # contours de masse, 1,25 px
D: list[str] = []  # détails et hachures, 0,75 px


def f(v: float) -> str:
    return f"{v:.2f}".rstrip("0").rstrip(".")


def ln(x1, y1, x2, y2, p=D):
    if y1 == y2:
        p.append(f"M{f(x1)} {f(y1)}H{f(x2)}")
    elif x1 == x2:
        p.append(f"M{f(x1)} {f(y1)}V{f(y2)}")
    else:
        p.append(f"M{f(x1)} {f(y1)}L{f(x2)} {f(y2)}")


def rect(x0, y0, x1, y1, p=D):
    p.append(f"M{f(x0)} {f(y0)}H{f(x1)}V{f(y1)}H{f(x0)}Z")


def hach(x0, y0, x1, y1, pas=3.8):
    """Hachures parallèles à 45° (« / »), découpées exactement dans le rectangle. Pas régulier."""
    c = x0 + y0 + pas / 2
    while c < x1 + y1:
        xa, xb = max(x0, c - y1), min(x1, c - y0)
        if xb - xa > 0.4:
            ln(xa, c - xa, xb, c - xb)
        c += pas


# Repères
X0, X1 = 52, 308  # nus de la façade
G = 436  # ligne de trottoir
HAUT = 40  # coupe des étages (la façade continue hors cadre)
BAIES = (92, 216)  # baies d'étage, 52 px de large

# --- Amorce des étages -------------------------------------------------------
ln(X0, HAUT, X0, 164, M)
ln(X1, HAUT, X1, 164, M)
# Refends sur les trumeaux d'étage (joints horizontaux creusés dans l'enduit)
for y in range(51, 160, 14):
    for a, b in ((X0, BAIES[0] - 9), (BAIES[0] + 61, BAIES[1] - 9), (BAIES[1] + 61, X1)):
        ln(a, y, b, y)

for bx in BAIES:
    R = bx + 52
    rect(bx - 10, 52, R + 10, 57, M)  # chapeau de baie (corniche de fenêtre)
    ln(bx - 8, 55, R + 8, 55)
    hach(bx - 6, 57, R + 6, 60)  # ombre portée du chapeau
    rect(bx - 6, 57, R + 6, 146)  # chambranle mouluré
    rect(bx, 63, R, 146, M)  # tableau
    hach(bx, 63, R, 68)  # embrasure : haut
    hach(bx, 68, bx + 5, 146)  # embrasure : côté gauche
    rect(bx + 5, 68, R - 2, 146)  # dormant
    ln(bx + 5, 84, R - 2, 84, M)  # traverse d'imposte
    ln(bx + 5 + (R - bx - 7) / 2, 68, bx + 5 + (R - bx - 7) / 2, 84)  # petit bois de l'imposte
    mid = bx + 5 + (R - bx - 7) / 2
    ln(mid, 84, mid, 146, M)  # battement des deux vantaux
    for xv0, xv1 in ((bx + 5, mid), (mid, R - 2)):
        rect(xv0 + 2.5, 86.5, xv1 - 2.5, 143.5)  # ouvrant
        ln(xv0 + 2.5, 104, xv1 - 2.5, 104)  # petits bois
    # Garde-corps : lisse double, barreaudage régulier, sous-lisse
    rect(bx + 2, 117, R - 2, 120)
    ln(bx + 2, 143, R - 2, 143)
    for k in range(1, 9):
        x = bx + 2 + k * (R - bx - 4) / 9
        ln(x, 120, x, 143)
    # Appui mouluré sur deux consoles
    rect(bx - 9, 146, R + 9, 150, M)
    rect(bx - 6, 150, R + 6, 153)
    for cx in (bx - 2, R - 4):
        P = D
        P.append(f"M{f(cx)} 153V158Q{f(cx + 3)} 161 {f(cx + 6)} 158V153")
    hach(bx + 4, 153, R - 4, 157)  # ombre sous l'appui

# --- Corniche à trois moulures, denticules, consoles d'about ------------------------
rect(36, 164, 324, 170, M)  # moulure haute (la plus saillante)
ln(38, 167, 322, 167)
rect(40, 170, 320, 175, M)  # moulure médiane, à denticules
for x in range(44, 318, 6):
    rect(x, 171.5, x + 3, 175)
rect(44, 175, 316, 179, M)  # moulure basse
hach(50, 179, 310, 184)  # ombre de la corniche sur le bandeau
for a, b, sens in ((38, 50, 1), (310, 322, -1)):  # consoles en volute aux deux extrémités
    ext, inn = (a, b) if sens == 1 else (b, a)
    M.append(
        f"M{ext} 179H{inn}V226H{inn - 3 * sens}C{inn - 7 * sens} 214 {ext} 207 {ext} 193Z"
    )
    cx = (a + b) / 2
    D.append(f"M{f(cx + 3)} 186A3 3 0 1 1 {f(cx - 3)} 186A3 3 0 1 1 {f(cx + 3)} 186Z")
    ln(cx, 192, cx, 218)

# --- Bandeau (vierge) et larmier ---------------------------------------------
rect(50, 179, 310, 226, M)
rect(56, 187, 304, 220)  # cadre mouluré, laissé vide
rect(46, 226, 314, 231, M)  # larmier
ln(48, 228.5, 312, 228.5)
hach(50, 231, 310, 235)  # ombre du larmier

# --- Trumeaux carrelés ------------------------------------------------------------
TRUMEAUX = [(X0, 76), (124, 148), (288, X1)]
for a, b in TRUMEAUX:
    rect(a, 235, b, G, M)
    for y in range(249, 422, 14):  # carreaux de 14 px (comme sur la photo), joints à la plume fine
        ln(a, y, b, y)
    ln((a + b) / 2, 235, (a + b) / 2, 422)
    rect(a, 422, b, G)  # plinthe
    ln(a, 422, b, 422, M)
ln(X0, 231, X0, 235, M)
ln(X1, 231, X1, 235, M)

# --- Baie de gauche : porte vitrée en retrait --------------------------------------
rect(76, 235, 124, G, M)  # encadrement
hach(76, 235, 124, 241)  # embrasure : haut
hach(76, 241, 81, 432)  # embrasure : côté gauche
rect(81, 241, 120, 432)  # dormant
rect(84, 244, 117, 259)  # imposte vitrée
ln(100.5, 244, 100.5, 259)
ln(81, 262, 120, 262, M)  # traverse
rect(86, 266, 115, 428, M)  # vantail
rect(90.5, 270.5, 110.5, 372)  # vitrage
for y in (304, 338):  # petits bois
    ln(90.5, y, 110.5, y)
rect(90.5, 378, 110.5, 423)  # panneau bas
rect(93.5, 381, 107.5, 420)
ln(112.5, 330, 112.5, 346, M)  # poignée
ln(78, 432, 122, 432)  # seuil

# --- Vitrine ---------------------------------------------------------------------
rect(148, 235, 246, 414, M)  # cadre
hach(148, 235, 246, 240)  # embrasure : haut
hach(148, 240, 152, 410)  # embrasure : côté gauche
rect(152, 240, 242, 252)  # bande haute, vierge
rect(152, 255, 242, 410)  # glace
for d in (16, 24, 32):  # reflet : trois hachures courtes dans l'angle haut gauche (convention d'architecte)
    c = 152 + 255 + d
    ln(152 + 5, c - 157, c - 260, 255 + 5)
rect(145, 410, 249, 414, M)  # appui de la vitrine
hach(150, 414, 244, 418)  # ombre sous l'appui
rect(148, 418, 246, G)  # soubassement carrelé
for x in range(162, 246, 14):
    ln(x, 418, x, G)

# --- Porte vitrée de droite ---------------------------------------------------------
rect(246, 235, 288, G, M)  # dormant
hach(246, 235, 288, 240)  # embrasure : haut
hach(246, 240, 250, 432)  # embrasure : côté gauche
rect(250, 240, 284, 252)  # imposte, vierge
ln(267, 240, 267, 252)
rect(250, 255, 284, 432, M)  # vantail
rect(255, 260, 279, 372)  # vitrage
for y in (297, 334):  # petits bois
    ln(255, y, 279, y)
rect(255, 378, 279, 426)  # panneau bas
rect(258, 381, 276, 423)
ln(281.5, 318, 281.5, 356, M)  # barre de tirage, sur le montant
ln(279, 322, 281.5, 322)
ln(279, 352, 281.5, 352)
ln(248, 432, 286, 432)  # seuil

# --- Trottoir -----------------------------------------------------------------
ln(24, G, 336, G, M)

svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 480" width="360" height="480">'
    '<g fill="none" stroke="#251C19" stroke-linejoin="miter" opacity="__OPACITE__">'
    f'<path stroke-width="1.25" stroke-linecap="square" d="{"".join(M)}"/>'
    f'<path stroke-width="0.75" stroke-linecap="butt" d="{"".join(D)}"/>'
    "</g></svg>\n"
)
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(svg)
print(OUT, len(M), "contours de masse,", len(D), "détails et hachures")
