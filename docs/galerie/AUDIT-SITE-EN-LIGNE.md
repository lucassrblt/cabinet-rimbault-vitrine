# Audit du site en ligne (`origin/main`) avant la bascule vers la Galerie

*06/11/2026. Audit en lecture seule : aucun fichier du code n'a été modifié, aucun formulaire n'a été envoyé.*

Sources lues :
- `origin/main` (commit `9e4d759` du 01/09/2026), dans un worktree jetable ;
- le site en ligne `https://cabinet-rimbault.fr` avec le cookie `site-preview`, pages récupérées par `curl` ;
- le tunnel `/estimation` parcouru dans un navigateur jusqu'à l'écran des coordonnées, sans envoi ;
- la branche `galerie` (`7a728ff`) et l'API (`cabinet-rimbault-api`, `origin/main` et `feat/notification-agent`).

---

## 0. Conclusions en bref

1. Le site en ligne apporte peu de **nouvelles** informations : l'équipe Galerie avait déjà repris l'adresse, le téléphone, la carte, le garant, la société et les horaires. Ce qu'il apporte en plus : l'e-mail, l'hébergeur, le directeur de la publication, la durée de conservation, l'URL de la fiche Google, un barème (brouillon) et une liste de communes (brouillon).
2. Sur les 11 contrôles de `check:launch` qui échouent, main permet d'en lever **7** (5 bloquants, 2 non bloquants), dont **2 aussitôt** (SITE_URL, hébergeur), plus PUBLIC_API_* qui existent déjà sur Netlify. Il en lève **2 autres sous réserve** (barème, secteur). **Il ne lève pas** le médiateur ni l'adresse du garant.
3. Le **barème de main n'est pas fiable** : il est apparu dans un commit de design en avril, il porte deux dates d'effet contradictoires (2024 et 2026), et la partie location recopie les plafonds légaux au lieu d'un tarif. C'est un brouillon à faire valider. Il ne faut pas le publier tel quel.
4. Plusieurs textes de main se contredisent (avis 32 / 34, transactions 185 / 315, délais de réponse 24 h / 48-72 h, « portefeuille géré » / « aucun mandat de gestion »). La Galerie les a eu raison de ne pas les reprendre.
5. **Le tunnel en ligne a très probablement une panne à l'envoi** : il transmet `surface`, `rooms` et `constructionYear` comme des **nombres**, alors que ces colonnes sont des `String?` dans Prisma. Votre propre document d'architecture le dit : « un nombre ferait échouer Prisma ». Je ne l'ai pas vérifié par un envoi, comme demandé, mais il faut regarder s'il y a des `Evaluation` en base depuis le 20/05.
6. Côté parcours, le tunnel de main est meilleur sur les points qui font **convertir** : il annonce que c'est gratuit et sans engagement, il complète l'adresse automatiquement, il demande l'état du bien, il garde le brouillon, et un choix fait avancer d'un seul clic. Le tunnel Galerie est meilleur sur le **fond** : il dit la vérité (une visite avant tout prix), il est accessible, il gère l'historique et il envoie des chaînes. Je propose un tunnel Galerie en 6 questions qui prend le meilleur des deux.
7. Pour la mise en ligne : porter la porte de maintenance de main dans le `proxy.ts` de la Galerie, avant le contrôle des biens disparus. Faire dépendre `isIndexable()` de `MAINTENANCE_MODE`. Ajouter 6 redirections. Et surtout, **ne pas poser `SITE_ENV=production` tant que la porte est fermée**, sinon `prebuild` (strict) fait échouer le build.
8. Git : une fusion « sans ancêtre commun » qui prend l'arbre de `galerie` en entier, passée par une **PR** (Deploy Preview Netlify), après avoir posé un tag d'archive sur l'ancien main. Pas de force-push.

---

## 1. Inventaire des contenus réutilisables

Légende de la colonne Recommandation : **Reprendre** = valeur sûre à recopier. **Adapter** = la reprendre en changeant le ton ou le format, ou après une confirmation rapide. **À faire valider** = brouillon à soumettre à Xavier Rimbault. **Ignorer** = valeur fausse, contradictoire ou sans source.

Pour juger de la provenance, j'ai regardé l'historique de main. Le commit `695cec6` du 24/05/2026, « données réelles agent », est celui où le propriétaire a saisi ses vraies valeurs : téléphone, e-mail, carte, CCI, garant, horaires. Le reste date des commits de maquette d'avril et mai (`3f209e4`, `24e7e16`, `df87bce`). Le fichier `tasks/task-01-infos-agent.md` dit même que les avis et la bio sont restés « fictifs ».

### 1.1 Coordonnées et présence en ligne

