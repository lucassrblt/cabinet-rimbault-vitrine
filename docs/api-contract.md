# Contrat API vitrine ↔ admin

> Document de référence pour comparer les besoins du front (site vitrine) avec ce qui existe côté back (`cabinet-rimbault-admin`).
>
> Pour chaque route : **méthode, path, paramètres attendus, réponse attendue, page(s) du front qui consomme(nt), statut côté admin (à confirmer)**.
>
> **Objectif** : lister ce qui existe, ce qui manque, ce qui est à ajuster côté admin avant la mise en ligne.

---

## 1. Conventions générales

### Base URL et authentification

- **Base URL admin** : `{ADMIN_API_URL}/api/public` — variable d'env côté vitrine.
- **Authentification** : header `X-API-Key: {PUBLIC_API_KEY}`. Server-only (jamais exposé côté client).
- **Content-Type** : `application/json` sur les POST.

### Format de réponse

**Liste** :

```json
{
  "success": true,
  "count": 12,
  "total": 47,
  "offset": 0,
  "limit": 12,
  "filters": { "transactionType": "VENTE", "city": "Boulogne-Billancourt" },
  "data": [ /* Property[] */ ]
}
```

**Item** :

```json
{
  "success": true,
  "data": { /* Property */ }
}
```

**Erreur** (à confirmer côté admin, à uniformiser) :

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Property with reference XYZ not found"
  }
}
```

**Codes HTTP attendus** :
- `200` : OK
- `400` : paramètre invalide (format, plage)
- `401` / `403` : clé API invalide
- `404` : ressource introuvable (bien retiré/inexistant)
- `422` : validation échouée (formulaire lead)
- `429` : rate limit (à prévoir côté admin si pas encore)
- `500` : erreur serveur

### Cache et revalidation (côté vitrine)

| Entité | `revalidate` (secondes) | Tags Next.js |
|---|---|---|
| Liste biens (vente / location / search) | `60` | `properties`, `properties:sale`, `properties:rent` |
| Bien individuel | `60` | `property:<reference>` |
| Recent | `60` | `properties:recent` |
| Formulaire POST (lead) | `false` (pas de cache) | — |

**Règle** : le back doit pouvoir déclencher une revalidation (webhook ou purge de cache) quand un bien est publié / mis à jour / retiré. **À définir** : webhook `POST /api/revalidate` côté vitrine qui invalide les tags appropriés.

### Multi-valeurs dans les query params

Convention à confirmer avec le back : plusieurs valeurs pour un filtre multi-select (`propertyType`, `city`, `dpe`).

**Option retenue** : répétition du paramètre.

```
GET /properties?propertyType=APPARTEMENT&propertyType=MAISON&city=Boulogne-Billancourt&city=Neuilly-sur-Seine
```

Alternative rejetée : valeur CSV (`propertyType=APPARTEMENT,MAISON`) — plus ambigüe si les valeurs peuvent contenir des virgules.

---

## 2. Endpoints existants ou prévus (CDC §2)

### 2.1 — `GET /api/public/properties` — Recherche avancée

**Statut** : ✅ existe (consommé par `searchProperties` dans `src/lib/api/properties.ts`).

**Usage front** :
- `/acheter` — listing filtré par `?transactionType=VENTE`
- `/louer` — listing filtré par `?transactionType=LOCATION`
- `/acheter?commune=X` / `/louer?commune=X` — depuis le dropdown header, la home §4, `/a-propos` §4
- Bloc home "Biens récemment vendus/loués" (filtre `status`)
- Fiche bien — biens similaires (si pas d'endpoint dédié)

**Query params attendus** (union de ce qui est codé actuellement + gaps wireframes) :

| Param | Type | Multi | Obligatoire | Statut |
|---|---|---|---|---|
| `transactionType` | `VENTE` \| `LOCATION` \| `VIAGER` \| `LOCATION_SAISONNIERE` | Non | Non | ✅ existe |
| `propertyType` | enum `PropertyType` | **Oui** | Non | ❓ multi à vérifier |
| `city` | string | **Oui** | Non | ❓ multi à vérifier |
| `postalCode` | string | Oui | Non | ✅ existe |
| `minPrice` / `maxPrice` | number | Non | Non | ✅ existe |
| `minSurface` / `maxSurface` | number | Non | Non | ✅ existe |
| `minRooms` | number | Non | Non | 🆕 **à ajouter** (actuellement seulement `bedrooms`) |
| `bedrooms` | number | Non | Non | ✅ existe (à renommer `minBedrooms` ?) |
| `minFloor` | number | Non | Non | 🆕 **à ajouter** |
| `dpe` | enum `EnergyClass` | **Oui** | Non | 🆕 **à ajouter** |
| `hideEnergyFG` | boolean | Non | Non | 🆕 **à ajouter** (filtre loi Climat sur `/louer`) |
| `hasBalcony` | boolean | Non | Non | 🆕 **à ajouter** |
| `hasTerrace` | boolean | Non | Non | 🆕 **à ajouter** |
| `hasGarden` | boolean | Non | Non | 🆕 **à ajouter** |
| `isExclusive` | boolean | Non | Non | 🆕 **à ajouter** (pour `/acheter`) |
| `isFurnished` | boolean | Non | Non | 🆕 **à ajouter** (pour `/louer`) |
| `condition` | `NEW_RENOVATED` \| `GOOD` \| `TO_REFRESH` \| `TO_RENOVATE` | Non | Non | 🆕 **à ajouter** (état général) |
| `status` | enum `PropertyStatus` | Oui | Non | 🆕 **à ajouter** (pour bloc "Biens vendus" home) |
| `isPublished` | boolean | Non | Non (default `true`) | ❓ à confirmer (jamais exposer `isPublished=false` au public) |
| `sortBy` | `date` \| `price_asc` \| `price_desc` \| `rent_asc` \| `rent_desc` \| `surface_asc` \| `surface_desc` | Non | Non | ⚠ **à étendre** (actuellement seulement `date`, `price_asc`, `price_desc`) |
| `limit` | number (default `12`, max `50`) | Non | Non | ✅ existe |
| `offset` | number (default `0`) | Non | Non | ✅ existe |

**Réponse attendue** : `ApiListResponse<Property>` (cf. §1).

**Contraintes** :
- Par défaut, ne retourner **que les biens publiés** (`isPublished = true`).
- Par défaut, exclure les statuts `ARCHIVE` et `BROUILLON`.
- Les biens `VENDU` / `LOUE` doivent être retournables **uniquement si** explicitement demandés via `status=VENDU` ou `status=LOUE` (pour le bloc home "Biens vendus").

---

### 2.2 — `GET /api/public/properties/sale` — Liste biens à la vente

**Statut** : ✅ existe (consommé par `listSaleProperties`).

**Usage front** : raccourci vers `properties?transactionType=VENTE`.

**Question** : est-ce que cet endpoint est toujours utile, ou peut-on le déprécier au profit du `/properties` générique ? Côté vitrine on peut s'en passer. Garder si utilisé par ailleurs (portail externe ?).

**Query params** : `postalCode`, `city`, `limit` (cf. `ListFilters`). Minimaliste par rapport à `/properties`.

---

### 2.3 — `GET /api/public/properties/rent` — Liste biens à la location

**Statut** : ✅ existe. Mêmes remarques que 2.2 — versionner ou déprécier au profit de `/properties?transactionType=LOCATION`.

---

### 2.4 — `GET /api/public/properties/recent` — Biens récents

**Statut** : ✅ existe.

**Usage front** : bloc "Biens à la une" sur la home (section 2).

**Query params** : `limit` (default `6`).

**Contraintes** :
- Tri implicite par `publishedAt DESC` (ou `createdAt DESC` à défaut).
- Mix vente + location accepté — tri global chronologique.
- Exclure statuts `VENDU`, `LOUE`, `ARCHIVE`, `BROUILLON`.

**Réponse** : `ApiListResponse<Property>`.

---

### 2.5 — `GET /api/public/properties/[reference]` — Détail d'un bien

**Statut** : ✅ existe (consommé par `getPropertyByReference`).

**Usage front** : `/bien/[reference]` — la page la plus critique SEO.

**Path params** :
- `reference` : string URL-encodée.

**Réponse** : `ApiItemResponse<Property>`.

**404 attendu** si bien inexistant, archivé, ou non publié.

**⚠ Champs attendus mais absents du type `Property` actuel** :

| Champ | Besoin front | Statut |
|---|---|---|
| `copropriete.nbLots` | Section "Caractéristiques" — obligatoire ALUR pour vente | 🆕 **à ajouter au schéma Property** |
| `copropriete.chargesAnnuelles` | Idem | 🆕 **à ajouter** |
| `copropriete.procedureEnCours` | Idem | 🆕 **à ajouter** |
| `energy.depensesAnnuellesMin` / `Max` | Section DPE — mention obligatoire du coût estimé | 🆕 **à ajouter** (actuellement uniquement `energyClass` et `energyValue`) |
| `energy.dateReferenceEnergie` | Section DPE — mention obligatoire | 🆕 **à ajouter** |
| `finance.honorairesCharge` | Section Honoraires fiche bien — qui paie (`ACQUEREUR` \| `VENDEUR` \| `PARTAGE`) | ❓ à confirmer (existe peut-être sous un autre nom) |
| `finance.loyer` (distinct de `charges`) | Card `/louer` — loyer hors charges affiché séparément | ❓ à vérifier : actuellement `price` + `charges` (chargesIncluses bool). Préciser si `price` = loyer CC ou HC |
| `isFurnished` | Card `/louer` + filtre | 🆕 **à ajouter** |
| `condition` | Filtre "à rénover / bon état / neuf" `/acheter` | 🆕 **à ajouter** |
| `publishedAt` | Fiche bien — "Mis en ligne le [date]" | ✅ existe |
| `availableFrom` | Pertinent location (disponible à partir du) | 🆕 **à ajouter** (optionnel MVP, confort +) |

**Champs pour la carte de localisation approximative (cercle 500 m)** :
- `location.latitude` / `location.longitude` : ✅ existent. Ces coordonnées sont-elles celles de l'adresse exacte ou déjà "floutées" côté back ? **À clarifier** — l'approximation côté vitrine sera un cercle de 500 m autour de ces coordonnées, donc **il est préférable que le back livre les coordonnées exactes** (privacy gérée par le rendu vitrine).

---

### 2.6 — `POST /api/public/evaluation` — Soumission estimation

**Statut** : ✅ prévu (CDC §2). **Non wrappé côté vitrine** pour le moment.

**Usage front** : `/estimation` — soumission à l'étape 2.

**Body attendu** (schéma Zod côté vitrine, à aligner côté admin) :

```jsonc
{
  "property": {
    "address": "12 rue Victor Hugo",
    "city": "Boulogne-Billancourt",       // optionnel si déduit de l'address
    "postalCode": "92100",                 // optionnel
    "type": "APPARTEMENT",                 // enum PropertyType
    "surface": 75,                         // number (m²)
    "rooms": 3,                            // number
    "floor": 3,                            // number | null (si appartement)
    "constructionYear": 1975,              // number | null
    "exterior": ["BALCONY"],               // array<"BALCONY"|"TERRACE"|"GARDEN"|"NONE">
    "condition": "GOOD"                    // "NEW_RENOVATED"|"GOOD"|"TO_REFRESH"|"TO_RENOVATE"
  },
  "project": {
    "intent": "SELL",                      // "SELL"|"RENT_OUT"|"EXPLORATION"
    "timeframe": "3_TO_6_MONTHS"           // "UNDER_3_MONTHS"|"3_TO_6_MONTHS"|"6_TO_12_MONTHS"|"LATER_OR_UNDECIDED"
  },
  "contact": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "phone": "+33612345678",
    "email": "jean.dupont@example.com",
    "message": "texte libre optionnel"     // max 300 caractères
  },
  "consent": {
    "rgpd": true                           // obligatoire, rejeter si false
  },
  "meta": {
    "source": "vitrine",                   // origine du lead
    "userAgent": "...",                    // optionnel
    "referer": "https://..."               // optionnel
  }
}
```

**Réponse succès** (`200` ou `201`) :

```json
{
  "success": true,
  "data": {
    "id": "evaluation_abc123",
    "receivedAt": "2026-04-21T10:42:00Z"
  }
}
```

**Réponse erreur** (`422`) :

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid fields",
    "fields": {
      "contact.email": "Invalid email format",
      "consent.rgpd": "Consent is required"
    }
  }
}
```

