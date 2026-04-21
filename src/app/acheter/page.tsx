import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ListingView } from "@/components/listings/ListingView";
import { LinkButton } from "@/components/ui/Button";
import { listSaleProperties } from "@/lib/api/properties";
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

  let items: Awaited<ReturnType<typeof listSaleProperties>>["data"] = [];
  let errorMessage: string | undefined;
  try {
    const res = await listSaleProperties({ limit: 200 });
    items = (res.data ?? []).filter((p) => p.isPublished);
  } catch (err) {
    errorMessage =
      err instanceof Error
        ? err.message
        : "Impossible de charger les biens à la vente.";
  }

  const filtered = filterProperties(items, query);
  const sorted = sortProperties(filtered, query.sort);
  const page = Number(query.page ?? "1") || 1;
  const pageData = paginate(sorted, page);

  const h1 = commune
    ? `Biens à vendre à ${commune.name}`
    : "Biens à vendre en Île-de-France";
  const lede = commune
    ? `${pageData.total} bien${pageData.total > 1 ? "s" : ""} disponible${pageData.total > 1 ? "s" : ""} à ${commune.name}.`
    : `${pageData.total} bien${pageData.total > 1 ? "s" : ""} disponible${pageData.total > 1 ? "s" : ""} sur ${COMMUNES.length} communes couvertes.`;

  return (
    <main className="flex flex-1 flex-col">
      <div className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
          <Breadcrumb
            items={[{ label: "Accueil", href: "/" }, { label: "Acheter" }]}
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
            mode="sale"
            basePath="/acheter"
            query={query}
            items={pageData.items}
            total={pageData.total}
            page={pageData.page}
            totalPages={pageData.totalPages}
          />
        )}
      </div>

      <SaleSeoBlock communeName={commune?.name} />
    </main>
  );
}

function SaleSeoBlock({ communeName }: { communeName?: string }) {
  const zone = communeName ?? "l'ouest parisien";
  return (
    <section className="border-t border-zinc-200 bg-zinc-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Acheter un bien dans {zone}
        </h2>
        <div className="mt-4 max-w-3xl space-y-3 text-sm text-zinc-700 md:text-base">
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
        <div className="mt-6 flex flex-wrap gap-3 rounded border border-zinc-200 bg-white p-5">
          <p className="basis-full text-base font-medium text-zinc-900">
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
