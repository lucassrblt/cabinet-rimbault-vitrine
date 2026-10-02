import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ListeBiens, TitreBiens } from "@/components/site/Listing";
import { FinCarte } from "@/components/site/ListingVariants";
import {
  FinCriteres,
  FinPhrase,
  FinProchain,
  FinVitrine,
} from "@/components/site/SearchRequest";
import { getProperties } from "@/lib/api/properties";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nos biens à vendre à Asnières-sur-Seine",
};

// Fin de liste : versions à comparer avant d'en retenir une.
const FINS: { id: string; name: string; node: ReactNode }[] = [
  { id: "actuelle", name: "Actuelle", node: <FinCarte /> },
  { id: "phrase", name: "A. La phrase", node: <FinPhrase /> },
  { id: "prochain", name: "B. Le prochain bien", node: <FinProchain /> },
  { id: "criteres", name: "C. Les critères", node: <FinCriteres /> },
  { id: "vitrine", name: "D. La vitrine", node: <FinVitrine /> },
];

export default async function NosBiens({
  searchParams,
}: PageProps<"/maquettes/biens">) {
  const { fin } = await searchParams;
  const current = FINS.find((f) => f.id === fin) ?? FINS[1];
  const items = [...(await getProperties())].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <main className="conteneur pt-12 pb-40 md:pt-20 md:pb-44">
      <TitreBiens items={items} />
      <div className="mt-16 md:mt-24">
        {items.length === 0 ? (
          <p className="max-w-[52ch]">Aucun bien en ligne en ce moment.</p>
        ) : (
          <ListeBiens items={items} />
        )}
      </div>
      <div id="fin" className="mt-24 scroll-mt-32 md:mt-32">
        {current.node}
      </div>

      {/* Sélecteur de comparaison, retiré une fois la version choisie. */}
      <nav
        aria-label="Versions à comparer"
        className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-3"
      >
        <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-plaque bg-encre/92 p-1 text-[0.8125rem] text-blanc shadow-[0_12px_30px_-12px_rgb(36_31_30/0.6)] backdrop-blur-md [scrollbar-width:none]">
          <span className="shrink-0 px-3 text-blanc/60">Fin de liste</span>
          {FINS.map((f) => (
            <a
              key={f.id}
              href={`/maquettes/biens?fin=${f.id}#fin`}
              aria-current={f.id === current.id ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-[2px] px-3.5 py-1.5 transition-colors",
                f.id === current.id
                  ? "bg-blanc text-encre"
                  : "hover:bg-blanc/15",
              )}
            >
              {f.name}
            </a>
          ))}
        </div>
      </nav>
    </main>
  );
}
