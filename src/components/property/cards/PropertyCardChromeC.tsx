import { BedDouble, Building2, LayoutGrid, Maximize2 } from "lucide-react";
import Link from "next/link";
import type { Property } from "@/lib/api/types";
import { PropertyCardImage } from "./PropertyCardImage";
import { PropertyCardSlider } from "./PropertyCardSlider";
import {
  buildCardAriaLabel,
  getDisplayPrice,
  getDisplayTitle,
  getGeoEyebrow,
  getMetaItems,
  getSliderImages,
  isSold,
  type MetaItem,
} from "./shared";

const ICONS: Record<
  MetaItem["key"],
  React.ComponentType<{ className?: string }>
> = {
  surface: Maximize2,
  rooms: LayoutGrid,
  bedrooms: BedDouble,
  floor: Building2,
};

function Badges({ property }: { property: Property }) {
  const labels: string[] = [];
  if (property.isExclusive) labels.push("Exclusivité");
  if (property.status === "SOUS_COMPROMIS") labels.push("Sous compromis");
  if (property.status === "SOUS_OFFRE") labels.push("Sous offre");
  if (labels.length === 0) return null;
  return (
    <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
      {labels.map((label) => (
        <span
          key={label}
          className="inline-flex items-center rounded-sm bg-black/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white backdrop-blur-sm"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function SoldOverlay({ property }: { property: Property }) {
  if (!isSold(property)) return null;
  const label =
    property.status === "LOUE"
      ? "Loué"
      : property.status === "ARCHIVE"
        ? "Archivé"
        : "Vendu";
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35">
      <span className="font-display text-2xl font-light uppercase tracking-[0.4em] text-white">
        {label}
      </span>
    </div>
  );
}

/** Variante C — Punch couleur.
 *  Aucun chrome ajouté à la carte. La signature vient des couleurs de marque
 *  injectées dans le texte : eyebrow en vert ardoise (secondaire jamais utilisé
 *  ailleurs) + prix XL en grenat profond. Le contenu signe à la place du cadre. */
export function PropertyCardChromeC({ property }: { property: Property }) {
  const sliderImages = getSliderImages(property);
  const primary = sliderImages[0] ?? null;
  const sold = isSold(property);
  const title = getDisplayTitle(property);
  const eyebrow = getGeoEyebrow(property);
  const meta = getMetaItems(property);
  const price = getDisplayPrice(property);

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-section shadow-[0_10px_24px_-12px_rgba(28,27,25,0.18)] ring-1 ring-black/10 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:shadow-[0_18px_36px_-12px_rgba(28,27,25,0.22)]">
        {sold ? (
          <PropertyCardImage
            primary={primary}
            secondary={null}
            alt={title}
            effect="zoom"
          />
        ) : (
          <PropertyCardSlider images={sliderImages} alt={title} />
        )}
        <Badges property={property} />
        <SoldOverlay property={property} />
      </div>

      <div className="flex flex-1 flex-col gap-3 pt-5">
        {eyebrow && (
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary-600">
            {eyebrow}
          </p>
        )}

        <h3 className="font-display text-xl font-medium leading-[1.15] text-primary line-clamp-2">
          {title}
        </h3>

        {meta.length > 0 && (
          <ul
            aria-label="Caractéristiques principales"
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted"
          >
            {meta.map((item, i) => {
              const Icon = ICONS[item.key];
              return (
                <li
                  key={item.key}
                  className="inline-flex items-center gap-1.5"
                  aria-label={item.aria}
                >
                  {i > 0 && (
                    <span aria-hidden="true" className="text-subtle">
                      ·
                    </span>
                  )}
                  <Icon
                    className="h-3.5 w-3.5 text-subtle"
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-auto pt-2 font-display text-3xl font-medium tracking-tight text-primary-700">
          {price}
        </p>
      </div>

      {!sold && (
        <Link
          href={`/bien/${property.reference}`}
          aria-label={buildCardAriaLabel(property)}
          className="absolute inset-0 z-10 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
        />
      )}
    </article>
  );
}
