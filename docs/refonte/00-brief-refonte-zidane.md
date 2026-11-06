# 00 — Brief de refonte consolidé (Zidane)

> Document de référence de la phase d'implémentation. **En cas de désaccord entre ce document et les documents 01 à 05, ce document l'emporte.**
> Revue n° 1 du 30/10/2026. Sources relues intégralement : 01 (Bergkamp), 02 (Maldini), 03 + planche + 20 captures (Pirlo), 04 (Xavi), 05 + dépenses + 19 images d'exploration (Cantona), `notes.txt`, `src/lib/agency.ts`, `cabinet-rimbault-api` (route `properties`, modèle `Evaluation`), docs Next 16 bundlées.
> **Revue n° 2 du 30/10/2026** : relecture des révisions de Pirlo (doc 03 rév. 2), de Xavi (doc 04 mis à jour), de la phase 2 de Cantona (7 finales, planches crème et crème soutenu, `mesures.json`, 3 logotypes et le monogramme) et du registre de dépenses. Nouveaux arbitrages A19 à A28 (§2), illustrations validées ou refusées (§8), budget recalculé (§8), corrections par agent (§12). Vérifié dans l'API : `soldAt` existe en base mais **n'est pas exposé** par la route publique (A22). Le code de `src/` n'a pas encore été touché : seules les finales sont dans `public/illustrations/`.
> **Revue n° 3 du 30/10/2026** : relecture des docs 01 (encadré des écarts), 03 rév. 3 + planche et captures régénérées, 04 mis à jour, 05 §8 (revue n° 2 appliquée), registre de dépenses, planches d'illustrations régénérées, `ill-03.svg`, `opengraph-image.png`, `icon.svg`, `src/components/brand/*`. Vérifié dans l'admin : `dateReferenceEnergie` est la « Date d'indexation du prix de l'énergie » (A29, ferme l'ancien A8). Vérifié dans l'API : la confirmation d'estimation fait `Number(body.rooms)`, donc « 5+ » donnerait « Pièces : NaN » (A34). Nouveaux arbitrages A29 à A35, verdict au §13. **Verdict : approuvé pour l'implémentation**, avec les corrections du §13 à appliquer au démarrage de chaque lot.
> Vérifications faites pendant la revue n° 1 : la planche utilise des données réelles (09.362 : 96 lots, 1 124 €, GES 8, DPE 264, taxe foncière 1 196 €, conformes à `e2e/fixtures/details.json`). La liste publique accepte `status=VENDU|LOUE`, donc l'archive est faisable sans toucher à l'API. `Evaluation.intent` est un `String?` libre. Next 16 documente `<ViewTransition>` (`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`).

---

## 1. La demande du client, et où chaque point est traité

| Exigence | Décision | Contrôle (Maldini) |
|---|---|---|
| L'agent est seul, mais le site parle au nom du cabinet | Tous les textes sont au « nous » et au vouvoiement. L'agent n'est jamais nommé dans les pages de contenu. Son nom n'apparaît que là où la loi l'exige : directeur de la publication, dans les mentions légales | Recherche de « je » et de « j’ » dans le DOM, hors citations d'avis Google |
| Aucune photo de l'agent | Aucune photo de personne sur tout le site, ni portrait, ni silhouette, ni dos, ni flou. La « photo interlocuteur » de `notes.txt` devient la section texte « Votre interlocuteur » | Inventaire des `<img>` : uniquement des photos de biens (Supabase) et les illustrations `public/illustrations/` |
| Vente de maisons et d'appartements, location, estimation | Pages `/vendre`, `/louer` et `/estimation`, plus la liste unique `/biens` | Plan du site, §4 |
| Pas de template de grande agence, pas de moteur de recherche | Aucun champ de recherche, filtre, tri, pagination, favori ou compte. Tous les biens sont sur `/biens` | Aucun `input[type=search]`, `select` ou `role=search` hors tunnel et contact |
| Tunnel d'estimation qui arrive dans la boîte mail de l'agent | Tunnel en 4 étapes, puis Server Action, puis `POST /api/public/evaluation`, qui envoie une **notification e-mail à l'agent** (lot API) | Charge utile vérifiée dans le mock. E-mail agent testé dans l'API avec un transport factice |
| Grenat et crème obligatoires | Grenat `#5F1A24`, crème `#F8F2E9` (Pirlo) | Jetons dans `globals.css`. Aucune autre teinte en dehors des étiquettes énergie |
| Moderne, sobre, classe, sérieux | Typographie éditoriale, aucun ornement, mouvement limité à la liste fermée du §7 | Revue visuelle de Zidane, page par page, sur captures |
| Rendu précis, pas « vibe codé » | Liste d'interdits du §6, opposable à chaque livraison | Tests automatiques sur les interdits vérifiables (§9) |
| Belles images pour donner envie, sans les photos d'annonces | Illustrations à la plume, encre unique, typologies d'Asnières (Cantona, piste A) | Revue image par image (§8) |

---

## 2. Arbitrages rendus (questions ouvertes des documents 01 à 05)

| # | Question | Décision | Raison |
|---|---|---|---|
| A1 | Choix « prix de vente / loyer » dans le tunnel (Xavi §3.1, Bergkamp §4) | **Retenu**, en étape 1 : « Que souhaitez-vous faire estimer ? Le prix de vente · Le loyer ». Pré-rempli par `?objet=vente\|loyer`, « Le prix de vente » sélectionné par défaut. Envoyé dans `intent` = `ESTIMATION_VENTE` ou `ESTIMATION_LOYER` | Le cabinet estime des prix et des loyers. Ce choix décrit la **nature** de l'estimation, pas une intention de projet. Les trois intentions que le client a demandé de retirer (« mise en vente envisagée », « mise en location envisagée », « juste une idée de prix ») **ne réapparaissent sous aucune forme**. `timeframe` n'est pas envoyé. Correction de lecture pour Maldini : `notes.txt` demande de retirer les trois options, pas de garder « juste une idée de prix » |
| A2 | Nombre d'entrées dans l'en-tête | **5 entrées** : Nos biens, Vendre, Louer, Le cabinet, Contact | Le formulaire de contact doit être accessible depuis l'en-tête. Les 5 libellés tiennent en une ligne à 1024 px, à côté du téléphone et du bouton |
| A3 | Comportement de l'en-tête | Desktop (≥ 1024) : **statique**, non collant, hauteur 80. Mobile (< 1024) : **collant en permanence**, hauteur 64, sans masquage au défilement, sans changement de fond ni ombre. Le filet du bas est toujours présent | Sur desktop, l'en-tête n'a pas besoin de suivre le défilement. Sur mobile, il donne accès en permanence au menu et au bouton d'estimation. Un en-tête qui se cache et réapparaît fait trop bouger la page pour le ton recherché |
| A4 | Bouton du menu mobile | Mot « Menu » en texte (Hanken 500, 15 px), cible de 48 × 48, `aria-expanded`, `aria-controls`. Pas d'icône hamburger seule | Plus explicite, et ce n'est pas le réflexe des templates |
| A5 | Bouton « Faire estimer » en mobile | Libellé « Faire estimer » à partir de 380 px, « Estimer » en dessous. Variante compacte de 40 px | À 320 px, le logotype, le bouton complet et le menu ne tiennent pas sur une ligne |
| A6 | Barre d'action fixe en bas de la fiche mobile (Xavi §2.3) | **Refusée.** Sur mobile, le bloc prix est suivi immédiatement de deux boutons pleine largeur, « Appeler le cabinet » (secondaire, `tel:`) et « Demander une visite » (principal, ancre `#contact`). Le téléphone reste aussi dans le menu | Règle « aucun élément flottant ». L'en-tête mobile collant suffit comme repère permanent |
| A7 | Coûts énergie absents (09.345, 10.131) | La ligne est affichée : « Montant estimé des dépenses annuelles d'énergie pour un usage standard : non communiqué. » La ligne n'est jamais masquée. **Bloquant pour la mise en ligne** : l'agent complète les deux biens dans l'admin (saisie désormais obligatoire, migration `drop_annual_energy_cost` à appliquer, cf. mémoire projet) | Masquer une mention obligatoire serait pire que de signaler son absence. Rien n'est inventé |
| A8 | **Remplacé par A29 (revue n° 3).** Année de référence des prix de l'énergie (`dateReferenceEnergie` est une date) | Quand la date existe : « … entre 830 € et 1 190 € par an, abonnements compris (prix de l'énergie de référence : 2026). » L'année est extraite de la date. Sinon, aucune mention d'année. **[À CONFIRMER]** avec l'agent : ce champ de l'admin contient-il l'année de référence des prix ou la date du DPE ? Si c'est la date du DPE, la formule devient « (DPE réalisé en 2026) » | La donnée observée (2026-09-18) ressemble à une date de diagnostic. On ne recopie pas le « indexées aux années 2021, 2022 et 2023 » de La Forêt sans savoir si cela s'applique à nos biens |
| A9 | Nommer l'agent sur Le cabinet | **Non** (cf. §1). Le texte « Votre interlocuteur » dit « une seule personne » sans la nommer | Le client veut que l'on parle au nom du cabinet |
| A10 | Mesure d'audience en v1 | **Aucune.** Pas de bandeau cookies | Pas de traceur, rien à consentir |
| A11 | Grenat dans les illustrations (Cantona §5.4, Pirlo §5) | **Zéro grenat dans les illustrations.** La règle de Pirlo « 10 % des traits » est retirée | Le grenat signe l'interface. Dans une image, il devient une tache arbitraire (piste C-2) |
| A12 | ILL-03, la devanture réelle | **Dessin d'après la photo**, bandeau d'enseigne laissé vierge, encre unique. Le nom « Cabinet Rimbault » est composé en HTML à côté. Si l'agent fournit plus tard une photo propre de la devanture, elle peut aller sur Le cabinet. Le dessin reste | C'est vrai (c'est bien le cabinet) et cela ne montre personne. La couleur de l'enseigne disparaît avec l'encre unique |
| A13 | Légende d'ILL-06 | Aucune légende ni alt nommant le boulevard Voltaire (version Cantona). La mention de Xavi « le boulevard Voltaire au trait » est annulée | Le dessin ne représente pas ce boulevard. Le légender ainsi serait faux |
| A14 | Archive « Récemment vendus et loués » | **Retenue** sur `/biens`, conditionnelle (masquée si vide), via `GET /properties?status=VENDU&status=LOUE&limit=12` (vérifié dans la route publique). **Aucun traitement de la photo** : ni filtre, ni voile, ni désaturation. La photo est simplement plus petite (grille de 4 colonnes) avec le badge « Vendu » ou « Loué » en crème soutenu. Sans prix. Non cliquable | La règle de Pirlo « aucun filtre » prime sur la « photo atténuée » de Xavi et Bergkamp. La différence vient de la taille et du badge |
| A15 | Numérotation | Autorisée **uniquement sur une vraie séquence** rendue en `<ol>` : étapes du tunnel, déroulé d'une vente ou d'une location, « Ce qui va se passer » après envoi. **Interdite** sur les engagements, les métiers et les sections | Les engagements ne sont pas une séquence. Les numéroter serait le « 01 / 02 / 03 » décoratif interdit |
| A16 | Liens externes | Tous dans le même onglet, sans icône (Géorisques, avis Google, itinéraire) | Une seule règle, sans exception à tester |
| A17 | Envoi du tunnel | Libellé unique : « Envoyer la demande » | Les documents 03 et 04 avaient deux libellés différents |
| A18 | Nombre de pièces dans le tunnel | Choix radio en rangées (planche) : 1 pièce, 2 pièces, 3 pièces, 4 pièces, 5 pièces ou plus. Chambres et salles d'eau : `select` natif | Une seule action, de grandes cibles. 5 options tiennent sur un écran |

### Arbitrages de la revue n° 2

| # | Question | Décision | Raison |
|---|---|---|---|
| A19 | **Deux boutons grenat dans le premier écran** : le « Faire estimer » de l'en-tête (planche) plus le bouton principal de l'ouverture (accueil, Vendre, Louer) ou « Demander une visite » (fiche). Sur mobile, l'en-tête collant rend le conflit permanent | Le bouton « Faire estimer » de l'en-tête devient un **bouton secondaire compact** à toutes les tailles : contour 1 px encre, texte encre, fond transparent, 40 px de haut ; au survol, fond encre et texte crème (180 ms). Libellés A5 inchangés. Dans le menu mobile ouvert, « Faire estimer » reste principal (le contenu de la page est masqué). **Le seul bouton grenat d'un écran appartient toujours au contenu de la page** | Règle « un seul bouton grenat par écran » et critère de Maldini. Le grenat se raréfie encore : logotype, une action par écran, pied. L'accès permanent à l'estimation (Bergkamp reco 6) est conservé |
| A20 | Pied de page : structures différentes chez Pirlo (§6.10) et Xavi (§4.2) | Structure unique : (1) phrase de Pirlo en Spectral ; (2) trois colonnes **Nous trouver** (adresse, téléphone, horaires validés), **Le site** (Nos biens, Vendre, Louer, Faire estimer, Le cabinet, Contact), **Informations** (Nos honoraires, Mentions légales, Confidentialité, « Avis Google : 4,9 sur 5, 32 avis ») ; (3) filet crème à 22 %, puis le bloc **Mentions professionnelles** en pleine largeur, jamais replié, en `legal` 13 px `--grenat-sur-fond` : carte T et CCI, garant, SAS au capital de 4 000 €, RCS, médiateur ; (4) « © 2009-2026 Cabinet Rimbault », année calculée. Propriétaire : Xavi (lot 1) | Les deux propositions disaient la même chose avec deux découpages. Les mentions réglementaires en bande pleine largeur sont plus lisibles qu'une 4e colonne étroite |
| A21 | Grille avec 1, 2 ou 4 biens : Pirlo (§6.5, « les cartes gardent leur largeur ») contre Xavi (§2.2, carte horizontale, colonnes larges) | **Règle de Xavi retenue** : 1 bien = carte horizontale (photo 7 colonnes, texte 5) ; 2 biens = 2 colonnes de 6 ; 3 biens = 3 colonnes ; 4 biens = 2 × 2 ; 5 et plus = 3 colonnes, dernière rangée alignée à gauche. Sous 768 px : toujours 1 colonne. Implémentée par Pirlo dans `PropertyGrid` (lot 2) | Avec 1 ou 2 biens, trois colonnes étroites laissent un vide à droite qui fait « catalogue en panne ». Le catalogue réel oscille entre 1 et 10 biens |
| A22 | Badge d'archive « Vendu en 2026 » (planche) | **« Vendu » ou « Loué », sans année.** `soldAt` existe en base mais n'est pas renvoyé par l'API publique. L'année ne sera ajoutée que si l'API l'expose (évolution facultative, lot API, déployée avant la vitrine) | Rien d'inventé. `updatedAt` n'est pas une date de vente |
| A23 | Libellés du tunnel restés divergents dans le doc 04 | Font foi : « Envoyer la demande » (A17), pièces en radios 1 à 5 ou plus (A18), choix « prix de vente / loyer » **décidé** (A1, plus de mention « [ZIDANE] » ni « si Zidane refuse »), progression « Étape 2 sur 4, ses caractéristiques » (virgule, pas de tiret cadratin) | Une seule formulation par libellé, testable par Maldini |
| A24 | Phrase des coûts d'énergie dans le doc 04 §2.3-6 (« indexés sur les années 2021, 2022 et 2023 ») | **Annulée.** Seules font foi les trois formulations d'A7 et A8, reprises par Pirlo §6.7. La ligne « non communiqué » garde « pour un usage standard » | Recopier les années de La Forêt sans savoir si elles s'appliquent à nos DPE serait inventer |
| A25 | Composant `Reveal.tsx` dans l'arborescence de Xavi (§6) | Renommé **`ImageFade.tsx`** : il ne fait que le fondu d'une image au décodage (§7). Aucun composant d'apparition au défilement n'existe dans le dépôt | Le nom « Reveal » appelle exactement l'effet interdit |
| A26 | Logotype (Cantona §7) | **Proposition A** (Spectral 500, grenat, sans ornement) pour l'en-tête et le pied, en crème sur le pied grenat. **Monogramme crème sur grenat** pour `icon.svg` et `apple-icon.png`. **B refusée** : l'interlettrage de +0,06 em sur des petites capitales est exactement les « capitales espacées » interdites. **C refusée** (ne tient pas en mobile, filet décoratif) | Le site parle au nom du cabinet : le nom suffit. Le monogramme reste réservé aux icônes, jamais dans la page |
| A27 | ILL-01 et ILL-04 dessinent **la même maison** (ILL-01 est construite sur ILL04c-s1909) : un visiteur la voit deux fois, sur l'accueil puis sur Vendre | ILL-04 est **retirée de Vendre**. L'en-tête de Vendre reçoit **ILL-02** (balcon en fer forgé, 280 × 350, colonnes 9 à 12). L'accueil perd ILL-02 dans « Nos engagements » (c'était une simple respiration en marge, desktop seulement). ILL-04 reste en réserve dans `public/illustrations/` sans être appelée. Si l'utilisateur ouvre un budget (§8), un pavillon **différent** pourra être généré pour Vendre | Une illustration vue deux fois cesse d'être un dessin et devient un motif de template. Solution à 0 $ |
| A28 | ILL-03 (devanture), utilisée sur trois pages | **Refusée** dans sa version phase 2 (voir §8). Remplacée par une **élévation frontale dessinée à la main en SVG** d'après la photo, comme ILL-07 : 0 $ | Le dessin le plus exposé du site est aujourd'hui le moins abouti |

