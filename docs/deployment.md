# Déploiement — Netlify

Le site vitrine est déployé sur Netlify. Ce fichier centralise ce qu'un agent (humain ou Claude) doit savoir pour intervenir sans casser prod ou preview.

## Environnements

| Environnement | Branche / contexte Netlify | Rôle |
|---|---|---|
| **Production** | `main` (contexte *Production*) | Site public cabinet-rimbault.fr |
| **Preview** | toute PR (contexte *Deploy Preview*) | URL jetable par PR, pointe sur l'API admin de staging |
| **Development** | local | `next dev` + `.env.local` |

## Variables d'environnement

Toutes les variables sont **server-only**. **Aucune** ne doit être préfixée `NEXT_PUBLIC_`. La clé API ne doit jamais atteindre le bundle client.

| Variable | Obligatoire | Exemple | Où la configurer |
|---|---|---|---|
| `PUBLIC_API_URL` | oui | `https://admin.cabinet-rimbault.fr/api/public` | Netlify → Project configuration → Environment variables (contextes *Production* + *Deploy previews*) |
| `PUBLIC_API_KEY` | oui | clé fournie par le back-office | idem — **marquer comme secret** |
| `GOOGLE_PLACES_API_KEY` | non | clé Google Cloud, *Places API (New)* | idem — **marquer comme secret** |
| `GOOGLE_PLACE_ID` | non | `ChIJ…` (fiche Google du cabinet) | idem |
| `MAINTENANCE_MODE` | non | `on` pour activer le gate, vide sinon | Netlify → contexte *Production* uniquement |
| `MAINTENANCE_BYPASS_TOKEN` | si gate actif | `openssl rand -hex 24` | Netlify — **marquer comme secret** |

Les variables Netlify se définissent par **contexte de déploiement** (*Production*, *Deploy previews*, *Branch deploys*, *Local development*). Les contextes preview doivent pointer vers l'API admin de staging.

Les deux variables `GOOGLE_*` alimentent la section « Avis clients ». Si l'une manque, les avis sont **désactivés** proprement en production (les sections disparaissent) — aucune erreur. En développement, des données de démo prennent le relais.

En local : copier `.env.local.example` en `.env.local` et remplir. Le fichier `.env*` est git-ignoré sauf `.env.local.example`.

### Gate « Site en cours de développement »

Quand `MAINTENANCE_MODE=on`, le proxy (`src/proxy.ts`) rewrite toutes les requêtes publiques vers `/maintenance` (URL d'origine conservée dans la barre d'adresse), et `robots.txt` / `sitemap.xml` sont neutralisés pour bloquer toute indexation.

**Bypass pour utilisateurs autorisés** :

1. Visiter une fois `https://cabinet-rimbault.fr/?preview=<MAINTENANCE_BYPASS_TOKEN>`.
2. Le middleware redirige vers `/` (sans le query param) et pose le cookie `site-preview` (httpOnly, secure, sameSite=lax, 30 jours).
3. L'utilisateur navigue ensuite normalement sur tout le site, jusqu'à expiration du cookie ou changement du token.

**Désactiver le gate au launch** : retirer (ou vider) `MAINTENANCE_MODE`, puis redéployer. Le proxy redevient no-op, le site est public.

**Rotation du token** : changer la valeur de `MAINTENANCE_BYPASS_TOKEN` et redéployer invalide instantanément tous les cookies déjà posés (la comparaison strict-equal échoue) — utile si un token a fuité.

### Vérifier qu'aucune clé ne fuite côté client

Le fichier `src/lib/api/client.ts` importe `"server-only"` : toute tentative d'import dans un Client Component fait échouer le build. Ne jamais retirer cet import.

## Build

- `next build` via Netlify (`@netlify/plugin-nextjs`, runtime Next.js auto-détecté — pas de `netlify.toml` dédié), Node.js 20+.
- Runtime : Node (pas Edge). Les handlers qui lisent `process.env` ou font du `fetch` avec cache tags restent en Node par défaut.
- Le SSR tourne en fonction Netlify : après inactivité, la première requête paie un *cold start* (~1–2 s de TTFB observés) avant que le cache durable ne reprenne la main.

## Images distantes

`next.config.ts` autorise `*.supabase.co` (`/storage/v1/object/public/**`, photos de biens) et `*.googleusercontent.com` (photos de profil des avis Google). Si une source d'images change, mettre à jour `remotePatterns` avant le merge — sinon `next/image` throw en prod.

## Cache & revalidation

- `apiFetch` applique `revalidate: 300` par défaut (ISR 5 min) — couvre les listings.
- Fiche bien (`getPropertyByReference`) et biens similaires (`getSimilarProperties`) : `revalidate: 600` (ISR 10 min).
- Fiches biens pré-rendues au build via `generateStaticParams` dans `src/app/(site)/bien/[reference]/page.tsx` (jusqu'à 200 biens). Les biens créés après le build sont rendus à la volée puis cachés via ISR (`dynamicParams` reste à `true`, défaut Next 16).
- Cache tags : `properties`, `properties:sale`, `properties:rent`, `properties:recent`, `property:<reference>`.
- Avis Google : `revalidate: 86400` (ISR 24 h), tag `reviews`.
- Pour forcer un refresh après publication côté admin, déclencher `revalidateTag("properties")` depuis un route handler (pas encore implémenté — à créer à la demande).

## Domaines

- Production : `cabinet-rimbault.fr` (et `www.` en redirection).
- Preview : `*.netlify.app` (Deploy Previews) — **ne pas** indexer (le gate `MAINTENANCE_MODE` neutralise déjà `robots.txt` ; sinon vérifier qu'un header `x-robots-tag: noindex` couvre bien les previews).

## Vérifs avant merge

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build` en local si la PR touche `next.config.ts`, `layout.tsx`, ou la couche API.
4. Sur le Deploy Preview Netlify de la PR : vérifier qu'une fiche bien rend et que les assets `*.supabase.co` chargent.
