# Déploiement de la vitrine (Netlify)

Référence détaillée : `AUDIT-SITE-EN-LIGNE.md`, §3.2 à §3.5. Ce fichier ne garde que l'essentiel.

## Node

- Netlify : `NODE_VERSION=22` (au moins 22.18 ; 24 convient aussi). `prebuild` lance `scripts/check-launch.ts` avec `node` sans compilation, ce qui demande Node ≥ 22.18. Sous Node 20, le build échoue.
- En local : `.nvmrc` (22) et `engines.node` (`>=22.18`) dans `package.json`.

## Variables d'environnement

| Variable | Production, porte posée | Production, à l'ouverture | Deploy Previews |
|---|---|---|---|
| `PUBLIC_API_URL`, `PUBLIC_API_KEY` | posées | idem | API de préproduction |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | posées | idem | idem |
| `NEXT_PUBLIC_SITE_URL` | `https://cabinet-rimbault.fr` | idem | **absente** (l'URL du preview vient de `DEPLOY_PRIME_URL`) |
| `NEXT_PUBLIC_ALLOW_INDEXING` | absente (ou `true` : sans effet tant que la porte est posée) | `true` | **absente** (sans effet de toute façon) |
| `SITE_ENV` | **absente** | `production` | absente |
| `MAINTENANCE_MODE` | `on` | **supprimée** | `on` si l'on veut tester la porte |
| `MAINTENANCE_BYPASS_TOKEN` | jeton long (`openssl rand -hex 24`), secret | inutile | idem si porte posée |
| `NODE_VERSION` | `22` | idem | idem |
| `SITE_URL` | **à supprimer** (plus lue) | — | — |

### URL publique (`src/lib/site-url.ts`, source unique)

Canonique, `og:image`, JSON-LD, `robots.txt` et plan du site en dérivent (`metadataBase` du layout racine ; chaque page pose sa canonique relative). Ordre :

1. `NEXT_PUBLIC_SITE_URL` (https, sauf hôte local) ;
2. sur Netlify : `URL` si `CONTEXT=production`, sinon `DEPLOY_PRIME_URL` (deploy preview, branch deploy) ;
3. `http://localhost:${PORT ?? 3000}` en développement (`next dev`) et en test seulement.

Build de production sans URL déterminable : **le build échoue** (message « URL publique du site introuvable… »), au lieu de publier des canoniques en `localhost`. En local : `NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run build`. Le banc e2e (`E2E_SERVEUR=prod`) la pose lui-même (`playwright.config.ts`).

**Les variables `NEXT_PUBLIC_*` sont figées au build** : après l'ajout ou la modification dans Netlify, **redéployer** (« Clear cache and deploy site » si besoin). Les variables Netlify (`CONTEXT`, `URL`, `DEPLOY_PRIME_URL`) sont figées de même par `next.config.ts` (`env`).

### Indexation

Indexable = `NEXT_PUBLIC_ALLOW_INDEXING=true` **et** porte de maintenance levée (`MAINTENANCE_MODE` ≠ `on`) **et** (hors Netlify **ou** `CONTEXT=production`). Les deploy previews ne sont donc jamais indexables. Hors indexation : `robots.txt` en `Disallow: /`, plan du site vide, `noindex, nofollow` sur chaque page. En indexation : `Allow: /`, ligne `Sitemap:`, `index, follow`.

- `SITE_ENV=production` ne pilote plus l'indexation : elle rend seulement `prebuild` strict (le build échoue tant qu'une information bloquante manque, dont `NEXT_PUBLIC_SITE_URL` en https ; `npm run check:launch -- --strict`). Ne la poser qu'au moment d'ouvrir.

## Porte de maintenance (`src/proxy.ts`)

- `MAINTENANCE_MODE=on` : toute adresse (toutes méthodes, Server Actions comprises) affiche `/maintenance` (texte « Site en cours de développement », `noindex`), l'adresse demandée restant dans la barre. Les fichiers statiques, `_next/`, `robots.txt` et `sitemap.xml` passent.
- Accès de préproduction : ouvrir n'importe quelle page avec `?preview=<MAINTENANCE_BYPASS_TOKEN>`. Le proxy pose le cookie `site-preview` (httpOnly, secure, 30 jours) et redirige vers la même adresse sans le paramètre. Changer le jeton invalide tous les cookies posés.
- Le cookie étant `secure`, il n'est pas gardé sur `http://localhost` : tester sur un Deploy Preview (avec `MAINTENANCE_MODE=on` posé pour ce contexte) ou derrière HTTPS.
- Porte posée : `robots.txt` interdit tout (`isIndexable()` est faux, quelle que soit `NEXT_PUBLIC_ALLOW_INDEXING`), le plan du site est vide, les pages portent `noindex`.
- Porte levée (variable absente) : aucun effet ; `/maintenance` répond la 404 générale.
- Les redirections de `next.config.ts` passent avant le proxy : `/acheter` redirige vers `/biens`, qui affiche ensuite la maintenance.
- Tests : `npm run test:unit` (porte, matcher, redirections).

## Ordre de mise en ligne

1. Poser les variables de la colonne « porte posée » en **Production** (dont `NEXT_PUBLIC_SITE_URL`), supprimer `SITE_URL`, redéployer.
2. Publier, puis vérifier `https://cabinet-rimbault.fr` sans cookie (maintenance) et avec `?preview=<jeton>` (site).
3. Ouverture : `npm run check:launch -- --strict` au vert, puis `SITE_ENV=production` et `NEXT_PUBLIC_ALLOW_INDEXING=true` (contexte Production seulement), suppression de `MAINTENANCE_MODE`, redéploiement. Contrôler ensuite `/robots.txt` (`Allow: /` + `Sitemap:`) et la canonique de l'accueil.
