# Contrat API vitrine ↔ admin

> Document de référence pour comparer les besoins du front (site vitrine) avec ce qui existe côté back (`cabinet-rimbault-admin`).
>
> Pour chaque route : **méthode, path, paramètres attendus, réponse attendue, page(s) du front qui consomme(nt), statut côté admin**.
>
> **Objectif** : lister ce qui existe, ce qui manque, ce qui est à ajuster côté admin avant la mise en ligne.

## État des lieux — audit du 2026-04-21

Repo admin audité : `/Users/lucasrimbault/Desktop/dev/cr/cabinet-rimbault-admin`.

**Synthèse** :
- ✅ **6 endpoints publics existent** (`/properties`, `/properties/sale`, `/properties/rent`, `/properties/recent`, `/properties/[reference]`, `POST /evaluation`) — auth par header `X-API-Key`.
- ✅ **Modèle Prisma riche** : champs `condition`, `isExclusive`, `isFurnished`, `copro.*` (nbLots, charges, procédure), `energy.annualEnergyCostMin/Max` **déjà présents**. Plusieurs gaps supposés initialement n'en sont finalement pas.
- ⚠ **Filtres de recherche pauvres** : les champs existent en base mais ne sont pas exposés comme query params. L'essentiel du travail côté admin est de brancher des filtres supplémentaires, pas de modifier le schéma.
- ⚠ **`POST /evaluation` déphasé** : schéma plat côté admin vs schéma imbriqué rédigé initialement dans ce doc. À aligner (voir §2.6).
- ❌ **`POST /contact` absent** — bloque les formulaires `/contact` et fiche bien.
- ❌ **Format d'erreur non standardisé** côté admin : `{ success: false, error: "string" }` au lieu de `{ error: { code, message, fields } }`.
- ❌ **Pas de rate limiting** sur les endpoints publics.
- ❌ **Pas de webhook de revalidation** admin → vitrine.

**Fichiers clés côté admin** :
- Routes : `src/app/api/public/`
- Auth : `src/lib/api-public-auth.ts` (middleware `withPublicApiAuth`)
- Helpers : `src/lib/api-public-helpers.ts` (sanitization, include, where clause visibilité)
- Schéma : `prisma/schema.prisma`

---

## Principes d'évolution — ne pas casser l'admin

⚠ **L'API publique partage le schéma Prisma avec le back-office admin**. Toute évolution doit être pensée pour **ne pas casser** :
- Les consommateurs existants de l'API publique (autres intégrations éventuelles, notamment portails immo).
- L'UI admin qui lit/écrit les mêmes modèles Prisma.
- Les données existantes en base.

### Matrice de risque

| Tag | Signification | Exemples |
|---|---|---|
| ✅ **SAFE (additif)** | Ajout qui n'impacte aucun code existant | Nouvel endpoint, nouveau champ optionnel en sortie, nouveau query param optionnel, nouvelle valeur d'enum **acceptée en entrée** sans l'imposer |
| ⚠ **CAREFUL** | Changement non-bloquant mais à coordonner | Changement de valeur par défaut, changement de tri implicite, ajout d'un rate limit généreux, déprécation documentée |
| 🔴 **BREAKING** | Casse un consumer si appliqué tel quel | Renommer un param/champ, typer strictement un champ libre, ajouter un champ requis sans défaut, changer la forme d'une réponse, supprimer un endpoint |

### Règles d'or pour cette API

1. **Préférer ajouter plutôt que modifier**. Si besoin d'un nouveau comportement, créer un nouveau param ou un nouvel endpoint plutôt que changer l'existant.
2. **Ne jamais changer la sémantique d'un param existant** (ex. `bedrooms` en `=` vs `>=`).
3. **Ne jamais supprimer un champ de réponse** sans passer par une phase de déprécation (warning dans la doc + garder le champ rempli un temps).
4. **Nouveaux champs optionnels only** : pas de nouveau champ requis sur `POST /evaluation` sauf s'il remplace un existant **avec valeur par défaut** côté admin pour rétro-compat.
5. **Nouveaux enums** : si on convertit un champ String en enum, garder le champ String, ajouter un champ enum parallèle (`honorairesType` String → ajouter `honorairesCharge` enum).
6. **Multi-valeurs** : la bascule `searchParams.get('city')` → `searchParams.getAll('city')` est rétro-compatible (retourne `[singleValue]` si un seul, `[]` si absent). **Safe si bien testée**.

