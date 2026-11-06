# Recette des variantes « Index et aperçu » et « Galerie chaude » (5/11/2026)

Périmètre : `/v/apercu` et `/v/chaude` (accueil, `/biens`, fiches `10129`, `09.345` et les autres fiches pour les données, `/le-cabinet`), servis par le serveur de démo `localhost:3310` et l'API factice (scénario `default`, puis `empty` et `n12`, puis retour à `default`).
Outils : Playwright (Chromium) et `@axe-core/playwright` (WCAG 2.1 A/AA + bonnes pratiques). Scripts dans le scratchpad de la session, aucun fichier source modifié.
Largeurs testées : 1440, 1024, 768, 390 et 320 px. Les captures sont dans ce dossier (`<variante>-<largeur>-<page>.png`).

Note : la pastille « N » visible en bas à gauche des captures est l'indicateur de développement de Next. Elle n'appartient pas aux variantes.

## Synthèse

| | Bloquant | Majeur | Mineur |
|---|---|---|---|
| Index et aperçu | 0 | 3 | 10 |
| Galerie chaude | 0 | 3 | 8 (+1 remarque) |

Ce qui est conforme dans les deux variantes :
- **Photos** : aucune teinte, aucun duotone, aucun `mix-blend-mode`, aucun voile ni pseudo-élément coloré posé sur une image. Le seul filtre est un étalonnage neutre : `contrast(0.97) brightness(1.01) saturate(0.97)` pour l'Aperçu (`socle.module.css:20`) et `brightness(0.98) contrast(1.03) saturate(0.97)` pour la Chaude. Les deux restent dans la marge de ±5 % du brief.
- **Aucune animation sur les images** : `transform: none` sur toutes les `img` et aucune animation Web en cours après le chargement. La position et la taille des photos ne changent pas quand la souris bouge ou survole. Seule l'opacité change, au survol pour l'aperçu et au clic pour les galeries.
- **Réduction du mouvement** (`prefers-reduced-motion: reduce` émulé, 1440 et 390) : aucune transition ni animation de plus de 20 ms. Aucun texte ni aucune image ne reste à opacité 0 sans défilement.
- **Pas de débordement horizontal** de 320 à 1440 px, sur toutes les pages des deux variantes, aucun texte coupé par un `overflow`.
- **Liens internes** : ils restent dans la variante. Seuls sortent `/vendre`, `/contact`, `/estimation`, `/mentions-legales`, `/honoraires` et `/confidentialite`, ce qui est voulu par le brief. La seule exception est la page 404 (voir A3 et C2).
- **Données** : elles sont cohérentes avec `e2e/fixtures/properties.json` et `details.json`. Exemples : 10129 à 644 000 €, 92,2 m², DPE D 189 kWh/m²/an, GES B 6 kg, coûts 1 150 à 1 600 € ; 09.345 à 280 000 €, DPE G 656, GES C 21 ; 09.362 à 198 000 €, « Soit 189 000 € honoraires exclus », 4,76 % TTC à la charge de l'acquéreur. La sentinelle `honoraires = -1` du 10.131 est bien traitée comme absente. Aucun « null », « undefined » ni « NaN » dans le HTML rendu. Les honoraires passent par le helper partagé `src/lib/property/fees.ts`.
- **Volumes** : la Chaude accroche correctement 12 biens (motif de 5 positions répété en miroir, voir `chaude-1440-n12-biens.png`) et un seul bien. L'Aperçu tient aussi 12 lignes, avec son mur collant sur l'accueil (`apercu-1440-n12-accueil.png`).
- **Alt** : toutes les `img` ont un attribut `alt`. Les vignettes et les doublons décoratifs ont un `alt=""`. Les photos principales sont décrites, par exemple « Appartement 5 pièces de 92,2 m² à Asnières-sur-Seine, photo 1 sur 4 ».
- **Focus visible** : un filet grenat de 1 px avec un décalage de 2 à 3 px, sur tous les liens et boutons atteints au clavier.

---

## Variante « Index et aperçu » (`/v/apercu`)

### Majeur

