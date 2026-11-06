// Fonctions de validation pures, partagées entre le navigateur (au `blur`, à
// « Continuer ») et les Server Actions (jamais de confiance au client).
// Seule dépendance : `agency.ts` (sans import, compatible client). Pas de `server-only`.

import { agency } from "@/lib/agency";

/** Erreurs par nom de champ ; un champ absent est valide. */
export type FieldErrors<K extends string = string> = Partial<Record<K, string>>;

/** Messages exacts du doc 04 §3.5 (testés par Maldini). */
export const MESSAGES = {
  propertyType: "Choisissez le type de bien.",
  postalCode: "Indiquez un code postal à 5\u00a0chiffres, par exemple 92600.",
  surface: "Indiquez la surface en m², par exemple 62.",
  surfaceRange:
    "La surface doit être comprise entre 8\u00a0et 2\u202f000\u00a0m².",
  rooms: "Indiquez le nombre de pièces.",
  bedrooms: "Le nombre de chambres ne peut pas dépasser le nombre de pièces.",
  firstName: "Indiquez votre prénom.",
  lastName: "Indiquez votre nom.",
  email: "Indiquez une adresse e-mail valide, par exemple nom@exemple.fr.",
  phone:
    "Ce numéro ne semble pas valide. Indiquez un numéro français à 10\u00a0chiffres.",
  phoneRequired: "Indiquez un numéro de téléphone pour être rappelé.",
  rgpd: "Votre accord est nécessaire pour que nous puissions vous recontacter.",
  sendFailed: `Votre demande n’a pas pu être envoyée. Vos réponses sont conservées\u202f: réessayez dans un instant, ou appelez-nous au ${agency.phone.display}.`,
} as const;

/** Message de longueur maximale, formulé sobrement. */
export function tooLong(label: string, max: number): string {
  return `${label} ne doit pas dépasser ${formatInt(max)} caractères.`;
}

function formatInt(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

/** Trim + espaces internes réduits. */
export function clean(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

/** Trim en gardant les retours à la ligne (zones de texte). */
export function cleanMultiline(value: unknown): string {
  return typeof value === "string"
    ? value
        .replace(/\r\n?/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .trim()
    : "";
}

export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

/** Même expression que l'API (`/api/public/evaluation` et `/contact`). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(normalizeEmail(value));
}

export function isPostalCode(value: string): boolean {
  return /^\d{5}$/.test(value.trim());
}

/** Numéro français : 0X XX XX XX XX ou +33 X XX XX XX XX (doc 04 §3.3). */
const PHONE_FR_RE = /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export function isPhoneFR(value: string): boolean {
  return PHONE_FR_RE.test(value.trim());
}

/** « +33 6 12 34 56 78 » ou « 06.12.34.56.78 » → « 06 12 34 56 78 ». */
export function normalizePhoneFR(value: string): string {
  const digits = value.replace(/\D/g, "");
  const national = digits.startsWith("33") ? `0${digits.slice(2)}` : digits;
  if (!/^0\d{9}$/.test(national)) return value.trim();
  return national.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

/**
 * Nombre décimal saisi à la française (« 59,5 », « 59.5 », « 1 200 »).
 * Renvoie `null` si la saisie n'est pas un nombre.
 */
export function parseDecimalFR(value: string): number | null {
  const compact = value.replace(/[\s  ]/g, "").replace(",", ".");
  if (!/^\d+(?:\.\d+)?$/.test(compact)) return null;
  const n = Number(compact);
  return Number.isFinite(n) ? n : null;
}

/** Nombre → chaîne pour l'API (point décimal, sans zéros inutiles). */
export function toApiDecimal(n: number): string {
  return String(Math.round(n * 100) / 100);
}

export function maxLength(value: string, max: number): boolean {
  return value.length <= max;
}

/** Vrai si la valeur fait partie de la liste fermée. */
export function isOneOf<T extends string>(
  value: string,
  allowed: readonly T[],
): value is T {
  return (allowed as readonly string[]).includes(value);
}

/** Lecture d'une case à cocher d'un FormData (`on`, `true`, `1`). */
export function formBoolean(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true" || value === "1";
}

/** Lecture d'un champ texte d'un FormData (« » si absent ou fichier). */
export function formString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}
