import type { AddressSuggestion } from "@/components/forms/estimation/AddressAutocomplete";
import type { EstimationStep1, EstimationStep2 } from "@/lib/validation";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

export type FormState = {
  type: EstimationStep1["type"] | "";
  address: AddressSuggestion | null;
  surface: string;
  rooms: string;
  floor: string;
  year: string;
  outdoor: string[];
  condition: EstimationStep1["condition"] | "";
  intent: EstimationStep2["intent"] | "";
  delay: EstimationStep2["delay"] | "";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  rgpd: boolean;
};

export type FieldErrors = Partial<Record<keyof FormState, string>>;

/* -------------------------------------------------------------------------- */
/*                                CONSTANTS                                   */
/* -------------------------------------------------------------------------- */

export const INITIAL: FormState = {
  type: "",
  address: null,
  surface: "",
  rooms: "",
  floor: "",
  year: "",
  outdoor: [],
  condition: "",
  intent: "",
  delay: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  message: "",
  rgpd: false,
};

export const STORAGE_KEY = "cr-estimation-draft-v1";

export const STEPS = [
  { phase: 1, label: "Votre bien" },
  { phase: 1, label: "Votre bien" },
  { phase: 1, label: "Votre bien" },
  { phase: 1, label: "Votre bien" },
  { phase: 2, label: "Votre projet" },
  { phase: 2, label: "Votre projet" },
  { phase: 2, label: "Votre projet" },
] as const;

export const TOTAL = STEPS.length;