### Zones à ne pas toucher

Les éléments suivants sont **consommés par la vitrine existante** (déjà codée) ou par l'admin lui-même. Toute modification = risque de régression :

| Élément | Raison |
|---|---|
| Sémantique de `searchParams.get('bedrooms')` (`>=` filter) | Utilisé par `listSaleProperties`, `listRentProperties`, `searchProperties` côté vitrine. Renommer en `minBedrooms` = breaking. Alternative : ajouter `minBedrooms` comme alias et documenter. |
| Valeur `honorairesType` typée String libre | Données existantes probablement pas normalisées. Convertir en enum casse les données et l'UI admin qui écrit ce champ. |
| Format de réponse `{ success, count, total, offset, limit, filters, data }` | Tous les wrappers vitrine s'attendent à cette forme. |
| Format d'erreur `{ success: false, error: "string" }` | Parsé tel quel par la vitrine. Changer = breaking. Alternative : enrichir avec champs optionnels sans retirer `error`. |
| Comportement par défaut de `/properties/recent` (tri, limit) | Déjà utilisé par la home vitrine. |
| Endpoints `/properties/sale` et `/properties/rent` | Wrappés dans `src/lib/api/properties.ts` (`listSaleProperties`, `listRentProperties`). Peuvent être dépréciés à terme mais **pas supprimés** tant que la vitrine les utilise. |
| Visibilité implicite de `/properties` (statuts `DISPONIBLE`, `SOUS_OFFRE`, `SOUS_COMPROMIS`) | Si on change le comportement par défaut, la vitrine affiche soudainement des biens qu'elle n'attend pas (ou inversement). Rendre l'opt-in explicite via **nouveau** param `status` sans toucher au comportement par défaut. |
| Clé de cache Next.js vitrine (tags `properties`, `property:<ref>`) | Ne pas renommer les endpoints. |

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

**Query params — audit côté admin** (source : `src/app/api/public/properties/route.ts` côté admin) :

| Param | Type | Multi | Statut admin | Action |
|---|---|---|---|---|
| `transactionType` | `VENTE` \| `LOCATION` \| `VIAGER` \| `LOCATION_SAISONNIERE` | Non | ✅ existe | — |
| `propertyType` | enum `PropertyType` | Non | ✅ existe mais **mono-valeur** | ⚠ ajouter support multi (répétition de param) |
| `city` | string | Non | ✅ (match insensitive contains) | ⚠ ajouter support multi |
| `postalCode` | string | Non | ✅ (match exact) | — |
| `minPrice` / `maxPrice` | number | Non | ✅ existe | — |
| `minSurface` / `maxSurface` | number | Non | ✅ existe | — |
| `bedrooms` | number (min) | Non | ✅ existe (sémantique `>=`) | ⚠ renommer `minBedrooms` pour lever l'ambiguïté |
| `minRooms` | number | Non | ❌ absent | 🆕 **à ajouter** |
| `minFloor` | number | Non | ❌ absent | 🆕 **à ajouter** |
| `dpe` | enum `EnergyClass` | **Oui** | ❌ absent | 🆕 **à ajouter** (multi) |
| `hideEnergyFG` | boolean | Non | ❌ absent | 🆕 **à ajouter** — équivalent `dpe=A&dpe=B&...&dpe=E` |
| `hasBalcony` | boolean | Non | ❌ absent | 🆕 **à ajouter** (champ existe en base : `amenities.hasBalcony`) |
| `hasTerrace` | boolean | Non | ❌ absent | 🆕 **à ajouter** (idem) |
| `hasGarden` | boolean | Non | ❌ absent | 🆕 **à ajouter** (idem) |
| `isExclusive` | boolean | Non | ❌ absent comme filtre (champ présent en réponse) | 🆕 **à ajouter** comme filtre |
| `isFurnished` | boolean | Non | ❌ absent (champ en base : `amenities.isFurnished`) | 🆕 **à ajouter** |
| `condition` | enum `PropertyCondition` | Non | ❌ absent (champ en base) | 🆕 **à ajouter** |
| `status` | enum `PropertyStatus` | Oui | ❌ absent (filtre implicite seulement) | 🆕 **à ajouter** — bloque le bloc home "Biens vendus" |
| `sortBy` | voir ci-dessous | Non | ✅ `date`, `price_asc`, `price_desc` | ⚠ ajouter `rent_asc`, `rent_desc`, `surface_asc`, `surface_desc` |
| `limit` | number | Non | ✅ default `50`, max `100` | — (à confirmer avec le front qui attendait default `12`) |
| `offset` | number | Non | ✅ default `0` | — |

