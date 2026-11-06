# Brief commun — 4e passe : la galerie d'art (5/11/2026)

## Où on en est
3e passe (`docs/maquettes-2026-11-v3/`, captures dans `captures/`) : 4 variantes de la direction « Duotone ». Le client retient **deux variantes à approfondir** :
- **Galerie chaude** : `docs/maquettes-2026-11-v3/chaude.html` ;
- **Index et aperçu** : `docs/maquettes-2026-11-v3/apercu.html`.
Lis le fichier de ta variante **en entier** avant de commencer, et regarde ses captures (`captures/chaude-*.png` ou `captures/apercu-*.png`). Regarde aussi l'autre variante : tu peux lui emprunter une bonne idée.

## Ce que le client dit (ses mots)
- « J'aime beaucoup le **style galerie** », « j'aime l'**aspect espacé** de la galerie », « cela doit rendre un peu comme une **galerie d'art** ».
- « Tu peux **retirer le duotone et l'utilisation du rouge sur les photos**, je ne veux pas de ça. »

Donc, **règle absolue** : les photos sont montrées **en vraie couleur, sans aucune teinte grenat** — pas de duotone, pas de filtre SVG de couleur, pas de voile ou de dégradé rouge/rose posé dessus, pas de `mix-blend-mode` coloré. Au plus un étalonnage **neutre** très léger en CSS (contraste/luminosité/saturation à ±5 %) pour calmer les blancs brûlés. Le grenat reste la couleur de la marque, mais **autour** des images (typo, filets, aplats, pied de page), jamais **sur** elles. La photo de la devanture aussi en vraie couleur.

Décisions antérieures toujours valables (3e passe) :
- **pas d'animation sur les images** : elles ne bougent pas d'elles-mêmes, rien ne suit la souris, pas de zoom, pas de défilement automatique ; au plus un fondu d'apparition et un fondu enchaîné **au clic** ;
- mouvement mesuré (200–700 ms, courbes douces, une fois), sérieux mais **ni statique ni froid** ; `prefers-reduced-motion` respecté ;
- DPE/GES sur **l'échelle officielle actuelle (2021)** : DPE vert → rouge (A #009C6D, B #52B153, C #78BD76, D #F4E70F, E #F0B50F, F #EB8235, G #D7221F) et GES en **violets** (A #F6EDFD, B #E4C7FB, C #D4A9F6, D #CB95F3, E #BA72EF, F #A74DEB, G #8A19DF) ;
- typo petite (Host Grotesk ou équivalent, 11–13 px), un seul élément agrandi par écran, une touche serif possible (Newsreader) si elle sert ;
- aucune information inventée : « [à confirmer] », avis « [avis exemple] ».

## L'esprit « galerie d'art » à atteindre
Pense à un site de galerie contemporaine ou de maison d'édition d'art (accrochage, white cube) appliqué à un cabinet immobilier :
- **le vide est la matière principale** : marges très généreuses, une image respire seule sur un mur, peu d'éléments par écran ;
- **accrochage** : les photos sont des œuvres — tailles variées, alignements précis, rythmes (une grande, deux petites décalées…), jamais une grille de cartes serrée ;
- **cartels** : petites légendes sobres à côté ou sous l'image (réf., titre du bien, surface, quartier, prix), comme à côté d'une œuvre ;
- **murs** : fond blanc chaud / crème / gris pierre très pâle ; le grenat apparaît en aplats ou en typographie, avec parcimonie ;
- **sérieux, calme, cher** — mais chaleureux grâce à la lumière des photos, aux tons du mur, à la voix du cabinet.

## Contexte agence (inchangé)
- Cabinet Rimbault, agent immobilier **indépendant**, 117 boulevard Voltaire, 92600 Asnières-sur-Seine, depuis 2009, 01 73 64 56 10, avis Google 4,9/5 (32 avis).
- Devanture **rouge grenat** (#6e1a26). Photo provisoire : `img/devanture.jpg` (petite, de biais).
- **Une dizaine de biens maximum**, aucun moteur de recherche ni filtre. Le site dit « nous » ; l'agent n'apparaît jamais en photo.
- Biens réels (photos iPhone) dans `img/` :
  - Réf. 10129 — 5 pièces, 92,2 m², 4 ch., deux terrasses + jardins, Asnières (Impressionnistes), 644 000 € — `bien-10129-1..4.jpg` (3 = jardin arboré, 2 = séjour)
  - Réf. 10.130 — 3 pièces, 59,5 m², terrasse 37,8 m², Asnières, 375 000 € — `bien-10130-2.jpg`
  - Réf. 10.131 — 2 pièces, 46,6 m², terrasse 23,6 m², Asnières, 300 000 € — `bien-10131-2.jpg`
  - Réf. 09.345 — 2 pièces dernier étage, 35,65 m², Levallois-Perret rue Collange, 280 000 €, exclusivité — `bien-09345-1.jpg` (façade), `bien-09345-2.jpg`
  - Réf. 09.362 — studio 33,16 m², balcon, Asnières Gabriel-Péri, 198 000 €, exclusivité — `bien-09362-1.jpg`
  - DPE 10129 : D (189 kWh/m²/an), GES : B.

## Format : planche de créas
- **Un seul fichier HTML autonome** : `docs/maquettes-2026-11-v4/<slug>.html`, images en `img/…` relatif. Pas de `<!doctype>`/`<html>`/`<head>`/`<body>` : commence par `<title>` (2 à 4 mots) puis `<style>`.
- 5 ou 6 **mini-écrans** en cadres (desktop 1160 px mis à l'échelle, 1 ou 2 mobiles 375 px), légende d'une ligne chacun : accueil, les biens, fiche bien, le cabinet + pied de page, mobile(s). Les écrans peuvent être plus hauts qu'avant (défilement interne au cadre) pour montrer l'espace.
- En tête de planche : nom, intention en 2 phrases, palette, typos, animations, ce qui a changé depuis la 3e passe.
- Polices Google Fonts uniquement ; vanilla JS/CSS ; textures en CSS/SVG inline. `body` avec fond explicite, aucun défilement horizontal à 390 px, gouttière ≥ 16 px.
- **Vérifie avec Playwright** (installé dans `/Users/lucasrimbault/Desktop/dev/cr/cabinet-rimbault-vitrine/node_modules` ; script dans ton scratchpad, chemins en argument ; enveloppe le fichier dans un doctype pour le rendu) à 1440 et 390 px + un état survolé. Captures finales dans `docs/maquettes-2026-11-v4/captures/<slug>-*.png`. **Contrôle explicitement qu'aucune photo n'a de teinte rouge.** Itère jusqu'à ce que ce soit irréprochable.
- Ne touche à rien d'autre dans le repo, ne commite rien, ne change pas de branche.
