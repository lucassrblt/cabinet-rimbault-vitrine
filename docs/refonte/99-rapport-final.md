# 99 — Rapport final de la refonte (Zidane)

> 31/10/2026. Vitrine `cabinet-rimbault-vitrine`, branche `refonte-grenat-creme` ; API `cabinet-rimbault-api`, branche `feat/notification-agent`. Rien n'est commité ni poussé.
> Sources : brief 00, recette 07 (tour 5), revue finale 08 (n° 4), registre `05-illustrations-depenses.md`, journal d'implémentation, `npm run check:launch -- --strict` relancé ce jour.

## 1. Verdict

**Le site est approuvé côté vitrine** (revue finale n° 4). Je le mettrais en ligne tel quel.

Les quatre corrections de la revue n° 3 sont vérifiées en production (`next build` + `next start`, sans cache coupé) :
- **D8** : quand l'API est en panne, une fiche absente du build répond 200 avec en-tête, pied, un `h1`, le téléphone et `noindex` ; plus de page nue « Internal Server Error » ;
- **C-B6** : « Nos honoraires / de vente » en deux lignes, 166 px du texte à 1440 ;
- **C-P7** : options et champs du tunnel sur la même gouttière de 24 px, bords alignés à 0 px ;
- **C-X10** : build sans `/design-system`, `tsc` et lint propres.

La demande est tenue :
- le cabinet dit « nous » et l'agent n'apparaît sur aucune photo ;
- il n'y a ni moteur de recherche ni filtre ;
- la vente, la location et l'estimation ont chacune leur page ;
- le tunnel aboutit dans la boîte de l'agent ;
- le grenat et la crème sont tenus, sans effet « vibe codé ».

**La mise en ligne reste bloquée** par les seules informations à fournir par l'agent (§5) : `check-launch --strict` les refuse.

## 2. Ce qui a été livré

**Pages (vitrine, Next.js 16)**

| Groupe | Pages |
|---|---|
| Biens | accueil `/`, liste unique `/biens` (sans filtre, état vide rédigé), fiche `/biens/[reference]` (visionneuse au clavier et au toucher, étiquettes DPE/GES, biens similaires), `/biens-introuvable` |
| Propriétaires | `/vendre`, `/louer` |
| Cabinet | `/le-cabinet`, `/honoraires`, `/contact` |
| Mentions | `/mentions-legales`, `/confidentialite` |
| Erreurs | 404 générale, frontière d'erreur `(site)/error.tsx`, `global-error.tsx` |
| Référencement | `robots`, `sitemap`, Open Graph, icônes, JSON-LD |

**Composants**, dans `src/components/` :
- `ui` : design system de Pirlo, planche `docs/refonte/planche-pirlo.html` ;
- `layout` : en-tête, pied, menu mobile, `PageIntro`, `ProsePage` ;
- les composants par domaine : `property`, `home`, `owners`, `agency`, `estimation`, `forms` ;
- `motion` : liste fermée du §7, respect de « mouvement réduit » ;
- `illustrations` et `brand` : ILL-01, 03, 05, 06, 08 et 09 au trait, logotype et monogramme.

**Tunnel d'estimation** `/estimation`, en 4 étapes :
- validation accessible, case RGPD obligatoire, un seul envoi même sur un double clic ;
- la charge utile envoie `intent` et un `message` structuré, sans `timeframe` ;
- à la confirmation, le focus va sur le `h1` et le `sessionStorage` est vidé ;
- le formulaire de contact suit les mêmes règles ;
- un `proxy.ts` remplace le middleware (Next 16).

**API** (`cabinet-rimbault-api`) :
- notification à l'agent pour les routes `contact` et `evaluation`, avec gabarits d'e-mail, `mailer` et validation `public-forms` ;
- accusés de réception remis en forme ;
- tests vitest, CI mise à jour ;
- compatible avec la vitrine actuelle, qui envoie déjà `rgpd: true`.

## 3. Lancer et tester (vitrine)

```sh
cp .env.local …                      # PUBLIC_API_URL, PUBLIC_API_KEY (lecture seule)
npm run mock:api &                   # API factice sur 3101, scénarios default / empty / error / edge
PUBLIC_API_URL=http://127.0.0.1:3101/api/public PUBLIC_API_KEY=e2e-test-key npm run dev
npm run lint && npx tsc --noEmit     # propres au 31/10 (196 fichiers, 0 erreur)
npx playwright test                  # recette complète, desktop 1440 et mobile 390/320 ; détail : doc 07 §6
npm run check:launch -- --strict     # refuse la mise en ligne tant qu'une information bloquante manque
```

API : `npm test` (45/45), `tsc`, puis `./scripts/smoke.sh` après le déploiement (lecture seule).

## 4. État des tests (recette Maldini tour 5, revue Zidane n° 4)

**`next dev`, suite complète** (1 worker, 12,4 min) : 406 tests, **355 réussis, 51 ignorés avec leur raison** (carte du secteur, barème absent, projet desktop ou mobile), **0 échec**.

**Production** (`next start`, sans `E2E_NO_CACHE`) :
- spec `80` filtrée sur les cas de production (Maldini) : 96 tests, 66 réussis, 30 ignorés, **0 échec**, frontière D8 comprise ;
- revue n° 4, spec `80` sans filtre : 76 réussis, 30 ignorés, 20 échecs, **tous des artefacts de banc** : ils changent le scénario du mock sur `/` et `/biens`, pages statiques générées au build (ISR 5 min). À ignorer en production dans la spec (hygiène, sans défaut du site) ;
- passage de revue sur 16 URL à 1440 et 390 : statuts attendus, un `h1`, aucun débordement, aucune erreur console hors 404, aucune chaîne interdite.

