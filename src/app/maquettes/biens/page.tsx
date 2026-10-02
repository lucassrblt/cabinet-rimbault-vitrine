import type { Metadata } from "next";
import { PropertyCard } from "@/components/site/PropertyCard";
import { getProperties } from "@/lib/api/properties";

export const metadata: Metadata = {
  title: "Nos biens à vendre à Asnières-sur-Seine",
};

// Décalage vertical d'une colonne sur l'autre, comme sur l'accueil.
const OFFSETS = ["", "md:mt-20", "md:-mt-4", "md:mt-16"];

export default async function NosBiens() {
  const properties = [...(await getProperties())].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <main className="conteneur pt-10 pb-28 md:pt-16 md:pb-36">
      <div
        data-reveal="monte"
        className="md:grid md:grid-cols-12 md:items-end md:gap-10"
      >
        <h1 className="titre text-[2.25rem] leading-tight md:col-span-7 md:text-page">
          Nos biens
        </h1>
        <p className="mt-3 text-gris md:col-span-5 md:mt-0 md:text-right">
          {properties.length} biens en ce moment, du plus récent au plus ancien.
        </p>
      </div>

      {properties.length === 0 ? (
        <p className="mt-12 max-w-[52ch]">
          Aucun bien en ligne en ce moment. Appelez-nous : certains biens
          partent avant d’être publiés.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-6 md:gap-x-10 md:gap-y-20">
          {properties.map((p, i) => (
            <PropertyCard
              key={p.id}
              property={p}
              href={`/maquettes/biens/${p.reference}`}
              ratio="aspect-[4/3]"
              sizes="(min-width: 640px) 50vw, 100vw"
              preload={i < 2}
              revealDelay={(i % 2) * 140}
              className={OFFSETS[i % 4]}
            />
          ))}
        </div>
      )}
    </main>
  );
}
