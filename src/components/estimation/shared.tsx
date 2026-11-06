import type { ReactNode } from "react";
import type {
  EstimationErrors,
  EstimationField,
  EstimationState,
} from "@/lib/forms/estimation-schema";

// Éléments communs aux quatre étapes du tunnel.

export type StepProps = {
  state: EstimationState;
  errors: EstimationErrors;
  /** Fusionne des réponses dans l'état (sauvegardé en sessionStorage). */
  update: (patch: Partial<EstimationState>) => void;
  /** Validation à la sortie d'un champ (doc 03 §6.3). */
  onBlurField: (field: EstimationField) => void;
  /** Résumé d'erreurs, rendu sous le titre d'étape (h2 puis h3). */
  summary?: ReactNode;
};

/** Identifiant DOM d'un champ : cible des liens du résumé d'erreurs. */
export function fieldId(field: EstimationField): string {
  return `estimation-${field}`;
}

/**
 * Titre d'étape (Spectral 28/34) et phrase d'intention, suivis du résumé
 * d'erreurs éventuel : le h3 du résumé vient après le h2 de l'étape (§9).
 */
export function StepHeading({
  title,
  intro,
  summary,
}: {
  title: string;
  intro: ReactNode;
  summary?: ReactNode;
}) {
  return (
    <>
      <div className="mb-8">
        <h2 id="titre-etape" data-titre-etape className="t-etape text-balance">
          {title}
        </h2>
        <p className="t-ui mt-2 text-encre-douce">{intro}</p>
      </div>
      {summary}
    </>
  );
}

/** Mention « (facultatif) » d'une légende de groupe de choix. */
export function Optional() {
  return <span className="ui-label__facultatif"> (facultatif)</span>;
}

/**
 * Aide d'une zone de texte suivie de son compteur de caractères, rendue dans
 * l'aide du champ (même ordre aux étapes 2 et 3) : l'exemple d'abord, le
 * compteur à droite sur la même ligne, ou dessous s'il n'y tient pas.
 * Annoncée avec l'aide (aria-describedby posé par Field).
 */
export function HintWithCount({
  hint,
  length,
  max,
}: {
  hint: ReactNode;
  length: number;
  max: number;
}) {
  const format = new Intl.NumberFormat("fr-FR");
  return (
    <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <span>{hint}</span>
      <span
        className={
          length > max
            ? "chiffres font-medium text-erreur"
            : "chiffres whitespace-nowrap"
        }
      >
        {format.format(length)}&nbsp;sur {format.format(max)}&nbsp;caractères.
      </span>
    </span>
  );
}
