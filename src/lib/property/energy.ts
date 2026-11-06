// Bilan énergétique (brief A29, doc 03 §6.7). Seul endroit où s'écrivent les
// formulations des coûts d'énergie. Pur, testé.
//
// Trois formulations seulement :
// (1) coûts et date d'indexation : « … : entre 830 € et 1 190 € par an. Prix
//     moyens des énergies indexés au 1er janvier 2021 (abonnements compris). »
// (2) coûts sans date : « … : entre 830 € et 1 190 € par an, abonnements
//     compris. »
// (3) coûts absents : « … pour un usage standard : non communiqué. »
// Puis, en (1) et (2) seulement : « Les coûts sont estimés en fonction des
// caractéristiques du logement et pour une utilisation standard. »
// Une fourchette incomplète (une seule borne) est traitée comme absente :
// on n'écrit jamais une moitié de fourchette.

import type { EnergyClass, PropertyEnergy } from "@/lib/api/types";
import {
  formatEuros,
  formatInteger,
  formatLongDate,
  isPositive,
  NNBSP,
} from "./format";

const LEAD = `Montant estimé des dépenses annuelles d’énergie pour un usage standard${NNBSP}:`;

export const ENERGY_COST_NOTE =
  "Les coûts sont estimés en fonction des caractéristiques du logement et pour une utilisation standard.";

export type EnergyCosts = {
  /** Une des trois formulations d'A29. */
  sentence: string;
  /** Note d'estimation, cas (1) et (2) seulement. */
  note: string | null;
};

export function energyCosts(
  energy: PropertyEnergy | null | undefined,
): EnergyCosts {
  const min = energy?.annualEnergyCostMin;
  const max = energy?.annualEnergyCostMax;
  if (!isPositive(min) || !isPositive(max)) {
    return { sentence: `${LEAD} non communiqué.`, note: null };
  }
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  const range = `entre ${formatEuros(low)} et ${formatEuros(high)} par an`;
  const date = energy?.dateReferenceEnergie
    ? formatLongDate(energy.dateReferenceEnergie)
    : null;
  const sentence = date
    ? `${LEAD} ${range}. Prix moyens des énergies indexés au ${date} (abonnements compris).`
    : `${LEAD} ${range}, abonnements compris.`;
  return { sentence, note: ENERGY_COST_NOTE };
}

export type EnergyLabel = {
  /** « Consommation d’énergie (DPE) » ou « Émissions de gaz à effet de serre (GES) ». */
  title: string;
  /** « Classe D, 216 kWh/m²/an », « DPE vierge », « Non communiqué ». */
  value: string;
  /** Classe A à G, sinon `null`. */
  grade: Exclude<EnergyClass, "VIERGE"> | null;
  /** Étiquette SVG générée par l'admin. */
  imageUrl: string | null;
  /** Texte alternatif de l'étiquette. */
  alt: string;
};

function label(
  kind: "DPE" | "GES",
  grade: EnergyClass | null | undefined,
  value: number | null | undefined,
  imageUrl: string | null | undefined,
): EnergyLabel {
  const title =
    kind === "DPE"
      ? "Consommation d’énergie (DPE)"
      : "Émissions de gaz à effet de serre (GES)";
  const unit = kind === "DPE" ? "kWh/m²/an" : "kg CO₂/m²/an";
  if (grade === "VIERGE") {
    return {
      title,
      value: `${kind} vierge`,
      grade: null,
      imageUrl: null,
      alt: "",
    };
  }
  if (!grade) {
    return {
      title,
      value: "Non communiqué",
      grade: null,
      imageUrl: null,
      alt: "",
    };
  }
  const amount =
    typeof value === "number" && Number.isFinite(value) && value >= 0
      ? `, ${formatInteger(value)} ${unit}`
      : "";
  const text = `Classe ${grade}${amount}`;
  return {
    title,
    value: text,
    grade,
    imageUrl: imageUrl || null,
    alt: `Étiquette ${kind}${NNBSP}: ${text.charAt(0).toLowerCase()}${text.slice(1)}`,
  };
}

export function energyLabels(energy: PropertyEnergy | null | undefined): {
  dpe: EnergyLabel;
  ges: EnergyLabel;
} {
  return {
    dpe: label(
      "DPE",
      energy?.energyClass,
      energy?.energyValue,
      energy?.dpeImageUrl,
    ),
    ges: label("GES", energy?.gesClass, energy?.gesValue, energy?.gesImageUrl),
  };
}

/** Phrase d'explication d'un DPE vierge (aucune classe attribuée). */
export const DPE_VIERGE_NOTE =
  "Aucune classe n’a été attribuée à ce logement lors du diagnostic.";
