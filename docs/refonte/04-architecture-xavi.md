# 04 — Architecture du site (Xavi)

> Rédigé le 30/10/2026. Entrées : `01-recherche-bergkamp.md`, `02-donnees-et-tests-maldini.md`, `notes.txt`,
> `src/lib/agency.ts`, `cabinet-rimbault-api/src/app/api/public/{evaluation,contact,properties}/route.ts`,
> `prisma/schema.prisma` (modèle `Evaluation`), docs Next 16 dans `node_modules/next/dist/docs/`.
> Ce document **conçoit**, il ne code pas. Les anciens docs (`docs/brief.md`, `docs/*.md`) et les routes
> d'exploration sont de la matière consultée, pas des décisions héritées.
>
> Conventions : `[À CONFIRMER]` = dépend de l'agent ; `[À FOURNIR]` = contenu manquant, bloquant pour la mise
> en ligne ; `[ZIDANE]` = arbitrage demandé au chef de projet. Tous les textes sont en « nous », au vouvoiement,
> sans chiffre inventé. Les seuls faits utilisables sans confirmation sont ceux de `agency.ts` :
> 2009, 117 boulevard Voltaire 92600 Asnières-sur-Seine, 01 73 64 56 10, carte T, garant LLOYD'S France,
> SAS RCS Nanterre 511 484 586, note Google 4,9 sur 32 avis (à relire via l'API Places), les 3 engagements.
>
> **Révision après la revue n° 2 (30/10/2026)** : arbitrages A1, A16 à A20, A23 à A25 et A27 du brief appliqués
> (§1.4, 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 3.1 à 3.4, 4.1, 4.2, 6, 8). Validation d'ILL-06 en 10:3 écrite au §2.7.

---

## 0. Principes structurants (ce qui guide chaque choix ci-dessous)

1. **Peu de pages, chacune avec un rôle unique.** 11 URL publiques + 1 gabarit (fiche bien). Aucune page « pour le SEO ».
2. **Trois visiteurs, trois chemins courts.**
   - *Acquéreur* : Accueil → Nos biens → Fiche → appel ou message (2 clics).
   - *Locataire* : Accueil → Nos biens (section location) → Fiche → message.
   - *Propriétaire* (vendeur ou bailleur) : Accueil → Vendre ou Louer → Estimation (bouton « Faire estimer » présent partout, 1 clic).
   - *Propriétaire « qui vérifie »* (recommandé, tape le nom sur Google) : Accueil → Le cabinet. La page doit le convaincre en 30 s : ancienneté, adresse, mentions pro, avis.
3. **Aucun moteur, aucun filtre, aucune pagination, aucun tri.** Le catalogue réel compte 5 biens, une dizaine au maximum : tout tient sur une page.
4. **Aucune section sans contenu réel.** Tout bloc qui dépend d'une donnée (location, archive, avis, biens similaires, WhatsApp, médiateur) est **conditionnel** et disparaît proprement quand la donnée manque. Une section vide se remplace par un état vide rédigé, jamais par un cadre vide.
5. **Une seule source de vérité** pour chaque fait (`agency.ts`) et pour chaque libellé de donnée (`lib/property/*`).
6. **Aucun bandeau cookies** : aucun traceur, aucun embed Google Maps, aucune police servie depuis Google au runtime (`next/font` auto-héberge). Mesure d'audience : aucune en v1 (A10 ; si on en veut une plus tard : Plausible ou équivalent exempté, configuré selon la CNIL).
7. **Aucune photo de personne**, nulle part (ni portrait, ni dos, ni flou). La note client « Faire la photo interlocuteur section » (`notes.txt`) est **remplacée** par la consigne explicite du client : la section « Votre interlocuteur » existe, mais **en texte** (voir fiche bien §2.3 et Le cabinet §2.7).

---

## 1. Plan du site

### 1.1 Pages retenues

| # | URL | Page | Rôle | Pourquoi elle existe |
|---|---|---|---|---|
| 1 | `/` | Accueil | Dire en un écran qui nous sommes, où, depuis quand, et ouvrir les 3 chemins | Point d'entrée Google sur « Cabinet Rimbault » et « agence immobilière Asnières » |
| 2 | `/biens` | Nos biens | **Tous** les biens visibles, vente puis location, puis l'archive vendus/loués | Remplace « acheter » + « louer » + moteur : 10 biens se lisent en une page |
| 3 | `/biens/[reference]` | Fiche bien | Tout savoir d'un bien, mentions légales comprises, et nous écrire ou appeler | La page la plus consultée (trafic des portails, liens partagés) |
| 4 | `/estimation` | Tunnel d'estimation | Recueillir ce qu'il faut pour préparer une visite d'estimation ; arrive dans la boîte mail de l'agent | Demande explicite du client ; c'est la page qui crée des mandats |
| 5 | `/vendre` | Vendre | Expliquer comment se passe une vente avec nous, honoraires en clair, FAQ, puis estimation | Requête locale « vendre appartement Asnières » ; rassure avant de laisser ses coordonnées |
| 6 | `/louer` | Louer | Pour les **propriétaires bailleurs** : comment nous louons un bien, honoraires ALUR, FAQ ; renvoi immédiat des locataires vers nos biens en location | La location est une activité du cabinet ; requête « agence location Asnières » |
| 7 | `/le-cabinet` | Le cabinet | Démontrer : faits datés, méthode, secteur, avis, informations professionnelles | Remplace le visage de l'agent par des preuves vérifiables |
| 8 | `/honoraires` | Nos honoraires | Barème complet vente et location, en HTML | Obligation (arrêté du 10/01/2017) ; lien depuis chaque fiche et le pied de page ; note client « Ajouter le barème proprement » |
| 9 | `/contact` | Contact | Coordonnées, horaires, itinéraire, formulaire | Les gens cherchent « contact » ; formulaire général (POST `/contact`) |
| 10 | `/mentions-legales` | Mentions légales | Éditeur, hébergeur, carte T, garant, médiateur | Obligation légale |
| 11 | `/confidentialite` | Confidentialité | Données des formulaires, durées, droits, cookies (aucun) | RGPD ; les cookies y sont traités faute de traceur |
| — | (404) | Page introuvable | Ramener vers les biens, l'accueil, le téléphone | Variante spécifique pour une fiche disparue (bien vendu/loué) |

**URL** : françaises, minuscules, sans accent, sans slash final, sans paramètre visible sauf deux paramètres fonctionnels non indexés : `/estimation?type=maison|appartement&objet=vente|loyer` (pré-remplissage) et `/contact?bien=10.131` (pré-remplissage depuis une fiche).

**Fiche bien : `/biens/10.131`** (référence brute). Pas de slug issu du titre : les titres sont saisis en capitales avec des « + » et changent ; la référence est stable et c'est elle que l'agent donne au téléphone. Le SEO de la fiche passe par `<title>`, `h1` composé et JSON-LD, pas par l'URL. **Point à tester en premier** (Maldini, contrainte 22) : les références à point (`10.131`) ne doivent pas être traitées comme un fichier statique. Si Next 16 ou l'hébergeur les intercepte, repli : remplacer `.` par `-` dans l'URL (`/biens/10-131`) avec une fonction `refToSlug`/`slugToRef` unique, et redirection 308 depuis l'ancienne forme.

### 1.2 Pages qui n'existent pas, et pourquoi

| Page écartée | Raison |
|---|---|
| `/acheter`, `/louer` comme listes séparées, `/recherche` | Un moteur ou deux listes pour 10 biens = template de grande agence. `/biens` les contient toutes |
| `/biens/vente`, `/biens/location` | Collision avec `/biens/[reference]` et pages quasi vides (0 location aujourd'hui). Ancres `#vente` / `#location` à la place |
| `/biens-vendus` | L'archive est une section de `/biens` (et conditionnelle) ; une page dédiée serait vide la plupart du temps |
| `/secteurs/[commune]` | Contenu à inventer pour exister ; le secteur est décrit une fois, sur Le cabinet |
| `/blog`, `/conseils`, `/actualites` | Personne pour les alimenter régulièrement ; un blog abandonné nuit plus qu'il ne sert |
| `/equipe`, `/a-propos` avec portrait | L'agent ne veut pas apparaître ; le « nous » est démontré sur Le cabinet |
| `/avis` | Les avis vivent sur Google ; nous en montrons des extraits réels et renvoyons vers la fiche Google |
| `/cookies` | Aucun cookie ; une ligne dans `/confidentialite` suffit |
| `/estimation/merci` | La confirmation s'affiche à la même URL (pas de données personnelles dans l'URL, pas d'écran de remerciement accessible sans envoi) |
| `/gestion-locative` | Activité non exercée `[À CONFIRMER]` |
| `/plan-du-site` | 11 pages, toutes liées depuis le pied de page |
| Compte, favoris, alertes, comparateur, simulateur de crédit, visite virtuelle | Hors du métier d'une agence de quartier ; aucun de ces éléments |

### 1.3 Pourquoi `/vendre` et `/estimation` sont séparées

`/vendre` explique et rassure (texte long, FAQ, référencement), `/estimation` est un formulaire concentré, sans menu ni distractions. Les fusionner rallongerait le tunnel ou appauvrirait la page explicative. Le bouton « Faire estimer » de l'en-tête mène directement au tunnel : ceux qui sont décidés n'ont pas à lire `/vendre`.

### 1.4 Pourquoi `/louer` parle aux propriétaires

Le libellé « Louer » est ambigu (louer *son* bien / louer *un* logement). Décision : la page s'adresse au bailleur, mais **son premier écran renvoie le locataire en une ligne** vers `/biens#location` avec le nombre réel de biens en location. « 0 bien » n'est **jamais** affiché ; trois formulations seulement, selon le compte : « Nous n'avons aucun logement à louer en ce moment. », « Nous avons un logement à louer en ce moment. », « Nous avons N logements à louer en ce moment. » (N en chiffres). Le locataire ne perd donc pas un clic.

---

## 2. Contenu page par page

Notation des visuels : **[ILL-xx]** = illustration de Cantona (trait, même style partout, typologies d'Asnières) ; **[PHOTO-BIEN]** = photo d'annonce via l'API ; aucune photo de stock, aucune photo de personne.

Grille de référence (Pirlo, brief §3.3) : **4 colonnes sous 768 px, 12 colonnes à partir de 768 px** ; pas de grille intermédiaire de 6 colonnes. Conteneur de 1200 px, marges latérales de 20, 32 puis 40 px. Points de rupture Tailwind par défaut (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). Dans ce document, « desktop » = ≥ 1024 px (en-tête, colonne d'action), « mobile » = < 768 px.

Règle typographique des contenus affichés (brief §6.2) : **aucun point médian entre des métadonnées** ; on écrit avec des virgules ou en phrases. Les points médians qui subsistent dans ce document séparent des noms de fichiers ou des options de formulaire dans la spécification, ils ne sont jamais rendus à l'écran tels quels.

### 2.1 Accueil `/`

`<title>` : « Cabinet Rimbault, agence immobilière à Asnières-sur-Seine depuis 2009 »
Meta description : « Vente et location d'appartements et de maisons à Asnières-sur-Seine. Un cabinet indépendant au 117 boulevard Voltaire, depuis 2009. Estimation sur rendez-vous. »

| # | Section | Rôle | Contenu proposé | Visuel | Mobile |
|---|---|---|---|---|---|
| 1 | **Ouverture** | Dire qui, où, depuis quand ; ouvrir les deux chemins principaux | `h1` : « Vendre, louer, faire estimer à Asnières-sur-Seine. » Sous-texte : « Un cabinet indépendant au 117 boulevard Voltaire depuis 2009. La même personne vous suit du premier rendez-vous à la signature. » Actions : bouton grenat « Faire estimer votre bien » → `/estimation` ; lien texte « Voir nos biens (5) » → `/biens` (nombre réel). Ligne factuelle en pied de section, écrite en phrase avec des virgules : « 117 boulevard Voltaire, 01 73 64 56 10, avis Google : 4,9 sur 5 (32 avis) » (valeurs de l'API Places, repli `agency.ts`). | [ILL-01] Grande illustration au trait : immeuble de rapport en brique et pavillon en meulière (Asnières). Composition **asymétrique** : texte sur 6 à 7 des 12 colonnes à gauche, illustration qui déborde à droite jusqu'au bord de l'écran. Pas de hero centré | Texte d'abord, illustration en dessous à pleine largeur (ratio 4:3), puis la ligne factuelle. Le bouton fait toute la largeur |
| 2 | **Nos biens du moment** | Prouver l'activité réelle tout de suite | `h2` « Nos biens du moment ». Les 3 biens disponibles les plus récents (`createdAt` décroissant ; plus tard choisis par l'agent via `isFeatured`). Lien « Voir les 5 biens » (nombre réel). Si 1 ou 2 biens : cartes plus larges (voir `PropertyGrid`). **Si aucun bien : section masquée.** | [PHOTO-BIEN] | Défilement vertical (1 colonne), pas de carrousel |
| 3 | **Ce que nous faisons** | Présenter les 3 métiers en texte, pas en tuiles | Trois lignes éditoriales séparées par un filet : **Vente** — « Nous vendons des appartements et des maisons à Asnières-sur-Seine et dans les communes voisines. » → « Vendre avec nous » ; **Location** — « Nous trouvons et sélectionnons les locataires de votre logement, jusqu'à la signature du bail. » `[À CONFIRMER : périmètre exact de la prestation]` → « Louer avec nous » ; **Estimation** — « Nous estimons votre bien sur place, à partir des ventes que nous connaissons, et nous vous remettons un avis de valeur écrit. » `[À CONFIRMER : avis écrit, gratuité]` → « Faire estimer » | Aucun (texte seul) | Les 3 blocs s'empilent ; liens pleine largeur avec zone tactile ≥ 44 px |
| 4 | **Nos engagements** | Affirmer (l'accueil affirme, Le cabinet démontre) | Les 3 titres de `commitments` (`agency.ts`) avec leur texte, **sans numéros** (A15 : ce n'est pas une séquence ; liste `<ul>` séparée par des filets). Lien « Notre façon de travailler » → `/le-cabinet` | Aucun (texte seul, A27 : ILL-02 est déplacée sur Vendre) | Engagements empilés |
| 5 | **Ce que disent nos clients** | Preuve sociale vérifiable | « 4,9 sur 5, 32 avis sur Google » (valeurs API Places) + 2 extraits réels **copiés tels quels**, avec prénom/initiale et ancienneté (`relativeTime`), sans étoiles décoratives. Lien « Lire tous les avis sur Google ». **Si l'API Places échoue : seule la ligne de note `agency.ts` reste, sans extrait** | Aucun | Extraits empilés |
| 6 | **Nous trouver** | Ancrage physique | `h2` « Au 117 boulevard Voltaire ». Adresse, téléphone cliquable, horaires (`agency.ts`, `[À CONFIRMER]`), état « Ouvert / Fermé, ouvre mardi à 9 h » (`lib/opening.ts`), lien « Itinéraire » (`mapsDirections`, même onglet, sans `target` ni icône, A16). | [ILL-03] la devanture du cabinet au trait (d'après `public/maquettes/devanture-provisoire.jpg`, à remplacer par une photo propre si l'agent en fournit une) | Illustration au-dessus, infos en dessous |

Pas de section « chiffres clés », pas de bloc estimation final redondant (le bouton est dans l'en-tête et en section 1), pas d'archive (elle est sur `/biens`).

### 2.2 Nos biens `/biens`

`<title>` : « Nos biens à vendre et à louer à Asnières-sur-Seine ». Description : « Tous les appartements et maisons que nous proposons en ce moment à la vente et à la location, à Asnières-sur-Seine et alentour. »

| # | Section | Contenu | Comportement |
|---|---|---|---|
| 1 | **En-tête de page** (`PageIntro`) | `h1` « Nos biens ». Phrase : « Tous les biens que nous proposons sont sur cette page : 5 en vente, aucun en location. » (comptes réels, accord singulier/pluriel, « aucun » quand 0). Ancres « En vente » / « En location » si les deux sections ont du contenu | Pas d'illustration (la page appartient aux photos) |
| 2 | **En vente** `#vente` | `h2` « En vente » + compte. `PropertyGrid` sur la grille de 12 colonnes : 3 cartes par ligne à partir de 1024 px, 2 de 768 à 1023 px, 1 sous 768 px (grille de 4 colonnes). 1 bien = carte horizontale (photo 7 col. + texte 5 col.) ; 2 biens = 2 colonnes larges ; 4 biens = 2×2 ; ≥ 5 = 3 colonnes (dernière ligne alignée à gauche) | Ordre : disponibles d'abord (`createdAt` décroissant), puis sous offre / sous compromis |
| 3 | **En location** `#location` | Même grille. **État vide (cas actuel)** : « Nous n'avons aucun logement à louer en ce moment. » + deux lignes : « Vous cherchez un logement ? Écrivez-nous ce que vous cherchez, nous vous préviendrons. » → `/contact?objet=location` ; « Vous êtes propriétaire ? » → `/louer` | Section toujours présente (elle répond à une question), mais réduite à l'état vide |
| 4 | **Récemment vendus et loués** | Liste des biens `VENDU` / `LOUE` (API `GET /properties?status=VENDU&status=LOUE&limit=12`). Carte réduite : photo **sans aucun traitement** (ni filtre, ni voile, ni désaturation, A14) ; la différence avec les biens disponibles vient seulement de la taille plus petite et du badge « Vendu » ou « Loué » en crème soutenu. Texte : « Appartement 3 pièces, Asnières-sur-Seine ». **Sans prix**, **non cliquable** (la fiche d'un bien vendu renvoie 404 dans l'API). **Section masquée si 0.** | 4 cartes par ligne à partir de 1024 px, 2 en dessous |
| 5 | **Fin de page** | Une ligne : « Vous souhaitez vendre ? Nous estimons votre bien sur place. » → `/estimation` | — |

Si **les deux** listes sont vides : `h1`, puis l'état vide unique « Aucun bien n'est en ligne en ce moment… » avec les mêmes deux sorties. Si **l'API est en erreur** : message sobre « Nos annonces ne peuvent pas s'afficher pour le moment. Appelez-nous au 01 73 64 56 10. » (pas de 500, pas de crash ; Maldini scénario `error`).

**Carte de bien (`PropertyCard`)** — modèle Inigo, sans ombre, sans bordure, sans cœur :
- photo 4:3 (`fill` + `object-fit: cover`, `sizes` adapté à la grille), alt généré ;
- ligne 1 : titre composé « Appartement 3 pièces, 59,5 m² » — prix « 375 000 € » (location : « 1 250 € par mois charges comprises », jamais « CC ») ;
- ligne 2 : « Asnières-sur-Seine, Impressionnistes » (virgule, pas de point médian) ; statut si différent de disponible (« Sous offre », « Sous compromis »), « Exclusivité » si `isExclusive` ;
- toute la carte est un seul lien (`<a>` englobant, un seul arrêt de tabulation), titre en `h3` ;
- sans photo : aplat crème soutenu avec la mention « Photos à venir » en casse normale (ni capitales, ni petites capitales, pas d'icône).
- types gérés : appartement, maison, **local commercial / boutique** (note client « boutiques »), parking, terrain — libellés dans `lib/property/labels.ts`.

### 2.3 Fiche bien `/biens/[reference]`

`<title>` : « Appartement 3 pièces de 59,5 m² à Asnières-sur-Seine, 375 000 € ». Description : 150 premiers caractères de la description normalisée. Image OG : photo principale.

Mise en page desktop : **contenu 8 colonnes + colonne d'action 4 colonnes collante** (prix, honoraires, boutons). Mobile : une colonne, prix sous le titre, puis deux boutons pleine largeur (A6). Aucun élément fixe en bas d'écran.

| # | Section | Contenu | Données / règles |
|---|---|---|---|
| 0 | **Fil d'Ariane** | « Nos biens › Appartement 3 pièces » | Visible desktop et mobile (une ligne, tronquée) |
| 1 | **Galerie** | Photo principale grande en **3:2** en desktop + 2 à 4 vignettes ; bouton « Voir les 12 photos » ; visionneuse plein écran (flèches clavier, Échap, balayage tactile, compteur « 3 / 12 », retour du focus) | Tri par `order`. Visionneuse sur **fond encre** (`ink`). Portrait : `object-fit: contain` sur ce fond encre dans la visionneuse, `cover` dans la grille. Alt : « Appartement 3 pièces à Asnières-sur-Seine, photo 2 sur 12 ». Mobile : défilement horizontal à aimantation (scroll-snap), compteur, pas de vignettes |
| 2 | **En-tête du bien** | `h1` composé « Appartement 3 pièces de 59,5 m² » ; ligne lieu « Asnières-sur-Seine, Impressionnistes » (virgule) ; titre saisi par l'agent en sous-titre, en casse normale (« 3 pièces, terrasse, parking et cave ») ; statut ; « Exclusivité » ; « Réf. 10.130 » | Titre composé depuis `propertyType`, `rooms`, `surface` (jamais le titre brut en `h1`). Ville et quartier normalisés (`Asnieres` → `Asnières`, `collange` → `Collange`), jamais l'adresse exacte |
| 3 | **Prix** (colonne d'action) | Voir règles ci-dessous | Formulation La Forêt + note client |
| 4 | **L'essentiel** | Liste de définitions courte : surface, pièces, chambres, salles d'eau, étage « 3e sur 4 » / « rez-de-chaussée », ascenseur, extérieurs (balcon, terrasse, jardin), stationnement, cave, année de construction | N'affiche que les valeurs non nulles. Jamais « 1 chambres » (accord, note client) |
| 5 | **Description** | Texte normalisé en paragraphes (`lib/property/description.ts` : découpe sur « - » en début de segment, capitales isolées ramenées en casse normale seulement si mot entier ≥ 4 lettres et hors sigles, longueur de ligne ≤ 70 caractères) | Pas de « Lire la suite » sous 1 000 caractères |
| 6 | **Bilan énergétique** | Étiquettes DPE et GES (SVG `dpeImageUrl` / `gesImageUrl` générés par l'admin, source unique `scale.ts`), classe + valeur (« D, 216 kWh/m²/an », « B, 6 kg CO₂/m²/an »). Coûts, trois formulations seulement (A7, A8, doc 03 §6.7) : coûts et `dateReferenceEnergie` présents : « Montant estimé des dépenses annuelles d'énergie pour un usage standard : entre 830 € et 1 190 € par an, abonnements compris (prix de l'énergie de référence : 2026). » ; coûts présents sans date : la même phrase sans parenthèse ; coûts absents : « Montant estimé des dépenses annuelles d'énergie pour un usage standard : non communiqué. » Puis « Les coûts sont estimés en fonction des caractéristiques du logement et pour une utilisation standard. » | Coûts absents (09.345 et 10.131) : la ligne « non communiqué » est **toujours affichée**, jamais masquée ; bloquant pour la mise en ligne tant que l'agent n'a pas saisi les coûts (migration `drop_annual_energy_cost`, saisie obligatoire côté admin). L'année est extraite de la date (`getFullYear()`), jamais d'autre année ; [À CONFIRMER, A8] si le champ est la date du DPE, la parenthèse devient « (DPE réalisé en 2026) ». Formatage isolé dans une seule fonction de `lib/property/`. `VIERGE` : « DPE vierge » avec explication |
| 7 | **Copropriété et charges** | Liste de définitions de la planche (`<dl>`, libellé à gauche, valeur à droite), une seule formulation : « Bien soumis au statut de la copropriété : Oui », « Nombre de lots : 44 », « Charges annuelles moyennes : 1 235 € », « Procédure en cours sur la copropriété : Aucune » (ou « Oui »), « Taxe foncière : 910 € » | Note client « addition des lots » : on affiche le **nombre de lots** de la copropriété (`coprLots`) |
| 8 | **Emplacement** | « Asnières-sur-Seine, quartier des Impressionnistes. » + « L'adresse exacte vous est communiquée lors de la visite. » + « Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques » (lien `georisques.gouv.fr`) | Pas de carte (GPS nul, adresse non publique) |
| 9 | **Votre interlocuteur** | Texte, sans photo : « Une seule personne s'occupe de ce bien, des visites jusqu'à la signature chez le notaire. Appelez le cabinet au 01 73 64 56 10 ou écrivez-nous ci-dessous en citant la référence 10.130. » | Remplace la « photo interlocuteur » de `notes.txt` |
| 10 | **Demander une visite** `#contact` | `ContactForm` en ligne avec `subject` = `BIEN_SALE` ou `BIEN_RENT`, `propertyReference` pré-rempli, message pré-rédigé modifiable (« Bonjour, je souhaite visiter l'appartement réf. 10.130. ») | Voir §3.6 |
| 11 | **Autres biens** | « D'autres biens à Asnières-sur-Seine » : jusqu'à 3 biens similaires (`getSimilarProperties`) | **Masqué si 0** |

**Règles du bloc prix** (`lib/property/fees.ts`, testées unitairement) :
- Vente, honoraires acquéreur (`honorairesType = "acquereur"`, `honoraires > 0`) :
  « 198 000 € » / « Soit 189 000 € honoraires exclus » / « Honoraires de 4,76 % TTC à la charge de l'acquéreur » (bien réel 09.362 : 9 000 / 189 000 = 4,76 %). Pourcentage = `honorairesPct` s'il existe, sinon `honoraires / (price − honoraires)` arrondi à 2 décimales.
- Vente, honoraires vendeur (`"vendeur"`, `honoraires` = `-1` ou nul) : « 300 000 € » / « Honoraires à la charge du vendeur ». **Jamais « -1 € ».**
- Location : « 1 250 € par mois charges comprises » (ou « + 80 € de charges » selon `chargesIncluses`) / dépôt de garantie / honoraires locataire `[À FOURNIR par l'API ou le barème]`.
- Sous le bloc : lien « Consulter nos honoraires » → `/honoraires`.
- Colonne d'action desktop : prix, lignes d'honoraires, bouton grenat « Demander une visite » (ancre `#contact`), lien « 01 73 64 56 10 », WhatsApp seulement si `agency.whatsapp`.

**Mobile** (A6) : **pas de barre d'action fixe.** Le bloc prix est suivi immédiatement de deux boutons pleine largeur, empilés : « Appeler le cabinet » (secondaire, lien `tel:`) puis « Demander une visite » (principal, grenat, ancre `#contact`). Le téléphone reste aussi dans le menu, et l'en-tête mobile collant sert de repère permanent. Aucun élément flottant ni fixe en bas d'écran sur tout le site.

**Bien introuvable** : `notFound()` → `biens/[reference]/not-found.tsx` : « Ce bien n'est plus en ligne. Il a peut-être été vendu ou loué. » + liens « Voir nos biens » et téléphone. Statut HTTP 404.

### 2.4 Tunnel d'estimation `/estimation`

Détaillé en §3.

### 2.5 Vendre `/vendre`

`<title>` : « Vendre votre appartement ou votre maison à Asnières-sur-Seine »

| # | Section | Contenu proposé |
|---|---|---|
| 1 | En-tête | `h1` « Vendre votre bien à Asnières-sur-Seine ». « Nous commençons toujours par une visite. Le prix que nous vous donnons est celui auquel nous pensons pouvoir vendre, pas celui qui ferait plaisir. » Bouton « Faire estimer votre bien » → `/estimation?objet=vente`. [ILL-02] balcon en fer forgé, 280 × 350, colonnes 9 à 12 en desktop, texte sur les colonnes 1 à 7 (A27). ILL-04 n'est appelée sur aucune page : elle dessine la même maison qu'ILL-01 et reste en réserve dans `public/illustrations/` |
| 2 | Comment se passe une vente | Étapes numérotées (vraie séquence, rendue en `<ol>`, A15), une phrase chacune : 1. « Nous visitons votre bien et vous remettons un avis de valeur écrit. » 2. « Nous convenons ensemble du prix et du mandat. » 3. « Nous préparons l'annonce : photos, description, diagnostics. » `[À CONFIRMER : qui fait les photos, quels portails]` 4. « Nous organisons les visites, avec des acquéreurs dont nous avons vérifié le projet. » 5. « Nous négocions les offres et vous les présentons par écrit. » 6. « Nous préparons le compromis et vous accompagnons jusqu'à l'acte chez le notaire. » Desktop : liste verticale avec filet et numéro en serif à gauche ; mobile : idem empilé |
| 3 | L'estimation | « Gratuite et sans engagement » `[À CONFIRMER]`. Ce que nous regardons (surface, étage, exposition, état, copropriété, ventes récentes du quartier). « Nous ne donnons pas de prix en ligne : un prix sérieux demande de voir le bien. » Bouton tunnel |
| 4 | Nos honoraires de vente | Résumé en une phrase + lien `/honoraires` `[À FOURNIR : barème]` |
| 5 | Questions fréquentes | `Disclosure` (détails/summary natifs) : « Combien coûte une estimation ? », « Combien de temps prend une vente ? » `[À CONFIRMER]`, « Quels documents préparer ? » (titre de propriété, diagnostics, 3 derniers PV d'AG et règlement de copropriété, taxe foncière), « Faut-il signer un mandat exclusif ? » `[À CONFIRMER]`, « Qui paie les honoraires ? » |
| 6 | Biens vendus récemment | Réutilise `SoldArchive` limité à 4. **Masqué si 0** |
| 7 | Fin | « Parlons de votre bien. » Bouton tunnel + téléphone |

JSON-LD `FAQPage` sur la FAQ.

### 2.6 Louer `/louer`

`<title>` : « Mettre votre logement en location à Asnières-sur-Seine »

| # | Section | Contenu proposé |
|---|---|---|
| 0 | Renvoi locataire (en tête, une ligne sur filet) | « Vous cherchez un logement ? » suivi d'une des trois phrases du §1.4 selon le nombre réel : « Nous n'avons aucun logement à louer en ce moment. », « Nous avons un logement à louer en ce moment. », « Nous avons N logements à louer en ce moment. » Lien → `/biens#location`. Jamais « 0 bien » |
| 1 | En-tête | `h1` « Louer votre logement avec nous ». « Nous estimons le loyer, sélectionnons le locataire et préparons le bail. » `[À CONFIRMER : périmètre, état des lieux, garantie loyers impayés]`. Bouton « Faire estimer le loyer » → `/estimation?objet=loyer`. [ILL-05] immeuble de rapport en brique |
| 2 | Comment se passe une location | Étapes : estimation du loyer, annonce et visites, vérification des dossiers, bail et état des lieux, remise des clés |
| 3 | Ce que nous ne faisons pas | « Nous n'assurons pas la gestion locative au quotidien. » `[À CONFIRMER]` — section supprimée si l'agent la propose |
| 4 | Honoraires de location | Rappel du plafond légal (loi ALUR) selon la zone d'Asnières `[À CONFIRMER : zone tendue / très tendue]`, lien `/honoraires` |
| 5 | Questions fréquentes | Loyer, dossier locataire demandé, délais, état des lieux, dépôt de garantie |
| 6 | Fin | Bouton tunnel + téléphone |

### 2.7 Le cabinet `/le-cabinet`

`<title>` : « Le Cabinet Rimbault, agence immobilière indépendante à Asnières depuis 2009 »

| # | Section | Contenu proposé | Visuel |
|---|---|---|---|
| 1 | En-tête | `h1` « Le cabinet ». « Le Cabinet Rimbault est installé au 117 boulevard Voltaire à Asnières-sur-Seine depuis 2009. Nous vendons et louons des appartements et des maisons dans la ville et les communes voisines. » | [ILL-06] perspective de rue au trait (immeubles d'Asnières), pleine largeur. Ni légende ni alt ne la présentent comme le boulevard Voltaire (A13) : illustration décorative, `alt=""`. **Emplacement validé en 10:3** (au lieu de 21:9) : 1200 × 360, pleine largeur du conteneur (colonnes 1 à 12), sous le chapô ; mobile : même ratio, pleine largeur. Seul ce cadrage exclut les rez-de-chaussée commerçants (doc 05) |
| 2 | Notre façon de travailler | Les 3 engagements **développés** (le « pourquoi » et le « comment » de chacun, 3 à 5 lignes ; textes de base `agency.ts`, compléments `[À CONFIRMER]`) | — |
| 3 | Votre interlocuteur | « Le cabinet est une structure volontairement petite : la personne qui estime votre bien est celle qui le fait visiter, le négocie et vous suit chez le notaire. Vous n'avez jamais affaire à un standard. » Pas de nom ni de photo `[ZIDANE : nommer ou non l'agent dans le texte]` | — |
| 4 | Notre secteur | « Asnières-sur-Seine, et les communes voisines : … » `[À CONFIRMER : liste ; un bien actuel est à Levallois-Perret]`. « Au-delà, nous préférons vous adresser à quelqu'un dont c'est le terrain. » | [ILL-07] carte au trait de la boucle de la Seine (SVG à la main, Cantona), sans fond de carte tiers. **Tant qu'ILL-07 n'existe pas, la section s'affiche en texte seul** : aucun cadre vide ni emplacement réservé |
| 5 | Ce que disent nos clients | Note + nombre d'avis, jusqu'à 5 extraits réels (API Places), lien Google | — |
| 6 | Venir au cabinet | Adresse, horaires, téléphone, itinéraire | [ILL-03] (réutilisée) |
| 7 | Informations professionnelles | Carte T, CCI, garant, RCS, capital, médiateur, lien barème — présentées comme un gage de sérieux, pas en petits caractères | — |

### 2.8 Nos honoraires `/honoraires`

`<title>` : « Nos honoraires de vente et de location »

1. `h1` « Nos honoraires ». « Barème en vigueur depuis le [À FOURNIR]. Honoraires TTC, TVA à 20 %. »
2. **Vente** : tableau HTML (`<table>` avec `<caption>`, en-têtes de colonnes) par tranche de prix `[À FOURNIR]`, mention de qui les paie, exemple de calcul. Mobile : tableau à 2 colonnes lisibles, sans défilement horizontal.
3. **Location** : honoraires locataire (visite, dossier, rédaction du bail : X €/m² ; état des lieux : Y €/m², plafonds ALUR de la zone) et honoraires bailleur `[À FOURNIR]`.
4. Mentions : « Les honoraires sont indiqués sur chaque annonce. »
5. Bouton « Imprimer le barème » (`window.print`) + feuille d'impression propre (pas de PDF à maintenir).

**Bloquant mise en ligne** : la page ne doit pas être publiée avec des tranches inventées. Contenu dans `src/content/honoraires.ts` ; tant qu'il est vide, le build de production échoue (voir §6, `check-launch`).

### 2.9 Contact `/contact`

`<title>` : « Contacter le Cabinet Rimbault, 117 boulevard Voltaire, Asnières »

Desktop : deux colonnes (coordonnées 5 col. / formulaire 7 col.). Mobile : coordonnées d'abord (le téléphone est l'action la plus rapide), formulaire ensuite.

1. `h1` « Nous contacter ». « Le plus simple est de nous appeler. Vous pouvez aussi nous écrire : nous répondons [À CONFIRMER : délai]. »
2. Coordonnées : téléphone (grand, serif, `tel:`), e-mail `[À FOURNIR : adresse sur le domaine]`, WhatsApp si fourni, adresse, horaires + état d'ouverture, « Itinéraire ».
3. Formulaire (`ContactForm`) — voir §3.6.
4. Lien discret : « Vous souhaitez faire estimer un bien ? Le formulaire d'estimation est plus adapté. » → `/estimation`.

### 2.10 Mentions légales `/mentions-legales` et Confidentialité `/confidentialite`

Pages de texte (gabarit `ProsePage`, colonne de 68 caractères, table des matières en ancres si > 4 sections).

- **Mentions légales** : éditeur (Cabinet Rimbault, SAS au capital de 4 000 €, RCS Nanterre 511 484 586, siège 117 bd Voltaire), directeur de la publication `[À CONFIRMER]`, contact, carte T CPI 9201 2018 000 024 838 (CCI Paris Île-de-France), garant LLOYD'S France + adresse `[À FOURNIR]`, **médiateur de la consommation `[À FOURNIR, bloquant]`**, hébergeur du site `[À CONFIRMER : Netlify ou Vercel]` et de l'API (Railway), crédits (illustrations : à préciser par Cantona ; polices et licences), propriété intellectuelle.
- **Confidentialité** : responsable du traitement, données collectées (formulaires estimation et contact : liste exacte des champs), finalités (vous recontacter, préparer l'estimation, répondre à votre demande), base légale (consentement / mesures précontractuelles), destinataires (le cabinet uniquement ; sous-traitants techniques : hébergeur de l'API, base de données, service d'envoi d'e-mails Resend), durée de conservation `[À CONFIRMER : proposé 3 ans après le dernier contact]`, droits (accès, rectification, effacement, opposition) et adresse d'exercice, réclamation CNIL, Bloctel, **cookies : aucun cookie ni traceur ; stockage local du navigateur utilisé uniquement pour conserver votre saisie du formulaire d'estimation pendant la session**.

### 2.11 Erreurs

- `not-found.tsx` (racine) : « Cette page n'existe pas ou n'existe plus. » + liens Accueil, Nos biens, téléphone. [ILL-08] petit motif (porte cochère fermée). En-tête et pied de page présents.
- `(site)/error.tsx` (client) : « Un problème technique empêche l'affichage de cette page. » + « Réessayer » + téléphone.
- `global-error.tsx` : version minimale autonome (balises `html`/`body`).

---

## 3. Tunnel d'estimation (détail)

### 3.1 Principe

Pas de prix automatique (contraire à l'engagement « Nous refusons les estimations gonflées »). Le tunnel prépare une **visite d'estimation**. 4 étapes, une préoccupation par écran, environ 90 secondes. **Les intentions « mise en vente envisagée / mise en location envisagée / juste une idée de prix » sont retirées** (`notes.txt`) : aucun champ `intent` d'intention, aucune question de délai de projet.

**Objet de l'estimation (décidé, A1).** Le cabinet estime des prix de vente *et* des loyers ; ce n'est pas une intention mais la nature de l'estimation. Étape 1 : « Que souhaitez-vous faire estimer ? », deux choix radio « Le prix de vente » et « Le loyer », pré-rempli par `?objet=vente|loyer` depuis `/vendre` ou `/louer`, « Le prix de vente » sélectionné par défaut. Envoyé dans `intent` = `ESTIMATION_VENTE` ou `ESTIMATION_LOYER` (et repris en clair dans l'e-mail). `timeframe` n'est pas envoyé.

### 3.2 Gabarit

Groupe de routes `(tunnel)` avec sa propre mise en page : en-tête réduit (logotype → accueil, « 01 73 64 56 10 », lien « Quitter » qui demande confirmation si des réponses existent), **pas de navigation principale**, pied de page réduit (mentions légales, confidentialité, carte T). Colonne unique de 640 px max.

Indicateur de progression : « Étape 2 sur 4, ses caractéristiques » + barre fine (animation d'Iniesta). Boutons : « Continuer » (grenat, à droite desktop / pleine largeur mobile), « Retour » (lien texte). Le bouton du navigateur « Précédent » revient à l'étape précédente.

### 3.3 Étapes et champs

Les valeurs envoyées à l'API sont **des chaînes** pour `surface`, `levels`, `rooms`, `bedrooms`, `bathrooms`, `constructionYear` (colonnes `String?` en base : un nombre ferait échouer Prisma).

**Étape 1 — Votre bien** (`?etape=1`)

| Champ | UI | Requis | Validation | API |
|---|---|---|---|---|
| Que souhaitez-vous faire estimer ? | 2 grands choix radio : Le prix de vente / Le loyer (« Le prix de vente » par défaut, ou `?objet=`) | oui | enum | `intent` = `ESTIMATION_VENTE` \| `ESTIMATION_LOYER` |
| Type de bien | 2 grands choix radio : Appartement / Maison | oui | — | `propertyType` = `APPARTEMENT` \| `MAISON` |
| Adresse | texte, `autocomplete="street-address"` | non | ≤ 200 car. | `address` (« 12 rue X, Asnières-sur-Seine ») |
| Code postal | texte, `inputmode="numeric"`, `autocomplete="postal-code"` | oui | `^\d{5}$` | `postalCode` |
| Ville | texte, pré-rempli « Asnières-sur-Seine » si 92600 | non | ≤ 80 car. | concaténée à `address` |

Aide : « L'adresse nous permet de situer le bien. Elle n'est jamais publiée. » Si le code postal est hors secteur `[À CONFIRMER : liste]` : note non bloquante « Ce bien est en dehors de notre secteur habituel. Nous vous répondrons quand même, quitte à vous orienter vers un confrère. » (cohérent avec l'engagement n° 3).

**Étape 2 — Ses caractéristiques** (`?etape=2`)

| Champ | UI | Requis | Validation | API |
|---|---|---|---|---|
| Surface habitable | nombre + « m² », décimales à la virgule acceptées | oui | 8 à 2 000 | `surface` (« 59.5 ») |
| Pièces | choix radio en rangées (A18) : 1 pièce, 2 pièces, 3 pièces, 4 pièces, 5 pièces ou plus | oui | enum | `rooms` (« 1 » à « 4 », « 5+ ») |
| Chambres | `select` natif : 0 à 6, « 7 ou plus » | non | ≤ pièces | `bedrooms` |
| Salles de bains / d'eau | `select` natif : 1 à 3, « 4 ou plus » | non | — | `bathrooms` |
| *Appartement* : étage | sélecteur RDC, 1 à 20+ ; case « dernier étage » | non | — | dans `message` (champ absent du modèle) |
| *Appartement* : ascenseur | Oui / Non | non | — | dans `message` |
| *Maison* : niveaux | sélecteur 1 à 4+ | non | — | `levels` |
| *Maison* : surface du terrain | nombre m² | non | 0 à 100 000 | dans `message` |
| Extérieurs et annexes | cases : Balcon, Terrasse, Jardin, Garage ou parking, Cave | non | — | `hasBalcony`, `hasTerrace`, `hasGarden`, `hasParking`, cave dans `message` |
| État général | 6 choix radio avec une ligne d'aide chacun : Neuf ou récent · Très bon état · Bon état · À rafraîchir (peinture, sols) · À rénover (cuisine, salle de bains, électricité) · À restaurer (gros travaux) | non | enum | `condition` = `NEUF`…`A_RESTAURER` |
| Époque de construction | sélecteur : Avant 1949 · 1949-1974 · 1975-1999 · 2000 et après · Je ne sais pas | non | — | `constructionYear` (libellé) |
| Travaux récents | zone de texte | non | ≤ 500 car. | `renovations` |

Les champs spécifiques au type apparaissent selon le choix de l'étape 1 (sans animation de hauteur brusque).

**Étape 3 — Vous** (`?etape=3`)

| Champ | UI | Requis | Validation | API |
|---|---|---|---|---|
| Prénom | `autocomplete="given-name"` | oui | 1 à 80 | `firstName` |
| Nom | `autocomplete="family-name"` | oui | 1 à 80 | `lastName` |
| E-mail | `type="email"` | oui | regex de l'API + trim + minuscules | `email` |
| Téléphone | `type="tel"` | non, « recommandé » | FR : `^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$` | `phone` (normalisé « 06 12 34 56 78 ») |
| Comment préférez-vous être recontacté ? | radio : Par téléphone / Par e-mail | non | téléphone requis si « Par téléphone » | dans `message` |
| À quel moment ? | radio : Matin · Midi · Fin de journée · Indifférent | non | — | dans `message` |
| Un mot à ajouter ? | zone de texte | non | ≤ 1 000 car., compteur | `message` (après le bloc structuré) |

**Étape 4 — Vérification et envoi** (`?etape=4`)

- Récapitulatif en 3 blocs (Votre bien, Ses caractéristiques, Vous), chacun avec un lien « Modifier » qui ramène à l'étape et revient ensuite directement au récapitulatif.
- Consentement RGPD **obligatoire**, case **non cochée** : « J'accepte que le Cabinet Rimbault utilise ces informations pour me recontacter au sujet de cette estimation. Elles ne sont ni cédées ni utilisées à d'autres fins et sont conservées [3 ans] au plus. Je peux les faire rectifier ou supprimer à tout moment en écrivant à [e-mail]. » + lien `/confidentialite`. `rgpd: true` envoyé.
- Bouton « Envoyer la demande » (libellé unique, A17). Pendant l'envoi : bouton désactivé, libellé « Envoi en cours… », `aria-busy`.

### 3.4 Charge utile envoyée (Server Action → `POST /api/public/evaluation`)

```ts
{
  propertyType: "APPARTEMENT",            // requis
  postalCode: "92600",                    // requis
  address: "12 rue X, Asnières-sur-Seine",
  surface: "59.5", rooms: "3", bedrooms: "2", bathrooms: "1", levels: undefined,
  constructionYear: "1949-1974",
  renovations: "Cuisine refaite en 2022",
  hasBalcony: true, hasTerrace: false, hasGarden: false, hasParking: true,
  condition: "BON_ETAT",
  intent: "ESTIMATION_VENTE",             // ou "ESTIMATION_LOYER" (A1)
  firstName: "…", lastName: "…", email: "…", phone: "06 12 34 56 78",
  message: "[Précisions saisies sur le site]\nÉtage : 3ᵉ, dernier étage : non\nAscenseur : oui\nCave : oui\nRecontact : par téléphone, en fin de journée\n\n[Message]\n…",
  rgpd: true,
  source: "vitrine/estimation",
  userAgent: "<en-tête User-Agent lu côté serveur>",
  referer: "/vendre"                      // page d'entrée dans le tunnel (chemin interne uniquement)
}
```

Non envoyés : `situation` (laisse la valeur par défaut `RENSEIGNEMENT`), `timeframe`, `hasPool`.
**Évolution possible** (non bloquante) : ajouter `floor`, `hasElevator`, `landSurface`, `hasCellar`, `contactPreference` au modèle `Evaluation`. Ordre imposé : migration et déploiement de l'API **avant** la vitrine (mémoire projet). En v1, le bloc structuré de `message` suffit et reste lisible dans l'admin.

### 3.5 Validation, état, erreurs, anti-spam

- **Validation** : mêmes fonctions côté client (au `blur` puis à « Continuer ») et côté serveur dans la Server Action (jamais de confiance au client). Fichier partagé `src/lib/forms/estimation-schema.ts` (pur, sans `server-only`, sans dépendance ajoutée).
- **Messages d'erreur** (sous le champ, `aria-describedby`, + résumé en tête d'étape avec liens vers les champs, focus sur le résumé) :
  - « Choisissez le type de bien. »
  - « Indiquez un code postal à 5 chiffres, par exemple 92600. »
  - « Indiquez la surface en m², par exemple 62. » / « La surface doit être comprise entre 8 et 2 000 m². »
  - « Indiquez le nombre de pièces. »
  - « Le nombre de chambres ne peut pas dépasser le nombre de pièces. »
  - « Indiquez votre prénom. » / « Indiquez votre nom. »
  - « Indiquez une adresse e-mail valide, par exemple nom@exemple.fr. »
  - « Ce numéro ne semble pas valide. Indiquez un numéro français à 10 chiffres. »
  - « Indiquez un numéro de téléphone pour être rappelé. »
  - « Votre accord est nécessaire pour que nous puissions vous recontacter. »
  - Envoi échoué (réseau, 5xx, `ApiConfigError`) : bandeau en tête de l'étape 4 « Votre demande n'a pas pu être envoyée. Vos réponses sont conservées : réessayez dans un instant, ou appelez-nous au 01 73 64 56 10. » Rien n'est effacé.
  - 400 de l'API : message de l'API ramené au champ concerné si identifiable, sinon message générique ci-dessus.
- **Sauvegarde de l'état** : `sessionStorage`, clé `cr:estimation:v1`, écrite à chaque changement (debounce 300 ms), durée de vie 24 h, accès entouré de `try/catch` (navigation privée). Au retour : « Nous avons retrouvé vos réponses. » + « Recommencer ». Effacée après envoi réussi et via « Recommencer ». L'étape courante est dans l'URL (`?etape=`) ; arriver directement sur une étape dont les précédentes sont incomplètes ramène à la première étape incomplète.
- **Anti-spam** : (1) champ piège `site_web` hors écran (`aria-hidden`, `tabindex=-1`, `autocomplete="off"`) ; (2) horodatage du premier affichage envoyé avec le formulaire, refus si l'envoi a lieu moins de 4 s après. Dans les deux cas, la Server Action **répond succès sans appeler l'API** (le robot n'apprend rien). Limitation de débit : à faire côté API (lot API), une limite en mémoire sur une fonction serverless n'est pas fiable.
- **Double envoi** : `useActionState` + bouton désactivé pendant `pending` ; jeton d'idempotence en mémoire du composant pour ignorer un second envoi identique.
- **Clé API** : jamais exposée au navigateur. La Server Action appelle `lib/api/evaluation.ts` (`server-only`).

### 3.6 Écran de confirmation (même URL, l'état remplace le formulaire)

- Focus déplacé sur le `h1` « Votre demande est bien arrivée. »
- « Merci, [Prénom]. Un e-mail de confirmation vient de vous être envoyé à [e-mail]. »
- Récapitulatif court (type, adresse ou code postal, surface, pièces).
- **Ce qui va se passer** : 1. « Nous vous recontactons [par téléphone / par e-mail] pour convenir d'une visite. » 2. « Nous visitons le bien avec vous. » 3. « Nous vous remettons un avis de valeur écrit. » `[À CONFIRMER]`. **Délai de réponse affiché seulement s'il est validé par l'agent** `[À CONFIRMER]`.
- « Une question d'ici là ? 01 73 64 56 10 », adresse du cabinet.
- Liens : « Retour à l'accueil », « Voir nos biens ».
- `sessionStorage` vidé.

### 3.7 E-mail reçu par l'agent (lot API, dans `cabinet-rimbault-api`)

À ajouter dans `POST /api/public/evaluation` (et sur le même modèle dans `POST /contact`) :
- **Destinataire** : `AGENCY_NOTIFICATION_EMAIL` (variable d'environnement), à défaut `agencySettings.email`.
- **`replyTo`** : e-mail du demandeur (répondre en un clic).
- **Objet** : « Estimation, appartement de 59,5 m², 3 pièces, 92600, Prénom Nom » (variante « Estimation du loyer » si `intent = ESTIMATION_LOYER`).
- **Corps** (HTML sobre + version texte) : en-tête « Nouvelle demande d'estimation reçue le 30/10/2026 à 14 h 12 » ; tableau Coordonnées (nom, téléphone cliquable, e-mail, préférence de recontact) ; tableau Bien (objet, type, adresse, code postal, surface, pièces, chambres, salles d'eau, niveaux, extérieurs, état, époque, travaux) ; bloc « Précisions et message » (contenu de `message` tel quel) ; consentement RGPD (oui, horodaté) ; page d'entrée (`referer`) ; lien « Ouvrir dans l'admin » → `<ADMIN_URL>/estimations/{id}`.
- Envoi **attendu** (pas fire-and-forget silencieux) ou au minimum journalisé avec alerte ; l'enregistrement en base reste prioritaire : si l'e-mail agent échoue, la demande est quand même créée (et visible dans l'admin).
- Dans la même modification : refuser `rgpd !== true` (422 `RGPD_REQUIRED`, comme `/contact`) — sans risque pour la vitrine qui envoie toujours `true`.
- Tests : uniquement via le mock (Maldini). Aucun POST vers la production.

### 3.8 Formulaire de contact (`ContactForm`, POST `/contact`)

Utilisé sur `/contact` et en bas de fiche bien.
- Objet (radio, masqué sur la fiche où il est imposé) : « Un bien en particulier » (`BIEN_SALE`/`BIEN_RENT` selon le bien, avec champ référence), « Une recherche de location » (`OTHER`, pré-sélectionné par `?objet=location`), « Une autre question » (`OTHER`). L'estimation n'est pas proposée : on renvoie vers le tunnel.
- Champs : prénom, nom, e-mail, téléphone (facultatif), message (1 à **500** caractères, compteur visible — limite de l'API), consentement RGPD (non coché, obligatoire), champ piège + horodatage.
- Corps **imbriqué** conforme à l'API : `{ subject, propertyReference?, contact: {firstName, lastName, email, phone?, message}, consent: {rgpd: true}, meta: {source: "vitrine/contact" | "vitrine/fiche", page, userAgent, referer} }`. Erreurs 400 `fields["contact.email"]` → ramenées sous le champ.
- Confirmation en place : « Votre message est bien arrivé. Nous vous répondons [délai À CONFIRMER]. »

---

## 4. Navigation, fil d'Ariane, SEO

### 4.1 En-tête (`SiteHeader`)

- Desktop (≥ 1024 px), hauteur **80 px** : logotype à gauche ; navigation centrée-gauche à **5 entrées** (A2) : Nos biens, Vendre, Louer, Le cabinet, Contact ; à droite le téléphone « 01 73 64 56 10 » (lien `tel:`) et le bouton **secondaire compact** « Faire estimer » (A19 : contour 1 px encre, texte encre, fond transparent, 40 px de haut ; au survol fond encre et texte crème, 180 ms). Il n'est jamais grenat : le seul bouton grenat d'un écran appartient au contenu de la page.
  « Contact » est la 5e entrée (arbitrage A2) : le formulaire doit être joignable depuis l'en-tête ; les 5 libellés tiennent en une ligne dès 1024 px.
- Lien actif : couleur grenat + `aria-current="page"` (la fiche bien active « Nos biens »).
- Comportement au défilement (A3) : en desktop, l'en-tête est **statique** (non collant). Sous 1024 px, il est **collant en permanence** (`sticky`), sans masquage ni réapparition, sans changement de fond ni ombre. Le filet du bas est toujours présent, à toutes les tailles.
- Sous 1024 px, hauteur **64 px** : logotype ; le même bouton secondaire compact de 40 px (A19), libellé « Faire estimer » à partir de 380 px de large et « Estimer » en dessous (A5) ; bouton texte « Menu » (Hanken 500, 15 px, cible de **48 × 48 px**, `aria-expanded`, `aria-controls`, pas d'icône hamburger, A4).
- **Menu mobile** plein écran, fond crème : les 5 entrées en grande serif, puis « Faire estimer votre bien » en bouton **principal** grenat pleine largeur (A19 : le contenu de la page est masqué, c'est le seul bouton grenat visible), téléphone (secondaire), adresse, horaires. Piège du focus, fermeture par Échap et par « Fermer », défilement de la page bloqué, focus rendu au bouton. Se ferme à chaque navigation.
- Lien d'évitement « Aller au contenu » en premier élément focusable.

### 4.2 Pied de page réglementaire (`SiteFooter`)

Structure unique arbitrée en A20 ; **propriétaire : Xavi, lot 1** (`src/components/layout/SiteFooter.tsx` et `ProfessionalInfo.tsx`). Aplat grenat, seul du site ; typographie et couleurs selon le doc 03 §6.10. Dans l'ordre :
1. **Phrase** en Spectral 400 36/42 (28/34 en mobile), crème : « Cabinet Rimbault, transactions immobilières à Asnières-sur-Seine depuis 2009. »
2. **Trois colonnes** (une en mobile, empilées dans cet ordre ; trois dès 768 px), intertitres Hanken 500 15 en `--grenat-sur-fond` :
   - **Nous trouver** : adresse, téléphone (`tel:`), horaires validés (masqués tant qu'ils sont `[À CONFIRMER]`).
   - **Le site** : Nos biens, Vendre, Louer, Faire estimer, Le cabinet, Contact.
   - **Informations** : Nos honoraires, Mentions légales, Confidentialité, « Avis Google : 4,9 sur 5, 32 avis » (lien vers la fiche Google, même onglet, valeurs de l'API Places, repli `agency.ts`).
3. **Filet crème à 22 %**, puis le bloc **Mentions professionnelles** en pleine largeur, jamais replié, en `legal` 13 px `--grenat-sur-fond` : carte professionnelle CPI 9201 2018 000 024 838 délivrée par la CCI Paris Île-de-France ; garant financier LLOYD'S France ; SAS au capital de 4 000 € ; RCS Nanterre 511 484 586 ; médiateur de la consommation : [nom, adresse, site] `[À FOURNIR]`.
4. **« © 2009-2026 Cabinet Rimbault »**, année de fin calculée.

Aucune icône de réseau social, pas de newsletter `[À CONFIRMER : comptes actifs de l'agent]`. Le médiateur est `null` dans `agency.ts` : rien n'est affiché en développement, et **le build de production échoue** tant qu'il manque (§6). Le pied réduit du tunnel (§3.2) garde mentions légales, confidentialité et carte T.

### 4.3 Fil d'Ariane

Uniquement sur la fiche bien (« Nos biens › Appartement 3 pièces ») : c'est la seule page à deux niveaux. Les autres pages sont à un niveau, un fil d'Ariane y serait décoratif. JSON-LD `BreadcrumbList` sur la fiche.

### 4.4 SEO

- **Metadata** : `metadataBase` = `SITE_URL` (variable d'environnement, domaine `[À CONFIRMER]`), `title.template` « %s | Cabinet Rimbault », titre et description uniques par page (listés ci-dessus), `alternates.canonical` sur chaque page (sans paramètres pour `/estimation` et `/contact`), `openGraph` (locale `fr_FR`, image par défaut [ILL-01] exportée en 1200×630 par Cantona, photo principale pour la fiche), `twitter` non utilisé. `generateMetadata` sur la fiche (`params` est une Promise en Next 16).
- **JSON-LD** (`components/seo/JsonLd.tsx`, injecté côté serveur) :
  - `RealEstateAgent` sur la mise en page racine : nom, adresse postale, téléphone, URL, `foundingDate: "2009"`, `areaServed` (communes `[À CONFIRMER]`), `openingHoursSpecification` (si horaires confirmés), `sameAs` (fiche Google). **Pas d'`aggregateRating`** : Google refuse les avis « auto-déclarés » sur une entreprise locale.
  - Fiche : `RealEstateListing` contenant un `Offer` (prix, `priceCurrency: EUR`, disponibilité) et l'objet (`Apartment` / `SingleFamilyResidence`) avec `floorSize`, `numberOfRooms`, adresse **limitée à la ville et au code postal** ; `BreadcrumbList`.
  - `/vendre`, `/louer` : `FAQPage`.
- **`app/sitemap.ts`** : les 11 pages + toutes les fiches visibles (`lastModified` = `updatedAt` si l'API le fournit, sinon `createdAt`). Revalidé avec la liste des biens.
- **`app/robots.ts`** : tout autorisé en production, lien vers le sitemap. Sur tout environnement autre que la production (`SITE_ENV !== "production"`) : `Disallow: /` et `noindex` global.
- **Icônes** : `app/icon.svg` (monogramme, Cantona/Pirlo), `app/apple-icon.png`.
- Langue `fr`, un seul `h1` par page, hiérarchie de titres continue (testé par Maldini).

---

## 5. Données, cache et rendu (Next 16)

- **Pas de `cacheComponents`** en v1 : on reste sur le modèle `fetch(..., { next: { revalidate, tags } })` déjà en place dans `apiFetch` (Next 16 ne met plus `fetch` en cache par défaut : l'option est donc explicite partout).
- Durées : liste des biens 300 s ; fiche 600 s ; archive 3 600 s ; avis Google 86 400 s. Rappel : chaque lecture réelle d'une fiche incrémente `viewCount` ; l'ISR limite ces lectures (1 par fiche et par période).
- **Tests** : `E2E_NO_CACHE=1` force `revalidate: 0` dans `apiFetch` (réponse à la question de Maldini) ; posé par `playwright.config.ts` sur le `webServer`.
- `/biens/[reference]` : `generateStaticParams` depuis `getProperties()` (fiches pré-rendues au build), `dynamicParams` par défaut (`true`) pour les biens publiés après le build. `params` et `searchParams` sont des Promises.
- Pages lisant `searchParams` (`/estimation`, `/contact`) : la lecture se fait côté client (`useSearchParams` dans un composant client sous `Suspense`) pour garder la page statique.
- `next/image` partout pour les photos (domaine Supabase déjà autorisé), `sizes` précis par gabarit, `priority` uniquement sur la photo principale de la fiche et l'illustration d'ouverture.
- Polices : `next/font` (choix de Pirlo), déclarées dans `src/app/fonts.ts`.
- **Normalisation des données** : une couche `src/lib/property/` transforme `Property` (API) en `PropertyView` (prêt à afficher) : titre composé, lieu normalisé, prix et honoraires, alts, paragraphes. Les composants ne lisent jamais les champs bruts. `types.ts` corrigé : `honorairesType: "acquereur" | "vendeur" | null`, `honoraires: number | null` (avec `-1` traité comme nul), ajout de `dpeImageUrl`, `gesImageUrl`, `isExclusive`, statuts `VENDU`/`LOUE` pour l'archive.

---

## 6. Arborescence de code cible

```
src/
├─ app/
│  ├─ layout.tsx                    # racine : <html lang="fr">, polices, globals.css, JSON-LD agence, metadata de base
│  ├─ fonts.ts                      # Pirlo
│  ├─ globals.css                   # Pirlo (tokens + base)
│  ├─ not-found.tsx                 # 404 globale (inclut SiteHeader/SiteFooter)
│  ├─ global-error.tsx
│  ├─ sitemap.ts · robots.ts
│  ├─ icon.svg · apple-icon.png · opengraph-image.png   # Cantona
│  ├─ (site)/
│  │  ├─ layout.tsx                 # SkipLink + SiteHeader + <main> + SiteFooter
│  │  ├─ template.tsx               # Iniesta : transition d'entrée de page (sobre)
│  │  ├─ error.tsx
│  │  ├─ page.tsx                   # Accueil
│  │  ├─ biens/page.tsx
│  │  ├─ biens/[reference]/page.tsx · not-found.tsx
│  │  ├─ vendre/page.tsx
│  │  ├─ louer/page.tsx
│  │  ├─ le-cabinet/page.tsx
│  │  ├─ honoraires/page.tsx
│  │  ├─ contact/page.tsx · actions.ts          # submitContact (Server Action)
│  │  ├─ mentions-legales/page.tsx
│  │  └─ confidentialite/page.tsx
│  └─ (tunnel)/
│     ├─ layout.tsx                 # TunnelHeader + TunnelFooter
│     └─ estimation/page.tsx · actions.ts       # submitEstimation (Server Action)
├─ components/
│  ├─ ui/            # Pirlo : Button, ButtonLink, TextLink, Container, Section, Grid, Heading, Prose,
│  │                 #   Field, Input, Textarea, Select, ChoiceGroup (radios en cartes), Checkbox,
│  │                 #   FieldError, ErrorSummary, Disclosure, Tag, Divider, VisuallyHidden, Table
│  ├─ brand/         # Cantona (+ Pirlo) : Logotype.tsx, Monogram.tsx
│  ├─ illustrations/ # Cantona : Illustration.tsx + un composant ou un SVG par [ILL-xx]
│  ├─ motion/        # Iniesta : ImageFade.tsx (fondu d'une image au décodage, A25 ; aucun composant d'apparition au défilement), useReducedMotion.ts, StepTransition.tsx, ProgressBar.tsx
│  ├─ layout/        # Lot 1 : SiteHeader, MobileMenu, SiteFooter, ProfessionalInfo, SkipLink,
│  │                 #   Breadcrumb, PageIntro, ProsePage, TunnelHeader, TunnelFooter
│  ├─ property/      # Lot 2 : PropertyCard, PropertyGrid, PropertyEmptyState, SoldArchive,
│  │                 #   PropertyGallery, GalleryViewer, PropertyHeader, PriceBlock, KeyFacts,
│  │                 #   PropertyDescription, EnergyBlock, CoproBlock, PropertyLocation,
│  │                 #   PropertyContact, MobileContactActions (2 boutons sous le prix, non fixes), SimilarProperties
│  ├─ home/          # Lot 3 : Opening, CurrentListings, Services, Commitments (accueil), FindUs
│  ├─ owners/        # Lot 4 : StepsList, FaqList, FeesSummary, TenantRedirect, FeesTable
│  ├─ estimation/    # Lot 5 : EstimationTunnel, StepProperty, StepFeatures, StepYou, StepReview,
│  │                 #   Recap, Confirmation, TunnelProgress
│  ├─ agency/        # Lot 6 : CommitmentsDetailed, ReviewsList, ReviewsSummary, OpeningHours,
│  │                 #   AgencyAddress, SectorMap
│  ├─ forms/         # Lot 6 : ContactForm, ConsentField, Honeypot, FormAlert
│  └─ seo/           # Lot 0 : JsonLd.tsx
├─ content/          # textes longs et données éditoriales (TS typé, pas de MDX)
│  ├─ honoraires.ts  # Lot 4 [À FOURNIR]
│  ├─ faq-vente.ts · faq-location.ts   # Lot 4
│  └─ legal.ts       # Lot 7
├─ lib/
│  ├─ agency.ts      # Lot 0 : + email, secteur, médiateur, directeur de publication, siteUrl
│  ├─ opening.ts     # conservé (Lot 6 en reprend l'usage)
│  ├─ utils.ts       # cn() conservé
│  ├─ api/           # Lot 0 : client.ts (+ apiPost, E2E_NO_CACHE), properties.ts (+ getArchivedProperties),
│  │                 #   types.ts (corrigé), evaluation.ts, contact.ts — tous server-only
│  ├─ property/      # Lot 2 : view.ts (Property → PropertyView), labels.ts, fees.ts, format.ts,
│  │                 #   description.ts, images.ts (alts, tri)
│  ├─ forms/         # Lot 0 : validators.ts, estimation-schema.ts, contact-schema.ts, spam.ts
│  ├─ estimation/    # Lot 5 : payload.ts (état → corps API), storage.ts (sessionStorage)
│  ├─ reviews/google.ts  # conservé
│  └─ seo/           # Lot 0 : metadata.ts (helpers), jsonld.ts (constructeurs)
scripts/check-launch.ts  # Lot 0 : échoue si médiateur, barème, e-mail ou SITE_URL manquent (lancé par `prebuild` en production)
```

**À supprimer** (Lot 0, en premier, après accord de Zidane) :
- `src/app/directions/`, `src/app/exploration/`, `src/app/gout/`, `src/app/header-variantes/`, `src/app/maquettes/`, `src/app/planche/`, `src/app/wireframes/`
- `src/app/page.tsx` (réécrit dans `(site)/`), contenu actuel de `src/app/globals.css` et `src/app/layout.tsx` (réécrits)
- `src/components/directions/`, `src/components/site/` (Action, CardCarousel, EnergyCompact, Gallery, Listing, Motion, OpeningNote, PropertyCard, ReviewCard, SearchRequest, SiteFooter, SiteHeader), `src/components/EnergyScale.tsx` (remplacé par les SVG de l'admin)
- `src/lib/property.ts` (remplacé par `src/lib/property/`)
- `public/maquettes/` : `devanture-provisoire.jpg` déplacé dans `docs/refonte/references/` pour Cantona, les deux autres supprimées
- Le script inline de `layout.tsx` (`style-maquette`, classe `js`) : remplacé si Iniesta en a besoin.

---

## 7. Lots de travail

Propriétaires alignés sur le brief de Zidane §5 (Xavi : lots 0, 1, 3 et 5). Chaque lot possède exclusivement ses fichiers. Un lot ne modifie pas un fichier d'un autre lot : il demande au propriétaire (via Zidane). Les composants partagés entre lots ont une **interface figée ci-dessous** pour permettre le travail en parallèle.

| Lot | Responsable | Possède | Dépend de |
|---|---|---|---|
| **0 · Socle** | Xavi | `src/app/layout.tsx`, `not-found.tsx`, `global-error.tsx`, `sitemap.ts`, `robots.ts`, `(site)/layout.tsx`, `(site)/error.tsx`, `(tunnel)/layout.tsx`, `src/lib/api/*`, `src/lib/agency.ts`, `src/lib/forms/*`, `src/lib/seo/*`, `src/components/seo/*`, `scripts/check-launch.ts`, `next.config.ts` (partagé avec Maldini pour `NEXT_DIST_DIR`), suppressions §6 ; `public/maquettes/devanture-provisoire.jpg` déplacé dans `docs/refonte/references/` | — (premier livré) |
| **P · Design system** | Pirlo | `src/app/globals.css`, `src/app/fonts.ts`, `src/components/ui/*` | Lot 0 (racine) |
| **I · Mouvement** | Iniesta | `src/components/motion/*`, `src/app/(site)/template.tsx` s'il est retenu, bloc `prefers-reduced-motion` de `globals.css` (cédé par Pirlo) | P (tokens de durée/courbe) |
| **C · Illustrations** | Cantona | `src/components/illustrations/*`, `src/components/brand/*`, `public/illustrations/*`, `src/app/icon.svg`, `apple-icon.png`, `opengraph-image.png`, `scripts/illustrations/*` | P (palette), en parallèle |
| **1 · Navigation** | Xavi | `src/components/layout/*` | P, C (Logotype) |
| **2 · Biens** | Pirlo | `(site)/biens/**`, `src/components/property/*`, `src/lib/property/*` | 0, P, 6 (`ContactForm`) |
| **3 · Accueil** | Xavi | `(site)/page.tsx`, `src/components/home/*` | 2 (`PropertyGrid`), 6 (`ReviewsSummary`, `AgencyAddress`), C |
| **4 · Propriétaires** | Bergkamp | `(site)/vendre/*`, `(site)/louer/*`, `(site)/honoraires/*`, `src/components/owners/*`, `src/content/honoraires.ts`, `faq-*.ts` | 0, P, 2 (`SoldArchive`) |
| **5 · Estimation** | Xavi (Iniesta pour `StepTransition` et `ProgressBar`) | `(tunnel)/estimation/*`, `src/components/estimation/*`, `src/lib/estimation/*` | 0 (`lib/forms`, `lib/api/evaluation`), P, I (`StepTransition`, `ProgressBar`) |
| **6 · Cabinet et contact** | Pirlo | `(site)/le-cabinet/*`, `(site)/contact/*`, `src/components/agency/*`, `src/components/forms/*` | 0, P |
| **7 · Légal** | Bergkamp | `(site)/mentions-legales/*`, `(site)/confidentialite/*`, `src/content/legal.ts` | 0, 1 (`ProsePage`) |
| **API · Notification agent** | Maldini (hors vitrine ; ni déploiement, ni commit, ni POST vers la production) | `cabinet-rimbault-api` : `api/public/evaluation/route.ts`, `api/public/contact/route.ts`, `src/lib/emails/evaluation-agent-notification.tsx`, `contact-agent-notification.tsx` | Déployé **avant** la vitrine |
| **T · Tests** | Maldini | `e2e/**`, `playwright.config.ts` | tous |

**Interfaces figées entre lots** (signatures que chaque propriétaire s'engage à respecter) :

```ts
// Lot 2
type PropertyView = { reference: string; href: string; title: string; subtitle: string | null;
  place: string; transaction: "VENTE" | "LOCATION"; statusLabel: string | null; isExclusive: boolean;
  priceLabel: string; feeLines: string[]; facts: { label: string; value: string }[];
  images: { url: string; alt: string }[]; /* … champs de la fiche */ };
function toPropertyView(p: Property): PropertyView;                     // lib/property/view.ts
<PropertyGrid items={PropertyView[]} headingLevel={2 | 3} />            // gère 1, 2, 4, 5+
<SoldArchive items={PropertyView[]} limit?={number} />                  // ne rend rien si vide
// Lot 6
<ContactForm subject?="BIEN_SALE"|"BIEN_RENT"|"OTHER" propertyReference?={string}
  defaultMessage?={string} source={"vitrine/contact"|"vitrine/fiche"} />
<ReviewsSummary data={ReviewsData | null} excerpts={0 | 2 | 5} />       // repli sur agency.google
<AgencyAddress showHours?={boolean} />
// Lot 1
<PageIntro title={string} lead?={ReactNode} aside?={ReactNode} />
<ProsePage title={string} updatedAt={string}>{children}</ProsePage>
// Lot 0
apiPost<T>(path: string, body: unknown): Promise<T>                     // lève ApiError(status, body)
submitEstimation(prev: EstimationResult, form: FormData): Promise<EstimationResult> // Server Action
validateEstimation(state): FieldErrors ; validateContact(state): FieldErrors
// Lot C
<Illustration name={"ILL-01" | … | "ILL-08"} className? priority? />    // décoratif : alt="" + aria-hidden
```

**Ordre de livraison** : 0 → (P, C, I en parallèle) → 1 → (2, 4, 5, 6, 7 en parallèle ; 3 en dernier car il assemble 2 et 6) → API → T en continu. Chaque lot livre avec : pages qui répondent 200 sur le mock (`default`, `empty`, `error`, `edge`), `npm run lint` propre, `tsc` propre, aucune chaîne `null`/`undefined`/`NaN`/`-1 €`, aucun texte factice.

---

## 8. Points ouverts

**Arbitrés par Zidane** (brief §2, intégrés dans ce document)
1. Choix « prix de vente / loyer » dans le tunnel (§3.1) : retenu (A1).
2. 5e entrée « Contact » dans l'en-tête (§4.1) : retenue (A2).
3. Barre d'action fixe sur la fiche mobile (§2.3) : refusée, remplacée par deux boutons pleine largeur sous le prix (A6).
4. Coûts d'énergie manquants : ligne « non communiqué » affichée, jamais masquée (A7).
5. Nommer l'agent sur Le cabinet : non (A9).
6. Mesure d'audience en v1 : aucune (A10).
7. Liens externes dans le même onglet, sans icône (A16).
8. Tunnel : « Envoyer la demande » (A17), pièces en radios (A18), libellés de progression et de l'objet (A23).
9. Bouton « Faire estimer » de l'en-tête en secondaire compact ; principal dans le menu mobile (A19).
10. Pied de page à structure unique, propriété de Xavi, lot 1 (A20, §4.2).
11. Phrase des coûts d'énergie : formulations A7 et A8 uniquement (A24).
12. `Reveal.tsx` renommé `ImageFade.tsx` (A25).
13. ILL-02 sur Vendre, retirée de l'accueil ; ILL-04 non appelée (A27). ILL-06 validée en 10:3 (§2.7).

**À obtenir de l'agent (bloquant mise en ligne en gras)**
- **Médiateur de la consommation**, **barème d'honoraires** (vente, location, date d'effet), **e-mail public sur le domaine**, **domaine du site**.
- Adresse du garant, directeur de la publication, hébergeur retenu, horaires, liste des communes du secteur, zone ALUR, délai de réponse, gratuité de l'estimation et avis de valeur écrit, périmètre exact de la prestation location, gestion locative oui/non, affichage des prix dans l'archive, WhatsApp, comptes sociaux, durée de conservation des données.
- Données à corriger dans l'admin : coûts d'énergie (09.345, 10.131), surface 09.345, orthographe des quartiers et villes.
