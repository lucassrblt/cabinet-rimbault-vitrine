# 01 — Recherche (Bergkamp)

> Étude des sites vitrine d'agences au profil comparable à celui du Cabinet Rimbault, plus quelques références hors immobilier.
> Date : 30/10/2026. Toutes les observations ci-dessous viennent de **visites réelles** faites le jour même :
> contenu lu par WebFetch, HTML et CSS récupérés (couleurs et polices extraites des feuilles de style), et
> **captures Playwright** desktop 1440×900, mobile 390×844 et page complète. Rien n'a été écrit de mémoire.
> Les captures sont dans le scratchpad de session et ne sont pas versionnées. Elles sont faciles à refaire avec le script décrit en annexe.

> **Écarts tranchés par le brief (doc 00) : à lire avant toute recommandation ci-dessous**
>
> Ce document est une étude. En cas d'écart, **le brief de Zidane fait foi**. Les points suivants sont dépassés et ne doivent pas être implémentés tels qu'écrits plus bas :
>
> | Passage du doc 01 | Ce qui était recommandé | Ce qui s'applique | Référence |
> |---|---|---|---|
> | §5, reco 2 | Archive en version atténuée : photo désaturée, mention « Vendu en 2026 » | Photo **sans aucun traitement** (ni filtre, ni voile, ni désaturation), plus petite, avec le badge « Vendu » ou « Loué » **sans année**. Sans prix, non cliquable | A14, A22 |
> | §5, reco 13 | En-tête à 4 entrées au plus | **5 entrées** : Nos biens, Vendre, Louer, Le cabinet, Contact | A2 |
> | §5, reco 14 | Fondu court des sections à l'apparition | **Interdit** : aucune apparition au défilement pour les sections et les textes. Seule une image apparaît en fondu quand elle est décodée | Brief §7 |
> | §3 (bandeau cookies) et §5, reco 12 | Mesure d'audience exemptée de consentement | **Aucune mesure d'audience en v1**, donc toujours aucun bandeau cookies | A10 |
> | §4, étape 4 du tunnel | Bouton « Envoyer ma demande » | Libellé unique : « Envoyer la demande » | A17 |
> | §5, reco 4 et §3 (couleur d'accent) | Grenat sur 1 ou 2 mots par page, « quelques mots » | **Jamais de mot en grenat dans un titre** (ni en italique, ni en gras). Le grenat reste au logotype, à une seule action par écran et au pied | Brief §3 et §6.2 |
> | §5, reco 3 | Deux accès dans l'ouverture, « Faire estimer » en grenat dans l'en-tête (reco 13) | Le **seul bouton grenat d'un écran appartient au contenu de la page**. Le « Faire estimer » de l'en-tête devient un bouton secondaire compact (contour encre). Dans le menu mobile ouvert, il redevient principal | A19 |
>
> Les mentions d'italique d'emphase dans les titres (§2 point 5, reco 6, corpus Building Partners et Junot) décrivent ce que font les autres sites : le brief réserve l'italique aux citations d'avis.
>
> **Reste dû par Bergkamp avant la revue n° 3** : relecture de tous les textes visibles du site (ton « nous », typographie française, interdits du brief §6.2).

---

## 0. En une phrase

Les sites d'agences indépendantes françaises se ressemblent presque tous. Ils sont produits par 3 ou 4 éditeurs (Modelo, Netty, Billie.immo, Jalis) et suivent le même schéma : photo de la tour Eiffel, moteur de recherche à 5 filtres, bandeau cookies qui couvre la moitié de l'écran, tuiles « Acheter / Vendre / Louer », gros textes SEO.
**Pour se démarquer, le Cabinet Rimbault n'a pas besoin d'effets. Il lui suffit de faire l'inverse sur chaque point**, en s'inspirant de la retenue des références éditoriales (Inigo, Krug, Building Partners pour le grenat et le crème).

---

## 1. Corpus étudié (23 sites visités)

### 1a. Agences au profil proche (indépendantes, une agence ou un petit groupe, Île-de-France et autres villes)

| # | Site | Profil | Ce qui fonctionne | Ce qui ne fonctionne pas | À retenir pour nous |
|---|---|---|---|---|---|
| 1 | [crefimo.fr](https://www.crefimo.fr) | Asnières, Bois-Colombes, Courbevoie. Indépendante « depuis 1990 », **concurrent direct** | Parle en « nous ». Ancrage local (histoire de l'agence, vitrine digitale inaugurée par la mairie). Badges de statut (Vendu, Sous compromis) | Fond noir et jaune #feec01, titre serif Volkhov en capitales, photos noir et blanc floutées. Moteur avec rayon de 0 à 30 km et **dessin de zone sur carte** alors qu'il n'y a qu'une poignée de biens. Liens « Mon compte », « Recherches sauvegardées », icônes sociales, vidéos, actualités. Chiffres non libellés sur les cartes. Pas de carte T, de garant ni de médiateur visibles | L'ancienneté (« depuis 1990 ») est le premier argument du concurrent local. Notre « depuis 2009 » doit être aussi visible, mais **sobre**. Montre tout ce qu'un moteur de recherche coûte en bruit pour 10 biens |
| 2 | [entrenouslimmobilier.fr](https://www.entrenouslimmobilier.fr) | Asnières, rue Louis Vuitton. 2 associées, depuis 2018. **Concurrent direct** | Ton chaleureux en « nous ». Aucune photo d'équipe : la confiance passe par le texte, comme chez nous. Annonces détaillées (lots de copropriété, cave). Barème d'honoraires 2026 en PDF | **Template Modelo** : police Quicksand, hero tour Eiffel au coucher de soleil + moteur à 5 champs (« Type de bien » vide par défaut), sur-titres en capitales (« CONFIANCE ET PROXIMITÉ ») au-dessus de chaque bloc, tuiles dégradées. Bloc « Découvrez notre agence en vidéo » **vide** (rectangle noir). Avis Opinion System liés mais pas affichés. Estimation réduite à un champ « Adresse ». Bandeau cookies de 12 lignes qui cache le hero sur mobile | Contre-modèle exact, à ne pas reproduire. Un bloc vide détruit la crédibilité : **jamais de section sans contenu réel** |
| 3 | [agence-marechaux.com](https://www.agence-marechaux.com) | Garches. Familiale, indépendante depuis 1981 | Histoire familiale bien racontée (fondateur, puis les fils). Chiffres concrets (ventes et locations par an, lots gérés). FAQ. Formulaire de contact avec consentement RGPD | **Même template Modelo** que n°2 et n°4 (Poppins cette fois). **Chiffres contradictoires** sur la même page : 40 ou 45 ans, 5 000 familles ou 5 000 projets, 450 ou 550 lots. Partage social flottant. Logo « M » rouge dans un carré noir | Un chiffre contradictoire suffit à ruiner la crédibilité : **une seule source de vérité** (`agency.ts`) pour chaque chiffre affiché |
| 4 | [costier-immobilier.com](https://www.costier-immobilier.com) | Paris 17e, rue Laugier. Indépendante, petite équipe | « Interlocuteur unique » mis en avant. Avis de valeur annoncé « sous 48 h ». Biens « Loués » conservés comme preuve | **Clone visuel de n°2** : même photo tour Eiffel, même moteur, même bandeau cookies, même bloc vidéo. Seules la couleur et la police changent | Preuve chiffrée du « site de template » : trois agences, une seule maquette. Le client a raison de vouloir s'en écarter |
| 5 | [lmht-immobilier.fr](https://www.lmht-immobilier.fr) | Sèvres et 13 villes. Familiale depuis 2000 | Pas de moteur sur l'accueil. Chiffres clés en tête. Note 4,6/5 avec trois avis typés (bailleur, vendeur, copropriétaire). FAQ | Style startup SaaS : Poppins, carte violet-bleu arrondie sur fond lavande, puces cochées, « 15k+ / 4k+ / 26+ ». Slogan creux (« le meilleur de l'immobilier traditionnel et digital »). Formulaire d'estimation **qui commence par les coordonnées**. Consentement par simple clic | Le registre « néo-agence tech » dessert une agence de quartier sérieuse. Les avis typés par profil (vendeur, bailleur) sont une bonne idée |
| 6 | [sadone.fr](https://www.sadone.fr) | Neuilly, depuis 1980. Indépendante, « immobilier et patrimoine » | Logotype serif en capitales espacées : élégant et sobre. Photo de façade réelle (pas de tour Eiffel). Le meilleur **tunnel d'estimation** du panel (voir §4) | Moteur à onglets sous le hero. Menu dense (8 entrées + 6 utilitaires). Bouton gris délavé. Bouton WhatsApp vert vif | Une façade réelle vaut mieux qu'un panorama de Paris. Leur tunnel est une base de travail, à alléger |
| 7 | [buildingpartners.com](https://www.buildingpartners.com) | Ouest parisien (Paris 16e/17e, Neuilly, Levallois, Courbevoie). Groupe « boutique » de 5 agences | **Grenat #971848 + crème #fffaf1 + serif IvyPresto avec un mot en italique grenat** (« Nos *pépites* », « Ils nous font *confiance* ») : le couple de couleurs le plus proche de notre cahier des charges, déjà sur notre marché. Grandes photos d'intérieur. Footer en colonnes titrées en italique. Paragraphe signé par le dirigeant | Moteur de recherche sous le hero. Carrousel de 15 biens. Logo arbre en photo-collage. Le grenat sert aussi aux boutons cookies, ce qui l'use. Tuiles « type de bien » qui ne servent qu'au SEO | **Référence couleur et typographie directe**. Comme ce concurrent est sur notre zone, il faut **se différencier** : grenat plus profond et moins framboise, italique utilisée avec bien plus de parcimonie, pas de carrousel |
| 8 | [immochevreux.com](https://www.immochevreux.com) | Strasbourg, une agence haut de gamme | Pas de filtre sur l'accueil (recherche reléguée sur une page dédiée). Numéro de mandat sur chaque carte. Archive des biens vendus. Photos d'accueil en noir et blanc (choix assumé) | Hero carrousel avec flèches, titre ombré en serif, trois gros boutons gris. Estimation **renvoyée vers un sous-domaine** algorithmique. Texte SEO répétitif | Bonne idée : reléguer la recherche. Mauvaise idée : sous-traiter l'estimation à un outil externe |
| 9 | [abriculteurs.com](https://abriculteurs.com) | Réseau familial (25 villes), fondateurs nommés | Palette sauge #506554 + sable #cea575 cohérente. Bloc « Estimez votre bien en 3 clics » sur mobile, en premier écran | Accroche commerciale (« plus vite et au meilleur prix »). Statistiques invérifiables (« 99 % », « 3x », « N°1 »). Programme de parrainage. Bootstrap visible (bleu #0d6efd par défaut dans le CSS). Estimation dans une **iframe** tierce | Les chiffres invérifiables sont précisément ce que le brief interdit. Une palette cohérente à deux couleurs suffit pour se distinguer |

### 1b. Références « aspirationnelles » (grands noms, à regarder pour la retenue et non pour la structure)

| # | Site | Profil | Ce qui fonctionne | Ce qui ne fonctionne pas | À retenir |
|---|---|---|---|---|---|
| 10 | [junot.fr](https://www.junot.fr) | Paris, familial depuis 1984 (30 agences) | Fond crème #f2edeb et #e5dcd6, logotype serif fin, photo plein cadre, emphase en italique dans les titres. Le tunnel d'estimation laisse **choisir** entre « J'estime immédiatement » et « Je prends rendez-vous ». RGPD exemplaire (durée de conservation, contact rgpd@, Bloctel) | Moteur complet, méga-menus, page de 110 000 caractères dont un gros bloc SEO. **Chiffres incohérents** (5 162 ou 4 400 avis, 30 ou 25 agences). Bandeau cookies sur le hero | La qualité du crème et de la serif. Leur mention RGPD peut servir de modèle de texte |
| 11 | [emilegarcin.com](https://www.emilegarcin.com) | Familial depuis 1963, 27 agences | Brun #401f0e + caramel #ab784b, Trajan pour le logo. Bouton « Estimate my property » permanent dans l'en-tête. Récit de famille | Bootstrap visible. Panneau de recherche crème posé sur la photo. Libellés FR et EN mélangés. ~20 tuiles d'agences | Le bouton d'estimation **permanent dans l'en-tête** est le bon réflexe |
| 12 | [janssens-immobilier.com](https://www.janssens-immobilier.com) | Provence, associée à Knight Frank | Accroche courte et propre (« Faire du bien avec du beau »). Grande serif. Photo de famille et non de chaque agent | Moteur à 5 filtres, carrousel. Rouge #e4003b qui fait bannière commerciale. Formulaire d'estimation long et à plat (surface de terrain obligatoire même pour un appartement) | Une accroche de 6 mots peut porter tout un hero |
| 13 | [carolwoodre.com](https://carolwoodre.com) (Los Angeles) | Courtier indépendant | **Aucun moteur sur l'accueil**. Hero photo plein écran. Logos presse. Grille de biens vendus comme preuve | Claim invérifiable (« The #1 Independent Brokerage »). Grille de 25 biens | Les ventes réalisées sont la preuve la plus forte, et elle est **vérifiable** |
| 14 | [inigo.com](https://www.inigo.com) (Royaume-Uni) | Agence de maisons anciennes, sœur de The Modern House | **La meilleure référence de présentation des biens** : cartes sans ombre ni bordure, photo et sous elle une ligne nom/prix et une ligne lieu/statut juridique, en serif. Hero composé (photo + panneau de couleur unie + titre en italique). Trois biens par rangée, un bouton contour discret « View all ». Fonds de section en aplats doux (rose poudré, gris) | Bandeau cookies (« A polite request », bien formulé mais encombrant). Recherche présente dans l'en-tête | Grille de biens éditoriale : **3 colonnes, typographie fine, aucune « carte »**. Le ton du cookie (« A polite request ») montre qu'un message légal peut garder la voix de la marque |

### 1c. Hors immobilier : professions de confiance

| # | Site | Profil | Ce qui fonctionne | Ce qui ne fonctionne pas | À retenir |
|---|---|---|---|---|---|
| 15 | [haussmannnotaires.com](https://www.haussmannnotaires.com) | Étude notariale fondée en 1773 | Titre serif Playfair avec une moitié en italique colorée. Valeurs en 3 mots. FAQ filtrable. Avis Google affichés | Bleu électrique #04047f + orange #fd8505 : ça fait criard pour une étude. Logos presse et labels en série | La FAQ répond à de vraies questions (« combien coûte un rendez-vous ? »). On l'adaptera aux honoraires et au déroulé d'une estimation |
| 16 | [60foch-versailles-paris.notaires.fr](https://60foch-versailles-paris.notaires.fr/en/office/) | Étude Versailles et Paris | **La confiance s'installe sans aucune photo de personne** : associés nommés, parcours, numéro d'agrément, page « engagements », tarifs. Prise de rendez-vous répétée | Très textuel et visuellement pauvre | Montre qu'on peut être crédible sans visage. Il faut compenser par des **faits nommés et vérifiables** (carte T, garant, date de création, adresse) |
| 17 | [attal-notaires.com](https://www.attal-notaires.com) | Étude notariale parisienne | Navigation courte (6 entrées) | Photo de stock HDR du Front de Seine, bouton bleu par défaut | Une photo de stock HDR suffit à faire « générique » : **nos illustrations doivent avoir une direction artistique** |

### 1d. Grenat ou bordeaux + crème bien utilisés (toutes industries)

Couleurs **mesurées dans les feuilles de style** (fréquence d'apparition), puis vérifiées sur capture.

| # | Site | Grenat mesuré | Crème mesuré | Usage observé | À retenir |
|---|---|---|---|---|---|
| 18 | [krug.com](https://www.krug.com) | **#5e0027** (109 occurrences) | #f1efeb | Grenat **réservé aux boutons pleins et au logotype**. Panneau crème sur photo sombre. Serif (Apolline) en italique pour les libellés, sans-serif (Gotham) pour le texte | **La référence la plus juste** : grenat très profond, presque prune, utilisé comme signature rare. Le crème sert de surface et non de décor |
| 19 | [champagne-bollinger.com](https://www.champagne-bollinger.com) | #7d2b2e | (blanc et gris) | Bordeaux en accent, l'or #c7ae5d domine | L'or à côté du bordeaux fait vite « vin et spiritueux de luxe » : **à éviter chez nous** |
| 20 | [rouje.com](https://www.rouje.com) | #c93636 / #c60a17 (rouge) | **#fbf7f3** (215 occ.) | Crème comme fond de tout le site, noir #0f0f0f pour le texte, rouge en ponctuation | Le crème #fbf7f3 en fond **général** et un texte presque noir : lisible, chaleureux et pas « papier jauni » |
| 21 | [laduree.fr](https://www.laduree.fr) | #8a545c (vieux rose bordeaux) | #fcf6ed, #fffdf9 | Garamond, crème de fond, accent mauve | Montre la limite : un bordeaux trop désaturé vire au mauve. Notre grenat doit rester **rouge-brun** |
| 22 | [nicolas.com](https://www.nicolas.com) | #94292e (322 occ.) | (gris #f5f5f5) | Bordeaux en bandeau promo, boutons, liens, pastilles « -15 % » | **Contre-exemple** : un bordeaux partout = enseigne de grande distribution. Plus il est rare, plus il paraît cher |
| 23 | [maison-pradier.fr](https://www.maison-pradier.fr) | #872b42 | #faf3f2 | Bordeaux associé à un vert canard #074e53 et à un rose | Trois couleurs fortes se font concurrence. **Une seule couleur d'accent** |

Référence légale (grand réseau, consultée pour la fiche bien uniquement) : [annonce La Forêt Asnières](https://www.laforet.com/agence-immobiliere/asnieres-sur-seine/acheter/asnieres-sur-seine/appartement-2-pieces-52957733), voir §6.

---

## 2. Points positifs récurrents (à reprendre sous notre propre forme)

1. **L'ancienneté et l'adresse comme premier argument** : « depuis 1981 », « depuis 1990 », « depuis 1980 ». Chez les indépendants, c'est la preuve n°1, avant les avis.
2. **Le « nous » d'agence sans photo d'équipe** (Entre Nous, Costier, 60 Foch) : c'est courant et cela fonctionne quand le texte est **précis** (rôle, méthode, périmètre).
3. **L'interlocuteur unique** (Costier, Building Partners) : c'est déjà notre engagement n°2 dans `agency.ts`.
4. **Les biens vendus ou loués conservés en archive** (Carolwood, Immochevreux, Junot, Costier) : la preuve d'activité la plus honnête.
5. **Une serif éditoriale avec une emphase en italique** (Junot, Building Partners, Haussmann, Inigo) : c'est le code du sérieux haut de gamme, à condition de ne pas le répéter dans chaque titre.
6. **Un bouton d'estimation permanent dans l'en-tête** (Emile Garcin, Building Partners, LMHT).
7. **Une FAQ factuelle** (Maréchaux, LMHT, Haussmann) : honoraires, délai, déroulé.
8. **Une mention RGPD complète** sur les formulaires (Junot : finalité, durée de conservation, contact, Bloctel).
9. **Une fiche bien conforme** avec honoraires, copropriété et énergie formulés comme chez La Forêt (§6).

## 3. Points négatifs récurrents : anti-patterns « template d'agence » à bannir

Le comptage porte sur les 13 agences du corpus (§1a et §1b, avec La Forêt). Les colonnes « Interdiction » valent pour notre site.

| Anti-pattern | Vu chez | Interdiction pour nous |
|---|---|---|
| **Moteur de recherche à filtres sous le hero** (type, localisation, budget, surface, « + ») | 10 sur 13 (Entre Nous, Costier, Maréchaux, Crefimo, Sadone, Building Partners, Junot, Janssens, Emile Garcin, Abriculteurs) | Aucun champ de recherche ni filtre. Les ~10 biens sont **tous visibles** dans une seule liste éditoriale, avec au plus un séparateur Vente / Location |
| **Hero tour Eiffel ou panorama de Paris** | Entre Nous, Costier, Emile Garcin, Attal | Nous sommes à Asnières. Aucun monument parisien. Des illustrations de **notre** territoire (§ reco 9) |
| **Bandeau cookies qui couvre 40 à 60 % du premier écran** | 17 des 23 sites | Aucun traceur non essentiel, donc **aucun bandeau**. Mesure d'audience exemptée de consentement (Vercel Analytics, Plausible ou équivalent configuré selon la CNIL). *[Dépassé : aucune mesure en v1, A10.]* |
| **Sur-titres en capitales au-dessus de chaque bloc** (« CONFIANCE ET PROXIMITÉ », « EXPERTISE ET PASSION ») | Entre Nous, Costier, Sadone | Au plus un sur-titre fonctionnel par page (par exemple un numéro de section), jamais un mot-valeur |
| **Chiffres ronds invérifiables ou contradictoires** (« 99 % », « N°1 », « 15k+ », 40 contre 45 ans) | Abriculteurs, LMHT, Maréchaux, Junot, Carolwood | Uniquement des faits sourcés dans `agency.ts` (2009, adresse, note Google réelle avec son nombre d'avis et un lien). Pas de compteur animé |
| **Bloc vide ou bouche-trou** (vidéo absente, « Ils nous ont fait confiance » sans avis) | Entre Nous, Costier | Une section sans contenu réel n'est pas publiée. Composants conditionnels |
| **Tuiles « Acheter / Vendre / Louer / Gestion »** avec dégradé ou photo | Entre Nous, Costier, Maréchaux, LMHT, Building Partners | Les métiers sont présentés en texte (3 lignes éditoriales), pas en grille d'icônes |
| **Carrousels** (hero, biens, avis) | Building Partners, Janssens, Immochevreux, Crefimo | Pas de carrousel automatique. Galerie de la fiche bien uniquement, au rythme du visiteur |
| **Pavé SEO en bas de page** (« Agence immobilière à… » ×20) | Junot, Immochevreux, Building Partners | Le SEO se fait par des contenus utiles (pages métiers, quartier, FAQ) et les données structurées, pas par un pavé |
| **Comptes, favoris, alertes, espace propriétaire** | Crefimo, Entre Nous, Costier, Junot, Building Partners | Rien de tout cela : pas de compte, pas de cœur « favori » |
| **Partage social flottant, WhatsApp vert, widget de chat** | Maréchaux, Sadone | Aucun élément flottant. Le téléphone est cliquable dans l'en-tête |
| **Estimation sous-traitée** (iframe, sous-domaine, « en 3 clics ») | Abriculteurs, Immochevreux, Building Partners | Tunnel natif, sans prix automatique (§4) |
| **Mentions réglementaires reléguées** dans « Mentions légales » (carte T, garant, médiateur absents du footer) | 9 sur 13 | Footer réglementaire visible : carte T, CCI, garant, RCS, médiateur, barème |
| **Polices de template** (Quicksand, Poppins, Montserrat, Open Sans) | Entre Nous, Costier, Maréchaux, LMHT, Abriculteurs, Immochevreux, Sadone, Junot | À exclure de la sélection de Pirlo |
| **Couleur d'accent partout** (boutons, badges, cookies, liens, promos) | Nicolas, Building Partners, Entre Nous | Le grenat est **rare** : CTA principal, liens actifs, quelques mots. Le reste reste encre et crème |

---

## 4. Tunnels d'estimation étudiés

| Site | Étapes | Champs (dans l'ordre) | Ton | Écran de fin et délai |
|---|---|---|---|---|
| **Sadone** (Neuilly) | 6, avec barre de progression (Général, Pièces, Annexes, Les plus, Votre projet, Fin) | Vente ou location, adresse, type, surface Carrez, chambres, salles de bain, WC, étage, ascenseur, extérieurs avec surfaces, état, DPE, caves, box, parkings, **lumière (sombre / normal / lumineux, avec aide)**, **bruit**, état de l'immeuble, travaux votés, ravalement, propriétaire, occupé, motif, délai, recontact, CGU | Pédagogique. Précise **qu'une indication de prix n'est pas une expertise** | Fourchette de prix affichée immédiatement + « Appelez-nous / Prendre RDV ». Aucun délai de rappel promis |
| **Junot** | Choix d'entrée (« J'estime immédiatement » ou « Je prends rendez-vous ») puis 4 étapes | Projet, adresse, surface, pièces, civilité, prénom, nom, e-mail, téléphone, **canal préféré (appel, SMS, WhatsApp, e-mail)**, **moment souhaité**, 2 consentements + newsletter facultative | Premium. Répète « gratuit et sans engagement » | Avis de valeur « généralement sous 72 h après la visite ». Confirmation avant de quitter la page |
| **Maréchaux** | 2 (« Votre bien », « Vos coordonnées ») | Maison ou appartement, adresse, puis coordonnées | Pédagogique : explique qu'un prix surévalué fait fuir les acheteurs | Dossier d'estimation complet remis après visite. Pas de délai annoncé |
| **LMHT** | 1 (formulaire à plat) | **Prénom, nom, e-mail, téléphone d'abord**, adresse ensuite | Direct | Consentement implicite au clic, pas de délai, pas de confirmation décrite |
| **Janssens** | 1 (modale longue) | Nom, adresse, ville, type, surface, **terrain obligatoire**, chambres, informations libres, e-mail, téléphone, RGPD, newsletter | Discret, « sur mesure » | Rien n'est annoncé |
| **Entre Nous / Costier** | 1 champ (adresse), puis page dédiée | Adresse → « Estimer mon bien » | « Nous dépassons les estimations en ligne » | Costier promet un avis de valeur « sous 48 h » |
| **Building Partners** | Deux voies (outil instantané ou rendez-vous) | Caractéristiques, ventes dans un rayon de 500 m | « Premier repère » | Rendez-vous avec un conseiller |

### Synthèse et recommandation pour le tunnel du Cabinet Rimbault

**Principe.** Notre premier engagement (`agency.ts`) est « Nous refusons les estimations gonflées ». Un **prix automatique** contredirait cette promesse. Aucun de nos concurrents directs n'en affiche d'ailleurs de fiable. Le tunnel collecte donc ce qu'il faut pour **préparer la visite**, et le prix est donné par l'agent, en personne. C'est aussi notre différence face à Abriculteurs (« 3 clics ») ou Immochevreux (algorithme).

**Structure recommandée : 4 étapes, une question principale par écran, environ 90 secondes.**

1. **Le bien** : appartement ou maison (deux grands choix, pas de liste déroulante), adresse (ou au minimum le code postal, seul champ obligatoire côté API avec le type).
2. **Ses caractéristiques** : surface, pièces, chambres. Selon le type, étage et ascenseur (appartement) ou terrain et niveaux (maison). Extérieurs : balcon, terrasse, jardin, garage ou parking (cases). **État général** sur l'échelle `PropertyCondition` de l'API (neuf → à restaurer), libellée en français simple. Ce que Sadone fait bien et qu'on garde : une aide d'une ligne sous les choix subjectifs.
3. **Vous** : prénom, nom, e-mail, téléphone (facultatif mais recommandé), **préférence de rappel** (appel ou e-mail, avec un créneau : matin, midi ou soir, idée tirée de Junot), message libre facultatif.
4. **Vérification et envoi** : récapitulatif modifiable, consentement RGPD explicite (case non cochée, texte inspiré de Junot : finalité, durée de conservation, droits, contact), bouton « Envoyer ma demande ». *[Dépassé : « Envoyer la demande », A17.]*

**À ne pas mettre** :
- La question « projet » (mise en vente envisagée, mise en location envisagée, juste une idée de prix). Le client a demandé de la retirer (`notes.txt`, « Page estimation »). Le champ `intent` de l'API reste vide. *À confirmer par Zidane : faut-il garder au moins un choix « vente ou location » pour savoir si l'on estime un prix de vente ou un loyer ? Si oui, il passe en étape 1, sans formulation d'intention.*
- Coordonnées en premier (LMHT), newsletter, création de compte, surface de terrain obligatoire pour un appartement (Janssens), DPE (l'agent le vérifiera sur place).

**Écran de fin (le plus négligé du panel : aucun site ne le soigne).**
- Un titre factuel (« Votre demande est bien arrivée. »), le récapitulatif de la demande, **ce qui va se passer** (l'agent vous rappelle, convient d'une visite, remet un avis de valeur écrit), le délai **seulement s'il est validé par l'agent** (Costier annonce 48 h, Junot 72 h après visite : à ne pas recopier sans accord), le téléphone de l'agence, l'adresse.
- Un e-mail d'accusé de réception au demandeur **existe déjà** dans l'API (`evaluationConfirmationEmail`). Il manque **la notification à l'agent** : c'est l'ajout prévu à `POST /api/public/evaluation`. Recommandation : e-mail à l'agent avec objet explicite (« Estimation : appartement, 92600, 68 m² »), toutes les réponses en tableau, `replyTo` = e-mail du demandeur pour répondre en un clic, et lien vers la fiche dans l'admin.

**Côté technique (à transmettre à Xavi et Maldini).** L'API exige `propertyType`, `postalCode` (5 chiffres), `firstName`, `lastName`, `email`. Elle accepte `condition` (enum), `timeframe`, `message`, `rgpd`, `source: "vitrine"`. Les champs étage, ascenseur et terrain **n'existent pas** dans le modèle `Evaluation`. Il faut soit les ajouter (migration côté API, en respectant l'ordre de déploiement API puis vitrine), soit les sérialiser dans `message`. Tests d'envoi : toujours via un mock, jamais en production.

---

## 5. Recommandations concrètes et argumentées (15)

1. **Liste de biens éditoriale, sans moteur.** Une page « Nos biens » avec tous les biens (environ 10), d'abord ceux en vente puis ceux en location, en grille de 3 colonnes à la manière d'Inigo : photo au format fixe 4:3, puis une ligne « Appartement 3 pièces, 68 m² » / prix, puis une ligne « Asnières, quartier Bourguignons » / statut. Ni ombre, ni bordure, ni cœur, ni carrousel. *Raison : 10 sur 13 concurrents imposent un moteur inutile pour 10 biens. Le retirer suffit à nous distinguer.*
2. *[Dépassé : voir A14 et A22, photo sans traitement, badge « Vendu » ou « Loué » sans année.]* **Archive « Vendus et loués »** sous la liste, en version atténuée (photo désaturée et mention « Vendu en 2026 », sans prix si l'agent préfère). *Raison : c'est la seule preuve d'activité vérifiable (Carolwood, Immochevreux, Junot) et elle remplace les chiffres invérifiables.*
3. *[Précisé par A19 : seul le bouton du contenu est grenat, celui de l'en-tête est secondaire.]* **Hero sans formulaire.** Une phrase courte et vraie (comme le « Faire du bien avec du beau » de Janssens, mais sans jeu de mots), l'adresse et « depuis 2009 » en petit, une illustration de quartier, et **deux** accès : « Voir nos biens » et « Faire estimer ». Pas de panorama, pas de tour Eiffel. *Raison : le hero standard du panel est « photo de Paris + 5 filtres ».*
4. *[En partie dépassé : jamais de mot en grenat dans un titre, brief §6.2.]* **Le grenat comme signature rare.** Un grenat profond tirant sur le brun, entre le #5e0027 de Krug et un rouge-brun (l'exploration autour de #6b1e2a / #5a1a24 revient à Pirlo), réservé au bouton principal, aux liens actifs, au logotype et à 1 ou 2 mots par page. **Pas d'or.** *Raison : Nicolas montre qu'un bordeaux omniprésent fait enseigne de grande surface, Krug qu'un grenat rare fait maison sérieuse. Le grenat de Building Partners (#971848) est framboise : il faut en rester visiblement éloigné, car c'est un concurrent de la zone.*
5. **Le crème comme surface, pas comme décor.** Fond général crème clair (ordre de grandeur #f7f2ea à #fbf7f3, comme Rouje et Junot), texte encre presque noire chaude, une seconde surface crème plus soutenue pour alterner les sections. Pas de texture « papier ». *Raison : fond crème et texte quasi noir donnent la lisibilité la plus élégante du panel (Rouje, Junot). Un crème trop jaune fait vieillot.*
6. **Typographie : une serif de caractère + une sans-serif neutre, en excluant explicitement Quicksand, Poppins, Montserrat et Open Sans.** Italique au plus une fois par écran. *Raison : 8 des 13 agences utilisent ces quatre polices. L'italique est devenue un tic chez Building Partners, à doser.*
7. **Le « nous » factuel remplace le visage.** Une page « Le cabinet » qui raconte des faits datés et vérifiables : création en 2009, l'adresse du boulevard Voltaire, le périmètre (Asnières et les communes voisines), la méthode (une seule personne du premier rendez-vous au notaire), les 3 engagements déjà rédigés. Aucune photo de personne, pas même floutée ou de dos. *Raison : 60 Foch et Entre Nous prouvent qu'on peut être crédible sans portrait si le texte est précis. Les sur-titres-valeurs (« PASSION ») produisent l'effet inverse.*
8. **Avis Google réels, sans mise en scène.** La note 4,9 et les 32 avis, avec un lien vers la fiche Google. Éventuellement 2 ou 3 extraits **copiés à l'identique** avec prénom et date, à mettre à jour, sans étoiles décoratives ni carrousel. *Raison : Entre Nous renvoie vers ses avis sans les montrer, Abriculteurs affiche « 99 % ». La sobriété vérifiable est plus forte que les deux.*
9. **Illustrations : un système graphique propre à Asnières plutôt que de la photo de stock.** Par exemple des dessins au trait (grenat sur crème, ou encre sur crème) de typologies locales : pavillon en meulière, immeuble de rapport en brique, balcon fer forgé, porte cochère, berges de Seine. Le même trait, la même épaisseur, la même palette partout. *Raison : Attal et Entre Nous montrent qu'une photo de stock fait générique. Le noir et blanc de Crefimo et d'Immochevreux est triste. Un trait cohérent est rare dans le secteur et ne montre personne (contrainte client).*
10. **Fiche bien conforme et lisible, modèle La Forêt** (exigé dans `notes.txt`) : prix, puis « soit X € honoraires exclus » et « Honoraires de Y % TTC à la charge de l'acquéreur ». Bloc copropriété (nombre de lots, charges annuelles moyennes, procédure en cours ou non). Étiquettes DPE et GES avec consommation et émissions, **fourchette de coûts annuels** et années de référence, phrase « usage standard », lien Géorisques. *Raison : obligation légale et demande explicite du client. Le formulé exact de La Forêt est cité au §6.*
11. **Footer réglementaire complet et visible**, pas seulement dans « Mentions légales » : carte T CPI 9201 2018 000 024 838 (CCI Paris Île-de-France), garant LLOYD'S France, SAS RCS Nanterre 511 484 586, **médiateur** (encore « TODO » : à obtenir de l'agent avant la mise en ligne), lien vers le barème d'honoraires en HTML et non en PDF seul. *Raison : 9 agences sur 13 cachent ces mentions. Les montrer est une preuve de sérieux qui ne coûte rien.*
12. *[Précisé par A10 : aucune mesure d'audience en v1.]* **Zéro bandeau cookies.** Pas de traceur publicitaire, mesure d'audience exemptée, pas d'embed Google Maps chargé d'office (un lien « Itinéraire » vers `mapsDirections` suffit, ou une carte statique). *Raison : sur mobile, 17 sites sur 23 perdent leur premier écran derrière un bandeau. Nous gagnons à la fois en esthétique et en conformité.*
13. *[Dépassé : 5 entrées (A2), bouton d'en-tête secondaire (A19).]* **En-tête minimal et constant** : logotype, 4 entrées au plus (Nos biens, Vendre et estimer, Louer, Le cabinet), le téléphone cliquable et un bouton « Faire estimer » en grenat. Sur mobile, un menu plein écran simple. *Raison : Sadone et Junot ont plus de 8 entrées et des méga-menus. Emile Garcin et LMHT montrent l'intérêt d'un bouton d'estimation permanent.*
14. *[En partie dépassé : fondu des sections à l'apparition interdit, brief §7.]* **Animations : seulement celles qui servent la lecture.** Fondu court des sections à l'apparition, transition de page discrète, survol de la photo d'un bien (léger zoom ou voile), barre de progression du tunnel. Pas de parallaxe, pas de compteurs, pas de carrousel automatique. Respect de `prefers-reduced-motion`. *Raison : La Boucle cite Junot pour ses « effets d'animations minimalistes ». Ce qui fait « site vibe codé », ce sont les entrées spectaculaires et les compteurs (LMHT, Abriculteurs).*
15. **Une FAQ courte et utile** sur les pages Vendre et Louer : combien coûte une estimation (rien), comment elle se déroule, nos honoraires (lien vers le barème), délais habituels, documents à prévoir. *Raison : Haussmann, Maréchaux et LMHT montrent que la FAQ rassure. Chez nous, elle remplace aussi le pavé SEO avec un contenu réellement utile.*

---

## 6. Annexe : formulations de La Forêt à reprendre (fiche bien, `notes.txt`)

Relevé verbatim sur l'annonce La Forêt Asnières du 30/10/2026 :

- Prix : « Honoraires à la charge de l'acquéreur inclus : 5,91% soit 254 000,00 € honoraires exclus. »
- Copropriété : « Soumis à la copropriété », « Nb lots copro : 26 », « Montant moyen des charges annuelles : 1 825,00 € », « Pas de procédure de sauvegarde de la copropriété en cours. »
- Énergie : « Les coûts sont estimés en fonction des caractéristiques de votre logement et pour une utilisation standard. », « Montant estimé des dépenses annuelles d'énergie pour un usage standard entre 970,00 € et 1 330,00 € indexées aux années 2021, 2022 et 2023 (abonnement compris). »
- Risques : « Les informations sur les risques auxquels ce bien est exposé sont disponibles sur le site Géorisques. »
- Ordre des sections de la fiche : Présentation, Caractéristiques, Description, Emplacement, Bilan énergétique, Simulateur, L'agence, Aux alentours. Pour nous : pas de simulateur de crédit, pas de bloc « Aux alentours » générique.

Le client demande (notes) l'affichage en deux lignes sous le prix : « Soit 189 000 € honoraires exclus » puis « Honoraires de 4,76 % à la charge de l'acquéreur ».

## 7. Annexe : méthode et reproductibilité

- Contenu : WebFetch sur l'accueil, puis sur les pages d'estimation (`/fr/estimer/choix/` chez Junot, `/estimer/` chez Sadone, `/estimation-immobiliere-hauts-seine,107` chez Maréchaux, `/estimer-mon-bien/` chez LMHT, `/estimer-votre-propriete/` chez Janssens, `/immobilier/estimer-mon-bien-en-ligne` chez Building Partners).
- Couleurs et polices : script Python qui récupère le HTML et jusqu'à 8 feuilles CSS liées, puis compte les `#rrggbb` et les `font-family`.
- Captures : Playwright (version installée dans `cabinet-rimbault-vitrine/node_modules`), Chromium, viewports 1440×900 et 390×844 (UA iPhone), page complète en JPEG.
- Limites : The Modern House a bloqué l'accès (Cloudflare). Les pages Efficity et MeilleursAgents ont renvoyé 403, ces tunnels ne sont donc pas analysés. L'iframe d'estimation d'Abriculteurs n'est pas lisible. Krug et Bollinger ont été analysés derrière leur contrôle d'âge (CSS et capture du panneau d'entrée).
