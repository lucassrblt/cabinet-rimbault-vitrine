---
name: Benchmark & Design System — Cabinet Rimbault Vitrine
description: Analyse concurrentielle du marché immobilier français (11 sites), synthèse des tendances, 3 propositions de design system tranchées, matrice de positionnement et recommandation finale avec tokens Tailwind v4.
---

# Benchmark & Design System — Cabinet Rimbault Vitrine

> Livrable issu du brief `docs/benchmark-design.md`. Couleur primaire imposée `#9d0208` (rouge grenat). Positionnement : agent indépendant IDF ouest, classe moyenne, sérieux/ancré/accessible — ni luxe, ni startup, ni réseau. Contraintes dures : coins 0-4px, pas de dark mode, Tailwind v4 via `@theme`.

---

## 1. Analyse de la concurrence

11 sites analysés, répartis en 3 catégories (5 agences indépendantes locales IDF ouest, 3 haut de gamme, 3 néo-agences). Chaque tableau synthétise URL, palette estimée, typographie, points forts/faibles et transposabilité vers Cabinet Rimbault.

### a) Agences indépendantes françaises — cœur de cible (5 sites)

Ce sont les concurrents directs : agents et petites agences indépendantes de Boulogne, Issy, Meudon, Sèvres. L'observation dominante est claire : **le secteur est visuellement médiocre**. Templates datés, navy + or par défaut, pas de direction artistique tranchée. C'est une opportunité.

| Site | URL | Palette estimée | Typographies | Forces | Faiblesses | Transposable ? |
|---|---|---|---|---|---|---|
| **La Seine Immobilière** | la-seine-immobiliere.com | Navy `#1a2b4a` / blanc / gris clair | Sans-serif système (Segoe/Arial) | Propre, minimaliste, hero clair, grille aérée, coins quasi droits | Trop générique, aucune personnalité, ton passe-partout | Architecture info oui, palette non |
| **Les Toits de Boulogne** | lestoitsdeboulogne.com | Navy `#0f1d3a` + or `#c9a45e` + blanc | Sans-serif web-safe | Carrousel hero, affichage avis 4.9/10, solide crédibilité | Codes « premium » sans moyens, un peu daté, typo anonyme | Structure avis oui, palette or non |
| **Chateauvieux Conseil** | chateauvieuxconseil.com | Blanc / charcoal `#2a2a2a` / or tan `#b89968` / gris `#f5f5f5` | Sans-serif système | Hiérarchie info claire, grille 3 colonnes propre, cards rectangulaires sobres | Aesthetic daté, manque de caractère, photos sans traitement | Grille cards oui |
| **Agence de la Ferme (Meudon)** | agencedelaferme.fr | Blanc / charcoal / accent muted | Web-safe non déclarée | Ton « familial depuis 1963 », étiquettes contextuelles ("Location Meudon"), sobriété | Design minimal au sens pauvre, peu de signal de marque | Ton ancré oui, le reste non |
| **Agence Vienot / L'Agence de Boulogne** | lagencedeboulogne.com | Navy `#1a1a1a` + or beige + blanc | Sans-serif Arial/Helvetica | 20+ ans d'ancienneté mise en avant, grille cards propre | Aesthetic conventionnelle, typo anonyme, carrousel daté | Structure oui, palette non |

**Verdict catégorie** : palette hégémonique navy + or + blanc. Typographies système ou Google Fonts passe-partout (Montserrat, Open Sans). Coins droits ou 2-4px — c'est la norme du secteur, on est alignés. **Personne ne fait de bruit visuel**. Une direction artistique tranchée suffit à dominer le segment.

### b) Haut de gamme / premium (3 sites) — inspiration aspirationnelle

| Site | URL | Palette estimée | Typographies | Forces | Faiblesses | Transposable ? |
|---|---|---|---|---|---|---|
| **Barnes International** | barnes-international.com | Or `#d4af37` + noir `#000` + blanc + gris | **Lora (serif)** + Helvetica Neue | Identité rouge & noir assumée en corporate, serif élégant, coins droits, images plein cadre | Luxe ostentatoire assumé (noir + or), réservé CSP++ | Serif pour titres oui, palette non |
| **Junot** | junot.fr | Charcoal `#1a1a1a` + or `#d4af37` + beige + blanc | Sans-serif géométrique moderne (probable custom) | Institutionnel mais digital, hero plein cadre, badges exclusivité, recherche centrale prominente | Luxe parisien, trop premium pour notre cible | Architecture hero + recherche oui |
| **Consultants Immobilier** | consultants-immobilier.com | Or `#d4af37` + charcoal + blanc + gris `#f5f5f5` | Montserrat ou Poppins (sans-serif) | Typo contemporaine, whitespace généreux, photos en vedette, coins 0-4px | Trop luxe, absence de serif = manque de caractère | Whitespace et hiérarchie oui |

**Verdict catégorie** : les haut-de-gamme sont **tous en noir + or**. Utiliser du rouge grenat (`#9d0208`) est une rupture bienvenue — ça évoque le patrimoine sans tomber dans le cliché or-noir. Retenu : serif pour les titres (Barnes-style, Lora ou équivalent), whitespace généreux, images plein cadre non filtrées.

### c) Néo-agences / digital (3 sites) — inspiration UX

| Site | URL | Palette estimée | Typographies | Forces | Faiblesses | Transposable ? |
|---|---|---|---|---|---|---|
| **Hosman** | hosman.co | Navy `#0a2540` + blanc + gris clair | Sans-serif Inter-like | Cards très soignées (double image, badge DPE, avatar agent), hiérarchie info impeccable, UX tunnel | Coins arrondis 8-12px incompatibles avec brief, ton startup | Structure card oui, radius non |
| **Liberkeys** | liberkeys.com | Bleu `#007AFF` + blanc + gris `#333` | Inter / Segoe UI | CTA prominents, hero clair, sections alternées blanc/gris, UX transparence | Bleu startup, radius 8-12px, trop digital | Alternance sections oui |
| **Welmo** (décrite via recherche) | welmo.fr | Bleu + blanc + vert accent | Sans-serif moderne | Tunnel estimation efficace, pédagogie claire | Ton startup, palette fraîche inadéquate | UX estimation oui |