**⚠ Valeurs de `condition` : enum FR côté admin** (Prisma), pas EN comme initialement supposé :
`NEUF | TRES_BON_ETAT | BON_ETAT | A_RAFRAICHIR | A_RENOVER | A_RESTAURER` (6 valeurs).

**Réponse confirmée** (admin route.ts:114-132) :

```json
{
  "success": true,
  "count": 12,
  "total": 47,
  "offset": 0,
  "limit": 12,
  "filters": { "transactionType": "VENTE", "…": "…" },
  "data": [ /* Property[] sanitized */ ]
}
```

**Contraintes confirmées côté admin** :
- Par défaut, filtre implicite : `isPublished = true` + `status ∈ [DISPONIBLE, SOUS_OFFRE, SOUS_COMPROMIS]` via `getPublicPropertiesWhere()`.
- `ARCHIVE` et `BROUILLON` toujours exclus.
- `VENDU` / `LOUE` **actuellement jamais retournés** — nécessite l'ajout du filtre `status` explicite côté admin pour le bloc home "Biens vendus".
- Sanitization : `internalNotes`, `userId`, `user` retirés de la réponse.
- Images : **5 premières** par bien, triées par `order`.

---

### 2.2 — `GET /api/public/properties/sale` — Liste biens à la vente

**Statut admin** : ✅ existe. Raccourci vers `transactionType=VENTE`.

**Query params admin** : `postalCode`, `city`, `limit` (max 100). Tri figé `createdAt DESC`.

**⚠ Réponse différente du `/properties`** : **pas de `total`, `offset`, `limit`** dans la réponse (seulement `success`, `count`, `filters`, `data`).

**Décision recommandée** : **déprécier** au profit de `/properties?transactionType=VENTE`. Le front n'a pas besoin des deux, et la version générique offre les filtres étendus.

---

### 2.3 — `GET /api/public/properties/rent` — Liste biens à la location

**Statut admin** : ✅ existe. Mêmes remarques que 2.2.

**Décision recommandée** : idem — déprécier au profit de `/properties?transactionType=LOCATION`.

---

### 2.4 — `GET /api/public/properties/recent` — Biens récents

**Statut admin** : ✅ existe.

**Usage front** : bloc "Biens à la une" sur la home (section 2).

**Query params admin** : `limit` (default **5**, max **20**). ⚠ Le front wireframe affiche 6 biens — soit ajuster le wireframe à 5/8, soit augmenter la default admin.

**Tri admin** : `createdAt DESC` (⚠ pas `publishedAt`). À confirmer que c'est le comportement voulu ; `publishedAt DESC` serait plus pertinent (un bien créé en brouillon puis publié tard ressort mal avec `createdAt`).

**Filtres implicites admin** : exclut `ARCHIVE` et `BROUILLON` (cohérent).

**Réponse admin** (sans pagination) :

```json
{
  "success": true,
  "count": 5,
  "data": [ /* Property[] */ ]
}
```

---

### 2.5 — `GET /api/public/properties/[reference]` — Détail d'un bien

**Statut admin** : ✅ existe (consommé par `getPropertyByReference`).

**Usage front** : `/bien/[reference]` — la page la plus critique SEO.

**Path params** :
- `reference` : string URL-encodée.

**Visibilité admin confirmée** : 404 si non trouvé, `!isPublished`, ou `status ∉ [DISPONIBLE, SOUS_OFFRE, SOUS_COMPROMIS]`.

**Side effect** : incrémente `viewCount` en async non bloquant.

**Réponse succès** : `{ success: true, data: Property }`.

**Réponse 404** :

```json
{
  "success": false,
  "error": "Bien non trouvé" | "Bien non disponible"
}
```

**Inclus dans la réponse détail** (vs liste) : `documents`, `rooms_details`, `proximities`.

**⚠ Champs — audit côté admin** :