**Contraintes côté admin** :
- Déclenchement d'une **notification agent** (email ou Slack — à définir opérationnellement).
- **Logging** du lead avec conservation ≤ 3 ans (conformité RGPD, cf. `agent-checklist.md` §11).
- **Anti-spam** : rate limit par IP, honeypot, reCAPTCHA v3 (au choix côté admin).

---

## 3. Endpoints à créer côté admin

### 3.1 — `POST /api/public/contact` 🆕 **À créer**

**Usage front** :
- `/contact` — formulaire typé générique (sélecteur de sujet)
- `/bien/[reference]` — formulaire "Demande de visite" contextuel (section 9)
- Bloc "Contact rapide" sur la home (section 8)

**Body attendu** :

```jsonc
{
  "subject": "BIEN_SALE",                  // "BIEN_SALE"|"BIEN_RENT"|"ESTIMATION"|"APPOINTMENT"|"OTHER"
  "propertyReference": "XYZ123",           // optionnel — renseigné si contact depuis /bien/[ref]
  "profile": "BUYER",                      // optionnel — "BUYER"|"INVESTOR"|"CURIOUS"|"TENANT"
  "financing": "APPROVED",                 // optionnel — "APPROVED"|"IN_PROGRESS"|"TO_STUDY"|"CASH"
  "visitAvailability": ["MORNING","SATURDAY"], // optionnel — multi
  "contact": {
    "firstName": "...",
    "lastName": "...",
    "phone": "...",
    "email": "...",
    "message": "..."                       // obligatoire — 500 caractères max
  },
  "consent": {
    "rgpd": true
  },
  "meta": {
    "source": "vitrine",
    "page": "/bien/XYZ123",                // URL d'origine du formulaire
    "userAgent": "...",
    "referer": "..."
  }
}
```

