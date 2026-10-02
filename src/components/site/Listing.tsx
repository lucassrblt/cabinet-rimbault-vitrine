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
                <p className="mt-4 text-[0.9375rem] text-gris">
                  {features.join(", ")}
                </p>
              )}

              <Link href={href(p)} className="bouton bouton-secondaire mt-6">
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

function countLabel(items: Property[]) {
  const n = COUNT_WORDS[items.length] ?? String(items.length);
  const allFlats =
    items.length > 0 && items.every((p) => p.propertyType === "APPARTEMENT");
  const noun = allFlats ? "appartement" : "bien";
  return `${n} ${noun}${items.length > 1 ? "s" : ""}`;
}

function ranges(items: Property[]) {
  const surfaces = items
    .map((p) => p.characteristics?.surfaceCarrez ?? p.characteristics?.surface)
    .filter((v): v is number => v != null);
  const prices = items
    .map((p) => p.finance?.price)
    .filter((v): v is number => v != null);
  const cities = [
    ...new Set(items.map((p) => propertyPlace(p)?.city).filter(Boolean)),
  ] as string[];
  const fmtSurface = (v: number) => `${Math.round(v)}\u00a0m²`;
  const fmtPrice = (v: number) => `${Math.round(v / 1000)}\u00a0000\u00a0€`;
  return {
    surface: surfaces.length
      ? `${fmtSurface(Math.min(...surfaces))} à ${fmtSurface(Math.max(...surfaces))}`
      : null,
    price: prices.length
      ? `${fmtPrice(Math.min(...prices))} à ${fmtPrice(Math.max(...prices))}`
      : null,
    cities: cities.length
      ? cities.map((c) => c.replaceAll("-", "\u2011")).join(" et ")
      : null,
  };
}

/**
 * Le titre de page : « Nos biens » en grand, puis une ligne de repères
 * calculés à partir des biens (combien, quelles surfaces, quels prix, où).
 */
export function TitreBiens({ items }: { items: Property[] }) {
  const r = ranges(items);
  const facts = [
    ["En vente", countLabel(items)],
    ["Surfaces", r.surface],
    ["Prix", r.price],
    ["Communes", r.cities],
  ].filter(([, v]) => v) as [string, string][];
  return (
    <div data-reveal="monte">
      <h1 className="titre text-[4rem] leading-[0.92] tracking-[-0.03em] md:text-[8.5rem]">
        Nos biens
      </h1>
      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 md:mt-14 md:grid-cols-4 md:gap-x-10">
        {facts.map(([k, v]) => (
          <div key={k} className="border-t border-encre pt-3">
            <dt className="text-mention text-gris">{k}</dt>
            <dd className="titre mt-1 text-[1.125rem] leading-snug md:text-[1.25rem]">
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
