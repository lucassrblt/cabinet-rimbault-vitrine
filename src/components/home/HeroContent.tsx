"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GoogleGlyph } from "@/components/reviews/GoogleGlyph";
import { Rating } from "@/components/ui/Rating";
import { heroContainer, heroLine } from "@/lib/motion";

/** Données minimales de la fiche Google passées par le serveur (null si indispo). */
export interface HeroReviews {
  rating: number;
  totalCount: number;
  sourceUrl: string;
}

function formatRating(value: number): string {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function HeroContent({ reviews }: { reviews: HeroReviews | null }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={heroContainer}
      className="relative z-10 mx-auto flex min-h-[76svh] w-full max-w-7xl flex-col justify-center px-gutter pb-24 pt-28 md:pb-28 md:pt-32"
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
        Vendre ou acheter à Asnières-sur-Seine, avec un interlocuteur unique.
      </motion.h1>

      <motion.p
        variants={heroLine}
        className="mt-5 max-w-lg text-base leading-relaxed text-white/80 md:text-lg"
      >
        De l&apos;estimation à la signature, le Cabinet Rimbault vous accompagne
        depuis 2009.
      </motion.p>

      <motion.div
        variants={heroLine}
        className="mt-8 flex flex-wrap items-center gap-3"
      >
        <Link
          href="/estimation"
          className="group inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-on-primary shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md active:translate-y-0"
        >
          Estimer mon bien
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="/acheter"
          className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/20 active:translate-y-0"
        >
          Voir nos biens
        </Link>
      </motion.div>

      {reviews && (
        <motion.div variants={heroLine} className="mt-7">
          <a
            href={reviews.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Note de ${formatRating(reviews.rating)} sur 5 — ${reviews.totalCount} avis Google, voir la fiche`}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-black/30 px-4 py-2 backdrop-blur-sm transition-colors hover:border-white/50"
          >
            <GoogleGlyph className="h-4 w-4 shrink-0" />
            <span className="font-display text-base font-semibold text-white">
              {formatRating(reviews.rating)}
            </span>
            <Rating value={reviews.rating} />
            <span className="text-sm text-white/80">
              {reviews.totalCount} avis
            </span>
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}
