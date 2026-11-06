// Formats français des données d'un bien (doc 03 §3.3) : milliers en U+202F
// (produit par Intl), U+00A0 entre un nombre et son unité, « 1er » pour le
// premier du mois. Pur, sans dépendance : partagé serveur, client et tests.

export const NBSP = " ";
/** Espace fine insécable : avant « : ; ! ? » et devant « % ». */
export const NNBSP = " ";

const integer = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

/** Vrai pour un nombre fini strictement positif (rejette `null`, `-1`, `NaN`). */
export function isPositive(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/** « 644 000 € » (U+202F, puis U+00A0 devant l'euro). */
export function formatEuros(value: number): string {
  return `${integer.format(Math.round(value))}${NBSP}€`;
}

/** « 59,5 m² », « 33,16 m² ». */
export function formatSurface(value: number): string {
  return `${decimal.format(value)}${NBSP}m²`;
}

/** « 4,76 % » (espace fine insécable). */
export function formatPercent(value: number): string {
  return `${decimal.format(value)}${NNBSP}%`;
}

/** « 1 196 » : entier seul, milliers en U+202F. */
export function formatInteger(value: number): string {
  return integer.format(Math.round(value));
}

const longDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Date ISO écrite en entier : « 1er janvier 2021 », « 18 septembre 2026 ».
 * La date est lue en UTC, telle que saisie (`2021-01-01T00:00:00.000Z`).
 * Le jour reste lié au mois (U+00A0). `null` si la date est illisible.
 */
export function formatLongDate(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const parts = longDate.formatToParts(date);
  const day = parts.find((p) => p.type === "day")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const year = parts.find((p) => p.type === "year")?.value;
  if (!day || !month || !year) return null;
  return `${day === "1" ? "1er" : day}${NBSP}${month} ${year}`;
}

/**
 * Ordinal en lettres supérieures, une seule forme : « 1ᵉʳ » (U+1D49 U+02B3),
 * « 3ᵉ » (U+1D49), jamais « 1er », « 3e » ni « 3ème ». Les dates gardent
 * « 1er janvier 2021 » (A29, `formatLongDate`).
 */
export function ordinal(value: number): string {
  return value === 1 ? "1\u1d49\u02b3" : `${value}\u1d49`;
}

/** Accord simple : « 1 chambre », « 2 chambres ». */
export function plural(count: number, singular: string, pluralForm?: string) {
  return count > 1 ? (pluralForm ?? `${singular}s`) : singular;
}
