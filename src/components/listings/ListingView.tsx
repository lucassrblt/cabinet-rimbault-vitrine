import { LayoutGrid, List } from "lucide-react";
import {
  RentPropertyCard,
  SalePropertyCard,
} from "@/components/property/PropertyCard";
import { LinkButton } from "@/components/ui/Button";
import type { Property } from "@/lib/api/types";
import type { ListingQuery } from "@/lib/listing";
import { type FilterMode, FilterSidebar } from "./FilterSidebar";
import { Pagination } from "./Pagination";
import { SortSelect } from "./SortSelect";

interface Props {
  mode: FilterMode;
  basePath: string;
  query: ListingQuery;
  items: Property[];
  total: number;
  page: number;
  totalPages: number;
}

export function ListingView({
  mode,
  basePath,
  query,
  items,
  total,
  page,
  totalPages,
}: Props) {
  const Card = mode === "rent" ? RentPropertyCard : SalePropertyCard;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-primary">
          <span className="text-primary-600">{total}</span> bien
          {total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
        </h2>

        <div className="flex items-center gap-3">
          <SortSelect mode={mode} basePath={basePath} value={query.sort} />
          <div className="hidden items-center gap-1 md:flex">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-strong bg-card">
              <LayoutGrid className="h-4 w-4 text-primary" aria-hidden="true" />
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-default bg-card">
              <List className="h-4 w-4 text-muted" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-6">
          {items.length === 0 ? (
            <EmptyState mode={mode} basePath={basePath} />
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <li key={p.id}>
                  <Card property={p} />
                </li>
              ))}
            </ul>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={basePath}
            params={{
              type: query.type,
              commune: query.commune,
              pieces: query.pieces,
              budgetMin: query.budgetMin,
              budgetMax: query.budgetMax,
              surfaceMin: query.surfaceMin,
              surfaceMax: query.surfaceMax,
              sort: query.sort,
              meuble: query.meuble,
              dpe: query.dpe,
              balcon: query.balcon,
              terrasse: query.terrasse,
              jardin: query.jardin,
              hideFG: query.hideFG,
            }}
          />
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <FilterSidebar
              mode={mode}
              basePath={basePath}
              total={total}
              defaultValues={query}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  mode,
  basePath,
}: {
  mode: FilterMode;
  basePath: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-sm border border-subtle bg-page p-6">
      <p className="text-base font-medium text-primary">
        Aucun bien ne correspond à vos critères.
      </p>
      <div className="flex flex-wrap gap-3">
        <LinkButton href={basePath} variant="secondary" size="sm">
          Réinitialiser les filtres
        </LinkButton>
        <LinkButton href="/contact" size="sm">
          {mode === "rent"
            ? "Me signaler ma recherche"
            : "Me contacter pour un bien sur mesure"}
        </LinkButton>
      </div>
    </div>
  );
}
