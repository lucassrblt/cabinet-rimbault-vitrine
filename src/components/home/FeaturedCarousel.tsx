"use client";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Property } from "@/lib/api/types";
import { formatPrice, formatSurface } from "@/lib/utils";

function ImageSlider({ property }: { property: Property }) {
  const ordered = [...property.images].sort((a, b) => {
    if (a.isMain !== b.isMain) return a.isMain ? -1 : 1;
    return a.order - b.order;
  });

  const [index, setIndex] = useState(0);
  const total = ordered.length;

  if (total === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-muted">
        <ImageIcon className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="group/slider relative h-full w-full overflow-hidden">
      <div
        className="flex h-full transition-transform duration-400 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {ordered.map((img, i) => (
          // biome-ignore lint/performance/noImgElement: remote image host not pre-configured at MVP
          <img
            key={img.id}
            src={img.url}
            alt={img.alt ?? property.title}
            className="h-full w-full flex-shrink-0 object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Photo précédente"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIndex((i) => (i - 1 + total) % total);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-neutral-800 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 group-hover/slider:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Photo suivante"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIndex((i) => (i + 1) % total);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-neutral-800 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 group-hover/slider:opacity-100"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div
            className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5"
            aria-hidden="true"
          >
            {ordered.map((img, i) => (
              <span
                key={img.id}
                className={`rounded-full transition-all duration-300 ${i === index ? "h-1.5 w-3 bg-white" : "h-1.5 w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function FeaturedCarousel({ properties }: { properties: Property[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto"
    >
      {properties.map((property) => {
        const city = property.location?.city;
        const neighborhood = property.location?.neighborhood;
        const location = [city, neighborhood].filter(Boolean).join(" — ");
        const surface = property.characteristics?.surface;
        const rooms = property.characteristics?.rooms;
        const bathrooms = property.characteristics?.bathrooms;
        const price = property.finance?.price;

        return (
          <article
            key={property.id}
            data-card
            className="w-[85%] flex-shrink-0 snap-start overflow-hidden rounded-sm border border-subtle bg-card shadow-sm transition-shadow duration-200 hover:shadow-md sm:w-[45%] lg:w-[calc(33.333%-0.875rem)]"
          >
            <Link href={`/bien/${property.reference}`}>
              <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
                <ImageSlider property={property} />
              </div>

              <div className="flex flex-col gap-1.5 p-5">
                {location && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {location}
                  </p>
                )}
                <h3 className="text-base font-semibold text-primary">
                  {property.title}
                </h3>
                <p className="text-sm text-body">
                  {formatSurface(surface)}
                  {rooms != null && ` · ${rooms} pièce${rooms > 1 ? "s" : ""}`}
                  {bathrooms != null && ` · ${bathrooms} sdb`}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-lg font-semibold text-primary">
                    {formatPrice(price)}
                  </p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary-600 text-on-primary transition-colors duration-150 hover:bg-primary-700">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
