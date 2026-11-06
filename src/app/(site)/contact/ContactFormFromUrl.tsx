"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "@/components/forms/ContactForm";
import type { ContactTopic } from "@/lib/forms/contact-schema";

// Pré-remplissage de /contact depuis l'URL (doc 04 §5 : lecture côté client
// pour garder la page statique ; brief §9) :
// - `?bien=10.131` : objet « Un bien en particulier » et référence remplie ;
// - `?objet=location` (ou `bien`, `autre`) : objet présélectionné.
// Rendu sous <Suspense>, avec le formulaire vide en repli : le HTML statique
// contient toujours le formulaire complet, même sans JavaScript.

const TOPIC_PARAM: Record<string, ContactTopic> = {
  bien: "bien",
  location: "location",
  autre: "autre",
};

/** Référence d'annonce plausible : chiffres, lettres, point, tiret. */
function readReference(raw: string | null): string | undefined {
  const value = raw?.trim() ?? "";
  return /^[\p{L}\d.\-_/ ]{1,40}$/u.test(value) ? value : undefined;
}

export function ContactFormFromUrl() {
  const params = useSearchParams();
  const reference = readReference(params.get("bien"));
  const topic =
    TOPIC_PARAM[params.get("objet") ?? ""] ?? (reference ? "bien" : undefined);
  return (
    <ContactForm
      key={`${topic ?? ""}|${reference ?? ""}`}
      source="vitrine/contact"
      initialTopic={topic}
      propertyReference={reference}
    />
  );
}
