@AGENTS.md

# Cabinet Rimbault — site vitrine

Site public d'un agent immobilier indépendant en Île-de-France. Consomme l'API publique du back-office `cabinet-rimbault-admin` (projet séparé, déployé indépendamment).

## Docs à lire selon la tâche

- **Produit / UX / contenu / nouvelle page** → `docs/cahier-des-charges.md` (source de vérité : positionnement, sitemap, navigation, obligations légales, décisions verrouillées).
- **Déploiement / env vars / preview Vercel** → `docs/deployment.md`.
- **Breaking changes Next.js 16** → `node_modules/next/dist/docs/` (voir `AGENTS.md`).

Ne jamais prendre une décision produit contredisant `docs/cahier-des-charges.md` sans la faire remonter au product owner.

## Stack

- **Next.js 16.2** App Router (TypeScript strict, React 19.2)
- **Tailwind v4** (via `@tailwindcss/postcss`, pas de `tailwind.config.js` — tokens dans `src/app/globals.css` avec `@theme`)
- **TanStack Query 5** — Provider monté (`src/app/providers.tsx`), mais usage **réservé aux Client Components** avec besoin d'interactivité sans reload
- **Zod 4 + react-hook-form 7** — formulaires
- **lucide-react** — icônes
- **Biome 2** — lint + format + organize imports (remplace ESLint/Prettier)
- **Husky 9** — pre-commit : `biome check --write --staged`

Alias TypeScript : `@/*` → `./src/*`.

## Commandes

```bash
npm run dev         # next dev
npm run build       # next build
npm run start       # next start
npm run typecheck   # tsc --noEmit
npm run lint        # biome check .   (read-only)
npm run lint:fix    # biome check --write .
npm run format      # biome format --write .
```

Avant de rendre une tâche : `npm run typecheck` **et** `npm run lint` doivent passer. Pas de suite de tests (choix produit pour le MVP vitrine).

## Conventions structurantes

### Fetch API & Server Components (règle n°1)

- **Server Components par défaut** sur toutes les pages. Fetch l'API admin directement depuis le serveur via `src/lib/api/*` — pas de route handler proxy sauf nécessité prouvée.
- La clé API (`PUBLIC_API_KEY`) est **server-only**. `src/lib/api/client.ts` importe `"server-only"` — ne pas retirer.
- Pour filtrer/rechercher, passer par `searchParams` dans l'URL (SEO + URLs partageables). Pas de state client pour les filtres de listing.
- TanStack Query uniquement pour : autocomplétion, carte, pagination infinie, interactions rapides. Sinon, Server Component + ISR.
- Cache par défaut `revalidate: 300` (listings), `revalidate: 600` sur fiche bien et biens similaires. Tags structurés (`properties`, `properties:sale`, `property:<ref>`). Réutiliser les helpers existants dans `src/lib/api/properties.ts` plutôt que refaire `fetch()`.

### Organisation

```
src/
  app/                      routes (FR : /acheter, /louer, /vendre, /estimation, ...)
    providers.tsx           QueryClientProvider côté client
    layout.tsx              <html lang="fr"> + Header + Footer + MobileBottomBar
  components/
    layout/                 Header, Footer, Breadcrumb, MobileMenu, MobileBottomBar, PageShell
  lib/
    api/                    client, properties, types (ne JAMAIS importer côté client)
    utils.ts                cn(), formatPrice, formatSurface, formatPropertyType…
```

- **Domain types** dans `src/lib/api/types.ts` (un seul endroit). Ne pas dupliquer `Property`, `PropertyType`, etc.
- **Formatters FR** (`formatPrice`, `formatSurface`, `formatTransactionType`) — utiliser `src/lib/utils.ts`, ne pas réinventer `Intl.NumberFormat` ailleurs.
- **Erreurs API** : `ApiError` (HTTP non-OK) vs `ApiConfigError` (env var absente) — distinguer côté appelant pour afficher un message utile.

### UI

- Tout en **français**. `<html lang="fr">`. Routes FR. Apostrophes typographiques (`’`) ou échappées (`&apos;`) selon contexte JSX.
- Design system non formalisé (palette zinc-\* temporaire). **Avant de créer de nouveaux composants UI génériques**, vérifier auprès du product owner — le theming est prévu en fin de projet (cf. décisions verrouillées).
- `AGENT_PHONE`, dropdown `Secteurs`, handles sociaux = **placeholders** attendant les infos de l'agent (cf. §12 du cahier des charges). Ne pas inventer.

### Contraintes légales (non négociables — cf. §7 cahier des charges)

Footer réglementaire présent sur toutes les pages (carte T/G, garant, médiateur, RCS/SIRET). Affichage DPE/GES obligatoire sur fiche bien. Mention RGPD sur **tout** formulaire. Toute page nouvelle qui embarque un formulaire ou un bloc transactionnel doit respecter ces contraintes dès la première version.

### Commits

- Pre-commit Husky lance Biome sur les fichiers staged. Si ça échoue, corriger — **ne pas** contourner avec `--no-verify` sauf accord explicite.
- Pas de convention de commit imposée pour l'instant ; rester concis et descriptif.

## Règles d'or

1. SEO prioritaire → Server Component + `metadata` dynamique + URL parlante, pas d'état client pour du contenu indexable.
2. `PUBLIC_API_KEY` ne doit **jamais** atteindre le bundle client. Importer `src/lib/api/*` uniquement depuis du code serveur.
3. Ne jamais régresser sur les obligations légales (DPE/GES, honoraires, mentions carte T/G, RGPD).
4. Privilégier l'édition des helpers existants (`src/lib/api/*`, `src/lib/utils.ts`) à la création d'une nouvelle abstraction.
5. En cas de doute produit → `docs/cahier-des-charges.md`. En cas de doute technique Next 16 → `node_modules/next/dist/docs/`.
