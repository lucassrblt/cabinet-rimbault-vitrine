import type { Metadata } from "next";
import { AlertCtaSection } from "@/components/listings/AlertCtaSection";
import { ListingHero } from "@/components/listings/ListingHero";
import { ListingReassurance } from "@/components/listings/ListingReassurance";
import { ListingSearchBar } from "@/components/listings/ListingSearchBar";
import { ListingView } from "@/components/listings/ListingView";
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
  const commune = query.commune ? findCommuneBySlug(query.commune) : null;
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

  return (
    <main className="flex flex-1 flex-col">
      <ListingHero
        badge="Acheter"
        title="Trouvez le bien qui vous ressemble."
        subtitle={`Maisons, appartements, biens d'exception : notre sélection à ${AGENT.address.city} et ses environs.`}
        image="/hero-agence.jpg"
      />

      <ListingSearchBar
        mode="sale"
        basePath="/acheter"
        defaultValues={{
          commune: query.commune,
          type: query.type,
          budgetMax: query.budgetMax,
          pieces: query.pieces,
        }}
      />

      {errorMessage ? (
        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <div className="rounded-sm border border-subtle bg-page p-6 text-sm text-body">
            <p className="font-medium">
              Liste indisponible pour l&apos;instant.
            </p>
            <p className="mt-1 text-body">{errorMessage}</p>
          </div>
        </div>
      ) : (
        <ListingView
          mode="sale"
          basePath="/acheter"
          query={query}
          items={items}
          total={pageData.total}
          page={pageData.page}
          totalPages={pageData.totalPages}
        />
      )}

      <ListingReassurance mode="sale" />
      <AlertCtaSection />
      <SaleSeoBlock communeName={commune?.name} />
    </main>
  );
}

function SaleSeoBlock({ communeName }: { communeName?: string }) {
  const zone = communeName ?? "l'ouest parisien";
  return (
    <section className="border-t border-subtle bg-neutral-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Acheter un bien dans {zone}
        </h2>
        <div className="mt-4 max-w-3xl space-y-3 text-sm text-body md:text-base">
          <p>
            Acheter dans {zone} demande une connaissance fine du terrain : prix
            réels pratiqués, copropriétés, charges, travaux à anticiper,
            transports, écoles. Je consacre le temps qu&apos;il faut à chaque
            dossier pour vous éviter les mauvaises surprises et défendre votre
            offre au meilleur prix.
          </p>
          <p>
            J&apos;interviens sur un périmètre resserré pour rester pertinent.
            Tous les biens présentés sont vérifiés, les diagnostics contrôlés,
            les informations de copropriété collectées en amont.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 rounded-sm border border-subtle bg-card p-5">
          <p className="basis-full text-base font-medium text-primary">
            Vous ne trouvez pas le bien idéal ?
          </p>
          <LinkButton href="/contact">Me contacter</LinkButton>
          <LinkButton href="/estimation" variant="secondary">
            Estimer mon bien
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
