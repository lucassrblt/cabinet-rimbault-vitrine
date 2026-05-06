"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AGENT } from "@/lib/config/agent";

export function HeroContent({ years }: { years: number }) {
  return (
    <div className="relative z-10 mx-auto flex min-h-[calc(100svh-12rem)] w-full max-w-7xl flex-col justify-center px-4 pb-24 pt-14 md:px-8 md:pb-28 md:pt-16">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block w-fit rounded-sm bg-primary-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-on-primary"
      >
        Agence immobilière à {AGENT.address.city}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-white md:text-display"
      >
        Trouver chez vous,
        <br />
        près de chez nous.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 max-w-lg text-base leading-relaxed text-white/75 md:text-lg"
      >
        Cabinet indépendant à {AGENT.address.city}, nous accompagnons depuis{" "}
        {years}
        ans les habitants dans leurs projets d&apos;achat, de vente, de
        location, d&apos;estimation et de gestion.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex flex-wrap gap-4"
      >
        <Link
          href="/acheter"
          className="inline-flex items-center gap-2 rounded-sm bg-primary-600 px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors duration-150 hover:bg-primary-700"
        >
          Voir nos biens
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/estimation"
          className="inline-flex items-center gap-2 rounded-sm border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:border-white hover:bg-white/20"
        >
          Estimer mon bien
        </Link>
      </motion.div>
    </div>
  );
}