### Arbitrages de la revue n° 3

| # | Question | Décision | Raison |
|---|---|---|---|
| A29 | Sens du champ `dateReferenceEnergie` (ancien A8, [À CONFIRMER]) | **Tranché sans l'agent.** Dans l'admin (`cabinet-rimbault-admin/src/components/admin/property-form/steps/EnergyStep.tsx`), le champ s'intitule « Date d'indexation du prix de l'énergie », avec l'aide « Indiquée sur le DPE, souvent le 1er janvier de l'année du diagnostic ». Les données le confirment : 10.130 et 10129 portent `2021-01-01`. **Trois formulations seulement, qui remplacent celles d'A7, A8 et A24** : (1) coûts et date : « Montant estimé des dépenses annuelles d'énergie pour un usage standard : entre 830 € et 1 190 € par an. Prix moyens des énergies indexés au 1er janvier 2021 (abonnements compris). » La date est écrite en entier, en français (`Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" })`, « 1er » pour le premier du mois) ; (2) coûts sans date : « … entre 830 € et 1 190 € par an, abonnements compris. » ; (3) coûts absents : « … pour un usage standard : non communiqué. » Puis, dans les cas (1) et (2) : « Les coûts sont estimés en fonction des caractéristiques du logement et pour une utilisation standard. » | C'est la mention réglementaire du DPE (prix indexés à une date), avec la date réellement saisie. Rien n'est extrait ni deviné. La date de 09.362 (`2026-09-18`) ressemble à une date de diagnostic saisie par erreur : à vérifier par l'agent (§10), la vitrine l'affiche telle quelle |
| A30 | Ordre de la fiche en mobile : Pirlo §4.4 (« prix au-dessus de la galerie ») contre Xavi §2.3 (galerie, puis en-tête du bien, puis prix) | **Ordre de Xavi** : galerie (4:3, défilement aimanté, compteur), `h1`, lieu, bloc prix et honoraires, deux boutons pleine largeur (A6), puis L'essentiel. La phrase de Pirlo §4.4 est annulée | Le visiteur vient voir le bien. Le prix suit immédiatement le titre, sans écran intermédiaire. Une seule source pour Pirlo (lot 2) et Maldini |
| A31 | « Le bloc Faire estimer de l'accueil reste sur crème soutenu » (Pirlo §2.2) alors que Xavi §2.1 exclut tout bloc d'estimation final | **Aucun bloc d'estimation final sur l'accueil** (Xavi). Sur l'accueil, la seule section en crème soutenu est « Ce que disent nos clients ». La phrase de Pirlo est annulée | Le bouton est dans l'ouverture et dans l'en-tête : un troisième appel serait le réflexe de template « CTA de fin de page » |
| A32 | Libellé de copropriété : « Procédure en cours » (planche) contre « Procédure en cours sur la copropriété » (doc 04) | **« Procédure en cours sur la copropriété »**, valeur « Aucune » ou « Oui » | Libellé exact, sans ambiguïté sur la procédure dont il s'agit |
| A33 | Titre composé : « Appartement 3 pièces, 59,5 m² » (brief §3.2, cartes) contre « Appartement 3 pièces de 59,5 m² » (doc 04, `h1`) | **Virgule** pour le `h1` de la fiche et la carte. **« de »** seulement dans le `<title>` et l'alt des photos, où la phrase est lue d'un trait. Une seule fonction `composeTitle(view, "affiche" \| "phrase")` dans `lib/property/view.ts` | Une forme par usage, testable |
| A34 | `rooms` vaut « 5+ » dans la charge utile du tunnel (A18), mais l'API fait `Number(body.rooms)` pour l'e-mail de confirmation (`api/public/evaluation/route.ts`, l. 108) : le demandeur recevrait « Pièces : NaN » | La vitrine envoie bien `rooms: "5+"` (colonne `String?`). **Lot API (Maldini)** : aucune conversion par `Number()` dans les e-mails ; une fonction de formatage commune aux deux e-mails écrit « 5 pièces ou plus », « 3 pièces », « 1 pièce », et la surface à la française (« 59,5 m² », pas « 59.5 m² »). Test unitaire sur « 5+ », « 1 », « 59.5 » et sur les champs absents | Bug réel trouvé en revue, dans l'e-mail que reçoit le client du cabinet. Crédibilité directe |
| A35 | ILL-03 SVG à la main (revue n° 2) | **Composition validée, dessin à enrichir** (0 $, Cantona, voir §8ter). En l'état, c'est un relevé au trait uniforme, sans aucune hachure : sur l'accueil, à côté de la gravure d'ILL-01, il se lit comme un pictogramme et non comme un dessin de la même main | L'image figure sur trois pages, dont l'accueil. « Rien laissé au hasard » |

