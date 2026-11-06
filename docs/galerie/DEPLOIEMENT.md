# Déploiement de la vitrine (Netlify)

Référence détaillée : `AUDIT-SITE-EN-LIGNE.md`, §3.2 à §3.5. Ce fichier ne garde que l'essentiel.

## Node

- Netlify : `NODE_VERSION=22` (au moins 22.18 ; 24 convient aussi). `prebuild` lance `scripts/check-launch.ts` avec `node` sans compilation, ce qui demande Node ≥ 22.18. Sous Node 20, le build échoue.
- En local : `.nvmrc` (22) et `engines.node` (`>=22.18`) dans `package.json`.

## Variables d'environnement

| Variable | Pendant la porte (préproduction) | À l'ouverture | Deploy Previews |
|---|---|---|---|
| `PUBLIC_API_URL`, `PUBLIC_API_KEY` | posées | idem | API de préproduction |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | posées | idem | idem |
| `SITE_URL` | `https://cabinet-rimbault.fr` | idem | vide ou URL du preview |
| `SITE_ENV` | **absente** | `production` | absente |
| `MAINTENANCE_MODE` | `on` | **supprimée** | absente |
| `MAINTENANCE_BYPASS_TOKEN` | jeton long (`openssl rand -hex 24`), secret | inutile | — |
| `NODE_VERSION` | `22` | idem | idem |

- `SITE_ENV=production` rend `prebuild` strict : le build échoue tant qu'une information bloquante manque (`npm run check:launch -- --strict`). Ne la poser qu'au moment d'ouvrir.
- `NEXT_PUBLIC_SITE_URL` (lue par l'ancien main) ne sert plus : la supprimer.

## Porte de maintenance (`src/proxy.ts`)

- `MAINTENANCE_MODE=on` : toute adresse (toutes méthodes, Server Actions comprises) affiche `/maintenance` (texte « Site en cours de développement », `noindex`), l'adresse demandée restant dans la barre. Les fichiers statiques, `_next/`, `robots.txt` et `sitemap.xml` passent.
- Accès de préproduction : ouvrir n'importe quelle page avec `?preview=<MAINTENANCE_BYPASS_TOKEN>`. Le proxy pose le cookie `site-preview` (httpOnly, secure, 30 jours) et redirige vers la même adresse sans le paramètre. Changer le jeton invalide tous les cookies posés.
- Le cookie étant `secure`, il n'est pas gardé sur `http://localhost` : tester sur un Deploy Preview (avec `MAINTENANCE_MODE=on` posé pour ce contexte) ou derrière HTTPS.
- Porte posée : `robots.txt` interdit tout (`isIndexable()` est faux), le plan du site est vide, les pages portent `noindex`.
- Porte levée (variable absente) : aucun effet ; `/maintenance` répond la 404 générale.
- Les redirections de `next.config.ts` passent avant le proxy : `/acheter` redirige vers `/biens`, qui affiche ensuite la maintenance.
- Tests : `npm run test:unit` (porte, matcher, redirections).

## Ordre de mise en ligne

1. Poser les variables de la colonne « pendant la porte » en **Production**.
2. Publier, puis vérifier `https://cabinet-rimbault.fr` sans cookie (maintenance) et avec `?preview=<jeton>` (site).
3. Ouverture : `npm run check:launch -- --strict` au vert, puis `SITE_ENV=production`, suppression de `MAINTENANCE_MODE`, redéploiement.
