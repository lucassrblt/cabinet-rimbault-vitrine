"use client";

import { motion } from "framer-motion";
import { heroContainer, heroLine } from "@/lib/motion";

export function HeroContent() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={heroContainer}
      className="relative z-10 mx-auto flex min-h-[80svh] w-full max-w-7xl flex-col justify-center px-gutter pb-24 pt-28 md:pb-28 md:pt-32"
    >
      <motion.p
        variants={heroLine}
        className="inline-block w-fit rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-on-primary"
      >
        Cabinet immobilier à Asnières-sur-Seine
      </motion.p>

      <motion.h1
        variants={heroLine}
        className="mt-4 max-w-2xl font-display text-display font-semibold leading-tight text-white"
      >
        Trouver chez nous,
        <br />
        votre futur chez vous.
      </motion.h1>

      <motion.p
        variants={heroLine}
        className="mt-5 max-w-lg text-base leading-relaxed text-white/80 md:text-lg"
      >
        Nous accompagnons depuis 2009 nos clients dans leurs projets d'achat, de
        vente, d'estimation et de location.
      </motion.p>
    </motion.div>
  );
}
