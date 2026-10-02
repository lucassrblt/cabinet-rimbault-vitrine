// Variantes de sections pour la page Nos biens, comparées dans
// /maquettes/biens?variante=… avant d'en retenir une.
import { ArrowUpDown, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CardCarousel } from "@/components/site/CardCarousel";
import { PropertyCard } from "@/components/site/PropertyCard";
import { agency } from "@/lib/agency";
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
const href = (p: Property) => `/maquettes/biens/${p.reference}`;

function Place({ p, className }: { p: Property; className?: string }) {
  const place = propertyPlace(p);
  return (
    <p className={cn("text-mention text-gris", className)}>
      {place?.neighborhood ? `${place.neighborhood}, ` : ""}
      {place?.city}
    </p>
  );
}

/* ——— Section 1 : en-tête de page ——— */

export function HeadCompteur({ count }: { count: number }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <h1 className="titre text-[2.5rem] leading-none md:text-page">
        Nos biens
      </h1>
      <span className="inline-flex items-center gap-2 rounded-full bg-pierre px-4 py-2 text-[0.9375rem]">
        <span className="size-2 rounded-full bg-rouge" aria-hidden />
        {count} biens en vente
      </span>
    </div>
  );
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
});

export function HeadPhrase({
  count,
  latest,
}: {
  count: number;
  latest?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="inline-flex items-center gap-2 text-mention text-gris">
        <span className="size-2 rounded-full bg-rouge" aria-hidden />
        {latest
          ? `Dernier bien ajouté le ${dateFormat.format(new Date(latest))}`
          : "Biens en vente"}
      </p>
      <h1 className="titre mt-3 text-[2.25rem] leading-[1.1] md:text-[3rem]">
        {COUNT_WORDS[count] ?? count} biens en vente, tous visités par l’agence.
      </h1>
    </div>
  );
}

