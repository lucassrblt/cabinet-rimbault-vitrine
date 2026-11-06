# 03 — Design system (Pirlo)

> Phase de définition, sans implémentation. Sources : recherche de Bergkamp (`01-recherche-bergkamp.md`), données réelles et contraintes de Maldini (`02-donnees-et-tests-maldini.md`), `notes.txt`, `src/lib/agency.ts`, échelle DPE/GES de l'admin (`cabinet-rimbault-admin/src/lib/energy-labels/scale.ts`).
> Planche de référence : `docs/refonte/planche-pirlo.html`. Captures desktop 1440 px et mobile 390 px (@2x) : `docs/refonte/captures/planche-pirlo-*.png`, plus les en-têtes seuls à 1440, 1024, 390 et 320 px (`planche-pirlo-*-entete.png`) et l'en-tête mobile collé après défilement (`planche-pirlo-mobile-entete-collant.png`, `planche-pirlo-mobile-320-entete-collant.png`).
> **Révision 2 (après revue de Zidane)** : document aligné sur le brief `00-brief-refonte-zidane.md` (arbitrages A2, A3, A4, A5, A7, A8, A11, A16 et §7). En cas d'écart, le brief l'emporte. Pirlo porte aussi l'implémentation des lots P (design system), 2 (biens) et 6 (cabinet et contact).
> **Révision 3 (après revue n° 2 de Zidane)** : arbitrages A19 (bouton d'en-tête secondaire compact, §6.1, §6.8, §6.9), A20 (pied de page, §6.10), A21 (grille des biens, §6.5) et A22 (badge d'archive sans année, §6.4) intégrés ; §10 précise que Pirlo (lot P) écrit `globals.css` et `fonts.ts`. Planche et captures régénérées.
> **Révision 4 (revue n° 3 et revue du lot P)** : A29 (§6.7), A30 (§4.4), A31 (§2.2), A32 (§6.6, planche), A36 (§6.2, trait de navigation en `::after`, planche) ; annexe B point 1 clos.
> Tous les contrastes ont été **calculés** avec la formule de luminance relative de WCAG 2.2. Le script est reproduit en annexe A.

---

## 1. Direction artistique

**En une phrase.** Un cabinet de quartier qui écrit comme un notaire et compose comme un éditeur : une page crème, une encre brune presque noire, un grenat employé comme une signature, et une typographie qui fait tout le travail, sans aucun effet.

**Cinq principes non négociables**

1. **Le grenat signe, il ne décore pas.** On le trouve sur le bouton principal, la page active, le logotype, les liens dans le texte et le pied de page, et nulle part ailleurs. Hors pied de page, il occupe 3 % de la surface au plus. Un seul bouton grenat par écran, et il appartient toujours au contenu de la page, jamais à l'en-tête (brief A19).
2. **La typographie remplace l'ornement.** Il n'y a ni icône décorative, ni pictogramme de métier, ni dégradé, ni ombre. La hiérarchie vient des familles (serif pour lire, sans-serif pour agir), des graisses, des tailles et du blanc.
3. **Tout ce qui est affiché est vrai et vérifiable.** Prix, honoraires, copropriété, DPE/GES, avis Google (4,9 sur 32 avis), « depuis 2009 », adresse. Jamais de chiffre inventé, de bloc vide ni de faux contenu. Les mentions légales sont composées comme du contenu, en 13 px au moins.
4. **Une seule chose mémorable par page.** Sur l'accueil, ce sont les illustrations au trait de Cantona. Sur une fiche, ce sont les photos du bien. Tout le reste reste discipliné : alignement à gauche, filets fins, rythme régulier.
5. **Pensé d'abord pour le pouce et le clavier.** Cibles de 48 px, focus visible partout, libellés toujours au-dessus des champs, aucun contenu qui dépende du survol, `prefers-reduced-motion` respecté.

