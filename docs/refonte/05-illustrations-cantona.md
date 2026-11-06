# 05 · Illustrations (Cantona)

> Phase 1 : direction, exploration et choix de piste (§1 à §5). **Phase 2 : finales, planche de contrôle et logotypes (§6 et §7), d'après la revue n° 1 de Zidane (brief §8).** **Revue n° 2 appliquée (§8 du présent doc, brief §8bis, A26 à A28) : ILL-01 retouchée, ILL-03 redessinée en SVG à la main, ILL-04 en réserve, Open Graph, logotype et icônes intégrés. 0 $.**
> Entrées : `03-design-system-pirlo.md` (§5 cadre illustrations, principe 4), `04-architecture-xavi.md` (emplacements [ILL-xx]), `01-recherche-bergkamp.md` (reco 9).
> Images : `docs/refonte/illustrations-exploration/` (phase 1), `docs/refonte/illustrations-phase2/` (phase 2), finales dans `public/illustrations/`. Logotypes : `docs/refonte/logotypes/`. Dépenses : `05-illustrations-depenses.md` (phase 2 : 0,775 $ sur 0,80 $ ; revue n° 2 : 0 $ ; cumul Cantona 0,906 $).

---

## 1. Direction illustrative

**Le carnet d'un architecte qui connaît Asnières.** Des dessins à la plume, à l'encre brune, sur la page crème du site : les maisons et les immeubles que le cabinet vend et loue, dessinés comme on relève une façade, et non photographiés comme on les vend.

Pourquoi ce choix :

1. **Loyauté.** Un dessin au trait ne se fait jamais passer pour une photo. Personne ne peut croire que « ce bien est à vendre » ou que « c'est la rue X ». Les photos du site restent les photos des biens réels, et rien d'autre.
2. **Ancrage local sans cliché.** Ni tour Eiffel ni panorama. On montre les typologies de l'ouest parisien : immeuble de rapport en brique vers 1900, pavillon en meulière, balcon en fer forgé, porte cochère. Le lieu est évoqué, jamais désigné.
3. **Cohérence avec Pirlo.** La typographie remplace l'ornement : le trait d'encre est le seul ornement accepté, et il parle la même langue que les filets de 1 px et que Spectral.
4. **Une seule chose mémorable par page.** Une grande illustration sur l'accueil, une seule en tête des autres pages, et aucune là où les photos des biens portent la page (`/biens`, fiche).

### 1.1 Règles de style (appliquées à toutes les images, sans exception)

