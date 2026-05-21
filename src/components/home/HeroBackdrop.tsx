"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { EASE, HERO } from "@/lib/motion";

/**
 * Fond du hero — image + dégradés de lisibilité.
 *
 * L'image se « pose » (léger dézoom 1.06 → 1) au montage tandis que les
 * dégradés se densifient. Premier maillon de la timeline d'entrée du hero
 * (cf. `HERO` dans `src/lib/motion.ts`). Effet transform-only : sans impact
 * sur le LCP, et neutralisé automatiquement par `prefers-reduced-motion`.
 */
export function HeroBackdrop() {
  return (
    <>
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.04 }}
        animate={{ scale: 1 }}
        transition={{ duration: HERO.imageSettle, ease: EASE }}
      >
        <Image
          src="/hero-home.jpg"
          alt="Intérieur d'un appartement parisien lumineux"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: HERO.imageSettle, ease: EASE }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: HERO.imageSettle, ease: EASE }}
      />
    </>
  );
}
