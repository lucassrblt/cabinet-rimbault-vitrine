# Brief commun — 3e passe : itérations sur « Duotone » (5/11/2026)

## Décision du client
Sur les 5 créas de la 2e passe (`docs/maquettes-2026-11-v2/`), le client **valide fortement l'ambiance « Duotone »** : `docs/maquettes-2026-11-v2/duotone.html`, captures `docs/maquettes-2026-11-v2/captures/duotone-*.png`. Lis ce fichier en entier avant de commencer : c'est la base.

Ce qu'il aime, à **garder** :
- l'**esprit galerie** : blanc chaud, grille suisse 12 colonnes, Host Grotesk petite (11–13 px), un seul élément agrandi par écran, beaucoup de vide, grenat de la devanture comme unique couleur ;
- l'index des biens en lignes fines, la sobriété, la précision typographique.

Ce qu'il **refuse** (ses mots) :
- « je ne valide pas les **animations sur les images** » : plus de couleur qui se répand sous le curseur, plus de photo flottante qui suit la souris, plus de galerie qui défile toute seule en boucle, plus de halo, plus d'inclinaison au mouvement ;
- « les animations sont **trop loufoques** », « il faut des choses qui restent **assez sérieuses**, c'est un site d'annonces immobilières » ;
- mais « il ne faut **pas** rentrer dans quelque chose de **trop statique et froid** ».

## Ce qu'on cherche
Itérer sur Duotone : garder l'esprit galerie, le rendre **sérieux, crédible et un peu plus chaleureux**, avec un mouvement **mesuré** :
- vocabulaire de mouvement autorisé : apparitions courtes en fondu/légère montée au chargement et au défilement (une fois, pas de boucle), révélation de texte ligne par ligne sobre, soulignés qui se tracent au survol, transitions douces entre états (onglets, vues index/grille, photo suivante en fondu enchaîné **au clic**), changement d'état discret au survol d'une ligne/carte (fond, filet, flèche qui glisse de quelques px), compteurs ou barres qui se remplissent une fois, défilement fluide, transition de page sobre ;
- **les photos ne bougent pas d'elles-mêmes** : pas de zoom continu, pas de parallaxe marquée, pas de masque qui suit la souris. Au plus un fondu d'apparition et un changement d'état au clic ;
- durées 200–700 ms, courbes douces, rien de rebondissant ; `prefers-reduced-motion` respecté.
- La chaleur vient de la **couleur, de la matière et du contenu** (crème, aplats grenat, grain papier très léger, une touche serif éventuelle, phrases humaines, la devanture, l'adresse), pas de l'animation.

## Contexte agence (inchangé)
- Cabinet Rimbault, agent immobilier **indépendant**, 117 boulevard Voltaire, 92600 Asnières-sur-Seine, depuis 2009, 01 73 64 56 10, avis Google 4,9/5 (32 avis).
- Devanture **rouge grenat** (#6e1a26 environ). Photo provisoire : `img/devanture.jpg` (petite, de biais).
- **Une dizaine de biens maximum**, aucun moteur de recherche ni filtre.
- Le site dit « nous » ; l'agent n'apparaît jamais en photo.
- Biens réels (photos iPhone) dans `img/` :
  - Réf. 10129 — 5 pièces, 92,2 m², 4 ch., deux terrasses + jardins, Asnières (Impressionnistes), 644 000 € — `bien-10129-1..4.jpg` (3 = jardin arboré, 2 = séjour)
  - Réf. 10.130 — 3 pièces, 59,5 m², terrasse 37,8 m², Asnières, 375 000 € — `bien-10130-2.jpg`
  - Réf. 10.131 — 2 pièces, 46,6 m², terrasse 23,6 m², Asnières, 300 000 € — `bien-10131-2.jpg`
  - Réf. 09.345 — 2 pièces dernier étage, 35,65 m², Levallois-Perret rue Collange, 280 000 €, exclusivité — `bien-09345-1.jpg` (façade), `bien-09345-2.jpg`
  - Réf. 09.362 — studio 33,16 m², balcon, Asnières Gabriel-Péri, 198 000 €, exclusivité — `bien-09362-1.jpg`
  - DPE 10129 : D (189 kWh), GES : B. **Le DPE/GES doit garder l'échelle officielle en couleurs** (obligation réglementaire), même si c'est hors palette.
- Pas de faux avis présentés comme vrais : marque-les « [avis exemple] ». N'invente pas de mentions (« honoraires inclus », secteurs, horaires) : si tu en as besoin, marque « [à confirmer] ».

## Format : planche de créas (comme la 2e passe)
- **Un seul fichier HTML autonome** : `docs/maquettes-2026-11-v3/<slug>.html`, images en `img/…` relatif. Pas de `<!doctype>`/`<html>`/`<head>`/`<body>` : commence par `<title>` (2 à 4 mots) puis `<style>`.
- 4 à 6 **mini-écrans** en cadres (desktop 1160 px mis à l'échelle, 1 ou 2 mobiles 375 px), légende d'une ligne chacun :
  1. accueil (en-tête + ouverture),
  2. les biens (index et/ou grille, avec l'état de survol),
  3. fiche bien (galerie + infos + DPE/GES + contact),
  4. mobile (accueil ou fiche),
  5. (option) section confiance / « le cabinet » / pied de page.
- En tête de planche : nom de la variante, intention en 2 phrases, palette, typos, **liste des animations** (et ce qui a été retiré par rapport à Duotone v2).
- Polices **Google Fonts uniquement** ; vanilla JS/CSS, aucune bibliothèque ; textures en CSS/SVG inline.
- `body` avec fond explicite, aucun défilement horizontal à 390 px, gouttière ≥ 16 px.
- **Vérifie avec Playwright** (installé dans `/Users/lucasrimbault/Desktop/dev/cr/cabinet-rimbault-vitrine/node_modules` ; script dans ton scratchpad, chemins en argument) à 1440 et 390 px, plus une capture d'état survolé. Captures finales dans `docs/maquettes-2026-11-v3/captures/<slug>-*.png`. Itère jusqu'à ce que ce soit irréprochable.
- Ne touche à rien d'autre dans le repo, ne commite rien, ne change pas de branche.
