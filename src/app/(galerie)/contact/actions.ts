"use server";

import { headers } from "next/headers";
import { ApiConfigError, ApiError } from "@/lib/api/client";
import { postContact } from "@/lib/api/contact";
import { getProperty } from "@/lib/api/properties";
import type { ContactPayload } from "@/lib/api/types";
import { mapContactApiFields } from "@/lib/forms/contact-schema";
import { isLikelySpam, spamFieldsFrom } from "@/lib/forms/spam";
import {
  clean,
  cleanMultiline,
  formBoolean,
  formString,
  MESSAGES,
  normalizeEmail,
  normalizePhoneFR,
} from "@/lib/forms/validators";
import { transactionOf } from "@/lib/property/view";
import {
  type Erreurs,
  isObjet,
  type Saisie,
  sujetApi,
  valider,
} from "@/variantes/galerie/contact/sujets";

// Server Action du formulaire de contact de la Galerie. Même contrat que
// `submitContact` de /contact (revalidation complète, anti-spam silencieux,
// erreurs 400 sous les champs, saisie conservée en cas d'échec), avec l'objet
// « La vente de votre bien » en plus. Pour « Un bien en particulier », la
// référence est vérifiée auprès de l'API : connue, le message part en
// BIEN_SALE / BIEN_RENT, comme depuis une fiche.

export type ResultatContact = {
  status: "idle" | "success" | "invalid" | "failed";
  errors: Erreurs;
  /** Saisie renvoyée telle quelle (envoi sans JavaScript : rien n'est perdu). */
  values: Saisie | null;
  /** Incrémenté à chaque réponse, pour reprendre le focus du résumé. */
  attempt: number;
};

function nonEmpty(value: string | null | undefined, max = 500) {
  const v = (value ?? "").trim().slice(0, max);
  return v === "" ? undefined : v;
}

function saisieDepuis(form: FormData): Saisie {
  const s = (name: string) => formString(form.get(name));
  const objet = s("objet");
  return {
    objet: isObjet(objet) ? objet : "",
    propertyReference: clean(s("propertyReference")),
    firstName: clean(s("firstName")),
    lastName: clean(s("lastName")),
    email: clean(s("email")),
    phone: clean(s("phone")),
    message: cleanMultiline(s("message")),
    rgpd: formBoolean(form.get("rgpd")),
  };
}

/** Transaction du bien cité, ou `null` s'il est inconnu (ou l'API muette). */
async function transactionDe(reference: string | undefined) {
  if (!reference) return null;
  try {
    const property = await getProperty(reference);
    return property ? transactionOf(property) : null;
  } catch {
    return null;
  }
}

export async function envoyerContact(
  previous: ResultatContact,
  form: FormData,
): Promise<ResultatContact> {
  const attempt = previous.attempt + 1;
  const values = saisieDepuis(form);
  const errors = valider(values);
  if (Object.keys(errors).length > 0 || values.objet === "") {
    return { status: "invalid", errors, values, attempt };
  }

  if (isLikelySpam(spamFieldsFrom(form))) {
    return { status: "success", errors: {}, values: null, attempt };
  }

  // La référence ne part que si elle concerne la demande.
  const reference =
    values.objet === "bien"
      ? nonEmpty(values.propertyReference, 40)
      : undefined;
  const subject = sujetApi(values.objet, await transactionDe(reference));

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
      source: "vitrine/contact",
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
          const { subject: _s, topic: _t, ...champs } = fieldErrors;
          return { status: "invalid", errors: champs, values, attempt };
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
      console.error(`[contact galerie] ${error.message}`);
    } else if (error instanceof ApiConfigError) {
      console.error(`[contact galerie] ${error.message}`);
    } else {
      console.error("[contact galerie] Échec de l’envoi :", error);
    }
    return { status: "failed", errors: {}, values, attempt };
  }
}
