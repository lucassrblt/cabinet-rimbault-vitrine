// Listes du tunnel prêtes à afficher (libellés français des valeurs fermées
// du schéma `lib/forms/estimation-schema.ts`).

import {
  floorLabel,
  levelLabel,
  periodLabel,
  UNKNOWN_PERIOD,
} from "@/lib/estimation/recap";
import {
  BATHROOMS,
  BEDROOMS,
  CONDITION_LABELS,
  CONDITIONS,
  CONSTRUCTION_PERIODS,
  CONTACT_MOMENT_LABELS,
  CONTACT_MOMENTS,
  CONTACT_PREFERENCE_LABELS,
  CONTACT_PREFERENCES,
  FLOORS,
  formatRooms,
  INTENT_LABELS,
  INTENTS,
  type Intent,
  LEVELS,
  LIMITS,
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPES,
  ROOMS,
} from "@/lib/forms/estimation-schema";
import { isOneOf } from "@/lib/forms/validators";

export { INTENT_LABELS, INTENTS, LIMITS, PROPERTY_TYPE_LABELS, PROPERTY_TYPES };

export function isOneOfIntent(value: string): value is Intent {
  return isOneOf(value, INTENTS);
}

type Option = { value: string; label: string; detail?: string };

const plus = (value: string) =>
  value.endsWith("+") ? `${value.slice(0, -1)}\u00a0ou plus` : value;

export const ROOM_OPTIONS: Option[] = ROOMS.map((value) => ({
  value,
  label: formatRooms(value),
}));

export const BEDROOM_OPTIONS: Option[] = BEDROOMS.map((value) => ({
  value,
  label: value === "0" ? "Aucune" : plus(value),
}));

export const BATHROOM_OPTIONS: Option[] = BATHROOMS.map((value) => ({
  value,
  label: plus(value),
}));

export const LEVEL_OPTIONS: Option[] = LEVELS.map((value) => ({
  value,
  label: levelLabel(value),
}));

export const FLOOR_OPTIONS: Option[] = FLOORS.map((value) => ({
  value,
  label: floorLabel(value),
}));

export const ELEVATOR_OPTIONS: Option[] = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
];

export const EXTRA_OPTIONS = [
  { value: "hasBalcony", label: "Balcon" },
  { value: "hasTerrace", label: "Terrasse" },
  { value: "hasGarden", label: "Jardin" },
  { value: "hasParking", label: "Garage ou parking" },
  { value: "hasCellar", label: "Cave" },
] as const;

export const CONDITION_OPTIONS: Option[] = CONDITIONS.map((value) => ({
  value,
  label: CONDITION_LABELS[value].label,
  detail: CONDITION_LABELS[value].help ?? undefined,
}));

// « Je ne sais pas » ferait doublon avec l'option vide « Non précisée » et
// mettrait « je » dans la page (brief §1) : retiré du choix.
export const PERIOD_OPTIONS: Option[] = CONSTRUCTION_PERIODS.filter(
  (value) => value !== UNKNOWN_PERIOD,
).map((value) => ({ value, label: periodLabel(value) }));

export const PREFERENCE_OPTIONS: Option[] = CONTACT_PREFERENCES.map(
  (value) => ({ value, label: CONTACT_PREFERENCE_LABELS[value] }),
);

export const MOMENT_OPTIONS: Option[] = CONTACT_MOMENTS.map((value) => ({
  value,
  label: CONTACT_MOMENT_LABELS[value],
}));
