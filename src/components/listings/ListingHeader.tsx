"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

const EASE = [0.22, 1, 0.36, 1] as const;

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
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
      lede: "Notre portefeuille de biens locatifs géré par le cabinet",
    },
  };

/**
 * En-tête compact des pages listing (variante A) : signature locale +
 * compteur de biens assumé, sans photo — la grille reste au-dessus du pli.
 * Porte l'unique `<h1>` de la page. La toolbar de filtres qui chevauche la
 * frontière basse est posée par la page (marge négative).
 */
export function ListingHeader({
  mode,
  city,
  total,
  illustration,
}: {
  mode: Mode;
  city: string;
  total: number;
  /** Futur SVG au trait (repère local), posé en fond à droite. */
  illustration?: ReactNode;
}) {
  const c = CONTENT[mode];
  const verb = mode === "sale" ? "Acheter" : "Louer";
  const plural = total > 1 ? "s" : "";
  const transaction = mode === "sale" ? "en vente" : "en location";

  return (
    <div className="relative overflow-hidden">
      {illustration && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block"
        >
          {illustration}
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-gutter pt-10 pb-16 md:pt-12 md:pb-20">
        <motion.div {...reveal(0)}>
          <Breadcrumb
            items={[{ label: "Accueil", href: "/" }, { label: c.crumb }]}
          />
        </motion.div>

        <motion.p
          {...reveal(0.1)}
          className="mt-6 flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-600"
        >
          <span aria-hidden="true" className="h-px w-7 bg-primary-600/60" />
          {c.eyebrow}
        </motion.p>

        <motion.h1
          {...reveal(0.2)}
          className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-primary md:text-4xl"
        >
          {verb} à {city} et ses environs.
        </motion.h1>

        <motion.p
          {...reveal(0.3)}
          className="mt-4 flex max-w-xl items-center gap-2 text-base leading-relaxed text-body"
        >
          {total > 0 ? (
            <>
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-secondary-600"
              />
              <span>
                <strong className="font-semibold text-primary">
                  {total} bien{plural}
                </strong>{" "}
                {transaction}, sélectionné{plural} et suivi{plural}{" "}
                personnellement.
              </span>
            </>
          ) : (
            c.lede
          )}
        </motion.p>
      </div>
    </div>
  );
}