| Champ front | Présent admin ? | Source |
|---|---|---|
| `copro.coprLots` (nb lots copropriété) | ✅ existe | Prisma `PropertyCopro` |
| `copro.coprCharges` (charges annuelles) | ✅ existe | idem |
| `copro.coprProcedure` (procédure en cours) | ✅ existe | idem |
| `copro.isInCopro`, `coprChargesDetails`, `coprSyndic`, `lotNumber`, `tantieme` | ✅ existe (bonus) | idem |
| `energy.annualEnergyCostMin` / `Max` | ✅ existe | `PropertyEnergy` |
| `energy.dateReferenceEnergie` | ❌ absent | à ajouter — obligation arrêté 2021 |
| `energy.dpeDate` | ✅ existe (peut servir de fallback pour `dateReferenceEnergie`) | `PropertyEnergy` |
| `finance.honorairesCharge` (enum `ACQUEREUR` \| `VENDEUR` \| `PARTAGE`) | ⚠ partiel : champ `honorairesType` existe mais typé **String libre** | à convertir en enum |
| `finance.loyer` distinct de `charges` | ⚠ ambigu : `finance.price` + `finance.charges` + `finance.chargesIncluses` bool. | **À documenter** : `price` pour LOCATION = loyer CC ou HC selon `chargesIncluses` ? |
| `isFurnished` | ✅ existe dans `amenities` (pas à la racine) | `PropertyAmenities.isFurnished` |
| `condition` | ✅ existe à la racine Property | enum `PropertyCondition` |
| `isExclusive` | ✅ existe à la racine Property | — |
| `publishedAt` | ✅ existe | — |
| `availableFrom` | ✅ existe (bonus) | à confirmer type (date ?) |

**Coordonnées GPS** : `location.latitude` / `longitude` existent, type `Float?`. **Probablement coordonnées exactes** (non floutées côté back). **À confirmer** avec la team admin — si exactes, parfait pour faire l'approximation cercle 500 m côté vitrine.

---

### 2.6 — `POST /api/public/evaluation` — Soumission estimation

**Statut admin** : ✅ existe (`src/app/api/public/evaluation/route.ts`). **Non wrappé côté vitrine** pour le moment.

**Usage front** : `/estimation` — soumission à l'étape 2.

#### Schéma actuel côté admin (source de vérité)

Structure **plate**, validation partielle. Champs attendus dans le body :

| Champ | Type | Requis admin | Validation |
|---|---|---|---|
| `propertyType` | string | ✅ | libre (pas enum) |
| `postalCode` | string | ✅ | regex `^\d{5}$` |
| `address` | string | — | libre |
| `surface` | number | — | libre |
| `levels` | number | — | libre |
| `rooms` | number | — | libre |
| `bedrooms` | number | — | libre |
| `bathrooms` | number | — | libre |
| `constructionYear` | number | — | libre |
| `renovations` | string | — | libre |
| `hasGarage` / `hasParking` | boolean | — | — |
| `hasPool` / `hasGarden` / `hasBalcony` / `hasTerrace` | boolean | — | — |
| `situation` | string | — | mappé : `achat` → `ACHAT`, `vente` → `VENTE`, `renseignement` → `RENSEIGNEMENT` |
| `firstName` | string | ✅ | libre |
| `lastName` | string | ✅ | libre |
| `email` | string | ✅ | regex email standard |
| `phone` | string | — | libre |

**Réponse succès (201)** :

```json
{
  "success": true,
  "message": "Votre demande d'estimation a été enregistrée avec succès",
  "data": { "id": "evaluation_...", "createdAt": "2026-04-21T..." }
}
```

**Réponse erreur (400/422)** :

```json
{
  "success": false,
  "error": "Le champ X est requis",
  "details": "..."  // en dev uniquement
}
```

#### Décalages vs besoins front (wireframes `/estimation`)

| Besoin front (wireframes) | Admin | Action |
|---|---|---|
| Structure **imbriquée** (`property`, `project`, `contact`, `consent`, `meta`) | **Plate** | 2 options (voir ci-dessous) |
| `condition` (état général, 6 valeurs enum FR) | ❌ absent | 🆕 ajouter côté admin |
| `exterior` (multi-check Balcon/Terrasse/Jardin) | ✅ équivalent : `hasBalcony`, `hasTerrace`, `hasGarden` (flat) | — |
| `project.timeframe` (délai envisagé) | ❌ absent | 🆕 ajouter côté admin |
| `project.intent` (vendre / louer / idée) | ⚠ existe via `situation` mais 3 valeurs qui ne correspondent pas (`ACHAT`, `VENTE`, `RENSEIGNEMENT`). Le front distingue "vendre" vs "mettre en location" — `situation` ne porte pas cette nuance. | 🆕 élargir l'enum côté admin ou introduire champ `intent` distinct |
| `contact.message` (texte libre optionnel) | ❌ absent | 🆕 ajouter côté admin |
| `consent.rgpd` (obligatoire) | ❌ absent — **bloquant RGPD** | 🆕 ajouter et rejeter si `false` |
| `meta.source`, `meta.userAgent`, `meta.referer` | ❌ absent | 🆕 ajouter côté admin (attribution / debug) |
| Format erreur `{ error: { code, fields } }` | ⚠ `{ error: "string" }` | à standardiser |