| Élément | main (en ligne) | galerie (`src/lib/agency.ts`) | Recommandation |
|---|---|---|---|
| Adresse | 117 Boulevard Voltaire, 92600 Asnières-sur-Seine | 117 boulevard Voltaire, 92600 Asnières-sur-Seine | Identique. Garder la Galerie. |
| Téléphone | `0173645610`, affiché sans espaces, lien `tel:0173645610` | « 01 73 64 56 10 », `tel:+33173645610` | **Même numéro**, pas d'incohérence. Garder le format Galerie. |
| E-mail | `xrimbault@numericable.fr` (saisi le 24/05, affiché sur toutes les pages et donné comme adresse pour exercer ses droits) | `null` → **bloquant** | **Lève le contrôle** (`check-launch` ne teste que le format). Mais le brief §9 recommande une adresse sur le domaine. À trancher avec le client : soit l'adresse Numericable tout de suite, soit `contact@cabinet-rimbault.fr` redirigée vers elle (le domaine est déjà à lui). |
| Horaires | Lundi sur RDV, mardi au vendredi 9 h-19 h, samedi 9 h-18 h (saisis le 24/05 comme « données réelles ») | Mêmes valeurs, `hoursConfirmed: false` | **Adapter** : ce sont les valeurs du propriétaire. Après un « oui » oral de Xavier, passer `hoursConfirmed: true` (contrôle non bloquant). |
| Transports | Métro 13 Gabriel Péri ; bus 165, 238, 175 ; Parking Voltaire à 100 m | Absent | **À faire valider** avant de le mettre sur `/contact`. `task-01` ne le marque pas comme vérifié, et je doute du bus 175 et du nom du parking. |
| Secteur | 8 communes + « Paris (intra-muros) » (`communes.ts`) : Asnières, Gennevilliers, Colombes, Courbevoie, Bois-Colombes, Clichy, Levallois-Perret, Neuilly-sur-Seine | `sector: null` (non bloquant) | **À faire valider**. La liste vient d'un recentrage fait par l'agent de code, pas du client. Elle se contredit (« 8 communes », puis 9 entrées). Paris et Neuilly s'accordent mal avec « rue par rue ». Proposition à soumettre : Asnières-sur-Seine, Gennevilliers, Colombes, Bois-Colombes, Courbevoie, Clichy, Levallois-Perret (un bien en ligne se trouve à Levallois). |
| Fiche Google | Le lien « Voir tous les avis » renvoie, via l'API Places, à **`https://maps.google.com/?cid=15320125724361112987`** | `profileUrl: null` | **Reprendre** cette URL sans le paramètre `g_mp`. Elle lève le contrôle « fiche Google » (non bloquant) et alimente `sameAs`. |
| Note Google | 4,9 | « 4,9 » en repli, valeur réelle par l'API Places | Cohérent. |
| Nombre d'avis | **34** par l'API (accueil, agence, estimation, et bas de `/contact`), mais **32** écrit en dur en haut de `/contact`, ce qui donne deux chiffres sur la même page | 32 en repli, valeur réelle par l'API | **34 est le bon chiffre** au 06/11/2026. Mettre le repli de `agency.google.count` à 34, ou le laisser : la Galerie affiche la valeur de l'API quand elle répond. |
| Depuis | 2009, « 17 ans » calculé | `since: 2009` | Cohérent. |
| Transactions | 315 dans les chiffres, **185** dans la bio (code mort) | Absent | **Ignorer**. Contradiction déjà signalée dans le brief §9. |
| « 98 % recommandent » | Affiché, sans source | Retiré | **Ignorer.** |
| WhatsApp, Instagram, LinkedIn | `TODO` | `null` | Rien à reprendre. |
| Délai de réponse | « sous 24 h ouvrées » (`/contact`), « 48 à 72 h » (`/louer`), « dans les plus brefs délais » (`/estimation`) | Aucun délai promis | **Ignorer** tant que Xavier ne s'est pas engagé sur un délai (brief §10-9). |

### 1.2 Informations légales

