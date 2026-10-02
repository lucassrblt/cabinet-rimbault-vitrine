"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { PropertyImage } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/** Les photos d'un bien, à feuilleter sans ouvrir la fiche. */
export function CardCarousel({
  images,
  ratio,
  sizes,
}: {
  images: PropertyImage[];
  ratio: string;
  sizes: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const go = (delta: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({
      left:
        el.clientWidth *
        Math.max(0, Math.min(images.length - 1, index + delta)),
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn(
        "group/carousel relative overflow-hidden rounded-photo bg-pierre",
        ratio,
      )}
    >
      <div
        ref={track}
        onScroll={(e) =>
          setIndex(
            Math.round(
              e.currentTarget.scrollLeft / e.currentTarget.clientWidth,
            ),
          )
        }
        className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
      >
        {images.map((img, i) => (
          <div
            key={img.id}
            className="relative h-full w-full shrink-0 snap-start"
          >
            <Image
              src={img.url}
              alt={img.alt ?? ""}
              fill
              sizes={sizes}
              preload={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((img, i) => (
              <span
                key={img.id}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i === index ? "bg-blanc" : "bg-blanc/45",
                )}
              />
            ))}
          </div>
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                go(d);
              }}
              aria-label={d < 0 ? "Photo précédente" : "Photo suivante"}
              className={cn(
                "absolute top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-blanc/90 opacity-0 shadow-[0_4px_14px_-6px_rgb(36_31_30/0.5)] transition-opacity group-hover/carousel:opacity-100 md:flex",
                d < 0 ? "left-3" : "right-3",
                (d < 0 ? index === 0 : index === images.length - 1) &&
                  "invisible",
              )}
            >
              {d < 0 ? (
                <ChevronLeft size={18} aria-hidden />
              ) : (
                <ChevronRight size={18} aria-hidden />
              )}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
