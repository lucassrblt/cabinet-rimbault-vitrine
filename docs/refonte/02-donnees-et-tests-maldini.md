# 02 — Données réelles et banc de test (Maldini)

Rédigé le 30/10/2026. Sources : `src/lib/api/*` (vitrine), `cabinet-rimbault-api/src/app/api/public/**`,
et des requêtes GET réelles (API locale `cabinet-rimbault-api` branchée sur la base de production,
même clé que `.env.local`). Aucun POST n'a été envoyé à l'API réelle.

## 1. Couche données de la vitrine

- `src/lib/api/client.ts` : `apiFetch(path, { revalidate = 300, tags })`, en-tête `X-API-Key`,
  `ApiConfigError` si une variable manque, `ApiError(status)` si la réponse n'est pas OK.
- `src/lib/api/properties.ts` : `getProperties()` (`/properties?limit=50`), `getProperty(ref)`
  (renvoie `null` sur 404), `getSimilarProperties(ref, 3)` (renvoie `[]` sur erreur).
- `src/lib/api/types.ts` : sous-ensemble typé. **Aucune fonction d'écriture n'existe encore**
  (estimation, contact) : à créer côté serveur (Server Action ou route handler) pour que la clé
  ne parte jamais au navigateur.
- Variables de `.env.local` (noms seulement) : `PUBLIC_API_URL`, `PUBLIC_API_KEY`,
  `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`.
  Attention : `PUBLIC_API_URL` pointe aujourd'hui sur `http://localhost:3002/api/public`
  (l'API locale, `npm run dev` dans `cabinet-rimbault-api`), pas sur Railway. Sans API locale
  lancée, toutes les pages qui lisent les biens tombent en erreur en dev.

## 2. Contrat de l'API publique (lecture)

| Route | Contenu | Défaut / max `limit` | Cache HTTP |
|---|---|---|---|
| `GET /properties` | liste filtrable, `{count,total,offset,limit,filters,data}` | 50 / 100 | 60 s |
| `GET /properties/sale` · `/rent` | liste par transaction | 50 / 100 | 60 s |
| `GET /properties/recent` | derniers biens | 5 / 20 | 60 s |
| `GET /properties/{ref}` | fiche complète (+ `documents`, `rooms_details`, `proximities`) | — | 300 s |
| `GET /properties/{ref}/similar` | jusqu'à `limit` biens proches | 3 / 10 | 300 s |

- Visibles : `isPublished` et statut `DISPONIBLE`, `SOUS_OFFRE` ou `SOUS_COMPROMIS`.
- Listes : **5 images maximum** par bien. Fiche : toutes les images.
- 401 sans clé ; 404 `{"success":false,"error":"Bien non trouvé"}` sur une référence inconnue.
- `GET /properties/{ref}` **incrémente le compteur de vues réel** : ne pas boucler dessus en test
  contre l'API réelle.
- L'API renvoie beaucoup plus de champs que `types.ts` (tout `amenities`, `energy`, ids internes,
  `viewCount`, `contactCount`, **`location.address` = adresse postale complète**). La vitrine ne
  doit jamais afficher l'adresse exacte (numéro de rue).

## 3. Contrat de l'API publique (écriture) — à respecter par les formulaires

