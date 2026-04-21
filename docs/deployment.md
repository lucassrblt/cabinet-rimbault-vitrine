# Déploiement — Vercel

Le site vitrine est déployé sur Vercel. Ce fichier centralise ce qu'un agent (humain ou Claude) doit savoir pour intervenir sans casser prod ou preview.

## Environnements

| Environnement | Branche | Rôle |
|---|---|---|
| **Production** | `main` | Site public cabinet-rimbault.fr |
| **Preview** | toute PR | URL jetable par PR, pointe sur l'API admin de staging |
| **Development** | local | `next dev` + `.env.local` |

## Variables d'environnement

Toutes les variables sont **server-only**. **Aucune** ne doit être préfixée `NEXT_PUBLIC_`. La clé API ne doit jamais atteindre le bundle client.

| Variable | Obligatoire | Exemple | Où la configurer |
|---|---|---|---|
| `ADMIN_API_URL` | oui | `https://admin.cabinet-rimbault.fr/api/public` | Vercel → Settings → Environment Variables (Production + Preview) |
| `PUBLIC_API_KEY` | oui | clé fournie par le back-office | idem — **marquer sensible** |

En local : copier `.env.local.example` en `.env.local` et remplir. Le fichier `.env*` est git-ignoré sauf `.env.local.example`.

### Vérifier qu'aucune clé ne fuite côté client

Le fichier `src/lib/api/client.ts` importe `"server-only"` : toute tentative d'import dans un Client Component fait échouer le build. Ne jamais retirer cet import.

## Build

- `next build` via Vercel, Node.js 20+.
- Runtime : Node (pas Edge). Les handlers qui lisent `process.env` ou font du `fetch` avec cache tags restent en Node par défaut.

## Images distantes

`next.config.ts` autorise uniquement `*.supabase.co` (`/storage/v1/object/public/**`). Si le stockage change, mettre à jour `remotePatterns` avant le merge — sinon `next/image` throw en prod.

## Cache & revalidation

- `apiFetch` applique `revalidate: 60` par défaut (ISR 1 min).
- Cache tags : `properties`, `properties:sale`, `properties:rent`, `properties:recent`, `property:<reference>`.
- Pour forcer un refresh après publication côté admin, déclencher `revalidateTag("properties")` depuis un route handler (pas encore implémenté — à créer à la demande).

## Domaines

- Production : `cabinet-rimbault.fr` (et `www.` en redirection).
- Preview : `*.vercel.app` — **ne pas** indexer (header `x-robots-tag: noindex` ajouté par Vercel sur preview automatiquement ; vérifier si un jour on ajoute un middleware).

## Vérifs avant merge

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build` en local si la PR touche `next.config.ts`, `layout.tsx`, ou la couche API.
4. Sur la PR Vercel : ouvrir la preview, vérifier qu'une fiche bien rend et que les assets `*.supabase.co` chargent.
