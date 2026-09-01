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

/**
 * Panneau texte du hero « carte » (DA moderne chaleureux) : fond clair,
 * badge chip, H1 sombre, 2 CTA, pastille Google. La photo occupe l'autre
 * moitié de la carte (posée par la page).
 */
export function HeroContent({ reviews }: { reviews: HeroReviews | null }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={heroContainer}
      className="flex flex-col justify-center px-6 py-12 md:px-12 md:py-16 lg:px-14"
    >
      <motion.p
        variants={heroLine}
        className="inline-flex w-fit items-center rounded-full border border-subtle bg-card px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary-600"
      >
        Cabinet immobilier à Asnières-sur-Seine
      </motion.p>

      <motion.h1
        variants={heroLine}
        className="mt-5 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-primary md:text-5xl"
      >
        Vendre ou acheter à Asnières-sur-Seine, avec un interlocuteur unique.
      </motion.h1>

      <motion.p
        variants={heroLine}
        className="mt-5 max-w-md text-base leading-relaxed text-body md:text-lg"
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
          className="inline-flex items-center gap-2 rounded-lg border border-default bg-card px-6 py-3 text-sm font-semibold text-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-strong hover:bg-section/40 active:translate-y-0"
        >
          Voir nos biens
        </Link>
      </motion.div>

      {reviews && (
        <motion.div variants={heroLine} className="mt-8">
          <a
            href={reviews.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Note de ${formatRating(reviews.rating)} sur 5 — ${reviews.totalCount} avis Google, voir la fiche`}
            className="inline-flex items-center gap-2.5 rounded-full border border-subtle bg-card px-4 py-2 shadow-sm transition-colors hover:border-default"
          >
            <GoogleGlyph className="h-4 w-4 shrink-0" />
            <span className="font-display text-base font-semibold text-primary">
              {formatRating(reviews.rating)}
            </span>
            <Rating value={reviews.rating} />
            <span className="text-sm text-muted">
              {reviews.totalCount} avis
            </span>
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}
