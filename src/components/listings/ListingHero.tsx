"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

const EASE = [0.22, 1, 0.36, 1] as const;

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  } as const;
}

type Mode = "sale" | "rent";

const CONTENT: Record<Mode, { crumb: string; eyebrow: string; lede: string }> =
  {
    sale: {
      crumb: "Acheter",
      eyebrow: "Nos biens à la vente",
      lede: "Notre portefeuille de biens géré par le cabinet",
    },
    rent: {
      crumb: "Louer",
      eyebrow: "Nos biens à la location",
      lede: "Notre portfeuille de biens locatif gérer par le cabinet",
    },
  };

/**
 * Bandeau photo des pages listing. Porte l'unique `<h1>` de la page. La carte
 * de filtres qui le chevauche est posée par la page (marge négative).
 */
export function ListingHero({
  mode,
  city,
  image,
  imageAlt,
}: {
  mode: Mode;
  city: string;
  image: string;
  imageAlt: string;
}) {
  const c = CONTENT[mode];
  const verb = mode === "sale" ? "Acheter" : "Louer";

  return (
    <div className="relative overflow-hidden">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent"
      />

      <div className="relative z-10 mx-auto flex min-h-[clamp(20rem,46vw,30rem)] w-full max-w-7xl flex-col justify-end px-gutter pt-14 pb-28 md:pt-16 md:pb-32">
        <motion.div {...reveal(0)}>
          <Breadcrumb
            tone="light"
            items={[{ label: "Accueil", href: "/" }, { label: c.crumb }]}
          />
        </motion.div>

        <motion.p
          {...reveal(0.15)}
          className="mt-6 flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white"
        >
          <span aria-hidden="true" className="h-px w-7 bg-white/60" />
          {c.eyebrow}
        </motion.p>

        <motion.h1
          {...reveal(0.3)}
          className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl"
        >
          {verb} à {city} et ses environs.
        </motion.h1>

        <motion.p
          {...reveal(0.45)}
          className="mt-4 max-w-xl text-base leading-relaxed text-white/80"
        >
          {c.lede}
        </motion.p>
      </div>
    </div>
  );
}
