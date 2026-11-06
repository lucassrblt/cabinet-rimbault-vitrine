// Objets du formulaire de contact de la Galerie. Pur : partagé entre le
// formulaire (navigateur) et la Server Action. Reprend les objets de /contact
// (`CONTACT_TOPIC_LABELS`) et ajoute la vente, qui part en `ESTIMATION`.
import type { ContactSubject } from "@/lib/api/types";
import {
  CONTACT_MESSAGES,
  CONTACT_TOPIC_LABELS,
  type ContactErrors,
  type ContactState,
  validateContact,
} from "@/lib/forms/contact-schema";

export const OBJETS = ["bien", "vente", "location", "autre"] as const;
export type Objet = (typeof OBJETS)[number];

export const OBJET_LABELS: Record<Objet, string> = {
  bien: CONTACT_TOPIC_LABELS.bien,
  vente: "La vente de votre bien",
  location: CONTACT_TOPIC_LABELS.location,
  autre: CONTACT_TOPIC_LABELS.autre,
};

export function isObjet(value: string): value is Objet {
  return (OBJETS as readonly string[]).includes(value);
}

/** Saisie du formulaire : celle de /contact, avec l'objet de la Galerie. */
export type Saisie = Omit<ContactState, "topic" | "subject"> & {
  objet: Objet | "";
};

export type Champ = keyof Saisie;
export type Erreurs = Partial<Record<Champ, string>>;

export function saisieVide(objet: Objet | "" = "", reference = ""): Saisie {
  return {
    objet,
    propertyReference: reference,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    rgpd: false,
  };
}

/** Validation de /contact (`validateContact`), l'objet étant vérifié ici. */
export function valider(saisie: Saisie): Erreurs {
  const { objet, ...reste } = saisie;
  const errors: ContactErrors = validateContact(
    { ...reste, subject: "OTHER", topic: "autre" },
    { requireTopic: false },
  );
  const { subject: _s, topic: _t, ...champs } = errors;
  const erreurs: Erreurs = champs;
  if (!isObjet(objet)) erreurs.objet = CONTACT_MESSAGES.topic;
  return erreurs;
}

/**
 * Sujet API. La vente part en `ESTIMATION` ; un bien en particulier part en
 * `BIEN_SALE` / `BIEN_RENT` quand sa référence est connue de l'API (la Server
 * Action la vérifie), sinon en `OTHER` avec la référence, comme sur /contact.
 */
export function sujetApi(
  objet: Objet,
  transaction: "VENTE" | "LOCATION" | null,
): ContactSubject {
  if (objet === "vente") return "ESTIMATION";
  if (objet === "bien" && transaction === "VENTE") return "BIEN_SALE";
  if (objet === "bien" && transaction === "LOCATION") return "BIEN_RENT";
  return "OTHER";
}
