"use server";

import { headers } from "next/headers";
import { ApiConfigError, ApiError } from "@/lib/api/client";
import { postEvaluation } from "@/lib/api/evaluation";
import type { ApiErrorBody } from "@/lib/api/types";
import { buildEstimationPayload } from "@/lib/estimation/payload";
import {
  type EstimationResult,
  REFERER_FIELD,
  SENT_AT_FIELD,
} from "@/lib/estimation/result";
import {
  type EstimationErrors,
  estimationStateFromFormData,
  validateEstimation,
} from "@/lib/forms/estimation-schema";
import { isLikelySpam, spamFieldsFrom } from "@/lib/forms/spam";
import { formString, MESSAGES } from "@/lib/forms/validators";

// Server Action du tunnel (doc 04 §3.4 à §3.5, interface figée §7).
// Jamais de confiance au client : l'état est relu et revalidé ici. La clé de
// l'API reste sur le serveur (`lib/api/*`, server-only).

/** Page d'entrée : chemin interne uniquement, sans domaine ni requête. */
function safeReferer(value: FormDataEntryValue | null): string | undefined {
  const raw = formString(value).trim();
  if (!raw.startsWith("/") || raw.startsWith("//")) return undefined;
  const path = raw.split(/[?#]/)[0];
  return /^\/[\w\-./]{0,200}$/.test(path) ? path : undefined;
}

/**
 * Délai de saisie mesuré sur l'horloge du navigateur (premier affichage →
 * envoi), puis reporté sur l'horloge du serveur : un navigateur à l'heure
 * fausse n'est jamais pris pour un robot.
 */
function startedAtOnServerClock(form: FormData, now: number): string {
  const { startedAt } = spamFieldsFrom(form);
  const elapsed =
    Number(formString(form.get(SENT_AT_FIELD))) - Number(startedAt);
  return Number.isFinite(elapsed) && elapsed >= 0 ? String(now - elapsed) : "";
}

/** 400 de l'API : messages techniques ramenés à nos messages, par champ. */
function errorsFromApi(body: ApiErrorBody | null): EstimationErrors | null {
  const text = body?.error ?? "";
  if (/code postal|postalCode/i.test(text))
    return { postalCode: MESSAGES.postalCode };
  if (/e-?mail/i.test(text)) return { email: MESSAGES.email };
  if (/firstName/.test(text)) return { firstName: MESSAGES.firstName };
  if (/lastName/.test(text)) return { lastName: MESSAGES.lastName };
  if (/propertyType/.test(text)) return { propertyType: MESSAGES.propertyType };
  return null;
}

export async function submitEstimation(
  _previous: EstimationResult,
  form: FormData,
): Promise<EstimationResult> {
  const at = Date.now();
  const state = estimationStateFromFormData(form);
  const errors = validateEstimation(state);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors, at };

  // Robot présumé : même réponse qu'un succès, aucun appel à l'API.
  const { honeypot } = spamFieldsFrom(form);
  if (
    isLikelySpam({
      honeypot,
      startedAt: startedAtOnServerClock(form, at),
      now: at,
    })
  )
    return { status: "success", at };

  const userAgent = (await headers()).get("user-agent")?.slice(0, 500);
  const payload = buildEstimationPayload(state, {
    userAgent: userAgent || undefined,
    referer: safeReferer(form.get(REFERER_FIELD)),
  });

  try {
    await postEvaluation(payload);
    return { status: "success", at };
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) {
      const fieldErrors = errorsFromApi(error.body);
      if (fieldErrors) return { status: "invalid", errors: fieldErrors, at };
    }
    const reason =
      error instanceof ApiError
        ? `API ${error.status}`
        : error instanceof ApiConfigError
          ? "configuration"
          : "réseau";
    console.error(`[estimation] envoi impossible (${reason})`);
    return { status: "error", at };
  }
}
