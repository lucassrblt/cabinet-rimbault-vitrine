"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TOTAL } from "./estimation-funnel";

/**
 * Navigation du tunnel.
 * - Étape 0 : pas de « Retour », « Continuer » en pleine largeur.
 * - Étapes intermédiaires : « Retour » + « Continuer ».
 * - Dernière étape : « Retour » + « Envoyer ma demande ».
 * Le bouton d'avancement est désactivé tant que les champs requis de l'étape
 * ne sont pas renseignés (`canProceed`).
 */
export function FunnelNav({
  step,
  canProceed,
  isPending,
  onPrev,
  onNext,
  onSubmit,
}: {
  step: number;
  canProceed: boolean;
  isPending: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  const isFirst = step === 0;
  const isLast = step === TOTAL - 1;

  const submitButton = (
    <Button
      type="button"
      size="lg"
      onClick={onSubmit}
      disabled={isPending || !canProceed}
      className={isFirst ? "w-full" : "sm:min-w-[14rem]"}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Envoi en cours…
        </>
      ) : (
        <>
          Envoyer ma demande
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </>
      )}
    </Button>
  );

  const nextButton = (
    <Button
      type="button"
      size="lg"
      onClick={onNext}
      disabled={!canProceed}
      className={isFirst ? "w-full" : "sm:min-w-[12rem]"}
    >
      Continuer
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Button>
  );

  const action = isLast ? submitButton : nextButton;

  if (isFirst) {
    return <div className="mt-8 border-t border-subtle pt-5">{action}</div>;
  }

  return (
    <div className="mt-8 flex flex-col-reverse items-stretch gap-3 border-t border-subtle pt-5 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onPrev}
        className="inline-flex items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium text-body transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Retour
      </button>
      {action}
    </div>
  );
}