---

## 3. Design system validé (Pirlo, doc 03, avec les amendements ci-dessous)

### 3.1 Palette (jetons Tailwind v4 `@theme`, noms exacts)

| Jeton | Hex | Usage |
|---|---|---|
| `--color-grenat` | `#5F1A24` | Bouton principal (un par écran, toujours dans le contenu, A19), lien actif, liens dans le texte, logotype, aplat du pied de page, option cochée, badge « Exclusivité » |
| `--color-grenat-fonce` | `#47121A` | Survol et appui du bouton principal |
| `--color-grenat-pale` | `#F0E2DC` | `::selection` uniquement |
| `--color-grenat-sur-fond` | `#D8BFB8` | Intertitres et mentions sur le pied grenat |
| `--color-creme` | `#F8F2E9` | Fond de toutes les pages |
| `--color-creme-soutenu` | `#EFE6D7` | Section alternée (une sur trois au plus), réserve d'image, badges archive |
| `--color-lait` | `#FDFAF5` | Intérieur des champs, cadre du tunnel en desktop |
| `--color-encre` | `#251C19` | Texte, titres, focus, trait des illustrations |
| `--color-encre-douce` | `#574A43` | Chapôs, texte secondaire |
| `--color-gris` | `#6F6259` | Aides, références, mentions (jamais sous 13 px) |
| `--color-filet` | `#DED3C3` | Séparateurs décoratifs |
| `--color-filet-fort` | `#8C7D70` | Bordures de contrôles (3:1) |
| `--color-erreur` | `#9A3A22` | Erreurs, toujours accompagnées d'une icône et d'un texte |
| `--color-succes` | `#3D5A44` | Coche de confirmation, et seulement là |

Proportions : environ 78 % de crème, 14 % d'encre, 5 % de crème soutenu, 3 % de grenat. Le pied de page est le seul aplat grenat. Un seul bouton grenat par écran. Contrastes : tous calculés par Pirlo (annexe A du doc 03), AA au minimum.

### 3.2 Typographie

- **Spectral** (300, 400, 500, italique 400) pour la lecture : titres, chapôs, texte, prix, menu mobile. **Hanken Grotesk** (variable) pour l'interface et les données. Chargement par `next/font/google` (auto-hébergé, aucun appel à Google au runtime).
- Échelle et interlignes du doc 03 §3.2, bascule unique à 768 px, sans `clamp()`.
- **Amendement** : le sous-titre du logotype « Asnières-sur-Seine, depuis 2009 » passe de 12,5 px à **13 px**, le plancher absolu. Aucune exception.
- Titres en casse de phrase, jamais en capitales, jamais en italique, jamais avec un mot en grenat ou en gras. Italique réservée aux citations d'avis.
- Nombres : `Intl.NumberFormat("fr-FR")` (U+202F), `tabular-nums` dans les données. Ponctuation française avec espaces fines insécables. Apostrophe typographique.
- Titre d'un bien toujours **composé** depuis les données : « Appartement 3 pièces, 59,5 m² », « Studio, 33,16 m² ». Forme à virgule pour le `h1` et la carte, forme « de » pour le `<title>` et les alts (A33). Le titre saisi par l'agent passe en sous-titre, en casse normale.

### 3.3 Grille et points de rupture (une seule source : Pirlo)

Conteneur de 1200 px. Marges de 20, 32 puis 40 px. 4 colonnes sous 768 px, 12 au-delà. Points de rupture Tailwind par défaut : `sm` 640, `md` 768, `lg` 1024, `xl` 1280. **La grille de 6 colonnes en tablette du doc 04 est abandonnée.** Alignement à gauche partout. Le centrage est réservé à la confirmation du tunnel et à la page 404.

### 3.4 Composants (`src/components/ui/*`)

Button (principal, secondaire, tertiaire, compact), ButtonLink, TextLink, Container, Section, Heading, Prose, Field, Input, Textarea, Select, ChoiceGroup, Checkbox, FieldError, ErrorSummary, Disclosure (`details` et `summary` natifs), Tag (badges), Divider, VisuallyHidden, Table. Comportements, états et dimensions : doc 03 §6, sans écart. Icônes : liste fermée lucide-react du doc 03 §7, `strokeWidth` 1,5. **`ExternalLink` est retirée de la liste** (A16).

