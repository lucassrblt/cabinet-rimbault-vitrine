# Brief commun — 2e passe de créas (5/11/2026)

## Le client a rejeté la 1re passe
Les 4 directions de `docs/maquettes-2026-11/` (A Devanture, B Carnet de quartier, C Sélection, D Maison du Nord) ont **toutes** été refusées. Ses mots :
- « manquent de **modernité** et de **simplicité** » ;
- « **beaucoup de gros texte, peu d'espace** » ;
- il veut « quelque chose de **plus aéré** qui **joue sur les couleurs, les textures et les animations** » ;
- « il faut vraiment que cela soit un **beau site** pour donner de la **crédibilité** à l'agence ».

Regarde les captures de la 1re passe pour savoir ce qu'il ne faut PAS refaire :
`/private/tmp/claude-501/-Users-lucasrimbault--claude-spares-spare-kMd7ly/fc124e20-3417-4c54-961b-534095ce5b5f/scratchpad/v4/{a,b,c,d}-1440-00.png`

Donc, à l'opposé de la 1re passe :
- **Typographie petite à moyenne**, peu de mots, beaucoup de vide. Pas de nom du cabinet en géant, pas de titres de 100 px, pas de paragraphes.
- **Modernité** : niveau d'un site de studio d'architecture ou de marque premium de 2025-2026 (pense aux sites primés Awwwards / Godly / Siteinspire), pas une agence immobilière classique ni une revue papier.
- **Couleur, texture, mouvement** sont les vrais sujets : dégradés, grain, matières, aplats qui changent, transitions, survols, apparitions, défilements soignés.
- Sobriété ≠ fadeur : chaque écran doit avoir un détail qui fait « waouh, c'est travaillé ».

## Contexte agence (inchangé)
- Cabinet Rimbault, agent immobilier **indépendant**, 117 boulevard Voltaire, 92600 Asnières-sur-Seine, depuis 2009, 01 73 64 56 10, avis Google 4,9/5 (32 avis).
- **La devanture est rouge grenat** : le grenat doit être présent et reconnaissable (teinte de base autour de #6e1a26, libre à toi de décliner une gamme). Photo provisoire de la devanture : `img/devanture.jpg` (petite, de biais).
- **Une dizaine de biens maximum**, aucun moteur de recherche ni filtre.
- Le site dit « nous » ; l'agent n'apparaît jamais en photo.
- Biens réels (photos iPhone amateurs, à valoriser par le traitement) — images disponibles dans `img/` :
  - Réf. 10129 — 5 pièces, 92,2 m², 4 ch., deux terrasses + jardins, Asnières (Impressionnistes), 644 000 € — `bien-10129-1..4.jpg` (3 = jardin arboré, 2 = séjour)
  - Réf. 10.130 — 3 pièces, 59,5 m², terrasse 37,8 m², Asnières, 375 000 € — `bien-10130-2.jpg`
  - Réf. 10.131 — 2 pièces, 46,6 m², terrasse 23,6 m², Asnières, 300 000 € — `bien-10131-2.jpg`
  - Réf. 09.345 — 2 pièces dernier étage, 35,65 m², Levallois-Perret rue Collange, 280 000 €, exclusivité — `bien-09345-1.jpg` (façade haussmannienne), `bien-09345-2.jpg`
  - Réf. 09.362 — studio 33,16 m², balcon, Asnières Gabriel-Péri, 198 000 €, exclusivité — `bien-09362-1.jpg`
  - DPE du 10129 : D (189 kWh), GES : B.
- Pas de faux avis présentés comme vrais : si tu montres un avis, marque-le « [avis exemple] ».

## Format demandé : des créas, pas des pages
- **Un seul fichier HTML autonome** par direction, dans `docs/maquettes-2026-11-v2/<slug>.html`, images en chemin relatif `img/…`.
- C'est une **planche de créas** : 4 à 6 **mini-écrans** présentés comme des cadres (navigateur desktop réduit ~1100–1200 px de large, et 1 ou 2 écrans mobile ~375 px) posés sur un fond neutre, chacun avec une légende d'une ligne. Pas de site complet.
- Mini-écrans attendus :
  1. ouverture de l'accueil (en-tête + hero),
  2. présentation des biens (liste ou carte de bien, avec état de survol),
  3. un extrait de fiche bien (galerie + infos clés),
  4. un écran mobile,
  5. (option) un détail signature : transition, curseur, texture, micro-interaction, pied de page…
- **Les animations doivent être réelles et jouer dans la page** (CSS/JS) : apparitions, survols, transitions de couleur, défilement interne au cadre, boucles discrètes. Respecte `prefers-reduced-motion`.
- En haut de la planche : nom de la direction, une phrase d'intention, palette (pastilles hex), typographies, et la liste des animations.
- Contraintes techniques (page publiée comme artefact claude.ai) :
  - polices **uniquement Google Fonts** ;
  - scripts externes **uniquement** depuis cdnjs.cloudflare.com, cdn.jsdelivr.net/npm, unpkg.com avec **version exacte** (ex. `gsap@3.12.5` sur cdnjs) — le vanilla JS/CSS est préféré ;
  - textures en CSS ou SVG inline (feTurbulence, gradients, masques), pas d'images externes ;
  - `<title>` de 2 à 4 mots, `body` avec fond explicite, aucun défilement horizontal à 390 px, gouttière ≥ 16 px.
- **Vérifie le rendu** avec Playwright (installé dans `/Users/lucasrimbault/Desktop/dev/cr/cabinet-rimbault-vitrine/node_modules` ; script dans ton scratchpad, chemins en argument) à 1440 et 390 px, plus une capture pendant une animation/un survol. Itère jusqu'à ce que ce soit vraiment beau. Garde tes captures finales dans `docs/maquettes-2026-11-v2/captures/<slug>-*.png`.
- Ne touche à rien d'autre dans le repo, ne commite rien, ne change pas de branche.