**Réponse** : identique à `/evaluation` (id de lead + receivedAt).

**Justification** : les wireframes `/contact` (formulaire typé) et `/bien/[reference]` (formulaire contextuel qualifié) partagent la même logique de capture lead, mais avec un champ `subject` différenciateur. Un seul endpoint pour les deux.

---

### 3.2 — `GET /api/public/properties/[reference]/similar` 🆕 **Optionnel, sinon dérivable**

**Usage front** : fiche bien — section 10 "Biens similaires" (3 biens max).

**Path params** : `reference`.

**Query params** :
- `limit` (default `3`).

**Comportement attendu côté back** :
Tri par similarité — algorithme simple :
1. Même `transactionType`
2. Même `city` > même `postalCode` > même `department`
3. Même `propertyType`
4. Prix ± 20 %
5. Surface ± 20 %

Exclure le bien lui-même et les statuts non vendables.

**Alternative sans nouvel endpoint** : le front peut appeler `/properties?transactionType=X&city=Y&propertyType=Z&limit=3` en passant les critères du bien courant. Fonctionne, mais logique dupliquée côté vitrine.

**Recommandation** : **créer l'endpoint dédié**. Plus propre, cache-friendly, et le tri par similarité peut être affiné côté admin sans déploiement vitrine.

---