| Règle | Valeur |
|---|---|
| Encre | Une seule encre, **#251C19** (`--encre`), appliquée en post-traitement (§4). Aucune autre couleur dans l'image. |
| Fond | Transparent dans le fichier livré. Le crème (#F8F2E9) ou le crème soutenu (#EFE6D7) vient du CSS. |
| Grenat | **Zéro grenat dans les illustrations (décision A11, validée par Zidane).** La règle de Pirlo « 10 % des traits » est retirée. Garanti par construction : les finales sont reconstruites à partir de l'opacité seule sur une encre #251C19 unique, et la planche mesure 0 pixel hors encre (§6.3). |
| Trait | Plume fine, épaisseur constante. Hachures permises seulement pour la brique et les tuiles, en densité faible. Pas d'ombre portée, pas de lavis. |
| Composition | Sujet frontal ou en légère perspective, beaucoup de réserve crème autour, sujet ancré en bas (ligne de trottoir). Asymétrie : masse à droite pour l'ouverture de l'accueil. |
| Interdits | Personnes, voitures, panneaux, enseignes, **lettres, chiffres, signatures** (l'IA en ajoute spontanément), monuments identifiables, ciel dessiné, oiseaux, soleil. |
| Cadre | Aucun cadre, aucun arrondi, aucune ombre (Pirlo §5). |
| Format livré | PNG transparent à palette, 2× la taille d'affichage maximale, servi en WebP par `next/image` (lot C, §8.8). Le SVG est réservé aux dessins à la main (ILL-03, ILL-07, logotype). |

### 1.2 Prompt de style commun (verrouillé)

À coller tel quel après la description du sujet. Seed fixe (1909) pour l'exploration ; aux finales, 3 seeds par visuel.

```
Architectural pen line drawing, strictly monochrome: one single dark brown ink (#251C19) on plain warm cream paper (#F8F2E9), single constant hairline weight, pure outlines, no colour, no fills, no hatching, no shading, no shadows, clean confident contour lines like an architect's elevation sketch, generous empty cream space around the subject, flat editorial illustration, no people, no cars, no text, no letters, no numbers, no signage, no signature
```

Ajouts par cas : `light sparse hatching on brick and roof tiles only` pour les façades de brique ; `seen frontally, ground line at the bottom, subject weighted to the right` pour l'ouverture.

---

## 2. Pistes testées (flux-schnell, 4 étapes, seed 1909, mêmes 4 sujets)

Sujets communs : (1) rue avec immeuble de rapport en brique et pavillon en meulière, 3:2 ; (2) balcon en fer forgé, 4:5 ; (3) porte cochère, 4:5 ; (4) nature morte de clés et d'une poignée en laiton sur un parquet, 1:1.

### Piste A · « Trait d'architecte » (retenue)
Fichiers : `piste-A-1.png` à `piste-A-4.png`, puis `piste-A2-ILL01/04/06/07.png` (prompt resserré).

- **Points forts.** C'est la piste la plus juste par rapport au cadre de Pirlo et la plus sérieuse. A-2 (balcon) et A-3 (porte cochère) sont presque publiables : trait net, réserve généreuse, lisible à 360 px. A2-ILL01 (rue) a la richesse attendue d'une ouverture, avec la masse à droite et le vide à gauche pour le texte. A2-ILL04 (pavillon) est très lisible.
- **Défauts constatés.** Sans la mention « strictly monochrome », le modèle colore la brique en orange (A-1) et la poignée en doré (A-4). Il ajoute aussi du texte parasite : « Clic shop » sur la vitrine en A-1 et une frise de pseudo-lettres sur l'arc en A-3. A2-ILL06 contient des passants, une voiture et des enseignes : il faut le régénérer avec un cadrage plus haut. Les natures mortes (A-4) ne tiennent pas au trait seul.
- **Correctifs.** Le prompt verrouillé (§1.2) ; le post-traitement à encre unique (§4), qui supprime toute dérive de couleur (voir `traitement-A-1-encre-sur-creme.png` et `traitement-A-3-encre-sur-creme-soutenu.png`) ; une relecture image par image pour écarter toute pseudo-lettre ; aucune nature morte.

### Piste B · « Eau-forte » (écartée)
Fichiers : `piste-B-1.png` à `piste-B-4.png`.

- **Points forts.** C'est la piste la plus « désirable » au premier regard : matière, profondeur, sentiment d'ancienneté.
- **Pourquoi elle est écartée.** (1) **Elle fabrique du texte à chaque fois** : fausses signatures en B-1, « ANE SMANTS » sur l'imposte en B-2, « Paris 1991 » et un faux cartouche en B-3. Sur un site qui affiche une carte T et un RCS, une fausse signature d'artiste est un mensonge visuel. (2) Le pastiche de planche ancienne fait antiquaire ou papeterie, pas cabinet de transaction actuel. (3) Les hachures denses deviennent une tache grise sous 400 px et entrent en concurrence avec le texte en Spectral 300. (4) Elle contredit Pirlo : ni lavis ni aplat.

### Piste C · « Sérigraphie deux tons » (écartée)
Fichiers : `piste-C-1.png` à `piste-C-4.png`.

- **Points forts.** C-3 (porte cochère) est calme et graphique, et le crème soutenu en aplat se marie bien au fond.
- **Pourquoi elle est écartée.** (1) Elle dérive vers le pêche et le saumon (C-1), hors palette. (2) Le grenat en aplat devient arbitraire (le rideau de C-2). (3) C'est le langage « illustration plate de start-up », exactement ce qui fait « site vibe codé ». (4) Elle ajoute des chiffres (« 170 » en C-1).

### Test complémentaire · recraft-v3-svg, style `line_art` (écarté)
Fichier : `test-recraft-svg-ILL01.svg`. Le vectoriel natif aurait permis de recolorer exactement, mais le style `line_art` donne un dessin de doodle enfantin (arbre en nuage, avion dessiné, traits épais et inégaux), noir pur sur blanc, sans aucune précision architecturale. Il est incompatible avec le sérieux demandé. Coût : 0,08 $ pour l'écarter définitivement.

### Verdict
**Piste A.** C'est la seule qui soit à la fois sérieuse, loyale (on ne peut pas la confondre avec une photo), conforme au cadre de Pirlo et reproductible en série grâce au prompt verrouillé et au post-traitement. Ses défauts sont mécaniques (couleur, texte parasite, personnages) et se corrigent. Ceux de B et de C tiennent au style lui-même.

---

## 3. Liste des visuels par page

« Taille affichée » = largeur CSS maximale ; le fichier est exporté en 2×. Xavi appelle les visuels avec `<Illustration name="ILL-xx" />`. Pour les visuels purement décoratifs, `alt=""` et `aria-hidden` (Xavi §7). Les textes alternatifs ci-dessous servent pour ILL-03 et ILL-07, qui portent une information, et de légende interne pour les autres.

| ID | Page · emplacement | Sujet | Ratio · taille affichée | Rôle | Alt (si informatif) / description | Production |
|---|---|---|---|---|---|---|
| **ILL-01** | Accueil · ouverture, colonnes 7 à 12, déborde jusqu'au bord droit. Mobile : sous le texte, pleine largeur | Rue de l'ouest parisien : immeuble de rapport vers 1900 à droite, coupé par le bord du cadre ; **pavillon en meulière à gauche** (pignon sur rue, chaînes d'angle et encadrements de brique, bandeau de brique, toit à deux pans en tuiles mécaniques, auvent sur la porte, grille sur muret) ; aucun véhicule, panneau ni chiffre ; réserve vide en haut à gauche | 3:2 desktop (≈ 760 × 507), recadrage 4:3 en mobile ; dérivé **Open Graph 1200 × 630** (illustration à droite, crème à gauche, logotype composé en HTML/SVG, pas par l'IA) | La seule chose mémorable de l'accueil. Dit « ici, des maisons et des appartements » sans montrer un bien | Décoratif. Description : « Dessin au trait d'une rue bordée d'un immeuble en brique et d'un pavillon en meulière. » | flux-dev : montage de deux finales encrées (pavillon ILL04c-s1909, immeuble ILL05-s1909) unifié en un seul dessin par img2img (force 0,50), `priority`. **Retouchée à 0 $ (revue n° 2)** : touffes de branchages gommées, une seule ligne de trottoir (§8.1). Open Graph livré : `src/app/opengraph-image.png` (§8.4) |
| **ILL-02** | **Réserve depuis le lot C** (Vendre reçoit ILL-09, §8.8). Ne figure plus sur l'accueil : « Nos engagements » est sans illustration | Balcon en fer forgé devant une porte-fenêtre | 4:5 · 280 × 350 | Vendre : le détail d'une façade habitée, sans montrer un bien | Décoratif | flux-dev (ILL02-s2009) |
| **ILL-03** | Accueil · « Nous trouver » ; Le cabinet · « Venir au cabinet » ; repris en Contact (colonne coordonnées, desktop) | **La devanture réelle du 117 bd Voltaire**, en **élévation frontale**, d'après `public/maquettes/devanture-provisoire.jpg` : amorce des étages (deux baies à garde-corps), corniche, **bandeau vierge**, encadrement, trumeaux carrelés, porte vitrée en retrait, vitrine, porte vitrée, soubassement carrelé | 3:4 · 360 × 480 | Faire reconnaître la vitrine. C'est le seul dessin d'un lieu réel, et il est vrai | « Dessin de la devanture du Cabinet Rimbault, 117 boulevard Voltaire, à Asnières-sur-Seine. » | **SVG dessiné à la main (A28, 0 $)** : `scripts/illustrations/ill03_devanture.py`, trait de 1,25 px en `--encre`. La version img2img de la phase 2 est refusée et retirée. Livré : `public/illustrations/ill-03.svg` (source) et `ill-03.{png,webp}` (rendu 2× exact, servi par `next/image` comme les autres). Aucun nom, chiffre ni plaque ; le nom est composé en HTML à côté (§8.2) |
| ~~ILL-04~~ | **Hors service (A27) : n'est appelée par aucune page.** C'est la même maison qu'ILL-01 | Pavillon en meulière vers 1910 | 4:5 · 400 × 500 | Réserve : fichiers conservés dans `public/illustrations/ill-04.*`, sans appel. Ne la remettre sur aucune page tant qu'ILL-01 est en ligne | Décoratif | flux-dev (ILL04c-s1909). Un pavillon **différent** pour Vendre ne serait possible qu'avec un budget accordé par l'utilisateur |
| **ILL-05** | Louer · en-tête, colonnes 8 à 12 | Immeuble de rapport en brique, 5 étages, balcons filants, vu de face | 4:5 · 400 × 500 | Louer un appartement | Décoratif | flux-dev, 3 seeds |
| **ILL-06** | Le cabinet · en-tête, pleine largeur décalée | Perspective d'une rue d'immeubles haussmanniens et de platanes, **sans passants, voitures ni enseignes**, cadrée sur les étages | **10:3 · 1200 × 360** (proposé à Xavi au lieu de 21:9 : seul ce cadrage exclut les rez-de-chaussée commerçants) | Le quartier comme décor du métier | Décoratif. **Ne pas légender « boulevard Voltaire »** : le dessin n'est pas ce boulevard | flux-dev, recadrage sur les étages (§6.2) |
| **ILL-07** | Le cabinet · « Notre secteur » | Boucle de la Seine : Asnières et les communes voisines, contours seulement | 4:5 · 400 × 500 | Montrer le secteur réel | « Carte de la boucle de la Seine : Asnières-sur-Seine et les communes voisines. » (liste en texte à côté) | **Pas d'IA** : l'essai A2-ILL07 invente une géographie. Tracé SVG à la main, simplifié d'après OpenStreetMap (mention « © contributeurs OpenStreetMap »), avec le même trait de 1,25 px en `--encre`. Noms des communes en HTML. Liste à confirmer (Xavi §8) |
| **ILL-08** | 404 (`not-found.tsx`) | Porte cochère fermée | 4:5 · 240 × 300 | Une porte fermée, sans humour forcé | Décoratif | flux-dev, arc lisse sans inscription ni frise (prompt) |
| **ILL-09** | **Vendre · en-tête, colonnes 9 à 12 (lot C)** | Pavillon en meulière (opus incertum), symétrique, toit à croupe à lucarne, deux souches, grille sur muret entre deux piliers. Différent d'ILL-01 | **≈ 4:3 · 320 × 245** (recadré sur le sujet, revue lot C tour 1 ; avant : 4:5 · 280 × 350) ; aligné en bas de l'en-tête | Vendre : une maison, sans montrer un bien | Décoratif | flux-dev img2img force 0,68 sur ILL09-s4009 (arbre gommé), §8.8 ; ton ramené à celui du lot par une courbe propre, §8.9 |

**Pages sans illustration, par choix :**
- `/biens` et la fiche : les photos des biens portent la page (Xavi §2.2, Pirlo principe 4).
- `/estimation` (tunnel) : une colonne de 640 px, on ne distrait pas pendant la saisie. Sur l'écran de confirmation, ILL-08 n'a pas sa place (porte fermée) ; on n'ajoute rien, le texte « Ce qui va se passer » suffit.
- `/honoraires`, mentions légales, confidentialité : ce sont des pages de lecture.
- `/contact` : seulement ILL-03, réutilisée et sans nouvelle génération.
- **Accueil** : ILL-01 (ouverture) et ILL-03 (nous trouver) seulement. « Nos engagements » n'a pas d'illustration (A27).

**Récapitulatif des appels (lot C)** : Accueil ILL-01 + ILL-03 · Vendre **ILL-09** (ILL-02 en réserve) · Louer ILL-05 · Le cabinet ILL-06 + ILL-03 (+ ILL-07 en attente : section « Notre secteur » en texte seul d'ici là) · Contact ILL-03 · 404 ILL-08. **ILL-04 : aucune page.** Chaque illustration n'apparaît qu'une fois par page, et aucun dessin ne montre deux fois le même bâtiment.

**Logotype et monogramme** (Pirlo §6.1 et annexe B) : ils sont **typographiques et dessinés à la main en SVG**, sans IA. **Validés en revue n° 2 (A26) et intégrés (§8.5)** : logotype A dans `src/components/brand/Logotype.tsx`, monogramme crème sur grenat dans `Monogram.tsx`, `src/app/icon.svg` et `src/app/apple-icon.png`.

Total : **6 générations IA en service** (ILL-01, 02, 05, 06, 08 ; ILL-04 en réserve), **3 dessins SVG à la main** (ILL-03, ILL-07 à venir, logotype et monogramme), **1 dérivé** (Open Graph).

---

## 4. Chaîne de production (finales, phase 2)

1. **Génération** : `node scripts/illustrations/generate.mjs <jobs.json> <dossier>`. Aucune dépendance, l'appel est sauté si le fichier existe déjà (pas de double facturation), et le script attend en cas de 429. Modèle : flux-dev à 0,025 $ (28 étapes), 2 seeds par visuel puis reprises ciblées, dans l'enveloppe de 0,80 $. **Repli flux-1.1-pro interdit sans accord de l'utilisateur.** Registre mis à jour après chaque appel.
2. **Sélection** : relecture image par image, à 100 % puis à la taille d'affichage. **Critères de rejet (brief §8, sans exception)** :
   - lettre, chiffre, **pseudo-lettre ou pseudo-écriture** (frise de signes sur l'arc comme en A-3, « Clic shop » comme en A-1, fausse signature, plaque gravée, cartouche) ;
   - personne, véhicule, panneau, enseigne, auvent de boutique lettré ;
   - **aplat noir de plus de 2 % de la surface** (mesuré : encre à plus de 85 % d'opacité qui survit à une ouverture de 2,5 px CSS) ;
   - perspective fausse, arbre en « nuage », objet au premier plan (pots, mobilier) ;
   - typologie fausse : pour ILL-01 et ILL-04, un pavillon qui n'est pas une meulière d'Île-de-France (plain-pied à croupe, cottage anglais).
3. **Encre unique** : `scripts/illustrations/ink2.py` (phase 2, remplace `ink.py`). La luminance est divisée par le « papier local » (maximum glissant sur 9 px) : lavis, ombres portées et grands aplats redeviennent papier, seuls les traits survivent. L'opacité obtenue porte une encre #251C19 unique ; la poussière (< 40 px) est retirée. Pillow, numpy, scipy, local et gratuit.
4. **Retouches** : déclarées dans `scripts/illustrations/finals.py` : `RETOUCHES` (sur la source, avant l'encrage : gommage et déplacement de blocs, revue n° 2) et `GOMMAGES` (sur l'encre), en coordonnées de la source, puis recadrage aux ratios du §3. Aucune retouche hors de ce fichier : tout est rejouable.
5. **Export** : `python3 -I scripts/illustrations/finals.py <bruts> public/illustrations <planche>` : WebP (qualité 82) + PNG transparent en 2×, dans `public/illustrations/ill-0x.{webp,png}`. Composant `src/components/illustrations/Illustration.tsx` (à écrire avec Xavi), avec `sizes` exacts et `priority` sur ILL-01 seulement.
6. **Contrôle** : planche des 7 visuels (ILL-03 comprise, rendue depuis son SVG ; ILL-04 marquée « réserve ») à leur taille réelle sur crème et sur crème soutenu, avec épaisseur de trait **mesurée** (écart maximal de 20 % entre deux visuels, sinon rejet), part d'aplat noir et pixels hors encre (§6.3).

---

## 5. Questions ouvertes pour Zidane

Réglées par la revue n° 1 : budget (enveloppe de 0,80 $), ILL-03 (A12, dessin d'après photo, bandeau vierge), grenat (A11, zéro). Restent ouvertes : la liste des communes pour ILL-07 [À CONFIRMER utilisateur] et les points du §6.5.

---

## 6. Phase 2 : finales (revue n° 1 de Zidane appliquée)

Dépense : **0,775 $ sur l'enveloppe de 0,80 $** (31 images flux-dev, détail ligne par ligne dans `05-illustrations-depenses.md`, recoupé avec `GET /v1/predictions`). Aucun appel flux-1.1-pro. Fichiers : `illustrations-phase2/` (`sources/` : bruts retenus, guides et fichiers de jobs ; `candidats/` : planches de tous les candidats ; `planche-illustrations-*.png` ; `mesures.json`).

### 6.1 Typologie meulière, écrite en toutes lettres dans le prompt (ILL-01 et ILL-04)

Ajoutée devant le prompt verrouillé du §1.2, inchangé :

```
a two-storey Ile-de-France millstone villa (pavillon en meuliere, circa 1910) with its triangular gable facing the street:
the whole facade covered with clearly outlined irregular rough millstone blocks of varied polygonal shapes (opus incertum),
every stone drawn with its own outline; brick quoins at the corners; brick arched surrounds around every window and the door;
a brick band between the floors; a steep two-sided pitched roof (not hipped) of interlocking mechanical clay tiles drawn as
fine regular rows; a small glass and wrought iron canopy (marquise) over the front door; a low millstone wall topped by a
wrought iron railing and a wrought iron gate in front
```
Pour ILL-04 s'y ajoute : `Bare ground line at the bottom, nothing in the foreground: no flower pots, no plants, no bushes, no furniture, no shutters.` Aucune image de la phase 1 ne sert de référence ; `piste-A2-ILL04` est écartée définitivement.

### 6.2 Sélection : retenus et rejetés (critères du §4.2)

| Visuel | Retenu | Rejetés et motif |
|---|---|---|
| ILL-01 | **ILL01d-s1909-p50** : montage du pavillon ILL04c-s1909 (meulière, pignon sur rue, encadrements de brique, bandeau, tuiles mécaniques, auvent, grille sur muret) et de l'immeuble ILL05-s1909 (sans son panneau, recadré), redessiné d'une seule main par img2img (force 0,50). Masse à droite, immeuble coupé par le bord, réserve en haut à gauche. Aucun véhicule, panneau ni chiffre | ILL01-s1909 (perspective de rue, plaque près de la porte), ILL01-s2009 et ILL01b-s2009 (toit **à croupe**), ILL01b-s1909 (enduit lisse, pas de meulière, pas d'auvent), ILL01b-s3009 et ILL01c-s3009 (boutique et store), ILL01c-s2009 (**store lettré « DINER »**), ILL01c-s1909 (enduit lisse, boutique avec cartouche) |
| ILL-02 | **ILL02-s2009** : balcon en fer forgé devant une porte-fenêtre | ILL02-s1909 (**fausse signature** en bas à droite) |
| ILL-03 | ~~**ILL03c-s3009-p75**~~ **(refusée en revue n° 2, A28 ; remplacée par le SVG à la main du §8.2, source conservée pour mémoire)** : dessin d'après la photo (A12), bandeau vierge, vitrine vide, porte vitrée et ses paumelles, trottoir en perspective | ILL03-s1909/s2009/s3009 (img2img sur la photo : aplats de couleur de bande dessinée, pas de trait), ILL03b-s1909 (trait gras, hachures de BD), ILL03b-s2009 (**pseudo-mot « FANE »** sur une plaque), ILL03c-s4009 (objets en vitrine, plaque numérotée sur la porte) |
| ILL-04 | **ILL04c-s1909** : meulière en appareillage irrégulier visible, chaînes d'angle et arcs de brique, bandeau, pignon, tuiles mécaniques, auvent, grille sur muret. Gommés : deux massifs d'arbres en lavis, griffures des murs latéraux et sous le trottoir | ILL04-s1909 (pots et massifs au premier plan, portail en bois, volets), ILL04-s2009 (cottage, rez-de-chaussée en brique), ILL04b-s3009 (**horloge à chiffres** dans le pignon, plaque), ILL04c-s2009 (deux portails en bois, lavis d'arbres, encre trop dense) |
| ILL-05 | **ILL05-s2009** : immeuble de rapport de face, balcons filants, mansarde, porte cochère entre deux arcades | ILL05-s1909 (**panneau de signalisation** à gauche ; l'immeuble seul a servi au montage d'ILL-01) |
| ILL-06 | **ILL06-s2009**, recadré sur les étages (0 à 461 px de la source) : les rez-de-chaussée commerçants, une signature et une vitrine lettrée sont hors cadre | ILL06-s1909 (réverbère, enseignes, jardinières), ILL06b-s1909 (bâti écrasé dans 30 % du cadre, une voiture), ILL06b-s2009 (**passants et voitures**) |
| ILL-08 | **ILL08-s2009** : porte cochère fermée, arc lisse, imposte rayonnante, sans frise ni inscription | ILL08-s1909 (écusson gravé sur le socle gauche, assimilable à un signe) |

**ILL-06 change de ratio** : 10:3 (1200 × 360) au lieu de 21:9 (1200 × 514). Aucune des quatre générations ne tient les étages seuls en 21:9. Ce recadrage est le seul qui exclut les rez-de-chaussée sans nouvelle dépense. **Xavi doit valider** l'emplacement (en-tête du Cabinet).

### 6.3 Post-traitement et mesures (planche de contrôle)

Chaîne : `ink2.py` (division par le papier local, suppression des lavis et des ombres), puis `finals.py` (gommages déclarés, recadrage, export 2×, mesures). **Un seul paramètre varie d'un visuel à l'autre : le gain d'encre**, réglé par dichotomie pour que l'épaisseur mesurée atteigne la cible de 0,74 px CSS (bornes 0,6 à 1,5). Le gain est plafonné à 1,5, parce qu'au-delà ILL-04 dépasse 2 % d'aplat noir.

Mesures sur les fichiers livrés (2×), rapportées en px CSS (`illustrations-phase2/mesures.json`) :

| Visuel | Taille CSS | Gain | Trait (px CSS) | Écart à la médiane | Aplat noir | Masse sombre > 60 % | Surface encrée | Pixels hors encre |
|---|---|---|---|---|---|---|---|---|
| ILL-01 (retouchée) | 760 × 507 | 0,68 | 0,739 | 0,0 % | 0,00 % | 0,01 % | 12,0 % | 0 |
| ILL-02 | 280 × 350 | 0,75 | 0,739 | 0,0 % | 0,00 % | 0,13 % | 7,4 % | 0 |
| ILL-03 (SVG à la main) | 360 × 480 | opacité 0,583 | 0,741 | +0,3 % | 0,00 % | 0,00 % | 6,0 % | 0 |
| ILL-04 (réserve) | 400 × 500 | 1,50 | 0,680 | −8,0 % | **1,67 %** | 4,61 % | 16,1 % | 0 |
| ILL-05 | 400 × 500 | 0,76 | 0,740 | +0,1 % | 0,00 % | 0,41 % | 12,4 % | 0 |
| ILL-06 | 1200 × 360 | 0,63 | 0,739 | 0,0 % | 0,00 % | 0,00 % | 7,1 % | 0 |
| ILL-08 | 240 × 300 | 1,33 | 0,739 | 0,0 % | 0,04 % | 0,52 % | 9,5 % | 0 |

**Mesures refaites après la revue n° 2 (30/10/2026)** : médiane 0,739 px CSS. **Écart maximal entre deux visuels : 9,0 %** (ILL-04, en réserve, contre ILL-03) ; **entre les visuels en service : 0,3 %**. Sous le seuil de 20 %. **Aplat noir : 1,67 % au plus** (ILL-04), sous 2 %. **Zéro pixel hors de l'encre #251C19**, donc zéro grenat.

Méthode : l'épaisseur est la médiane, sur toutes les lignes et colonnes, de la largeur des segments d'encre (opacité > 0,35, de 1 à 8 px, largeur sous-pixel égale à la somme des opacités). L'aplat noir est la surface d'encre à plus de 85 % d'opacité qui survit à une ouverture morphologique de 5 × 5 px en 2×, soit 2,5 px CSS d'épaisseur pleine.

Pour ILL-03, le « gain » est l'opacité du groupe SVG : le trait est dessiné à 1,25 px en #251C19, et son opacité (0,583) est réglée par la même dichotomie, sur la même mesure et la même cible que le gain d'encre des autres. Un trait de 1,25 px à pleine opacité mesure 1,25 px CSS, soit +69 % par rapport à la médiane : il aurait paru gras à côté des dessins encrés, dont le trait est un dégradé d'opacité. Sa surface encrée (6,0 %) est la plus faible du lot : c'est une élévation sans hachures, posée dans sa réserve crème.

Planches **régénérées le 30/10/2026 avec ILL-01 retouchée et la nouvelle ILL-03** (rendu 2×, 1 px CSS = 2 px, légendes de contrôle hors image) : `illustrations-phase2/planche-illustrations-creme.png` (#F8F2E9) et `illustrations-phase2/planche-illustrations-creme-soutenu.png` (#EFE6D7).

### 6.4 Relecture « pseudo-lettres » des finales

Relecture à 200 % de chaque finale. Rien de lisible ni d'assimilable à une écriture. Points examinés et conservés : la frise de denticules sous l'égout du pavillon (ILL-01, motif répété régulier), le mascaron sur la clé d'arc (ILL-05), les paumelles de la porte (ILL-03 phase 2, retirée), le petit vase sur le pilier droit (ILL-04). **Zidane doit refaire cette relecture** sur les deux planches : c'est le critère que l'IA viole le plus souvent.

### 6.5 Limites connues (à arbitrer par Zidane)

1. **ILL-01** (toujours valable après la retouche de la revue n° 2, perte acceptée par Zidane) : l'unification par img2img a lissé l'appareillage de meulière du pavillon. On lit une maison de 1910 à pignon, avec ses chaînes d'angle et ses encadrements de brique, mais les moellons ne se voient plus. Pour les retrouver, il faudrait soit un second passage à force 0,35 (0,025 $, ce qui épuiserait l'enveloppe), soit le montage brut (`sources/ill01-guide.png`), où les moellons sont visibles mais où le trait du pavillon est 1,45 fois plus fin que celui de l'immeuble. L'auvent de la porte est un petit toit à deux pans et non une marquise vitrée.
2. **ILL-04** est la plus dense du lot (surface encrée de 16 %, contre 7 à 12 % pour les autres). Son trait reste dans la tolérance, mais elle paraît plus « gravée ». Elle est seule dans l'en-tête de Vendre, donc jamais à côté d'une autre illustration.
3. ~~**ILL-03**~~ (réglé par A28 : redessinée en SVG, §8.2) a un trait plus égal, moins nerveux, à cause du guidage par contours : on reconnaît la devanture, mais la main est un peu plus « dessin technique ». Le dessin occupe tout le cadre, sans réserve crème.
4. **ILL-06** est agrandie 1,56 fois depuis la source (1536 px pour 2400 px en 2×). Le trait a été mesuré après l'agrandissement, mais le détail fin des arbres est un peu mou en Retina.
5. **ILL-07** (carte) reste à tracer à la main en SVG, une fois la liste des communes confirmée.

---

## 7. Logotype et monogramme : propositions pour la revue de Zidane

Fichiers : `docs/refonte/logotypes/*.svg`, aperçu `docs/refonte/logotypes/planche-logotypes.png`. Script : `scripts/illustrations/logotypes.py`. Lettres vectorisées depuis Spectral (google/fonts, OFL 1.1) avec fontTools, crénage GPOS appliqué. Aucune IA et aucune dépendance de police à l'affichage. Grenat #5F1A24 et crème #F8F2E9 seulement.

| Proposition | Fichier | Dessin | Taille | Mobile (160 × 24 au plus) |
|---|---|---|---|---|
| **A** · Mot-symbole simple | `logotype-A-spectral-500.svg` | « Cabinet Rimbault » en Spectral 500, sans ornement. Exactement la consigne de Pirlo (§6.8, en-tête) | 181,7 × 18,5 au corps 23 (desktop) | Corps 20 : 158 × 16. Conforme |
| **B** · Petites capitales | `logotype-B-petites-capitales.svg` | Spectral SC 500 (vraies petites capitales, majuscules initiales), interlettrage +0,06 em. Plus institutionnel (notaire, étude) sans capitales forcées | 184,9 × 17 au corps 21 | Corps 18 : 158 × 15. Conforme |
| **C** · Monogramme et nom | `logotype-C-monogramme-et-nom.svg` | Monogramme CR, filet vertical de 1 px, puis « Cabinet Rimbault » en Spectral 500 corps 19 | 203 × 25 | Ne tient pas en 160 : en mobile, on n'afficherait que le monogramme, et le nom passerait en HTML. **Non recommandé** |
| **Monogramme** | `monogramme-CR-grenat.svg`, `monogramme-CR-creme.svg` | C et R de Spectral 500 entrelacés : le R entre dans l'ouverture du C, détaché par un filet de la couleur du fond, comme un chiffre gravé. Carré de 64, angles droits, capitales à 56 % de la hauteur | 64 × 64 | Lisible à 16 px (vérifié par rendu `rsvg-convert` à 16 × 16) |

**Décision de Zidane (A26) : A et monogramme crème sur grenat validés, B et C refusés** (B : interlettrage sur petites capitales = capitales espacées interdites ; C : ne tient pas en mobile, filet décoratif). Intégration au §8.5.

**Recommandation de Cantona (phase 2, pour mémoire) : A** pour l'en-tête et le pied (le site parle au nom du cabinet, et le nom suffit), et le **monogramme crème sur grenat** pour `icon.svg` et `apple-icon.png`. B est l'alternative si Zidane veut un registre plus « étude ». Rien n'est encore intégré dans `src/` (l'actuel `src/app/icon.svg`, en Georgia sur #7f1a24, reste en place) avant la validation de Zidane.

---

## 8. Revue n° 2 appliquée (brief §8bis, A26 à A28), à 0 $

Aucun appel Replicate. Tout est rejouable :
```
python3 -I scripts/illustrations/ill03_devanture.py docs/refonte/illustrations-phase2/sources/ill-03-devanture.svg
python3 -I scripts/illustrations/finals.py docs/refonte/illustrations-phase2/sources public/illustrations docs/refonte/illustrations-phase2
python3 -I scripts/illustrations/marque.py <dossier_polices_Spectral> .
```
Ordre obligatoire : `marque.py` lit `public/illustrations/ill-01.png` pour l'Open Graph.

### 8.1 ILL-01 retouchée (`finals.py`, `RETOUCHES`)

1. **Touffes de branchages gommées** de part et d'autre du pavillon, ainsi que les herbes au pied des piliers. Les piliers de la grille, leurs chapiteaux et les chaînes d'angle sont épargnés (boîtes de gommage découpées autour d'eux, vérifiées à 400 %).
2. **Une seule ligne de trottoir** : la bordure propre au pavillon (y 765 à 784 de la source) est gommée, puis le pavillon est descendu de 19 px pour poser sur la ligne de l'immeuble, qui court sans interruption sous les deux bâtiments (x 300 à 1215 de la source). Plus aucune seconde ligne de sol.
3. Réexport et remesure : trait 0,739 px CSS (médiane du lot), aplat 0,00 %, surface encrée 12,0 % (12,4 % avant : la végétation est partie), 0 pixel hors encre. La perte de l'appareillage de meulière reste (acceptée en §8bis).

### 8.2 ILL-03 redessinée à la main (A28)

`scripts/illustrations/ill03_devanture.py` → `public/illustrations/ill-03.svg` (+ `png`/`webp` 2×). **Élévation frontale**, sans perspective, d'après la photo redressée : amorce des étages (deux baies à linteau, dormant, imposte, garde-corps à barreaudage, appui saillant), bandeau d'étage, **corniche, bandeau vierge** dans son cadre, larmier, **encadrement** et trois **trumeaux carrelés** (joints horizontaux seulement), porte vitrée en retrait à gauche (double encadrement, imposte, poignée), **vitrine** (cadre, bande haute vierge, glace avec le reflet conventionnel des dessins d'architecte), porte vitrée à droite (imposte, barre de tirage), **soubassement** carrelé, seuils, ligne de trottoir. Viewbox 360 × 480 (3:4), **réserve crème** de 52 px de part et d'autre de la façade, étages coupés à 44 px du haut. Trait de **1,25 px en #251C19** partout, opacité 0,583 réglée par mesure (§6.3). **Aucun nom, chiffre, plaque, enseigne, numéro ni horaire.**

### 8.3 ILL-04 en réserve, ILL-02 sur Vendre (A27)

Tableau du §3 mis à jour : ILL-02 devient l'en-tête de Vendre (280 × 350, colonnes 9 à 12) et quitte l'accueil ; ILL-04 n'est appelée nulle part, ses fichiers restent dans `public/illustrations/`. **Xavi** : appeler `ILL-02` dans l'en-tête de `/vendre` et ne jamais référencer `ill-04`. **Maldini** : vérifier qu'aucune page ne charge `ill-04` et que l'accueil ne charge pas `ill-02`.

### 8.4 Open Graph

`src/app/opengraph-image.png` (1200 × 630, 316 Ko) et `opengraph-image.alt.txt` (convention de fichier de Next 16, lue dans `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`). Fond crème #F8F2E9 ; ILL-01 retouchée à droite (840 × 560, posée en bas, bord droit à fond perdu comme sur l'accueil) ; à gauche, le **logotype A composé en SVG** (contours Spectral 500, grenat, corps 46) et deux lignes en Spectral 400 corps 25, `--encre-douce` : « Vente, location et estimation / à Asnières-sur-Seine, depuis 2009 » (activités et date tirées du brief et de `agency.ts`). Aucun dégradé, cadre ni ombre. Les fiches bien gardent leur photo principale comme image OG (Xavi, doc 04).

### 8.5 Logotype et monogramme intégrés (A26)

Générés par `scripts/illustrations/marque.py` (fontTools + rsvg-convert, puis mise en forme Biome) :
- `src/components/brand/Logotype.tsx` : `<Logotype tone="grenat" | "creme" width={…} />`. 181 × 18,5 px par défaut (corps 23, en-tête desktop) ; `width={158}` en mobile (corps 20, dans 160 × 24). `role="img"`, `aria-label="Cabinet Rimbault"`. Remplissage `var(--grenat)` ou `var(--creme)` (pied grenat), avec repli hexadécimal.
- `src/components/brand/Monogram.tsx` : crème sur grenat, `aria-hidden`. **Réservé aux icônes, jamais affiché dans la page** (A26).
- `src/app/icon.svg` (64 × 64, angles droits) et `src/app/apple-icon.png` (180 × 180) : même monogramme. **L'ancien `icon.svg` (Georgia sur #7f1a24) est remplacé.** Rendu à 16 × 16 vérifié : le C et le R restent distincts.
- `docs/refonte/logotypes/` reste l'archive des propositions ; B et C ne sont utilisés nulle part.

### 8.6 Planches et mesures

`illustrations-phase2/planche-illustrations-creme.png` et `planche-illustrations-creme-soutenu.png` régénérées avec ILL-01 retouchée et ILL-03 en SVG ; `mesures.json` réécrit (champ `opacite_trait_1_25px` pour ILL-03). Valeurs au §6.3.

### 8.7 Reste à faire

- **ILL-07** (carte du secteur, SVG à la main) : toujours en attente de la liste des communes. D'ici là, « Notre secteur » s'affiche en texte seul, jamais un cadre vide.
- Validation par Zidane de la planche ILL-01 + ILL-03 (§8.8) et d'ILL-09 sur Vendre.

### 8.8 Implémentation, lot C (31/10/2026)

Rejouable : `ill03_devanture.py` → `finals.py <phase2/sources> public/illustrations docs/refonte/illustrations-phase3` → `planche_ill01_ill03.py public/illustrations docs/refonte/illustrations-phase3/planche-ill01-ill03-creme.png`.

1. **ILL-03 enrichie (A35, §8ter, 0 $)** : deux graisses (masse 1,25 px, détails et hachures 0,75 px), hachures parallèles à 45° sous la corniche et le larmier, dans les embrasures des baies et des portes, sous les appuis ; corniche à trois moulures et denticules, consoles d'about en volute, appuis moulurés sur consoles, refends sur les trumeaux d'étage, panneaux et petits bois des portes ; les deux diagonales de reflet sont remplacées par trois hachures courtes dans l'angle haut gauche de la glace. Mesures : **trait 0,733 px CSS (−0,3 %), surface encrée 10,0 %** (cible 8 à 10 %), opacité du groupe 0,704, 0 aplat, 0 pixel hors encre. Planche de contrôle **ILL-01 + ILL-03 côte à côte, à taille réelle, sur crème** : `illustrations-phase3/planche-ill01-ill03-creme.png` (copie dans `captures/lot-C/`).
2. **Enveloppe de 0,40 $ (détail dans le registre)** : 0,20 $ dépensés. **ILL-09** (nouveau, 280 × 350, 4:5 ; **recadré en 320 × 245 et ton corrigé au §8.9**) : pavillon en meulière en opus incertum, symétrique, toit à croupe à lucarne, deux souches de brique, grille sur muret entre deux piliers. Différent d'ILL-01 (pignon sur rue) et c'est le seul dessin du lot où l'appareillage de meulière se lit. **Retenu pour l'en-tête de Vendre à la place d'ILL-02**, qui passe en réserve. Retouches déclarées dans `finals.py` : filet de bord, applique murale, touffes d'herbe gommées ; souches éclaircies (« eclaircit », écart au papier × 0,45). Gain plafonné à 3 pour ce seul visuel (réduction de 1,6×). Mesures : trait 0,659 px (−10,3 %), aplat 1,56 % (< 2 %), surface encrée 11,7 %. Limite : c'est le dessin le plus dense après ILL-04 (toiture foncée) ; seul dans son en-tête, il ne voisine avec aucun autre dessin. **ILL-01 inchangée** : la seconde passe ne retrouve pas les moellons.
3. **Optimisation** : chaque PNG est un PNG à palette sans perte (une encre, l'index porte l'opacité), opacité < 8/255 ramenée à 0 et 64 niveaux (écart ≤ 7/255, invisible) ; mesures prises sur les fichiers livrés. **Les `.webp` sont supprimés** : `next/image` sert du WebP depuis le PNG (une seule compression avec perte). Poids : ILL-01 267 Ko (487 avant), ILL-06 406 Ko (729), ILL-05 161 Ko (306), ILL-02 49 Ko, ILL-08 48 Ko, ILL-09 55 Ko, ILL-03 12 Ko. Dimensions = 2× la taille d'affichage maximale. Planche des 8 visuels : `illustrations-phase3/planche-illustrations-creme{,-soutenu}.png`, mesures `illustrations-phase3/mesures.json` (médiane 0,735 px, écart maximal 13,1 %).
4. **`src/components/illustrations/Illustration.tsx`** : `<Illustration name="ILL-01" | "ILL-02" | "ILL-03" | "ILL-05" | "ILL-06" | "ILL-08" | "ILL-09" className? priority? sizes? />`. ILL-04 et ILL-07 ne sont pas appelables. Alt vide et `aria-hidden` sauf ILL-03 (alt du §3). `priority` → `preload` de Next 16 (lien de préchargement dans le `<head>`), sans fondu (l'entrée d'ILL-01 est jouée par `<HomeOpening>`). Les autres sont enveloppées dans `<ImageFade>` (Iniesta) : fondu d'opacité au décodage, **et rien d'autre** (§8.9 : la réserve crème soutenu pendant l'attente est retirée, le cadre n'a jamais de fond). Sans JavaScript, image en cache ou mouvement réduit : pas de fondu. Le cadre prend la largeur du parent, plafonnée à la taille du dessin ; `className` s'applique au cadre. `sizes` par défaut : ILL-09 `320px` (§8.9), ILL-01 `(min-width: 1024px) 760px, (min-width: 768px) 50vw, 100vw`, ILL-06 `(min-width: 1280px) 1200px, 100vw`, ILL-05 `(min-width: 768px) 400px, 100vw`, sinon la largeur fixe.
5. **Marque vérifiée** : `Logotype.tsx` (A, `role="img"`, grenat et crème), `Monogram.tsx`, `icon.svg` (lisible à 16 px), `apple-icon.png` (180 × 180), `opengraph-image.png` (1200 × 630) et son alt : conformes, inchangés.

### 8.9 Revue du lot C, tour 1 : corrections (31/10/2026, 0 $)

1. **ILL-09, ton** (`finals.py`, `TONS`). Deux mesures ajoutées à `mesures.json` et à la planche pour les 8 visuels, dans le cadre du dessin (boîte des pixels d'opacité > 0,02) : `sombre_cadre_pct` (part d'opacité > 0,6) et `couverture_cadre_pct` (opacité moyenne). Courbe propre à ILL-09 : genou à 0,6 (pente 0,3 au-dessus), **toiture à 60 %** de l'encre des murs (souches exclues de la zone), flou d'encre de σ 0,7 px à 2× (le trait s'étale au lieu de noircir : c'est ce qui garde l'épaisseur mesurée quand les noirs sont écrêtés), gain plafonné à 2. Sans le flou, sous 8 % de sombre, le trait tombait à 0,50 px (−32 %, hors tolérance).

| Visuel | > 0,6 dans le cadre | Couverture | Trait |
|---|---|---|---|
| ILL-01 | 3,1 % | 12,5 % | 0,729 |
| ILL-02 (réserve) | 6,1 % | 8,5 % | 0,745 |
| ILL-03 | 6,6 % | 9,4 % | 0,733 |
| ILL-04 (réserve) | 17,7 % | 21,1 % | 0,678 |
| ILL-05 | 5,2 % | 11,0 % | 0,737 |
| ILL-06 | 0,0 % | 7,9 % | 0,737 |
| ILL-08 | 8,0 % | 12,3 % | 0,745 |
| **ILL-09 avant** | 18,2 % | 20,7 % | 0,659 |
| **ILL-09 après** | **5,8 %** (< 8) | **12,7 %** (< 16) | **0,682** (−7,2 %) |

Aplat 0 %, zéro pixel hors encre, médiane du lot 0,735 px, écart maximal 9,9 % (13,1 % avant). Les joints de la meulière, les claveaux et les chaînes d'angle restent lisibles ; la toiture passe en hachure plus claire que les murs. Les autres PNG sont inchangés à l'octet.

2. **ILL-09, cadrage** : 320 × 245 px CSS (PNG 640 × 490), ratio natif du dessin, même marge que les autres (6 % sur les côtés et en haut, 2 % sous le sol). `Illustration.tsx` : `width` 320, `height` 245, `max-w-[320px]`, `sizes` `320px`. À 320 px de large, le dessin occupe 280 × 214 px, sans débordement.
3. **Soumission à Zidane avant intégration** : `illustrations-phase3/planche-ill09-creme.png` (avant, après et ILL-01 en référence de ton, à taille réelle 2×) ; planches crème et crème soutenu des 8 visuels régénérées. Copies et captures du gabarit d'en-tête (1440, 390, 320, et pendant le chargement) dans `captures/lot-C-corrections/`.
4. **Plus de réserve crème soutenu sur les dessins** (`Illustration.tsx`) : `has-[img[data-fondu=attente]]:bg-creme-soutenu` et `transition-colors` retirés du cadre. Un dessin détouré n'a pas de bord : le rectangle n'apparaissait que pour s'effacer (animation remarquée, brief §7). La réserve reste l'affaire des photos, dont le cadre opaque demeure. Vérifié avec des images retardées de 2,5 s : fond du cadre `transparent` pendant l'attente, aucun rectangle.