| Élément | main | galerie | Recommandation |
|---|---|---|---|
| Société | SAS au capital de 4 000 €, RCS Nanterre B 511 484 586, SIRET 511 484 586 00025, NAF 68.31Z | SAS, 4 000 €, RCS Nanterre 511 484 586, SIREN | Cohérent. Le SIRET peut être **ajouté** aux mentions légales (facultatif, utile). |
| Carte professionnelle | CPI 9201 2018 000 024 838, CCI Paris Ile-de-France | Identique | Cohérent. |
| Garant | LLOYD'S France, **sans adresse** | Nom ; `guarantorAddress: null` → **bloquant** | **main ne lève pas ce contrôle.** Il faut l'attestation de garantie financière (adresse exacte de l'assureur ou du courtier). |
| « Ne détient aucun fonds… Ne reçoit aucun mandat de gestion » | Dans les mentions légales | Absent | **À faire valider**. C'est une mention utile, mais elle doit s'accorder avec l'existence d'une garantie financière (on souscrit souvent une garantie précisément parce qu'on détient des fonds). Elle contredit aussi `/louer` de main (« portefeuille… géré par le cabinet »). |
| Médiateur | `TODO` (masqué par un texte de repli) | `null` → **bloquant** | **main ne lève pas ce contrôle.** C'est toujours la première demande à faire au client. |
| Directeur de la publication | « Xavier Rimbault » | `null` → **bloquant** | **Reprendre** « Xavier Rimbault » : le président de la SAS est de droit le directeur de la publication. À confirmer d'un mot. |
| Hébergeur | « Netlify, Inc. — 44 Montgomery Street, Suite 300, San Francisco, CA 94104 » | `siteHost: null` → **bloquant** | **Lève le contrôle en corrigeant l'adresse**. Les conditions de Netlify, lues le 06/11/2026, donnent **Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, États-Unis**, `netlify.com`. Les en-têtes `server: Netlify` du site en ligne confirment l'hébergeur. Netlify ne publie pas de numéro de téléphone : la LCEN le demande, alors laisser `phone: null` et le noter. |
| Durée de conservation | « au plus trois ans après le dernier contact » (`/politique-de-confidentialite`) | `dataRetention: null` → **bloquant** | **Reprendre**, sous la forme attendue par la phrase « Vos demandes sont conservées {…}, puis supprimées. », soit `"trois ans après notre dernier échange"`. C'est exactement la proposition du brief §10-15. |
| Finalités, base légale | « exécution précontractuelle et intérêt légitime » | Page Galerie plus complète | Garder la Galerie. |
| Cookies | Page `/cookies` : « uniquement des cookies strictement nécessaires » | Section `#cookies` de `/confidentialite` | Garder la Galerie et rediriger `/cookies` (voir §3.1). Attention : le cookie `site-preview` de la porte de maintenance est un cookie technique à citer pendant la préproduction. |

### 1.3 Barème d'honoraires : un brouillon, pas une valeur

| | main | Constat |
|---|---|---|
| Vente | ≤ 100 000 € : forfait 5 000 € TTC ; 100 à 300 k€ : 5 % ; 300 à 500 k€ : 4 % ; 500 k€ à 1 M€ : 3 % ; > 1 M€ : 2 %. « Charge acquéreur, sauf stipulation contraire au mandat ». « Peut être ajusté » en exclusivité. | Arrivé dans le commit `24e7e16` (« refonte page agence + design system », 29/04) et **jamais modifié depuis**. Les tranches ne se recoupent pas aux bornes. |
| Location | 10 / 12 / 8 €/m² selon la zone, état des lieux 3 €/m², bailleur « un mois de loyer HC » | Ce sont **les plafonds légaux** (décret 2014-890) pour les trois zones, pas un barème : le cabinet n'applique qu'une seule zone. Asnières-sur-Seine est vraisemblablement en **zone très tendue** (zone A bis), donc 12 €/m² + 3 €/m², à vérifier sur le simulateur officiel. |
| Date d'effet | « 1ᵉʳ janvier 2026 » sur `/honoraires`, mais « 1ᵉʳ janvier 2024 » et « TVA : taux en vigueur en 2024 » sur `/agence` | **Contradiction sur le site en ligne.** |

**Recommandation : à faire valider.** Envoyer à Xavier le tableau de main pré-rempli, avec trois questions : est-ce bien votre barème, à quelle date, et qui paie (vendeur ou acquéreur). S'il le confirme, il se recopie directement dans `feeSchedule` : `sale.rows` sans changement ; `rental.rows` sur une seule ligne de zone, avec la part du locataire et celle du bailleur ; `payer` ; `effectiveDate`. C'est seulement à ce moment-là que le contrôle tombe.

### 1.4 Textes rédigés

| Texte de main | Où | Recommandation |
|---|---|---|
| « Trouver chez nous, votre futur chez vous. » | Accroche de l'accueil (commit `1303763`, « copy: hero », écrite par le propriétaire) | **À montrer au client** : c'est sa phrase. Elle ne colle pas au ton Galerie, mais il peut y tenir. |
| « Nos engagements » de l'accueil (4 pavés : depuis 2009, sur-mesure, ancrage local, service global) | Accueil | **Ignorer** : les `commitments` de la Galerie disent la même chose, mieux et de façon vérifiable. |
| « L'immobilier à taille humaine. Un seul interlocuteur, de l'estimation à la signature. » ; « accompagne vendeurs, acquéreurs, bailleurs et locataires » ; « chaque projet est unique » | `/agence` | **Adapter** : la première phrase rejoint le 2ᵉ engagement de la Galerie. Elle peut servir de phrase serif sur `/le-cabinet` si le client y tient. |
| Bio de Xavier en 5 paragraphes, 6 engagements (`AGENT_BIO_PARAGRAPHS`, `AGENT_ENGAGEMENTS`) | Code mort (n'apparaît sur aucune page en ligne) | **Ignorer** : texte d'agent de code, avec « 185 transactions » et « grandes enseignes » sans source. |
| FAQ Vendre (`SELLING_FAQ`) : estimation gratuite ; mandat exclusif ; durée d'une vente (2 à 8 semaines de commercialisation + 3 mois de compromis à l'acte) ; meilleure saison ; diagnostics ; documents | Page `/vendre`, **masquée** (redirigée) | **À faire valider**. Elle répond exactement aux 3 questions que la Galerie a retirées faute de réponse (brief §10-9 et §10-12) : « Combien coûte une estimation ? », « Combien de temps prend une vente ? », « Faut-il un mandat exclusif ? ». Proposer ces 3 réponses à Xavier. Les documents et diagnostics de la Galerie sont plus justes : garder ceux de la Galerie. |
| Déroulé de vente en 4 étapes avec délais (`SELLING_STEPS`) | `/vendre` masquée | **Ignorer** les délais (sans source). Le déroulé en 6 cartels de la Galerie est meilleur. |
| FAQ de `/contact` : « Vous déplacez-vous pour une estimation ? Oui, gratuitement… communes limitrophes (Gennevilliers, Colombes, Courbevoie, Bois-Colombes…) » ; « Que préparer pour un premier échange ? » | `/contact` | **Adapter** après validation : c'est la meilleure source pour le secteur et pour « gratuit ». La réponse sur la préparation est bonne et peut aller dans la FAQ Vendre. |
| « Gratuit · Sans engagement · Réponse rapide » ; « Une estimation humaine, en trois temps » ; « Pas un algorithme : un professionnel local » | `/estimation` | **Adapter** (voir §2) : « gratuit et sans engagement » si Xavier le confirme ; « Pas un algorithme » est un bon argument et il est fidèle à la Galerie. |
| Page `/louer` (« portefeuille géré par le cabinet », « réponse sous 48 à 72 h », « biens vérifiés ») | `/louer` | **Ignorer** : promesses contradictoires, et la page est vide (« Aucun bien ne correspond »). |
| Page `/cookies` | `/cookies` | **Ignorer** : déjà couverte par `/confidentialite#cookies`. |

### 1.5 Ce que main permet de lever dans `check:launch --strict`

| Contrôle | Bloquant | Levé par main ? | Valeur à poser |
|---|---|---|---|
| Médiateur de la consommation | oui | **non** | à demander |
| E-mail public | oui | **oui** (à arbitrer : adresse du fournisseur d'accès ou adresse sur le domaine) | `xrimbault@numericable.fr` ou `contact@cabinet-rimbault.fr` |
| SITE_URL | oui | **oui** | `SITE_URL=https://cabinet-rimbault.fr` (variable Netlify ; main utilisait `NEXT_PUBLIC_SITE_URL`) |
| PUBLIC_API_URL / KEY | oui | **oui**, elles existent déjà dans Netlify pour main | inchangées |
| Barème d'honoraires | oui | **sous réserve** (brouillon à faire valider) | §1.3 |
| Marqueurs `[À FOURNIR]` dans `src/content` | oui | suit le barème | retirer le marqueur une fois le barème saisi |
| Directeur de la publication | oui | **oui** | `"Xavier Rimbault"` |
| Adresse du garant | oui | **non** | attestation de garantie |
| Hébergeur | oui | **oui** (adresse corrigée) | `{ name: "Netlify, Inc.", address: "101 2nd Street, San Francisco, CA 94105, États-Unis", phone: null, url: "netlify.com" }` |
| Durée de conservation | oui | **oui** | `"trois ans après notre dernier échange"` |
| Horaires | non | **oui** après confirmation orale | `hoursConfirmed: true` |
| Secteur | non | **sous réserve** | liste du §1.1 |
| Fiche Google | non | **oui** | `https://maps.google.com/?cid=15320125724361112987` |

**Reste à obtenir du client après cet audit : médiateur, adresse du garant, barème confirmé.** Ensuite, à valider d'un mot : e-mail, directeur de la publication, horaires, secteur, « estimation gratuite et sans engagement ».

---

## 2. Le tunnel d'estimation

### 2.1 Le tunnel de main (`/estimation`), écran par écran

Page : un bandeau (« Estimation gratuite ») avec le titre « Estimez votre bien en quelques minutes. », une pastille Google « 4,9 · 34 avis · Depuis 2009 à Asnières-sur-Seine », les mentions « Gratuit · Sans engagement · Réponse rapide », puis une grande photo d'ambiance. La carte du tunnel chevauche le bas de la photo. Sous la carte : « Comment ça se passe — Une estimation humaine, en trois temps ». La barre mobile du bas propose « Appeler » et « Estimer ».

Une barre de progression indique la phase (« Votre bien » ou « Votre projet ») et « n / 6 ». Les étapes s'enchaînent par une glissade (framer-motion, 320 ms).

| # | Écran | Champs et aides | Validation |
|---|---|---|---|
| 1 | « Quel type de bien souhaitez-vous estimer ? » + « Cela orientera l'analyse comparable du marché. » | 4 cartes avec icône : Appartement (« Du studio au T5 et plus »), Maison, Terrain, Autre (« Loft, local, immeuble ») | **Un clic suffit pour passer à la suite** |
| 2 | « Où se situe votre bien ? » + « Le cabinet s'appuie sur les transactions récentes de la même rue… L'adresse exacte reste confidentielle. » | Adresse avec saisie automatique (`api-adresse.data.gouv.fr`, 6 suggestions), adresse retenue affichée dans un cadre, source citée | Une suggestion doit être choisie (code postal obligatoire) |
| 3 | « Surface et pièces » + « La surface et le nombre de pièces sont les principaux facteurs de prix. » | Surface (m²), compteur de pièces (−/+ jusqu'à 8+), étage (RDC, 1ᵉʳ, 2ᵉ, 3ᵉ, 4ᵉ+, appartement seulement), année de construction (facultative) | Surface > 0 et pièces requises |
| 4 | « État général et extérieur » | 4 cartes d'état (Neuf ou refait / Bon état / À rafraîchir / À rénover, chacune avec une ligne d'aide) + pastilles facultatives : balcon, terrasse, jardin, cour, garage, parking, cave, piscine, aucun | État requis |
| 5 | « Quel est votre projet ? » + « Aucun engagement à cette étape. » | Je veux vendre / Je veux louer / Je me renseigne | Requis ; **ici, le clic ne fait pas avancer** (contrairement à l'étape 1) |
| 6 | « Où vous joindre ? » + « Le Cabinet Rimbault revient vers vous avec une première estimation de votre bien. » | Prénom*, Nom*, Téléphone*, E-mail*, « Un mot à ajouter ? (facultatif) » (« Travaux récents, copropriété, particularités… »), case RGPD*, piège anti-robot (`website`) | Format FR du téléphone ; bouton grisé tant qu'il manque un champ obligatoire |
| Fin | « Demande envoyée. Merci {prénom}. À très vite. » + « …revient vers vous avec une première estimation. » | Liens « Voir les biens à vendre », « Joindre le cabinet au… » et **référence de la demande** | — |

Le brouillon est gardé dans `sessionStorage` (`cr-estimation-draft-v1`), avec l'étape en cours. J'ai vérifié qu'après un rechargement, la page revient bien à l'étape 6 avec les réponses. J'ai effacé le brouillon après le test.

**Envoi** : la Server Action `submitEvaluation` valide avec zod, puis envoie `POST {PUBLIC_API_URL}/evaluation` avec l'en-tête `X-API-Key` et ce corps : `propertyType` (APPARTEMENT, MAISON, TERRAIN ou AUTRE), `postalCode`, `address` (la rue seule), `surface` (**nombre**), `rooms` (**nombre**), `constructionYear` (**nombre**), `hasBalcony`, `hasTerrace`, `hasGarden`, `hasGarage`, `hasParking`, `hasPool`, `condition` (NEUF, BON_ETAT, A_RAFRAICHIR ou A_RENOVER), `intent` (SELL, RENT_OUT ou EXPLORATION), `message`, `rgpd`, nom, prénom, e-mail, téléphone, `source: "vitrine"`, `userAgent`, `referer`.

**Défauts relevés**

- **Panne probable à l'envoi.** `surface`, `rooms` et `constructionYear` partent comme des nombres. Les colonnes `Evaluation` sont des `String?` depuis la création de l'API (`a7a72fd`, 20/05), et la route déployée les passe telles quelles à `prisma.evaluation.create`. Prisma refuse un `Int` sur une colonne `String`, donc l'API répond 500 et l'internaute voit une erreur. `docs/refonte/04-architecture-xavi.md` le note déjà. **À vérifier dans l'admin** : y a-t-il des demandes d'estimation venues de la vitrine depuis mai ?
- **Données perdues** : l'étage est demandé mais pas envoyé ; « cave » et « cour » sont cochées mais pas envoyées ; Terrain et Autre ne sont acceptés que par l'ancienne API.
- **Le numéro de rue disparaît** : avec la saisie « 12 rue de la Station Asni… », la seule suggestion proposée est « Rue de la Station 92600 », sans numéro, et c'est elle qui est retenue.
- **Mobile** : quand on passe à l'étape suivante, la page ne remonte pas en haut de la carte. On reste en bas, sur le bouton, et le titre de la question est hors de l'écran (vu aux étapes 4 et 5). La glissade laisse aussi voir, quelques centaines de millisecondes, la question précédente coupée et à demi transparente.
- Le premier écran mobile ne montre **aucune question** : tout l'écran est pris par le titre, les pastilles et la photo.
- La promesse de fin, « une première estimation », est un rappel avec une fourchette de prix. Cela contredit la position de la Galerie : pas de prix sans visite.

### 2.2 Le tunnel Galerie (`/vendre/estimation`, `Tunnel.tsx`)

Cinq questions, une par écran, avec un cartel « Votre bien » à gauche qui se remplit au fil des réponses :
1. Quel bien souhaitez-vous vendre ? (Appartement / Maison, boutons radio)
2. Où se trouve-t-il ? (adresse facultative, code postal obligatoire, commune facultative ; **sans saisie automatique**)
3. Surface et nombre de pièces (pastilles 1, 2, 3, 4, 5 ou plus)
4. Quand pensez-vous vendre ? (5 échéances ; **envoyée dans `message`**)
5. Comment vous recontacter ? (prénom, nom, e-mail, **téléphone facultatif**, RGPD avec un texte clair, piège anti-robot)

Fin : « Votre demande est bien arrivée. » + trois étapes (on vous rappelle, on visite, on estime et on explique sur quoi repose le prix).

Points forts : l'historique du navigateur suit les questions (`?question=n`), le focus va au titre à chaque question, le double clic est bloqué, les erreurs sont accessibles, les nombres partent en chaînes et le `intent` est juste (`ESTIMATION_VENTE`). Le discours est honnête et cohérent avec la page Vendre.

Manques : pas de saisie automatique de l'adresse (pourtant `src/lib/estimation/address.ts`, branché sur la Géoplateforme, existe et n'est plus utilisé) ; pas de question sur l'état ni sur l'étage ; pas de message libre ; pas de brouillon (`storage.ts` et `ESTIMATION_DRAFT` existent mais ne servent plus) ; l'échéance n'utilise pas la colonne `timeframe` ni `situation` ; rien n'est dit sur « gratuit et sans engagement ».

### 2.3 Mon avis

**Pour convertir un vendeur, main fait mieux sur trois points.**
1. Il **lève l'objection du prix et de l'engagement** dès l'arrivée (« gratuit, sans engagement ») et la répète au moment du projet. C'est le premier frein d'un vendeur qui hésite.
2. Il **demande peu d'efforts** : un clic par choix, l'adresse complétée toute seule, un brouillon qui survit à un rechargement.
3. Il **donne du sens à chaque question** avec une phrase d'aide (« L'adresse exacte reste confidentielle », « principaux facteurs de prix »), et il pose la question de l'**état** du bien, qui intéresse l'agent et ne coûte rien à l'internaute.

**La Galerie fait mieux sur tout le reste** : la vérité de la promesse (on visite d'abord), la sobriété (une question, pas de photo d'ambiance qui pousse le formulaire sous la ligne de flottaison), l'accessibilité, la robustesse (historique, double clic, types) et le cartel qui montre au vendeur que son bien prend forme. Le téléphone facultatif est un bon choix de conversion, à condition d'expliquer pourquoi le donner.

À **ne pas** reprendre de main : la question « Je veux louer / Je me renseigne » (le tunnel est sous Vendre), Terrain et Autre (que l'API Galerie n'accepte pas : orienter vers le contact), la grande photo, la glissade, les 9 pastilles d'extérieurs, et la promesse « une première estimation » par rappel.

### 2.4 Proposition : le tunnel Galerie en 6 questions

Même gabarit qu'aujourd'hui : colonne étroite, titre de question en serif, cartel « Votre bien » qui se remplit, traits de progression, « Question n sur 6 », vide généreux, aucune image. Les micro-textes sont des propositions : ceux qui affirment « gratuit » ou un délai attendent la validation de Xavier (règle « rien d'inventé »).

**En-tête de page (une fois, au-dessus de la question 1)**
- h1 : « Faire estimer votre bien »
- Ligne sous le titre, en petits caractères : « Six questions, deux minutes. Nous vous rappelons pour convenir d'une visite : un prix sérieux demande de voir le bien. » Ajouter « Gratuit et sans engagement. » **si** Xavier le confirme (brief §10-9).

| Q | Question (h2) | Réponses | Aide sous la question | API |
|---|---|---|---|---|
| 1 | Quel bien souhaitez-vous vendre ? | Appartement · Maison (radios, **un clic à la souris fait avancer** ; les flèches du clavier ne font que changer le choix) | Lien discret : « Un terrain, un local, un immeuble ? Appelez-nous au 01 73 64 56 10. » | `propertyType` |
| 2 | Où se trouve-t-il ? | **Un seul champ d'adresse avec saisie automatique** (`lib/estimation/address.ts`, Géoplateforme, centrée sur Asnières). On garde le numéro de rue. Lien « Saisir l'adresse à la main » qui ouvre code postal et commune (le code postal reste obligatoire). | « Pour la comparer aux ventes récentes de votre rue. Elle n'est ni publiée, ni transmise. » Si le code postal sort de `agency.sector` : « Ce secteur est un peu loin de nous ; nous vous le dirons franchement. » | `address`, `postalCode` |
| 3 | Quelle est sa surface, et combien a-t-il de pièces ? | Surface (m²) + pastilles 1 à 5 ou plus. Pour un appartement seulement : l'étage en pastilles facultatives, sur le même écran | « La surface habitable, même approximative. » | `surface` et `rooms` en chaînes ; étage dans le bloc `[Précisions]` de `message` (déjà prévu par `payload.ts`) |
| 4 | Dans quel état est-il ? | Neuf ou récent · Bon état · À rafraîchir (« peinture, sols ») · À rénover (repris des `CONDITION_LABELS` existants, 4 choix ; un clic fait avancer) | « Votre impression suffit : nous le verrons ensemble. » | `condition` (enum déjà validée par l'API) |
| 5 | Quand pensez-vous vendre ? | Les 5 échéances actuelles ; « Je ne sais pas encore » reste un choix | « Aucun engagement à cette étape. » (repris de main) | **`timeframe`** (colonne existante, déployée) au lieu de `message` ; `situation: "vente"`, ou `"renseignement"` pour « je ne sais pas encore » |
| 6 | Comment vous recontacter ? | Prénom, nom, e-mail, téléphone (facultatif), préférence « par téléphone / par e-mail » (le champ `contactPreference` existe déjà), **« Un mot à ajouter ? » facultatif** (« Travaux récents, copropriété, particularités… », repris de main), case RGPD au texte actuel | Sous le téléphone : « Le plus simple pour convenir d'une visite. » | `firstName`, `lastName`, `email`, `phone`, `message` (bloc `[Message]`), `rgpd: true` |

**Fin** : garder l'écran actuel (« Votre demande est bien arrivée », les trois étapes, l'e-mail de confirmation). Ajouter la phrase de repli de main, « Une question d'ici là ? Appelez-nous au 01 73 64 56 10. », déjà prévue dans le journal du lot 5.

**Comportements à reprendre de main** : le brouillon dans `sessionStorage` (`storage.ts`, 24 h, déjà déclaré dans `legal.ts`), et un clic qui fait avancer sur les questions à choix (1 et 4). **À garder de la Galerie** : l'historique, le focus sur le titre, le blocage du double clic, la validation par champ, le piège et l'horodatage anti-spam. **À ajouter** : sur mobile, remonter en haut de la colonne à chaque question (`scrollIntoView` du h2, sans animation si `prefers-reduced-motion`).

**Contrat avec `POST /evaluation` à respecter** : les champs requis sont `propertyType`, `postalCode` (5 chiffres), `firstName`, `lastName` (80 caractères au plus) et `email`, plus `rgpd: true` (sinon 422). `surface`, `rooms` et `constructionYear` doivent partir **en chaînes**. `condition` doit appartenir à l'enum `PropertyCondition`. `timeframe`, `intent` et `situation` sont libres. `source: "vitrine/estimation"`. Si l'on remet le brouillon et la saisie automatique, il faut **mettre à jour `/confidentialite`** : appel à l'IGN depuis le navigateur, et stockage local de 24 h.

---

## 3. Plan de mise à jour du site en ligne

### 3.1 Redirections (anciennes adresses vers les nouvelles)

Le site n'a jamais été public (porte de maintenance, `robots.txt` en `Disallow: /`, sitemap vide) : il n'y a aucun référencement à protéger. On redirige seulement pour les liens déjà partagés.

| Ancienne URL (main) | Nouvelle URL (galerie) | Déjà dans `next.config.ts` ? | Type conseillé |
|---|---|---|---|
| `/acheter` (et `?commune=…`) | `/biens` | **non** | permanente |
| `/louer` | `/biens` (la salle liste aussi les locations) plutôt que `/contact` | oui, vers `/contact` | **à changer** vers `/biens`, permanente |
| `/bien/:reference` | `/biens/:reference` | **non** | permanente (le proxy rend ensuite le 404 « bien disparu » si besoin) |
| `/agence` | `/le-cabinet` | **non** | permanente |
| `/estimation` | `/vendre/estimation` | oui (temporaire) | passer en permanente à la mise en ligne |
| `/vendre` | `/vendre` (existe désormais) | sans objet : la redirection vers `/estimation` disparaît avec l'ancien `next.config.ts` | — |
| `/politique-de-confidentialite` | `/confidentialite` | **non** | permanente |
| `/cookies` | `/confidentialite#cookies` | **non** | permanente |
| `/contact`, `/honoraires`, `/mentions-legales`, `/` | inchangées | — | — |
| `/galerie`, `/galerie/:path+` | `/`, `/:path+` | oui | à garder |

### 3.2 Porter la porte de maintenance dans le `proxy.ts` de la Galerie

Next 16 n'autorise **qu'un seul** `proxy.ts`, avec un `matcher` statique. Il faut donc fusionner les deux logiques :

1. **Matcher** : reprendre celui de main, qui couvre tout sauf `_next/`, `api/`, `maintenance`, `favicon.ico`, `robots.txt`, `sitemap.xml` et les fichiers statiques (`png`, `jpg`, `svg`, `webp`, `woff2`, `css`, `js`). Il couvre `/biens/:reference` et `/biens-introuvable`. Les images de `public/variantes/…`, `opengraph-image.png` et `icon.svg` restent exclues par leur extension.
2. **Ordre dans `proxy()`** :
   - a. Porte : si `MAINTENANCE_MODE === "on"` :
     - `?preview=<token>` → redirection sans le paramètre + cookie `site-preview` (httpOnly, secure, sameSite lax, 30 jours) ;
     - cookie valide → on continue ;
     - sinon → `rewrite('/maintenance')`, **pour toutes les méthodes**, POST compris : une Server Action sans cookie ne doit pas atteindre l'API.
   - b. Ensuite seulement, si le chemin est `/biens-introuvable` ou `/biens/…`, la logique actuelle (GET ou HEAD, liste mémorisée, réécriture 404). Sinon, `NextResponse.next()`.
3. **Page `/maintenance`** à créer **hors** du groupe `(galerie)`, pour ne pas hériter de la navigation : un mur crème, « Cabinet Rimbault », une phrase serif (« Le nouveau site ouvre bientôt. »), l'adresse et le téléphone, et `robots: noindex`.
4. **Indexation** : aujourd'hui `isIndexable()` vaut `SITE_ENV === "production"`. Il faut ajouter `&& process.env.MAINTENANCE_MODE !== "on"`. Ainsi `robots.ts`, le sitemap et les balises `robots` de chaque page restent fermés tant que la porte est posée, comme sur main (où `robots.ts` et `sitemap.ts` testent `MAINTENANCE_MODE`).
5. **Jeton** : `lucas` est court et devinable. Avant la bascule, poser un `MAINTENANCE_BYPASS_TOKEN` long (`openssl rand -hex 24`). Changer le jeton invalide tous les cookies déjà posés.
6. Test local : le cookie `secure` n'est pas posé en `http://localhost`. Pour tester, utiliser `next start` derrière HTTPS ou un Deploy Preview.

Esquisse du résultat (pas appliquée) :

```ts
export const config = {
  matcher: ["/((?!_next/|api/|maintenance|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2?|css|js)$).*)"],
};

export async function proxy(request: NextRequest) {
  const porte = porteMaintenance(request);       // code de main, inchangé
  if (porte) return porte;                        // redirection, cookie ou rewrite /maintenance
  const { pathname } = request.nextUrl;
  if (pathname === "/biens-introuvable" || pathname.startsWith("/biens/")) {
    return controleBienDisparu(request);          // code actuel de la Galerie
  }
  return NextResponse.next();
}
```

### 3.3 Variables d'environnement Netlify

| Variable | Production pendant la porte | Production à l'ouverture | Deploy Previews | Remarque |
|---|---|---|---|---|
| `PUBLIC_API_URL`, `PUBLIC_API_KEY` | déjà posées | idem | API de préproduction | inchangées |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | déjà posées | idem | idem | la Galerie les lit aussi |
| `SITE_URL` | `https://cabinet-rimbault.fr` | idem | URL du preview ou vide | **nouvelle** (main lisait `NEXT_PUBLIC_SITE_URL`, à supprimer) |
| `SITE_ENV` | **absente** | `production` | absente | **déclenche `prebuild` en strict**, qui fait échouer le build tant qu'il manque une information bloquante. La poser en même temps qu'on ouvre la porte, pas avant. |
| `MAINTENANCE_MODE` | `on` | absente | absente | — |
| `MAINTENANCE_BYPASS_TOKEN` | jeton long | inutile | — | secret |
| `NODE_VERSION` | `22` (≥ 22.18) ou `24` | idem | idem | **`check-launch.ts` est lancé par `node` sans compilation**, ce qui demande Node ≥ 22.18 (ou 23.6). Il n'y a ni `.nvmrc` ni `engines`. Si le site Netlify est resté sur Node 20 (documenté pour main), `prebuild` échouera. |
| `AGENCY_NOTIFICATION_EMAIL` | — | — | — | se pose côté **API** (Railway), pas sur la vitrine |

### 3.4 Faire arriver `galerie` sur `main`

Les deux branches n'ont **aucun ancêtre commun** (`git merge-base` ne renvoie rien) et 346 fichiers diffèrent.

| Option | Pour | Contre |
|---|---|---|
| A. `git push --force origin galerie:main` | Simple | Réécrit `main` sur GitHub, pas de PR, donc **pas de Deploy Preview**. Netlify publie aussitôt. L'ancien historique n'est gardé que si l'on pense au tag. |
| **B. Fusion « sans ancêtre commun » qui prend l'arbre de `galerie`, via une PR** | Pas de force-push, les deux historiques sont gardés, **Deploy Preview Netlify** avant toute mise en production, retour arrière par simple revert | Le diff de la PR est énorme, mais il n'y a rien à relire ligne à ligne : c'est le remplacement complet. |
| C. Changer la branche de production dans Netlify (vers `galerie`) | Aucune manipulation git, retour arrière en un clic | `main` devient trompeur ; il faudra quand même faire A ou B plus tard. |
| D. Rebase ou cherry-pick des 31 commits de la Galerie sur main | — | Conflits partout, puisque les arbres sont sans rapport. **À exclure.** |

**Recommandation : B.** Étapes, à ne lancer qu'une fois la porte portée (§3.2) et commitée sur `galerie` :

1. `git tag site-v1-final origin/main && git push origin site-v1-final` (archive de l'ancien site).
2. Pousser `galerie`, puis créer la branche de bascule :
   ```
   git switch -c bascule-galerie origin/main
   git merge --allow-unrelated-histories -s ours --no-commit galerie
   git read-tree -u --reset galerie
   git commit -m "Bascule du site sur la Galerie"
   git diff galerie HEAD   # doit être vide
   ```
   (Équivalent en une ligne : `git commit-tree galerie^{tree} -p origin/main -p galerie`.)
3. Ouvrir la PR `bascule-galerie` → `main`, puis contrôler le **Deploy Preview** : pages, fiches, 404 « bien disparu », redirections du §3.1, tunnel jusqu'à l'envoi vers l'API de préproduction, `robots.txt` fermé.
4. Avant la fusion, poser les variables de **Production** de la colonne « pendant la porte » (§3.3). Au besoin, activer « Stop auto publishing » dans Netlify : la mise en production se vérifie alors sur l'adresse du déploiement, puis on clique « Publish ».
5. Fusionner. Vérifier `https://cabinet-rimbault.fr` sans cookie (page de maintenance), puis avec `?preview=<nouveau jeton>`.
6. Ouverture, une fois médiateur, garant et barème fournis : `npm run check:launch -- --strict` au vert en local, puis dans Netlify `SITE_ENV=production`, suppression de `MAINTENANCE_MODE`, et redéploiement. Le build strict sert de garde-fou.
7. Retour arrière possible à tout moment : « Publish deploy » d'un déploiement précédent dans Netlify, ou revert du commit de fusion.

À faire **avant** l'ouverture au public, côté API : la notification à l'agent (branche `feat/notification-agent`, pas encore sur `main`) et `AGENCY_NOTIFICATION_EMAIL`. Sinon les demandes arrivent en base sans que Xavier soit prévenu.