### 3.3 — `POST /api/revalidate` 🆕 **À créer côté vitrine, déclenché par l'admin**

**Usage** : webhook **vitrine ← admin** pour invalider le cache Next.js quand un bien change.

**Body attendu** :

```jsonc
{
  "secret": "xxx",                         // partagé, env var
  "event": "property.published",           // "property.published"|"property.updated"|"property.unpublished"|"property.sold"|"property.rented"
  "reference": "XYZ123"
}
```

**Comportement vitrine** :
- Vérifie `secret`.
- Appelle `revalidateTag("property:<reference>")` + `revalidateTag("properties")` + tag pertinent (`properties:sale`, `properties:rent`, `properties:recent`).
- Répond `200 { success: true }`.

**Pas d'implémentation côté admin nécessaire** au-delà du POST sortant — simple webhook.

---

## 4. Données non-admin (sources externes ou statiques)

### 4.1 — Liste des communes couvertes

**Statut** : ❌ pas côté admin.

**Usage front** : header dropdown, home §4, `/a-propos` §4, options multi-select des filtres `/acheter` et `/louer`.

**Option retenue** : **fichier statique dans le repo vitrine** (ex. `src/lib/config/communes.ts`).

```ts
export const COMMUNES_COUVERTES = [
  { slug: "boulogne-billancourt", name: "Boulogne-Billancourt", postalCode: "92100" },
  // ...
] as const;
```

