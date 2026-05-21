"use client";

import { motion } from "framer-motion";
import { EASE, HERO } from "@/lib/motion";

/** Container : cadence l'apparition des lignes du hero. */
const container = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: HERO.contentDelay,
      staggerChildren: HERO.contentStagger,
    },
  },
};

/** Ligne : montée + fondu. La montée est neutralisée par reduced-motion. */
const line = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: HERO.duration, ease: EASE },
  },
};

export function HeroContent({ years }: { years: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="relative z-10 mx-auto flex min-h-[80svh] w-full max-w-7xl flex-col justify-center px-4 pb-24 pt-28 md:px-8 md:pb-28 md:pt-32"
    >
      <motion.p
        variants={line}
        className="inline-block w-fit rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-on-primary"
      >
        Agence immobilière en Île-de-France
      </motion.p>

      <motion.h1
        variants={line}
        className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-white md:text-display"
      >
        Trouver chez vous,
        <br />
        près de chez nous.
      </motion.h1>

      <motion.p
        variants={line}
        className="mt-5 max-w-lg text-base leading-relaxed text-white/80 md:text-lg"
      >
        Cabinet indépendant en Île-de-France, nous accompagnons depuis {years}{" "}
        ans les habitants dans leurs projets d&apos;achat, de vente, de
        location, d&apos;estimation et de gestion.
      </motion.p>
    </motion.div>
  );
}
