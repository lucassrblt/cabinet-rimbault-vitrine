# Plan d'implémentation vitrine — branchement de la logique

> Rédigé le 2026-04-21. Toutes les routes admin nécessaires sont livrées (voir `docs/api-contract.md` §2–3). Ce document détaille, **page par page**, ce qu'il reste à câbler côté vitrine.
>
> Lecture recommandée avant toute implémentation : `AGENTS.md`, `CLAUDE.md`, `docs/api-contract.md` §5 (règles non-breaking) et `node_modules/next/dist/docs/` pour Next 16.

---

## 0. Chantiers transverses (à traiter en premier)

Ces blocs conditionnent plusieurs pages. Les traiter avant les pages accélère le reste.

### 0.1 — Étendre `src/lib/api/types.ts`

La route `GET /api/public/properties/[reference]` renvoie des champs qui ne sont pas encore typés côté vitrine :

- `copro` : `{ isInCopro, coprLots, coprCharges, coprChargesDetails, coprProcedure, coprSyndic, lotNumber, tantieme }` — cf. `PropertyCopro` (admin Prisma).
- `energy.annualEnergyCostMin` / `annualEnergyCostMax`, `energy.dpeDate`, `energy.dateReferenceEnergie`.
- `finance.honorairesCharge` : enum `"ACQUEREUR" | "VENDEUR" | "PARTAGE"` (coexiste avec `honorairesType` en string libre — garder les deux).
- `condition` : enum `PropertyCondition` FR à la racine (`NEUF | TRES_BON_ETAT | BON_ETAT | A_RAFRAICHIR | A_RENOVER | A_RESTAURER`).
- `isFurnished` : existe dans `amenities` (pas à la racine).
- `availableFrom` : `string | null` (ISO).
- `documents[]`, `rooms_details[]`, `proximities[]` — renvoyés uniquement par l'endpoint détail. Typer même si on ne les affiche pas immédiatement (champs à exploiter §2.3 fiche bien).

**Action** : compléter `Property`, `PropertyFinance`, `PropertyEnergy`, `PropertyAmenities` et ajouter `PropertyCopro`, `PropertyDocument`, `PropertyRoomDetail`, `PropertyProximity`. Ajouter les nouveaux filtres (`status[]`, `minRooms`, `minFloor`, `dpe[]`, `hideEnergyFG`, `hasBalcony`, `hasTerrace`, `hasGarden`, `isExclusive`, `isFurnished`, `condition`, tris `rent_asc/desc`, `surface_asc/desc`) à `SearchFilters`.

### 0.2 — Soumission des formulaires : Server Actions

Tous les formulaires actuels sont `"use client"` avec une soumission **factice** (`setTimeout`). Il faut câbler les POST sur `/api/public/contact` et `/api/public/evaluation`.

**Contrainte dure (CLAUDE.md §règles d'or)** : `PUBLIC_API_KEY` ne doit **jamais** atteindre le bundle client. Interdit donc de faire `fetch('/api/public/...')` depuis le navigateur avec la clé.

**Option retenue : Server Actions** (Next 16, côté serveur, pas de route handler à écrire).

1. Créer `src/lib/api/leads.ts` (server-only) avec :
   - `postContactLead(input: ContactPayload): Promise<{ id: string }>` → POST `/api/public/contact`.
   - `postEvaluation(input: EvaluationPayload): Promise<{ id: string }>` → POST `/api/public/evaluation`.
   - Injection automatique de `meta.source = "vitrine"`, `meta.page = <pathname>`, `meta.userAgent`, `meta.referer` (depuis `headers()` de `next/headers`).
2. Créer `src/app/actions/leads.ts` (`"use server"`) exposant :
   - `submitContactLead(formData)` — wrap `postContactLead`, convertit le payload Zod front → contrat API imbriqué.
   - `submitVisitRequest(formData)` — idem avec `subject = "BIEN_SALE" | "BIEN_RENT"` selon `isRental` et `propertyReference` renseignée.
   - `submitQuickContact(formData)` — `subject = "OTHER"`, message libre.
   - `submitEvaluation(formData)` — wrap `postEvaluation`, structure plate (cf. §2.6 contrat).
3. Côté composants, remplacer la simulation par `useTransition()` + appel de l'action. Garder `useForm` + `zodResolver` pour la validation front.
4. Gestion d'erreur : l'action retourne `{ ok: true, id }` ou `{ ok: false, error, fields? }`. Le formulaire affiche l'erreur (bloc rouge en tête) et met à jour `setError` pour les erreurs par champ (`fields` retourné par l'API en cas de 400/422).

