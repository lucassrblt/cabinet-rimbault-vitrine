// Récapitulatif du tunnel (étape 4) et de la confirmation : libellés prêts à
// afficher. Seules les valeurs saisies figurent ; jamais « null », « 5+ »,
// ni « 59.5 » (A34). Pur.

import {
  CONDITION_LABELS,
  CONTACT_PREFERENCE_LABELS,
  type EstimationState,
  type EstimationStep,
  formatRooms,
  formatSurface,
  INTENT_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/forms/estimation-schema";
import { isBlank, normalizePhoneFR } from "@/lib/forms/validators";
import { formatFloor, formatRecontact } from "./payload";

export type RecapItem = { label: string; value: string };

export type RecapSection = {
  step: Exclude<EstimationStep, 4>;
  title: string;
  /** Lignes courtes (liste de définitions). */
  items: RecapItem[];
  /** Textes libres, affichés en paragraphe sous les lignes. */
  texts: RecapItem[];
};

/** Surface à la française, l'unité liée au nombre : « 59,5 m² ». */
export function surfaceLabel(value: string): string {
  return formatSurface(value).replace(" m²", " m²");
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function countLabel(value: string, zero?: string): string {
  if (value === "0" && zero) return zero;
  return value.endsWith("+") ? `${value.slice(0, -1)}\u00a0ou plus` : value;
}

/** « 1ᵉʳ étage », « Rez-de-chaussée », « 20ᵉ étage ou plus ». */
export function floorLabel(floor: string): string {
  if (floor === "") return "";
  if (floor === "RDC") return "Rez-de-chaussée";
  const label = formatFloor(floor);
  return label.endsWith(" ou plus")
    ? label.replace(" ou plus", " étage ou plus")
    : `${label} étage`;
}

/** « 1 niveau (plain-pied) », « 2 niveaux », « 4 niveaux ou plus ». */
export function levelLabel(levels: string): string {
  if (levels === "") return "";
  if (levels === "1") return "1\u00a0niveau (plain-pied)";
  return levels.endsWith("+")
    ? `${levels.slice(0, -1)}\u00a0niveaux ou plus`
    : `${levels}\u00a0niveaux`;
}

/**
 * « 1949-1974 » → « 1949–1974 » (tiret demi-cadratin d'intervalle),
 * « 2000 et après » → « 2000 et après » (espace insécable). L'ancienne
 * valeur « Je ne sais pas », retirée du choix, n'est pas affichée.
 */
export function periodLabel(period: string): string {
  if (period === UNKNOWN_PERIOD) return "";
  return period
    .replace(/(\d)-(\d)/, "$1\u2013$2")
    .replace(/(\d) (?=[a-zà-ü])/g, "$1\u00a0");
}

/** Valeur du schéma retirée du choix (doublon de « Non précisée »). */
export const UNKNOWN_PERIOD = "Je ne sais pas";

/** Code postal et ville sur une ligne : « 92600 Asnières-sur-Seine ». */
export function placeLabel(state: EstimationState): string {
  // U+2060 (gluon) après chaque trait d'union : « Asnières-sur-Seine » passe
  // entière à la ligne au lieu d'être coupée après « Asnières-sur- » (320 px).
  return [state.postalCode.trim(), state.city.trim().replace(/-/g, "-\u2060")]
    .filter((part) => part !== "")
    .join(" ");
}

/** « Appartement, 3 pièces, 59,5 m² » (confirmation). */
export function propertySummary(state: EstimationState): string {
  return [
    state.propertyType === "" ? "" : PROPERTY_TYPE_LABELS[state.propertyType],
    formatRooms(state.rooms),
    surfaceLabel(state.surface),
  ]
    .filter((part) => part !== "")
    .join(", ");
}

/** « Par téléphone, en fin de journée », ou « ». */
export function recontactLabel(state: EstimationState): string {
  const line = formatRecontact(state.contactPreference, state.contactMoment);
  return line ? capitalize(line.replace(/^Recontact : /, "")) : "";
}

const EXTRAS: { key: keyof EstimationState; label: string }[] = [
  { key: "hasBalcony", label: "balcon" },
  { key: "hasTerrace", label: "terrasse" },
  { key: "hasGarden", label: "jardin" },
  { key: "hasParking", label: "garage ou parking" },
  { key: "hasCellar", label: "cave" },
];

function push(items: RecapItem[], label: string, value: string) {
  if (!isBlank(value)) items.push({ label, value });
}

export function buildRecap(state: EstimationState): RecapSection[] {
  const bien: RecapItem[] = [];
  push(bien, "À estimer", INTENT_LABELS[state.intent]);
  push(
    bien,
    "Type de bien",
    state.propertyType === "" ? "" : PROPERTY_TYPE_LABELS[state.propertyType],
  );
  push(bien, "Adresse", state.address);
  push(bien, "Code postal et ville", placeLabel(state));

  const carac: RecapItem[] = [];
  push(carac, "Surface habitable", surfaceLabel(state.surface));
  push(carac, "Pièces", capitalize(formatRooms(state.rooms)));
  push(carac, "Chambres", countLabel(state.bedrooms, "Aucune"));
  push(carac, "Salles de bains ou d’eau", countLabel(state.bathrooms));
  if (state.propertyType === "APPARTEMENT") {
    const top =
      state.floor !== "" && state.floor !== "RDC" && state.isTopFloor
        ? ", dernier étage"
        : "";
    push(carac, "Étage", `${floorLabel(state.floor)}${top}`);
    push(
      carac,
      "Ascenseur",
      state.hasElevator === "" ? "" : capitalize(state.hasElevator),
    );
  }
  if (state.propertyType === "MAISON") {
    push(carac, "Niveaux", levelLabel(state.levels));
    push(carac, "Terrain", surfaceLabel(state.landSurface));
  }
  const extras = EXTRAS.filter(({ key }) => state[key] === true).map(
    ({ label }) => label,
  );
  push(carac, "Extérieurs et annexes", capitalize(extras.join(", ")));
  push(
    carac,
    "État général",
    state.condition === "" ? "" : CONDITION_LABELS[state.condition].label,
  );
  push(carac, "Époque de construction", periodLabel(state.constructionPeriod));
  const caracTexts: RecapItem[] = [];
  push(caracTexts, "Travaux récents", state.renovations);

  const vous: RecapItem[] = [];
  push(vous, "Nom", `${state.firstName} ${state.lastName}`.trim());
  push(vous, "E‑mail", state.email.trim().toLowerCase());
  push(
    vous,
    "Téléphone",
    isBlank(state.phone) ? "" : normalizePhoneFR(state.phone),
  );
  push(vous, "Recontact", recontactLabel(state));
  const vousTexts: RecapItem[] = [];
  push(vousTexts, "Votre message", state.message);

  return [
    { step: 1, title: "Votre bien", items: bien, texts: [] },
    { step: 2, title: "Ses caractéristiques", items: carac, texts: caracTexts },
    { step: 3, title: "Vous", items: vous, texts: vousTexts },
  ];
}

/** Libellé court d'une préférence de recontact (« par téléphone »). */
export function preferenceText(state: EstimationState): string {
  return state.contactPreference === ""
    ? ""
    : CONTACT_PREFERENCE_LABELS[state.contactPreference].toLowerCase();
}
