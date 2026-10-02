import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  FinCarte,
  HeadCompteur,
  HeadPhrase,
  ListeAlternee,
  ListeCarrousel,
  ListeDecalee,
  ListeMosaique,
} from "@/components/site/ListingVariants";
import { getProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nos biens à vendre à Asnières-sur-Seine",
};

// Compositions complètes à comparer : en-tête de page + liste.
// La fin de liste (carte recherche) est validée et commune à toutes.
const VARIANTES: {
  id: string;
  name: string;
  head: (items: Property[]) => ReactNode;
  list: (items: Property[]) => ReactNode;
}[] = [
  {
    id: "1",
    name: "Phrase + carrousel",
    head: (items) => (
      <HeadPhrase count={items.length} latest={items[0]?.createdAt} />
    ),
    list: (items) => <ListeCarrousel items={items} />,
  },
  {
    id: "2",
    name: "Phrase + liste alternée",
    head: (items) => (
      <HeadPhrase count={items.length} latest={items[0]?.createdAt} />
    ),
    list: (items) => <ListeAlternee items={items} />,
  },
  {
    id: "3",
    name: "Compteur + grille décalée",
    head: (items) => <HeadCompteur count={items.length} />,
    list: (items) => <ListeDecalee items={items} />,
  },
  {
    id: "4",
    name: "Compteur + mosaïque",
    head: (items) => <HeadCompteur count={items.length} />,
    list: (items) => <ListeMosaique items={items} />,
  },
];

export default async function NosBiens({
  searchParams,
}: PageProps<"/maquettes/biens">) {
  const { variante } = await searchParams;
  const current = VARIANTES.find((v) => v.id === variante) ?? VARIANTES[0];
  const items = [...(await getProperties())].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <main className="conteneur pt-10 pb-32 md:pt-16 md:pb-40">
      {current.head(items)}
      <div className="mt-12 md:mt-16">
        {items.length === 0 ? (
          <p className="max-w-[52ch]">Aucun bien en ligne en ce moment.</p>
        ) : (
          current.list(items)
        )}
      </div>
      <div className="mt-24 md:mt-32">
        <FinCarte />
      </div>

      {/* Sélecteur de comparaison, retiré une fois la variante choisie. */}
      <nav
        aria-label="Variantes à comparer"
        className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-3"
      >
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-encre/92 p-1 text-[0.875rem] text-blanc shadow-[0_12px_30px_-12px_rgb(36_31_30/0.6)] backdrop-blur-md [scrollbar-width:none]">
          {VARIANTES.map((v) => (
            <Link
              key={v.id}
              href={`/maquettes/biens?variante=${v.id}`}
              scroll={false}
              aria-current={v.id === current.id ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 transition-colors",
                v.id === current.id
                  ? "bg-blanc text-encre"
                  : "hover:bg-blanc/15",
              )}
            >
              {v.id}. {v.name}
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
