"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EASE, HERO } from "@/lib/motion";
import { cn } from "@/lib/utils";

// `useLayoutEffect` côté client (résout `complete` avant le paint → pas de flash
// du shimmer si l'image est déjà en cache) ; `useEffect` au rendu serveur.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Image avec parallaxe au scroll + léger dézoom au montage.
 *
 * La couche image est sur-dimensionnée (128 %, débord ±14 %) : la translation
 * de parallaxe (≤ 12,8 % de la hauteur du conteneur) reste sous cette marge,
 * donc aucun bord n'apparaît. Le conteneur parent doit être `relative` et
 * `overflow-hidden`.
 *
 * Le transform piloté au scroll n'étant pas couvert par `MotionConfig`, la
 * parallaxe est neutralisée ici via `useReducedMotion`.
 */
export function ParallaxImage({
  src,
  alt,
  objectPosition,
  priority = true,
  sizes = "100vw",
  settle = true,
}: {
  src: string | StaticImageData;
  alt: string;
  objectPosition?: string;
  priority?: boolean;
  sizes?: string;
  /** Dézoom au montage (1.04 → 1). Désactiver si l'entrée est gérée ailleurs. */
  settle?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();

  // Import statique local → `blurDataURL` auto : on affiche l'aperçu flou natif
  // et on coupe le shimmer gris (redondant, et il masquerait le blur).
  const hasBlur = typeof src === "object";

  // Image déjà en cache avant l'hydratation → `onLoad` ne se déclenche pas.
  useIsomorphicLayoutEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["0%", "10%"],
  );

  return (
    <motion.div
      ref={ref}
      className="absolute inset-x-0 -top-[14%] h-[128%]"
      style={{ y }}
      initial={settle ? { scale: 1.04 } : false}
      animate={settle ? { scale: 1 } : undefined}
      transition={{ duration: HERO.imageSettle, ease: EASE }}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        priority={priority}
        placeholder={hasBlur ? "blur" : "empty"}
        onLoad={() => setLoaded(true)}
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
        sizes={sizes}
      />
      {!hasBlur && (
        <span
          aria-hidden="true"
          className={cn(
            "skeleton-shimmer pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out",
            loaded ? "opacity-0" : "opacity-100",
          )}
        />
      )}
    </motion.div>
  );
}
