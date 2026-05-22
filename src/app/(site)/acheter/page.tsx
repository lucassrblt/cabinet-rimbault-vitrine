import type { Metadata } from "next";
import { ContactTrigger } from "@/components/contact/ContactTrigger";
import { ActiveFiltersChips } from "@/components/listings/ActiveFiltersChips";
import { ListingFilterBar } from "@/components/listings/ListingFilterBar";
import { ListingHero } from "@/components/listings/ListingHero";
import { ListingReassurance } from "@/components/listings/ListingReassurance";
import { ListingResultsBar } from "@/components/listings/ListingResultsBar";
import { Pagination } from "@/components/listings/Pagination";
import { SalePropertyCard } from "@/components/property/PropertyCard";
import { PropertyEstimationCTA } from "@/components/property/PropertyEstimationCTA";
import { LinkButton } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
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
    title: `Biens à vendre${where}`,
    description: `Appartements, maisons et biens à vendre${where} — sélection du Cabinet Rimbault.`,
  };
}

export default async function AcheterPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const query = parseQuery(sp);
  const page = pageFromQuery(query);
  const filters = queryToSearchFilters(query, "VENTE", page);

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
        : "Impossible de charger les biens à la vente.";
  }

  const pageData = paginateServerSide(total, page);
  const basePath = "/acheter";

  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-subtle bg-header">
        {/* STOPGAP : pas de visuel dédié /acheter — réutilise la façade de
            l'agence. Remplacer par /public/hero-acheter.jpg dès qu'un visuel
            dédié existe. */}
        <ListingHero
          mode="sale"
          city={AGENT.address.city}
          image="/hero-agence.jpg"
          imageAlt="Immeuble de caractère"
        />
        <div className="relative z-10 mx-auto -mt-12 w-full max-w-7xl px-gutter pb-12 md:-mt-16 md:pb-14">
          <ListingFilterBar
            mode="sale"
            basePath={basePath}
            query={query}
            total={total}
          />
          <div className="mt-4">
            <ActiveFiltersChips mode="sale" basePath={basePath} query={query} />
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto w-full max-w-7xl px-gutter py-16 md:py-20">
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
                    <ContactTrigger subject="vente" variant="primary" size="sm">
                      Me contacter pour un bien sur mesure
                    </ContactTrigger>
                  </div>
                </div>
              ) : (
                <>
                  <ListingResultsBar
                    mode="sale"
                    total={total}
                    basePath={basePath}
                    sort={query.sort}
                  />
                  <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((p, i) => (
                      <li key={p.id} className="h-full">
                        <ScrollReveal delay={(i % 3) * 0.07} className="h-full">
                          <SalePropertyCard property={p} />
                        </ScrollReveal>
                      </li>
                    ))}
                  </ul>
                </>
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

      <ListingReassurance mode="sale" />
      <PropertyEstimationCTA />
    </main>
  );
}
