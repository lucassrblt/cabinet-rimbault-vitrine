"use server";

import { headers } from "next/headers";
import { ApiConfigError, ApiError } from "@/lib/api/client";
import { postContact } from "@/lib/api/contact";
import type { ContactPayload } from "@/lib/api/types";
import {
  type ContactErrors,
  type ContactState,
  contactStateFromFormData,
  mapContactApiFields,
  resolveContactSubject,
  validateContact,
} from "@/lib/forms/contact-schema";
import { isLikelySpam, spamFieldsFrom } from "@/lib/forms/spam";
import {
  formString,
  MESSAGES,
  normalizeEmail,
  normalizePhoneFR,
} from "@/lib/forms/validators";

// Server Action du formulaire de contact (doc 04 §3.8), partagée par /contact
// et la fiche bien (lot 2). Ne fait jamais confiance au navigateur : tout est
// revalidé ici. Champ piège rempli ou envoi trop rapide : « succès » affiché,
// aucun appel à l'API (doc 04 §3.5).

export type ContactSource = "vitrine/contact" | "vitrine/fiche";

export type ContactResult = {
  status: "idle" | "success" | "invalid" | "failed";
  errors: ContactErrors;
  /** Saisie renvoyée telle quelle (envoi sans JavaScript : rien n'est perdu). */
  values: ContactState | null;
  /** Incrémenté à chaque réponse, pour reprendre le focus du résumé. */
  attempt: number;
};

const SOURCES: readonly ContactSource[] = ["vitrine/contact", "vitrine/fiche"];

function nonEmpty(value: string | null | undefined, max = 500) {
  const v = (value ?? "").trim().slice(0, max);
  return v === "" ? undefined : v;
}

export async function submitContact(
  previous: ContactResult,
  form: FormData,
): Promise<ContactResult> {
  const attempt = previous.attempt + 1;
  const values = contactStateFromFormData(form);
  const rawSource = formString(form.get("source"));
  const source: ContactSource = SOURCES.includes(rawSource as ContactSource)
    ? (rawSource as ContactSource)
    : "vitrine/contact";

  const subject = resolveContactSubject(values);
  // Sur /contact, l'objet est demandé ; sur la fiche, il est imposé.
  const requireTopic = subject === "OTHER";
  const errors = validateContact(values, { requireTopic });
  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors, values, attempt };
  }

  if (isLikelySpam(spamFieldsFrom(form))) {
    return { status: "success", errors: {}, values: null, attempt };
  }

  // La référence ne part que si elle concerne la demande : fiche, ou objet
  // « Un bien en particulier » sur /contact.
  const withReference = subject !== "OTHER" || values.topic === "bien";
  const reference = withReference
    ? nonEmpty(values.propertyReference, 40)
    : undefined;

  const requestHeaders = await headers();
  const payload: ContactPayload = {
    subject,
    ...(reference ? { propertyReference: reference } : {}),
    contact: {
      firstName: values.firstName,
      lastName: values.lastName,
      email: normalizeEmail(values.email),
      ...(values.phone ? { phone: normalizePhoneFR(values.phone) } : {}),
      message: values.message,
    },
    consent: { rgpd: true },
    meta: {
      source,
      page: nonEmpty(formString(form.get("page")), 300),
      userAgent: nonEmpty(requestHeaders.get("user-agent"), 300),
      referer: nonEmpty(formString(form.get("referer")), 300),
    },
  };

  try {
    await postContact(payload);
    return { status: "success", errors: {}, values: null, attempt };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        const fieldErrors = mapContactApiFields(error.body?.fields);
        if (Object.keys(fieldErrors).length > 0) {
          return { status: "invalid", errors: fieldErrors, values, attempt };
        }
      }
      if (error.status === 422) {
        return {
          status: "invalid",
          errors: { rgpd: MESSAGES.rgpd },
          values,
          attempt,
        };
      }
      console.error(`[contact] ${error.message}`);
    } else if (error instanceof ApiConfigError) {
      console.error(`[contact] ${error.message}`);
    } else {
      console.error("[contact] Échec de l’envoi :", error);
    }
    return { status: "failed", errors: {}, values, attempt };
  }
}
