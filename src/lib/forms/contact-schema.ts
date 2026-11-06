// Schéma du formulaire de contact (doc 04 §3.8). Pur : partagé entre
// `ContactForm` (lot 6) et la Server Action `submitContact`.

import type { ContactSubject } from "@/lib/api/types";
import {
  clean,
  cleanMultiline,
  type FieldErrors,
  formBoolean,
  formString,
  isBlank,
  isEmail,
  isOneOf,
  isPhoneFR,
  MESSAGES,
  maxLength,
  tooLong,
} from "./validators";

/** Limite de l'API (`contact.message` 1 à 500 caractères). Compteur visible. */
export const CONTACT_MESSAGE_MAX = 500;
const NAME_MAX = 80;
const REFERENCE_MAX = 40;

/** Objets proposés à l'écran ; l'estimation renvoie vers le tunnel. */
export const CONTACT_TOPICS = ["bien", "location", "autre"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];
export const CONTACT_TOPIC_LABELS: Record<ContactTopic, string> = {
  bien: "Un bien en particulier",
  location: "Une recherche de location",
  autre: "Une autre question",
};

/** Sujets que la vitrine envoie (sous-ensemble de l'enum de l'API). */
export const CONTACT_SUBJECTS = [
  "BIEN_SALE",
  "BIEN_RENT",
  "OTHER",
] as const satisfies readonly ContactSubject[];
export type VitrineContactSubject = (typeof CONTACT_SUBJECTS)[number];

export type ContactState = {
  /** Imposé par la fiche bien (`BIEN_SALE` / `BIEN_RENT`), sinon déduit de `topic`. */
  subject: VitrineContactSubject;
  topic: ContactTopic | "";
  propertyReference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  rgpd: boolean;
};

export type ContactField = keyof ContactState;
export type ContactErrors = FieldErrors<ContactField>;

export const CONTACT_MESSAGES = {
  message: "Écrivez votre message.",
  messageTooLong: `Votre message ne doit pas dépasser ${CONTACT_MESSAGE_MAX} caractères.`,
  topic: "Choisissez l’objet de votre message.",
} as const;

export function emptyContactState(
  subject: VitrineContactSubject = "OTHER",
  propertyReference = "",
): ContactState {
  return {
    subject,
    topic: "",
    propertyReference,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    rgpd: false,
  };
}

export function contactStateFromFormData(form: FormData): ContactState {
  const s = (name: ContactField) => formString(form.get(name));
  const subject = s("subject");
  const topic = s("topic");
  return {
    subject: isOneOf(subject, CONTACT_SUBJECTS) ? subject : "OTHER",
    topic: isOneOf(topic, CONTACT_TOPICS) ? topic : "",
    propertyReference: clean(s("propertyReference")),
    firstName: clean(s("firstName")),
    lastName: clean(s("lastName")),
    email: clean(s("email")),
    phone: clean(s("phone")),
    message: cleanMultiline(s("message")),
    rgpd: formBoolean(form.get("rgpd")),
  };
}

/**
 * Sujet API final. Sur la fiche, `subject` est imposé (BIEN_SALE / BIEN_RENT).
 * Sur /contact, « Un bien en particulier » sans fiche reste `OTHER` (on ne sait
 * pas si c'est une vente ou une location) : la référence suit dans la charge utile.
 */
export function resolveContactSubject(
  state: ContactState,
): VitrineContactSubject {
  if (state.subject === "BIEN_SALE" || state.subject === "BIEN_RENT")
    return state.subject;
  return "OTHER";
}

/** Interface figée : doc 04 §7. `requireTopic` : vrai sur /contact, faux sur la fiche. */
export function validateContact(
  state: ContactState,
  { requireTopic = false }: { requireTopic?: boolean } = {},
): ContactErrors {
  const errors: ContactErrors = {};
  if (requireTopic && !isOneOf(state.topic, CONTACT_TOPICS))
    errors.topic = CONTACT_MESSAGES.topic;
  if (!maxLength(state.propertyReference, REFERENCE_MAX))
    errors.propertyReference = tooLong("La référence", REFERENCE_MAX);
  if (isBlank(state.firstName)) errors.firstName = MESSAGES.firstName;
  else if (!maxLength(state.firstName, NAME_MAX))
    errors.firstName = tooLong("Le prénom", NAME_MAX);
  if (isBlank(state.lastName)) errors.lastName = MESSAGES.lastName;
  else if (!maxLength(state.lastName, NAME_MAX))
    errors.lastName = tooLong("Le nom", NAME_MAX);
  if (!isEmail(state.email)) errors.email = MESSAGES.email;
  if (!isBlank(state.phone) && !isPhoneFR(state.phone))
    errors.phone = MESSAGES.phone;
  if (isBlank(state.message)) errors.message = CONTACT_MESSAGES.message;
  else if (state.message.length > CONTACT_MESSAGE_MAX)
    errors.message = CONTACT_MESSAGES.messageTooLong;
  if (state.rgpd !== true) errors.rgpd = MESSAGES.rgpd;
  return errors;
}

/** 400 de l'API (`fields["contact.email"]`) → erreurs sous les champs du formulaire. */
export function mapContactApiFields(
  fields: Record<string, string> | undefined,
): ContactErrors {
  const map: Record<string, ContactField> = {
    "contact.firstName": "firstName",
    "contact.lastName": "lastName",
    "contact.email": "email",
    "contact.phone": "phone",
    "contact.message": "message",
    "consent.rgpd": "rgpd",
    propertyReference: "propertyReference",
  };
  const fallback: ContactErrors = {
    firstName: MESSAGES.firstName,
    lastName: MESSAGES.lastName,
    email: MESSAGES.email,
    phone: MESSAGES.phone,
    message: CONTACT_MESSAGES.message,
    rgpd: MESSAGES.rgpd,
  };
  const errors: ContactErrors = {};
  for (const [key, apiMessage] of Object.entries(fields ?? {})) {
    const field = map[key];
    if (!field) continue;
    // Les messages de l'API sont techniques : on affiche les nôtres.
    errors[field] =
      field === "message" && /500/.test(apiMessage)
        ? CONTACT_MESSAGES.messageTooLong
        : (fallback[field] ?? MESSAGES.sendFailed);
  }
  return errors;
}
