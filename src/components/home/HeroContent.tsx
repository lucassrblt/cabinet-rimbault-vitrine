"use client";

import { motion } from "framer-motion";

export function HeroContent({ years }: { years: number }) {
  return (
    <div className="relative z-10 mx-auto flex min-h-[80svh] w-full max-w-7xl flex-col justify-center px-4 pb-24 pt-28 md:px-8 md:pb-28 md:pt-32">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block w-fit rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-on-primary"
      >
        Agence immobilière en Île-de-France
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-white md:text-display"
      >
        Trouver chez vous,
        <br />
        près de chez nous.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 max-w-lg text-base leading-relaxed text-white/80 md:text-lg"
      >
        Cabinet indépendant en Île-de-France, nous accompagnons depuis {years}{" "}
        ans les habitants dans leurs projets d&apos;achat, de vente, de
        location, d&apos;estimation et de gestion.
      </motion.p>
    </div>
  );
}
