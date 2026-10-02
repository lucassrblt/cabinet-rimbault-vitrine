import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ListeBiens,
  TitreGrand,
  TitrePhrase,
  TitreReperes,
  TitreVignettes,
} from "@/components/site/Listing";
import { FinCarte } from "@/components/site/ListingVariants";
import { getProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nos biens à vendre à Asnières-sur-Seine",
};

// La liste et la fin de liste sont validées. Restent à choisir le titre de
// page et le traitement du statut d'ouverture dans l'en-tête.
const TITRES: {
  id: string;
  name: string;
  render: (items: Property[]) => ReactNode;
}[] = [
  { id: "1", name: "Phrase", render: (items) => <TitrePhrase items={items} /> },
  {
    id: "2",
    name: "Repères",
    render: (items) => <TitreReperes items={items} />,
  },
  {
    id: "3",
    name: "Vignettes",
    render: (items) => <TitreVignettes items={items} />,
  },
  {
    id: "4",
    name: "Grand titre",
    render: (items) => <TitreGrand items={items} />,
  },
];

const BANDEAUX = [
  { id: "aucun", name: "Sans statut" },
  { id: "bouton", name: "Dans le bouton" },
  { id: "barre", name: "Dans la barre" },
  { id: "affiche", name: "Affichette" },
];

export default async function NosBiens({
  searchParams,
}: PageProps<"/maquettes/biens">) {
  const params = await searchParams;
  const titre = TITRES.find((t) => t.id === params.titre) ?? TITRES[1];
  const bandeau = BANDEAUX.find((b) => b.id === params.bandeau) ?? BANDEAUX[1];
  const items = [...(await getProperties())].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  // Liens simples (rechargement) : l'en-tête lit sa variante au chargement.
  const link = (t: string, b: string) =>
    `/maquettes/biens?titre=${t}&bandeau=${b}`;

  return (
    <main className="conteneur pt-12 pb-40 md:pt-20 md:pb-44">
      {titre.render(items)}
      <div className="mt-14 md:mt-20">
        {items.length === 0 ? (
          <p className="max-w-[52ch]">Aucun bien en ligne en ce moment.</p>
        ) : (
          <ListeBiens items={items} />
        )}
      </div>
      <div className="mt-24 md:mt-32">
        <FinCarte />
      </div>

      {/* Sélecteur de comparaison, retiré une fois les choix faits. */}
      <nav
        aria-label="Variantes à comparer"
        className="fixed inset-x-0 bottom-4 z-40 flex flex-col items-center gap-1.5 px-3"
      >
        {[
          {
            label: "Titre",
            items: TITRES,
            current: titre.id,
            href: (id: string) => link(id, bandeau.id),
          },
          {
            label: "Statut",
            items: BANDEAUX,
            current: bandeau.id,
            href: (id: string) => link(titre.id, id),
          },
        ].map((group) => (
          <div
            key={group.label}
            className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-encre/92 p-1 text-[0.8125rem] text-blanc shadow-[0_12px_30px_-12px_rgb(36_31_30/0.6)] backdrop-blur-md [scrollbar-width:none]"
          >
            <span className="shrink-0 px-3 text-blanc/60">{group.label}</span>
            {group.items.map((v) => (
              <a
                key={v.id}
                href={group.href(v.id)}
                aria-current={v.id === group.current ? "true" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 transition-colors",
                  v.id === group.current
                    ? "bg-blanc text-encre"
                    : "hover:bg-blanc/15",
                )}
              >
                {v.name}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </main>
  );
}
