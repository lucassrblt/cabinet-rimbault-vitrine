# Cabinet Rimbault — Site vitrine

Site vitrine d'une agence immobilière indépendante : présentation de l'agence, catalogue
des biens à la vente et à la location, fiches détaillées, demande de contact et demande
d'estimation en ligne. Front public découplé du back-office, alimenté par une API dédiée.

🔗 **En production :** [cabinet-rimbault.fr](https://cabinet-rimbault.fr)

> Architecture en 3 services : **vitrine** (ce repo) ← `cabinet-rimbault-api` (API publique) ←
> `cabinet-rimbault-admin` (back-office). Le découplage permet à la vitrine de rester en ligne
> indépendamment des cycles de déploiement de l'admin.

## Fonctionnalités

- **Catalogue de biens** — listings vente / location avec recherche, filtres et pagination.
- **Fiches détaillées** — galerie, caractéristiques, étiquettes DPE/GES, carte de localisation.
- **Formulaires** — contact et demande d'estimation (validation Zod + React Hook Form),
  création de leads côté API et email de confirmation transactionnel.
- **Avis clients** — intégration Google Places (API New), fallback gracieux si non configuré.
- **SEO** — données structurées JSON-LD, génération statique des pages biens, métadonnées dynamiques.
- **Mode maintenance** — gate « site en cours de développement » avec bypass par token (cookie 30 j).
- **UX** — défilement fluide (Lenis), animations (Framer Motion), barre de progression de navigation.

## Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS v4**
- **TanStack React Query** — data fetching / cache côté client
- **React Hook Form + Zod** — formulaires et validation
- **Framer Motion** + **Lenis** — animations et smooth scroll
- **Biome** (lint + format), **Husky** (pre-commit), **GitHub Actions** (CI)

## Démarrage

```bash
npm ci
cp .env.local.example .env.local   # puis renseigner les variables
npm run dev                        # http://localhost:3001
```

L'API publique (`cabinet-rimbault-api`) doit être joignable via `PUBLIC_API_URL`.

### Variables d'environnement

| Variable | Requise | Description |
|---|---|---|
| `PUBLIC_API_URL` | oui | URL de l'API publique (ex. `http://localhost:3002/api/public`). |
| `PUBLIC_API_KEY` | oui | Clé `X-API-Key` envoyée à l'API (server-only, jamais exposée au client). |
| `GOOGLE_PLACES_API_KEY` | non | Avis Google. Absente → avis désactivés (données de démo en local). |
| `GOOGLE_PLACE_ID` | non | Identifiant de la fiche Google de l'agence. |
| `MAINTENANCE_MODE` | non | `on` pour masquer le site au public. |
| `MAINTENANCE_BYPASS_TOKEN` | non | Token de bypass via `?preview=<token>`. |

Voir `.env.local.example` pour le détail.

## Scripts

| Script | Rôle |
|---|---|
| `npm run dev` | Serveur de dev (port 3001). |
| `npm run build` | Build production. |
| `npm start` | Serveur production. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run lint` / `lint:fix` | Biome check / fix. |
| `npm run format` | Biome format. |

## Structure

```
src/
├── app/            # App Router : (site), actions, maintenance
├── components/     # home, agence, listings, property, contact, estimation, reviews, ui, layout
└── lib/            # api (client X-API-Key), reviews (Google Places), config
docs/               # cahier des charges, wireframes, design system, plan d'implémentation
```

## Documentation

Le dossier [`docs/`](./docs) contient le cahier des charges, les wireframes, le benchmark de
design system, le contrat d'API et le plan d'implémentation du projet.
