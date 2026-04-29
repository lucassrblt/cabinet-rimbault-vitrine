"use client";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getPropertyBadges } from "@/components/property/PropertyBadges";
import { Badge } from "@/components/ui/Badge";
import type { Property } from "@/lib/api/types";
import { cn, formatPrice, formatSurface } from "@/lib/utils";

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

function formatFloor(floor: number | null | undefined): string | null {
  if (floor == null) return null;
  if (floor === 0) return "Rez-de-chaussée";
  if (floor === 1) return "1er étage";
  return `${floor}e étage`;
}

function buildAmenityLabels(amenities: Property["amenities"]): string[] {
  if (!amenities) return [];
  const labels: string[] = [];
  if (amenities.hasTerrace) labels.push("Terrasse");
  if (amenities.hasBalcony) labels.push("Balcon");
  if (amenities.hasParking || amenities.hasGarage) labels.push("Parking");
  if (amenities.hasCellar) labels.push("Cave");
  if (amenities.hasGarden) labels.push("Jardin");
  if (amenities.hasPool) labels.push("Piscine");
  return labels;
}

export function FeaturedCarousel({ properties }: { properties: Property[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = cardRefs.current.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        }
      },
      { root: container, threshold: 0.6 },
    );

    for (const card of cardRefs.current) {
      if (card) observer.observe(card);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToCard = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, []);

  return (
    <div>
      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto"
      >
        {properties.map((property, i) => {
          const city = property.location?.city;
          const neighborhood = property.location?.neighborhood;
          const location = [city, neighborhood].filter(Boolean).join(" – ");
          const surface = property.characteristics?.surface;
          const rooms = property.characteristics?.rooms;
          const floor = property.characteristics?.floor;
          const price = property.finance?.price;
          const amenityLabels = buildAmenityLabels(property.amenities);
          const floorLabel = formatFloor(floor);
          const badges = getPropertyBadges(property);

          const hasAmenities = amenityLabels.length > 0;

          const line1Parts: string[] = [];
          if (rooms != null)
            line1Parts.push(`${rooms} pièce${rooms > 1 ? "s" : ""}`);
          if (hasAmenities) {
            line1Parts.push(...amenityLabels);
          } else {
            if (surface != null) line1Parts.push(formatSurface(surface));
            if (floorLabel) line1Parts.push(floorLabel);
          }

          const line2Parts: string[] = [];
          if (hasAmenities) {
            if (surface != null) line2Parts.push(formatSurface(surface));
            if (floorLabel) line2Parts.push(floorLabel);
          }

          return (
            <article
              key={property.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-card
              className="w-[85%] flex-shrink-0 snap-start overflow-hidden rounded-[10px] border border-subtle bg-card shadow-sm transition-shadow duration-200 hover:shadow-md sm:w-[45%] lg:w-[calc(33.333%-0.875rem)]"
            >
              <Link href={`/bien/${property.reference}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                  <ImageSlider property={property} />
                  {badges.length > 0 && (
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      {badges.map((b) => (
                        <Badge key={b.label} tone="neutral">
                          {b.label.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 p-5">
                  {location && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                      {location}
                    </p>
                  )}

                  {line1Parts.length > 0 && (
                    <p className="text-sm font-semibold text-primary">
                      {line1Parts.join(" – ")}
                    </p>
                  )}

                  {line2Parts.length > 0 && (
                    <p className="text-xs text-muted">
                      {line2Parts.join(" – ")}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(price)}
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-none bg-primary-600 text-on-primary transition-colors duration-150 hover:bg-primary-700">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {properties.length > 1 && (
        <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
          {properties.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Aller au bien ${i + 1}`}
              onClick={() => scrollToCard(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-6 bg-primary-600"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