### 3.5 Formes

Rayon de 3 px pour les contrôles, 2 px pour les badges, 0 pour les photos et les illustrations. **Aucune ombre portée.** Photos sans aucun filtre. Ratios : 4:3 sur les cartes, 3:2 pour la photo principale de la fiche en desktop, 4:3 en mobile, ratio natif sur fond encre dans la visionneuse.

---

## 4. Plan du site validé

| URL | Page | Illustration | Remarques |
|---|---|---|---|
| `/` | Accueil | ILL-01 (ouverture), ILL-03 (nous trouver) | Ouverture asymétrique (bouton principal « Faire estimer votre bien », lien « Voir nos biens »), biens du moment (masqués si 0), 3 métiers en texte, engagements **non numérotés et sans illustration** (A27), avis réels, adresse |
| `/biens` | Nos biens | aucune | Vente, puis location (état vide rédigé), puis archive (conditionnelle) |
| `/biens/[reference]` | Fiche | aucune | Références à point (`10.131`) à tester **en premier**. Repli `refToSlug` si elles posent problème |
| `/estimation` | Tunnel | aucune | Mise en page `(tunnel)` : en-tête réduit, sans navigation principale |
| `/vendre` | Vendre | ILL-09 (A37, amende A27 ; validée en revue du lot C, tour 2) | Déroulé en `<ol>`, FAQ, honoraires, archive (4 au plus, conditionnelle) |
| `/louer` | Louer | ILL-05 | Renvoi du locataire en tête, déroulé, honoraires ALUR [À CONFIRMER], FAQ |
| `/le-cabinet` | Le cabinet | ILL-06, ILL-07, ILL-03 | Faits datés, façon de travailler, interlocuteur en texte, secteur, avis, informations professionnelles |
| `/honoraires` | Barème | aucune | Tableau HTML. **Bloquant** tant que le barème n'est pas fourni |
| `/contact` | Contact | ILL-03 (desktop) | Coordonnées d'abord en mobile, formulaire `POST /contact` |
| `/mentions-legales`, `/confidentialite` | Légal | aucune | Gabarit `ProsePage` |
| 404 | Introuvable | ILL-08 | Variante pour une fiche disparue |

Pages écartées : celles du doc 04 §1.2, sans changement. Contenu page par page : doc 04 §2, **avec les corrections du §6.3 ci-dessous**.

---

## 5. Lots de travail et propriétaires

Chaque fichier appartient à un seul lot. Pour modifier le fichier d'un autre lot, on passe par Zidane. Les interfaces figées sont celles du doc 04 §7, sans changement.

| Lot | Propriétaire | Fichiers | Ordre |
|---|---|---|---|
| 0 · Socle | **Xavi** | `src/app/layout.tsx`, `not-found.tsx`, `global-error.tsx`, `sitemap.ts`, `robots.ts`, `(site)/layout.tsx`, `(site)/error.tsx`, `(tunnel)/layout.tsx`, `src/lib/api/*` (dont `apiPost`, `evaluation.ts`, `contact.ts`, `E2E_NO_CACHE`), `src/lib/agency.ts`, `src/lib/forms/*`, `src/lib/seo/*`, `src/components/seo/*`, `scripts/check-launch.ts`, `next.config.ts` (partagé avec Maldini), suppressions du doc 04 §6 | 1er. **Suppressions autorisées** : routes d'exploration, `components/directions`, `components/site`, `EnergyScale.tsx`, `lib/property.ts`. `public/maquettes/devanture-provisoire.jpg` est déplacé dans `docs/refonte/references/` |
| P · Design system | **Pirlo** | `src/app/globals.css`, `src/app/fonts.ts`, `src/components/ui/*` | Après 0 |
| I · Mouvement | **Iniesta** | `src/components/motion/*`, `src/app/(site)/template.tsx` s'il est retenu, règles `@media (prefers-reduced-motion)` (dans un bloc de `globals.css` délimité par commentaire, cédé par Pirlo) | Après P |
| C · Illustrations | **Cantona** | `src/components/illustrations/*`, `src/components/brand/*` (Logotype, Monogram), `public/illustrations/*`, `src/app/icon.svg`, `apple-icon.png`, `opengraph-image.png`, `scripts/illustrations/*` | En parallèle de P |
| 1 · Navigation | **Xavi** | `src/components/layout/*` | Après P et C (Logotype) |
| 2 · Biens | **Pirlo** | `(site)/biens/**`, `src/components/property/*`, `src/lib/property/*` (dont `fees.ts`, `view.ts`, `description.ts`, tests unitaires) | Après 0 et P |
| 3 · Accueil | **Xavi** | `(site)/page.tsx`, `src/components/home/*` | En dernier (assemble 2, 6 et C) |
| 4 · Propriétaires | **Bergkamp** | `(site)/vendre/*`, `(site)/louer/*`, `(site)/honoraires/*`, `src/components/owners/*`, `src/content/honoraires.ts`, `src/content/faq-*.ts` | Après 0 et P |
| 5 · Estimation | **Xavi** (Iniesta pour `StepTransition` et `ProgressBar`) | `(tunnel)/estimation/*`, `src/components/estimation/*`, `src/lib/estimation/*` | Après 0, P et I |
| 6 · Cabinet et contact | **Pirlo** | `(site)/le-cabinet/*`, `(site)/contact/*`, `src/components/agency/*`, `src/components/forms/*` | Après 0 et P |
| 7 · Légal | **Bergkamp** | `(site)/mentions-legales/*`, `(site)/confidentialite/*`, `src/content/legal.ts` | Après 1 (`ProsePage`) |
| API · Notification agent | **Maldini** | `cabinet-rimbault-api` : `api/public/evaluation/route.ts`, `api/public/contact/route.ts`, `src/lib/emails/*-agent-notification.tsx`. Spécification : doc 04 §3.7 (destinataire `AGENCY_NOTIFICATION_EMAIL`, sinon `agencySettings.email` ; `replyTo` = demandeur ; création en base prioritaire ; 422 si `rgpd !== true`) | En parallèle. **Ni déploiement, ni commit, ni POST vers la production.** Tests avec un transport Resend factice. Déploiement de l'API **avant** la vitrine (mémoire projet) |
| T · Tests | **Maldini** | `e2e/**`, `playwright.config.ts` | En continu |
| Textes | **Bergkamp** relit **tous** les textes visibles (ton « nous », typographie française, interdits du §6.2) avant la revue n° 2 | — | — |

Définition de « livré » pour chaque lot : 200 sur les 4 scénarios du mock (`default`, `empty`, `error`, `edge`), `npm run lint` et `tsc` propres, aucune chaîne `null`, `undefined`, `NaN` ou `-1 €`, aucun texte factice, captures 1440 et 390 jointes pour la revue de Zidane.

---

## 6. Interdits opposables (complète le doc 03 §9)

### 6.1 Structure et graphisme
Moteur, filtres, tri, favoris, comptes · hero centré avec deux boutons sur une photo · tuiles à icônes · cartes à ombre ou à bordure · carrousel automatique, compteur animé, parallaxe, effets liés au curseur · section sans contenu réel · pavé SEO · dégradé, verre dépoli, grain, texture · ombre portée · or, deuxième couleur d'accent · photo filtrée ou désaturée, ou texte posé sur une photo · personne en photo ou en dessin · **élément flottant ou fixe en bas d'écran** · bandeau cookies.

### 6.2 Texte
Sur-titres en capitales · capitales espacées, y compris « petites capitales » (la mention « Photos à venir » est en casse normale) · mot en italique, en gras ou en grenat dans un titre · flèches dans les libellés · **points médians entre des métadonnées** : on écrit « Asnières-sur-Seine, Impressionnistes » avec une virgule · numérotation décorative (A15) · emojis, étoiles · Lorem, chiffres non sourcés, délais non validés · « Découvrez », « N'hésitez pas », « Votre partenaire de confiance », « Expertise », « Passion » · abréviations dans les prix (« CC » s'écrit « charges comprises »).