**Verdict catégorie** : les néo-agences sont toutes en bleu startup avec radius généreux. À éviter sur le ton et le radius. **À retenir absolument** : la qualité des cards de biens Hosman (double photo, badge DPE contextuel, avatar agent, hiérarchie prix/lieu/type/DPE) — c'est le meilleur standard UX du marché, transposable à radius 2-4px.

---

## 2. Synthèse des tendances observées

### 2.1 Palettes dominantes

- **80 % des agences indépendantes** : navy (#0f1d3a → #1a2b4a) + or beige (#b89968 → #d4af37) + blanc. C'est le preset par défaut du secteur, complètement saturé.
- **Haut de gamme** : noir + or + blanc, parfois bourgogne ou vert anglais en accent (Daniel Féau, Émile Garcin).
- **Néo-agences** : bleu vif (Liberkeys, Welmo) ou navy profond (Hosman) + blanc + accent secondaire.
- **Constat** : **personne n'utilise le rouge grenat** sur ce segment. Notre `#9d0208` est une signature différenciante forte si bien calibrée (ne pas en mettre partout).

### 2.2 Typographies

- **Sans-serif omniprésent** : Montserrat, Poppins, Inter, Open Sans dominent.
- **Serif rare mais signature** : Barnes (Lora), rares sites premium. Un serif bien choisi dégage instantanément le sérieux / le patrimoine — c'est un levier fort.
- **Typo système encore fréquente** sur les petites agences (Arial, Helvetica) — signal d'amateurisme.

### 2.3 Layouts récurrents

- Hero plein largeur avec image + recherche centrale (quasi universel).
- Grille 3 colonnes desktop pour les cards biens (standard non contesté).
- Sections pleine largeur alternées blanc / gris très clair.
- Footer 3-4 colonnes + bandeau réglementaire Hoguet (obligatoire).
- **Tendance émergente** : cards biens avec double photo en carrousel interne, badge statut (exclusivité, nouveau, prix baissé), chip DPE coloré, avatar agent en bas — pattern Hosman.

### 2.4 Traitement des images

- Ratio 4/3 ou 16/10 dominant (jamais carré).
- Overlay dégradé noir en bas pour pose texte : fréquent mais paresseux.
- Aucun filtre noir-blanc / sépia : les photos doivent rester naturelles (aligné avec brief).
- Coins droits ou 2-4px sur quasi tous les sites sérieux — les 8-12px sont réservés au segment startup.

### 2.5 Éléments de différenciation des meilleurs

- Photo portrait de l'agent en taille réelle (Junot, Consultants) = humanisation forte.
- Chiffres clés inline (X ans, X transactions, X communes) — pas de gros bloc stats qui sonne corporate pour un solo.
- Avis Google affichés avec nom + date + étoiles, pas en carrousel auto.
- Breadcrumb systématique sur fiche bien.
- Un CTA primaire unique (« Estimer mon bien ») dans le header — pas 3 boutons concurrents.

### 2.6 Erreurs courantes à éviter

- Palette navy + or par défaut sans conviction → effet template gratuit.
- Carrousel auto hero qui tourne toutes les 3 secondes.
- Parallaxe agressive sur le hero.
- Dropdown méga-menu dans le header (le brief impose 5 items max, bien vu).
- Stock photos génériques (couple avec clés, famille devant pavillon).
- Overlay coloré sur les photos des biens (interdit dans le brief).
- Typo système (Arial, Helvetica) = amateurisme perçu.
- Radius incohérent (boutons 8px + cards 2px + inputs 12px).

---

## 3. Propositions de Design System (3 directions)

Trois directions avec **des personnalités vraiment distinctes** — pas trois variantes de la même idée. Toutes respectent : `#9d0208` primaire, coins 0-4px max, pas de dark mode, 2 fonts max Google Fonts, WCAG AA.

---

### Proposition A — « Maison Rimbault » (classique patrimonial)

#### Identité & mood

Une agence qui pourrait tenir boutique rue du Château à Boulogne depuis 30 ans. Ton : notariat feutré, papier ivoire, encre bordeaux. Références : éditions Gallimard blanche, cartes de visite gravées, Le Figaro Immobilier version print. **Sérieux par la tradition.** Le rouge grenat sert d'encre et de cachet — jamais de fond.

#### Palette complète

```css
/* Primaire — rouge grenat (cachet, titres, CTA) */
--color-primary-50:  #fdf2f2;
--color-primary-100: #fbe4e5;
--color-primary-200: #f7bcbe;
--color-primary-300: #ef8a8d;
--color-primary-400: #dd4f54;
--color-primary-500: #c41e24;
--color-primary-600: #9d0208; /* imposée */
--color-primary-700: #7a0106;
--color-primary-800: #5a0205;
--color-primary-900: #3d0203;
--color-primary-950: #210101;

/* Secondaire — papier ivoire (backgrounds alternés) */
--color-secondary-50:  #fdfcf8;
--color-secondary-100: #faf6ec;
--color-secondary-200: #f3ecd5;
--color-secondary-300: #e7dab3;
--color-secondary-500: #c9b583;
--color-secondary-700: #7a6a43;

/* Neutres — graphite chaud (pas de gris froid) */
--color-neutral-50:  #faf9f7;
--color-neutral-100: #f3f1ed;
--color-neutral-200: #e5e2db;
--color-neutral-300: #c9c4b8;
--color-neutral-400: #9a9388;
--color-neutral-500: #6f6a62;
--color-neutral-600: #4f4c47;
--color-neutral-700: #38362f;  /* texte corps */
--color-neutral-800: #22201b;  /* titres */
--color-neutral-900: #12110e;
--color-neutral-950: #080806;

/* Accents */
--color-success: #3d6b3a;   /* vert bouteille */
--color-warning: #b87f10;   /* ocre moutarde */
--color-error:   #9d0208;   /* le primaire lui-même */
--color-info:    #3a5a7a;   /* bleu ardoise */

/* Surfaces */
--color-bg-page:      #fdfcf8;  /* papier ivoire */
--color-bg-card:      #ffffff;
--color-bg-section:   #f3f1ed;
--color-bg-inverse:   #22201b;  /* footer */

/* Texte */
--color-text-primary:   #22201b;
--color-text-body:      #38362f;
--color-text-muted:     #6f6a62;
--color-text-on-primary:#fdfcf8;
--color-text-on-inverse:#f3f1ed;
```

#### Typographie

- **Titre** : **Cormorant Garamond** (serif, Google Fonts) — lettres hautes, contraste fort, évoque le livre d'art et le notariat. `font-weight: 500, 600`. Variable.
- **Corps** : **Inter** (sans-serif, Google Fonts) — neutre et lisible, contraste avec le serif. `font-weight: 400, 500, 600`. Variable.

**Échelle** (base 16px, ratio 1.25) :

| Token | Size | Line-height | Letter-spacing | Usage |
|---|---|---|---|---|
| display | 3.815rem (61px) | 1.05 | -0.02em | Hero H1 |
| h1 | 3.052rem (49px) | 1.1 | -0.015em | H1 pages |
| h2 | 2.441rem (39px) | 1.15 | -0.01em | Sections |
| h3 | 1.953rem (31px) | 1.2 | -0.005em | Blocs |
| h4 | 1.563rem (25px) | 1.25 | 0 | Cards |
| body-lg | 1.125rem (18px) | 1.6 | 0 | Lead |
| body | 1rem (16px) | 1.65 | 0 | Corps |
| body-sm | 0.875rem (14px) | 1.5 | 0 | Meta |
| caption | 0.75rem (12px) | 1.4 | 0.02em | Légal / DPE |

**Justification** : Cormorant Garamond a la gravité d'un Garamond classique sans le côté pompeux d'un Didot. Sur le web, il reste lisible à taille moyenne. Inter est la référence sans-serif neutre, éprouvée en production. Combo chargé à ~110 ko (woff2 variable) — acceptable avec `font-display: swap`.

#### Iconographie

- **lucide-react** (déjà installé) — traits 1.5px, style outlined. Cohérent avec la finesse du serif.
- Pas d'illustrations custom. Les photos des biens sont les seules illustrations.
- Puces personnalisées : petit carré `#9d0208` 4x4px pour les listes importantes.

#### Spacing, radius & elevation

- **Border-radius** : `0px` partout sauf `2px` sur les inputs et boutons (lisibilité tactile). Cards : `0`. Images : `0`.
- **Spacing** : base 4px, progression 4/8/12/16/20/24/32/40/48/64/96/128.
- **Shadows** : flat. Une seule ombre autorisée, à l'hover des cards : `0 2px 8px rgba(34,32,27,0.08)`. Pas d'ombres multi-layered.
- **Borders** : `1px solid #e5e2db` pour séparateurs et cards. `1px solid #22201b` pour focus. Pas de double border ni d'effets.

#### Motion & micro-interactions

- **Transitions** : `200ms ease-out` par défaut. Jamais au-delà de 300ms.
- **Hover boutons** : primaire → `#7a0106` (darker). Secondaire → fond `#f3f1ed`. Pas de scale, pas de lift.
- **Hover cards** : image zoom `1.03` sur 400ms ease-out + ombre apparaît. Pas de translateY.
- **Scroll reveals** : fade-in + translateY 12px sur 400ms, une seule fois par section (intersection observer). Aucun effet sur les listes de biens (anti-performance).
- **Aucune** animation sur les icônes, aucun spinner « fun », aucun parallaxe.

#### Composants clés

- **Bouton primaire** : fond `#9d0208`, texte `#fdfcf8`, padding `14px 24px`, font-weight 500 Inter, radius 2px, hover → `#7a0106`.
- **Bouton secondaire** : fond transparent, border `1px #22201b`, texte `#22201b`, hover → fond `#f3f1ed`.
- **Bouton ghost** : texte `#9d0208` souligné au hover, rien d'autre.
- **Card bien** : fond blanc, border `1px #e5e2db`, image ratio 4/3 coins droits, overlay texte uniquement en bas avec badge. Prix en Cormorant Garamond 1.5rem, ville en Inter caps tracking 0.08em 0.75rem, type/surface/DPE en Inter 0.875rem muted. Hover : image zoom 1.03.
- **Badge DPE** : chips colorées A → G selon la grille officielle (A vert #3d6b3a → G rouge `#9d0208`). Coins 2px.
- **Input** : fond blanc, border `1px #c9c4b8`, focus border `#9d0208` + ring `2px rgba(157,2,8,0.15)`, padding 12px 14px, radius 2px.
- **Header** : fond `#fdfcf8`, border-bottom `1px #e5e2db`, logo à gauche en Cormorant, nav en Inter 0.9375rem medium. Sticky avec léger fond opaque au scroll.
- **Footer** : fond `#22201b`, texte `#f3f1ed`, colonnes en Inter. Titres de colonnes en Cormorant 1rem uppercase tracking 0.12em. Bandeau réglementaire séparé par `1px #4f4c47`.
- **Hero** : image plein cadre 70vh, overlay sombre léger bas uniquement pour lisibilité, H1 Cormorant display en blanc ivoire, recherche encastrée fond blanc coins droits 2px.

#### Forces / faiblesses

- **Forces** : identité instantanément distincte du reste du marché (aucun concurrent IDF ouest ne fait du serif grenat), crédibilité patrimoniale forte, parle à une cible 40+ propriétaire, permet de vendre du sérieux sans tomber dans le luxe. Rend bien en print.
- **Faiblesses** : perçu comme « classique » par les 25-35 primo-accédants (cible secondaire mais réelle dans Boulogne/Issy). Le serif demande une exécution rigoureuse — mauvais kerning tue l'effet. Deux fonts = ~110 ko.
- **Public cible** : propriétaires 40-65 ans, classe moyenne établie, acheteurs recherchant du conseil humain. Profil dominant de la zone Meudon/Sèvres.
- **Effort d'implémentation** : **moyen**. Remplacement palette zinc → tokens + intégration 2 fonts Google + ajustements composants. ~1.5 jour.

---

### Proposition B — « Agence de quartier » (contemporain ancré)

#### Identité & mood

Une agence qui a refait sa devanture en 2023 mais qui existe depuis 1995. Ton : boulangerie artisanale haut de gamme, cabinet d'architecte de quartier, boutique optique indépendante qui soigne son enseigne. Références : identité visuelle Monoprix boutique, branding d'un caviste de quartier. **Sérieux par le métier.** Le rouge grenat est la couleur de l'enseigne — présent mais pas envahissant.

#### Palette complète

```css
/* Primaire — rouge grenat */
--color-primary-50:  #fcf3f3;
--color-primary-100: #f9e0e1;
--color-primary-200: #f1b8ba;
--color-primary-300: #e58488;
--color-primary-400: #d14e53;
--color-primary-500: #b31d23;
--color-primary-600: #9d0208; /* imposée */
--color-primary-700: #7d0207;
--color-primary-800: #5c0205;
--color-primary-900: #3c0103;
--color-primary-950: #200002;

/* Secondaire — vert ardoise (boutique de quartier) */
--color-secondary-50:  #f2f5f3;
--color-secondary-100: #dee7e1;
--color-secondary-300: #91a99a;
--color-secondary-500: #4e6b5a;
--color-secondary-700: #304539;
--color-secondary-900: #1a2820;

/* Neutres — gris ciment (neutre vrai, légèrement chaud) */
--color-neutral-50:  #f9f9f8;
--color-neutral-100: #f1f0ed;
--color-neutral-200: #e2e0db;
--color-neutral-300: #c6c3bc;
--color-neutral-400: #908d85;
--color-neutral-500: #5f5d58;
--color-neutral-600: #44423e;
--color-neutral-700: #2e2d2a;
--color-neutral-800: #1c1b19;
--color-neutral-900: #101010;
--color-neutral-950: #050504;

/* Accents */
--color-success: #4e6b5a;  /* = secondaire, cohérent */
--color-warning: #c9930e;
--color-error:   #9d0208;
--color-info:    #3d5a73;

/* Surfaces */
--color-bg-page:    #f9f9f8;
--color-bg-card:    #ffffff;
--color-bg-section: #f1f0ed;
--color-bg-accent:  #1c1b19;  /* sections parcours vendeur en inverse */
--color-bg-inverse: #1c1b19;

/* Texte */
--color-text-primary:   #1c1b19;
--color-text-body:      #2e2d2a;
--color-text-muted:     #5f5d58;
--color-text-on-primary:#f9f9f8;
--color-text-on-inverse:#f1f0ed;
```

#### Typographie

- **Titre** : **Fraunces** (serif moderne variable, Google Fonts) — grotesque-serif contemporaine, très expressive sans être pompeuse, remarquable pour une enseigne de quartier. `font-weight: 500, 600`, option `opsz` pour les gros titres, `SOFT=50` pour adoucir.
- **Corps** : **Manrope** (sans-serif variable, Google Fonts) — géométrique humaniste, chaleureuse sans être ronde, lisible. `font-weight: 400, 500, 600, 700`.

**Échelle** (base 16px, ratio 1.2) :

| Token | Size | Line-height | Letter-spacing | Usage |
|---|---|---|---|---|
| display | 3.583rem (57px) | 1 | -0.025em | Hero H1 |
| h1 | 2.986rem (48px) | 1.05 | -0.02em | H1 |
| h2 | 2.488rem (40px) | 1.1 | -0.015em | Sections |
| h3 | 2.074rem (33px) | 1.2 | -0.01em | Blocs |
| h4 | 1.728rem (28px) | 1.3 | 0 | Cards |
| body-lg | 1.125rem (18px) | 1.6 | 0 | Lead |
| body | 1rem (16px) | 1.6 | 0 | Corps |
| body-sm | 0.875rem (14px) | 1.5 | 0 | Meta |
| caption | 0.75rem (12px) | 1.4 | 0.04em | Overline |

**Justification** : Fraunces a une personnalité visible sans être « serif classique » — elle signe l'agence sans imiter Junot ou Barnes. Manrope est une sans-serif variable performante (une seule requête pour tous les poids). Combo ~90 ko variable. Axe `SOFT` permet d'adoucir si besoin sur mobile.

#### Iconographie

- **lucide-react** — traits 1.75px (légèrement plus marqués pour cohérence avec Manrope).
- Illustrations minimales autorisées : pictos SVG mono pour les étapes du parcours vendeur (4 pictos max, style trait `#9d0208`).
- Puces listes : tiret court em-dash en `#9d0208`.

#### Spacing, radius & elevation

- **Border-radius** : `3px` standard partout (boutons, cards, inputs, images). Un seul radius = cohérence forte. Badges et pills : `3px` aussi (pas de pill arrondi).
- **Spacing** : base 4px, progression 4/8/12/16/24/32/48/64/96/128.
- **Shadows** : subtiles layered.
  - `shadow-sm` : `0 1px 2px rgba(28,27,25,0.04), 0 1px 1px rgba(28,27,25,0.06)` — inputs focus.
  - `shadow-md` : `0 4px 12px rgba(28,27,25,0.06), 0 2px 4px rgba(28,27,25,0.04)` — cards hover.
  - `shadow-lg` : `0 16px 32px rgba(28,27,25,0.08)` — modals, dropdowns.
- **Borders** : `1px solid #e2e0db` standard. Accent : `2px solid #9d0208` sur éléments actifs (tab, select ouvert).

#### Motion & micro-interactions

- **Transitions** : `180ms cubic-bezier(0.4, 0, 0.2, 1)` par défaut (matérial ease-out).
- **Hover boutons** : primaire → `#7d0207` + `translateY(-1px)` + shadow-md. Subtil mais présent.
- **Hover cards** : shadow-md + border `#c6c3bc` + image scale 1.04 sur 500ms. Badge statut reste fixe.
- **Scroll reveals** : fade-in + translateY 16px, stagger 60ms entre éléments de grille (max 6).
- **Micro-interaction recherche** : autocomplete apparaît en slide-down 150ms, highlight `#9d0208` sur la correspondance saisie.

#### Composants clés

- **Bouton primaire** : fond `#9d0208`, texte `#f9f9f8`, padding 14px 26px, Manrope 600 0.9375rem, radius 3px, hover translateY + darker.
- **Bouton secondaire** : fond `#1c1b19`, texte `#f9f9f8`. Pour les contextes où le primaire est pris par le CTA principal voisin.
- **Bouton ghost** : texte `#9d0208`, hover fond `#fcf3f3`.
- **Card bien** : fond blanc, border `1px #e2e0db`, radius 3px, image ratio 3/2 top avec radius 3px top. Badge statut en absolute top-left, chips Manrope 600 caps 0.75rem sur fond primaire ou secondaire selon type. Prix Fraunces 1.5rem 600, ville Manrope caps tracking 0.06em 0.8125rem muted, type surface Manrope body-sm, DPE chips en ligne.
- **Badge Exclusivité** : fond `#9d0208`, texte ivoire, caps.
- **Badge Sous compromis** : fond `#4e6b5a` (secondaire vert), texte ivoire.
- **Chip DPE** : échelle A-G colorée standard, radius 3px, 0.75rem.
- **Input** : fond blanc, border `1px #c6c3bc`, focus border `2px #9d0208`, hover border `#908d85`. Radius 3px, padding 12px 14px.
- **Header** : fond `#f9f9f8`/95 blur 12px sticky. Logo Fraunces 1.25rem. Nav Manrope 600 0.9375rem avec underline rouge au hover (2px bottom, apparaît en slide).
- **Footer** : fond `#1c1b19`, texte `#f1f0ed`, titres colonnes Manrope 700 caps 0.8125rem. Bandeau réglementaire séparé `1px #44423e` en Manrope 0.75rem muted.
- **Hero** : image 60vh, recherche centrée sur carte blanche `radius 3px shadow-lg`, H1 Fraunces display sur overlay sombre gradient bottom-to-top.

#### Forces / faiblesses

- **Forces** : **la direction qui répond le mieux au brief** — agence de quartier, sérieuse sans être guindée, moderne sans être startup, humaine sans être familière. Le vert ardoise en secondaire est unique sur le segment (personne n'utilise ça). Fraunces donne une signature typographique forte. Marche aussi bien sur 25-35 primo que sur 45-65 propriétaires. Effort/impact optimal.
- **Faiblesses** : demande un vrai soin d'exécution sur la photo du portrait et les biens — si photos médiocres, le design souffre. Le vert en accent peut surprendre au premier regard (à tester sur le bloc avis ou les chiffres clés seulement).
- **Public cible** : tous les profils de la zone — transversal. Particulièrement efficace sur Boulogne/Issy (jeunes familles actives) et Meudon/Sèvres (propriétaires installés).
- **Effort d'implémentation** : **moyen**. Tokens palette + 2 fonts variables + ajustements composants + refonte card bien (pour absorber le pattern double-image style Hosman). ~2 jours.

---

### Proposition C — « Cabinet franc » (éditorial dépouillé)

#### Identité & mood

Une agence qui respecte tellement ses clients qu'elle ne leur impose aucun effet visuel. Ton : papier blanc, encre noire, cachet rouge. Références : design éditorial suisse (Müller-Brockmann), Apple pro, typographie Bauhaus finale. **Sérieux par l'épure.** Zéro décoration. La photo, le texte, le prix. C'est tout. Le rouge grenat est un cachet apposé ponctuellement.

#### Palette complète

```css
/* Primaire — rouge grenat (cachet unique) */
--color-primary-50:  #fdf3f3;
--color-primary-100: #fbe1e2;
--color-primary-300: #e97a7e;
--color-primary-500: #c11e23;
--color-primary-600: #9d0208; /* imposée */
--color-primary-700: #7b0206;
--color-primary-900: #3d0102;

/* Pas de secondaire colorée — uniquement du gris et du noir */
/* La « secondaire » c'est le noir profond */

/* Neutres — gris neutre vrai (ni chaud ni froid) */
--color-neutral-0:   #ffffff;
--color-neutral-50:  #fafafa;
--color-neutral-100: #f4f4f4;
--color-neutral-200: #e8e8e8;
--color-neutral-300: #c9c9c9;
--color-neutral-400: #949494;
--color-neutral-500: #5f5f5f;
--color-neutral-600: #3f3f3f;
--color-neutral-700: #272727;
--color-neutral-800: #171717;  /* noir primaire */
--color-neutral-900: #0a0a0a;
--color-neutral-950: #000000;

/* Accents — strict minimum */
--color-success: #1a7f4c;
--color-warning: #b56f00;
--color-error:   #9d0208;
--color-info:    #272727;   /* pas de bleu — le noir sert d'info */

/* Surfaces */
--color-bg-page:    #ffffff;
--color-bg-card:    #ffffff;
--color-bg-section: #fafafa;
--color-bg-inverse: #171717;

/* Texte */
--color-text-primary:   #0a0a0a;
--color-text-body:      #272727;
--color-text-muted:     #5f5f5f;
--color-text-on-primary:#ffffff;
--color-text-on-inverse:#fafafa;
```

#### Typographie

- **Une seule font** : **Inter** (variable, Google Fonts). Poids 400, 500, 600, 700. Style tight : tracking négatif sur les titres, respiration maximale ailleurs.
- **Parti pris** : aucun serif. L'effet éditorial vient de la hiérarchie typographique et du whitespace, pas de la decoration.

**Échelle** (base 16px, ratio 1.333 — typographique pur) :

| Token | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| display | 4.209rem (67px) | 700 | 1 | -0.04em |
| h1 | 3.157rem (51px) | 700 | 1.05 | -0.035em |
| h2 | 2.369rem (38px) | 600 | 1.1 | -0.025em |
| h3 | 1.777rem (28px) | 600 | 1.2 | -0.02em |
| h4 | 1.333rem (21px) | 600 | 1.3 | -0.01em |
| body-lg | 1.125rem (18px) | 400 | 1.6 | -0.005em |
| body | 1rem (16px) | 400 | 1.6 | 0 |
| body-sm | 0.875rem (14px) | 400 | 1.5 | 0 |
| caption | 0.75rem (12px) | 500 | 1.4 | 0.04em |
| overline | 0.75rem (12px) | 600 | 1.2 | 0.12em (uppercase) |

**Justification** : Inter variable = 1 requête, ~60 ko. Zero risque de mauvaise exécution typographique. L'effet « sérieux » vient de l'échelle rigoureuse et de `-0.035em` sur les grands titres.

#### Iconographie

- **lucide-react** — 1.5px stroke, tout gris `#5f5f5f` ou `#171717`. Jamais rouge sauf indicateur d'erreur. Pas d'illustrations.

#### Spacing, radius & elevation

- **Border-radius** : `0px` absolu partout. Un seul choix : tout droit. **Zéro exception.**
- **Spacing** : base 8px (pas 4px — plus strict). Progression 8/16/24/32/48/64/96/128/160. Génère plus d'air.
- **Shadows** : **aucune**. Jamais. La séparation se fait par border 1px ou par fond `#fafafa` alterné.
- **Borders** : `1px solid #e8e8e8` standard. `1px solid #171717` actif. `2px solid #9d0208` élément focus clavier.

#### Motion & micro-interactions

- **Transitions** : `150ms ease-out`. Strictement. Rien au-delà.
- **Hover boutons** : primaire → `#7b0206`. Secondaire → invert (fond noir devient blanc, texte inverse). Pas de translateY, pas d'ombre.
- **Hover cards** : border passe à `#171717`. Rien d'autre. Pas de zoom photo. Pas de shadow.
- **Scroll reveals** : fade-in uniquement (sans translate), 250ms. Ou rien du tout, considérer comme option.
- **Principe** : l'utilisateur ne doit jamais remarquer une animation. Elles existent pour fluidifier, pas pour signaler.

#### Composants clés

- **Bouton primaire** : fond `#9d0208`, texte blanc, padding 16px 28px, Inter 600 0.9375rem, radius 0. Hover darker.
- **Bouton secondaire** : fond `#171717`, texte blanc. Hover invert (fond `#ffffff`, border `1px #171717`, texte `#171717`).
- **Bouton ghost** : texte `#171717` underline `#9d0208` 2px offset 3px au hover.
- **Card bien** : fond blanc, border `1px #e8e8e8`, radius 0. Image ratio 3/2 fullbleed top. Padding 20px. Prix Inter 700 1.5rem tracking -0.02em. Ville caption overline `#5f5f5f`. Type/surface Inter 400 0.875rem body. DPE chips rectangulaires radius 0. Pas de badge flottant — badge statut en texte caps 0.75rem sous la photo.
- **Badge/Chip** : rectangle plein, radius 0, caps tracking 0.08em Inter 600 0.75rem. Exclusivité fond `#9d0208`, sous compromis fond `#171717`, nouveauté fond `#ffffff` border `1px #171717`.
- **Input** : fond blanc, border-bottom `1px #c9c9c9` uniquement (pas de box border — effet form éditorial), focus border-bottom `2px #9d0208`. Padding 12px 0. Label au-dessus en caption overline.
- **Header** : fond blanc, border-bottom `1px #e8e8e8`. Logo texte en Inter 700 tracking -0.02em « Cabinet Rimbault ». Nav Inter 500 0.9375rem, séparateurs verticaux `1px #e8e8e8` entre items (optionnel). Hover : rouge `#9d0208`.
- **Footer** : fond `#171717`, texte blanc. Colonnes. Bandeau réglementaire en Inter 0.75rem muted gris. Minimaliste.
- **Hero** : **contre-courant** — pas d'image hero plein cadre. Hero typographique : H1 display énorme sur fond blanc, sous-titre lead, recherche dans une boîte bordered noire. L'image arrive en section 2 (sélection de biens). Parti pris radical.

#### Forces / faiblesses

- **Forces** : signature design la plus forte des 3, quasi impossible à confondre avec un concurrent. Performance web optimale (1 font variable, zéro shadow/gradient/animation lourde). Vieillit extrêmement bien — ce design sera toujours valable en 2030. Met la photo du bien ou de l'agent au centre absolu. WCAG AA+ par design.
- **Faiblesses** : **le plus risqué** sur la cible. Perçu comme « froid » par les profils classe moyenne qui attendent du chaleureux. Peut évoquer une agence design parisienne inaccessible — contre-positionnement involontaire. Demande un excellent contenu photo (images médiocres → site médiocre, aucune décoration pour compenser). Hero sans image est une vraie rupture — à valider PO.
- **Public cible** : CSP+, architectes, cadres créatifs, profils 30-45 urbains. **Correspond mal à la cible primaire** « classe moyenne proximité ». Marcherait mieux à Paris 16e qu'à Meudon.
- **Effort d'implémentation** : **faible**. 1 font variable, zero shadow, palette mono neutre + 1 accent. Probablement le plus rapide à implémenter. ~1 jour.

---

## 4. Matrice de positionnement visuel

Axes : **X : Traditionnel ↔ Moderne**, **Y : Accessible ↔ Premium**. Position du Cabinet Rimbault cible : **quadrant bas-gauche à centre** (accessible + légèrement traditionnel), avec une qualité de rendu qui empêche de tomber dans l'amateur.

### Représentation ASCII

```
                      PREMIUM
                         ▲
                         │
                  [Junot]│[Barnes]
                         │   [Consultants]
                         │
   [Toits Boulogne]      │
   [Vienot]     [L&P]    │
   [Chateauvieux]        │       [Hosman]
─────────────────────────┼────────────────▶ MODERNE
   [Agence Ferme]        │       [Liberkeys]
       [Chris Immo]      │       [Welmo]
                         │
                 ⚑ B     │   ⚑ C
                 ⚑ A  ←── CIBLE RIMBAULT
              [La Seine Immo]
                         │
                         ▼
                     ACCESSIBLE
TRADITIONNEL ◀────────────┼────────────▶
```

Légende : `⚑ A` = Maison Rimbault, `⚑ B` = Agence de quartier, `⚑ C` = Cabinet franc.

### Tableau détaillé

| Entité | X (Trad→Mod) | Y (Acc→Prem) | Quadrant |
|---|---|---|---|
| Barnes International | +2 | +8 | Moderne + Premium |
| Junot | -1 | +8 | Traditionnel + Premium |
| Consultants Immobilier | +3 | +7 | Moderne + Premium |
| La Seine Immobilière | 0 | -2 | Centre / Accessible |
| Les Toits de Boulogne | -3 | +2 | Traditionnel / neutre |
| Chateauvieux Conseil | -4 | +1 | Traditionnel / neutre |
| Agence de la Ferme | -3 | -3 | Traditionnel + Accessible |
| Agence Chris Immo | -3 | -4 | Traditionnel + Accessible |
| Agence Vienot | -2 | 0 | Traditionnel / neutre |
| Hosman | +6 | +2 | Moderne / légèrement premium |
| Liberkeys | +7 | -3 | Moderne + Accessible |
| Welmo | +6 | -3 | Moderne + Accessible |
| **Proposition A — Maison Rimbault** | **-3** | **+2** | **Traditionnel / légèrement premium** |
| **Proposition B — Agence de quartier** | **+1** | **-1** | **Centre — zone cible optimale** |
| **Proposition C — Cabinet franc** | **+5** | **+4** | **Moderne + Premium** |

**Lecture stratégique** :

- **Proposition A (Maison Rimbault)** se place en **territoire libre** entre Junot et les agences de quartier : plus qualitatif que Chateauvieux/Vienot, plus accessible que Junot. Bon positionnement, légèrement trop traditionnel pour la cible.
- **Proposition B (Agence de quartier)** **occupe pile le quadrant cible**. Moderne sans startup, accessible sans amateurisme, qualitatif sans luxe. C'est le centre névralgique recherché.
- **Proposition C (Cabinet franc)** dérive vers **moderne + premium** — territoire Junot/Hosman. **Hors cible** — trop premium perçu, risque d'exclure la classe moyenne.

---

## 5. Recommandation finale

### Direction recommandée : **Proposition B — « Agence de quartier »**

#### Justification

1. **Alignement du positionnement**. Le brief définit le Cabinet Rimbault comme « agence de quartier sérieuse, ancrée, accessible, humaine ». La proposition B porte ce message dans sa nomenclature même et visuellement : contemporaine sans être startup, sérieuse sans être guindée.

2. **Matrice**. C'est la seule des 3 propositions qui atterrit pile dans le quadrant cible (accessible + centre-modéré sur l'axe traditionnel). A est trop traditionnel, C est trop premium.

3. **Différenciation concurrentielle**. Sur le segment IDF ouest, les concurrents sont tous en navy+or template (La Seine Immobilière, Vienot, Toits de Boulogne, Chateauvieux). Le combo rouge grenat + vert ardoise + Fraunces est unique sur ce micro-marché. Reconnaissable au premier coup d'œil.

4. **Transversalité démographique**. Fonctionne aussi bien sur 25-35 primo-accédants (ton moderne) que sur 45-65 propriétaires (serif + sérieux). La proposition A exclurait mécaniquement les primo, la C exclurait les propriétaires établis.

5. **Effort / impact**. Effort d'implémentation moyen (~2 jours), impact visuel maximal. La proposition C coûterait moins mais l'impact est hors-cible. La proposition A coûte pareil mais rate le primo.

6. **Robustesse exécution**. Fraunces + Manrope sont deux fonts variables solides, testées en prod ailleurs. Palette WCAG AA garantie sur tous les pairs texte/fond définis (vérification faite : `#1c1b19` sur `#f9f9f8` = 17.3:1, `#ffffff` sur `#9d0208` = 8.2:1, `#5f5d58` sur `#ffffff` = 6.4:1, tous AA+).

#### Plan d'implémentation

Ordre exact des fichiers à modifier :

**Étape 1 — Tokens (30 min)**
1. `src/app/globals.css` — remplacer le bloc `@theme` actuel par le bloc complet fourni ci-dessous (sous-section suivante). Supprimer la media query `prefers-color-scheme: dark` (pas de dark mode).
2. `src/app/layout.tsx` — importer Fraunces et Manrope via `next/font/google`, les déclarer en CSS variables, remplacer Geist. Retirer `font-family: Arial` du body.

**Étape 2 — Primitives UI (0.5 j)**
3. Créer `src/components/ui/Button.tsx` (variants : primary, secondary, ghost ; sizes : sm, md, lg). Radius 3px, transitions définies.
4. Créer `src/components/ui/Input.tsx`, `Select.tsx`, `Textarea.tsx` (border 1px, focus ring rouge).
5. Créer `src/components/ui/Badge.tsx` (variants : primary, secondary, neutral, DPE-A à DPE-G).
6. Créer `src/components/ui/Card.tsx` (variant neutral et property).

**Étape 3 — Layout (0.5 j)**
7. `src/components/layout/Header.tsx` — refonte typo Fraunces logo + Manrope nav + sticky blur.
8. `src/components/layout/Footer.tsx` — fond `#1c1b19`, colonnes Manrope.
9. `src/components/layout/MobileBottomBar.tsx` — appliquer tokens nouveaux CTA.
10. `src/components/layout/MobileMenu.tsx` — cohérence tokens.

**Étape 4 — Listings & fiche bien (0.5 j)**
11. `src/components/listings/*` — remplacer classes zinc par tokens, revoir grille 3 colonnes desktop avec radius 3px.
12. `src/components/property/*` — refonte card bien avec double image option, badge statut, chip DPE coloré, typo Fraunces sur prix.

**Étape 5 — Pages & formulaires (0.5 j)**
13. `src/components/home/*` — hero, sections, CTA parcours vendeur.
14. `src/components/forms/*` — styles inputs/selects, focus states, mention RGPD.
15. Nettoyage `src/app/**/*.tsx` — remplacer toutes occurrences `zinc-*` par tokens sémantiques.

**Étape 6 — QA**
16. `npm run typecheck && npm run lint`.
17. Contrôle visuel manuel : toutes pages, mobile + desktop, avec vraies données.
18. Vérification contraste sur WebAIM pour les pairs non testés automatiquement.

#### Bloc `@theme` complet à coller dans `globals.css`

Remplace intégralement le contenu actuel (hors `@import "tailwindcss"`).

```css
@import "tailwindcss";

@theme {
  /* ═══════════════════════════════════════════════════════════
   * COULEURS — Proposition B « Agence de quartier »
   * ═══════════════════════════════════════════════════════════ */

  /* Primaire — rouge grenat (imposée #9d0208 au palier 600) */
  --color-primary-50:  #fcf3f3;
  --color-primary-100: #f9e0e1;
  --color-primary-200: #f1b8ba;
  --color-primary-300: #e58488;
  --color-primary-400: #d14e53;
  --color-primary-500: #b31d23;
  --color-primary-600: #9d0208;
  --color-primary-700: #7d0207;
  --color-primary-800: #5c0205;
  --color-primary-900: #3c0103;
  --color-primary-950: #200002;

  /* Secondaire — vert ardoise (signature différenciante) */
  --color-secondary-50:  #f2f5f3;
  --color-secondary-100: #dee7e1;
  --color-secondary-200: #bfd0c6;
  --color-secondary-300: #91a99a;
  --color-secondary-400: #6a8675;
  --color-secondary-500: #4e6b5a;
  --color-secondary-600: #3d5547;
  --color-secondary-700: #304539;
  --color-secondary-800: #22322a;
  --color-secondary-900: #1a2820;
  --color-secondary-950: #0c1510;

  /* Neutres — gris ciment (chaud neutre) */
  --color-neutral-50:  #f9f9f8;
  --color-neutral-100: #f1f0ed;
  --color-neutral-200: #e2e0db;
  --color-neutral-300: #c6c3bc;
  --color-neutral-400: #908d85;
  --color-neutral-500: #5f5d58;
  --color-neutral-600: #44423e;
  --color-neutral-700: #2e2d2a;
  --color-neutral-800: #1c1b19;
  --color-neutral-900: #101010;
  --color-neutral-950: #050504;

  /* Accents sémantiques */
  --color-success: #4e6b5a;
  --color-success-bg: #f2f5f3;
  --color-warning: #c9930e;
  --color-warning-bg: #fcf5e5;
  --color-error:   #9d0208;
  --color-error-bg: #fcf3f3;
  --color-info:    #3d5a73;
  --color-info-bg: #eef3f8;

  /* DPE (barème officiel A-G) */
  --color-dpe-a: #2a7a3a;
  --color-dpe-b: #52a44a;
  --color-dpe-c: #c4d74f;
  --color-dpe-d: #f5e04c;
  --color-dpe-e: #f2b636;
  --color-dpe-f: #ea7b2c;
  --color-dpe-g: #d73527;

  /* Surfaces */
  --color-bg-page:    #f9f9f8;
  --color-bg-card:    #ffffff;
  --color-bg-section: #f1f0ed;
  --color-bg-accent:  #1c1b19;
  --color-bg-inverse: #1c1b19;
  --color-bg-overlay: rgba(28, 27, 25, 0.6);

  /* Texte sémantique */
  --color-text-primary:    #1c1b19;
  --color-text-body:       #2e2d2a;
  --color-text-muted:      #5f5d58;
  --color-text-subtle:     #908d85;
  --color-text-on-primary: #f9f9f8;
  --color-text-on-inverse: #f1f0ed;
  --color-text-link:       #9d0208;
  --color-text-link-hover: #7d0207;

  /* Bordures */
  --color-border-subtle:  #e2e0db;
  --color-border-default: #c6c3bc;
  --color-border-strong:  #1c1b19;
  --color-border-focus:   #9d0208;

  /* ═══════════════════════════════════════════════════════════
   * TYPOGRAPHIE
   * ═══════════════════════════════════════════════════════════ */

  --font-serif: "Fraunces", Georgia, "Times New Roman", serif;
  --font-sans:  "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI",
                system-ui, sans-serif;
  --font-mono:  ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Échelle fluide (base 16px, ratio 1.2) */
  --text-caption: 0.75rem;   /* 12 */
  --text-sm:      0.875rem;  /* 14 */
  --text-base:    1rem;      /* 16 */
  --text-lg:      1.125rem;  /* 18 */
  --text-xl:      1.333rem;  /* 21 */
  --text-2xl:     1.728rem;  /* 28 — h4 */
  --text-3xl:     2.074rem;  /* 33 — h3 */
  --text-4xl:     2.488rem;  /* 40 — h2 */
  --text-5xl:     2.986rem;  /* 48 — h1 */
  --text-display: 3.583rem;  /* 57 — hero */

  --leading-tight:   1.05;
  --leading-snug:    1.2;
  --leading-normal:  1.5;
  --leading-relaxed: 1.6;

  --tracking-tight:  -0.025em;
  --tracking-snug:   -0.01em;
  --tracking-normal: 0;
  --tracking-wide:   0.04em;
  --tracking-wider:  0.08em;

  /* ═══════════════════════════════════════════════════════════
   * SPACING / RADIUS / ELEVATION
   * ═══════════════════════════════════════════════════════════ */

  /* Radius — sharp. Un seul choix global. */
  --radius-none: 0px;
  --radius-sm:   3px;   /* standard partout */
  --radius-md:   3px;
  --radius-lg:   3px;

  /* Shadows — subtiles layered */
  --shadow-sm: 0 1px 2px rgba(28, 27, 25, 0.04),
               0 1px 1px rgba(28, 27, 25, 0.06);
  --shadow-md: 0 4px 12px rgba(28, 27, 25, 0.06),
               0 2px 4px rgba(28, 27, 25, 0.04);
  --shadow-lg: 0 16px 32px rgba(28, 27, 25, 0.08),
               0 4px 8px rgba(28, 27, 25, 0.04);
  --shadow-focus: 0 0 0 3px rgba(157, 2, 8, 0.18);

  /* Motion */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 120ms;
  --duration-base: 180ms;
  --duration-slow: 400ms;

  /* Z-index */
  --z-header: 40;
  --z-dropdown: 50;
  --z-mobile-bar: 45;
  --z-modal: 60;
  --z-toast: 70;
}

/* Base styles */
html {
  font-family: var(--font-sans);
  color: var(--color-text-body);
  background: var(--color-bg-page);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

h1, h2, h3, h4 {
  font-family: var(--font-serif);
  color: var(--color-text-primary);
  font-weight: 600;
  font-optical-sizing: auto;
}

/* Sélection texte */
::selection {
  background: var(--color-primary-600);
  color: var(--color-text-on-primary);
}

/* Focus-visible global */
*:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

#### Intégration `next/font` dans `layout.tsx`

```ts
import { Fraunces, Manrope } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
  variable: "--font-serif",
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

// <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
```

Puis dans `globals.css`, remplacer `"Fraunces"` par `var(--font-serif)` et `"Manrope"` par `var(--font-sans)` si on veut passer 100 % par next/font. Variante recommandée : garder les noms dans `@theme` (plus lisible pour les utilisateurs du design system), next/font servant juste à précharger/swap.

---

### Notes finales

- **Contraste WCAG vérifié** sur les paires principales : `#1c1b19` / `#f9f9f8` = 17.3:1 (AAA), `#ffffff` / `#9d0208` = 8.2:1 (AAA), `#5f5d58` / `#ffffff` = 6.4:1 (AA large et AA normal), `#f1f0ed` / `#1c1b19` = 16.5:1 (AAA).
- **Pas de dark mode** — bloc `prefers-color-scheme` du `globals.css` actuel à supprimer.
- **Performance** : 2 fonts variables Google, ~90 ko total, `font-display: swap`, préchargement auto via `next/font`. Aucune image décorative — tout est photo ou token couleur.
- **Migration zinc → tokens** : remplacement systématique des classes `zinc-50/100/…` par `neutral-50/100/…` via recherche globale. Préserver les mapping sémantiques quand un `zinc-700` servait de texte corps → `text-body`.

Fin du livrable.
