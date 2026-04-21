import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ListingView } from "@/components/listings/ListingView";
import { LinkButton } from "@/components/ui/Button";
import { listRentProperties } from "@/lib/api/properties";
import { COMMUNES, findCommuneBySlug } from "@/lib/config/communes";
import {
  filterProperties,
  paginate,
  parseQuery,
  sortProperties,
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
  const where = commune ? ` à ${commune.name}` : " en Île-de-France";
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

  let items: Awaited<ReturnType<typeof listRentProperties>>["data"] = [];
  let errorMessage: string | undefined;
  try {
    const res = await listRentProperties({ limit: 200 });
    items = (res.data ?? []).filter((p) => p.isPublished);
  } catch (err) {
    errorMessage =
      err instanceof Error
        ? err.message
        : "Impossible de charger les biens à la location.";
  }

  const filtered = filterProperties(items, query);
  const sorted = sortProperties(filtered, query.sort);
  const page = Number(query.page ?? "1") || 1;
  const pageData = paginate(sorted, page);

  const h1 = commune
    ? `Biens à louer à ${commune.name}`
    : "Biens à louer en Île-de-France";
  const lede = commune
    ? `${pageData.total} logement${pageData.total > 1 ? "s" : ""} disponible${pageData.total > 1 ? "s" : ""} à la location à ${commune.name}.`
    : `${pageData.total} logement${pageData.total > 1 ? "s" : ""} disponible${pageData.total > 1 ? "s" : ""} sur ${COMMUNES.length} communes couvertes.`;

  return (
    <main className="flex flex-1 flex-col">
      <div className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
          <Breadcrumb
            items={[{ label: "Accueil", href: "/" }, { label: "Louer" }]}
          />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {h1}
          </h1>
          <p className="mt-2 text-base text-zinc-600">{lede}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-12">
        {errorMessage ? (
          <div className="rounded border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700">
            <p className="font-medium">
              Liste indisponible pour l&apos;instant.
            </p>
            <p className="mt-1 text-zinc-600">{errorMessage}</p>
          </div>
        ) : (
          <ListingView
            mode="rent"
            basePath="/louer"
            query={query}
            items={pageData.items}
            total={pageData.total}
            page={pageData.page}
            totalPages={pageData.totalPages}
          />
        )}
      </div>

      <TenantFileSection />
      <RentSeoBlock communeName={commune?.name} />
    </main>
  );
}

function TenantFileSection() {
  return (
    <section className="border-t border-zinc-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Votre dossier locataire
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-zinc-700 md:text-base">
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
    <section className="border-t border-zinc-200 bg-zinc-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Louer un logement dans {zone}
        </h2>
        <div className="mt-4 max-w-3xl space-y-3 text-sm text-zinc-700 md:text-base">
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
        <div className="mt-6 flex flex-wrap gap-3 rounded border border-zinc-200 bg-white p-5">
          <p className="basis-full text-base font-medium text-zinc-900">
            Pas de bien qui correspond ?
          </p>
          <LinkButton href="/contact">Me signaler ma recherche</LinkButton>
        </div>
      </div>
    </section>
  );
}