#### Alignement recommandé

**Option A** — aligner l'admin sur le contrat imbriqué proposé au §2.6 initial (body imbriqué).
- ✅ propre côté front (Zod structuré).
- ❌ casse les clients existants (s'il y en a).

**Option B** — garder la structure plate côté admin, aligner le front dessus (mapping Zod).
- ✅ pas de breaking change.
- ❌ perte de structure, le front fait du mapping.
- 🆕 quand même ajouter les champs manquants : `condition`, `timeframe`, `intent` élargi, `message`, `rgpd` consent.

**Recommandation** : **Option B** (pragmatique) + ajouts obligatoires côté admin. Éviter un refactoring cosmétique alors que la vitrine n'est pas encore en prod.

#### Contraintes côté admin à vérifier

- [ ] **Notification agent** post-submit (email / Slack) : câblée ou pas ?
- [ ] **Logging** du lead avec conservation ≤ 3 ans (RGPD).
- [ ] **Anti-spam** : rate limit par IP, honeypot, ou reCAPTCHA v3.
- [ ] **Rate limiting** général (absent à l'audit).

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

## 5. Récapitulatif des gaps (post-audit, **annoté par risque**)

### 5.1 — Nouveaux endpoints à créer (tous ✅ SAFE)

Les endpoints qui n'existent pas ne peuvent rien casser — création pure.

| # | Endpoint | Risque | Criticité front | Détails |
|---|---|---|---|---|
| 1 | `POST /api/public/contact` | ✅ SAFE | **🔴 Bloquant** | Schéma détaillé §3.1. Aucun impact admin. Notification agent à prévoir (email / Slack). |
| 2 | `GET /api/public/properties/[reference]/similar` | ✅ SAFE | 🟡 Contournable | Schéma §3.2. Contournable côté front avec `/properties?...`, mais duplication de logique. |
| 3 | `POST /api/revalidate` côté **vitrine** (pas admin) | ✅ SAFE | 🟢 Non bloquant | Webhook entrant côté vitrine, l'admin envoie juste un POST. Fallback `revalidate: 60` suffit pour MVP. |

### 5.2 — Extensions `GET /properties` (majoritairement ✅ SAFE si bien faites)

Les nouveaux filtres sont des query params **optionnels** avec default = pas de filtre. Aucune modification du comportement existant.

| Évolution | Risque | Implémentation non-breaking |
|---|---|---|
| Ajouter filtres `status[]`, `minRooms`, `minFloor`, `dpe[]`, `hasBalcony`, `hasTerrace`, `hasGarden`, `isExclusive`, `isFurnished`, `condition` | ✅ SAFE | Nouveaux params optionnels. Si absents, comportement identique à aujourd'hui. |
| Ajouter filtre `hideEnergyFG` | ✅ SAFE | Boolean optionnel. Équivaut à `dpe=A&dpe=B&...&dpe=E`. Pur sucre syntaxique côté admin. |
| Ajouter tris `rent_asc/desc`, `surface_asc/desc` | ✅ SAFE | Nouvelles valeurs acceptées dans `sortBy`. Les valeurs existantes (`date`, `price_asc`, `price_desc`) restent valides. |
| Supporter multi-valeurs (`propertyType`, `city`, `dpe`, `status`) | ⚠ CAREFUL | Migration `.get('city')` → `.getAll('city')` **rétro-compatible** si bien faite (une valeur unique retourne `[value]`). **Tester**. Alternative : syntaxe CSV (`city=A,B`) sans toucher `.get()`. |
| Filtre `status` autorisant `VENDU`/`LOUE` | ⚠ CAREFUL | Actuellement filtré via `getPublicPropertiesWhere()`. Ne pas modifier le comportement par défaut (garder exclusion implicite). **Ajouter** `status` en override explicite uniquement via query param. |
| ~~Renommer `bedrooms` en `minBedrooms`~~ | 🔴 BREAKING | **À éviter**. Alternative : **garder `bedrooms`**, ajouter `minBedrooms` comme alias, documenter que les deux fonctionnent à l'identique, privilégier `minBedrooms` pour les nouveaux clients. |

### 5.3 — `POST /evaluation` : ajouter sans restructurer

**Ne pas** restructurer en body imbriqué (casse les clients existants). Garder la structure plate et **ajouter des champs optionnels**.

| Évolution | Risque | Implémentation |
|---|---|---|
| Ajouter `condition` (enum FR) optionnel | ✅ SAFE | Nouveau champ optionnel. |
| Ajouter `timeframe` optionnel | ✅ SAFE | Nouveau champ optionnel. |
| Ajouter `message` (texte libre) optionnel | ✅ SAFE | Nouveau champ optionnel. |
| Ajouter `source`, `userAgent`, `referer` optionnels | ✅ SAFE | Nouveaux champs. |
| Élargir `situation` pour distinguer vente / location / renseignement | ⚠ CAREFUL | Les valeurs admin actuelles (`achat`, `vente`, `renseignement`) couvrent partiellement. **Option non-breaking** : ajouter un nouveau champ `intent` (`SELL`, `RENT_OUT`, `EXPLORATION`) sans modifier `situation`. Conserver les deux. |
| Ajouter `rgpd` consent | 🔴 BREAKING si requis | **Option recommandée** : ajouter le champ **optionnel** côté admin (pour ne pas casser), puis **rendre obligatoire côté vitrine** (Zod validation front). L'admin reçoit toujours `rgpd: true` depuis la vitrine. Un ancien client qui ne l'envoie pas continue de passer. |

### 5.4 — `GET /properties/recent` : ne pas toucher le défaut

| Évolution | Risque | Décision |
|---|---|---|
| ~~Passer tri `createdAt DESC` → `publishedAt DESC`~~ | 🔴 BREAKING | Ne pas modifier le comportement par défaut. Alternative : ajouter `sortBy=published` optionnel si besoin. **Pour le MVP** : ajuster le wireframe vitrine à 5 biens et accepter le tri `createdAt`. |

### 5.5 — Format d'erreur : enrichir plutôt que remplacer

| Évolution | Risque | Implémentation |
|---|---|---|
| ~~Standardiser `{ error: { code, message, fields } }`~~ | 🔴 BREAKING | **Garder `{ success: false, error: "string" }`** en forme minimale. **Ajouter** des champs optionnels : `{ success: false, error: "string", code?: string, fields?: { … } }`. Le front vitrine lit `error` en priorité, et peut exploiter `code`/`fields` s'ils sont présents. |

### 5.6 — Champs Prisma à ajouter (⚠ migration à prévoir)

| Champ | Risque | Implémentation |
|---|---|---|
| `PropertyEnergy.dateReferenceEnergie` (Date?) | ✅ SAFE | Ajout d'un champ optionnel. Ancien `dpeDate` conservé. Migration Prisma simple (`prisma migrate dev`). Pas d'impact sur l'admin UI tant qu'il n'y a pas de formulaire à éditer dessus. |
| `PropertyFinance.honorairesCharge` (enum `HonorairesCharge`) | ✅ SAFE | **Ne pas modifier `honorairesType` (String)**. Ajouter un **nouveau champ** `honorairesCharge` en enum à valeurs `ACQUEREUR`, `VENDEUR`, `PARTAGE`. Laisser les deux cohabiter pendant une phase de transition. L'UI admin peut être mise à jour progressivement pour écrire les deux. |

### 5.7 — Rate limiting

| Évolution | Risque | Implémentation |
|---|---|---|
| Ajouter rate limiting sur endpoints publics | ⚠ CAREFUL | Limites **généreuses** au lancement (ex. 300 req/min/IP). Logger les dépassements avant d'appliquer des limites strictes. Whitelister l'IP du serveur vitrine (les Server Components font tous les appels depuis la même IP). |

### 5.8 — Endpoints `/properties/sale` et `/properties/rent`

| Évolution | Risque | Décision |
|---|---|---|
| ~~Supprimer~~ | 🔴 BREAKING | **Ne pas supprimer** — la vitrine les wrappe (`listSaleProperties`, `listRentProperties`). |
| Déprécier via doc uniquement | ✅ SAFE | Ajouter un warning dans la doc admin qu'ils sont redondants avec `/properties?transactionType=…`. La vitrine pourra migrer à son rythme (changement purement interne côté vitrine). |

### 5.9 — Ce qu'il ne faut PAS faire

**Liste explicite des non-actions** — à référencer dans toute review admin future :

| ❌ À ne pas faire | Pourquoi |
|---|---|
| Renommer un query param existant (`bedrooms`, `sortBy`, etc.) | Casse la vitrine déployée |
| Supprimer un endpoint listé dans §2 | Idem |
| Changer la forme d'une réponse (retirer ou renommer un champ `data`, `count`, `total`, `filters`, etc.) | Idem |
| Ajouter un champ **requis** sur `POST /evaluation` | Casse tout POST qui n'a pas le nouveau champ |
| Typer un champ String libre existant en enum strict | Les données existantes non normalisées deviennent invalides |
| Changer la sémantique d'un filtre (ex. `bedrooms` passant de `>=` à `=`) | Résultats silencieusement différents |
| Changer la visibilité par défaut (retourner `VENDU`/`LOUE` sans opt-in) | La vitrine affiche des biens non attendus |

### 5.10 — Questions à lever avec l'équipe admin

Ces questions sont des éclaircissements de doc, elles ne nécessitent **pas** forcément un changement de code :

1. **`finance.price` en `LOCATION`** : loyer CC ou HC ? Comment se combine avec `charges` et `chargesIncluses` ? → à documenter dans le schéma Prisma (commentaire sur le champ).
2. **Coordonnées GPS** : exactes ou déjà floutées ? → documenter dans Prisma. Idéalement exactes (floutage côté vitrine via cercle 500 m).
3. **Notification agent post-`POST /evaluation`** : câblée ou à brancher ? Via quel canal (email, Slack) ?
4. **Dashboard admin des leads `evaluation`** : existe ? Si non, prévoir la même vue pour les futurs leads `contact` (§3.1) pour uniformiser la réception.

---

## 6. Plan d'implémentation recommandé (pour l'agent admin)

Ordonné par **ratio valeur / risque**. La vitrine peut avancer en parallèle en se basant sur les specs §2 et §3.

### Phase A — Pure création (0 risque pour l'admin)

1. **`POST /api/public/contact`** — nouvelle route, schéma §3.1.
2. **`GET /api/public/properties/[reference]/similar`** — nouvelle route, schéma §3.2.
3. **Ajout des champs Prisma optionnels** : `PropertyEnergy.dateReferenceEnergie`, `PropertyFinance.honorairesCharge` (enum). Migration Prisma standard.

### Phase B — Extensions additives `GET /properties` (risque minimal)

4. Ajouter les query params optionnels : `status[]`, `minRooms`, `minFloor`, `dpe[]`, `hideEnergyFG`, `hasBalcony`, `hasTerrace`, `hasGarden`, `isExclusive`, `isFurnished`, `condition`.
5. Ajouter les tris : `rent_asc`, `rent_desc`, `surface_asc`, `surface_desc`.
6. Ajouter `minBedrooms` en **alias** de `bedrooms` (même comportement).
7. Supporter le multi-valeurs via `.getAll()` pour `propertyType`, `city`, `dpe`, `status` (tester que single-value continue à fonctionner).

**Contrainte** : le comportement par défaut (sans nouveaux params) doit rester **strictement identique** à aujourd'hui. Un snapshot test (ou un curl avant/après) sur `/properties` sans params suffit à s'en assurer.

### Phase C — Extension `POST /evaluation` (additif only)

8. Ajouter les champs optionnels : `condition`, `timeframe`, `message`, `intent`, `source`, `userAgent`, `referer`.
9. Ajouter `rgpd` **optionnel** (type `boolean`). La vitrine force `true` via Zod ; côté admin, journaliser si absent pour tracer les clients non-conformes.

### Phase D — Sécurité (avant mise en ligne vitrine)

10. **Rate limiting** sur tous les endpoints publics. Limites larges (300/min/IP). Whitelister l'IP du serveur vitrine.
11. **Anti-spam** sur `POST /evaluation` et futur `POST /contact` : honeypot + validation email stricte minimum. reCAPTCHA v3 si volume d'abus.

### Phase E — Nice-to-have (après MVP)

12. Webhook sortant `POST https://vitrine.example.com/api/revalidate` sur événements `property.published/updated/unpublished/sold/rented`.
13. Standardisation progressive du format d'erreur (enrichissement, **pas** remplacement).
14. Dashboard admin unifié leads (estimation + contact).

### Phase F — Déprécation (optionnelle, après coordination avec la vitrine)

15. Warnings dans la doc admin pour `/properties/sale` et `/properties/rent`. Migration vitrine planifiée → suppression coordonnée en phase 2.

---

## 7. Checklist de validation côté admin (avant chaque phase)

À exécuter systématiquement pour s'assurer qu'aucune régression n'est introduite.

- [ ] **Snapshot API `/properties` sans params** : réponse identique avant / après modif (diff JSON = ø).
- [ ] **Snapshot API `/properties?transactionType=VENTE`** : identique.
- [ ] **Snapshot API `/properties?bedrooms=3`** : identique (sémantique `>=` préservée).
- [ ] **Snapshot API `/properties/recent`** : identique.
- [ ] **Snapshot API `/properties/[reference]` pour un bien publié** : identique (sauf ajouts de champs optionnels qui seraient `null`/`undefined`).
- [ ] **`POST /evaluation` avec le body actuel de la vitrine** (sans nouveaux champs) : continue de fonctionner et retourne `201`.
- [ ] **Admin UI** : aucune régression visible sur la gestion des biens, des honoraires, des copropriétés.
- [ ] **Migration Prisma** : appliquée en dev, puis en staging avec données réelles avant prod.
- [ ] **Tests de charge léger** (50 req simultanées) pour vérifier que le rate limit ne bloque pas la vitrine.

---

## 8. Tableau synoptique front → back (post-audit)

| Page vitrine | Endpoint(s) admin | Statut réel |
|---|---|---|
| Home — biens à la une | `GET /properties/recent?limit=5` | ✅ fonctionne (ajuster wireframe à 5 ou augmenter default admin) |
| Home — biens vendus | `GET /properties?status=VENDU&status=LOUE` | ❌ **bloqué** — filtre `status` inexistant (phase B) |
| Home — avis | Google Places (externe) | ❌ non branché (hors admin) |
| Home — contact rapide | `POST /contact` | ❌ **endpoint manquant** (phase A) |
| `/acheter` | `GET /properties?transactionType=VENTE&…` | ⚠ base OK, **filtres amputés** (phase B) |
| `/louer` | `GET /properties?transactionType=LOCATION&…` | ⚠ base OK, **filtres amputés + tri loyer manquant** (phase B) |
| `/bien/[reference]` | `GET /properties/[reference]` | ✅ champs majoritairement présents, **2 ajouts Prisma** (phase A) |
| `/bien/[reference]` — similaires | `GET /properties/[reference]/similar` | ❌ inexistant (phase A) |
| `/bien/[reference]` — demande visite | `POST /contact` | ❌ **endpoint manquant** (phase A) |
| `/vendre` | aucun | ✅ statique |
| `/estimation` | `POST /evaluation` | ⚠ existe, champs optionnels à ajouter (phase C) |
| `/a-propos` — avis | Google Places | ❌ non branché (hors admin) |
| `/contact` | `POST /contact` | ❌ **endpoint manquant** (phase A) |
| `/honoraires` | aucun | ✅ statique |
| `/mentions-legales`, `/politique-de-confidentialite`, `/cookies` | aucun | ✅ statique |
| 404 | `GET /properties/recent?limit=3` (optionnel suggestions) | ✅ |
| `sitemap.xml` | `GET /properties?limit=…&isPublished=true` | ✅ vérifier que la `limit` peut monter au-delà de 100, ou paginer |

---

## 9. Prochaines étapes

1. **Partager ce doc** avec la team admin (`cabinet-rimbault-admin`).
2. Valider ensemble la **matrice de risque** et le **plan d'implémentation** (§5 et §6) — tout changement marqué 🔴 BREAKING doit être discuté avant action.
3. Avancer dans l'ordre des phases A → F (§6). L'ordre a été pensé pour débloquer le front vitrine au plus vite sans toucher aux comportements existants.
4. Mettre à jour ce document avec le statut réel de chaque item (`✅ livré`, `🔄 en cours`, `❌ refusé`).
5. Créer le wrapping côté vitrine (`src/lib/api/*.ts`) au fur et à mesure des livraisons.
6. Prévoir un environnement de **staging admin** pour tester les endpoints avant la mise en ligne vitrine.
7. Exécuter la **checklist §7** après chaque PR côté admin.
