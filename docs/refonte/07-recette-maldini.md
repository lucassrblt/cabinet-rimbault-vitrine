# 07 — Recette de bout en bout (Maldini, lots T et API)

> **Tour 5**, 31/10/2026, après la revue finale n° 3 (D8, C-X10, C-B6, C-P7 faits). Banc : `next dev` port 3404 (`.next-agent-c4`), puis `npm run build` + `next start` port 3405 (`.next-agent-c5`, **sans** `E2E_NO_CACHE`, comme en ligne), mock partagé 3101 (en `default` au départ et à la fin ; aucun POST hors du mock). Un seul worker. Les deux serveurs sont arrêtés, les deux dossiers supprimés, `tsconfig.json` et `next-env.d.ts` remis à leur état d'avant.

### Tour 5 : résultat

| Contrôle | Résultat |
|---|---|
| Lot T : `80` + `90` en dev | 150 tests : 120 réussis, 29 ignorés, 1 échec de test (archive `edge` en mobile : photo `lazy` hors écran restée à opacité 0, pas un défaut ; spec corrigée : chaque photo est amenée à l'écran avant la mesure). Relance : réussie |
| Lot T : `80` en production (frontière D8, 404, fiche inconnue, calage, intertitres, fiches, Le cabinet, Honoraires, légal, illustrations) | 96 tests : **66 réussis, 30 ignorés avec leur raison, 0 échec**. **D8 clos** : `/biens/88.888`, mock en `error` → 200, en-tête, pied, un `h1` « Un problème technique… », téléphone, `meta robots` `noindex` (contrôle ajouté). Captures relues : `captures/T/recette/pages/fiche-error-{desktop,mobile}.png` |
| Nouveau contrôle C-B6 (`80`, « Intertitres en colonnes 1 à 4 », 1440, les 16 pages) | **Réussi partout.** Plus petit écart : 72 px (« Questions fréquentes », Vendre et Louer). « Nos honoraires de vente » : 166 px. Fiches, contact, légal, 404 : aucun intertitre en colonnes 1 à 4 |
| Suite complète, `next dev`, desktop 1440 + mobile 390 (+ 320) | **406 tests : 355 réussis, 51 ignorés avec leur raison, 0 échec** (12,4 min). Les 16 ignorés de plus qu'au tour 4 sont le contrôle C-B6 en mobile (composition côte à côte desktop seulement) |
| `npm run lint` | Propre (196 fichiers) |
| `npx tsc --noEmit` | Propre (C-X10 vérifiée) |
| `npm run build` | Réussi. **Aucune route `/design-system*`** (C-X1 close). `/biens/[reference]` en SSG, révalidation 10 min |
| Tests unitaires `src/lib/property` | 33/33 |
| API `cabinet-rimbault-api` : `npm test` | 45/45 |

### Changements du lot T dans ce tour (`e2e/specs/80-pages.spec.ts` seulement)

- Contrôle C-B6 : colonne 5 calculée sur la grille de 12 du parent (pistes et gouttières), retenue seulement si un voisin occupe la colonne 5 en regard ; fin du texte = bord droit des rectangles de ligne ; ≥ 40 px. Au moins un intertitre exigé sur `/`, `/vendre`, `/louer`, `/honoraires`.
- Frontière de la fiche : si elle répond 200 (rendu ISR de `ServiceError`), `meta robots` doit contenir `noindex`.
- Archive `edge` : attente du fondu de chaque photo, une fois à l'écran.
- « Louer : renvoi du locataire » en `edge` et `empty` : ignoré en production, avec sa raison (`/louer` est statique, générée au build sur `default`, ISR 5 min) ; contrôlé en dev.

### Points ouverts

Aucun défaut vitrine. Restent les bloquants de mise en ligne côté agent (brief §10), inchangés : `check-launch --strict` les refuse.


> **Tour 4**, 31/10/2026. Banc : `next dev` port 3209 (`.next-agent-99`) sur un mock **privé** (port 3309, `E2E_NO_CACHE=1`), pour ne pas changer le scénario du mock partagé 3101 pendant que d'autres agents capturent (3101 non touché). Production : `npm run build` (même dossier) puis `next start` port 3209. Machine chargée par les autres agents : la suite a pris 29,8 min, contre 11,5 au tour 2.

### Tour 4 : résultat

| Contrôle | Résultat |
|---|---|
| Suite complète, `next dev`, desktop 1440 + mobile 390 (+ 320), 4 scénarios | 374 tests : **334 réussis, 35 ignorés avec leur raison, 5 échecs**. 3 échecs = C-X1. 2 = délais de 60 s sous charge (`80` « Le cabinet » mobile, `90` « charge utile » mobile : formulaire pas encore hydraté sur la capture), **réussis en relance isolée** (×2). Ce ne sont pas des défauts |
| Production, sous-ensemble `30/70/75/80` (default, unicité, 404, fiche inconnue, frontière, sans JS, mouvement réduit, C-X1) | 114 tests : **103 réussis, 4 ignorés, 7 échecs**. 3 = C-X1. 2 = mouvement réduit `/biens/10.131` et `/estimation` (délai sous charge, **réussis en relance**, 28/28). 2 = frontière d'erreur de la fiche, voir D8 |
| `npm run lint` | Propre (202 fichiers) |
| `npx tsc --noEmit` | Propre |
| `npm run build` | Réussi, mais liste **encore `/design-system`, `/mouvement`, `/mouvement/suite`** (C-X1) |
| Tests unitaires `src/lib/property` | 33/33 |
| API `cabinet-rimbault-api` : `npm test`, `tsc` | 45/45, propre |

### D8 (nouveau, réel) : fiche rendue à la demande, API en panne, page nue « Internal Server Error »

- Constat (production) : avec le mock en `error`, `GET /biens/88.888` (référence jamais pré-rendue) renvoie **500 et un corps de 21 octets, « Internal Server Error »**. Pas d'en-tête, pas de pied, pas de téléphone : `(site)/error.tsx` n'est pas utilisé. Le journal de `next start` montre `ApiError status 500` levée par le rendu de la fiche. Reproduit sans `E2E_NO_CACHE`. En dev, la frontière s'affiche correctement.
- Pourquoi la spec ne le voyait pas : elle visait `/biens/10.131`, pré-rendue par `generateStaticParams` (ISR 10 min). En production, la page déjà générée reste servie quand l'API tombe (comportement documenté de Next, voulu). **Test corrigé** : il vise `/biens/88.888`, rendue à la demande. Il passe en dev (2/2) et échoue en prod (défaut réel).
- Cas réel : API indisponible et première visite d'une fiche absente du build. Exemples : un bien publié après le déploiement, ou un lien partagé. Le proxy laisse passer (« dans le doute, la page décide »).
- Correction demandée à **Pirlo (lot 2, `(site)/biens/[reference]/page.tsx`)** : sur une erreur d'API autre que 404, ne pas laisser l'exception sortir du rendu statique. Il faut rendre l'état d'erreur sobre de la fiche, avec le même contenu que `(site)/error.tsx` : `h1` « Un problème technique… », téléphone, en-tête et pied. Deux pistes, à arbitrer avec Xavi (lot 0, `error.tsx` et `client.ts`) :
  1. extraire le contenu de `error.tsx` en composant partagé et le rendre depuis la page ;
  2. rendre ce chemin dynamique, afin de ne pas mettre l'état d'erreur en cache ISR.
  
  Acceptation : `E2E_SERVEUR=prod npx playwright test e2e/specs/80-pages.spec.ts -g "frontière"`.
- Note : avec `E2E_NO_CACHE=1` en production, une fiche publiée après le build (`TEST-LOC-1` en `edge`) répondait aussi 500 (`DYNAMIC_SERVER_USAGE`, `no-store` dans une route statique). Sans cette variable, elle répond 200 : c'est un artefact du banc, pas un défaut du site. D7 reste clos.

### Points ouverts

| Propriétaire | Point | Demande |
|---|---|---|
| **Xavi / Lucas** | **C-X1 (bloquant)** : `src/app/design-system/**` toujours présent, routes en 200 en dev et en prod, présentes dans le build | `rm -rf src/app/design-system .next-agent-80 .next-agent-82`, puis `npx playwright test e2e/specs/70-transverses.spec.ts -g "C-X1"` en dev et `E2E_SERVEUR=prod`, et `npm run build` |
| **Pirlo (lot 2)**, avec Xavi (lot 0) | **D8** : page nue « Internal Server Error » en production (ci-dessus) | Correction et critère d'acceptation ci-dessus |
| Tous | `.next-agent-*` abandonnés (une trentaine) à la racine | À supprimer par Lucas (le mien, `.next-agent-99`, compris) |

Changement du lot T dans ce tour : `e2e/specs/80-pages.spec.ts`, la frontière d'erreur de la fiche vise une référence rendue à la demande (`/biens/88.888`). Aucun changement du lot API.

> **Tour 3**, 31/10/2026, après la revue finale n° 2 (C-X8, C-X9, C-P6, C-B4, C-B5 faites ; **C-X1 non faite**, voir ci-dessous). Banc : `next dev` port 3208 (`.next-agent-98`) puis `E2E_SERVEUR=prod` (`next build` + `next start`, même port et même dossier), mock partagé 3101 réutilisé (non arrêté). Captures : `captures/T/recette-rf2/` (dev) et `captures/T/recette-rf2-prod/` (prod).

### Tour 3 : résultat

| Contrôle | Résultat |
|---|---|
| Nouveau contrôle 1 (`90`, « cadre du tunnel aligné sur l'en-tête (C-X8) ») : à 1024 et 1440, bord droit du cadre lait = bord droit de « Quitter », ±1 px | **Réussi** aux deux largeurs (captures `estimation/cadre-1024-desktop.png`, `cadre-1440-desktop.png`) |
| Nouveau contrôle 2 (`70`, chaque page × 4 scénarios × desktop/mobile) : « toutes taxes comprises sur chaque annonce » absent du DOM (texte masqué, attributs et charge RSC compris, espaces normalisées) | **Réussi partout** (C-P6, C-B4 vérifiées) |
| Contrôle ajouté (`70`, « routes de travail retirées (C-X1) ») : `/design-system`, `/design-system/mouvement`, `/design-system/mouvement/suite` en 404 | **Échec, en dev et en prod** : les trois routes répondent 200 |
| `70` + `80` + `90`, `next dev` | 196 tests : **177 réussis, 17 ignorés, 2 échecs** (les deux routes C-X1 ; la troisième était alors mal nommée dans la spec, corrigée depuis) |
| `70` + `80` + `90`, production | 196 tests : **176 réussis, 17 ignorés, 3 échecs** (les trois routes C-X1) |
| Build de production | Réussi, mais **contient encore `/design-system*`** |
| C-X9, C-B5 | Relues sur captures : liste de confirmation au format de `StepsList` ; « Nos honoraires de location » sur deux lignes à 1440 et lisible à 320 |

**Défaut bloquant ouvert (Xavi, C-X1)** : `src/app/design-system/**` est toujours là ; la suppression a été refusée par le garde-fou de permissions de l'environnement (journal, section Xavi). À faire par Lucas : `rm -rf src/app/design-system .next-agent-80 .next-agent-82`, puis `npx playwright test e2e/specs/70-transverses.spec.ts -g "C-X1"` en dev et `E2E_SERVEUR=prod`. Les lignes `-80`/`-82` sont déjà retirées de `tsconfig.json`.


> **Tour 2**, 31/10/2026, après les corrections de la revue finale n° 1 (C-X2 à C-X7, C-P1 à C-P5, C-B1, C-B2). Référence : brief §9 (critères), §5 (propriétaires), A1 à A37, doc 08.
> Banc : `next dev` port 3203 (`.next-agent-93`) sur un mock **privé** (port 3303, `E2E_NO_CACHE=1`) ; contrôles de production sur `npm run build` (même dossier) puis `next start` (même port). Le mock partagé 3101 n'a pas été touché (il tournait, il tourne toujours).

## 1. Résultat global

| Contrôle | Résultat |
|---|---|
| Suite Playwright complète, `next dev`, desktop 1440 + mobile 390 (+ 320 dans le projet mobile), 4 scénarios | **364 tests : 334 réussis, 30 ignorés avec leur raison, 0 échec** (11,5 min) |
| Production (`E2E_SERVEUR=prod`, `next start`) : sans JavaScript, mouvement réduit, transverses `default`, unicité des titres et descriptions, 404 (meta robots), fiche inconnue, frontière d'erreur | **107 réussis, 1 ignoré, 0 échec** |
| `npm run lint` (`biome check`) | Se termine (1 s, D5 clos). **20 erreurs, aucune dans les sources** : `docs/refonte/planche-pirlo.html` (13), JSON de `docs/refonte/illustrations-phase*/` (6), et le format de `tsconfig.json` réécrit par chaque `next dev` (1). `biome check src e2e scripts` + configs : 200 fichiers, propre |
| `npx tsc --noEmit` | Sources propres. Seules erreurs : `validator.ts` généré dans `.next-agent-80`, `-82` et `-92` (dossiers de build d'autres agents encore inclus dans `tsconfig.json`, routes `/design-system` en cours de suppression) |
| `npm run build` (`prebuild` = `check-launch` en rapport seul) | Réussi, 26 routes. `/design-system`, `/design-system/mouvement` et `/suite` y sont **encore** (C-X1 attendue, désormais débloquée) |
| Tests unitaires `src/lib/property` (`node --test --import …/register.mjs`) | 33/33 |
| API `cabinet-rimbault-api` : `npm test` (vitest), `tsc` | 45/45, propre |

## 2. Défauts du tour 1 : tous clos

| # | Vérification (tour 2) | État |
|---|---|---|
| D1 | `70` « unicité » réussi en dev et en prod ; 10.131 : « Appartement 2 pièces de 46,6 m² à Asnières-sur-Seine, 300 000 €. Quartier… », 10.130 : « Appartement 3 pièces de 59,5 m² … 375 000 €. … » | Clos |
| D2 | Prod : `/page-qui-n-existe-pas` 404 avec **une** `meta robots` (`noindex`) ; `/biens/99.999` 404 avec une seule (`noindex, nofollow`) | Clos |
| D3 | `(site)/error.tsx` : h1 à x = 120 à 1440, chapô, « Réessayer » en bouton secondaire (`captures/T/recette/pages/fiche-error-desktop.png`) | Clos |
| D4 | « E‑mail » sur une ligne à 390 px (`estimation/echec-500-mobile.png`) | Clos |
| D5 | `npm run lint` se termine | Clos (reste les `docs/`, voir §4) |
| D6 | `design-system/page.tsx` formaté | Clos ; la route disparaîtra avec C-X1 |
| D7 | Prod : liste mémorisée en `n1`, mock passé en `edge`, `/biens/TEST-LOC-1` répond 200 aussitôt | Clos |

## 3. Nouveaux contrôles (C-M1, C-M2)

- **C-M1** · `20-transition-page` : plus aucune dépendance à `/design-system` ; deux parcours réels (`/` → `/vendre`, `/biens` → `/le-cabinet`), racine qui fond (depuis le haut et page défilée), en-tête jamais recouvert. 12/12 (desktop et mobile). Xavi peut supprimer `src/app/design-system/**` (journal).
- **C-M2 · apostrophe droite** : `70-transverses` signale tout U+0027 dans le texte visible ou lu (`aria-label`, `alt`, `title`), le `<title>` et la meta description, citations d'avis comprises, sur toutes les pages × 4 scénarios × 3 largeurs : aucune.
- **C-M2 · calage des en-têtes** (`80-pages`, 1440) : dernière rangée d'encre de l'image décodée, rapportée à sa boîte rendue et rognée par un cadre `overflow`, contre le bas du bouton grenat : écart < 8 px sur `/`, `/vendre`, `/louer` (`captures/T/recette/calage/`).
- Range du `h1` dans sa boîte à 360 et 375 px sur toutes les pages (demande de la revue du lot 3) : `60-titres-h1-largeur`, réussi.

## 4. Points ouverts (aucun défaut de la suite)

| Propriétaire | Point | Demande |
|---|---|---|
| **Xavi (lot 0)** | C-X1 non faite : `/design-system/**` est dans le build de production | Supprimer le dossier (C-M1 faite), puis relancer `npm run build` |
| **Zidane** (`biome.json`) | `npm run lint` échoue sur `docs/` seulement (planche HTML, JSON des illustrations) | Ajouter `"!docs"` à `files.includes` (demande déjà ouverte par Xavi) |
| **Tous** | `tsconfig.json` garde les lignes de `.next-agent-80` et `-82` (dossiers abandonnés) ; `tsc` lit leurs types générés périmés | Chacun retire ses lignes en rendant la main ; les dossiers `.next-agent-*` abandonnés peuvent être supprimés |
| **Bergkamp (C-B3)** | Le cabinet, « Notre façon de travailler » (C-P4 livré) : deux phrases ne figurent pas dans le texte relu par Bergkamp, « Pas de transfert de dossier, pas de standard. » et « Nos prix de vente s'appuient sur les ventes récentes du quartier, nos loyers sur ceux de logements comparables. » (`captures/T/recette/default/le-cabinet-desktop.png`) | Relecture due : vérifier que ces deux affirmations sont des faits déjà validés, sinon les retirer (Pirlo, lot 6) |
| Zidane (avis) | Louer à 1440 : texte calé en bas, ~400 px de vide au-dessus du `h1` d'une ligne (`calage/louer-desktop.png`) ; conforme à C-B1, à juger à l'œil | Aucune action de test |

Non testable à ce jour, en `skip` avec la raison : carte du secteur et mention OSM (ILL-07, §10-8), tableau du barème (`feeSchedule` nul, §10-2). Bloquants de mise en ligne inchangés : `check-launch --strict` refuse (médiateur, barème, e-mail, `SITE_URL`, directeur de la publication, hébergeur, durée de conservation…).

## 5. Changements du lot T dans ce tour

- `e2e/specs/20-transition-page.spec.ts` : parcours réels (C-M1).
- `e2e/support/recette.ts` + `70-transverses` : contrôle de l'apostrophe droite. `80-pages` : calage des en-têtes à 1440.
- Aucun changement du lot API (45/45).

## 6. Lancer la recette

```sh
MOCK_API_PORT=<mock privé> MOCK_API_KEY=e2e-test-key node e2e/mock-api.mjs &
PORT=<p> NEXT_DIST_DIR=<dossier> PUBLIC_API_URL=http://127.0.0.1:<mock>/api/public PUBLIC_API_KEY=e2e-test-key E2E_NO_CACHE=1 npx next dev -p <p> &
E2E_PORT=<p> MOCK_API_PORT=<mock> E2E_DIST_DIR=<dossier> npx playwright test
# production : NEXT_DIST_DIR=<dossier> npm run build, puis next start -p <p> (mêmes variables), et
# E2E_SERVEUR=prod npx playwright test e2e/specs/{30,70,75,80}* --grep "default|unicité|404|référence inconnue|frontière|sans JavaScript|mouvement|réduit"
```

Captures : `docs/refonte/captures/T/recette/` (`default`, `edge`, `empty`, `error` par page à 1440, 390 et 320 ; `calage`, `grille`, `pages`, `estimation`, `contact`, `sans-js`, `prod-2`).