**Justification** :
- Liste très stable (rarement mise à jour).
- Pas de valeur ajoutée à la charger dynamiquement depuis l'admin.
- Permet d'enrichir côté vitrine (URL friendly, nom alternatif, description) sans polluer l'admin.

**Alternative** : endpoint `GET /api/public/communes` si le back veut centraliser. **Pas recommandé au MVP**.

### 4.2 — Infos agent (bio, chiffres clés)

**Statut** : ❌ pas côté admin.

**Usage front** : home section 3, `/a-propos` sections 1–4, `/contact`, footer.

**Option retenue** : **fichier statique dans le repo vitrine** (ex. `src/lib/config/agent.ts`).

```ts
export const AGENT = {
  firstName: "...",
  lastName: "...",
  phone: "+33...",
  email: "...",
  address: { street: "...", city: "...", postalCode: "..." },
  openingHours: { ... },
  stats: { yearsExperience: 0, transactions: 0, communesCount: 0 },
  bio: "...",
  portraitUrl: "/images/agent-portrait.jpg",
  social: { instagram: "...", linkedin: "...", googleBusiness: "..." },
  legal: { carteT: "...", cci: "...", garant: { name: "...", address: "..." }, rcs: "...", siret: "...", mediateur: "..." },
} as const;
```

**Justification** : cf. 4.1 — stable, pas besoin d'une table admin, et simplifie la collecte (cf. `agent-checklist.md`).

### 4.3 — Avis Google Business Profile

**Statut** : ❌ externe (Google Places API).

**Usage front** : home section 7, `/a-propos` section 5.

**Option retenue (recommandée)** : **fetch côté serveur vitrine** avec `Places API (New)` de Google Cloud, champ `reviews` + `rating` + `userRatingCount`.

**Alternatives** :
- **Admin proxy** : `GET /api/public/reviews` qui cache et relaie. Meilleur pour la revalidation et la maîtrise du quota Google. À considérer si l'admin devient central.
- **Scraping** : non — fragile, contraire aux ToS Google.

**Recommandation MVP** : fetch direct côté vitrine (server component + `revalidate: 3600`) pour ne pas complexifier l'admin. Migration possible en phase 2.

### 4.4 — Sitemap XML

**Statut** : à générer côté vitrine à partir de `GET /api/public/properties?limit=500&isPublished=true`.

Pas d'endpoint admin supplémentaire nécessaire. Juste augmenter la `limit` max si besoin (ou paginer).

---

## 5. Récapitulatif des gaps

### 🆕 Nouveaux endpoints à créer côté admin

| # | Endpoint | Criticité |
|---|---|---|
| 1 | `POST /api/public/contact` | **Haute** — sans ça, formulaires `/contact` et fiche bien non fonctionnels |
| 2 | `GET /api/public/properties/[reference]/similar` | Moyenne — contournable côté front |
| 3 | `POST /api/revalidate` (côté vitrine, webhook depuis admin) | Moyenne — améliore la fraîcheur, contournable avec `revalidate: 60` |

### ⚠ Endpoints existants à étendre

| Endpoint | Évolution | Criticité |
|---|---|---|
| `GET /properties` | Ajouter filtres : `status`, `minRooms`, `minFloor`, `dpe[]`, `hideEnergyFG`, `hasBalcony/Terrace/Garden`, `isExclusive`, `isFurnished`, `condition` | **Haute** — sans ça, les filtres wireframes sont amputés |
| `GET /properties` | Ajouter tri : `rent_asc`, `rent_desc`, `surface_asc`, `surface_desc` | Haute — `/louer` affiche des loyers, tri prix ne suffit pas |
| `GET /properties` | Supporter multi-valeurs (`propertyType`, `city`, `dpe`) par répétition de param | Haute |
| `POST /evaluation` | Aligner body avec schéma §2.6 | Haute |

### 🆕 Champs à ajouter sur le schéma `Property`

