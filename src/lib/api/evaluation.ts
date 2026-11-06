import "server-only";
import { apiPost } from "./client";
import type { CreatedResponse, EvaluationPayload } from "./types";

/**
 * Envoie une demande d'estimation (`POST /evaluation`). L'API enregistre la
 * demande et notifie l'agent par e-mail (lot API). Lève `ApiConfigError` ou
 * `ApiError` : la Server Action du tunnel transforme l'erreur en message.
 */
export function postEvaluation(
  payload: EvaluationPayload,
): Promise<CreatedResponse> {
  return apiPost<CreatedResponse>("/evaluation", payload);
}