**A1. Page Biens : l'aperçu est hors de l'écran pendant le survol de la liste**
- Page et largeur : `/v/apercu/biens`, 1440 et 1024 (vue de 900 px de haut).
- Constat : le mur d'accrochage (y = 76 à 680) est placé **au-dessus** de la liste et n'est pas collant (`.biensMur .collant` est en `position: static`). Les lignes commencent à y = 813. Pour survoler les lignes 3 à 5, il faut faire défiler la page, et la photo sort alors de l'écran : à `scrollY = 534`, la photo désignée est en y = −328 à 17. On survole donc une ligne sans jamais voir son aperçu, alors que c'est le principe même de la variante. Preuve : `apercu-1440-2-biens-survol-derniere.png`. La maquette avait la même structure, mais dans un cadre réduit où tout tenait à l'écran.
- Fichiers : `src/variantes/apercu/index.module.css:296-305` (`.biensMur`, `.biensMur .collant`) et `src/variantes/apercu/IndexApercu.tsx:388-399` (ordre mur puis liste).
- Correction suggérée, au choix :
  - reprendre la disposition de l'accueil (liste à gauche, mur collant à droite, `position: sticky; top: 50vh`) en gardant les 6 colonnes dans une liste plus étroite ;
  - ou rendre le mur collant (`position: sticky; top: 0`, hauteur ≤ 45 vh) avec la liste qui défile dessous.

**A2. Contraste du gris secondaire insuffisant (WCAG AA)**
- Pages et largeurs : toutes les pages, toutes les largeurs (axe : 45 nœuds sur fond blanc chaud et 15 sur fond pierre).
- Constat :
  - `--gris #7a706c` sur `#f8f6f2` donne **4,46:1** pour un texte de 11 à 13 px. Cela touche les liens de navigation (Vendre, Le cabinet, Contact), le chapô, les cartels, « Bien 4 sur 5 », le libellé du menu mobile et les sous-lignes de la suite d'œuvres.
  - Sur la pierre `#ece8e1`, on tombe à **3,94:1** : « Réf. », lieu et surface du cartel au mur, compteur « 1 / 4 » de la galerie, cartel de la devanture, et le `h1` « Le cabinet ».
- Fichier : `src/variantes/apercu/socle.module.css:12`.
- Correction suggérée : `--gris: #6f6561`, qui donne 5,24:1 sur le blanc chaud et 4,64:1 sur la pierre, sans changer la teinte.

**A3. Fiche à référence inconnue : la 404 sort de la variante (commun aux deux variantes)**
- Page et largeur : `/v/apercu/biens/ZZ-404`, toutes largeurs.
- Constat : le statut 404 est correct, mais `notFound()` affiche la 404 **racine** du site existant : en-tête « Faire estimer / Menu », dessin de porte, liens « Accueil » et « Nos biens » vers le site principal, pied du site principal. On perd l'en-tête, le pied et la typographie de la variante. Voir `apercu-390-404.png`.
- Fichier : `src/app/v/apercu/biens/[reference]/page.tsx:120` ; aucun `not-found.tsx` sous `src/app/v/apercu/`.
- Correction suggérée : ajouter `src/app/v/apercu/not-found.tsx`, ou `biens/[reference]/not-found.tsx`, dans le style de la variante, avec des liens vers `/v/apercu/biens` et le téléphone. Relire au préalable `node_modules/next/dist/docs/` (fichier `not-found`).

### Mineur

**A4. Accueil sans bien (scénario `empty`), 1440**
- La moitié droite de l'écran est un mur pierre **vide** (`apercu-1440-empty-accueil.png`), ce qui donne l'impression que la page est cassée.
- La même phrase apparaît deux fois : « Aucun bien en vente en ce moment. » dans le chapô (`donnees.ts:122`), puis « Aucun bien n'est en vente en ce moment. » (`Indisponible.tsx:13`).
- Le téléphone se coupe en « 01 / 73 64 56 10 ».
- Corrections suggérées : accrocher la devanture (`Boutique`) sur le mur quand la liste est vide, garder une seule des deux phrases, et mettre `white-space: nowrap` sur `.num`, ou au moins sur le lien téléphone.

**A5. Page Biens vide : « Biens en vente 0 »**
- Fichier : `src/app/v/apercu/biens/page.tsx:24,54`.
- Correction suggérée : ne pas afficher le compteur quand `n === 0`.

