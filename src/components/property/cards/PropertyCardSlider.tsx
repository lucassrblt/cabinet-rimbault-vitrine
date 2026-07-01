"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { PropertyImage } from "@/lib/api/types";
import { EASE } from "@/lib/motion";
import { cn, PHOTO_BLUR_DATA_URL } from "@/lib/utils";

/** Nombre max de photos parcourables sur une carte (la galerie complète vit sur
 *  la fiche) — borne le nombre de points et les requêtes dans les grilles. */
const MAX_CARD_SLIDES = 8;

const DEFAULT_SIZES =
  "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw";

/** Mini-slider de photos pour les cartes de biens : crossfade entre photos,
 *  flèches révélées au survol (visibles au tactile) + points.
 *
 *  Le parent doit porter le `group` (déclenche l'apparition des flèches) et,
 *  s'il englobe un lien de carte, celui-ci doit être un calque `z-10` : les
 *  contrôles sont en `z-20` et stoppent la propagation pour ne pas naviguer. */
export function PropertyCardSlider({
  images,
  alt,
  sizes = DEFAULT_SIZES,
  className,
}: {
  images: PropertyImage[];
  alt: string;
  sizes?: string;
  className?: string;
}) {
  const slides = images.slice(0, MAX_CARD_SLIDES);
  const [index, setIndex] = useState(0);
  const total = slides.length;

  if (total === 0) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-section text-muted",
          className,
        )}
      >
        <ImageIcon className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }

  const step = (delta: number) => (e: React.MouseEvent) => {
    e.preventDefault(); // ne suit pas le Link englobant
    e.stopPropagation(); // n'entraîne pas le drag du carrousel
    setIndex((i) => (i + delta + total) % total);
  };

  const current = slides[index];

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <AnimatePresence initial={false}>
        <motion.div
          key={current.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <Image
            src={current.url}
            alt={current.alt ?? alt}
            fill
            sizes={sizes}
            placeholder="blur"
            blurDataURL={PHOTO_BLUR_DATA_URL}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={step(-1)}
            aria-label="Photo précédente"
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-primary opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={step(1)}
            aria-label="Photo suivante"
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-primary opacity-0 shadow-sm transition hover:bg-white group-hover:opacity-100 focus-visible:opacity-100 max-md:opacity-100"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-2.5 z-20 flex justify-center gap-1.5"
            aria-hidden="true"
          >
            {slides.map((img, i) => (
              <span
                key={img.id}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  i === index ? "bg-white" : "bg-white/50",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