### POST /evaluation (tunnel d'estimation)
Corps **à plat** : requis `propertyType`, `postalCode` (5 chiffres), `firstName`, `lastName`, `email`.
Optionnels : `address`, `surface`, `levels`, `rooms`, `bedrooms`, `bathrooms`, `constructionYear`,
`renovations`, `hasGarage`/`hasParking`, `hasPool`, `hasGarden`, `hasBalcony`, `hasTerrace`,
`situation` (`achat|vente|renseignement`), `phone`, `condition`
(`NEUF|TRES_BON_ETAT|BON_ETAT|A_RAFRAICHIR|A_RENOVER|A_RESTAURER`), `timeframe`, `intent`,
`message`, `rgpd` (booléen), `source`, `userAgent`, `referer`. Réponse 201 `{success,message,data:{id,createdAt}}`.
- Le RGPD **n'est pas bloquant côté API** pour l'estimation : la vitrine doit l'exiger elle-même.
- `propertyType` est une chaîne libre en base (on enverra les valeurs d'enum `APPARTEMENT`, `MAISON`).
- **Point bloquant pour la demande client** : la route envoie seulement un e-mail de confirmation
  au *demandeur* (Resend). **Aucune notification n'est envoyée à l'agent.** Il faut ajouter dans
  l'API un second envoi vers l'adresse de l'agence (`agencySettings.email`), ce qui est déjà prévu
  par le brief mais pas encore fait.
- Note client (`notes.txt`), lecture corrigée par le brief (A1) : les **trois** options
  « mise en vente envisagée », « mise en location envisagée » et « juste une idée de prix » sont
  retirées. Seul subsiste, à l'étape 1, le choix de la nature de l'estimation (« Le prix de vente »
  ou « Le loyer », `intent` = `ESTIMATION_VENTE` ou `ESTIMATION_LOYER`). `timeframe` n'est pas envoyé.

### POST /contact
Corps **imbriqué** (zod) : `subject` ∈ `BIEN_SALE|BIEN_RENT|ESTIMATION|APPOINTMENT|OTHER`,
`propertyReference?`, `profile?` ∈ `BUYER|INVESTOR|CURIOUS|TENANT`, `financing?` ∈
`APPROVED|IN_PROGRESS|TO_STUDY|CASH`, `visitAvailability?: string[]`,
`contact: {firstName, lastName, email, phone?, message (1 à 500 caractères)}`,
`consent: {rgpd: boolean}` (**422 `RGPD_REQUIRED` si false**), `meta?: {source, page, userAgent, referer}`.
Erreur 400 : `{success:false, error, fields: {"contact.email": "…"}}` — utilisable pour afficher
les erreurs champ par champ. Même remarque : pas de notification à l'agent.

## 4. Forme réelle des données (capture du 30/10/2026)

**5 biens publiés, tous en VENTE, tous des APPARTEMENTS, tous DISPONIBLES. 0 location.**
Créés entre le 18 et le 26/01/2026. Références : `09.345`, `10.131`, `10.130`, `10129`, `09.362`.

| Réf. | Ville (brute) | Prix | Surface | P./ch. | DPE/GES | Coûts énergie | Honoraires | Photos |
|---|---|---|---|---|---|---|---|---|
| 09.345 | Levallois-Perret | 280 000 | 35,65 | 2/1 | G/C | absents | 10 000 · 3,7 % · acquéreur | 5+ |
| 10.131 | Asnières-sur-Seine | 300 000 | 46,6 | 2/1 | D/B | absents | `-1` · vendeur | 4 |
| 10.130 | Asnières-sur-Seine | 375 000 | 59,5 | 3/2 | D/B | 830–1 190 € | `null` · vendeur | 4 |
| 10129 | Asnières-sur-Seine | 644 000 | 92,2 | 5/4 | D/B | 1 150–1 600 € | `null` · vendeur | 4 |
| 09.362 | **Asnieres**-sur-Seine | 198 000 | 33,16 | 1/0 | E/B | 200–600 € | 9 000 · 4,76 % · acquéreur | 4 |

Exemple (anonymisé, extrait) :

```json
{
  "reference": "10.131", "transactionType": "VENTE", "propertyType": "APPARTEMENT",
  "propertySubType": null, "status": "DISPONIBLE", "isExclusive": false,
  "title": "2 PIÈCES + 1 TERRASSE +1 PARKING + 1 CAVE",
  "shortDescription": null, "condition": null, "standing": null,
  "finance": { "price": 300000, "charges": 103.25, "chargesIncluses": false,
               "honoraires": -1, "honorairesPct": null, "honorairesType": "vendeur",
               "honorairesCharge": null, "taxeFonciere": 910 },
  "location": { "address": "[adresse masquée]", "city": "Asnières-sur-Seine",
                "postalCode": "92600", "neighborhood": "Impressionnistes" },
  "characteristics": { "surface": 46.6, "surfaceCarrez": null, "rooms": 2, "bedrooms": 1,
                       "floor": null, "totalFloors": 4, "yearBuilt": 2011 },
  "energy": { "energyClass": "D", "energyValue": 216, "gesClass": "B", "gesValue": 6,
              "annualEnergyCostMin": null, "annualEnergyCostMax": null,
              "dateReferenceEnergie": null,
              "dpeImageUrl": "https://…supabase.co/…/dpe.svg", "gesImageUrl": "…" },
  "copro": { "isInCopro": true, "coprLots": 44, "coprCharges": 1235, "coprProcedure": false },
  "images": [{ "url": "https://…supabase.co/storage/v1/object/public/property-files/…/1.jpg",
               "alt": "1", "order": 0, "isMain": true, "width": null, "height": null }]
}
```

## 5. Contraintes que les pages devront gérer

**Volume et contenu**
1. Catalogue minuscule (5 aujourd'hui, une dizaine visée) et **zéro location** : la page Location
   doit avoir un état vide digne (« aucun bien en location en ce moment » + lien estimation/contact),
   jamais une grille vide ni des biens inventés. Idem pour la vente si le catalogue tombe à 0.
2. Avec 1 à 3 biens, une grille 3 colonnes paraît creuse : la mise en page doit tenir avec 1, 2, 5 et 12 biens.
3. Les statuts `SOUS_OFFRE` / `SOUS_COMPROMIS` sont publiables : prévoir un libellé sobre.
4. `isExclusive` est rempli (2 biens) : mention « Exclusivité » possible ; `isFeatured` toujours `false`.

**Textes**
5. **Titres en MAJUSCULES** saisis par l'agent, avec des `+` (« 3 PIÈCES + 1 TERRASSE + 1 PARKING
   + 1 CAVE ») et parfois sans accents (« 2 PIECES ») : ne pas les afficher tels quels en grand titre.
   Recommandation : composer le titre affiché à partir des données (`rooms`, `propertyType`, `surface`,
   ville/quartier) et garder le titre saisi en sous-titre, en casse normale. Ne pas forcer
   `text-transform` sur des chaînes déjà en capitales.
6. **Descriptions sans retours à la ligne** (4 sur 5), segments séparés par « - » ou « -  », mots en
   capitales (« PARQUET, LUMINOSITE ! »), 650 à 1 000 caractères. Prévoir un rendu lisible
   (`white-space: pre-line`, découpage prudent sur « - » éventuellement) et une longueur de ligne maîtrisée.
7. `shortDescription` toujours `null` : ne pas en dépendre pour les cartes.
8. Quartier (`neighborhood`) rempli de façon hétérogène : `collange` (minuscule), `Gabriél Péri`
   (faute), `Impressionnistes`, `null`. Ville : `Asnieres-sur-Seine` sans accent sur un bien.
   Normaliser l'affichage (capitalisation) ou corriger à la source dans l'admin.
9. Incohérences de saisie à signaler à l'agent : 09.345 a `surface` 35,65 alors que la description
   dit 33,65 m² ; `surfaceCarrez` est toujours `null` alors que les descriptions citent la loi Carrez.

**Prix, honoraires, copropriété** (obligations légales)
10. `honorairesCharge` est **toujours `null`** ; l'information réelle est dans `honorairesType`
    en minuscules (`"acquereur"`, `"vendeur"`). `types.ts` doit être corrigé (`honorairesType` n'est
    pas un « type » libre mais la charge).
11. `honoraires` vaut `-1` (sentinelle) ou `null` quand ils sont à la charge du vendeur : ne jamais
    afficher « -1 € ». Cas acquéreur : prix FAI + « soit X € hors honoraires » + « honoraires de 4,76 %
    TTC à la charge de l'acquéreur » (note client). Le prix hors honoraires = `price - honoraires`
    (à valider : 280 000 − 10 000 = 270 000 ; 10 000/270 000 = 3,70 % → `price` est bien FAI).
12. Copropriété toujours renseignée (`isInCopro`, `coprLots`, `coprCharges` annuelles, `coprProcedure`) :
    afficher nombre de lots, charges annuelles et absence de procédure.
13. `taxeFonciere` remplie partout ; `charges` mensuelles remplies, `chargesIncluses` = false.

**Énergie**
14. DPE/GES toujours présents (`energyClass` D à G ; un bien en **G**), étiquettes SVG générées
    (`dpeImageUrl`, `gesImageUrl`, ~3 Ko, couleur `labelColor` = `#780000`).
15. **Coûts annuels absents sur 2 biens sur 5** (09.345, 10.131) et `dateReferenceEnergie` absente
    sur ces deux-là : la fiche doit gérer l'absence sans afficher « null € » (mention « non communiqué »
    ou rien, à arbitrer avec Zidane — c'est une mention légale obligatoire, cf. migration côté admin).
16. Prévoir `VIERGE` et `null` pour les classes.

**Photos**
17. 4 à 5 photos en liste (plafond API), JPEG de **2000×1500 (4:3)** pour la plupart, mais des
    **portraits 1500×2000** existent, y compris en photo principale (09.345). Poids 0,3 à 1,5 Mo.
    → recadrage `object-fit: cover` avec ratio fixe dans les cartes, `next/image` obligatoire
    (domaine Supabase déjà autorisé dans `next.config.ts`), `sizes` correct.
18. `width`/`height` toujours `null` en base : impossible de réserver le ratio réel, il faut un ratio
    imposé par le conteneur (`fill` + `aspect-ratio`).
19. `alt` = nom de fichier (« 1 », « IMG_3895 ») : inutilisable. Générer un alt depuis les données
    (« Appartement 2 pièces, Asnières-sur-Seine — photo 2 sur 4 »).
20. `isMain` = première image (`order` 0) partout ; trier quand même par `order`.
21. Un bien peut ne pas avoir de photo : prévoir un état sans image soigné (pas d'icône générique).

**Références et routes**
22. Les références contiennent des **points** (`10.131`) ou pas (`10129`). Une route `/biens/[ref]`
    doit fonctionner avec `10.131` (risque d'interprétation comme extension de fichier) : à tester
    explicitement. Toujours `encodeURIComponent` côté appel API.
23. `documents`, `rooms_details`, `proximities` vides sur la fiche capturée ; `amenities.*` presque
    tous `false` (seuls balcon/terrasse/jardin/parking/cave/ascenseur sont utilisés).
    Coordonnées GPS `null` : pas de carte précise possible (et non souhaitable).

## 6. Banc de test mis en place

Fichiers :
- `playwright.config.ts` — projets `desktop` (Chrome 1440×900) et `mobile` (profil iPhone 13 sur
  Chromium), `fr-FR`, Europe/Paris, traces et captures sur échec, 1 worker (le mock a un état partagé).
- `e2e/mock-api.mjs` — mock HTTP (port 3101) de `/api/public`.
- `e2e/mock-client.ts` — helpers `mock.reset`, `mock.scenario`, `mock.failNext`, `mock.requests`.
- `e2e/fixtures/properties.json`, `details.json` — capture réelle anonymisée (adresses masquées).
- `e2e/fixtures/edge-cases.json` — 7 biens **synthétiques** marqués `[FIXTURE SYNTHÉTIQUE]` :
  location meublée, bien sans photo ni DPE, maison hors copropriété sous compromis, titre et
  description très longs, plus l'archive : `TEST-VENDU-APPT` et `TEST-VENDU-MAISON` (VENDU),
  `TEST-LOUE-1` (LOUE), photos réelles du catalogue, prix et surfaces fictifs.
- `e2e/specs/00-smoke.spec.ts` — test fumée (accueil répond, mock enregistre un POST). Passe en
  desktop et mobile.

Lancement :
```bash
npm run test:e2e            # mock + next dev (port 3100) démarrés automatiquement
npm run test:e2e:desktop    # projet desktop seul
npm run test:e2e:ui         # mode interactif
npm run mock:api            # le mock seul, pour un dev manuel
```

**Comment la vitrine est pointée sur le mock** : le `webServer` Playwright lance `next dev --port 3100`
avec `PUBLIC_API_URL=http://127.0.0.1:3101/api/public` et `PUBLIC_API_KEY=e2e-test-key`. Les variables
du processus priment sur `.env.local`. Pour un dev manuel contre le mock :
`PUBLIC_API_URL=http://127.0.0.1:3101/api/public PUBLIC_API_KEY=e2e-test-key npm run dev`.

**Verrou Next 16** : `next dev` pose un verrou `<distDir>/lock` qui interdit deux serveurs sur le même
projet. `next.config.ts` lit donc `NEXT_DIST_DIR` (défaut `.next`) et le banc utilise `.next-e2e`
(ignoré par git). Les autres agents peuvent garder leur `next dev` ouvert pendant les tests.
`next dev` ajoute de lui-même `.next-e2e/types` dans `tsconfig.json` : c'est attendu.

**Mock** :
- POST `/evaluation` et `/contact` : jamais relayés. Validation identique à l'API réelle (400 / 422 /
  201) ; corps enregistrés, lisibles via `GET /__mock/requests?path=/evaluation`.
- GET `/properties/**` : fixtures (défaut) ou proxy lecture seule vers l'API réelle avec
  `MOCK_API_MODE=proxy REAL_API_URL=… REAL_API_KEY=…`.
- Scénarios (`POST /__mock/scenario`) : `default` (capture réelle), `empty` (0 bien), `error`
  (500 sur toutes les lectures), `edge` (réels + synthétiques).
- Statuts, comme l'API réelle : les listes (`/properties`, `sale`, `rent`, `recent`, `similar`)
  n'exposent par défaut que DISPONIBLE, SOUS_OFFRE et SOUS_COMPROMIS. `GET /properties?status=`
  (répétable) filtre sur VENDU et LOUE pour l'archive ; ARCHIVE, BROUILLON ou toute autre valeur
  renvoie 400. La fiche (et `similar`) d'un bien VENDU ou LOUE renvoie 404 « Bien non disponible ». `POST /__mock/fail-next` force une
  erreur sur le prochain envoi de formulaire.
- Limite : `apiFetch` met en cache les GET (`revalidate: 300`) dans le cache de données Next. Un
  changement de scénario peut être masqué par ce cache ; les tests de scénario devront soit
  utiliser des pages non mises en cache, soit tourner en séquence avec un serveur relancé. À trancher
  avec Xavi quand les pages existeront (une variable `E2E` qui force `revalidate: 0` serait le plus simple).

## 7. Stratégie de test de bout en bout prévue

Chaque spec démarre par `mock.reset`. Toutes les pages sont testées en desktop et mobile.

1. **Parcours et squelette** : chaque page de l'arborescence de Xavi répond 200, a un `<title>` et une
   meta description uniques, un seul `h1`, un header et un footer ; liens internes sans 404 (crawl
   depuis l'accueil) ; page 404 personnalisée ; `/biens/10.131` et `/biens/10129` fonctionnent ;
   référence inconnue → 404 propre.
2. **Annonces** : le nombre de cartes = nombre de biens du mock ; prix formaté `280 000 €` (espace
   insécable) ; aucune chaîne `null`, `undefined`, `NaN`, `-1 €` dans le DOM ; état vide (scénario
   `empty`) ; erreur API (scénario `error`) → message sobre, pas de crash ; absence de tout champ de
   recherche ou filtre (exigence client).
3. **Fiche bien** : DPE et GES visibles avec classe et valeur ; coûts énergie affichés quand présents,
   cas absent géré ; honoraires (acquéreur : prix hors honoraires + %, vendeur : mention) ; copropriété
   (lots, charges, procédure) ; galerie navigable clavier et tactile ; alts non vides et non numériques.
4. **Tunnel d'estimation** : parcours complet étape par étape ; validation (code postal 5 chiffres,
   e-mail, RGPD obligatoire) ; retour arrière sans perte ; **payload vérifié dans le mock**
   (champs, types, `rgpd: true`, `source`) ; message de succès ; erreur 500 simulée → message
   d'erreur et données conservées ; double clic → un seul envoi.
5. **Contact** : mêmes contrôles, structure imbriquée, `subject` correct selon la page d'origine,
   `propertyReference` présente depuis une fiche, limite 500 caractères.
6. **Légal et contenu** : footer avec carte T, garant, RCS, médiateur ; mentions légales, politique
   de confidentialité ; aucune photo de personne ; aucun texte factice (`lorem`, `TODO`, `xxx`).
7. **Qualité** : zéro erreur console et zéro `pageerror` ; pas de défilement horizontal à 375 px ;
   axe-core (à ajouter : `@axe-core/playwright`) sans violation sérieuse ; `prefers-reduced-motion`
   respecté (animations d'Iniesta coupées) ; navigation clavier et focus visible ; images servies via
   `/_next/image`.
8. **Régression visuelle** (en fin de projet) : captures de référence par page et par projet.
