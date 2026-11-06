# Repérage visuel, novembre 2026

> **But** : trouver de l'inspiration **belle et désirable** pour la vitrine du Cabinet Rimbault, au-delà du registre actuel (crème, serif, grenat rare). Ce n'est pas un rapport de bonnes pratiques.
> **Date des visites** : 5 novembre 2026. **Tout ce qui suit vient de visites réelles** :
> - captures Playwright (desktop 1440×900, page complète réduite à 960 px de large, mobile 390×844) ;
> - couleurs et polices **relevées dans les styles calculés de la page**, pondérées par la surface (pour les fonds) ou par la quantité de texte (pour les couleurs de texte et les polices) ;
> - contenu lu par WebFetch pour la plupart des sites.
>
> Les bandeaux cookies ont été refusés quand un bouton de refus existait (« Reject all », « Avböj », « Je refuse », « Continuer sans accepter », etc.). Rien n'a été accepté et aucun formulaire n'a été rempli. Les sites du premier benchmark (`docs/refonte/01-recherche-bergkamp.md`, §1) n'ont pas été revisités.

Le corpus comprend **17 sites** : 12 dans l'immobilier (agences de caractère, maisons d'architecte, ancien, une foncière familiale, un promoteur d'architecture) et 5 hors immobilier, choisis parce qu'ils utilisent un rouge profond comme couleur dominante.

---

## 0. Ce qu'il faut retenir en 30 secondes

1. **Les plus beaux sites d'agences de caractère n'ont pas de moteur de recherche.** Cuvelo, Urban Spaces, Modernist Estates, Kvarteret, Historiska Hem, Artifact et Patrice Besse montrent entre 1 et 15 biens sur l'accueil, sans aucun filtre. C'est exactement notre situation, et ce sont ces sites-là qui donnent envie de rester.
2. **Ce qui les rend désirables tient rarement à la retenue.** Ce sont surtout des **aplats de couleur francs** : section entière bleu ciel chez Abercrombys, rose poudré chez Modernist Estates, terracotta plein écran chez Artifact, saumon et sauge chez Urban Spaces. Le crème n'y sert que de respiration entre ces aplats.
3. **La référence la plus directe pour nous est un hôtel.** L'Hôtel Rochechouart (Paris 9e) a une **devanture grenat** (#984647, mesuré). Son site ouvre sur la photo de cette façade et répète ce grenat en aplat au pied de page, sur un fond crème #fbf8ee. C'est notre cas mot pour mot : une devanture grenat dans une rue, qui devient un site.
4. Un détail revient chez les meilleurs : **une seule idée graphique propre à la maison**, poussée jusqu'au bout. Chez Urban Spaces, le logo « U » sert de masque aux photos. Chez Gallimard, le coin de page est corné. Chez Historiska Hem, une gravure d'immeuble et un tampon rond tiennent lieu de logo. Chez Domus Nova, deux horloges donnent l'heure de Londres et d'Ibiza. Pour nous, l'idée évidente est **la devanture**.

---

## 1. Tableau récapitulatif