**Autres contrôles** :
- tests unitaires de `src/lib/property` : 33/33 ;
- API : 45/45 ;
- `npm run lint` (196 fichiers) et `tsc` : propres ;
- `npm run build` : réussi, aucune route `/design-system`, `/biens/[reference]` en SSG (révalidation 10 min).

## 5. Bloquants de mise en ligne côté agent (`check-launch --strict`, 9 manquants)

**Bloquants** :
1. Médiateur de la consommation (nom, adresse, site). La mention est masquée dans le pied d'ici là.
2. E-mail public du cabinet, et adresse `AGENCY_NOTIFICATION_EMAIL` sur l'API.
3. `SITE_URL`, le domaine en https.
4. Barème d'honoraires vente et location, avec sa date d'effet. Un marqueur reste dans `src/content/honoraires.ts`.
5. Directeur de la publication.
6. Adresse du garant financier.
7. Hébergeur du site.
8. Durée de conservation des données. La proposition est de 3 ans.

**À compléter, non bloquant** :
- horaires (masqués d'ici là) ;
- communes du secteur (carte ILL-07) ;
- URL de la fiche Google.

**Données à corriger dans l'admin** :
- coûts d'énergie de 09.345 et 10.131 ;
- surface de 09.345 ;
- incohérences de 10.131 (2011 ou 2012, 1 235 € ou 1 239 €) ;
- orthographe des quartiers et de « Asnieres » ;
- photo de couverture de chaque bien.

**Étiquettes énergie** : il faut lancer `npm run backfill:energy-labels`. 09.345 et 10.131 portent encore les étiquettes d'outils.immo.

## 6. Réserves honnêtes

- **Mise en ligne** : conditionnée au §5 (informations de l'agent, données de l'admin, backfill des étiquettes). C'est la seule réserve bloquante, et elle est hors vitrine.
- **État d'erreur en cache** : depuis D8, une fiche jamais lue avec succès peut garder l'état « problème technique » jusqu'à 10 min après le retour de l'API (une période de révalidation ISR). Accepté et documenté au journal.
- **Spec `80` en production sans filtre** : 20 tests de changement de scénario sur `/` et `/biens` échouent par construction (pages statiques). À marquer « ignoré en production » avec leur raison, comme le renvoi du locataire de `/louer`.
- **Louer à 1024** : « Comment se passe une location » finit à 39 px de la colonne de texte ; le contrôle de 40 px vaut à 1440. Sans contact visible, accepté.
- **Captures pleine page** : les images `lazy` hors écran peuvent y rester vides ; c'est un artefact de Playwright, vérifié en défilement réel.
- **Compte Replicate** : 85 prédictions d'un autre projet y figurent. L'utilisateur a vérifié qu'elles ne relèvent pas de la refonte.

## 7. Dépenses Replicate (registre de Cantona)

| Poste | Images | Coût |
|---|---|---|
| Phase 1, exploration (flux-schnell, un essai recraft-v3-svg) | 18 | 0,131 $ |
| Phase 2, finales (flux-dev, enveloppe de 0,80 $) | 31 | 0,775 $ |
| Enveloppe supplémentaire de 0,40 $ (flux-dev, ILL-09 pour Vendre) | 8 | 0,200 $ |
| **Total équipe** | **57** | **1,106 $** |

Le plafond était de 7 $. Le total a été recoupé avec `GET /v1/predictions`, et aucun appel flux-1.1-pro n'a été fait. Les retouches, ILL-03, le logotype et l'Open Graph ont été faits en local, pour 0 $.

## 8. Ordre de déploiement

1. **Admin** : déployer l'admin, puis lancer `npm run backfill:energy-labels`.
2. **API** :
   - sur Railway, poser `AGENCY_NOTIFICATION_EMAIL` et vérifier `AGENCY_EMAIL_FROM` et `RESEND_API_KEY` ;
   - déployer l'API ;
   - lancer `./scripts/smoke.sh`, en lecture seule.
3. **Vitrine**, une fois `check:launch --strict` au vert :
   - déployer avec `SITE_URL`, `PUBLIC_API_URL` et `PUBLIC_API_KEY` ;
   - faire une demande d'essai **depuis la préproduction** pour vérifier qu'elle arrive dans la boîte de l'agent ;
   - ne jamais envoyer de POST scripté vers la production.
4. **Schéma** : si le schéma change, l'admin le migre, puis l'API régénère son client avant toute suppression de colonne.

## 9. Ménage (revue n° 4)

- **Serveurs** : le `next start` de la revue (3406) et le mock partagé 3101 sont arrêtés. Aucun serveur de l'équipe ne tourne. Les serveurs 3000 et 3310 appartiennent à `y2k-shop` et n'ont pas été touchés.
- **Dossiers** : `.next-agent-c6` supprimé ; aucun `.next-agent-*` ne reste. `tsconfig.json` ne cite aucun dossier d'agent ; `next-env.d.ts` est remis sur `.next/dev/types`.
- **Captures** : trois dossiers de lots créés à la racine du dépôt (`captures/`) ont été déplacés sous `docs/refonte/captures/`. Aucune capture hors de `docs/`.
- **`git status`** : aucun fichier parasite dans les deux dépôts.
  - Vitrine : sources, `e2e/`, `scripts/`, `playwright.config.ts` et `docs/refonte/` ; ignorés : `.next`, `.next-e2e`, résultats Playwright.
  - API (`feat/notification-agent`) : uniquement le lot de notification et ses tests.
- Rien n'est commité ni poussé.
