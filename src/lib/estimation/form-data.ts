// État du tunnel ⇄ FormData. Sert à l'envoi (Server Action) et à la reprise
// depuis sessionStorage : dans les deux cas, la relecture passe par
// `estimationStateFromFormData`, qui vide toute valeur hors liste.

import {
  type EstimationState,
  emptyEstimationState,
  estimationStateFromFormData,
} from "@/lib/forms/estimation-schema";

export function estimationStateToFormData(
  state: EstimationState,
  form: FormData = new FormData(),
): FormData {
  for (const [key, value] of Object.entries(state)) {
    if (typeof value === "boolean") {
      if (value) form.set(key, "true");
    } else {
      form.set(key, value);
    }
  }
  return form;
}

/** Relit un objet inconnu (sessionStorage) en état valide, ou `null`. */
export function sanitizeEstimationState(
  value: unknown,
): EstimationState | null {
  if (!value || typeof value !== "object") return null;
  const empty = emptyEstimationState();
  const form = new FormData();
  for (const key of Object.keys(empty) as (keyof EstimationState)[]) {
    const raw = (value as Record<string, unknown>)[key];
    if (typeof empty[key] === "boolean") {
      if (raw === true) form.set(key, "true");
    } else if (typeof raw === "string") {
      form.set(key, raw);
    }
  }
  return estimationStateFromFormData(form);
}

/** Vrai si au moins une réponse a été donnée (l'objet par défaut ne compte pas). */
export function hasAnswers(state: EstimationState): boolean {
  const empty = emptyEstimationState(state.intent);
  return (Object.keys(empty) as (keyof EstimationState)[]).some(
    (key) => key !== "intent" && state[key] !== empty[key],
  );
}
