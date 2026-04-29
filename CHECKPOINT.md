# Checkpoint — avancement du câblage vitrine

> Suivi de l'implémentation de `docs/implementation-plan.md`. Cocher chaque sous-tâche au fur et à mesure.
>
> Légende : `[ ]` à faire · `[~]` en cours · `[x]` fait · `[-]` reporté / non-MVP.

## §0 — Chantiers transverses

- [x] §0.1 `src/lib/api/types.ts` enrichi (Copro, Document, RoomDetail, Proximity, Energy étendu, Finance + `honorairesCharge`, Amenities + `isFurnished`, `condition`, `availableFrom`).
- [x] §0.1 `SearchFilters` étendu (`status[]`, `minRooms`, `minFloor`, `dpe[]`, `hideEnergyFG`, `hasBalcony/Terrace/Garden`, `isExclusive`, `isFurnished`, `condition`, tris `rent_*` / `surface_*`, `minBedrooms`).
- [x] §0.1 `apiFetch` sérialise les `string[] | number[]` en `?key=a&key=b` (voir `appendQuery` dans `src/lib/api/client.ts`).
- [x] §0.2 `src/lib/api/leads.ts` (server-only) : `postContactLead`, `postEvaluation` via `apiPost` + types `LeadSubject`/`LeadProfile`/`LeadFinancing`/`VisitAvailability`.
- [x] §0.2 `src/app/actions/leads.ts` (`"use server"`) : `submitContactLead`, `submitVisitRequest`, `submitQuickContact`, `submitEvaluation` + injection `meta.*` (`source="vitrine"`, `page`, `user-agent`, `referer`).
- [-] §0.3 Route handler `POST /api/revalidate` (phase 2, hors MVP).

## §1 — Home (`src/app/page.tsx`)

- [x] `loadHomeData` : deux fetchs en parallèle (`listRecentProperties(6)` + `searchProperties({status:["VENDU","LOUE"],limit:4})`) via `Promise.all`.
- [x] Retrait du filtrage manuel `isPublished`.
- [x] `QuickContactForm` branché sur `submitQuickContact` (`subject="OTHER"`, `meta.page="/"`).
  - ⚠ **Placeholder email** : la vitrine ne collecte qu'un téléphone sur ce formulaire, l'API admin exige un email. On pousse `<phone_digits>@noemail.placeholder` pour satisfaire la validation. À renégocier côté admin (ou ajouter un champ email au formulaire) si besoin.

## §2 — Listings (`/acheter`, `/louer`)

- [x] Migration vers `searchProperties` avec filtres API-side (prix, surface, rooms, dpe, isFurnished, hasBalcony/Terrace/Garden, hideEnergyFG, sortBy, pagination).
- [x] Pagination basée sur `res.total` (helper `paginateServerSide`).
- [x] Suppression de `filterProperties` + `sortProperties` + `paginate` + `findSimilar` (listing.ts simplifié à `parseQuery`/`queryToSearchFilters`/`mapSort`/`paginateServerSide`).
- [x] `FilterBar` : chips `meuble`, `dpe`, `balcon`, `terrasse`, `jardin`, `hideFG` branchés.
- [x] `/louer` : tris `rent_asc`/`rent_desc` transmis à l'API.
- [x] `ListingView` → `Pagination` passe les nouveaux paramètres d'URL.

## §3 — Fiche bien (`/bien/[reference]`)

- [x] `getSimilarProperties(reference, limit=3)` helper + usage sur la page (suppression de `findSimilar`).
- [x] `VisitRequestForm` branché sur `submitVisitRequest` (`subject=BIEN_SALE|BIEN_RENT`, `propertyReference`, `profile`, `financing`, `visitAvailability`).
- [x] `EnergySection` : `dateReferenceEnergie` (fallback `dpeDate`) + `annualEnergyCostMin/Max`.
- [x] `HonorairesSection` + bloc prix : `honorairesCharge` (enum libellé FR) en priorité, fallback `honorairesType`.
- [x] `CoproSection` (nb lots, charges, lot, tantièmes, syndic, procédure).
- [x] `proximities[]` rendus sous "Localisation".
- [x] `rooms_details[]` rendus dans "Caractéristiques".
- [x] `DocumentsSection` si `documents[]` non vide.
- [-] Carte OSM réelle (optionnel, décision produit — placeholder conservé).

## §4 — Estimation (`/estimation`)

- [x] Champ `postalCode` (Zod `postalCodeSchema` + UI step 1).
- [x] Soumission via `submitEvaluation`, mapping plat : `rooms "8+"→8`, `condition` FR, `outdoor` → bool, `intent` (`SELL`/`RENT_OUT`/`EXPLORATION`), `timeframe` (`LT_3_MOIS`...).
- [x] Erreur API remontée dans step2 (bloc rouge en tête + `setError` par champ).
- [x] Honeypot anti-spam (`website` hidden) sur tous les formulaires.
- [x] Confirmation avec id lead (`data-lead-id`).

## §5 — Contact (`/contact`)

- [x] `ContactForm` branché sur `submitContactLead`.
- [x] Pré-sélection `?subject=`/`?ref=` via `searchParams` côté page server (async).
- [x] `meta.source="vitrine"`, `meta.page="/contact"`.

## §6 — Pages statiques

- [x] Rien à câbler.

## §7 — 404

- [-] Bloc "découvrir d'autres biens" (optionnel, MVP : non).

## §8 — Infrastructure

- [x] §8.2 `src/app/sitemap.ts` — routes statiques + biens publiés (pagination à 100/page, max 20 pages).
- [x] §8.3 `src/app/robots.ts` — autorise tout sauf `/api/`.
- [-] §8.1 Webhook `POST /api/revalidate` (phase 2).

## Validation

- [x] `npm run typecheck` passe.
- [x] `npm run lint` passe (seul info non-bloquant : biome schema URL 2.2.0 vs CLI 2.4.12).
- [ ] Vérifier qu'aucun `PUBLIC_API_KEY` n'atteint `.next/static/**` (à faire après `npm run build`).
- [ ] Test manuel `npm run dev` — pages, soumissions, erreurs (à faire manuellement).

---

## Journal

- **2026-04-22** — initialisation du checkpoint, plan lu, tâches créées.
- **2026-04-22** — §0.1/§0.2/§1/§2/§3/§4/§5/§8.2/§8.3 livrés en une passe. Typecheck et lint verts.
- **2026-04-22** — choix notable : QuickContactForm conserve son seul champ "nom+phone+message" ; l'email requis par l'API admin est renseigné par un placeholder calculé depuis le téléphone (`<digits>@noemail.placeholder`). À arbitrer côté admin si ça ne passe pas la validation anti-spam future.
- **2026-04-22** — reporté en phase 2 : webhook `/api/revalidate` (§0.3, §8.1), bloc "biens suggérés" sur 404 (§7), carte OSM réelle sur fiche bien (§3.8). Pour le MVP : revalidate 60 s suffit.

## Environnement

Variables d'env attendues (à documenter dans `.env.local` / Vercel preview) :

- `ADMIN_API_URL` — base URL de l'admin (ex. `https://admin.cabinet-rimbault.fr/api/public`).
- `PUBLIC_API_KEY` — clé API publique (server-only, ne doit pas apparaître dans `.next/static`).
- `NEXT_PUBLIC_SITE_URL` *(optionnel)* — utilisé par `sitemap.ts` / `robots.ts` ; fallback sur `https://cabinet-rimbault.fr`.
