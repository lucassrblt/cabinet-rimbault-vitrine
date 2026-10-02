// Page Nos biens : la liste retenue (alternée, avec carrousel) et les
// en-têtes de page en comparaison.

import Link from "next/link";
import type React from "react";
import type { Property } from "@/lib/api/types";
import {
  priceLabel,
  propertyFeatures,
  propertyFloor,
  propertyPlace,
  propertySurface,
  propertyTitle,
} from "@/lib/property";
import { cn } from "@/lib/utils";
import { CardCarousel } from "./CardCarousel";

const href = (p: Property) => `/maquettes/biens/${p.reference}`;
const anchor = (p: Property) => `bien-${p.reference.replace(/\W/g, "-")}`;
const COUNT_WORDS = [
  "Aucun",
  "Un",
  "Deux",
  "Trois",
  "Quatre",
  "Cinq",
  "Six",
  "Sept",
  "Huit",
  "Neuf",
  "Dix",
];
const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
});

function placeLabel(p: Property) {
  const place = propertyPlace(p);
  return [place?.neighborhood, place?.city].filter(Boolean).join(", ");
}

/* ——— La liste ——— */

export function ListeBiens({ items }: { items: Property[] }) {
  return (
    <div className="space-y-14 md:space-y-20">
      {items.map((p, i) => {
        const reversed = i % 2 === 1;
        const c = p.characteristics;
        const figures = [
          ["Surface", propertySurface(p)],
          ["Pièces", c?.rooms],
          ["Chambres", c?.bedrooms || null],
          ["Étage", propertyFloor(p, { short: true })],
        ].filter(([, v]) => v != null) as [string, string | number][];
        const features = propertyFeatures(p).filter((f) => f !== "Ascenseur");

        return (
          <article
            key={p.id}
            id={anchor(p)}
            className="scroll-mt-32 md:grid md:grid-cols-12 md:items-center md:gap-10"
          >
            <div
              data-reveal="monte"
              className={cn(
                "-mx-4 md:col-span-7 md:mx-0",
                reversed && "md:order-2 md:col-start-6",
              )}
            >
              <CardCarousel
                images={p.images}
                href={href(p)}
                counter
                ratio="aspect-[4/3] md:aspect-[3/2]"
                sizes="(min-width: 768px) 56vw, 100vw"
                className="max-md:rounded-none"
              />
            </div>

            <div
              data-reveal="monte"
              style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
              className={cn(
                "mt-5 md:col-span-5 md:mt-0",
                reversed && "md:order-1 md:col-start-1 md:row-start-1",
              )}
            >
              <p className="text-mention text-gris">{placeLabel(p)}</p>
              <h2 className="titre mt-1 text-[1.625rem] leading-tight md:text-section">
                <Link
                  href={href(p)}
                  className="transition-colors hover:text-rouge"
                >
                  {propertyTitle(p)}
                </Link>
              </h2>
              <p className="titre mt-2 text-[1.375rem] font-semibold md:mt-3 md:text-chiffre">
                {priceLabel(p)}
              </p>

              <dl className="mt-5 grid grid-cols-4 gap-2 border-t border-filet pt-4 md:mt-6 md:flex md:gap-8">
                {figures.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-mention text-gris">{k}</dt>
                    <dd className="titre whitespace-nowrap text-[1.125rem] md:text-[1.25rem]">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>

              {features.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {features.map((f) => (
                    <li
                      key={f}
                      className="rounded-full bg-pierre px-3 py-1 text-[0.8125rem]"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={href(p)}
                className="mt-6 inline-flex rounded-full border border-encre/80 px-5 py-2.5 text-[0.9375rem] font-medium transition-colors duration-200 hover:bg-encre hover:text-blanc"
              >
                Voir le bien
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ——— En-têtes de page ——— */

/** A. La phrase : une promesse de méthode, la date du dernier ajout. */
export function TitrePhrase({ items }: { items: Property[] }) {
  const latest = items[0]?.createdAt;
  return (
    <div data-reveal="monte" className="max-w-3xl">
      <p className="inline-flex items-center gap-2 text-mention text-gris">
        <span className="size-2 rounded-full bg-rouge" aria-hidden />
        {latest
          ? `Dernier bien ajouté le ${dateFormat.format(new Date(latest))}`
          : "Nos biens"}
      </p>
      <h1 className="titre mt-3 text-[2.125rem] leading-[1.1] md:text-[3rem]">
        {COUNT_WORDS[items.length] ?? items.length} biens en vente, suivis par
        la même personne jusqu’à la signature.
      </h1>
    </div>
  );
}

/** B. Le sommaire : chaque bien en une ligne, qui mène directement à lui. */
export function TitreSommaire({ items }: { items: Property[] }) {
  return (
    <div
      data-reveal="monte"
      className="md:grid md:grid-cols-12 md:items-end md:gap-10"
    >
      <div className="md:col-span-5">
        <h1 className="titre text-[2.5rem] leading-none md:text-page">
          Nos biens
        </h1>
        <p className="mt-4 text-gris">
          {COUNT_WORDS[items.length] ?? items.length} biens en vente en ce
          moment.
        </p>
      </div>
      <ol className="mt-8 divide-y divide-filet rounded-carte border border-filet md:col-span-7 md:mt-0">
        {items.map((p) => (
          <li key={p.id}>
            <a
              href={`#${anchor(p)}`}
              className="flex items-baseline justify-between gap-4 px-4 py-3 transition-colors hover:bg-pierre md:px-5"
            >
              <span>
                {propertyTitle(p)}, {propertySurface(p)}
                <span className="block text-mention text-gris md:inline md:pl-2">
                  {placeLabel(p)}
                </span>
              </span>
              <span className="titre shrink-0 font-semibold">
                {priceLabel(p)}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** C. Les quartiers : où sont les biens, en pastilles, comme l'affichette. */
export function TitreQuartiers({ items }: { items: Property[] }) {
  const counts = new Map<string, number>();
  for (const p of items) {
    const place = propertyPlace(p);
    const key = place?.neighborhood ?? place?.city ?? "Autre";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return (
    <div data-reveal="monte">
      <h1 className="titre text-[2.5rem] leading-none md:text-page">
        Nos biens
      </h1>
      <p className="mt-4 max-w-[52ch] text-gris">
        {COUNT_WORDS[items.length] ?? items.length} biens en vente, à
        Asnières-sur-Seine et dans les communes voisines.
      </p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {[...counts].map(([name, n]) => (
          <li
            key={name}
            className="inline-flex items-center gap-2 rounded-full border border-filet py-1.5 pr-1.5 pl-4 text-[0.9375rem]"
          >
            {name}
            <span className="flex size-6 items-center justify-center rounded-full bg-pierre text-[0.8125rem] tabular-nums">
              {n}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