**Mapping front ↔ contrat API** (à documenter dans `leads.ts`) :

| Front (Zod) | API contact (imbriqué) |
|---|---|
| `subject: "vente"` (ContactForm) | `subject: "BIEN_SALE"` |
| `subject: "location"` | `subject: "BIEN_RENT"` |
| `subject: "estimation"` | `subject: "ESTIMATION"` |
| `subject: "rdv"` | `subject: "APPOINTMENT"` |
| `subject: "autre"` | `subject: "OTHER"` |
| `profile: "acquereur"` (VisitRequestForm) | `profile: "BUYER"` |
| `profile: "investisseur"` | `profile: "INVESTOR"` |
| `profile: "locataire"` | `profile: "TENANT"` |
| `profile: "curieux"` | `profile: "CURIOUS"` |
| `financing: "ok"` | `financing: "APPROVED"` *(ou `IN_PROGRESS` — à confirmer)* |
| `financing: "etude"` | `financing: "TO_STUDY"` |
| `financing: "comptant"` | `financing: "CASH"` |
| `availabilities: ["matin","aprem","soir","samedi"]` | `visitAvailability: ["MORNING","AFTERNOON","EVENING","SATURDAY"]` |
| `firstName`, `lastName`, `phone`, `email`, `message` | `contact.{…}` |
| `rgpd` | `consent.rgpd` |

**⚠ Vérifier** les valeurs exactes d'enums `LeadProfile` / `LeadFinancing` / visitAvailability côté Prisma admin avant de fixer le mapping.

