"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { PropertyImage } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type Props = {
  images: PropertyImage[];
  ratio: string;
  sizes: string;
  /** Lien de la fiche : un clic sur la photo l'ouvre. */
  href?: string;
  /** Compteur « 1 / 5 » à la place des points. */
  counter?: boolean;
  className?: string;
};

function Slide({
  img,
  sizes,
  first,
}: {
  img: PropertyImage;
  sizes: string;
  first: boolean;
}) {
  return (
    <Image
      src={img.url}
      alt={img.alt ?? ""}
      fill
      sizes={sizes}
      preload={first}
      className="object-cover"
    />
  );
}

/** Les photos d'un bien, à feuilleter sans ouvrir la fiche. */
export function CardCarousel({
  images,
  ratio,
  sizes,
  href,
  counter,
  className,
}: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const go = (delta: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(images.length - 1, index + delta));
    el.scrollTo({ left: el.clientWidth * target, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "group/carousel relative overflow-hidden rounded-photo bg-pierre",
        ratio,
        className,
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
        {images.map((img, i) =>
          href ? (
            <Link
              key={img.id}
              href={href}
              tabIndex={i === 0 ? undefined : -1}
              className="relative h-full w-full shrink-0 snap-start"
            >
              <Slide img={img} sizes={sizes} first={i === 0} />
            </Link>
          ) : (
            <div
              key={img.id}
              className="relative h-full w-full shrink-0 snap-start"
            >
              <Slide img={img} sizes={sizes} first={i === 0} />
            </div>
          ),
        )}
      </div>

      {images.length > 1 && (
        <>
          {counter ? (
            <span
              className="pointer-events-none absolute right-3 bottom-3 rounded-controle bg-encre/70 px-3 py-1 text-[0.8125rem] text-blanc tabular-nums backdrop-blur-sm"
              aria-live="polite"
            >
              {index + 1} / {images.length}
            </span>
          ) : (
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
          )}
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => go(d)}
              aria-label={d < 0 ? "Photo précédente" : "Photo suivante"}
              className={cn(
                "absolute top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-controle bg-blanc/90 opacity-0 shadow-[0_4px_14px_-6px_rgb(36_31_30/0.5)] transition-opacity duration-300 group-hover/carousel:opacity-100 focus-visible:opacity-100 md:flex",
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
