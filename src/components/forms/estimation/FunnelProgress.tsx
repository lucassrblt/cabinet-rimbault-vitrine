"use client";

import { motion } from "framer-motion";
import { TOTAL } from "./estimation-funnel";

/**
 * En-tête de progression du tunnel : phase courante, compteur d'étape et barre
 * de progression animée.
 */
export function FunnelProgress({
  step,
  progress,
  phase,
}: {
  step: number;
  progress: number;
  phase: 1 | 2;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:mb-10">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
          {phase === 1 ? "Votre bien" : "Votre projet"}
        </p>
        <p className="font-display text-sm tracking-tight text-muted">
          <span className="text-primary">{step + 1}</span>
          <span className="mx-1.5 text-subtle">/</span>
          <span>{TOTAL}</span>
        </p>
      </div>
      <div
        className="relative h-1 w-full overflow-hidden rounded-full bg-neutral-200/70"
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-primary-600"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
