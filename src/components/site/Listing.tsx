// Page Nos biens : la liste retenue (alternée, avec carrousel) et les
// en-têtes de page en comparaison.

import Image from "next/image";
import Link from "next/link";
import type React from "react";
import type { Property } from "@/lib/api/types";
import {
  mainImage,
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
    cities: cities.length ? cities.join(" et ") : null,
  };
}

/** 1. La phrase, seule. */
export function TitrePhrase({ items }: { items: Property[] }) {
  return (
    <h1
      data-reveal="monte"
      className="titre max-w-[22ch] text-[2.125rem] leading-[1.1] md:text-[3rem]"
    >
      {countLabel(items)} en vente, suivis par la même personne jusqu’à la
      signature.
    </h1>
  );
}

/** 2. La phrase et des repères tirés des biens : surfaces, prix, communes. */
export function TitreReperes({ items }: { items: Property[] }) {
  const r = ranges(items);
  const facts = [
    ["Surfaces", r.surface],
    ["Prix", r.price],
    ["Où", r.cities],
  ].filter(([, v]) => v) as [string, string][];
  return (
    <div
      data-reveal="monte"
      className="md:grid md:grid-cols-12 md:items-end md:gap-10"
    >
      <h1 className="titre text-[2.25rem] leading-[1.05] md:col-span-6 md:text-[3.5rem]">
        {countLabel(items)} en vente
      </h1>
      <dl className="mt-8 grid gap-5 sm:grid-cols-3 md:col-span-6 md:mt-0 md:pb-2">
        {facts.map(([k, v]) => (
          <div key={k} className="border-t border-encre pt-3">
            <dt className="text-mention text-gris">{k}</dt>
            <dd className="titre mt-1 text-[1.1875rem] leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** 3. La phrase et les biens en vignettes qui se chevauchent : un aperçu visuel. */
export function TitreVignettes({ items }: { items: Property[] }) {
  return (
    <div
      data-reveal="monte"
      className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
    >
      <h1 className="titre max-w-[18ch] text-[2.25rem] leading-[1.08] md:text-[3.25rem]">
        {countLabel(items)} en vente, à voir avec nous.
      </h1>
      <ul className="flex pl-4">
        {items.map((p, i) => {
          const image = mainImage(p);
          return (
            <li
              key={p.id}
              className="-ml-4"
              style={{ zIndex: items.length - i }}
            >
              <a
                href={`#${anchor(p)}`}
                className="relative block size-[4.5rem] overflow-hidden rounded-[14px] bg-pierre ring-4 ring-blanc transition-transform duration-300 hover:-translate-y-1.5 md:size-24"
                aria-label={`${propertyTitle(p)}, ${placeLabel(p)}`}
              >
                {image && (
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="6rem"
                    className="object-cover"
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** 4. Le grand titre : la typographie fait l'image, la phrase se décale. */
export function TitreGrand({ items }: { items: Property[] }) {
  return (
    <div data-reveal="monte">
      <h1 className="titre text-[4.5rem] leading-[0.9] tracking-[-0.03em] md:text-[9rem]">
        Nos biens
        <sup className="ml-2 align-top text-[1.25rem] tracking-normal text-rouge md:text-[1.75rem]">
          {items.length}
        </sup>
      </h1>
      <p className="mt-6 max-w-[34ch] text-[1.125rem] text-gris md:mt-8 md:ml-[42%] md:text-[1.25rem]">
        Des appartements à Asnières-sur-Seine et alentour, suivis par la même
        personne de la visite à la signature.
      </p>
    </div>
  );
}
