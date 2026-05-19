"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { AGENT } from "@/lib/config/agent";

/**
 * Écran de confirmation affiché après l'envoi de la demande d'estimation.
 */
export function EstimationConfirmation({
  leadId,
  firstName,
}: {
  leadId: string;
  firstName: string;
}) {
  const hasPhone = AGENT.phoneE164 && AGENT.phoneE164 !== "TODO";
  return (
    <motion.div
      data-lead-id={leadId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
        Demande envoyée
      </p>
      <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.15] tracking-tight text-primary md:text-4xl">
        {firstName ? `Merci ${firstName}.` : "Merci."}
        <br />
        <span className="text-muted">À très vite.</span>
      </h2>
      <p className="mt-5 max-w-md text-[15px] leading-[1.7] text-body">
        Le Cabinet Rimbault prend connaissance de votre dossier et revient vers
        vous avec une première estimation.
      </p>
      <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/vendre"
          className="inline-flex flex-1 items-center justify-center gap-2 border border-primary-600 px-4 py-2.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-600 hover:text-on-primary"
        >
          Découvrir notre méthode
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/acheter"
          className="inline-flex flex-1 items-center justify-center gap-2 border border-default px-4 py-2.5 text-sm font-medium text-body transition-colors hover:border-neutral-400 hover:text-primary"
        >
          Voir les biens à vendre
        </Link>
      </div>
      {hasPhone && (
        <a
          href={`tel:${AGENT.phoneE164}`}
          className="mt-8 inline-flex items-center gap-2 text-sm text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          Joindre le cabinet directement au {AGENT.phoneDisplay}
        </a>
      )}
      <p className="mt-10 text-xs tracking-wide text-subtle">
        Référence&nbsp;: {leadId}
      </p>
    </motion.div>
  );
}