| Front (Zod estimation) | API `/evaluation` (plat) |
|---|---|
| step1.type = `"appartement"\|"maison"\|"terrain"\|"autre"` | `propertyType` (string libre, pas d'enum admin) — passer `"APPARTEMENT"\|"MAISON"\|"TERRAIN"\|"AUTRE"` pour rester cohérent avec l'enum Prisma Property. |
| step1.address | `address` |
| step1.surface | `surface` (number) |
| step1.rooms (`"1"…"8+"`) | `rooms` (parser `"8+"` → `8`) |
| step1.floor (`"rdc"\|"1"…"4+"`) | *pas de champ admin — mettre dans `message` ou laisser tomber* |
| step1.year | `constructionYear` |
| step1.outdoor[] | `hasBalcony`, `hasTerrace`, `hasGarden` (bool dérivés) |
| step1.condition (`"neuf"\|"bon"\|"rafraichir"\|"renover"`) | `condition` (enum FR admin : `NEUF\|BON_ETAT\|A_RAFRAICHIR\|A_RENOVER`) |
| step2.intent (`"vendre"\|"louer"\|"renseigne"`) | `intent` (nouveau champ Phase C) |
| step2.delay (`"3m"…"plus-tard"`) | `timeframe` (nouveau champ Phase C) |
| step2.firstName/lastName/phone/email | `firstName`, `lastName`, `phone`, `email` |
| step2.message | `message` (Phase C) |
| step2.rgpd | `rgpd` (Phase C) |
| — | Code postal : **champ manquant dans le formulaire front** alors qu'il est **requis admin** (regex `^\d{5}$`). Ajouter un champ `postalCode` à `estimationStep1Schema` / UI. |

**Blocage identifié** : la validation admin exige `postalCode`, que le wireframe actuel ne capture pas. → ajouter le champ avant le câblage (voir §2.4).

### 0.3 — Revalidation cache

Tous les appels passent par `apiFetch` avec `revalidate: 60` + tags (`properties`, `property:<ref>`, etc.). En MVP, les 60 s suffisent.

**À prévoir (phase 2)** : route handler `POST /api/revalidate` côté vitrine, protégé par un secret partagé (`REVALIDATION_SECRET`), qui appelle `revalidateTag` selon le payload `{ event, reference }` (cf. `docs/api-contract.md` §3.3). L'admin déclenchera le webhook depuis ses hooks de publication.

---

## 1. Home — `src/app/page.tsx`

### État
- `loadHomeData` appelle `listRecentProperties(20)` puis filtre manuellement `DISPONIBLE | SOUS_OFFRE | SOUS_COMPROMIS` pour la sélection, et `VENDU | LOUE` pour la section "Dernières transactions". Problème : l'endpoint `/properties/recent` **n'inclut jamais** `VENDU` ni `LOUE` (cf. `getPublicPropertiesWhere()` admin). La section "Sold" est donc toujours vide.
- `HeroSearch` côté client → redirige vers `/acheter` ou `/louer` en query string (pas d'appel API).
- `QuickContactForm` : soumission factice.

### À faire

1. **Séparer les deux fetchs** dans `loadHomeData` :
   ```ts
   const [recentRes, soldRes] = await Promise.all([
     listRecentProperties(6),                                 // défaut actif
     searchProperties({ status: ["VENDU", "LOUE"], limit: 4 }) // nouveau — filtre status[] livré
   ])
   ```
   Adapter `searchProperties` pour accepter `status: string[]` (cf. §0.1). Envoyer les clés multiples via `apiFetch` : actuellement `apiFetch` ne gère pas les tableaux → **étendre `apiFetch` pour sérialiser `string[]` en `?key=a&key=b`**.
2. Passer `limit=6` à `listRecentProperties` pour éviter de récupérer 20 biens inutilement (perf + conformité wireframe).
3. Retirer le filtrage manuel `p.isPublished` : l'API garantit déjà `isPublished = true`.
4. **`QuickContactForm`** : brancher sur Server Action `submitQuickContact` (§0.2). Subject `OTHER`, `meta.page = "/"`.
5. `HeroSearch` reste côté client (stateful) — pas de changement logique, mais s'assurer que la redirection vers `/acheter?commune=...` continue à marcher avec les filtres étendus de §2.1.

---

## 2. Listings acheter / louer — `src/app/acheter/page.tsx` + `src/app/louer/page.tsx`

### État
- Les deux pages appellent `listSaleProperties({ limit: 200 })` / `listRentProperties({ limit: 200 })` — wrappers `/properties/sale` et `/properties/rent` qui **ne supportent pas les filtres étendus** (seulement `postalCode`, `city`, `limit`).
- Le filtrage (`filterProperties`), le tri (`sortProperties`) et la pagination (`paginate`) sont faits **côté vitrine en mémoire** sur les 200 biens rapatriés.
- `limit=200` côté front, mais l'endpoint admin plafonne à **100** (`validLimit = Math.max(1, Math.min(limit, 100))`). Résultat : on reçoit au max 100 biens, pas 200 — silently clamped.

### À faire

**Option retenue : migrer vers `searchProperties` (= `GET /properties`) et pousser les filtres côté API**. Phase B du contrat API livre tout le nécessaire.

1. **Acheter** — remplacer l'appel par :
   ```ts
   const res = await searchProperties({
     transactionType: "VENTE",
     propertyType: query.type || undefined,
     city: communeFromSlug(query.commune),          // via COMMUNES
     minPrice: num(query.budgetMin),
     maxPrice: num(query.budgetMax),
     minSurface: num(query.surfaceMin),
     maxSurface: num(query.surfaceMax),
     minRooms: num(query.pieces),
     dpe: query.dpe ? [query.dpe] : undefined,
     sortBy: mapSort(query.sort),                   // date | price_asc | price_desc | surface_asc | surface_desc
     limit: PER_PAGE,
     offset: ((Number(query.page) || 1) - 1) * PER_PAGE,
   })
   ```
2. **Louer** — idem avec `transactionType: "LOCATION"`, `sortBy` accepte aussi `rent_asc` / `rent_desc`. Exposer `isFurnished` dans `FilterBar` (déjà un chip `meuble=true`, à brancher sur `isFurnished`).
3. **Lire `res.total` pour la pagination** (actuellement on paginait localement sur `filtered.length`). Nouveau helper `paginateServerSide(total, page, perPage)` qui retourne juste `{ page, totalPages }`.
4. **Retirer `filterProperties` et `sortProperties`** des pages — ou les garder pour `findSimilar` uniquement (cf. §3). Les listings n'en ont plus besoin.
5. **`FilterBar`** — vérifier que chaque champ est bien persisté dans l'URL. Ajouter champs manquants désormais exploitables : `meuble` (→ `isFurnished`), `dpe` multi-select, `exterieur` (balcon/terrasse/jardin → `hasBalcony`, `hasTerrace`, `hasGarden`).
6. **⚠ Décider** si on migre complètement vers `/properties?transactionType=VENTE` et déprécie `listSaleProperties` / `listRentProperties`. Recommandation : garder les wrappers par simplicité mais internaliser l'appel à `searchProperties` (changement purement interne, zéro impact API).

### Décisions restantes
- **Budget mini dans `/louer`** : `0-1000` → `rent_asc`, à confirmer que `finance.price` en LOCATION est le loyer (`docs/api-contract.md` §5.10 Q1). Sinon, on filtre faux.
- **Tri par défaut** : actuellement `date` (descendant). OK.

---

## 3. Fiche bien — `src/app/bien/[reference]/page.tsx`

### État
- `getPropertyByReference` OK.
- `loadSimilar` appelle `listSaleProperties({ limit: 100 })` **ou** `listRentProperties({ limit: 100 })` pour remplir une pool, puis exécute `findSimilar` en mémoire (`src/lib/listing.ts`). Cette logique duplique un endpoint admin désormais livré (`/properties/[reference]/similar`).
- `VisitRequestForm` : soumission factice.
- `EnergySection` : affiche DPE/GES + warning loi Climat si F/G. OK. **Il manque `dateReferenceEnergie`** (obligation arrêté 2021) à afficher à côté du DPE — champ livré admin (Phase A).
- `LocationSection` : carte factice. `location.latitude/longitude` sont exploitables (admin Prisma les expose ; à confirmer qu'ils sont exacts, pas floutés — question ouverte §5.10 Q2). Prévoir un cercle approximatif 500 m si exacts.
- `HonorairesSection` affiche `honorairesType` (string libre). Basculer sur `honorairesCharge` (enum) quand disponible, avec fallback sur `honorairesType`.
- Aucune exploitation de `documents`, `rooms_details`, `proximities`, `copro`, `annualEnergyCostMin/Max`.

### À faire

1. **Similaires** — remplacer `loadSimilar` par un appel à un nouveau helper `getSimilarProperties(reference, limit = 3)` qui tape `/properties/[reference]/similar` :
   ```ts
   // src/lib/api/properties.ts
   export async function getSimilarProperties(reference: string, limit = 3) {
     return apiFetch<ApiListResponse<Property>>(
       `/properties/${encodeURIComponent(reference)}/similar`,
       limit ? { limit } : undefined,
       { tags: [`property:${reference}`, "properties"] },
     )
   }
   ```
   Supprimer l'usage de `findSimilar` sur la fiche bien (garder la fonction si utilisée ailleurs — sinon la supprimer de `src/lib/listing.ts`).
2. **`VisitRequestForm`** — brancher sur Server Action `submitVisitRequest` (§0.2). Subject `BIEN_SALE` ou `BIEN_RENT` selon `isRental`, `propertyReference: reference`, `meta.page = "/bien/<ref>"`.
3. **Énergie** — afficher `energy.dateReferenceEnergie` (ou fallback `dpeDate`) sous le DPE. Afficher le coût énergétique estimé (`annualEnergyCostMin` – `Max`) si présent — **obligation Loi Climat depuis avril 2022**.
4. **Honoraires** — adapter `HonorairesSection` pour lire `finance.honorairesCharge` en priorité (enum → libellé FR), tomber sur `honorairesType` sinon.
5. **Copropriété** (si `copro.isInCopro === true`) — nouvelle sous-section dans `CharacteristicsSection` ou section dédiée : nombre de lots, charges annuelles, procédure en cours (obligation Alur). Champs disponibles dans `property.copro`.
6. **Rooms details / proximities** — au minimum une liste `proximities` (école, transport…) sous "Localisation". `rooms_details` peut enrichir "Caractéristiques" avec les pièces nommées.
7. **Documents** — si `documents[]` non vide, afficher un bloc avec les liens (DPE PDF, diagnostics). Vérifier la politique de visibilité côté admin (sanitization actuelle non documentée).
8. **`LocationSection`** — quand `latitude && longitude` sont fournis, afficher une vraie carte floutée. Recommandation : un `<iframe>` OpenStreetMap centré + cercle statique côté SVG (pas de lib JS pour préserver SEO et perf). À arbitrer — sinon garder le placeholder actuel.
9. **ISR** — `getPropertyByReference` utilise `tags: [property:<ref>]`. Bon. Garder `revalidate: 60`.
10. **`generateStaticParams`** *(optionnel, nice-to-have SEO)* — pré-générer les pages bien au build depuis `searchProperties({ limit: 100 })`. Utile si forte pression SEO, sinon `dynamic = "auto"` suffit en ISR.

---

## 4. Estimation — `src/app/estimation/page.tsx`

### État
- `EstimationForm` (2 étapes) : client component, soumission factice.
- **Champ manquant bloquant** : pas de `postalCode` alors que l'API le requiert.

### À faire

1. **Ajouter `postalCode` à `estimationStep1Schema`** (regex `^\d{5}$`, requis) + champ UI dans `Step1` (juste après `address` ou à côté). Afficher l'erreur Zod standard.
2. **Brancher Server Action `submitEvaluation`** (§0.2). Mapper step1+step2 vers le payload plat admin. Gérer les enums `condition` et le parsing `rooms: "8+"` → `8`.
3. **Remonter les erreurs API** dans `Step2` (état `rootError`) : afficher en tête du formulaire un bloc rouge si `ok: false`.
4. **Honeypot anti-spam** (champ caché `website` ou `company`, si rempli → reject côté action avec 200 silent success). Question ouverte §5.10 Q3 du contrat — anti-spam côté admin à confirmer ; ajouter le honeypot côté vitrine dans tous les cas (0 coût).
5. Conserver l'écran `Confirmation`. Ajouter l'id de lead retourné dans `data-*` pour tracking (optionnel).
6. **Meta** : injecter `source = "estimation"`, `page = "/estimation"`, `userAgent`, `referer` côté action.

---

## 5. Contact — `src/app/contact/page.tsx`

### État
- `ContactForm` : soumission factice. Subjects `vente | location | estimation | rdv | autre`. Reference optionnelle.

### À faire

1. **Brancher Server Action `submitContactLead`** (§0.2).
2. **Pré-sélection du sujet via query param** — ex. lien "Je me renseigne sur le bien XYZ" → `/contact?subject=vente&ref=XYZ`. La page est Server Component ; lire `searchParams.subject` / `searchParams.ref` et passer en `defaultSubject` / `defaultReference` à `ContactForm`.
3. **Meta** : `source = "contact"`, `page = "/contact"`.
4. Rien d'autre : pas de fetch admin, pas d'endpoint à consommer pour la page info agence (coordonnées viennent de `lib/config/agent.ts`).

---

## 6. Pages statiques — `/vendre`, `/a-propos`, `/honoraires`, `/mentions-legales`, `/politique-de-confidentialite`, `/cookies`

### État
Toutes servent de contenu statique à partir de `lib/config/agent.ts`.

### À faire

Rien à brancher sur l'API admin.

**Note** `/a-propos` section "avis" : si on décide d'afficher de vrais avis Google, fetch `Google Places API (New)` côté server (`revalidate: 3600`). Hors périmètre admin — §4.3 contrat. MVP : lire `REVIEWS` statique (déjà en place).

---

## 7. 404 — `src/app/not-found.tsx`

### État
Statique : HeroSearch + CTA + téléphone.

### À faire

**Optionnel** — ajouter un bloc "Découvrir d'autres biens" qui appelle `listRecentProperties(3)` et propose des cartes. Fait de la page un Server Component (elle l'est déjà, mais elle n'a pas d'`async`). Valeur SEO faible (404 noindex par défaut), mais rétention UX positive.

---

## 8. Infrastructure — endpoints vitrine à créer

### 8.1 — `POST /api/revalidate` *(phase 2, pas MVP)*

- Route handler côté vitrine pour recevoir les webhooks admin.
- Body `{ secret, event, reference }` — valider `secret === process.env.REVALIDATION_SECRET`.
- Mapping event → tags :
  - `property.published` / `property.updated` / `property.unpublished` → `revalidateTag("property:<ref>")` + `revalidateTag("properties")` + `properties:sale` / `properties:rent` / `properties:recent` selon `transactionType`.
  - `property.sold` / `property.rented` → idem + invalidation éventuelle du bloc home "transactions vendues".
- Ajouter `REVALIDATION_SECRET` aux env vars (`docs/deployment.md`).

### 8.2 — `sitemap.xml`

- Fichier `src/app/sitemap.ts` (format Next 16). Fetch `searchProperties({ limit: 100, offset: 0 })` puis pagination si `total > 100`. Rate limit admin à surveiller (cf. §5.7 contrat) — envisager offset + limit côté vitrine si > 500 biens.

### 8.3 — `robots.txt`

- Fichier `src/app/robots.ts`. Autoriser tout sauf `/api/*`. `Sitemap: https://<host>/sitemap.xml`.

---

## 9. Ordre d'exécution recommandé

Chaque étape est indépendante des suivantes (on peut merger en série sans casser la prod) sauf dépendances explicitées.

1. **§0.1 — Typer les nouveaux champs `Property`** (bloque §3 et §1).
2. **§0.2 — Scaffolding Server Actions + `src/lib/api/leads.ts`** (bloque §1 QuickContact, §3 Visit, §4 Estimation, §5 Contact).
3. **§2 — Listings server-side filtering** (gain perf immédiat).
4. **§3.1 — Endpoint similaires** (suppression de `findSimilar` sur fiche bien).
5. **§1 — Home : section "vendus"** (dépend de §0.1 `SearchFilters` étendu + multi-value `apiFetch`).
6. **§3.3 à §3.7 — Enrichissement fiche bien** (énergie, honoraires, copro, proximités, documents).
7. **§4 — Estimation** (après §0.2).
8. **§5 — Contact** (après §0.2).
9. **§7, §8 — 404 enrichi, sitemap, robots**.
10. **§8.1 — Revalidation webhook** (peut partir en phase 2).

### Définition de "done" par étape

À chaque étape :
- `npm run typecheck` passe.
- `npm run lint` passe.
- Test manuel sur `npm run dev` : la page concernée charge, les cas d'erreur (API down, 404, payload invalide) affichent des messages lisibles.
- Aucune clé API dans le bundle client (grep `PUBLIC_API_KEY` sur `.next/static/**` doit être vide).

---

## 10. Questions ouvertes avant implémentation

1. **Valeurs exactes des enums admin `LeadProfile`, `LeadFinancing`, `LeadSubject`, visitAvailability** — lire `cabinet-rimbault-admin/prisma/schema.prisma` avant de figer le mapping §0.2.
2. **`finance.price` en LOCATION** : loyer CC ou HC ? (§5.10 Q1 contrat) — impacte l'affichage `/louer` et la fiche bien.
3. **Coordonnées GPS exactes ou floutées** ? (§5.10 Q2) — conditionne l'implémentation carte fiche bien.
4. **Notification agent post-lead** (§5.10 Q3) — pas bloquant vitrine mais à vérifier côté admin.
5. **Reviews Google** — route admin proxy ou fetch direct vitrine ? Décision MVP : fetch direct. (§4.3 contrat)
6. **Champ `floor` estimation** — pas de colonne admin, à stocker dans `message` ou à proposer côté admin (hors scope).
