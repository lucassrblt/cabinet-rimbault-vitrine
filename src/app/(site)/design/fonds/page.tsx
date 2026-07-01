import type { Metadata } from "next";
import { PropertyCardChromeB } from "@/components/property/cards/PropertyCardChromeB";
import { PropertyCardChromeC } from "@/components/property/cards/PropertyCardChromeC";
import { PropertyCardEditorial } from "@/components/property/cards/PropertyCardEditorial";
import { searchProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "Design — Variantes de chrome de la carte",
  robots: { index: false, follow: false },
};

interface CardVariant {
  id: string;
  label: string;
  summary: string;
  Card: React.ComponentType<{ property: Property }>;
}

const VARIANTS: CardVariant[] = [
  {
    id: "actuel",
    label: "Actuel — Boîte blanche minimaliste",
    summary:
      "Variante en prod depuis ce rollout. La carte entière sur bg-card, photo plein bord en haut, padding 6, shadow sur la carte qui s'amplifie au hover. Pas de bordure visible, pas de translate. Lit comme une fiche posée sur le crème.",
    Card: PropertyCardEditorial,
  },
  {
    id: "b",
    label: "Alternative B — Passe-partout éditorial",
    summary:
      "La photo (avec son ring fin) est inscrite dans un soubassement bg-card qui dépasse de tous côtés. Style encadrement d'expo photo. Plus signature, plus risqué.",
    Card: PropertyCardChromeB,
  },
  {
    id: "c",
    label: "Alternative C — Punch couleur (no chrome)",
    summary:
      "Aucun chrome ajouté. L'identité vient des couleurs : eyebrow en vert ardoise (couleur secondaire jamais utilisée ailleurs), prix XL en grenat profond. Philosophiquement la plus alignée avec la palette warmth-only du site, mais n'adresse pas le problème de présence.",
    Card: PropertyCardChromeC,
  },
];

async function fetchSample(): Promise<Property[]> {
  try {
    const res = await searchProperties({
      transactionType: "VENTE",
      status: "DISPONIBLE",
      limit: 3,
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export default async function DesignFondsPage() {
  const sample = await fetchSample();

  return (
    <main className="bg-page">
      <header className="border-b border-subtle bg-header px-gutter py-16">
        <div className="mx-auto max-w-6xl">
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.32em] text-primary-600">
            Design · Interne
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-primary md:text-5xl">
            Carte en prod & alternatives consultables
          </h1>
          <p className="mt-4 max-w-2xl text-base text-body">
            La variante <strong>Boîte blanche</strong> est désormais déployée en
            prod sur /acheter, /louer, /bien/[ref] et la home. Cette page
            conserve deux alternatives pour pouvoir y revenir si besoin — chaque
            section est posée sur le fond{" "}
            <code className="rounded bg-section px-1.5 py-0.5 text-xs text-primary">
              bg-cream
            </code>{" "}
            (environnement réel des listings).
          </p>

          <nav aria-label="Sommaire" className="mt-8 flex flex-wrap gap-3">
            {VARIANTS.map((v) => (
              <a
                key={v.id}
                href={`#${v.id}`}
                className="inline-flex items-center rounded-lg border border-subtle bg-card px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:border-primary-600 hover:text-primary-600"
              >
                {v.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {sample.length === 0 ? (
        <section className="px-gutter py-20">
          <div className="mx-auto max-w-2xl rounded-lg border border-subtle bg-card p-8 text-center">
            <h2 className="font-display text-xl text-primary">
              Aucun bien n&apos;a pu être récupéré
            </h2>
            <p className="mt-2 text-sm text-muted">
              Vérifie que l&apos;API locale tourne (port 3002) ou que les
              variables d&apos;environnement de prod sont configurées.
            </p>
          </div>
        </section>
      ) : (
        VARIANTS.map((v, i) => {
          const Card = v.Card;
          return (
            <section key={v.id} id={v.id} className="border-b border-subtle">
              <div className="border-b border-subtle bg-header px-gutter py-10">
                <div className="mx-auto flex max-w-6xl flex-col gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-primary-600">
                    {`Test ${String(i + 1).padStart(2, "0")}`}
                  </p>
                  <h2 className="font-display text-3xl font-medium tracking-tight text-primary">
                    {v.label}
                  </h2>
                  <p className="max-w-3xl text-sm text-body">{v.summary}</p>
                </div>
              </div>

              <div className="bg-cream px-gutter py-16">
                <div className="mx-auto max-w-6xl">
                  <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">
                    Biens à vendre — sélection
                  </p>
                  <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {sample.map((p) => (
                      <li key={`${v.id}-${p.id}`} className="h-full">
                        <Card property={p} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}