### 6.3 Corrections à appliquer au doc 04 (contenu page par page)
- Accueil §2.1-1 : la ligne factuelle s'écrit en phrase, avec des virgules (« 117 boulevard Voltaire, 01 73 64 56 10, avis Google : 4,9 sur 5 (32 avis) »), sans points médians.
- Accueil §2.1-4 : engagements **sans numéros**.
- Carte de bien §2.2 et en-tête de fiche §2.3 : lieu avec une virgule. « Photos à venir » en casse normale. Pas de traitement de photo dans l'archive (A14).
- Fiche §2.3 : galerie principale en 3:2 en desktop. Visionneuse sur fond encre. Barre d'action fixe supprimée (A6).
- En-tête §4.1 : A2 à A5. Grille §2 : 4 et 12 colonnes (§3.3).
- Location : « 1 250 € par mois charges comprises ».
- (Revue n° 2) Accueil §2.1-6 et partout : lien « Itinéraire » dans le **même onglet** (A16), « nouvel onglet » supprimé.
- (Revue n° 2) Fiche §2.3-6 : formulations d'énergie d'A7 et A8 uniquement (A24).
- (Revue n° 2) Louer §1.4 et §2.6-0 : jamais « 0 bien » à l'écran. 0 : « Nous n'avons aucun logement à louer en ce moment. » ; 1 : « Nous avons un logement à louer en ce moment. » ; n : « Nous avons 3 logements à louer en ce moment. »
- (Revue n° 2) Copropriété : une seule formulation, celle de la planche (liste de définitions). « Procédure en cours sur la copropriété » : « Aucune » ou « Oui ». Pas de phrase concurrente dans le doc 04 §2.3-7.
- (Revue n° 2) Tunnel : A23. Mobile, menu : « Faire estimer votre bien » (principal, A19).
- (Revue n° 3) Fiche §2.3-6 : formulations d'énergie d'**A29** (remplacent A7, A8, A24). Fiche §2.3-7 : « Procédure en cours sur la copropriété » (A32). Ordre mobile : A30. `h1` à virgule (A33).
- (Revue n° 3) Le cabinet §2.7-3 : l'étiquette « [ZIDANE : nommer ou non l'agent] » est close par A9 (non), à supprimer.

---

## 7. Règles d'animation pour Iniesta (liste fermée)

**Principe.** Le mouvement sert à **comprendre** : où l'on est, ce qui a changé, ce qui répond au geste. Il n'est jamais là pour impressionner. Si une animation se remarque à la première visite, elle est de trop.

