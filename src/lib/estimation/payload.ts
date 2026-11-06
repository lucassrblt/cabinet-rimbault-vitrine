// État du tunnel → corps de `POST /api/public/evaluation` (doc 04 §3.4, lot 5).
// Pur : appelé par la Server Action après `validateEstimation`.
//
// Les champs absents du modèle `Evaluation` (étage, ascenseur, terrain, cave,
// préférence de recontact) partent dans un bloc structuré en tête de `message`.
// La notification agent (lot API) relit la ligne `Recontact : …` telle quelle :
// sa forme est figée.

import type { EvaluationPayload } from "@/lib/api/types";
import type {
  ContactMoment,
  ContactPreference,
  EstimationState,
} from "@/lib/forms/estimation-schema";
import { formatSurface } from "@/lib/forms/estimation-schema";
import {
  isBlank,
  normalizeEmail,
  normalizePhoneFR,
  parseDecimalFR,
  toApiDecimal,
} from "@/lib/forms/validators";

export const PRECISIONS_HEADING = "[Précisions saisies sur le site]";
export const MESSAGE_HEADING = "[Message]";

/** Exposants typographiques : « ᵉ » U+1D49, « ʳ » U+02B3. */
const SUP_E = "ᵉ";
const SUP_ER = `${SUP_E}ʳ`;

/** « RDC » → « rez-de-chaussée », « 1 » → « 1ᵉʳ », « 3 » → « 3ᵉ », « 20+ » → « 20ᵉ ou plus ». */
export function formatFloor(floor: string): string {
  if (floor === "") return "";
  if (floor === "RDC") return "rez-de-chaussée";
  if (floor === "20+") return `20${SUP_E} ou plus`;
  return floor === "1" ? `1${SUP_ER}` : `${floor}${SUP_E}`;
}

/** Étage suivi du nombre d'étages de l'immeuble s'il est connu : « 3ᵉ sur 5 ». */
export function formatFloorOf(floor: string, total?: number | null): string {
  const label = formatFloor(floor);
  if (label === "" || total == null || floor === "RDC") return label;
  return `${label} sur ${total}`;
}

const PREFERENCE_TEXT: Record<ContactPreference, string> = {
  telephone: "par téléphone",
  email: "par e-mail",
};

const MOMENT_TEXT: Record<ContactMoment, string | null> = {
  matin: "le matin",
  midi: "à midi",
  "fin-de-journee": "en fin de journée",
  indifferent: null,
};

/** « Recontact : par téléphone, en fin de journée » ; `null` si rien n'est indiqué. */
export function formatRecontact(
  preference: ContactPreference | "",
  moment: ContactMoment | "",
): string | null {
  const parts = [
    preference === "" ? null : PREFERENCE_TEXT[preference],
    moment === "" ? null : MOMENT_TEXT[moment],
  ].filter((part): part is string => part !== null);
  return parts.length === 0 ? null : `Recontact : ${parts.join(", ")}`;
}

/** Lignes du bloc de précisions, sans en-tête. Seules les valeurs saisies figurent. */
export function precisionLines(state: EstimationState): string[] {
  const lines: string[] = [];
  if (state.propertyType === "APPARTEMENT") {
    if (state.floor !== "") {
      const top =
        state.floor === "RDC"
          ? ""
          : `, dernier étage : ${state.isTopFloor ? "oui" : "non"}`;
      lines.push(`Étage : ${formatFloorOf(state.floor)}${top}`);
    }
    if (state.hasElevator !== "")
      lines.push(`Ascenseur : ${state.hasElevator}`);
  }
  if (state.propertyType === "MAISON" && !isBlank(state.landSurface)) {
    const land = formatSurface(state.landSurface);
    if (land !== "") lines.push(`Terrain : ${land}`);
  }
  if (state.hasCellar) lines.push("Cave : oui");
  const recontact = formatRecontact(
    state.contactPreference,
    state.contactMoment,
  );
  if (recontact) lines.push(recontact);
  return lines;
}

/** Champ `message` : bloc de précisions, puis le mot libre du demandeur. */
export function buildEstimationMessage(state: EstimationState): string {
  const blocks: string[] = [];
  const lines = precisionLines(state);
  if (lines.length > 0) blocks.push([PRECISIONS_HEADING, ...lines].join("\n"));
  if (!isBlank(state.message))
    blocks.push(`${MESSAGE_HEADING}\n${state.message}`);
  return blocks.join("\n\n");
}

const optional = (value: string): string | undefined =>
  isBlank(value) ? undefined : value;

/** Corps complet. L'état doit avoir passé `validateEstimation` (type de bien renseigné). */
export function buildEstimationPayload(
  state: EstimationState,
  meta: { userAgent?: string; referer?: string } = {},
): EvaluationPayload {
  if (state.propertyType === "") throw new Error("propertyType manquant");
  const surface = parseDecimalFR(state.surface);
  const address = [state.address, state.city].filter((p) => !isBlank(p));
  const message = buildEstimationMessage(state);
  return {
    propertyType: state.propertyType,
    postalCode: state.postalCode.trim(),
    address: address.length > 0 ? address.join(", ") : undefined,
    surface: surface === null ? undefined : toApiDecimal(surface),
    rooms: optional(state.rooms),
    bedrooms: optional(state.bedrooms),
    bathrooms: optional(state.bathrooms),
    levels:
      state.propertyType === "MAISON" ? optional(state.levels) : undefined,
    constructionYear: optional(state.constructionPeriod),
    renovations: optional(state.renovations),
    hasBalcony: state.hasBalcony,
    hasTerrace: state.hasTerrace,
    hasGarden: state.hasGarden,
    hasParking: state.hasParking,
    condition: state.condition === "" ? undefined : state.condition,
    intent: state.intent,
    firstName: state.firstName,
    lastName: state.lastName,
    email: normalizeEmail(state.email),
    phone: isBlank(state.phone) ? undefined : normalizePhoneFR(state.phone),
    message: message === "" ? undefined : message,
    rgpd: true,
    source: "vitrine/estimation",
    userAgent: meta.userAgent,
    referer: meta.referer,
  };
}