| # | Site | Pays | Profil | Biens sur l'accueil | Moteur ? | Grenat transposable comme… |
|---|---|---|---|---|---|---|
| 01 | [tinholt.no](https://tinholt.no) | Norvège | Agence indépendante, Oslo | 0 (services seulement) | Non | Pied de page en aplat sombre |
| 02 | [cuvelo.com](https://www.cuvelo.com) | Royaume-Uni | Petite agence londonienne, biens rénovés | 1 à la une + 3 | Non | Touche (prix, statut) |
| 03 | [urbanspaces.co.uk](https://www.urbanspaces.co.uk) | Royaume-Uni | Agence « design-focused » depuis 25 ans | 4 (diaporama) + 2 récents | Non | Aplat de section |
| 04 | [modernistestates.com](https://www.modernistestates.com) | Royaume-Uni | Plateforme de maisons modernistes | 15 (3 + 9 + 3) | Non | Aplat de section |
| 05 | [themodernhouse.com](https://www.themodernhouse.com) | Royaume-Uni | Agence de maisons d'architecte (sœur d'Inigo) | 12 (4 rangées de 3) | Non sur l'accueil | Bande pleine (citation presse) |
| 06 | [domusnova.com](https://domusnova.com) | Royaume-Uni | Agence indépendante, Notting Hill et Ibiza | Beaucoup (17 + 32 + 35) | Onglets seulement | Touche |
| 07 | [kvarteretmakleri.se](https://www.kvarteretmakleri.se) | Suède | Agence de quartier, Göteborg, depuis 2009 | Sélection en carrousel (3 visibles) | Non | Texte d'accroche + bandeau |
| 08 | [historiskahem.se](https://historiskahem.se) | Suède | Agence spécialisée dans l'ancien (avant 1970), Stockholm | 6 | Non | Aplats de cartes |
| 09 | [abercrombys.com.au](https://www.abercrombys.com.au) | Australie | Agence « boutique », Melbourne et Hobart | 4 (1 grand + 3) | Oui (à ne pas copier) | **Aplat dominant** |
| 10 | [caso-patrimoine.fr](https://www.caso-patrimoine.fr) | France | Foncière familiale, Toulouse, Paris et Bordeaux | 29 locations en carrousel | Onglets seulement | Aplat taupe, puis grenat |
| 11 | [artifactproperty.co.nz](https://artifactproperty.co.nz) | Nouvelle-Zélande | Promoteur d'architecture (2 associés) | 1 projet | Non | **Aplat plein écran** |
| 12 | [patrice-besse.com](https://www.patrice-besse.com) | France | Agence de bâtiments de caractère, depuis 1924 | 15 (carrousel) | Non | Logotype |
| 13 | [Hôtel Rochechouart](https://www.orsohotels.com/hotel-rochechouart) | France | Hôtel Art déco, Paris 9e (groupe Orso) | — | — | **Devanture + pied grenat** |
| 14 | [bouillon-julien.com](https://www.bouillon-julien.com) | France | Bouillon historique, Paris 10e | — | — | En-tête et bande aubergine |
| 15 | [gallimard.fr](https://www.gallimard.fr) | France | Maison d'édition | — | — | **Hero en aplat rouge** |
| 16 | [merci-merci.com](https://merci-merci.com) | France | Concept store, boulevard Beaumarchais | — | — | Rouge pour le texte, sur crème |
| 17 | [lesrochesrouges.com](https://www.lesrochesrouges.com) | France | Hôtel 1912, Piana (Corse) | — | — | Crème et brique partout |

---

## 2. Agences et immobilier

### 01. Tinholt Eiendomsmegling, Oslo
![Tinholt, desktop](captures/01-tinholt-desktop.png)
Page complète : [01-tinholt-full.png](captures/01-tinholt-full.png). Mobile : [01-tinholt-mobile.png](captures/01-tinholt-mobile.png)

- **Profil** : agence indépendante, siège Bygdøy Allé 60 à Oslo. Elle intervient aussi à Asker et Bærum. Ni effectif ni ancienneté indiqués sur l'accueil.
- **Biens affichés** : **aucun** sur l'accueil. L'accueil vend l'agence (estimation, « nos courtiers », trois métiers). Les biens sont sur la page « Eiendommer ».
- **Palette** : fond **#ebe4de** (taupe rosé très clair) et encre **#18243a** (bleu nuit), sans autre couleur. Le bleu nuit sert à la fois au texte et à l'**aplat du pied de page**.
- **Typographies** : *Items* (serif display, graisse fine) pour les titres, *Scto Grotesk A* pour le texte.
- **Ce qui le rend beau** :
  - Il n'y a que deux couleurs, et le fond n'est pas blanc : tout le site baigne dans le même taupe, comme un papier.
  - Les titres serif sont très grands et très fins, sur deux lignes, et ils occupent la moitié gauche d'un bloc divisé en deux colonnes (« Vi setter pris på boligen din » | « På utkikk etter eiendomsmegler? »). Des filets fins horizontaux séparent les blocs.
  - Le hero est une nature morte (un livre, un objet en bois, une branche) et non une façade. Le titre est écrit par-dessus, en blanc, centré.
  - Le bloc « Si hei til oss » est un cartouche clair posé sur une grande photo d'intérieur en bois sombre. Son texte : venez prendre un café au bureau, adresse à l'appui. C'est une invitation physique à passer, pas un formulaire.
  - Le pied de page est un aplat bleu nuit dont les liens sont centrés et écrits **en serif, à grande taille**.
- **Peu de biens** : l'accueil n'en montre aucun. Il installe la confiance, et les biens vivent sur leur propre page.
- **Avec le grenat** : remplacer le bleu nuit par un **grenat très sombre** (encre et pied de page) sur un fond taupe rosé. Le bloc « Passez nous voir, 12 rue… » transposé tel quel conviendrait parfaitement à une agence de quartier qui a pignon sur rue.

### 02. Cuvelo, Londres
![Cuvelo, desktop](captures/02-cuvelo-desktop.png)
Page complète : [02-cuvelo-full.png](captures/02-cuvelo-full.png). Mobile : [02-cuvelo-mobile.png](captures/02-cuvelo-mobile.png)
*Le bandeau cookies de Cuvelo ne propose que « Accept » et « Settings », sans bouton de refus. Il reste visible sur les captures : je n'ai rien accepté.*

- **Profil** : petite agence londonienne (W1, W2, SW7) qui ne vend que des **appartements rénovés**, avec une garantie d'un an. La presse est citée (The Times, Spear's).
- **Biens affichés** : **1 bien à la une** dans le hero, puis **3 cartes** (Half Moon, Sussex Place, Ennismore), dont deux marquées « SOLD ». Il y a ensuite trois articles de journal, signés par un rédacteur de GQ.
- **Palette** : crème **#f2ece6** en fond général, anthracite **#2f2e2e** pour le pied de page, encre bleu-gris **#373b4d**.
- **Typographies** : *Times New Roman* pour les titres, *Montserrat* en capitales espacées pour les libellés, un peu de *Playfair Display*. Les polices sont banales ; c'est la mise en page qui fait tout.
- **Ce qui le rend beau** :
  - **Le hero est un bien et non un slogan.** La photo occupe les deux tiers gauches, à fond perdu. Le tiers droit, sur crème, donne la fiche minimale : prix en petit, titre descriptif en serif sur trois lignes (« Three Bedroom Apartment with double size living room in Hyde Park »), puis l'adresse en petites capitales grises.
  - Les cartes blanches sont posées sur le crème. Au-dessus du nom, en petites capitales, figure le statut (SOLD) ou le prix.
  - Le traitement photo est très homogène : intérieurs chauds, mobilier vintage orange et brun, lumière du jour.
- **Peu de biens** : un bien héros et trois cartes, rien d'autre. Les biens vendus restent visibles et servent de preuve.
- **Avec le grenat** : le **split photo / fiche sur crème** est directement réutilisable pour le bien du moment. Le grenat irait au statut (« Sous compromis », « Vendu ») et au prix. On pourrait aussi passer le tiers droit en **aplat grenat**, avec un texte crème.

### 03. Urban Spaces, Londres
![Urban Spaces, desktop](captures/03-urbanspaces-desktop.png)
Page complète : [03-urbanspaces-full.png](captures/03-urbanspaces-full.png). Mobile : [03-urbanspaces-mobile.png](captures/03-urbanspaces-mobile.png)
*Sur la page complète, la zone sous les avis est vide : le contenu se charge au défilement et n'a pas été rendu.*

- **Profil** : « London's original design-focused estate agent ». Vente et location depuis 25 ans (bibliothèques victoriennes, usines Art déco, églises converties). Un lien du pied de page pointe vers countrywide.co.uk, ce qui laisse penser à un rattachement à un groupe, sans que la page le dise.
- **Biens affichés** : **4** dans le diaporama du hero (nom de l'immeuble, rue et code postal, prix, lien « Detail ») et **2** dans « Recent activity » (statut et prix).
- **Palette** : fond **#f6ede7** (crème rosé), aplats **#feb7ad** (saumon), **#95b6a9** (sauge) et **#cbbb9f** (sable), texte noir.
- **Typographie** : *TWK Everett*, une seule grotesque dans toutes les tailles. Aucune serif.
- **Ce qui le rend beau** :
  - **Le logo « U » sert de masque** à la photo du hero : un grand U arrondi découpé dans quatre photos d'intérieur. C'est l'idée graphique propre à la maison, et elle se voit tout de suite.
  - Plus bas, des bandeaux alternent texte sur aplat de couleur et photo pleine largeur : sauge à gauche avec photo à droite, puis photo à gauche avec saumon à droite, puis sable. Chaque service (vendre, louer, live/work) a sa couleur.
  - Les boutons sont de simples rectangles à contour fin, sans remplissage.
- **Peu de biens** : il n'y a pas de grille. Les biens défilent dans le hero, et l'accueil parle surtout des services.
- **Avec le grenat** : un **monogramme « R » ou la forme de l'arcade de la devanture comme masque photo** ; c'est la transposition la plus forte du corpus. On peut aussi reprendre l'alternance texte sur aplat et photo, avec trois tons (grenat, rose poudré, sable) pour Vendre, Louer et Estimer.

### 04. Modernist Estates, Londres
![Modernist Estates, desktop](captures/04-modernistestates-desktop.png)
Page complète : [04-modernistestates-full.png](captures/04-modernistestates-full.png). Mobile : [04-modernistestates-mobile.png](captures/04-modernistestates-mobile.png)

- **Profil** : plateforme de maisons modernistes (vente, location, séjours, tournages), basée à Londres, avec une boutique sœur et un journal.
- **Biens affichés** : **15**, répartis en trois sections de 3 colonnes : 3 ventes, 9 séjours, 3 locations.
- **Palette** : fond **#e8e7df** (gris chaud), section séjours en aplat **#d0b0a8** (rose poudré), section locations en **#dae1dd** (vert-gris pâle), pied de page en **#5f9db4** (bleu). Le statut « Sold » est en rouge **#ea4a55**.
- **Typographies** : *GT Sectra* (serif à empattements taillés) pour tout le texte courant, *ABC Ginto* en capitales grasses minuscules pour les étiquettes.
- **Ce qui le rend beau** :
  - **Chaque catégorie de biens vit sur sa propre couleur de fond.** On change de section en changeant de « pièce ».
  - Chaque carte suit le même ordre strict : photo sans bordure ; étiquette de statut en petites capitales grasses (« REVISED PRICE », « UNDER OFFER », « SOLD » en rouge) ; nom du bien ; rue ; code postal ; prix ; « View more ». Le tout tient en cinq lignes serif, comme une notice de catalogue d'exposition.
  - Les photos sont documentaires : architecture d'immeubles des années 60, ciel blanc, aucun grand-angle racoleur.
  - Les tuiles de catégories portent un titre posé sur la photo, en serif blanche.
- **Peu de biens** : trois biens par catégorie et un bouton contour « View all ». Avec nos dix biens, une section Vente et une section Location de 3 à 6 cartes chacune suffiraient.
- **Avec le grenat** : **Vente sur crème, Location sur rose poudré, pied de page en aplat grenat**, et le statut « Vendu » en grenat dans l'étiquette.

### 05. The Modern House, Royaume-Uni
![The Modern House, desktop](captures/05-themodernhouse-desktop.png)
Page complète : [05-themodernhouse-full.png](captures/05-themodernhouse-full.png). Mobile : [05-themodernhouse-mobile.png](captures/05-themodernhouse-mobile.png)
*WebFetch a été refusé (403). Les observations ci-dessous viennent des captures et des styles relevés.*

- **Profil** : agence de maisons d'architecte à l'échelle nationale, sœur d'Inigo (déjà vu). Elle est citée ici pour la **structure** de son accueil, différente de celle d'Inigo.
- **Biens affichés** : **12**, en quatre rangées de 3 (Prime, New, Featured, Past sales). Chaque rangée a un intitulé centré en petites capitales et un bouton « View all » aligné à droite.
- **Palette** : blanc, crème **#f5f1ed**, noir pour une bande pleine largeur (citation de GQ) et pour le pied de page.
- **Typographies** : polices propriétaires déclarées sous les noms génériques « serif » et « sans » : je n'ai pas pu les identifier.
- **Ce qui le rend beau** :
  - Le hero est en deux colonnes : la photo à gauche, à droite un cartouche crème qui annonce une **sélection éditoriale** (« Sparks Fly: a collection of homes close to… Bonfire Night ») plutôt qu'un bien ou un slogan.
  - Les cartes sont réduites au minimum : photo, puis une ligne nom et prix, puis une ligne lieu et statut juridique (« Freehold »).
  - Une **bande noire pleine largeur au bord déchiré** porte une citation de presse. C'est la seule fantaisie de la page.
  - Les ventes passées ont le même poids visuel que les biens disponibles.
- **Avec le grenat** : la **bande pleine largeur grenat** pour une citation (avis client ou phrase de l'agence) entre deux rangées de biens. Et l'idée d'un hero éditorial : « Trois appartements près du marché de Bécon », par exemple.

### 06. Domus Nova, Londres et Ibiza
![Domus Nova, desktop](captures/06-domusnova-desktop.png)
Page complète : [06-domusnova-full.png](captures/06-domusnova-full.png). Mobile : [06-domusnova-mobile.png](captures/06-domusnova-mobile.png)

- **Profil** : agence indépendante de Notting Hill, plus de 20 ans, avec un bureau à Ibiza et un partenariat BARNES depuis 2025.
- **Biens affichés** : **beaucoup trop pour nous** (17 dans la grille d'ouverture, 32 locations, 35 ventes), avec seulement des onglets All / Ibiza / London. C'est un contre-exemple sur la quantité. Il est retenu pour ses **détails**.
- **Palette** : fond **#f9f8f4**, bleu **#215068** et sauge **#96a78d** pour les cartes du journal, texte **#333333**.
- **Typographies** : *ITC Souvenir* (serif ronde des années 70, très reconnaissable) pour les titres, *Neue Haas Grotesk* pour le texte.
- **Ce qui le rend beau** :
  - Le hero est une **bande horizontale de photos** qui déborde à gauche et à droite de l'écran, avec sous la photo centrale le nom du bien à gauche et une phrase descriptive à droite.
  - **Deux horloges** (« LDN 14:33:44 », « IBZ 15:33:44 ») dans le bloc de présentation : un micro-détail qui dit « nous sommes à deux endroits » sans phrase.
  - Le bloc « A new chapter » montre **la façade de l'agence**, une photo de la devanture avec quelqu'un qui passe devant.
  - Les cartes du journal sont en aplats de couleur (sauge, bleu) et se chevauchent légèrement.
  - Le choix d'ITC Souvenir, une police démodée assumée, donne immédiatement une personnalité.
- **Avec le grenat** : **la photo de la devanture grenat comme bloc de présentation**. L'équivalent de l'horloge pour nous serait les **horaires d'ouverture en direct** (« Ouvert aujourd'hui jusqu'à 19 h »). Enfin, oser une serif à caractère (type Souvenir, Cooper, Windsor) plutôt qu'une serif classique.

### 07. Kvarteret Mäkleri, Göteborg
![Kvarteret Mäkleri, desktop](captures/07-kvarteret-desktop.png)
Page complète : [07-kvarteret-full.png](captures/07-kvarteret-full.png). Mobile : [07-kvarteret-mobile.png](captures/07-kvarteret-mobile.png)

- **Profil** : **agence de quartier**, Kungsladugårdsgatan 14, vend depuis **2009** dans l'ouest de Göteborg. C'est le profil le plus proche du nôtre dans tout le corpus : même date de création, même échelle, même discours. Phrase d'ambition, traduite : « pas être la plus grande, mais être de bons voisins ».
- **Biens affichés** : « Ett urval av bostäder till salu » (« une sélection de biens à vendre »), en carrousel de cartes, 3 visibles par vue. Le contenu se charge par script : le nombre exact n'est pas lisible dans le texte récupéré.
- **Palette** : blanc, **#f4f3ef** et **#e8e6dd** (gris chaud), **#daceb3** (sable), pied de page **#2e1e18** (brun très sombre). Titres d'accroche en bleu **#3e71b9**, boutons orange **#dc582a**.
- **Typographies** : *Plantin* (serif de labeur) pour les accroches, *Futura PT* en capitales très espacées pour les titres de section, un peu de *Miller Display Italic*.
- **Ce qui le rend beau** :
  - Les accroches sont de **grandes phrases centrées en serif colorée** (« Kvarteret är ett mäkleri med lokalförankring och hög kvalitet… »), terminées par un petit filet. On dirait une lettre.
  - **« Utforska våra kvarter »** (« explorez nos quartiers ») est une grille de 12 photos de quartiers, chacune avec son nom en serif blanche. C'est l'idée la plus transposable du corpus pour une agence locale.
  - Une photo de l'agence, porte ouverte, avec des gens devant.
  - Les avis sont présentés avec **une photo ronde du bien vendu**, l'adresse et l'année. C'est vérifiable et sans visage.
  - Le pied de page brun très sombre porte un monogramme « KV » dans un cercle.
- **Avec le grenat** : remplacer le bleu des accroches par le **grenat**. Faire une **grille « Nos quartiers » pour Asnières** (Bécon, Quatre-Routes, les Courtilles, le centre, les quais), avec des photos prises par nous. Monogramme « CR » en cercle dans un pied de page grenat très sombre (proche du brun #2e1e18).

### 08. Historiska Hem, Stockholm
![Historiska Hem, desktop](captures/08-historiskahem-desktop.png)
Page complète : [08-historiskahem-full.png](captures/08-historiskahem-full.png). Mobile : [08-historiskahem-mobile.png](captures/08-historiskahem-mobile.png)

- **Profil** : agence spécialisée dans le **bâti d'avant 1970**, deux bureaux (Södermalm, Östermalm). Son approche est narrative : histoire du bâtiment, archives, plans d'origine.
- **Biens affichés** : **6** cartes en 2 colonnes, puis « Visa alla ».
- **Palette** : fond **#f7f1e1** (crème), cartes en bandeau lavande **#9fa4b5**, section « Sälj med oss » en vieux rose **#c8aba3**, pied de page gris olive **#7d8078**.
- **Typographies** : *Unna* (serif) en capitales pour le nom des biens, *Poppins* pour le reste. Poppins est le point faible.
- **Ce qui le rend beau** :
  - Chaque carte porte une **étiquette d'état** dans le coin de la photo (« Budgivning pågår », « Kommande », « Visning 9 november »), puis sous la photo un **bandeau lavande** avec le quartier en grandes capitales serif et une ligne de chiffres (adresse, pièces, m², prix).
  - Une **gravure au trait d'un immeuble** illustre la section « Vår filosofi ». Le logo est un **tampon rond** dessiné.
  - Une page « Färgkollektion » (palette de couleurs) dans le menu : la couleur fait partie de la marque.
- **Avec le grenat** : le **bandeau de couleur sous la photo**, en grenat avec le texte crème. **Une gravure ou un dessin au trait de la façade du cabinet**, ou d'un immeuble typique d'Asnières, comme illustration de marque. Ce serait un très bon substitut à l'absence de photo de l'agent.

### 09. Abercrombys, Melbourne
![Abercrombys, desktop](captures/09-abercrombys-desktop.png)
Page complète : [09-abercrombys-full.png](captures/09-abercrombys-full.png). Mobile : [09-abercrombys-mobile.png](captures/09-abercrombys-mobile.png)

- **Profil** : agence « boutique » de biens d'architecture et de patrimoine, Armadale et Hobart, trois directeurs.
- **Biens affichés** : **4** (un grand à gauche avec l'adresse et « View » à droite, puis 3 petits en dessous).
- **Palette** : **#c8e9fd (bleu ciel) en aplat sur toute la moitié haute de la page**, gris pierre **#e0dcd7** pour les avis, **#de9c5f (ocre)** en aplat pour le formulaire d'estimation, anthracite **#29292c** pour le pied de page.
- **Typographies** : *Caslon* pour tout le texte, *Styrene* en capitales espacées pour les libellés.
- **Ce qui le rend beau** :
  - **L'audace de l'aplat.** Une agence de prestige met son manifeste, son histoire et ses biens sur un **fond bleu ciel**. C'est inattendu, gai, et ça reste chic parce que la typo (Caslon, centrée, aérée) est très classique.
  - Le formulaire « Request an appraisal » occupe un **bloc ocre plein**, avec un monogramme « A » au-dessus et des champs soulignés, sans cadre.
  - Les biens sont mis en page comme dans un magazine : un grand et trois petits, pas une grille uniforme.
- **À ne pas reprendre** : le panneau de recherche à filtres en surimpression sur le hero, et les portraits des directeurs (hors sujet pour nous).
- **Avec le grenat** : c'est **la preuve qu'une agence sérieuse peut vivre sur un aplat de couleur**. Pour nous : présentation et biens sur **aplat grenat**, texte crème en Caslon, puis bloc d'estimation en **rose poudré ou sable**, avec des champs soulignés.

### 10. Caso Patrimoine, Toulouse, Paris et Bordeaux
![Caso Patrimoine, desktop](captures/10-casopatrimoine-desktop.png)
Page complète : [10-casopatrimoine-full.png](captures/10-casopatrimoine-full.png). Mobile : [10-casopatrimoine-mobile.png](captures/10-casopatrimoine-mobile.png)

- **Profil** : **foncière familiale** et indépendante (Caroline et Sophie Monné), plus de 20 ans. Elle est propriétaire de ses immeubles et les loue elle-même. Ce n'est pas une agence, mais c'est un **site français, en français, au ton sérieux et beau**.
- **Biens affichés** : **29** locations dans un carrousel horizontal, avec des onglets Tous / Particuliers / Professionnels. Chaque carte donne le titre (type, m², quartier), le loyer avec la mention HC ou CC, la surface, un extrait, la ville et la mention « Direct bailleur ».
- **Palette** : **#f9f9f9**, **#e3e1d9** (pierre), **#a59e8c** (taupe, en aplat pour la section avis et l'encart « Vous possédez un immeuble ? »), noir **#151512**.
- **Typographies** : *PP Neue Montreal* (grotesque) en capitales pour les grands titres, *Reckless* (serif) pour la citation des dirigeantes.
- **Ce qui le rend beau** :
  - Un **titre en capitales grotesques, centré, sur quatre lignes** (« INVESTISSEUR IMMOBILIER DE CONFIANCE À TOULOUSE, PARIS ET BORDEAUX »), puis une **frise de photos d'architecture** qui déborde des deux côtés : cheminée haussmannienne, cour ronde vue en contre-plongée, balcons en fer forgé.
  - La citation est composée en grand, mi-grotesque mi-serif : « Nous allions tradition et modernité… ».
  - Les **quatre valeurs sont numérotées 01 à 04** en liste à filets, à la manière d'un sommaire.
  - L'encart propriétaire est un cartouche taupe posé à cheval sur deux photos d'immeubles.
- **Avec le grenat** : un **titre en capitales grotesques** plutôt qu'une serif, pour sortir du registre actuel. La **frise de détails d'architecture d'Asnières** (ferronneries, meulière, portes cochères) comme ouverture. Un encart « Vous vendez ? » en aplat grenat à cheval sur deux photos.

### 11. Artifact Property, Auckland
![Artifact, desktop](captures/11-artifact-desktop.png)
Page complète : [11-artifact-full.png](captures/11-artifact-full.png). Mobile : [11-artifact-mobile.png](captures/11-artifact-mobile.png)

- **Profil** : **promoteur** d'architecture contemporaine, deux associés nommés avec téléphone et e-mail. Ce n'est pas une agence ; il est retenu pour l'**aplat**.
- **Biens affichés** : **1 projet** (Exhibit on Jervois, six logements).
- **Palette** : **#ab6148 (terracotta) en aplat plein écran** sur toute la hauteur du hero, puis crème **#f0ebe5**, texte brun **#684b29**.
- **Typographies** : *Takt* (serif condensée, quasi machine à écrire) pour le logotype géant et les liens entre parenthèses, *Monument Grotesk* pour le texte.
- **Ce qui le rend beau** :
  - **Le nom de la maison, en très grand, sur un aplat de couleur.** « ARTIFACT© » occupe toute la largeur en bas de l'écran. Au-dessus, deux liens seulement : « (PROJECTS) » et « (PRACTICE) ».
  - Au défilement, la photo verticale d'un seul immeuble apparaît **au milieu de l'aplat**, comme une affiche.
  - Le contact se résume aux noms des associés, avec téléphone et e-mail.
- **Avec le grenat** : **la direction la plus radicale du corpus, et la plus facile à essayer**. Un aplat grenat plein écran, « CABINET RIMBAULT » en très grand dans une serif condensée crème, deux liens entre parenthèses (« (Nos biens) (Le cabinet) »), puis une photo de bien au centre.

### 12. Patrice Besse, Paris
![Patrice Besse, desktop](captures/12-patricebesse-desktop.png)
Page complète : [12-patricebesse-full.png](captures/12-patricebesse-full.png). Mobile : [12-patricebesse-mobile.png](captures/12-patricebesse-mobile.png)
*Le bandeau cookies ne propose que « J'accepte » : il reste visible. La page complète est courte, car l'accueil se résume à un carrousel.*

- **Profil** : agence de **bâtiments de caractère** (châteaux, hôtels particuliers, moulins, appartements), active depuis 1924, deux adresses à Paris.
- **Biens affichés** : **15** dans un carrousel unique : une photo, puis une légende de deux lignes centrée (« Au cœur de Paris… », puis un détail d'époque, de surface ou de terrain). **Aucun prix** sur l'accueil.
- **Palette** : blanc, gris chaud **#86807a** et **#59544e**. Le **logotype « B » est rouge**, **#c41230** relevé sur la capture (c'est une image, donc la valeur vient des pixels et non du CSS).
- **Typographies** : polices propriétaires (fichiers « boolfabe… » romain et italique). Le manifeste est en **italique serif**, en retrait sous un petit signe calligraphique.
- **Ce qui le rend beau** :
  - Le **manifeste** d'ouverture refuse le vocabulaire du luxe et parle « d'authenticité, de belles pierres ». Il est composé en italique comme une épigraphe.
  - Les **légendes de biens sont écrites comme des cartels de musée** : lieu, puis une phrase d'histoire, sans liste de caractéristiques.
- **À ne pas reprendre** : le carrousel unique (on ne voit qu'un bien à la fois) et le menu en capitales minuscules.
- **Avec le grenat** : le **logotype seul en grenat**, une lettre capitale dessinée. Et surtout le **ton des légendes** : « Rue de Colombes, au troisième sans ascenseur, un trois-pièces traversant et ses parquets d'origine. »

---

## 3. Hors immobilier : le rouge profond en grand

### 13. Hôtel Rochechouart, Paris 9e
![Hôtel Rochechouart, desktop](captures/13-hotelrochechouart-desktop.png)
Page complète : [13-hotelrochechouart-full.png](captures/13-hotelrochechouart-full.png). Mobile : [13-hotelrochechouart-mobile.png](captures/13-hotelrochechouart-mobile.png)

- **Profil** : hôtel Art déco (1929) du groupe Orso, boulevard de Rochechouart.
- **Palette** : fond **#fbf8ee** (crème), grenat **#984647** et **#8f3e3e** (bouton « Réserver », titres de rubrique, **pied de page en aplat grenat**), encre **#20221d**, rose pâle **#efe5e1**. Le grenat de la **façade photographiée** ressort aussi à **#984647** sur la capture.
- **Typographies** : *Adobe Caslon Pro* pour le texte, *Sweet Sans Pro* en capitales espacées pour les titres et libellés.
- **Ce qui le rend beau** :
  - **La devanture grenat est le hero.** La photo frontale de la façade (menuiseries rouges, enseigne « BAR – RESTAURANT », chaises bistrot) suffit à poser toute l'identité. La couleur du site est littéralement prise sur la façade.
  - Un **collage de photos d'archives et de cartes postales**, posées en désordre et légèrement tournées.
  - Les blocs alternent un cartouche blanc et une photo qui le chevauche.
  - Le pied de page est un aplat grenat avec un logo en écusson crème.
- **Avec le grenat** : **c'est notre modèle d'identité le plus direct.** Une photo frontale de la devanture grenat du cabinet en ouverture ; un grenat **pipetté sur la vraie peinture** de la façade ; un pied de page grenat ; un collage de photos d'Asnières d'hier et d'aujourd'hui pour la page « Le cabinet ».

### 14. Bouillon Julien, Paris 10e
![Bouillon Julien, desktop](captures/14-bouillonjulien-desktop.png)
Page complète : [14-bouillonjulien-full.png](captures/14-bouillonjulien-full.png). Mobile : [14-bouillonjulien-mobile.png](captures/14-bouillonjulien-mobile.png)

- **Profil** : bouillon Art nouveau historique, faubourg Saint-Denis.
- **Palette** : **#4a192c (aubergine-grenat très sombre)** en aplat pour l'en-tête et la bande newsletter, or **#bfa76e** pour le bouton et les filets.
- **Typographies** : *Amarante* (display Art nouveau) pour les titres, *Lato* pour le texte.
- **Ce qui le rend beau** : **les photos**. Les banquettes de velours bordeaux et les boiseries acajou sur fond de murs vert d'eau donnent un accord **grenat et vert céladon** très désirable. La mise en page reste basique (tuiles « Bon », « Beau », « Privatisations »).
- **Avec le grenat** : un **grenat presque prune (#4a192c) pour les grands aplats sombres** (en-tête, pied de page), qui fatigue moins qu'un grenat moyen. Et l'idée d'un **second ton vert d'eau** en contrepoint du grenat : c'est l'accord de la photo, pas du CSS.

### 15. Gallimard
![Gallimard, desktop](captures/15-gallimard-desktop.png)
Page complète : [15-gallimard-full.png](captures/15-gallimard-full.png). Mobile : [15-gallimard-mobile.png](captures/15-gallimard-mobile.png)

- **Profil** : maison d'édition.
- **Palette** : **#b71e27 (rouge sombre) en aplat pour tout le hero**, puis des aplats de rubrique : rose **#edd6e4**, vert **#456d6a**, orange **#e04f0a**, bleu **#0a3880** ; crème **#f3ebdf** pour le bloc d'histoire de la maison.
- **Typographies** : *Kepler* (serif) pour le texte et le logotype, *Sofia Pro Condensed* pour les titres.
- **Ce qui le rend beau** :
  - **Le hero rouge plein**, avec un livre et un portrait posés dessus et un **coin de page corné** en haut à droite (un triangle crème). Ce micro-détail renvoie à l'objet livre.
  - La section « Meilleures ventes » est sur **aplat bleu roi**, et les couvertures crème y ressortent comme des objets.
  - Le bloc « Gallimard » est en texte rouge sur fond crème.
- **Avec le grenat** : un **hero en aplat grenat sur lequel on pose le bien du moment** comme un objet (photo détourée ou cadrée, avec une ombre légère). Et un **micro-détail lié au métier** : un coin corné façon fiche d'annonce en vitrine, une étiquette de clé, un tampon « Vendu ».

### 16. Merci, Paris
![Merci, desktop](captures/16-merci-desktop.png)
Mobile : [16-merci-mobile.png](captures/16-merci-mobile.png). *La page complète ([16-merci-full.png](captures/16-merci-full.png)) est inexploitable : le contenu sous le hero ne s'est pas chargé.*

- **Profil** : concept store, 111 boulevard Beaumarchais.
- **Palette** : **#fffcf3** (crème) et **#bd0022** (rouge carmin), pas une couleur de plus. Le rouge sert au bandeau d'annonce, au logotype, aux titres posés sur la photo et à tout le texte.
- **Typographies** : *Merci Text* et *Merci Condensed* (polices propriétaires, une grotesque condensée grasse).
- **Ce qui le rend beau** : **le rouge sert d'encre et non de décor.** Les titres en grotesque condensée grasse rouge posés sur une photo très claire et douce (linge de lit blanc et rose) donnent un contraste chaleureux et urbain.
- **Avec le grenat** : la **direction « encre »**, où le grenat devient la couleur du texte (titres et liens) sur crème, dans une grotesque condensée. C'est l'opposé de la règle actuelle du brief (« jamais de mot en grenat dans un titre ») : à montrer au client pour qu'il voie l'effet.

### 17. Les Roches Rouges, Piana (Corse)
![Les Roches Rouges, desktop](captures/17-lesrochesrouges-desktop.png)
Page complète : [17-lesrochesrouges-full.png](captures/17-lesrochesrouges-full.png). Mobile : [17-lesrochesrouges-mobile.png](captures/17-lesrochesrouges-mobile.png)

- **Profil** : hôtel de 1912 au-dessus du golfe de Porto, tenu en famille.
- **Palette** : fond **#f1e4d8** (crème rosé), **#c15b44** (brique) pour l'en-tête, le pied de page, les titres et les boutons, texte **#90623f** (brun).
- **Typographies** : *Playfair Display* pour les titres, *Inter* pour le texte.
- **Ce qui le rend beau** : la **couleur a un sens** (le nom de l'hôtel, la roche rouge du paysage), et elle est **partout** sans que ce soit agressif, parce que le crème est rosé et le texte brun plutôt que noir. Une **aquarelle** de l'hôtel sert d'illustration d'ouverture.
- **Limite** : la mise en page est un gabarit hôtelier standard (texte et photo alternés). On le retient pour l'accord de couleurs, pas pour la structure.
- **Avec le grenat** : un **texte courant brun-grenat** (et pas noir) sur un crème rosé, pour que tout le site soit « dans la couleur ». Et une **aquarelle ou un dessin de la devanture** en ouverture, à la place d'une photo.

---

## 4. Sites écartés ou non vérifiables

| Site | Raison |
|---|---|
| aucoot.com, fantasticfrank.com, wilkinsongrant.co.uk, wetherell.co.uk | Page de vérification anti-robot (Cloudflare ou Vercel) : site non vu |
| architecture-de-collection.fr | Le nom de domaine ne répond pas |
| henry-realestate.com (repéré sur Siteinspire) | Délai de chargement dépassé deux fois |
| uniqueproperty.co.uk, deasypennerpodley.com, oscarproperties.com | Erreur SSL, ou redirection vers un site sans rapport, ou blocage |
| lagrandeepicerie.com, cartier.com, lebonmarche.com | « Access Denied » |
| estateseast.co.uk | Vu et capturé, puis **écarté** : c'est un nom commercial de Dexters (mention légale en pied de page), et le design est générique (Quicksand, tuiles) |
| espaces-atypiques.com, architectures-immobilier.com (ex-Ateliers Lofts) | Vus : réseaux, avec moteur à filtres et fenêtres surgissantes, hors sujet |
| esny.se, bresicwhitney, dijones, crosbydoe, lundin.se, perjansson.se, wrede.se, lurotbrand, rettie, bjurfors | Vus en repérage rapide (capture d'écran d'accueil seulement) : trop « réseau », chargés de moteurs, ou banals |
| Noble Rot, Quo Vadis, Verso, Seuil, Poilâne, Benoit, Shakespeare & Co, Actes Sud, Orso Hôtels, Bachaumont, Château Voltaire, Pushkin Press | Vus en repérage rapide : rouge absent, trop discret (Noble Rot #730b26 en simple touche) ou vif plutôt que profond (Seuil #e84632, Verso #eb0000) |

---

## 5. Synthèse : quatre directions visuelles

Les quatre directions sont volontairement **éloignées les unes des autres**. Les directions A et B sortent franchement du registre « crème + serif sobre ». C et D en sont des versions plus riches et plus abouties.

> Attention : A et B **contredisent des règles actuelles du brief** (grenat interdit dans les titres, un seul bouton grenat par écran, grenat réservé au logotype, à une action et au pied). Si le client en choisit une, il faudra réviser ces règles explicitement.

### A. « La Devanture » : le grenat en aplat dominant
**Ambiance** : le site prolonge la façade. On entre dans le rouge comme on pousse la porte de l'agence.
**Références** : Hôtel Rochechouart (13), Artifact (11), Gallimard (15), Abercrombys (09).
- **Place du grenat** : **dominante**. L'ouverture est un aplat grenat plein écran avec « Cabinet Rimbault » en très grand, en crème. La présentation et les biens restent sur grenat (comme le bleu d'Abercrombys), le pied de page aussi. Le crème sert aux textes et aux cartouches.
- **Typo** : une serif condensée ou à caractère, en display très grand (esprit Takt chez Artifact ou Souvenir chez Domus Nova), avec une Caslon ou une grotesque discrète pour le texte.
- **Biens** : chaque bien est posé sur le grenat **comme un objet** (photo cadrée avec une marge crème, à la manière du livre sur le rouge de Gallimard). Légende en crème : quartier, surface, prix. Les biens vendus portent un tampon.
- **Idée propre à la maison** : la **photo frontale de la devanture** en second écran, et le grenat pipetté sur la vraie peinture.

### B. « Carnet de quartier » : plusieurs aplats doux, le grenat comme encre
**Ambiance** : une agence de voisinage, gaie et cultivée, qui connaît chaque rue d'Asnières.
**Références** : Kvarteret Mäkleri (07), Modernist Estates (04), Urban Spaces (03), Merci (16).
- **Place du grenat** : **encre**. Les titres, les accroches et les liens sont en grenat, sur un **jeu de trois ou quatre aplats doux** (crème, rose poudré, sable, vert d'eau) qui changent à chaque section : Vente sur crème, Location sur rose, Estimer sur sable.
- **Typo** : une serif de labeur (Plantin, Sectra) pour les accroches centrées en grenat, et des étiquettes en petites capitales grasses (esprit Ginto) pour les statuts.
- **Biens** : grille de 3 colonnes façon notice de catalogue (étiquette de statut, nom, rue, surface, prix, « Voir »). Une section par usage (Vente, Location), chacune sur sa couleur.
- **Idée propre à la maison** : une **grille « Nos quartiers »** (Bécon, Quatre-Routes, centre, quais…) avec des photos prises par nous. Une forme tirée de la devanture (arcade, imposte) **utilisée comme masque photo**, à la manière du U d'Urban Spaces.

### C. « La Sélection » : catalogue éditorial
**Ambiance** : une petite revue d'architecture domestique ; chaque bien y est présenté comme un sujet d'article.
**Références** : Cuvelo (02), The Modern House (05), Patrice Besse (12), Domus Nova (06).
- **Place du grenat** : **touche**. Il apparaît au logotype (une lettre capitale dessinée, comme le « B » de Patrice Besse), dans l'étiquette de statut et dans **une bande pleine largeur** qui porte un avis client entre deux rangées de biens.
- **Typo** : une serif de labeur pour les titres et les légendes, et des capitales espacées pour les libellés.
- **Biens** : **un bien à la une en split** (photo aux deux tiers à fond perdu, fiche sur crème au tiers, comme chez Cuvelo), puis des rangées de trois. Les ventes réalisées ont le même poids visuel. **Les légendes sont écrites comme des cartels** : une phrase d'histoire, pas une liste de chiffres.
- **Idée propre à la maison** : un hero thématique (« Trois appartements à dix minutes de Saint-Lazare ») à la place d'un slogan. C'est la direction la plus proche du site actuel, mais en plus vivant.

### D. « Maison du Nord » : chaleur sourde et grand titre fin
**Ambiance** : calme, feutré, très architecturé ; on a envie d'y prendre un café.
**Références** : Tinholt (01), Caso Patrimoine (10), Historiska Hem (08), Bouillon Julien (14) pour la couleur sombre.
- **Place du grenat** : **aplat sombre**. Un grenat très foncé, presque prune (proche de **#4a192c**, Bouillon Julien), sert d'encre et de pied de page, comme le bleu nuit de Tinholt. Le fond est un taupe rosé (proche de **#ebe4de**), et non un crème jaune.
- **Typo** : une serif display **très fine** en grande taille (esprit Items chez Tinholt), sur deux colonnes de titres séparées par des filets, et une grotesque sobre pour le texte. En variante, des capitales grotesques centrées comme chez Caso Patrimoine.
- **Biens** : cartes avec un **bandeau de couleur sous la photo** (comme Historiska Hem), en prune avec le texte crème, et une étiquette d'état dans le coin (« Visite samedi », « Sous compromis »).
- **Idée propre à la maison** : un bloc « **Passez nous voir** » (adresse, horaires, café) posé sur une grande photo d'intérieur. Une **gravure au trait** d'un immeuble d'Asnières ou de la façade du cabinet comme illustration de marque, à la place d'un portrait.

---

## Annexe : méthode de capture

Le script Playwright est resté dans le scratchpad de session ; il n'est pas versionné. Pour chaque site :
1. il ouvre la page en 1440×900, avec la locale fr-FR et un user-agent de navigateur de bureau ;
2. il attend la fin du chargement réseau, plus 2,5 s ;
3. il cherche un bouton de **refus** de cookies et clique dessus (liste de libellés FR, EN, SV, DE, NL, NO, DA) ;
4. il masque par CSS les bandeaux de consentement connus restants, sans rien accepter ;
5. il prend la capture de l'écran, puis la page complète après un défilement progressif (pour charger les images différées), et enfin la vue mobile 390×844.

Les pages complètes ont ensuite été ramenées à 960 px de large pour alléger le dépôt.
