// Résultat de la Server Action `submitEstimation` (doc 04 §7), partagé entre
// le serveur et le tunnel. Pur, sans dépendance.

import type { EstimationErrors } from "@/lib/forms/estimation-schema";

export type EstimationResult =
  /** Aucun envoi encore. */
  | { status: "idle" }
  /** Demande enregistrée (ou robot présumé : même réponse, rien n'est envoyé). */
  | { status: "success"; at: number }
  /** Données refusées (validation serveur ou 400 de l'API ramenée au champ). */
  | { status: "invalid"; errors: EstimationErrors; at: number }
  /** Réseau, 5xx, configuration : rien n'est effacé, on peut réessayer. */
  | { status: "error"; at: number };

export const INITIAL_RESULT: EstimationResult = { status: "idle" };

/** Champs techniques envoyés avec le formulaire (hors état du tunnel). */
export const SENT_AT_FIELD = "form_sent_at";
export const REFERER_FIELD = "referer";
