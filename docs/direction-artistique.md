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
| Brun-noir chaud | `bg-inverse` `#1C1B19` | Footer (clôture de page). L'ardoise ne s'utilise **jamais en masse**. |

## Typographie

- **Display** : Familjen Grotesk — semibold, grands corps, interlignage aéré.
- **Texte** : Manrope.
- Pas de serif. Les eyebrows de section restent en sans uppercase espacé
  (`tracking` large) avec filet court.
- Italique display ponctuel autorisé pour un mot de douceur dans un titre
  (« choisie avec *soin* ») — maximum un par page.

## Principe structurant : « images arrondies, contenu ouvert »

La rondeur et la chaleur vivent sur les **photos** (coins arrondis), les
boutons et les chips. Le texte se pose **nu sur le crème** — sans carte, sans
bordure, sans ombre. Les cartes sont réservées aux **objets fonctionnels** :
biens (le produit), avis (citations), bannière CTA, formulaires et l'aperçu
du tunnel d'estimation. Les sections se séparent par l'espace ou par une
bande teintée **pleine largeur** (bord à bord) — jamais par des conteneurs
encadrés arrondis. Le hero est une bande photo pleine largeur fondue dans un
panneau lumineux dégradé derrière le texte.

## Grammaire des objets

- **Cartes douces** : `rounded-lg` (8 px), fond `bg-card`, **ombre diffuse
  légère** (`shadow-md`) — pas de liserés fins gris comme structure
  principale (une bordure `border-subtle` peut coexister avec l'ombre, jamais
  seule en grille dense).
- **Bannière CTA** : `rounded-xl` (12 px) — seule exception au rayon 8.
  Hero et bande vendeur sont des sections pleine largeur, pas des conteneurs.
- **Pastilles numérotées** : cercle `secondary-50`, chiffre ardoise — pour
  toute séquence réelle (étapes d'estimation, process de vente).
- **Chips pilules** : micro-réassurance sous les CTA (« Gratuit · Sans
  engagement · Réponse rapide »).
- **Icônes fonctionnelles** : lucide, petites (≤ 24 px), trait fin.
  **Pictos décoratifs** : jamais de bibliothèque — les pictos maison au trait
  (`src/components/home/pictos.tsx`, grenat, même esprit croquis que le pont)
  pour les engagements et équivalents. Pastilles rondes numérotées : ardoise
  pleine, chiffre blanc (timeline) ou fond ardoise clair (cartes).
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

## Mock de référence (variante finale validée, 2026-09-01)

Hero : bande photo pleine largeur, panneau lumineux dégradé derrière le
texte. Sélection : cartes blanches (le produit) sur crème, pastille ronde
ardoise sur l'eyebrow. Bande vendeur : `secondary-50` pleine largeur, pont
au trait grand en haut à droite, timeline verticale 3 étapes (pastilles
ardoise pleines reliées) concluant sur le CTA + chips, aperçu cliquable de
l'étape 1 du tunnel légèrement incliné posé sous le pont. Engagements :
4 colonnes ouvertes, pictos maison au trait grenat. Avis : cartes + badge
Google. Bannière : grenat + photo vitrine + chips. Footer : brun-noir chaud.