| Champ | Raison |
|---|---|
| `copropriete.nbLots`, `chargesAnnuelles`, `procedureEnCours` | Obligation ALUR vente |
| `energy.depensesAnnuellesMin/Max`, `dateReferenceEnergie` | Obligation DPE (arrêté 2021) |
| `finance.honorairesCharge` (enum `ACQUEREUR` \| `VENDEUR` \| `PARTAGE`) | Obligation Hoguet |
| `finance.loyer` et `finance.charges` distincts (pour LOCATION) | UX card `/louer` + conformité ALUR |
| `isFurnished` (boolean, pour LOCATION) | Filtre + card |
| `condition` (enum) | Filtre état général |
| `availableFrom` (date, optionnel) | Location — disponibilité future |

### ❓ Questions à poser à l'équipe admin

1. Le filtrage multi-valeurs (`propertyType`, `city`, `dpe`) est-il supporté ? Si oui, syntaxe (répétition vs CSV) ?
2. Le champ `bedrooms` dans `SearchFilters` est-il un minimum ou une égalité ? Renommer en `minBedrooms` pour clarifier.
3. `finance.price` en `LOCATION` : est-ce le loyer CC ou HC ? Documenter et rendre explicite.
4. La notification agent post-`evaluation` est-elle déjà câblée (email / Slack) ? Quel canal ?
5. Rate limiting : existe-t-il sur les endpoints publics ? Si non, prévoir avant mise en ligne.
6. `publishedAt` vs `createdAt` : lequel utiliser pour trier "Plus récents" ? Impact visible sur `/properties/recent` et `/acheter?sort=date`.
7. Les coordonnées GPS (`latitude`, `longitude`) sont-elles celles de l'adresse exacte ou déjà floutées ? Si exactes : **parfait** (le floutage se fait côté vitrine via un cercle 500 m).
8. Les endpoints `/properties/sale` et `/properties/rent` sont-ils conservés ? Si oui, les étendre avec les mêmes filtres que `/properties`. Sinon, les déprécier.

---

## 6. Tableau synoptique front → back

| Page vitrine | Endpoint(s) admin | Statut |
|---|---|---|
| Home — biens à la une | `GET /properties/recent?limit=6` | ✅ |
| Home — biens vendus | `GET /properties?status=VENDU&status=LOUE&limit=6` | ⚠ nécessite filtre `status` |
| Home — avis | Google Places (externe) | ❌ à intégrer |
| Home — contact rapide | `POST /contact` | 🆕 à créer |
| `/acheter` | `GET /properties?transactionType=VENTE&...filtres` | ⚠ extensions filtres |
| `/louer` | `GET /properties?transactionType=LOCATION&...filtres` | ⚠ extensions filtres + tri loyer |
| `/bien/[reference]` | `GET /properties/[reference]` | ✅ + champs à ajouter |
| `/bien/[reference]` — similaires | `GET /properties/[reference]/similar?limit=3` | 🆕 à créer (ou dérivable) |
| `/bien/[reference]` — demande visite | `POST /contact` | 🆕 à créer |
| `/vendre` | aucun appel API | ✅ statique |
| `/estimation` | `POST /evaluation` | ✅ prévu — wrappage côté vitrine à faire |
| `/a-propos` — avis | Google Places | ❌ à intégrer |
| `/contact` | `POST /contact` | 🆕 à créer |
| `/honoraires` | aucun appel API | ✅ statique |
| `/mentions-legales`, `/politique-de-confidentialite`, `/cookies` | aucun | ✅ statique |
| 404 | `GET /properties/recent?limit=3` (optionnel pour suggestions) | ✅ |
| `sitemap.xml` | `GET /properties?limit=500&isPublished=true` | ✅ (vérifier pagination) |

---

## 7. Prochaines étapes

1. **Partager ce doc** avec la team admin (`cabinet-rimbault-admin`).
2. Pour chaque ligne 🆕 / ⚠ : décision (créer / étendre / écarter) + estimation effort.
3. Mettre à jour ce document avec le statut réel de chaque endpoint (`✅ confirmé`, `🔄 en cours`, `✅ livré`).
4. Créer le wrapping côté vitrine (`src/lib/api/*.ts`) au fur et à mesure de la disponibilité.
5. Prévoir un environnement de **staging admin** pour tester les endpoints avant la mise en ligne vitrine.