**Ce qui nous distingue des références voisines** (voir Bergkamp §1)
- *Building Partners* (#971848, framboise, avec une IvyPresto italique dans chaque titre) : notre grenat est plus brun et plus sombre (§2), et nous n'utilisons **jamais** d'italique dans les titres.
- *Krug* (#5e0027, prune) : même usage rare du grenat, mais le nôtre tire vers le rouge-brun plutôt que vers le violet.
- *Les sites de template* (Modelo, Netty) : pas de moteur, pas de tuiles, pas de capitales espacées, pas de Montserrat ni de Quicksand.

---

## 2. Couleurs

### 2.1 Jetons

| Jeton | Hex | Rôle | Interdit |
|---|---|---|---|
| `--grenat` | **#5F1A24** | Bouton principal (un par écran, dans le contenu, A19), lien actif de navigation, liens dans le texte, logotype, fond du pied de page, option cochée du tunnel | Texte courant, titres de section, badges, icônes décoratives, fonds de section (hors pied) |
| `--grenat-fonce` | #47121A | Survol et appui du bouton principal | Tout autre usage |
| `--grenat-pale` | #F0E2DC | `::selection`, fond d'une option survolée (facultatif) | Aplat de section, fond de carte |
| `--grenat-sur-fond` | #D8BFB8 | Intertitres et mentions **sur** le pied grenat | Sur fond crème (contraste insuffisant) |
| `--creme` | **#F8F2E9** | Fond de toutes les pages, fond du menu mobile, texte sur grenat | — |
| `--creme-soutenu` | #EFE6D7 | Section alternée (une sur trois au plus), fond des illustrations, réserve de photo absente, état désactivé, badge « Vendu » | Fond d'un champ |
| `--lait` | #FDFAF5 | Intérieur des champs, des options et du cadre du tunnel (desktop) | Fond de page (trop blanc à côté du crème) |
| `--encre` | #251C19 | Texte courant, titres, bouton secondaire, focus | — |
| `--encre-douce` | #574A43 | Chapôs, texte secondaire, libellés des lignes de données | — |
| `--gris` | #6F6259 | Aides de champ, références de biens, mentions, désactivé | Texte de moins de 13 px |
| `--filet` | #DED3C3 | Séparateurs décoratifs (lignes de listes, bas d'en-tête) | Bordure de champ (ratio insuffisant) |
| `--filet-fort` | #8C7D70 | Bordures de champs, d'options et de radios (exigence 3:1 de WCAG 1.4.11) | Texte |
| `--erreur` | #9A3A22 | Message et bordure d'erreur, toujours accompagnés d'une icône et d'un texte | Tout autre usage |
| `--succes` | #3D5A44 | Coche de l'écran de confirmation du tunnel, et seulement là | — |

**Pourquoi #5F1A24.** Le grenat est pris entre le #5e0027 de Krug (trop violet) et les rouge-brun #6b1e2a et #5a1a24 proposés par Bergkamp. Sa teinte (environ 352°) est **rouge** et non framboise ou prune. Sa luminosité est basse (L* ≈ 21), ce qui lui donne 11,4:1 sur le crème : il peut porter du texte. Il reste très loin du #971848 de Building Partners, plus clair, plus saturé et rose. Il ne contient pas de brun-orangé, pour ne pas glisser vers le « vin et spiritueux » (Bollinger), et aucun or ne l'accompagne.

**Pourquoi #F8F2E9.** Ce crème est dans la fourchette de Bergkamp (#f7f2ea à #fbf7f3). Il est assez rosé-chaud pour s'accorder au grenat et assez clair pour ne pas faire « papier jauni ». Il s'écarte volontairement du #F4F1EA, devenu un cliché des pages générées, plus gris et plus terne. Le **lait** (#FDFAF5) permet aux champs de se détacher du fond sans blanc pur. Le **crème soutenu** (#EFE6D7) sert à alterner les sections sans filet.

**Neutres teintés.** L'encre, l'encre douce, le gris et les filets sont tous construits sur la même teinte brun-rouge (environ 15 à 25°). Un gris neutre (#666) paraîtrait verdâtre sur le crème. Aucun noir pur, aucun blanc pur dans l'interface. Seules les photos et les étiquettes énergie en contiennent.

**Étiquettes énergie.** Les seules autres couleurs autorisées sur le site sont celles des échelles DPE et GES officielles, définies **uniquement** dans `scale.ts` (copie vitrine : `src/lib/energy-scale.ts`). En production, on affiche les SVG générés par l'admin (`dpeImageUrl`, `gesImageUrl`). Ne jamais les retoucher.

### 2.2 Proportions (page type, hors photos)

| Crème | Encre (texte, traits) | Crème soutenu | Grenat |
|---|---|---|---|
| ~78 % | ~14 % | ~5 % | ~3 % (le pied de page grenat s'ajoute en fin de page) |

Le pied de page est le **seul** aplat grenat du site. La page s'y termine comme on signe une lettre. Aucune autre section n'est grenat. L'accueil ne se termine par aucun bloc d'estimation (brief A31) : sa seule section en crème soutenu est « Ce que disent nos clients ».

### 2.3 Contrastes mesurés (WCAG 2.2, AA = 4,5:1 pour le texte et 3:1 pour le grand texte et les composants)

| Premier plan | Fond | Ratio | Verdict / usage |
|---|---|---|---|
| Encre #251C19 | Crème #F8F2E9 | **14,99:1** | AAA, tout texte |
| Encre | Crème soutenu #EFE6D7 | 13,48:1 | AAA |
| Encre | Lait #FDFAF5 | 16,02:1 | AAA |
| Encre douce #574A43 | Crème | 7,65:1 | AAA |
| Encre douce | Crème soutenu | 6,88:1 | AA (AAA ≥ 18,66 px) |
| Gris #6F6259 | Crème | 5,29:1 | AA |
| Gris | Crème soutenu | 4,76:1 | AA, seuil le plus bas du système |
| Gris | Lait | 5,65:1 | AA |
| Grenat #5F1A24 | Crème | **11,37:1** | AAA, liens et texte |
| Grenat | Lait | 12,15:1 | AAA |
| Crème | Grenat | 11,37:1 | AAA, bouton principal, pied |
| Crème | Grenat profond #47121A | 13,78:1 | AAA, survol du bouton |
| Rosé #D8BFB8 | Grenat | 7,27:1 | AAA, mentions du pied |
| Erreur #9A3A22 | Crème / Lait | 6,28:1 / 6,72:1 | AA |
| Succès #3D5A44 | Crème | 6,88:1 | AA |
| Filet fort #8C7D70 | Crème / Lait | 3,57:1 / 3,82:1 | ≥ 3:1, bordures de composants |
| Filet #DED3C3 | Crème | 1,33:1 | **Décoratif seulement** |

Règle à retenir : aucun texte plus clair que `--gris`, aucune bordure porteuse d'information plus claire que `--filet-fort`.

---

## 3. Typographie

### 3.1 Familles

| Rôle | Famille | Source | Graisses chargées |
|---|---|---|---|
| Lecture : titres, chapôs, textes de présentation, prix, citations d'avis, menu mobile | **Spectral** | Production Type (Paris), Google Fonts, licence SIL OFL 1.1 | 300, 400, 500 + italique 400 |
| Action et données : navigation, boutons, formulaires, lignes de données, badges, mentions légales | **Hanken Grotesk** | Hanken Design Co., Google Fonts, licence SIL OFL 1.1 (variable) | 400, 500, 600 |

**Pourquoi Spectral.** C'est une serif dessinée par une fonderie parisienne pour l'écran (Google Docs), et non une copie numérique d'un Garamond de plomb. Elle a un vrai caractère (empattements fins et tranchants, œil étroit, élégance un peu juridique) sans le maniérisme des Didones ni l'usure des Playfair et Cormorant. Elle propose des graisses légères (300) pour les grands titres et une version texte solide en 400 à 17-18 px. Ses chiffres alignés sont nets pour les prix. Les accents et les signes français sont soignés (« », ’, œ, É).

**Pourquoi Hanken Grotesk.** C'est une grotesque neutre et légèrement humaniste, lisible à 13 px, avec des chiffres tabulaires (`tnum`). Elle n'est pas l'une des polices de template relevées par Bergkamp (Quicksand, Poppins, Montserrat, Open Sans) ni la sans-serif par défaut d'un projet généré (Inter, Geist). Son `g` à une seule boucle et ses capitales sobres se marient avec Spectral sans s'imiter.

**Écartées** : Playfair Display (Haussmann Notaires), IvyPresto et autres italiques signature (Building Partners), Cormorant, Fraunces et Instrument Serif (tics actuels), Libre Caslon et Source Serif (déjà essayées dans les explorations précédentes), Inter, Montserrat, Poppins, Quicksand et Open Sans.

**Chargement (Next 16, `next/font/google`)** : `Spectral({ weight: ["300","400","500"], style: ["normal","italic"], subsets: ["latin"], display: "swap", variable: "--font-serif" })` et `Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans" })` (variable, sans liste de graisses). Repli : `Georgia, "Times New Roman", serif` et `system-ui, -apple-system, "Segoe UI", sans-serif`. Pirlo (lot P) écrit `src/app/fonts.ts` et vérifie l'API exacte dans `node_modules/next/dist/docs/` avant d'écrire.

### 3.2 Échelle

C'est l'échelle classique de Bringhurst (12, 13, 14, 16, 18, 21, 24, 28, 36, 48, 60), en pixels entiers et avec des interlignes sur une grille de 2 px. Il n'y a qu'une bascule, à 768 px. Le passage de la taille mobile à la taille desktop se fait d'un coup, sans `clamp()` fluide, pour garder des valeurs maîtrisées.

| Jeton | Famille / graisse | Desktop (taille/interligne) | Mobile | Approche | Usage |
|---|---|---|---|---|---|
| `display` | Spectral 300 | 60/64 | 40/44 | −0,015em | Une fois par site : phrase d'ouverture de l'accueil |
| `h1` | Spectral 300 | 48/54 | 34/40 | −0,01em | Titre de page, titre de fiche bien |
| `h2` | Spectral 400 | 36/42 | 28/34 | −0,005em | Titre de section |
| `h3` | Spectral 500 | 24/30 | 21/28 | 0 | Sous-titre, titre d'engagement, question de FAQ |
| `chapo` | Spectral 400 | 21/32 | 19/30 | 0 | Paragraphe d'introduction, `--encre-douce` |
| `texte` | Spectral 400 | 18/30 | 17/28 | 0 | Texte de présentation, description d'un bien |
| `prix-fiche` | Spectral 400 | 40/44 | 40/44 | −0,01em | Prix sur la fiche |
| `prix-carte` / `titre-carte` | Spectral 500 / 400 | 20/26 | 20/26 | 0 | Carte bien |
| `ui` | Hanken 400 / 500 | 16/24 | 16/24 | 0 | Interface, champs (16 px minimum pour éviter le zoom iOS) |
| `nav` | Hanken 500 | 15/20 | — | 0 | Navigation, libellés de champs, boutons compacts |
| `petit` | Hanken 400 | 14/20 | 14/20 | 0 | Lieu d'un bien, aides, lignes de données |
| `legal` | Hanken 400 | 13/20 | 13/20 | +0,01em | Mentions, références, légendes. **Plancher absolu : 13 px** |

**Exception unique, hors échelle** : le `h1` de la page Vendre passe en 30/36 sous 360 px (« à Asnières-sur-Seine » est insécable et mesure 299 px en 34 px pour 280 px de colonne à 320). 30 n'appartient pas à l'échelle ; l'exception est locale (`className` de `PageIntro` dans `vendre/page.tsx`), acceptée par Zidane en revue du lot 4 (tour 1). Aucune autre page ne la reprend.

### 3.3 Règles d'usage

- **Titres** : en Spectral, en casse de phrase, alignés à gauche, avec `text-wrap: balance`. Jamais de capitales, jamais d'italique, jamais un mot isolé en grenat ou en gras. Les titres saisis en majuscules par l'agent (« 2 PIECES + 1 TERRASSE… ») ne sont **jamais** affichés en grand titre : le titre affiché est composé à partir des données (Maldini §5.5).
- **Italique** : seulement pour les citations d'avis Google et les titres d'œuvres, soit une fois par écran au plus. Ce n'est pas un effet de titre.
- **Chiffres et prix** : `font-variant-numeric: lining-nums tabular-nums` partout où des nombres sont alignés ou comparés (prix, surfaces, références, tableaux). Le séparateur de milliers est une espace fine insécable (U+202F) et l'euro suit une espace insécable : `644 000 €`. Utiliser `Intl.NumberFormat("fr-FR")`, qui produit U+202F, et ne jamais le remplacer par une espace normale. Les surfaces gardent leurs décimales légales (`92,2 m²`, Carrez). Les pourcentages s'écrivent `4,76 %` avec une espace fine.
- **Ponctuation française** : espace fine insécable avant `: ; ! ?` et à l'intérieur de `« »`. Apostrophe typographique `’`, jamais `'`. Points de suspension `…`. Tiret demi-cadratin pour les intervalles (`9 h – 19 h`).
- **Interface** : Hanken 500 pour les boutons et les libellés, 400 pour les valeurs. Pas de capitales espacées, nulle part, pas même sur les badges.
- **Mentions légales** : Hanken 400 13/20, `--gris` sur crème ou `--grenat-sur-fond` sur grenat. Les mentions de la fiche bien (honoraires, copropriété, énergie) ne sont **pas** des petits caractères : elles sont en `petit` ou en `ui` dans le flux du contenu.
- **Longueur de ligne** : 60 à 72 signes pour le texte serif (`max-width: 34em` sur `texte`), 75 au plus pour l'interface. Les chapôs sont limités à 32em.
- **Césure** : `hyphens: auto` avec `lang="fr"` sur le texte courant en mobile seulement (moins de 768 px), toujours bornée par `hyphenate-limit-chars: 8 5 4` (mot de 8 caractères au moins, 5 avant la coupure et 4 après : plus de « Esti-mer » ni de « défile-ment »). Le navigateur compte l'élision dans le mot (« l’acquéreur » fait 11 caractères, « l’ac » 4) : le minimum de 5 avant la coupure interdit « l’ac-quéreur » ou « l’es-timation » et laisse « l’acqué-reur ». Safari ignore `hyphenate-limit-chars` ; `-webkit-hyphenate-limit-before: 5` et `-webkit-hyphenate-limit-after: 4` portent la même règle. Limite connue : une élision suivie d'une coupure à 5 caractères ou plus reste possible (« l’esti-mation ») ; elle est correcte en typographie française. Jamais sur les titres, les prix, les noms de rue ni les mentions légales. `overflow-wrap: anywhere` sur les descriptions saisies par l'agent, qui peuvent contenir de longues chaînes.
- **Un libellé d'interface cité n'est jamais coupé.** Un libellé cité entre guillemets avec ses espaces fines (« Faire estimer ») est lu par le navigateur comme un seul mot, que `hyphenate-limit-chars` ne protège pas. On l'enveloppe donc dans `<span className="hyphens-manual">` : « <span className="hyphens-manual">« Faire estimer »</span> ». Même règle pour « Estimer », « Menu », « Envoyer la demande » et tout nom de bouton ou de lien cité dans un texte.
- **Lissage** : `-webkit-font-smoothing: antialiased`, `font-kerning: normal`, ligatures standard actives.

---

## 4. Grille, espacements, rythme

### 4.1 Conteneur et grille

- Contenu de 1200 px au plus, centré. Marges latérales de **20 px** (mobile), **32 px** (à partir de 768) et **40 px** (à partir de 1280).
- Grille de **4 colonnes** en mobile, **12 colonnes** à partir de 768. Gouttière de 16 px en mobile, 24 px au-delà.
- **Alignement à gauche** partout. Le centrage est réservé à l'écran de confirmation du tunnel et à la page 404.
- Gabarit éditorial type (desktop) : un intertitre de section sur les colonnes 1 à 3 (ou 1 à 4), le corps sur 4 à 12. Le texte long ne dépasse jamais 8 colonnes.

```
desktop 12 col                                     mobile 4 col
| h2 (1-3) |   corps (4-12)                     |   | h2          |
|          |   texte 34em  ............         |   | corps       |
|          |   [photo 4:3][photo 4:3][photo]    |   | [photo 4:3] |
```

### 4.2 Échelle d'espacement (base 4)

`s1` 4 · `s2` 8 · `s3` 12 · `s4` 16 · `s5` 24 · `s6` 32 · `s7` 48 · `s8` 64 · `s9` 96 · `s10` 128 (px)

### 4.3 Rythme vertical

| Situation | Mobile | Desktop |
|---|---|---|
| Entre deux sections | `s8` 64 | `s9` 96 |
| Ouverture de page (sous l'en-tête) | `s8` 64 | `s10` 128 |
| Titre de section vers contenu | `s6` 32 | `s7` 48 |
| Paragraphe vers paragraphe | 1 interligne (28-30) | idem |
| Libellé vers champ | 6 | 6 |
| Champ vers champ | `s5` 24 | `s5` 24 |
| Photo vers titre de carte | `s4` 16 | `s4` 16 |
| Rangées de cartes | `s7` 48 | `s7` 48 |

Les sections sont séparées par l'espace, et au besoin par un filet `--filet`. On ne combine jamais un filet **et** un changement de fond.

### 4.4 Points de rupture (Tailwind v4 par défaut, conservés)

`sm` 640 (2 colonnes de biens) · `md` 768 (grille 12, typo desktop) · `lg` 1024 (navigation complète, 3 colonnes de biens, gabarit intertitre + corps) · `xl` 1280 (marge de 40 px).

**Mobile** : une colonne. L'en-tête fait 64 px, collant en permanence (nom, bouton « Faire estimer » secondaire compact, sans grenat, bouton texte « Menu » sur une cible de 48 × 48, voir §6.8). Pas de barre fixe en bas d'écran. Le tunnel occupe toute la largeur, sans cadre. Sur la fiche, ordre du brief A30 : galerie (4:3, défilement aimanté, compteur), `h1`, lieu, bloc prix et honoraires, deux boutons pleine largeur (« Appeler le cabinet », « Demander une visite », A6), puis L'essentiel. Aucun défilement horizontal, à vérifier à 320 px.

---

## 5. Formes

- **Arrondis** : 3 px pour les contrôles (boutons, champs, options), 2 px pour les badges et les pastilles, **0** pour les photos et les illustrations, 50 % pour les radios. Pas de pilule. Pas de rayon unique appliqué à tout.
- **Filets** : 1 px `--filet` pour séparer (bas de l'en-tête, lignes de données, listes), 1 px `--filet-fort` pour les bordures de contrôles. Pas de filet épais décoratif, pas de double filet.
- **Ombres** : **aucune**. Seules exceptions : un `box-shadow` d'1 px pour doubler une bordure (focus d'un champ, option cochée), et un `box-shadow` de 2 px encre autour de la classe active d'une échelle énergie HTML. Pas d'ombre portée, même au survol.
- **Photos** :
  - Carte bien : ratio **4:3** imposé (`aspect-ratio: 4/3`, `object-fit: cover`, `next/image` en `fill`). Les portraits 1500×2000 sont recadrés au centre.
  - Fiche bien : photo principale en **3:2** sur desktop et 4:3 sur mobile. Vignettes en 4:3. Plein écran au ratio natif (`contain`) sur fond encre.
  - Aucun filtre, aucun voile coloré, aucun noir et blanc, aucun texte posé sur une photo.
  - Photo absente : réserve `--creme-soutenu` au même ratio, avec en `petit` `--gris` « Photos à venir ». Pas d'icône générique.
  - Fond de chargement : `--creme-soutenu` (pas de squelette animé).
- **Illustrations** (cadre pour Cantona) : trait encre #251C19 uniquement. **Aucun grenat dans les illustrations** (brief A11) : le grenat signe l'interface, pas les images. Épaisseur constante. Aplats limités à `--creme-soutenu`. Les illustrations sont posées sans cadre sur crème ou sur crème soutenu, sans arrondi.

---

## 6. Composants

### 6.1 Boutons

| Niveau | Apparence | Survol | Focus clavier | Désactivé |
|---|---|---|---|---|
| **Principal** | Fond grenat, texte crème, Hanken 500 16 px, hauteur 48, padding 0 22, rayon 3 | Fond `--grenat-fonce` (180 ms) | Contour 2 px encre, décalage 3 px | Fond crème soutenu, texte gris, `cursor: not-allowed`. On préfère ne pas désactiver et valider au clic |
| **Secondaire** | Transparent, bordure 1 px encre, texte encre | Fond encre, texte crème | Idem | Idem |
| **Tertiaire** | Texte encre 500, soulignement 1 px `--filet-fort` décalé de 0,3em | Soulignement en encre | Idem | Texte gris |
| **Compact** | Variante à 40 px de haut, Hanken 500 15 px, padding 0 16. S'applique au principal ou au secondaire | Celui du niveau | Celui du niveau | Celui du niveau |
| **Secondaire compact d'en-tête** (A19) | Fond transparent, contour 1 px encre, texte encre, 40 px, padding 0 16, rayon 3. « Faire estimer », « Estimer » sous 380 px | Fond encre, texte crème (180 ms, `--ease-sobre`) | Contour 2 px encre, décalage 3 px | Jamais désactivé |

- Un seul bouton principal par écran, et **il appartient toujours au contenu de la page** (brief A19). Le « Faire estimer » de l'en-tête est un secondaire compact à toutes les tailles d'écran ; il ne redevient principal que dans le menu mobile ouvert, où le contenu de la page est masqué. Le couple « Voir nos biens » / « Faire estimer » du contenu associe un secondaire et un principal.
- Le libellé est un verbe qui dit ce qui se passe : « Faire estimer », « Continuer », « Envoyer la demande », « Appeler le cabinet ». Pas de « Découvrir », pas de « En savoir plus », pas de flèche ajoutée.
- Une icône n'est permise que si elle précise l'action (téléphone, retour). Taille 18 px, trait 1,5, à gauche du texte.
- Dans le pied grenat, le secondaire passe en contour crème et le focus devient crème.

### 6.2 Liens

- **Dans le texte** : grenat, soulignement 1 px à 45 % d'opacité, décalé de 0,22em. Au survol, le soulignement devient plein. Visité : pas de changement.
- **Navigation** : encre, sans soulignement. Au survol, un trait de 1 px se dessine sous le mot, de gauche à droite (pseudo-élément `::after` en `currentColor`, `transform: scaleX(0)` puis `scaleX(1)`, `transform-origin: left`, 180 ms ; brief A36, aucun dégradé). Page active : texte grenat avec le trait présent, et `aria-current="page"`.
- **Liens externes** (Géorisques, avis Google, itinéraire) : tous ouverts dans le **même onglet**, sans `target="_blank"` et sans icône (brief A16). Ils ont le même style que les autres liens de texte. Une seule règle, sans exception.

### 6.3 Champs et tunnel d'estimation

- **Champ** : libellé Hanken 500 15 px au-dessus, aide en `petit` `--gris` en dessous. Hauteur 48, fond lait, bordure 1 px `--filet-fort`, rayon 3, texte 16 px. Le placeholder ne remplace jamais le libellé.
  - Survol : bordure `--encre-douce`.
  - Focus : bordure encre et `box-shadow: 0 0 0 1px` encre, soit un trait de 2 px **sans** halo coloré.
  - Erreur : bordure et ombre de 1 px `--erreur`, message sous le champ avec l'icône `CircleAlert` (16 px) et un texte qui dit **quoi faire** (« Il manque la fin de l'adresse, par exemple claire.martin@orange.fr. »). `aria-invalid` et `aria-describedby`. La validation se fait à la sortie du champ puis à l'envoi, jamais pendant la frappe.
  - Désactivé : fond crème soutenu, bordure filet, texte gris.
  - Obligatoire : tous les champs le sont par défaut. Les champs facultatifs portent « (facultatif) » dans le libellé. Pas d'astérisque rouge.
- **Choix** (radio et case en rangée) : options de 56 px de haut au moins, en rangées pleine largeur, ou en 2 colonnes à partir de 600 px. Fond lait et bordure `--filet-fort`. Une fois cochée, l'option prend une bordure grenat doublée (2 px visuels) et un point grenat de 10 px dans un cercle de 18 px. Toute la rangée est cliquable. Pas de tuile avec icône.
- **Tunnel** (4 étapes, Bergkamp §4 : le bien, ses caractéristiques, vous, vérification) :
  - Barre de progression en 4 segments de 3 px : fait = encre, en cours = grenat, à venir = filet. Au-dessus de 768 px, les libellés des 4 étapes sont écrits sous la barre. En dessous, on affiche « Étape 2 sur 4, ses caractéristiques ». La numérotation est légitime ici car c'est une vraie séquence (voir §9.19).
  - Titre d'étape en Spectral 400 28/34, suivi d'une phrase d'intention en `ui` `--encre-douce`.
  - Pied d'étape : filet, « Retour » (tertiaire, chevron de 16 px) à gauche et « Continuer » (principal) à droite. À la dernière étape, le bouton devient « Envoyer la demande ».
  - Sur desktop, le tunnel est dans un cadre lait avec un filet de 1 px, padding 48. Sur mobile, il prend toute la largeur, sans cadre.
  - RGPD : case à cocher non précochée, avec un texte d'une ligne et un lien vers la politique de confidentialité, juste au-dessus du bouton d'envoi.
  - Écran de fin : centré, coche `--succes`, récapitulatif en lignes de données, prochaines étapes en liste numérotée (`<ol>`). Aucun délai n'est affiché tant qu'il n'a pas été validé par l'agent.

### 6.4 Statuts (badges)

Hanken 500 13 px, hauteur 24, padding 0 8, rayon 2. Pas de capitales.

| Statut | Style | Quand |
|---|---|---|
| En vente | Contour 1 px encre | Seulement dans une liste qui mêle vente et location |
| À louer | Contour encre, fond crème soutenu | Idem |
| Sous offre / Sous compromis | Fond encre, texte crème | Statut API `SOUS_OFFRE` / `SOUS_COMPROMIS` |
| Exclusivité | Contour grenat, texte grenat | `isExclusive` vrai. C'est le seul badge grenat, car l'exclusivité engage le cabinet |
| Vendu / Loué | Fond crème soutenu, texte encre douce. **Sans année** | Archive. `soldAt` n'est pas exposé par l'API publique et `updatedAt` n'est pas une date de vente (brief A22). L'année ne sera ajoutée que si l'API l'expose un jour |

Sur une photo, le badge est posé à 12 px du coin supérieur gauche, sur fond crème. Un bien disponible n'a **aucun** badge. Deux badges au plus par bien.

### 6.5 Carte bien (sans « carte »)

Il n'y a ni bordure, ni fond, ni ombre, ni cœur, ni carrousel. Toute la zone est un seul lien.
1. Photo 4:3.
2. Titre composé `Appartement 5 pièces, 92,2 m²` (Spectral 400 20/26). On écrit « Studio » pour 1 pièce, et « 1 pièce » sans « s ».
3. Lieu `Asnières-sur-Seine, Impressionnistes` (Hanken 14, encre douce). Les quartiers saisis sont normalisés : « Gabriel Péri », casse et accents corrigés côté vitrine.
4. Filet, puis prix `644 000 €` (Spectral 500 20) à gauche et `Réf. 10129` (Hanken 13, gris) à droite. Pour une location : `1 250 € par mois charges comprises`, selon les données.

Au survol, la photo grossit à 1,02 en 600 ms (si le mouvement est autorisé) et le titre se souligne. Au focus, le contour 2 px encre entoure tout le lien. La liste a un état vide rédigé (Maldini §5.1).

**`PropertyGrid` : disposition selon le nombre de biens** (brief A21, grille de 12 colonnes, gouttière du §4.1) :

| Biens | Disposition à partir de 768 px |
|---|---|
| 1 | Carte **horizontale** : photo 4:3 sur 7 colonnes, texte sur 5 colonnes, aligné en haut, titre en Spectral 400 28/34 |
| 2 | 2 colonnes de 6 |
| 3 | 3 colonnes de 4 |
| 4 | 2 × 2 (colonnes de 6) |
| 5 et plus | 3 colonnes de 4, la dernière rangée alignée à gauche (jamais centrée ni étirée) |

Sous 768 px : toujours **1 colonne**, y compris pour un bien seul (la carte horizontale redevient verticale). La règle s'applique séparément à chaque liste (disponibles, archive).

### 6.6 Prix et honoraires (fiche)

```
198 000 €                                        Spectral 400 40/44
Soit 189 000 € honoraires exclus                 Hanken 15/22 encre douce
Honoraires de 4,76 % TTC à la charge de l'acquéreur
```
- Les formulations suivent la note du client. Si les honoraires sont à la charge du vendeur, une seule ligne : « Honoraires à la charge du vendeur ». Ne jamais afficher `-1` ni `null` (Maldini §5.11).
- Le lien « Barème d'honoraires » (lien de texte) est placé juste en dessous.
- **Copropriété** : liste de définitions en lignes séparées par des filets (libellé encre douce à gauche, valeur alignée à droite en chiffres tabulaires) : « Bien soumis au statut de la copropriété : Oui », « Nombre de lots », « Charges annuelles moyennes », « Procédure en cours sur la copropriété : Aucune » (ou « Oui », brief A32), puis « Taxe foncière ».

### 6.7 Bloc DPE / GES

- Deux étiquettes côte à côte à partir de 600 px, empilées en dessous. On utilise les SVG de l'admin. L'échelle HTML de la planche n'est qu'une représentation de secours, aux couleurs exactes de `scale.ts`.
- Intitulés : « Consommation d'énergie (DPE) » et « Émissions de gaz à effet de serre (GES) » en Hanken 500 15.
- Sous les étiquettes, séparées par un filet :
  - Trois formulations seulement (brief A29, qui remplace A7, A8 et A24). `dateReferenceEnergie` est la « Date d'indexation du prix de l'énergie » saisie dans l'admin. Le formatage est isolé dans une seule fonction de `src/lib/property/`.
  - (1) Coûts présents et date renseignée : « Montant estimé des dépenses annuelles d'énergie pour un usage standard : entre 830 € et 1 190 € par an. Prix moyens des énergies indexés au 1er janvier 2021 (abonnements compris). » (`ui`). La date est écrite en entier, en français (`Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" })`, « 1er » pour le premier du mois), telle que saisie : rien n'est extrait ni deviné.
  - (2) Coûts présents sans date : « Montant estimé des dépenses annuelles d'énergie pour un usage standard : entre 830 € et 1 190 € par an, abonnements compris. » Aucune date n'est inventée ni recopiée d'un autre site.
  - (3) Coûts absents (09.345 et 10.131 aujourd'hui) : la ligne est **toujours affichée** : « Montant estimé des dépenses annuelles d'énergie pour un usage standard : non communiqué. » Elle n'est jamais masquée. Le cas est bloquant pour la mise en ligne tant que l'agent n'a pas complété les biens dans l'admin.
  - Dans les cas (1) et (2) seulement : « Les coûts sont estimés en fonction des caractéristiques du logement et pour une utilisation standard. » (`legal`)
  - « Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques. » avec un lien dans le même onglet (§6.2).

### 6.8 En-tête

- Desktop (≥ 1024) : hauteur 80, fond crème, filet bas. À gauche, le logotype « Cabinet Rimbault » (Spectral 500 23, grenat) avec sous lui « Asnières-sur-Seine, depuis 2009 » (Hanken 400 **13**, encre douce : le plancher absolu, sans exception). Au centre, **5 entrées** (brief A2) : Nos biens, Vendre, Louer, Le cabinet, Contact (Hanken 500 15, espacées de 28). À droite, le téléphone (icône 16 et numéro en chiffres tabulaires) et le bouton **secondaire compact** « Faire estimer » (§6.1, A19) : contour 1 px encre, texte encre, fond transparent, 40 px ; au survol, fond encre et texte crème en 180 ms. Aucun grenat dans l'en-tête hors logotype et page active. Les 5 entrées tiennent sur une ligne à 1024 px (vérifié sur la planche, sans débordement).
- Comportement (brief A3) : sur desktop, l'en-tête est **statique** (ni fixe ni collant). Sur mobile, il est **collant en permanence** (`position: sticky; top: 0`), sans masquage au défilement, sans changement de fond ni ombre. Le filet du bas est toujours présent. Aucune animation d'en-tête.
- Mobile (< 1024) : hauteur 64. Logotype seul (le sous-titre est masqué sous 480 px), « Faire estimer » en **secondaire compact** de 40 px (même style qu'en desktop, A19), libellé « Estimer » sous 380 px (brief A5). L'en-tête étant collant, ce choix évite un second bouton grenat permanent à côté de celui du contenu. Bouton de menu (brief A4) : le **mot « Menu »** en Hanken 500 15, sans icône, sur une cible de 48 × 48, avec `aria-expanded` et `aria-controls`. Sous 380 px, le logotype passe à 18 px et les espacements à 8 px pour tenir à 320 px sans défilement horizontal (vérifié).
- Le logotype définitif (monogramme éventuel) revient à Cantona, dans ces couleurs et ce corps.

### 6.9 Navigation mobile

Panneau plein écran sur fond crème. En haut, le logotype et le mot « Fermer » (texte seul, à la place exacte de « Menu », `aria-expanded="true"`). Ensuite, les 5 entrées en Spectral 26/32 séparées par des filets, la page active en grenat. Puis « Faire estimer votre bien » (**principal** grenat, pleine largeur : c'est le seul endroit où le bouton d'estimation de l'en-tête devient principal, car le contenu de la page est masqué, A19), « 01 73 64 56 10 » (secondaire, pleine largeur, `tel:`) et l'adresse en `petit`. Le défilement du corps est bloqué, le focus reste piégé dans le panneau, `Échap` ferme le menu et le focus revient au bouton. Transition : fondu du panneau de 180 ms, sans glissement ni cascade (brief §7).

### 6.10 Pied de page

C'est le seul aplat grenat. Padding 96/32 en desktop et 64/32 en mobile. Structure unique (brief A20), dans cet ordre :
1. Une phrase vraie en Spectral 400 36/42 (28/34 en mobile), couleur crème : « Cabinet Rimbault, transactions immobilières à Asnières-sur-Seine depuis 2009. »
2. **Trois colonnes** (une en mobile, trois dès 768 px), intertitres Hanken 500 15 en `--grenat-sur-fond`, liens en crème :
   - **Nous trouver** : adresse, téléphone (`tel:`), horaires validés.
   - **Le site** : Nos biens, Vendre, Louer, Faire estimer, Le cabinet, Contact.
   - **Informations** : Nos honoraires (barème en HTML), Mentions légales, Confidentialité, puis la ligne « Avis Google : 4,9 sur 5, 32 avis » (lien, même onglet).
3. Filet crème à 22 % d'opacité, puis le bloc **Mentions professionnelles** en **pleine largeur**, jamais replié ni caché dans un accordéon, en `legal` 13/20 `--grenat-sur-fond` : carte professionnelle T et CCI, garant, SAS au capital de 4 000 €, RCS, **médiateur**. Le médiateur n'est pas renseigné dans `agency.ts`, ce qui **bloque la mise en ligne**.
4. « © 2009-2026 Cabinet Rimbault », en `legal`, l'année de fin calculée au rendu.

Pas d'icônes de réseaux sociaux, pas de newsletter, pas de « Fait avec ♥ ».

---

## 7. Iconographie

- **lucide-react** (déjà installé) est conservé, avec une liste fermée d'icônes : `Phone`, `X` (fermeture de la visionneuse de photos), `ChevronLeft`, `ChevronRight` (galerie et retour), `CircleAlert` (erreur), `Check` (fin du tunnel, case cochée), `MapPin` (lien itinéraire, facultatif). `Menu` est retiré (le bouton est un mot, brief A4) et `ExternalLink` aussi (tous les liens externes s'ouvrent dans le même onglet, brief A16). Toute autre icône passe par Zidane.
- Réglages : `strokeWidth={1.5}`, `size` 16 (dans le texte), 18 (dans les boutons) ou 20 (navigation), `aria-hidden` sauf si l'icône est seule (dans ce cas, `aria-label` sur le bouton), couleur `currentColor`.
- **Seule exception au trait 1,5** : la coche `Check` de `Checkbox` et de `ChoiceGroup` est en `strokeWidth={2}`. C’est un petit glyphe d’état de 14 px en crème sur fond grenat, qui disparaîtrait à 1,5. Les deux icônes d'erreur (`FieldError`, `ErrorSummary`) restent à 1,5 et identiques ; la valeur 1,75 est refusée.
- **Interdit** : icônes de métier (maison, clé, euro, poignée de main), icônes devant les titres, icônes dans des cercles colorés, icônes « caractéristiques » sur les cartes (lit, baignoire, règle). Les caractéristiques s'écrivent en toutes lettres.

---

## 8. Mouvement (cadre pour Iniesta)

**La liste fermée des animations, leurs durées et leurs déclencheurs sont ceux du brief §7 (`00-brief-refonte-zidane.md`), qui fait foi.** Ce paragraphe ne fait que rappeler les jetons que le design system fournit pour les appliquer :
- Courbe unique `--ease-sobre: cubic-bezier(.2, 0, 0, 1)`. Durée de base 180 ms, 600 ms au plus (zoom de photo de la carte de bien).
- Propriétés animables : `opacity`, `transform`, `background-color`, `border-color`, `color`, `text-decoration-color`. Jamais `height`, `width` ni `top`.
- Une seule séquence orchestrée sur le site : l'ouverture de l'accueil. Apparition au défilement interdite pour les sections et les textes. **Seule exception autorisée** : une image (photo ou illustration) apparaît en fondu de 300 ms **quand elle est décodée**, et non quand elle entre dans l'écran.
- Ni parallaxe, ni compteur, ni carrousel automatique, ni animation d'en-tête. Avec `prefers-reduced-motion: reduce`, toutes les durées passent à 0 sauf le changement de couleur au survol. Sans JavaScript, tout est visible.

---

## 9. Interdits (liste anti-« vibe codé »)

**Structure**
1. Moteur de recherche, filtres, tri, « recherches sauvegardées », favoris, comptes.
2. Hero centré avec un gros titre et deux boutons côte à côte sur une photo de stock. La tour Eiffel.
3. Tuiles « Acheter / Vendre / Louer » avec icônes ou dégradés.
4. Grilles de cartes identiques à coins arrondis, fond blanc et ombre douce.
5. Carrousels automatiques, compteurs animés (« 15 ans », « 300 biens »), parallaxe, effets au curseur.
6. Section sans contenu réel, bloc vidéo vide, « bientôt disponible ».
7. Pavé SEO, liste de villes en bas de page.

**Graphisme**
8. Dégradés, verre dépoli, grain, texture papier, bruit, vignettage, formes « blob ».
9. Ombres portées, y compris au survol.
10. Or, laiton, cuivre, deuxième couleur d'accent, terracotta.
11. Grenat sur du texte non cliquable (hors logotype, pied et badge « Exclusivité »).
12. Noir pur `#000` ou quasi noir neutre (`#111`) à la place de l'encre. Blanc pur en fond.
13. Photos filtrées, en noir et blanc, sous un voile coloré ou avec du texte posé dessus.
14. Photo ou silhouette de l'agent, poignées de main, personnes en stock.

**Typographie et texte**
15. Sur-titres en capitales espacées au-dessus des titres (« NOTRE AGENCE », « PASSION »).
16. Un mot en italique, en gras ou en grenat dans un titre.
17. Flèches ajoutées au texte des boutons et des liens (« En savoir plus → »).
18. Métadonnées reliées par des points médians (« Asnières · 3 pièces · 68 m² »). On les écrit en phrase, avec des virgules.
19. Numérotation décorative (01 / 02 / 03) sur ce qui n'est pas une séquence. La numérotation est autorisée pour **toute vraie séquence**, rendue en `<ol>` : les étapes du tunnel, le déroulé d'une vente ou d'une location (pages Vendre et Louer), la suite après l'envoi d'une demande. Les chiffres sont ceux de la liste (Hanken, chiffres tabulaires, encre), jamais en grand corps décoratif, jamais en grenat, jamais avec un zéro initial.
20. Police monospace pour les petites étiquettes. Montserrat, Poppins, Quicksand, Open Sans, Inter.
21. Emojis, pictogrammes ✓ dans le texte, étoiles décoratives (les avis s'écrivent « 4,9 sur 5 »).
22. Lorem ipsum, chiffres non prouvés (« 99 % de clients satisfaits », « N°1 »), délais non validés par l'agent.
23. Mentions légales en dessous de 13 px, en gris plus clair que `--gris`, ou cachées dans un accordéon.
24. Formules creuses : « Découvrez », « N'hésitez pas », « Votre partenaire de confiance », « Expertise », « Passion ».
25. Bandeau cookies : aucun n'est nécessaire avec une mesure d'audience exemptée et sans Google Maps intégré.

---

## 10. Livraison vers `globals.css` (Tailwind v4)

**Pirlo (lot P)**, et non Xavi, déclare les jetons dans `src/app/globals.css`, bloc `@theme`, sous ces noms exacts : `--color-grenat`, `--color-grenat-fonce`, `--color-grenat-pale`, `--color-grenat-sur-fond`, `--color-creme`, `--color-creme-soutenu`, `--color-lait`, `--color-encre`, `--color-encre-douce`, `--color-gris`, `--color-filet`, `--color-filet-fort`, `--color-erreur`, `--color-succes`. Il ajoute `--font-serif` et `--font-sans` (alimentées par `next/font`), `--radius-ctrl: 3px`, `--radius-badge: 2px` et `--ease-sobre: cubic-bezier(.2,0,0,1)`. Pirlo écrit aussi `src/app/fonts.ts` (`next/font/google`, §3.1), que Xavi importe dans le layout racine sans le modifier. Les tailles de l'échelle §3.2 deviennent des classes utilitaires composées (`.t-h1`, etc.) dans `@layer components`, avec les mêmes noms que la planche. La planche `planche-pirlo.html` sert de référence visuelle pour la revue de Zidane et les tests de Maldini (captures comparatives).

---

## Annexe A : calcul des contrastes

```python
def lum(h):
    c = [int(h[i:i+2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)
```

## Annexe B : points ouverts pour Zidane

1. ~~Libellé de la date de référence des prix de l'énergie~~ : tranché par A29 (date d'indexation des prix, écrite en entier), intégré au §6.7. Reste à l'agent la vérification de la date saisie pour 09.362 (brief §10-5).
2. ~~Coûts énergie absents~~ : tranché par A7, intégré au §6.7 (« non communiqué », ligne jamais masquée).
3. Logotype définitif (Cantona) : il doit tenir dans 160×24 px en mobile.
4. Mention du médiateur, qui bloque la mise en ligne.
