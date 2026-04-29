"use client";

import { ArrowRight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import type { Property } from "@/lib/api/types";
import { formatPrice, formatSurface } from "@/lib/utils";

function MainImage({ property }: { property: Property }) {
  const main =
    property.images.find((img) => img.isMain) ??
    property.images.slice().sort((a, b) => a.order - b.order)[0];
  if (!main) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-muted">
        <ImageIcon className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }
  return (
    // biome-ignore lint/performance/noImgElement: remote image host not pre-configured at MVP
    <img
      src={main.url}
      alt={main.alt ?? property.title}
      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      loading="lazy"
    />
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
                <MainImage property={property} />
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
