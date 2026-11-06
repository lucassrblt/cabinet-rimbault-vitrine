# Brief d'équipe — implémentation des deux variantes en live (5/11/2026)

## Objectif
Implémenter **dans la vitrine Next.js** les deux directions retenues en 4e passe, pour que le client les compare **en vrai** (vraies routes, vraies données de l'API, responsive réel) :
- **Index et aperçu** — maquette de référence : `docs/maquettes-2026-11-v4/apercu.html` (+ `captures/apercu-*.png`) ;
- **Galerie chaude** — maquette de référence : `docs/maquettes-2026-11-v4/chaude.html` (+ `captures/chaude-*.png`).
Brief de design (fait foi pour l'esprit) : `docs/maquettes-2026-11-v4/BRIEF.md`. Relis-le : photos en **vraie couleur**, jamais de duotone ni de teinte rouge sur les images ; aucune animation sur les images ; mouvement mesuré ; esprit galerie d'art ; DPE/GES échelle officielle 2021 (GES violets).

## Lire avant de coder
- `AGENTS.md` : **Next.js 16**, APIs différentes de ta mémoire. Lis le guide concerné dans `node_modules/next/dist/docs/` avant d'écrire (routes, `params` asynchrones, `next/font`, `next/image`, metadata…).
- Couche données à **réutiliser telle quelle** : `src/lib/api/properties.ts` (`getProperties`, `getProperty`), types `src/lib/api/types.ts`, infos du cabinet `src/lib/agency.ts`, avis `src/lib/reviews/`. Regarde comment les pages existantes `src/app/(site)/page.tsx`, `src/app/(site)/biens/[reference]/page.tsx` et les composants `src/components/property/*` formatent prix, surfaces, DPE/GES, photos (`next/image`, domaine Supabase déjà autorisé) : réutilise les helpers de `src/lib/property/*` plutôt que de réinventer.
- Ne JAMAIS inventer de données : tout vient de l'API ou d'`agency.ts` ; une valeur absente (`null`) n'est pas affichée.

## Où écrire (dossiers disjoints, deux agents en parallèle)
- Variante Aperçu : routes sous `src/app/v/apercu/` → URLs `/v/apercu`, `/v/apercu/biens`, `/v/apercu/biens/[reference]`, `/v/apercu/le-cabinet` ; composants dans `src/variantes/apercu/`.
- Variante Chaude : routes sous `src/app/v/chaude/` → `/v/chaude`, `/v/chaude/biens`, `/v/chaude/biens/[reference]`, `/v/chaude/le-cabinet` ; composants dans `src/variantes/chaude/`.
- Chaque variante a son propre `layout.tsx` (en-tête, pied, polices via `next/font/google` déclarées dans son dossier, fond), et des liens internes qui restent **dans la variante** (`/v/<slug>/…`).
- Styles : **CSS Modules** (`*.module.css`) dans le dossier de la variante. N'utilise pas les jetons Tailwind (la palette par défaut est retirée dans `globals.css`). Le layout racine pose un fond crème sur `body` : ton layout pose son propre fond plein écran.
- **Ne touche à rien d'autre** : pas `src/app/(site)`, pas `src/components`, pas `globals.css`, pas `layout.tsx` racine, pas `src/app/comparer`, pas l'autre variante, pas `package.json` (aucune dépendance à ajouter). Ne commite rien, ne change pas de branche.
- Ajoute `robots: { index: false, follow: false }` dans les metadata du layout de ta variante (banc de démonstration).

## Périmètre fonctionnel (les deux)
Accueil, liste des biens, fiche bien (galerie au clic, infos clés, prix et honoraires tels que l'API les donne, DPE/GES, description, contact : bouton « Demander une visite » qui renvoie vers `/contact` du site existant et le téléphone d'`agency.ts`), page Le cabinet (devanture : utilise `docs/maquettes-2026-11-v4/img/devanture.jpg` copiée dans `public/variantes/devanture.jpg` — la variante Aperçu la copie, la Chaude la réutilise ; si elle n'existe pas encore quand tu en as besoin, copie-la toi-même avec `cp`, même chemin), pied de page avec les mentions légales d'`agency.ts`. Responsive 390 → 1440 px, accessible (clavier, focus, alt), `prefers-reduced-motion`.
- **Aperçu** : la liste des biens est le cœur ; aperçu au mur qui change en fondu au survol/focus ; **le clic sur une ligne ouvre la fiche** (décision UX), l'aperçu reste pour le survol et le clavier. Sur mobile : suite d'œuvres (photo + cartel).
- **Chaude** : accrochage de galerie sur la page Biens — il doit **fonctionner pour 1 à 12 biens** (motif d'accrochage qui se répète, pas une composition codée pour 5) ; mur grenat du cabinet ; onglets de fiche.

## Environnement de démo (déjà lancé, ne le relance pas)
- API factice : `http://127.0.0.1:3101/api/public` (scénario par défaut = 5 biens réels). Pour tester d'autres volumes : `curl -X POST -d '{"name":"n12"}' http://127.0.0.1:3101/__mock/scenario` (n1, n2, n4, n5, n12, empty, default) — **remets toujours `default` après**.
- Serveur Next de démo : `http://localhost:3310` (rechargement à chaud). **Ne lance pas d'autre `next dev`** (verrou du dossier de build). Ne lance pas `next build`.
- Comparateur : `http://localhost:3310/comparer`.
- Vérifications : `npx tsc --noEmit` et `npx biome check src/app/v/<slug> src/variantes/<slug>` doivent être propres sur tes fichiers. Captures Playwright (installé, script dans ton scratchpad) à 1440 et 390 px de chaque page, rangées dans `docs/variantes/captures/<slug>-*.png`, et compare-les à la maquette.
