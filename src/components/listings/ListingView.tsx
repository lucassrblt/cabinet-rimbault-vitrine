import {
  RentPropertyCard,
  SalePropertyCard,
} from "@/components/property/PropertyCard";
import { LinkButton } from "@/components/ui/Button";
import type { Property } from "@/lib/api/types";
import type { ListingQuery } from "@/lib/listing";
import { FilterBar, type ListingMode } from "./FilterBar";
import { Pagination } from "./Pagination";
import { SortSelect } from "./SortSelect";

interface Props {
  mode: ListingMode;
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
    <div className="flex flex-col gap-6">
      <FilterBar mode={mode} filters={query} basePath={basePath} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle pb-3">
        <p className="text-sm text-body">
          <strong className="font-semibold">{total}</strong>{" "}
          {total > 1 ? "résultats" : "résultat"}
        </p>
        <SortSelect mode={mode} basePath={basePath} value={query.sort} />
      </div>

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
  );
}

function EmptyState({
  mode,
  basePath,
}: {
  mode: ListingMode;
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
