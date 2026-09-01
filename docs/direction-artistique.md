# Direction artistique — Cabinet Rimbault

> **Statut : figée le 2026-09-01** après 4 itérations de mocks validées par le
> product owner. Ce document est la référence unique pour toute décision
> visuelle, et le **préambule obligatoire de tout prompt de génération de
> mock** (le copier en tête de prompt avec les screenshots de référence).

## Positionnement visuel : « moderne chaleureux »

Cabinet de quartier indépendant, un interlocuteur unique, depuis 2009. La
confiance est portée par le **fond** (honoraires affichés, avis Google réels,
mentions réglementaires, localisation honnête) — la forme peut donc être
chaleureuse et légère, esprit consumer moderne (référence assumée : Airbnb),
**tenue** par une palette patrimoniale et des garde-fous stricts. Jamais
solennel (notaire), jamais startup (proptech).

La page `/estimation` est la page de référence historique de cette grammaire :
en cas de doute, faire comme elle.

## Palette — rôles stricts

| Couleur | Valeur | Rôle |
|---|---|---|
| Grenat profond | `#720110` (`primary-600`) | **Action uniquement** : CTA, liens, états actifs. Jamais en masse décorative, jamais éclairci en corail. |
| Vert ardoise | `#4E6B5A` (`secondary-500`) | **Information & réassurance** : pastilles, numéros d'étapes, icônes décoratives, puces. |
| Ardoise clair | `#F2F5F3` (`secondary-50`) | Fonds teintés des sections « ancre » et des pastilles. |
| Crème chaud | `#F9F6EF` / `#F7F3EA` | Fonds de page et alternance de sections. Jamais de blanc pur ni de gris froid en fond. |
| Brun-noir | `#1C1B19` | Texte principal. |
| Ardoise sombre | `secondary-900` | Footer (clôture de page). |

## Typographie

- **Display** : Familjen Grotesk — semibold, grands corps, interlignage aéré.
- **Texte** : Manrope.
- Pas de serif. Les eyebrows de section restent en sans uppercase espacé
  (`tracking` large) avec filet court.
- Italique display ponctuel autorisé pour un mot de douceur dans un titre
  (« choisie avec *soin* ») — maximum un par page.

## Grammaire des objets

- **Cartes douces** : `rounded-lg` (8 px), fond `bg-card`, **ombre diffuse
  légère** (`shadow-md`) — pas de liserés fins gris comme structure
  principale (une bordure `border-subtle` peut coexister avec l'ombre, jamais
  seule en grille dense).
- **Conteneurs de section** (hero en carte, bloc vendeur teinté, bannière
  CTA) : `rounded-2xl` (16 px) — seule exception au rayon 8, réservée aux
  grands conteneurs pleine largeur.
- **Pastilles numérotées** : cercle `secondary-50`, chiffre ardoise — pour
  toute séquence réelle (étapes d'estimation, process de vente).
- **Chips pilules** : micro-réassurance sous les CTA (« Gratuit · Sans
  engagement · Réponse rapide »).
- **Icônes** : lucide, petites (≤ 24 px), trait fin (`strokeWidth` 1.5–1.75).
  **Grenat fin** dans les cartes de contenu (étapes, engagements — cf. mock) ;
  **ardoise** pour les pastilles rondes et puces informationnelles. Les
  grandes icônes-illustrations (40 px+) sont bannies.
- Une seule section « ancre » teintée (`secondary-50`) ou colorée par page,
  le reste respire sur crème.
- **Vérification** : toute passe design se valide par **screenshot Playwright**
  (1440 px + 390 px) comparé au mock, jamais par lecture du HTML seul.

## Imagerie

- **Le lieu, jamais la personne** : l'agent refuse d'apparaître. On incarne le
  cabinet par sa **vitrine** (devanture réelle, `public/hero-agence.jpg`), le
  quartier, et les photos réelles des biens.
- **Illustration au trait** : repères locaux d'Asnières (le pont d'Asnières
  sur la Seine) en trait fin monochrome, en fond discret — signature graphique
  du site. Fichier SVG fourni par le PO (slot prévu dans les composants).
- Pas de photos d'ambiance génériques quand une image réelle existe.

## Voix éditoriale

« Nous » partout (décision de l'agent — il incarne le cabinet, pas sa
personne). Sobre, local, concret. Apostrophes typographiques. Le sérieux passe
par la précision (chiffres réels, engagements vérifiables), jamais par
l'emphase.

## Interdits

- Photo de l'agent, sous toute forme.
- Serif à fort contraste, grands numéros éditoriaux solennels (01. en 60 px).
- Emoji, illustrations 3D, dégradés flashy, couleurs pastel « fun ».
- Radius 24 px généralisé (pilule = chips/badges uniquement).
- Codes portail immobilier (moteur de recherche en hero, grilles de filtres).
- Grenat en aplat décoratif (exception : la bannière CTA estimation).

## Mocks de référence

Les mocks validés (2026-09-01) sont la source visuelle : hero en carte
arrondie flottante (texte crème / photo), sélection en cartes douces, bloc
vendeur sur fond `secondary-50` avec pont au trait + 3 cartes d'étapes à
pastilles, engagements en 4 cartes douces, avis Google en cartes, bannière
grenat + photo vitrine + chips, footer ardoise sombre.
