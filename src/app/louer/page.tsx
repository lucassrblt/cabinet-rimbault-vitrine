import type { Metadata } from "next";
import { ActiveFiltersChips } from "@/components/listings/ActiveFiltersChips";
import { ListingFilterBar } from "@/components/listings/ListingFilterBar";
import { ListingReassurance } from "@/components/listings/ListingReassurance";
import { ListingSectionHeader } from "@/components/listings/ListingSectionHeader";
import { Pagination } from "@/components/listings/Pagination";
import { RentPropertyCard } from "@/components/property/PropertyCard";
import { PropertyEstimationCTA } from "@/components/property/PropertyEstimationCTA";
import { LinkButton } from "@/components/ui/Button";
import { searchProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { AGENT } from "@/lib/config/agent";
import { findCommuneBySlug } from "@/lib/config/communes";
import {
  pageFromQuery,
  paginateServerSide,
  parseQuery,
  queryToSearchFilters,
} from "@/lib/listing";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const communeSlug = typeof sp.commune === "string" ? sp.commune : undefined;
  const commune = communeSlug ? findCommuneBySlug(communeSlug) : null;
  const where = commune ? ` à ${commune.name}` : ` à ${AGENT.address.city}`;
  return {
    title: `Biens à louer${where}`,
    description: `Appartements et maisons à louer${where} — location longue durée par le Cabinet Rimbault.`,
  };
}

export default async function LouerPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const query = parseQuery(sp);
  const page = pageFromQuery(query);
  const filters = queryToSearchFilters(query, "LOCATION", page);

  let items: Property[] = [];
  let total = 0;
  let errorMessage: string | undefined;
  try {
    const res = await searchProperties(filters);
    items = res.data ?? [];
    total = res.total ?? items.length;
  } catch (err) {
    errorMessage =
      err instanceof Error
        ? err.message
        : "Impossible de charger les biens à la location.";
  }

  const pageData = paginateServerSide(total, page);
  const basePath = "/louer";

  return (
    <main className="flex flex-1 flex-col">
      <section className="bg-header">
        <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-12 md:px-8 md:pb-8 md:pt-16">
          <ListingSectionHeader
            mode="rent"
            total={total}
            basePath={basePath}
            sort={query.sort}
          />
        </div>
      </section>

      <section className="bg-header">
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 md:px-8 md:pb-10">
          <ListingFilterBar
            mode="rent"
            basePath={basePath}
            query={query}
            total={total}
          />
          <div className="mt-4">
            <ActiveFiltersChips mode="rent" basePath={basePath} query={query} />
          </div>
        </div>
      </section>

      <section className="bg-header">
        <div className="mx-auto w-full max-w-7xl px-4 pb-14 md:px-8 md:pb-16">
          {errorMessage ? (
            <div className="rounded-sm border border-subtle bg-card p-6 text-sm text-body">
              <p className="font-medium">
                Liste indisponible pour l&apos;instant.
              </p>
              <p className="mt-1 text-body">{errorMessage}</p>
            </div>
          ) : (
            <>
              {items.length === 0 ? (
                <div className="flex flex-col items-start gap-4 rounded-sm border border-subtle bg-card p-6">
                  <p className="text-base font-medium text-primary">
                    Aucun bien ne correspond à vos critères.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <LinkButton href={basePath} variant="secondary" size="sm">
                      Réinitialiser les filtres
                    </LinkButton>
                    <LinkButton href="/contact" size="sm">
                      Me signaler ma recherche
                    </LinkButton>
                  </div>
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    <li key={p.id}>
                      <RentPropertyCard property={p} />
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-10">
                <Pagination
                  currentPage={pageData.page}
                  totalPages={pageData.totalPages}
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
            </>
          )}
        </div>
      </section>

      <ListingReassurance mode="rent" />
      <PropertyEstimationCTA />
    </main>
  );
}
