import { agency } from "@/lib/agency";

// Typographie des chaînes d'`agency.ts`, tapées avec des espaces ordinaires
// (doc 03 §3.3). La source reste en texte brut : elle alimente aussi le
// JSON-LD et check-launch.

/** « 117 boulevard Voltaire » : le numéro reste lié au mot qui suit. */
export function streetLine(): string {
  return agency.address.street.replace(/^(\d+\S*) /, "$1 ");
}

/** « 92600 Asnières-sur-Seine », jamais coupé entre le code et la ville. */
export function cityLine(): string {
  return `${agency.address.postalCode} ${agency.address.city}`;
}

/**
 * Plage horaire tapée « 9 h – 19 h » : U+00A0 entre le chiffre et « h », et
 * devant le tiret demi-cadratin, pour que ni « h » ni « – 19 h » ne passent
 * seuls à la ligne. Prête pour le jour où `hoursConfirmed` passera à vrai.
 */
export function hoursLine(text: string): string {
  return text.replace(/(\d) h\b/g, "$1\u00A0h").replace(/ –/g, "\u00A0–");
}

/** Note Google à la française : « 4,9 ». */
export function formatRating(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/** Montant tapé « 4 000 € » : milliers en U+202F, U+00A0 devant l'euro. */
export function amount(text: string): string {
  return text.replace(/(\d) (?=\d{3}\b)/g, "$1 ").replace(/ €/g, " €");
}