**Contraintes techniques.** Pas de bibliothèque d'animation (ni Framer Motion, ni GSAP) : CSS, Web Animations API et, si les docs Next 16 le confirment, `<ViewTransition>` de React (lire `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md` avant). Seules `opacity`, `transform`, `background-color`, `border-color`, `color` et `text-decoration-color` sont animées. Jamais de `height`, `width` ou `top`. Courbe unique `--ease-sobre: cubic-bezier(.2, 0, 0, 1)`. Aucune animation ne bloque la saisie ni ne retarde l'affichage du contenu (le LCP n'attend jamais une animation).

| Élément | Comportement | Durée |
|---|---|---|
| Changement de page | Fondu enchaîné du `<main>` uniquement (l'en-tête et le pied ne bougent pas). Aucun glissement | 160 ms en sortie, 220 ms en entrée |
| Ouverture de l'accueil | **La seule séquence orchestrée du site**, au premier chargement : titre `display` (opacité de 0 à 1, translation de 8 px vers le haut), puis chapô et actions (+80 ms), puis l'illustration ILL-01 qui apparaît en fondu (+160 ms). Rien d'autre | 500 ms au total |
| Apparition au défilement | **Interdite** pour les sections et les textes. Seule exception : une image (photo ou illustration) apparaît en fondu **quand elle est décodée** (et non quand elle entre dans l'écran), pour éviter le « pop » | 300 ms, opacité seule |
| Liens de navigation | Le trait de 1 px se dessine de gauche à droite (`background-size`) | 180 ms |
| Liens dans le texte | Le soulignement passe de 45 % à 100 % d'opacité | 180 ms |
| Boutons (dont le secondaire compact de l'en-tête, A19) | Changement de fond. **Aucun** effet d'échelle, de lueur ou de translation | 180 ms |
| Carte de bien | Photo à l'échelle 1,02 au survol (`@media (hover: hover)` seulement), titre souligné | 600 ms pour la photo, 180 ms pour le titre |
| Menu mobile | Fondu du panneau. Entrées sans décalage en cascade ni glissement | 180 ms |
| Tunnel : changement d'étape | Sortie en fondu (120 ms), entrée en fondu avec 12 px de translation horizontale dans le sens de la navigation (vers la gauche pour « Continuer », vers la droite pour « Retour »). Le focus passe au titre de l'étape à la fin de l'animation | 120 ms + 220 ms |
| Tunnel : barre de progression | Le segment en cours se remplit (`scaleX` de 0 à 1, `transform-origin: left`) | 300 ms |
| Champs du tunnel liés au type | Apparition en fondu sur place, sans animation de hauteur | 180 ms |
| Message d'erreur | Apparition sans mouvement. Pas de « secousse » | 0 ms |
| Galerie et visionneuse | Fondu d'ouverture. En tactile, la photo suit le doigt (scroll-snap natif). Changement de photo au clavier en fondu enchaîné | 180 ms |
| Confirmation du tunnel | Fondu du bloc. La coche se trace (`stroke-dashoffset`), une seule fois | 400 ms |
| Ancres internes | `scroll-behavior: smooth` seulement sous `prefers-reduced-motion: no-preference` | natif |

**`prefers-reduced-motion: reduce`** : toutes les durées passent à 0, sauf les changements de couleur au survol. Aucun contenu n'est jamais masqué en attendant une animation : l'état initial invisible n'est posé **qu'en JavaScript, après l'hydratation**, sous `no-preference`. Sans JavaScript, tout est visible.

---

## 8. Illustrations (Cantona) : validations et exigences pour la phase 2

**Piste A validée** (plume d'architecte, encre unique `#251C19`, fond transparent, post-traitement `ink.py`). Pistes B, C et Recraft écartées pour les raisons données par Cantona, que je partage.

**Constats sur l'exploration**, à corriger dans les finales :
- `piste-A2-ILL01` : on y voit **une voiture garée, un panneau de signalisation et des chiffres sur une façade** (au fond, au centre). Le pavillon à gauche est un plain-pied à croupe de lotissement, **pas un pavillon en meulière**. Le cadrage (masse à droite, vide en haut à gauche) est le bon.
- `piste-A2-ILL04` : trait épais, brun, de type « doodle », avec une chaise, une pousse dessinée et un sol flottant. C'est un cottage anglais, **pas une meulière d'Île-de-France**, et il n'a **pas la même main** qu'ILL-01. Il est inutilisable tel quel, même comme référence.
- `traitement-A-1` : pseudo-lettres sur le bandeau du rez-de-chaussée (« Clic shop »). Fenêtres en aplats noirs, ce qui contredit « no fills ».
- `traitement-A-3` : frise de pseudo-lettres sur l'arc. Le reste (porte cochère) est le meilleur dessin du lot.

**Exigences de cohérence.**
1. **Une seule main** : même modèle, même prompt verrouillé, même post-traitement, et une épaisseur de trait **mesurée** après réduction à la taille d'affichage (écart de plus de 20 % entre deux visuels : rejet). Planche de contrôle obligatoire avant intégration : les 7 visuels côte à côte, à leur taille réelle, sur crème et sur crème soutenu.
2. **Typologie meulière décrite explicitement** dans le prompt d'ILL-01 et d'ILL-04 : pierre meulière en appareillage irrégulier, chaînes d'angle et encadrements de baies en brique, bandeau de brique, toit à deux pans en tuiles mécaniques, lucarne, marquise au-dessus de la porte, grille sur muret. Aucun objet au premier plan.
3. Critères de rejet (sans exception) : lettre, chiffre ou pseudo-écriture ; personne ; véhicule ; panneau ; aplat noir de plus de 2 % de la surface ; perspective fausse ; arbre en « nuage ».
4. ILL-07 (carte du secteur) et le logotype sont dessinés à la main en SVG. La carte attend la liste des communes [À CONFIRMER]. Mention « © contributeurs OpenStreetMap ».
5. Logotype : 2 ou 3 propositions typographiques (Spectral 500, grenat, 160 × 24 px au plus en mobile) et un monogramme « CR » pour les icônes, soumis à Zidane avant intégration.

**« Donner envie »** : le désir vient de la qualité du trait et de la réserve de crème autour du sujet. ILL-01 doit être assez riche pour porter l'accueil (comme la planche Inigo), sans devenir une gravure chargée.

### 8bis. Revue n° 2 des finales (planches crème et crème soutenu, à taille réelle)

Mesures de Cantona vérifiées dans `mesures.json` : trait de 0,68 à 0,741 px CSS (écart maximal 9 %), aplat noir de 1,67 % au plus, zéro pixel hors encre. Relecture « pseudo-lettres » refaite sur la planche crème : rien de lisible. **La chaîne de production est validée.** Le jugement image par image :

| Visuel | Verdict | Motif et action |
|---|---|---|
| ILL-01 | **Validée sous réserve de deux retouches** (0 $, dans `finals.py`) | La composition est la bonne (masse à droite, immeuble coupé par le bord, réserve en haut à gauche). Le montage reste perceptible : (1) **gommer les deux touffes de branchages griffonnées** de part et d'autre du pavillon (végétation non dessinée, même famille que l'arbre « nuage ») ; (2) **une seule ligne de trottoir continue** sous le pavillon et l'immeuble (aujourd'hui deux lignes de sol à des hauteurs voisines). La perte de l'appareillage de meulière est acceptée : une seconde passe img2img n'est pas finançable (§ budget) |
| ILL-02 | **Validée** | Devient l'illustration d'en-tête de Vendre (A27) |
| ILL-03 | **Refusée** (A28) | Pas la même main que le reste du lot : perspective fuyante, trait de croquis inégal, dallage griffonné, aucune réserve crème, aucun détail d'architecture alors que les autres planches sont des élévations précises. C'est pourtant l'image la plus exposée (Accueil, Le cabinet, Contact). **À refaire en SVG à la main** : élévation frontale de la devanture (vitrine, porte, bandeau **vierge**, encadrement, soubassement, amorce des étages), d'après `docs/refonte/references/devanture-provisoire.jpg`, trait de 1,25 px en `--encre` (même épaisseur perçue que les finales, à vérifier sur la planche), réserve crème autour, ratio 3:4. Aucun nom, numéro ni plaque dessiné |
| ILL-04 | **Hors service** (A27) | Même maison qu'ILL-01. Densité la plus forte du lot (16 % encré) et un petit objet sur le pilier droit. Conservée en réserve, non appelée |
| ILL-05 | **Validée** | La plus juste du lot |
| ILL-06 | **Validée** | Agrandissement 1,56× accepté en 10:3. Xavi confirme l'emplacement pleine largeur sur Le cabinet (doc 04 §2.7, ratio 10:3 au lieu de 21:9) |
| ILL-07 | **À dessiner** (SVG à la main) | Attend la liste des communes [À CONFIRMER agent]. En attendant, la section « Notre secteur » de Le cabinet s'affiche **sans carte** (texte seul) : jamais un cadre vide |
| ILL-08 | **Validée** | 404 uniquement |
| Open Graph | **À produire** (0 $) | Dérivé d'ILL-01 après retouches, 1200 × 630, logotype A composé en SVG |
| Logotype, monogramme | **A et monogramme crème sur grenat validés** (A26) | Cantona les intègre dans `src/components/brand/*`, `icon.svg`, `apple-icon.png`. L'ancien `icon.svg` (Georgia sur #7f1a24) est remplacé |

### Budget Replicate (état au 30/10, revue n° 2)

- Dépensé par Cantona : **0,906 $** (phase 1 : 0,131 $ ; phase 2 : 0,775 $ sur une enveloppe de 0,80 $, recoupé avec `GET /v1/predictions`). Enveloppe phase 2 respectée.
- Autres prédictions sur le compte, **non attribuées à l'équipe** : 82 le 30/10 entre 18 h 08 et 18 h 36 UTC (2,8 à 6 $) et 3 flux-2-pro vers 19 h 0x UTC (0,09 à 0,24 $).
- **Reste sous le plafond de 7 $** : au mieux **6,09 $** (si aucune de ces prédictions ne relève du projet) ; au pire **0 $** (7 − 6 − 0,24 − 0,906 < 0).
- **Décision : aucune nouvelle génération sans accord explicite de l'utilisateur.** Tout ce qui reste à produire (ILL-01 retouchée, ILL-03, ILL-07, Open Graph, logotype, icônes) l'est **à 0 $** (retouches locales et SVG à la main).
- **Revue n° 3** : aucun appel depuis la revue n° 2 (registre vérifié). **Cumul Cantona : 0,906 $. Reste sous le plafond de 7 $ : entre 0 $ et 6,09 $**, selon la réponse de l'utilisateur ci-dessous. Tout le travail restant (ILL-03 enrichie, ILL-07, intégration) se fait à 0 $.
- **[À CONFIRMER utilisateur]** : (1) les 85 prédictions étrangères à l'équipe comptent-elles dans les 7 $ ? (2) si non, autoriser une enveloppe de **0,30 $** (12 images flux-dev) pour un pavillon en meulière **différent** destiné à Vendre (A27) et une seconde passe d'ILL-01 qui retrouve l'appareillage de meulière.
- Cantona tient `05-illustrations-depenses.md` à jour **à chaque appel**.

### 8ter. Revue n° 3 des illustrations et de la marque (planche crème régénérée, fichiers de `public/illustrations/`, `src/app/`)

| Élément | Verdict | Constat et action |
|---|---|---|
| ILL-01 retouchée | **Validée** | Touffes gommées, une seule ligne de trottoir sous le pavillon et l'immeuble. Aucun véhicule, panneau, chiffre ni personnage. Relecture « pseudo-lettres » refaite à pleine taille : rien de lisible |
| ILL-02, 05, 06, 08 | **Validées** (inchangées) | Même main que ILL-01, mesures dans la tolérance |
| ILL-03 SVG | **À enrichir (A35)**, 0 $ | Bon : élévation frontale, bandeau vierge, aucun nom, numéro ni horaire, réserve crème, 3:4. Manque : la **main de gravure** du lot. Demandé, toujours en SVG à la main et en encre unique : (1) deux graisses, contours de masse à 1,25 px et détails à 0,75 px (opacité recalibrée sur la même mesure) ; (2) **hachures parallèles régulières** (vocabulaire des autres planches) sous la corniche, dans les embrasures des baies et de la porte en retrait, sous les appuis : jamais d'aplat ; (3) modénature : corniche à trois moulures, consoles sous la corniche, appuis moulurés, refends sur les trumeaux d'étage, panneaux et petits bois des portes ; (4) surface encrée visée 8 à 10 % (6 % aujourd'hui), trait médian inchangé (0,739 px CSS ± 20 %) ; (5) les deux diagonales de reflet de la vitrine sont retirées, remplacées par trois hachures courtes dans l'angle haut gauche de la glace (convention d'architecte, moins « pictogramme »). Contrôle : ILL-01 et ILL-03 côte à côte sur la planche crème, à taille réelle ; Zidane valide sur cette planche avant intégration |
| Open Graph | **Validé** | 1200 × 630, crème, logotype A en grenat, deux lignes vraies, ILL-01 à droite. Alt présent |
| `icon.svg`, `apple-icon.png` | **Validés** | Monogramme crème sur grenat, angles droits. L'ancien Georgia sur #7f1a24 est remplacé |
| `Logotype.tsx` | **Validé** | Mot-symbole A vectorisé, `role="img"`, `aria-label`. La planche de Pirlo compose encore le nom en HTML : en implémentation, l'en-tête et le pied utilisent **uniquement** `<Logotype />` |
| Couverture des besoins de Xavi | **Complète** | Accueil ILL-01 + ILL-03, Vendre ILL-02, Louer ILL-05, Le cabinet ILL-06 + ILL-03 (+ ILL-07 quand les communes seront connues), Contact ILL-03, 404 ILL-08. Aucune page n'attend une image manquante : ILL-07 absente = texte seul |

---

## 9. Critères d'acceptation par page (Maldini)

**Transverses (toutes les pages, desktop 1440 et mobile 390, plus un contrôle à 320 px)**
- Statut 200, un `<title>` et une meta description uniques, un seul `h1`, une hiérarchie de titres continue, `lang="fr"`, lien d'évitement en premier focus.
- Zéro erreur console, zéro `pageerror`, aucun défilement horizontal à 320 et 390 px.
- axe-core sans violation de niveau `serious` ou `critical`.
- Le DOM ne contient pas : `null`, `undefined`, `NaN`, `-1 €`, `lorem`, `TODO`, `xxx`, « Découvrez », « N'hésitez pas », emojis, le caractère « · » dans le contenu visible, `text-transform: uppercase` calculé sur un texte visible.
- Aucune `box-shadow` floue calculée (rayon de flou supérieur à 0) et aucun `linear-gradient` ou `radial-gradient` calculé, en dehors des étiquettes énergie.
- Aucun élément `position: fixed`, sauf le menu mobile ouvert et la visionneuse. L'en-tête est `sticky` en mobile et statique en desktop.
- Images de biens servies par `/_next/image`, avec un alt non vide et non numérique.
- Polices auto-hébergées (aucune requête vers `fonts.googleapis.com` ou `fonts.gstatic.com`). Aucun cookie déposé.
- Pied de page : carte T, CCI, garant, SAS et RCS visibles sans interaction. Le médiateur est vérifié par le test « prêt pour la mise en ligne » (`check-launch`).
- Sous `prefers-reduced-motion: reduce`, aucune transition de plus de 0 ms hors couleurs. Sans JavaScript, tout le contenu est visible.
- Aucun `input[type=search]` ni `role="search"` sur le site.

**Accueil `/`** : un seul bouton grenat visible dans le premier écran desktop **et** mobile, et il appartient au contenu (le bouton de l'en-tête est secondaire, A19). Aucun bloc d'estimation en fin de page ; « Ce que disent nos clients » est la seule section en crème soutenu (A31). L'en-tête et le pied affichent le logotype par `<Logotype />` (SVG `role="img"`), pas par du texte HTML. Le nombre de biens annoncé correspond au mock. Section « biens du moment » absente dans le scénario `empty`. Engagements sans numéros. Lien « Itinéraire » vers `mapsDirections`, sans `target`. ILL-01 chargée avec `priority`. Aucune illustration dans « Nos engagements » (A27).

**Nos biens `/biens`** : le nombre de cartes est égal au nombre de biens visibles du mock. Ordre : disponibles, puis sous offre et sous compromis. Mise en page correcte avec 1, 2, 4, 5 et 12 biens selon A21 (1 = carte horizontale, 2 = deux colonnes, 4 = 2 × 2), scénario `edge` plus variantes. État vide de la location rédigé, avec ses deux sorties. Scénario `empty` : un seul état vide. Scénario `error` : message sobre avec le téléphone, sans crash. Archive absente si vide, cartes non cliquables et sans prix, badge « Vendu » ou « Loué » sans année (A22). Chaque carte est un seul arrêt de tabulation.

**Fiche `/biens/[reference]`** : `/biens/10.131` et `/biens/10129` répondent 200, une référence inconnue renvoie 404 avec la page dédiée. `h1` composé (jamais le titre brut en capitales). Prix formaté avec U+202F. Honoraires acquéreur : trois lignes (prix, « Soit … € honoraires exclus », « Honoraires de 4,76 % TTC à la charge de l'acquéreur »). Honoraires vendeur : une ligne. DPE et GES visibles, avec classe et valeur. Coûts : exactement l'une des trois formulations d'A29 (10.130 : « … indexés au 1er janvier 2021 (abonnements compris). » ; 09.345 et 10.131 : « non communiqué ») ; aucune chaîne « 2021, 2022 et 2023 », aucune date au format ISO. Mobile : ordre galerie, `h1`, lieu, prix, boutons (A30). `h1` à virgule, `<title>` avec « de » (A33). Libellé « Procédure en cours sur la copropriété » (A32). Géorisques lié. Copropriété : lots, charges annuelles, procédure, taxe foncière. Pas d'adresse exacte (aucun numéro de rue issu de `location.address`). Galerie navigable au clavier (flèches, Échap, retour du focus) et au toucher. Formulaire de visite avec `subject` `BIEN_SALE` ou `BIEN_RENT` et `propertyReference` dans la charge utile du mock. Biens similaires masqués si vides. Pas de barre fixe. JSON-LD `RealEstateListing` valide, adresse limitée à la ville et au code postal.

**Estimation `/estimation`** : 4 étapes. `?etape=` est synchronisé avec le bouton Précédent du navigateur. Une arrivée directe sur l'étape 3 ramène à la première étape incomplète. Validations et messages exacts du doc 04 §3.5. Retour arrière sans perte, reprise depuis `sessionStorage` avec « Recommencer ». Choix « prix de vente / loyer » pré-rempli par `?objet=`. **Aucune** option « mise en vente envisagée », « mise en location envisagée » ou « juste une idée de prix ». Case RGPD non cochée et obligatoire. Charge utile du mock : `propertyType`, `postalCode`, `firstName`, `lastName` et `email` présents, nombres envoyés en chaînes, `rgpd: true`, `source: "vitrine/estimation"`, `intent` ∈ {`ESTIMATION_VENTE`, `ESTIMATION_LOYER`}, aucun `timeframe`. Double clic : un seul POST. Erreur 500 (`fail-next`) : bandeau, données conservées, puis renvoi réussi. Champ piège rempli ou envoi en moins de 4 s : succès affiché et **aucun** POST. Confirmation : focus sur le `h1`, aucun délai affiché tant qu'il n'est pas validé, `sessionStorage` vidé. Aucune clé API dans le JavaScript client (recherche de `PUBLIC_API_KEY` et de la valeur de la clé dans les bundles).

**Vendre, Louer** : déroulés en `<ol>`. FAQ en `details` natifs, avec un JSON-LD `FAQPage`. Liens vers `/estimation?objet=vente` et `/estimation?objet=loyer`. Sur Louer, le renvoi du locataire affiche le nombre réel de biens en location, accordé (0, 1, n), sans jamais écrire « 0 bien ». Vendre : ILL-09, jamais ILL-02 ni ILL-04 (A37, qui amende A27). Tant qu'ILL-09 n'est pas validée, l'en-tête de Vendre est sans illustration ; ILL-02 et ILL-04 n'y sont jamais chargées.

**Le cabinet** : aucune image de personne. Informations professionnelles en texte courant (pas en `legal` de 13 px). Carte du secteur avec la mention OSM. Avis : extraits réels de l'API Places, ou la ligne de note seule si l'API échoue.

**Honoraires** : tableau avec `<caption>` et `<th scope>`, lisible à 320 px sans défilement horizontal, feuille d'impression. `check-launch` échoue si `content/honoraires.ts` est vide en production.

**Contact** : charge utile imbriquée conforme. Compteur de 500 caractères. Erreurs 400 `fields["contact.email"]` affichées sous le bon champ. `?bien=10.131` pré-remplit la référence et `?objet=location` présélectionne l'objet.

**Mentions légales, Confidentialité** : toutes les rubriques du doc 04 §2.10. Aucun `[À FOURNIR]` visible en production (garde `check-launch`).

**404** : en-tête et pied présents, ILL-08, liens Accueil, Nos biens et téléphone.

**En-tête (toutes pages, A19)** : le « Faire estimer » de l'en-tête a un fond calculé transparent (pas grenat) au repos. Libellé « Estimer » sous 380 px. Pied (A20) : trois colonnes, puis le bloc des mentions professionnelles en pleine largeur, visible sans interaction.

**Illustrations** : aucune image n'apparaît sur deux pages différentes, sauf ILL-03 (Accueil, Le cabinet, Contact). `icon.svg` est le monogramme CR crème sur grenat. Pendant le chargement d'une illustration (images retenues, `data-fondu="attente"`), ni l'image ni son cadre n'ont de fond calculé opaque (`background-color` transparent, aucun `background-image`) : le dessin est détouré, seul le fondu d'opacité d'`ImageFade` est permis (revue du lot C, correction 2).

**API (lot Maldini)** : un POST `evaluation` valide crée l'enregistrement **et** appelle le transport e-mail deux fois (accusé au demandeur, notification à l'agent, avec `replyTo` = demandeur et un objet explicite). La première ligne de la notification dit l'objet en clair (« Estimation du prix de vente » ou « Estimation du loyer ») : l'admin n'affiche pas `intent`, l'e-mail est le seul endroit où l'agent le lit. Aucun e-mail (accusé ou notification) ne contient « NaN », « undefined », « null » ni un nombre à point décimal : test avec `rooms: "5+"`, `surface: "59.5"` et avec les champs facultatifs absents (A34). Si l'e-mail à l'agent échoue, l'enregistrement est quand même créé et l'échec est journalisé. `rgpd: false` renvoie 422 `RGPD_REQUIRED`. Même logique pour `contact`.

---

## 10. Points [À CONFIRMER] avec l'agent (bloquants en gras)

1. **Médiateur de la consommation** : nom, adresse, site.
2. **Barème d'honoraires** vente et location, avec sa date d'effet.
3. **E-mail public** (sur le domaine) et **adresse de réception des notifications** (`AGENCY_NOTIFICATION_EMAIL`).
4. **Domaine du site** (`SITE_URL`) et hébergeur (Netlify ou Vercel) pour les mentions légales.
5. **Coûts énergie** de 09.345 et 10.131 à saisir. Le sens du champ `dateReferenceEnergie` est tranché (A29) ; reste à vérifier la date de 09.362 (`18/09/2026`, probablement la date du diagnostic au lieu de la date d'indexation des prix inscrite sur le DPE).
6. **Directeur de la publication** (nom, pour les mentions légales uniquement). Adresse du garant LLOYD'S France.
7. Horaires (ceux de `agency.ts` sont marqués « à confirmer »).
8. Communes du secteur (pour ILL-07, le JSON-LD `areaServed` et le message « hors secteur » du tunnel).
9. Estimation gratuite et sans engagement ? Avis de valeur remis par écrit ? Délai de réponse annoncé, ou aucun ?
10. Périmètre de la prestation location (état des lieux, garantie de loyers impayés), gestion locative oui ou non, zone ALUR d'Asnières et plafonds applicables.
11. Qui réalise les photos des annonces et sur quels portails elles sont diffusées (étape 3 du déroulé de vente).
12. Mandat exclusif : quelle position présenter dans la FAQ ?
13. Prix dans l'archive « vendus » : affichés ou non (par défaut : non).
14. WhatsApp et comptes sociaux actifs (par défaut : aucun affiché).
15. Durée de conservation des données des formulaires (proposition : 3 ans après le dernier contact).
16. Données à corriger dans l'admin : surface de 09.345 (35,65 ou 33,65 m²), orthographe des quartiers (« Gabriél Péri », « collange ») et de la ville « Asnieres ».
17. Photo propre de la devanture (facultative, A12).
18. **[À CONFIRMER utilisateur]** : prise en compte des 85 prédictions Replicate étrangères à l'équipe dans le plafond de 7 $, et ouverture éventuelle d'une enveloppe de 0,30 $ (§8).
19. **Photo de couverture des annonces** : la vitrine affiche la photo d'ordre 0 sans aucun traitement. Aujourd'hui, 10129 et 10.130 ouvrent sur une terrasse ou un jardin vu en grand angle, et leurs cartes sont les premières vues du site. Recommandation à l'agent : choisir dans l'admin, pour chaque bien, une pièce principale lumineuse et cadrée droite en première position. La vitrine ne recadre ni ne corrige rien.
20. URL de la **fiche Google** du cabinet (et non d'une recherche Maps) : alimente `sameAs` du JSON-LD (`agency.google.profileUrl`, `null` d'ici là ; signalé, non bloquant, par `check-launch`).

---

## 11. Ordre d'exécution

1. Lot 0 (Xavi), dont le test `/biens/10.131` et les suppressions.
2. En parallèle : P (Pirlo), C phase 2 (Cantona, dans l'enveloppe de 0,80 $), I (Iniesta), API (Maldini).
3. Lot 1 (Xavi), puis en parallèle 2 et 6 (Pirlo), 4 et 7 (Bergkamp), 5 (Xavi et Iniesta).
4. Lot 3, l'accueil (Xavi), en dernier.
5. Tests de bout en bout complets (Maldini), puis revue n° 3 de Zidane sur captures du site réel, page par page, avec la liste du §6.


---

## 12. Revue n° 2 : état par agent et corrections demandées

**Verdict : non approuvé en l'état.** Le socle est bon (palette, typographie, plan du site, tunnel, mentions légales, chaîne d'illustration). Restent des contradictions entre documents et deux illustrations refusées, à corriger **avant** d'écrire le code, faute de quoi chaque lot implémenterait une version différente.

| Agent | Constat | Correction |
|---|---|---|
| Pirlo (doc 03 + planche) | Révision 2 alignée sur A2 à A16. Restent : bouton d'en-tête grenat (contraire à A19) ; « Vendu en 2026 » (A22) ; règle de grille 1/2 biens (A21) ; pied de page à 4 colonnes (A20) ; §10 dit que **Xavi** déclare les jetons dans `globals.css`, alors que le fichier appartient au lot P (Pirlo) | Mettre à jour §6.1, §6.4, §6.5, §6.8, §6.9, §6.10, §10 ; régénérer la planche et les captures concernées (en-tête 1440, 1024, 390, 320, collant ; biens ; pied) |
| Xavi (doc 04) | Mise à jour partielle. Restent : « nouvel onglet » (§2.1-6) ; phrase d'énergie « 2021, 2022 et 2023 » (§2.3-6) ; arbitrage A1 encore rédigé comme une question (§3.1, §3.3) ; « Envoyer ma demande » (§3.3) ; pièces en `select` 1 à 8 (§3.3) ; tiret dans la progression (§3.2) ; « 0 bien en location » (§1.4, §2.6) ; formulation concurrente de la copropriété (§2.3-7) ; ILL-02 sur l'accueil et ILL-04 sur Vendre (A27) ; `Reveal.tsx` (A25) ; pied de page (A20) ; bouton d'en-tête (A19) ; validation du ratio 10:3 d'ILL-06 non écrite | Appliquer A19 à A25 et A27 dans les §1.4, 2.1, 2.3, 2.5, 2.6, 3.1 à 3.3, 4.1, 4.2, 6 ; écrire la validation d'ILL-06 en §2.7 |
| Cantona (doc 05 + finales) | Chaîne validée, mesures conformes, budget respecté. ILL-03 refusée, ILL-04 doublon d'ILL-01, ILL-01 à retoucher, ILL-07 et Open Graph à produire, logotype A retenu | ILL-01 retouchée (§8bis), ILL-03 en SVG à la main, Open Graph, intégration du logotype A et du monogramme, planche de contrôle mise à jour. **Aucun appel Replicate** sans accord de l'utilisateur |
| Bergkamp (doc 01) | Recherche solide, sourcée. Plusieurs recommandations sont dépassées par le brief et peuvent induire un lecteur en erreur : reco 2 (photo désaturée, « Vendu en 2026 »), reco 13 (4 entrées), reco 14 (fondu des sections à l'apparition), §3 (mesure d'audience exemptée, alors qu'A10 dit « aucune »), §4 (« Envoyer ma demande ») | Ajouter en tête du doc 01 un encadré « Écarts tranchés par le brief » qui liste ces points et renvoie aux arbitrages (A10, A2, §7, A14, A17, A22). Relecture des textes visibles toujours due avant la revue n° 3 |
| Maldini (doc 02) | Le doc 02 §3 dit encore « garder seulement « juste une idée de prix » » : lecture corrigée par A1 dès la revue n° 1, et rappelée ici. Les critères du §9 incluent maintenant A19 à A22 et A27 | Corriger la phrase du doc 02 §3 lors de l'écriture des specs ; ajouter les contrôles d'en-tête, de pied et d'illustrations du §9 |
| Iniesta | Pas de document à relire. §7 inchangé, plus A25 | Implémenter `ImageFade.tsx`, jamais de `Reveal` |

---

## 13. Revue n° 3 : verdict et corrections

**Verdict : approuvé pour l'implémentation.** Toutes les corrections de la revue n° 2 sont appliquées dans les documents 01, 03, 04 et 05 (vérifié ligne à ligne : A19 à A28 présents, plus de « nouvel onglet », de « 2021, 2022 et 2023 », d'« Envoyer ma demande », de `Reveal`, de « Vendu en 2026 », d'ILL-04 appelée ni d'ILL-02 sur l'accueil). Les exigences du client sont toutes couvertes (§1) : grenat `#5F1A24` et crème `#F8F2E9`, aucun moteur ni filtre, « nous » partout, aucune personne en photo ni en dessin, tunnel en 4 étapes qui aboutit à une notification e-mail à l'agent, mouvement limité à la liste fermée du §7. Les écarts restants sont mineurs et **tranchés ici** (A29 à A35) : ce document fait foi, les corrections ci-dessous s'appliquent au démarrage de chaque lot et ne bloquent pas le lancement.

| Agent | Constat | Correction (au démarrage de son lot) |
|---|---|---|
| Pirlo (doc 03, planche, lots P, 2, 6) | §4.4 : « prix au-dessus de la galerie » contredit Xavi ; §2.2 : « bloc Faire estimer de l'accueil » contredit Xavi ; §6.7 et planche : formulation d'énergie « prix de l'énergie de référence : 2026 » ; planche : « Procédure en cours » | Appliquer A29 (§6.7 et capture fiche), A30 (§4.4), A31 (§2.2), A32 (§6.6 et planche), A33 (`composeTitle`). Dans le code, l'en-tête et le pied utilisent `<Logotype />` |
| Xavi (doc 04, lots 0, 1, 3, 5) | §2.3-6 : formulation d'énergie d'A8 ; §2.3-2 : `h1` « de 59,5 m² » ; §2.7-3 : étiquette « [ZIDANE] » restée ouverte | Appliquer A29, A33, et supprimer l'étiquette (A9). Dans le récapitulatif et l'e-mail, « 5+ » s'affiche « 5 pièces ou plus » |
| Cantona (lot C) | ILL-03 juste dans sa composition mais d'une autre main que le lot | Enrichissement d'ILL-03 selon §8ter, à 0 $, planche ILL-01 + ILL-03 côte à côte soumise à Zidane avant intégration. Puis `Illustration.tsx` avec Xavi. ILL-07 quand les communes seront connues |
| Bergkamp (doc 01, lots 4 et 7) | Encadré des écarts conforme et complet | Relecture de tous les textes visibles (ton « nous », typographie française, §6.2), à faire sur le code des lots, avant la revue sur captures |
| Maldini (doc 02, lot API et tests) | Doc 02 §3, l. 57 : « garder seulement « juste une idée de prix » » toujours présent ; bug `Number("5+")` dans l'e-mail de confirmation de l'API | Corriger la phrase (A1). Lot API : A34 (formatage commun des pièces et de la surface, tests), notification agent avec l'objet en clair. Ajouter aux specs les contrôles A29 à A33 du §9 |
| Iniesta | Rien de nouveau à relire | §7 inchangé, `ImageFade.tsx` (A25) |

**Prochaine revue (n° 4)** : sur captures du site réel, 1440 et 390 px, page par page, avec la liste du §6 et les critères du §9.

