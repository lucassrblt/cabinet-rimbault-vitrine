"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { EASE, HERO } from "@/lib/motion";

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
  src: string;
  alt: string;
  objectPosition?: string;
  priority?: boolean;
  sizes?: string;
  /** Dézoom au montage (1.04 → 1). Désactiver si l'entrée est gérée ailleurs. */
  settle?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

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
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
        sizes={sizes}
      />
    </motion.div>
  );
}
