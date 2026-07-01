import { PER_PAGE } from "@/lib/listing";

/**
 * Squelette de chargement des pages listing (/acheter, /louer). Server Component
 * affiché via `loading.tsx` dès la navigation, avant que le rendu serveur ne se
 * termine. Les dimensions reproduisent la structure réelle (héro, barre de
 * filtres en chevauchement, grille de PER_PAGE cartes) pour éviter le CLS.
 * Réutilise la classe `.skeleton-shimmer` (globals.css, prefers-reduced-motion).
 */

function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-sm bg-card ring-1 ring-black/5">
      <div className="relative aspect-[4/3] skeleton-shimmer" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="h-3 w-24 rounded-sm skeleton-shimmer" />
        <div className="h-5 w-3/4 rounded-sm skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded-sm skeleton-shimmer" />
        <div className="mt-auto h-7 w-28 rounded-sm skeleton-shimmer" />
      </div>
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <main className="flex flex-1 flex-col" aria-busy="true">
      <section className="border-b border-subtle bg-header">
        <div className="relative min-h-[clamp(20rem,46vw,30rem)] skeleton-shimmer" />
        <div className="relative z-10 mx-auto -mt-12 w-full max-w-7xl px-gutter pb-12 md:-mt-16 md:pb-14">
          <div className="h-[4.5rem] rounded-lg border border-subtle bg-card p-2 shadow-sm md:p-2.5">
            <div className="h-full w-full rounded-md skeleton-shimmer" />
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto w-full max-w-7xl px-gutter py-16 md:py-20">
          <div className="h-5 w-40 rounded-sm skeleton-shimmer" />
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PER_PAGE }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: éléments purement décoratifs, statiques.
              <li key={i}>
                <CardSkeleton />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
