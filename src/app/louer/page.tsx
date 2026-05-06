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
  const commune = query.commune ? findCommuneBySlug(query.commune) : null;
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

  return (
    <main className="flex flex-1 flex-col">
      <ListingHero
        badge="Louer"
        title="Votre futur chez-vous, en toute confiance."
        subtitle={`Appartements et maisons à louer à ${AGENT.address.city} — sélectionnés et vérifiés par nos soins.`}
        image="/hero-agence.jpg"
      />

      <ListingSearchBar
        mode="rent"
        basePath="/louer"
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
          mode="rent"
          basePath="/louer"
          query={query}
          items={items}
          total={pageData.total}
          page={pageData.page}
          totalPages={pageData.totalPages}
        />
      )}

      <ListingReassurance mode="rent" />
      <AlertCtaSection />
      <TenantFileSection />
      <RentSeoBlock communeName={commune?.name} />
    </main>
  );
}

function TenantFileSection() {
  return (
    <section className="border-t border-subtle">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Votre dossier locataire
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-body md:text-base">
          Préparez à l&apos;avance : pièce d&apos;identité, trois derniers
          bulletins de salaire ou attestation de revenus, dernier avis
          d&apos;imposition, justificatif de domicile et, le cas échéant, pièces
          du garant. Je traite les dossiers complets en priorité. DossierFacile
          est accepté. Délai de réponse moyen : 48–72 h.
        </p>
        <div className="mt-4">
          <LinkButton href="/contact" variant="secondary" size="sm">
            Poser une question sur le dossier
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

function RentSeoBlock({ communeName }: { communeName?: string }) {
  const zone = communeName ?? "l'ouest parisien";
  return (
    <section className="border-t border-subtle bg-neutral-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Louer un logement dans {zone}
        </h2>
        <div className="mt-4 max-w-3xl space-y-3 text-sm text-body md:text-base">
          <p>
            Le marché locatif de {zone} est tendu : les bons dossiers partent
            vite et la concurrence entre candidats est forte. En tant
            qu&apos;intermédiaire entre bailleurs et locataires, je mets un
            point d&apos;honneur à présenter des biens conformes, à respecter
            les délais annoncés et à communiquer clairement sur chaque
            candidature.
          </p>
          <p>
            Tous les biens respectent les obligations de la loi Climat. Les
            logements classés F ou G font l&apos;objet d&apos;une mention
            explicite dès la liste.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 rounded-sm border border-subtle bg-card p-5">
          <p className="basis-full text-base font-medium text-primary">
            Pas de bien qui correspond ?
          </p>
          <LinkButton href="/contact">Me signaler ma recherche</LinkButton>
        </div>
      </div>
    </section>
  );
}