**A6. Cartel du mur sur la page Biens : coupure disgracieuse**
- Constat : à 1440, la ligne se lit « 35,65 m², balcon, 6ᵉ étage sur » puis « 6 » seul à la ligne (`apercu-1440-2-biens.png`).
- Fichier : `index.module.css:307-309` (`.biensMur .cartel { width: 180px }`).
- Correction suggérée : passer la largeur à 200 ou 210 px, ou insérer des espaces insécables dans « 6ᵉ étage sur 6 ».

**A7. Fiche : la liste des caractéristiques (15 lignes) casse le vide**
- À 1440, la colonne de droite aligne 15 lignes (copropriété, lots, taxe foncière…) contre 5 dans la maquette. La description à gauche s'arrête 250 px plus haut, d'où un tunnel de filets qui alourdit l'esprit galerie.
- À 390 et 320, ces 15 lignes passent **avant** la description.
- Fichier : `src/app/v/apercu/biens/[reference]/page.tsx` (bloc « L'essentiel »).
- Correction suggérée : garder 5 ou 6 lignes clés (surface, pièces, étage, extérieur, charges) et regrouper la copropriété et la fiscalité dans un second bloc plus bas, ou dans un `<details>`. Sur mobile, mettre la description avant le tableau.

**A8. Console : avertissements LCP de `next/image`**
- Constat : « … was detected as the Largest Contentful Paint … add `loading="eager"` ».
- Où : fiche 10129 à toutes les largeurs, accueil à 768 et 320, devanture dans le scénario vide.
- Fichiers : `PhotoAccrochee.tsx:27` (la première œuvre mobile est en lazy), `GalerieMur.tsx:136` (même URL que la vignette en lazy) et `Boutique.tsx:11`.
- Correction suggérée : passer `loading="eager"` (ou `preload`, à vérifier dans la doc Next 16) à la première œuvre et à la devanture quand elle est au-dessus de la ligne de flottaison.

**A9. Menu mobile en `<details>`**
- Échap ne le referme pas, et le libellé reste « Menu » une fois ouvert (`apercu-390-menu.png`).
- Fichier : `src/variantes/apercu/EnTete.tsx:20-28`.
- Correction suggérée : un petit gestionnaire `keydown` (Échap pour fermer), et le libellé « Fermer » via `details[open] summary`.

**A10. Flèches ←/→ captées sur tout le document dès que la galerie de fiche est visible à 30 %**
- Constat : pendant la lecture de la fiche, ces flèches font défiler les photos au lieu de défiler la page horizontalement ou d'agir sur l'élément focalisé.
- Fichier : `GalerieMur.tsx:76-93`.
- Correction suggérée : n'écouter les flèches que lorsque le focus est dans la galerie (`racine.current.contains(document.activeElement)`).

**A11. Avis Google incohérents**
- Constat : `/v/apercu/le-cabinet` affiche « 4,9/5, 32 avis » (`agency.google.count`), alors que l'extrait vient de `getGoogleReviews()`, et que la Chaude et le site affichent **34 avis** (valeur Google en direct).
- Fichier : `src/app/v/apercu/le-cabinet/page.tsx:100-102`.
- Correction suggérée : prendre `avis.totalCount` et la note de `getGoogleReviews()` quand ils existent, comme `avisGoogle()` de la Chaude.

**A12. Page Biens au clavier : arrêt Tab redondant**
- Le premier arrêt après la navigation est « Voir la fiche » du cartel, qui se trouve avant la liste dans le DOM. Les flèches ↑/↓ n'y fonctionnent pas : elles ne marchent qu'une fois le focus sur une ligne.
- Correction suggérée : `tabIndex={-1}` sur ce lien, puisque la ligne fait déjà le même travail, ou placer le mur après la liste dans le DOM.

**A13. Deux `h1` dans le DOM de `/biens`**
- Il y en a un pour le bureau et un pour la suite mobile, l'un toujours en `display: none`. C'est correct pour les aides techniques, mais fragile.
- Fichier : `biens/page.tsx:23,52`.
- Correction suggérée : un seul titre, partagé par les deux mises en page.

---

## Variante « Galerie chaude » (`/v/chaude`)

### Majeur

**C1. Fiche mobile : la barre fixe « Demander une visite / Appeler » masque les mentions légales**
- Page et largeurs : `/v/chaude/biens/*`, 768, 390 et 320 (tout ce qui est sous 900 px).
- Constat : une fois en bas de page, la barre fixe (y = 786 à 832 à 390) recouvre « SAS au capital… » et « Garant financier : LLOYD'S France » (`chaude-390-fiche-bas.png`). Le pied n'a pas de marge basse pour la barre. De plus, le bouton grenat posé sur le pied grenat se confond avec lui.
  - L'Aperçu n'a pas ce défaut : son pied a `padding-bottom: 96px` à ces largeurs.
- Fichiers : `src/variantes/chaude/fiche.module.css:635-650` (`.mCta`) et le pied `src/variantes/chaude/Pied.tsx`, avec ses styles dans `base.module.css`.
- Correction suggérée : sous 900 px, ajouter une marge basse au pied quand la barre est présente, par exemple `main:has(.mCta) ~ footer { padding-bottom: calc(46px + 32px + env(safe-area-inset-bottom)); }`. On peut aussi masquer la barre quand le bloc « Visiter ce bien » ou le pied est à l'écran.

**C2. Fiche à référence inconnue : la 404 sort de la variante**
- Page et largeur : `/v/chaude/biens/ZZ-404`, toutes largeurs.
- Constat : même défaut que A3. Le `<title>` dit « Bien introuvable, galerie chaude », mais la page affichée est la 404 racine du site existant (`chaude-390-404.png`).
- Fichier : `src/app/v/chaude/biens/[reference]/page.tsx:117` ; aucun `not-found.tsx` sous `src/app/v/chaude/`.
- Correction suggérée : ajouter `src/app/v/chaude/not-found.tsx` dans le style de la variante.

**C3. Accueil 1440 : la photo principale est agrandie au-delà de sa résolution (floue)**
- Constat : la façade 09.345 n'existe qu'en **630 px** de large et elle est affichée sur 868 px CSS, soit 0,73 pixel source par pixel CSS, et environ 0,36 sur écran Retina. Elle est visiblement molle, ce qui contredit le « calme, cher » du brief (`chaude-1440-1-accueil.png`). Même problème sur la grande pièce de `/biens` (697 px source affichés sur 868 px CSS).
  - L'Aperçu, lui, affiche la même photo sur 281 px.
- Fichiers : `src/app/v/chaude/page.tsx` (choix de la photo d'accueil) et `biens.module.css` (forme `grande`).
- Correction suggérée : plafonner la largeur affichée à la largeur naturelle (`max-width` lue au chargement, comme `PhotoAccrochee` de l'Aperçu), ou choisir pour l'accueil le bien dont la première photo est la plus grande.

### Mineur

**C4. Contraste du bandeau poudré de l'accueil**
- Constat : `--gris #7d6d66` sur `--poudre #f5ece7` donne **4,24:1** (axe, 3 nœuds : adresse, « sur Google, 34 avis », « Vous vendez ? »).
- Fichier : `src/variantes/chaude/base.module.css:13`.
- Correction suggérée : `#716561`, qui donne 4,83:1.

**C5. Le `h1` de la fiche inclut le sous-titre**
- Constat : le nom accessible devient « Appartement 5 pièces, 92,2 m² 5 pièces, 2 terrasses, 2 jardins, parking et cave ».
- Fichier : `src/app/v/chaude/biens/[reference]/page.tsx:207-210`.
- Correction suggérée : sortir le `<span>` du sous-titre dans un `<p>` placé juste sous le `h1`.

**C6. Onglets : les panneaux ne sont pas atteignables au clavier**
- Constat : Tab passe directement des onglets au lien téléphone. Le modèle WAI-ARIA recommande `tabIndex={0}` sur un `tabpanel` qui ne contient aucun élément focalisable. Le reste de la navigation est conforme : flèches, Début, Fin, `aria-selected`, et le mur change de teinte en 550 ms.
- Fichier : `src/variantes/chaude/Onglets.tsx:95-101`.

**C7. Pied de page sans le lien « Confidentialité »**
- L'Aperçu et le site l'affichent.
- Fichier : `src/variantes/chaude/Pied.tsx`.

**C8. Menu mobile : Échap ne le referme pas**
- Le bouton « Menu / Fermer » et `aria-expanded` sont corrects.
- Fichier : `src/variantes/chaude/Nav.tsx:32-40`.

**C9. Fiche 09.362 : « Pièces 1 » au pluriel**
- L'Aperçu écrit bien « Pièce ».
- Fichier : le cartel de la fiche, dans `src/app/v/chaude/biens/[reference]/page.tsx`.

**C10. Onglets à 320 px**
- « Demander une visite » passe seul sur une deuxième ligne, sous les deux autres onglets.
- Correction suggérée : réduire l'écart entre onglets sous 360 px, ou raccourcir le libellé en « Visiter ».

**C11. Photos de la salle Biens : vides tant qu'elles ne sont pas chargées**
- Constat : avec 12 biens et un défilement rapide, les cadres restent vides un instant, sans fond pierre, ce qui donne des trous dans l'accrochage. C'est sans conséquence avec un défilement normal, mais un fond `--pierre` sur `.ph` éviterait ces « trous » blancs.

**C12. Avertissement LCP**
- Un avertissement LCP apparaît sur l'accueil avec 12 biens, alors que la photo y est en `eager`. Il est probablement lié à la vignette ou au doublon mobile.
- Correction suggérée : vérifier `preload` sur l'image de l'accueil.

Note : ce point ne compte pas dans le décompte, car il touche moins la qualité perçue que les autres.

---

## Fidélité à la maquette v4 (1440)

**Index et aperçu**
- L'accueil est très fidèle (`apercu-1440-1-accueil.png`) : liste à gauche, mur pierre à droite, filet grenat sous la ligne active, cartel avec le grand numéro de référence et la citation en Newsreader.
- Les écarts dégradants sont :
  - sur la page Biens, le mur hors de l'écran pendant le survol (A1) ;
  - sur la fiche, la liste de 15 lignes (A7).
- Écarts sans conséquence : les désignations sont plus génériques (« Appartement 2 pièces » au lieu de « 2 pièces, dernier étage »), car elles viennent de l'API et rien n'est inventé. Le tri suit l'API.

**Galerie chaude**
- L'accueil, la salle Biens, la fiche avec ses onglets et le cabinet au mur grenat avec passe-partout crème sont fidèles.
- Le rythme d'accrochage (grande, décalée, duo en quinconce, centre) est respecté et se répète en miroir.
- Le seul écart visible est la qualité de la grande photo (C3). Le duo, dans la maquette, associait un portrait haut et un paysage bas : ici les deux photos sont en paysage, puisque le choix dépend de la première photo de chaque bien, ce qui affaiblit un peu la quinconce.

---

## Comparaison UX (constats)

- **Trouver un bien** :
  - L'Aperçu montre les 5 biens d'un coup d'œil, sur un seul écran, avec prix et surfaces alignés en colonnes. On compare en quelques secondes, et clic ou clavier ouvrent la fiche directement.
  - La Chaude demande de faire défiler environ 3 500 px pour voir les 5 œuvres (8 350 px pour 12). La liste récapitulative n'arrive qu'en bas, avec toutefois un lien d'ancre « Liste des biens » en tête.
- **Effet galerie** :
  - La Chaude rend mieux l'accrochage d'art : tailles variées, vide généreux, cartels à côté des photos, mur grenat du cabinet. C'est la plus proche des mots du client (« aspect espacé », « galerie d'art »).
  - L'Aperçu est plus éditorial, plus « catalogue » : une seule œuvre au mur à la fois.
- **Fiche** :
  - La Chaude est plus lisible : un cartel court à côté de la photo, avec le CTA visible dès le premier écran à 1440, et des onglets qui découpent le contenu.
  - L'Aperçu montre tout d'un bloc (15 lignes), ce qui est complet mais dense.
- **Mobile** : les deux sont propres de 320 à 768 px.
  - Dans l'Aperçu, le cartel de la suite d'œuvres est plus compact : référence, désignation et prix sur une ligne.
  - Dans la Chaude, la quinconce mobile garde un peu de rythme.
  - La barre de contact de la Chaude cache le pied de page (C1).
- **Clavier** :
  - L'Aperçu a la navigation la plus riche : ↑/↓ dans l'index avec un aperçu synchronisé, et ←/→ dans la galerie.
  - La Chaude a des onglets WAI-ARIA complets.
- **Volumes** :
  - La Chaude a été pensée de 1 à 12 biens et le prouve.
  - L'Aperçu tient 12 lignes, mais son état vide laisse un demi-écran nu (A4).
