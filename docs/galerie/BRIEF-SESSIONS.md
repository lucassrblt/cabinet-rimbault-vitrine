# Brief commun — sessions « Galerie » (06/11/2026)

## Décision du client
Le site garde **uniquement le thème Galerie** (ex-« Galerie chaude », 4e passe). Il vit sous **`/galerie`** sur la branche `galerie` :
- code des pages : `src/app/galerie/` ; composants et styles partagés : `src/variantes/galerie/` ;
- pages existantes : accueil `/galerie`, salle des biens `/galerie/biens`, fiche `/galerie/biens/[reference]`, le cabinet `/galerie/le-cabinet`, 404 de la galerie ;
- l'en-tête pointe déjà vers `/galerie/vendre` et `/galerie/contact` (404 tant qu'elles n'existent pas).
Le reste du site (`src/app/(site)`, `(tunnel)`) est l'ancienne refonte : on n'y touche pas, on peut **réutiliser** sa logique (server actions, validation, API), pas son style.

Pages cibles : **Accueil**, **Biens = la page galerie**, **Vendre** (processus de vente + petit tunnel pour capter des vendeurs), **Contact**.

## Esprit (fait foi) — lire avant tout
- `docs/maquettes-2026-11-v4/BRIEF.md` et la maquette `docs/maquettes-2026-11-v4/chaude.html` ;
- le code existant de la galerie (`src/app/galerie`, `src/variantes/galerie`) : c'est la référence visuelle et technique à prolonger.
Règles : galerie d'art, vide généreux, cartels, typo petite (Host Grotesk) + une phrase serif (Newsreader) au plus par section ; murs blanc chaud / crème / poudré, grenat en aplats ou typo **jamais sur les photos** ; photos en vraie couleur, **aucune animation sur les images** ; mouvement mesuré (200–700 ms, une fois) ; `prefers-reduced-motion` ; accessible (clavier, focus, contrastes AA, un seul h1) ; responsive 320 → 1440 px.
**Textes : rien d'inventé.** Reprends les textes validés de la refonte (`src/components/home/*`, `src/components/owners/*`, `src/content/*`, `src/app/(site)/vendre`, `src/app/(site)/contact`, `src/lib/agency.ts`) et adapte le ton. Toute information absente → « [à confirmer] ».

## Technique
- **Next.js 16** : lis `AGENTS.md` et le guide concerné dans `node_modules/next/dist/docs/` avant d'écrire.
- Données : `src/lib/api/*` (`getProperties`, `getProperty`, `postEvaluation`, `postContact`), `src/lib/agency.ts`, `src/lib/reviews/google.ts`. Formulaires : réutilise la logique des server actions existantes (`src/app/(tunnel)/estimation/actions.ts`, `src/app/(site)/contact/actions.ts`) et la validation de `src/lib/forms/`, `src/lib/estimation/` ; consentement RGPD obligatoire comme sur le site.
- Styles : CSS Modules dans ton propre dossier. Pas de jetons Tailwind.
- `robots: noindex` est posé par `src/app/galerie/layout.tsx` (banc).

## Règles de travail en parallèle (trois sessions, trois worktrees)
- Chaque session a **son périmètre de fichiers** (voir sa mission). Les fichiers partagés de `src/variantes/galerie/` (base.module.css, Nav, Pied, Cartel, data.ts…) appartiennent à la session **Accueil & Biens** ; les autres sessions peuvent les **importer** mais pas les modifier : crée tes propres fichiers (ex. `src/variantes/galerie/vendre/`). Si tu as besoin d'un changement partagé, écris-le dans ton rapport final.
- Commite sur **ta branche de worktree** par petites étapes avec des messages clairs. Ne pousse pas, ne fusionne pas, ne touche pas à `main` ni à `galerie`.
- **Ne commite jamais** `node_modules`, `.next*`, `.claude/`, captures.

## Démarrer ton environnement live (une fois)
1. Dans ton worktree : `npm ci` (les worktrees n'ont pas de `node_modules`).
2. L'API factice tourne déjà sur `http://127.0.0.1:3101/api/public` (5 biens réels). Si elle ne répond pas (`curl -s http://127.0.0.1:3101/__mock/health`), lance-la toi-même : `node e2e/mock-api.mjs`. **Ne change pas son scénario** (elle est partagée) ; les POST `/evaluation` et `/contact` y sont enregistrés sans rien envoyer.
3. Crée `.claude/launch.json` dans ton worktree (non commité) avec ta configuration, puis démarre-la avec l'outil `preview_start` pour que l'utilisateur voie tes changements en direct dans le navigateur :
   `sh -c "PUBLIC_API_URL=http://127.0.0.1:3101/api/public PUBLIC_API_KEY=e2e-test-key NEXT_DIST_DIR=.next-live npx next dev -p <TON_PORT>"`
   Ports : Accueil & Biens **3401**, Vendre **3402**, Contact **3403**.

## Propositions avant implémentation
Avant de coder ta page, publie **2 ou 3 propositions de mise en page** (mini-maquettes HTML statiques dans un artefact avec des onglets, vraies données, esprit galerie), avec ta recommandation. Puis implémente directement ta recommandation pour que l'utilisateur la voie vivre dans le navigateur ; s'il en préfère une autre dans ta session, bascule.

## Fin de mission
`npx tsc --noEmit` et `npx biome check <tes dossiers>` propres, vérification à 1440 / 768 / 390 px, commit final sur ta branche, et rapport : branche, commits, URLs, ce qui reste à valider par le client, changements partagés demandés.