export function HeadTri({ count }: { count: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-baseline gap-4">
        <h1 className="titre text-[2.5rem] leading-none md:text-page">
          Nos biens
        </h1>
        <span className="text-gris">{count}</span>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-pierre p-1 text-[0.9375rem]">
        <span className="hidden pr-1 pl-3 text-gris sm:inline">
          <ArrowUpDown size={15} className="inline" aria-hidden />
        </span>
        {["Plus récents", "Prix", "Surface"].map((t, i) => (
          <span
            key={t}
            className={cn(
              "rounded-full px-4 py-1.5",
              i === 0
                ? "bg-blanc shadow-[0_2px_8px_-2px_rgb(36_31_30/0.25)]"
                : "text-gris",
            )}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ——— Section 2 : la liste ——— */

export function ListeDecalee({ items }: { items: Property[] }) {
  const offsets = ["", "md:mt-20", "md:-mt-4", "md:mt-16"];
  return (
    <div className="grid gap-y-14 sm:grid-cols-2 sm:gap-x-6 md:gap-x-10">
      {items.map((p, i) => (
        <PropertyCard
          key={p.id}
          property={p}
          href={href(p)}
          ratio="aspect-[4/3]"
          sizes="50vw"
          className={offsets[i % 4]}
        />
      ))}
    </div>
  );
}

export function ListeAlternee({ items }: { items: Property[] }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {items.map((p, i) => {
        const image = mainImage(p);
        const c = p.characteristics;
        return (
          <Link
            key={p.id}
            href={href(p)}
            className="group grid items-center gap-6 md:grid-cols-12 md:gap-10"
          >
            <div
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-photo bg-pierre md:col-span-7",
                i % 2 === 1 && "md:order-2 md:col-start-6",
              )}
            >
              {image && (
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
                />
              )}
            </div>
            <div
              className={cn(
                "md:col-span-5",
                i % 2 === 1 && "md:order-1 md:col-start-1 md:row-start-1",
              )}
            >
              <Place p={p} />
              <h3 className="titre mt-1 text-[1.75rem] leading-tight group-hover:text-rouge md:text-section">
                {propertyTitle(p)}
              </h3>
              <p className="titre mt-3 text-chiffre font-semibold">
                {priceLabel(p)}
              </p>
              <dl className="mt-6 flex gap-8 border-t border-filet pt-4 text-mention">
                {[
                  ["Surface", propertySurface(p)],
                  ["Pièces", c?.rooms],
                  ["Étage", propertyFloor(p, { short: true })],
                ]
                  .filter(([, v]) => v != null)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-gris">{k}</dt>
                      <dd className="titre text-[1.25rem]">{v}</dd>
                    </div>
                  ))}
              </dl>
              <span className="mt-6 inline-flex rounded-full border border-encre/80 px-5 py-2.5 text-[0.9375rem] font-medium transition-colors group-hover:bg-encre group-hover:text-blanc">
                Voir le bien
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function ListePastille({ items }: { items: Property[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => {
        const image = mainImage(p);
        return (
          <Link
            key={p.id}
            href={href(p)}
            className="group relative block aspect-[4/5] overflow-hidden rounded-[14px] bg-pierre"
          >
            {image && (
              <Image
                src={image.url}
                alt=""
                fill
                sizes="33vw"
                className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.03]"
              />
            )}
            <div className="absolute inset-x-3 bottom-3 rounded-[10px] bg-blanc/92 p-4 shadow-[0_10px_30px_-14px_rgb(36_31_30/0.5)] backdrop-blur-md">
              <Place p={p} />
              <div className="mt-0.5 flex items-baseline justify-between gap-3">
                <h3 className="titre text-[1.125rem] leading-snug">
                  {propertyTitle(p)}, {propertySurface(p)}
                </h3>
                <p className="titre shrink-0 font-semibold">{priceLabel(p)}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function ListeCarrousel({ items }: { items: Property[] }) {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <div key={p.id}>
          <CardCarousel
            images={p.images}
            ratio="aspect-[4/3]"
            sizes="(min-width: 1024px) 33vw, 50vw"
          />
          <Link href={href(p)} className="group mt-4 block">
            <Place p={p} />
            <h3 className="titre mt-0.5 text-intertitre group-hover:text-rouge">
              {propertyTitle(p)}, {propertySurface(p)}
            </h3>
            <p className="titre mt-0.5 font-semibold">{priceLabel(p)}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {propertyFeatures(p)
                .slice(0, 3)
                .map((f) => (
                  <li
                    key={f}
                    className="rounded-full bg-pierre px-3 py-1 text-[0.8125rem]"
                  >
                    {f}
                  </li>
                ))}
            </ul>
          </Link>
        </div>
      ))}
    </div>
  );
}

export function ListeMosaique({ items }: { items: Property[] }) {
  const [first, ...rest] = items;
  if (!first) return null;
  const image = mainImage(first);
  return (
    <div>
      <Link
        href={href(first)}
        className="group grid gap-6 md:grid-cols-12 md:items-end md:gap-10"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-photo bg-pierre md:col-span-8 md:aspect-[16/10]">
          {image && (
            <Image
              src={image.url}
              alt=""
              fill
              sizes="66vw"
              className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
            />
          )}
          <span className="absolute top-4 left-4 rounded-full bg-blanc px-3 py-1 text-mention">
            Nouveau
          </span>
        </div>
        <div className="md:col-span-4 md:pb-4">
          <Place p={first} />
          <h3 className="titre mt-1 text-section group-hover:text-rouge">
            {propertyTitle(first)}
          </h3>
          <p className="titre mt-2 text-chiffre font-semibold">
            {priceLabel(first)}
          </p>
          <p className="mt-1 text-gris">{propertySurface(first)}</p>
        </div>
      </Link>
      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-8">
        {rest.map((p) => (
          <PropertyCard
            key={p.id}
            property={p}
            href={href(p)}
            ratio="aspect-[4/5]"
            sizes="25vw"
          />
        ))}
      </div>
    </div>
  );
}

/* ——— Section 3 : fin de liste ——— */

export function FinCarte() {
  return (
    <div className="grid gap-8 rounded-[14px] bg-pierre p-6 md:grid-cols-12 md:items-center md:p-10">
      <div className="md:col-span-6">
        <h3 className="titre text-section leading-tight">
          Vous ne trouvez pas votre bien ?
        </h3>
        <p className="mt-3 text-gris">
          Certains biens partent avant d’être publiés. Dites-nous ce que vous
          cherchez, nous vous appelons dès qu’un bien correspond.
        </p>
      </div>
      <form className="grid gap-3 md:col-span-6 md:grid-cols-2">
        <input
          className="champ rounded-full px-5"
          placeholder="Ex. 3 pièces avec balcon"
        />
        <input
          className="champ rounded-full px-5"
          placeholder="Votre téléphone"
          type="tel"
        />
        <p className="text-[0.75rem] text-gris md:col-span-2">
          Votre numéro sert uniquement à vous rappeler.
        </p>
        <span className="bouton bouton-sombre rounded-full md:col-span-2 md:justify-self-start">
          Être rappelé
        </span>
      </form>
    </div>
  );
}

export function FinLigne() {
  return (
    <div className="flex flex-col items-start justify-between gap-5 rounded-full border border-filet py-3 pr-3 pl-6 md:flex-row md:items-center">
      <p className="flex items-center gap-2.5">
        <span className="size-2 rounded-full bg-rouge" aria-hidden />
        Un bien qui n’est pas encore en ligne vous intéresse peut-être.
      </p>
      <a
        href={agency.phone.href}
        className="inline-flex items-center gap-2 rounded-full bg-rouge px-5 py-2.5 text-[0.9375rem] font-medium text-blanc"
      >
        <Phone size={16} aria-hidden />
        Parlons-en, {agency.phone.display}
      </a>
    </div>
  );
}

/* ——— Section 4 : récemment vendus ——— */

export function Vendus({ items }: { items: Property[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="titre text-section">Récemment vendus</h3>
        <span className="text-mention text-gris">
          Exemple avec des biens actuels
        </span>
      </div>
      <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
        {items.map((p) => {
          const image = mainImage(p);
          return (
            <div key={p.id} className="w-[15rem] shrink-0 snap-start">
              <div className="relative aspect-[4/3] overflow-hidden rounded-photo bg-pierre">
                {image && (
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="15rem"
                    className="object-cover grayscale-[0.6]"
                  />
                )}
                <span className="absolute top-3 left-3 rounded-full bg-encre px-3 py-1 text-[0.8125rem] text-blanc">
                  Vendu
                </span>
              </div>
              <p className="mt-2 text-mention">
                {propertyTitle(p)}, {propertySurface(p)}
              </p>
              <Place p={p} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
