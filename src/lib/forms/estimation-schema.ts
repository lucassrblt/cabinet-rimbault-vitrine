// Schéma du tunnel d'estimation (doc 04 §3.3 et §3.5, arbitrages A1, A18, A23, A34).
// Pur : partagé entre les étapes côté client et la Server Action `submitEstimation`.
// La transformation état → corps API est dans `src/lib/estimation/payload.ts` (lot 5).

import {
  clean,
  cleanMultiline,
  type FieldErrors,
  formBoolean,
  formString,
  isBlank,
  isEmail,
  isOneOf,
  isPhoneFR,
  isPostalCode,
  MESSAGES,
  maxLength,
  parseDecimalFR,
  tooLong,
} from "./validators";

// --- Listes fermées -----------------------------------------------------------

export const INTENTS = ["ESTIMATION_VENTE", "ESTIMATION_LOYER"] as const;
export type Intent = (typeof INTENTS)[number];
export const INTENT_LABELS: Record<Intent, string> = {
  ESTIMATION_VENTE: "Le prix de vente",
  ESTIMATION_LOYER: "Le loyer",
};
/** `?objet=vente|loyer` → intent (A1). « Le prix de vente » par défaut. */
export function intentFromObjet(objet: string | null | undefined): Intent {
  return objet === "loyer" ? "ESTIMATION_LOYER" : "ESTIMATION_VENTE";
}

export const PROPERTY_TYPES = ["APPARTEMENT", "MAISON"] as const;
export type EstimationPropertyType = (typeof PROPERTY_TYPES)[number];
export const PROPERTY_TYPE_LABELS: Record<EstimationPropertyType, string> = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
};

/** Pièces en radios (A18). « 5+ » est envoyé tel quel à l'API (A34). */
export const ROOMS = ["1", "2", "3", "4", "5+"] as const;
export type Rooms = (typeof ROOMS)[number];

export const BEDROOMS = ["0", "1", "2", "3", "4", "5", "6", "7+"] as const;
export const BATHROOMS = ["1", "2", "3", "4+"] as const;
export const LEVELS = ["1", "2", "3", "4+"] as const;
/** Étage : rez-de-chaussée, 1 à 19, « 20+ ». */
export const FLOORS = [
  "RDC",
  ...Array.from({ length: 19 }, (_, i) => String(i + 1)),
  "20+",
] as const;

export const CONDITIONS = [
  "NEUF",
  "TRES_BON_ETAT",
  "BON_ETAT",
  "A_RAFRAICHIR",
  "A_RENOVER",
  "A_RESTAURER",
] as const;
export type Condition = (typeof CONDITIONS)[number];
export const CONDITION_LABELS: Record<
  Condition,
  { label: string; help: string | null }
> = {
  NEUF: { label: "Neuf ou récent", help: null },
  TRES_BON_ETAT: { label: "Très bon état", help: null },
  BON_ETAT: { label: "Bon état", help: null },
  A_RAFRAICHIR: { label: "À rafraîchir", help: "Peinture, sols" },
  A_RENOVER: {
    label: "À rénover",
    help: "Cuisine, salle de bains, électricité",
  },
  A_RESTAURER: { label: "À restaurer", help: "Gros travaux" },
};

/** Époque de construction : le libellé est envoyé tel quel dans `constructionYear`. */
export const CONSTRUCTION_PERIODS = [
  "Avant 1949",
  "1949-1974",
  "1975-1999",
  "2000 et après",
  "Je ne sais pas",
] as const;

export const CONTACT_PREFERENCES = ["telephone", "email"] as const;
export type ContactPreference = (typeof CONTACT_PREFERENCES)[number];
export const CONTACT_PREFERENCE_LABELS: Record<ContactPreference, string> = {
  telephone: "Par téléphone",
  email: "Par e-mail",
};

export const CONTACT_MOMENTS = [
  "matin",
  "midi",
  "fin-de-journee",
  "indifferent",
] as const;
export type ContactMoment = (typeof CONTACT_MOMENTS)[number];
export const CONTACT_MOMENT_LABELS: Record<ContactMoment, string> = {
  matin: "Matin",
  midi: "Midi",
  "fin-de-journee": "Fin de journée",
  indifferent: "Indifférent",
};

// --- Limites --------------------------------------------------------------------

export const LIMITS = {
  address: 200,
  city: 80,
  name: 80,
  renovations: 500,
  message: 1_000,
  surfaceMin: 8,
  surfaceMax: 2_000,
  landMax: 100_000,
} as const;

// --- État -------------------------------------------------------------------------

/**
 * État du tunnel tel que saisi. Les clés servent aussi de `name` aux champs
 * (lecture par `estimationStateFromFormData`). Une chaîne vide = non renseigné.
 */
export type EstimationState = {
  // Étape 1
  intent: Intent;
  propertyType: EstimationPropertyType | "";
  address: string;
  postalCode: string;
  city: string;
  // Étape 2
  surface: string;
  rooms: Rooms | "";
  bedrooms: string;
  bathrooms: string;
  floor: string;
  isTopFloor: boolean;
  hasElevator: "" | "oui" | "non";
  levels: string;
  landSurface: string;
  hasBalcony: boolean;
  hasTerrace: boolean;
  hasGarden: boolean;
  hasParking: boolean;
  hasCellar: boolean;
  condition: Condition | "";
  constructionPeriod: string;
  renovations: string;
  // Étape 3
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactPreference: ContactPreference | "";
  contactMoment: ContactMoment | "";
  message: string;
  // Étape 4
  rgpd: boolean;
};

export type EstimationField = keyof EstimationState;
export type EstimationErrors = FieldErrors<EstimationField>;

export function emptyEstimationState(
  intent: Intent = "ESTIMATION_VENTE",
): EstimationState {
  return {
    intent,
    propertyType: "",
    address: "",
    postalCode: "",
    city: "",
    surface: "",
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    floor: "",
    isTopFloor: false,
    hasElevator: "",
    levels: "",
    landSurface: "",
    hasBalcony: false,
    hasTerrace: false,
    hasGarden: false,
    hasParking: false,
    hasCellar: false,
    condition: "",
    constructionPeriod: "",
    renovations: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    contactPreference: "",
    contactMoment: "",
    message: "",
    rgpd: false,
  };
}

const BOOLEAN_FIELDS = [
  "isTopFloor",
  "hasBalcony",
  "hasTerrace",
  "hasGarden",
  "hasParking",
  "hasCellar",
  "rgpd",
] as const satisfies readonly EstimationField[];

/** Relit un FormData (Server Action) en état typé ; les valeurs hors liste sont vidées. */
export function estimationStateFromFormData(form: FormData): EstimationState {
  const s = (name: EstimationField) => formString(form.get(name));
  const state = emptyEstimationState();
  const intent = s("intent");
  if (isOneOf(intent, INTENTS)) state.intent = intent;
  const type = s("propertyType");
  state.propertyType = isOneOf(type, PROPERTY_TYPES) ? type : "";
  const rooms = s("rooms");
  state.rooms = isOneOf(rooms, ROOMS) ? rooms : "";
  const condition = s("condition");
  state.condition = isOneOf(condition, CONDITIONS) ? condition : "";
  const pref = s("contactPreference");
  state.contactPreference = isOneOf(pref, CONTACT_PREFERENCES) ? pref : "";
  const moment = s("contactMoment");
  state.contactMoment = isOneOf(moment, CONTACT_MOMENTS) ? moment : "";
  const elevator = s("hasElevator");
  state.hasElevator = elevator === "oui" || elevator === "non" ? elevator : "";

  for (const key of [
    "address",
    "postalCode",
    "city",
    "surface",
    "bedrooms",
    "bathrooms",
    "floor",
    "levels",
    "landSurface",
    "constructionPeriod",
    "firstName",
    "lastName",
    "email",
    "phone",
  ] as const) {
    state[key] = clean(s(key));
  }
  state.renovations = cleanMultiline(s("renovations"));
  state.message = cleanMultiline(s("message"));
  for (const key of BOOLEAN_FIELDS) state[key] = formBoolean(form.get(key));

  // Listes fermées des sélecteurs.
  if (!isOneOf(state.bedrooms, BEDROOMS)) state.bedrooms = "";
  if (!isOneOf(state.bathrooms, BATHROOMS)) state.bathrooms = "";
  if (!isOneOf(state.levels, LEVELS)) state.levels = "";
  if (!isOneOf(state.floor, FLOORS)) state.floor = "";
  if (!isOneOf(state.constructionPeriod, CONSTRUCTION_PERIODS))
    state.constructionPeriod = "";
  return state;
}

// --- Étapes -------------------------------------------------------------------------

export const ESTIMATION_STEPS = [1, 2, 3, 4] as const;
export type EstimationStep = (typeof ESTIMATION_STEPS)[number];

/** Libellé de progression : « Étape 2 sur 4, ses caractéristiques » (A23). */
export const STEP_TITLES: Record<EstimationStep, string> = {
  1: "votre bien",
  2: "ses caractéristiques",
  3: "vous",
  4: "vérification et envoi",
};

export function progressLabel(step: EstimationStep): string {
  return `Étape\u00a0${step}\u00a0sur\u00a0${ESTIMATION_STEPS.length}, ${STEP_TITLES[step]}`;
}

/** `?etape=` → étape valide, 1 par défaut. */
export function parseStep(value: string | null | undefined): EstimationStep {
  const n = Number(value);
  return isOneOf(String(n), ["1", "2", "3", "4"] as const)
    ? (n as EstimationStep)
    : 1;
}

function roomsAsNumber(rooms: Rooms | ""): number | null {
  if (rooms === "") return null;
  return rooms === "5+" ? Number.POSITIVE_INFINITY : Number(rooms);
}

function bedroomsAsNumber(bedrooms: string): number | null {
  if (bedrooms === "") return null;
  return bedrooms === "7+" ? 7 : Number(bedrooms);
}

/** Validation d'une étape. L'ordre des clés suit l'ordre des champs à l'écran. */
export function validateEstimationStep(
  step: EstimationStep,
  state: EstimationState,
): EstimationErrors {
  const errors: EstimationErrors = {};

  if (step === 1) {
    if (!isOneOf(state.propertyType, PROPERTY_TYPES))
      errors.propertyType = MESSAGES.propertyType;
    if (!maxLength(state.address, LIMITS.address))
      errors.address = tooLong("L’adresse", LIMITS.address);
    if (!isPostalCode(state.postalCode))
      errors.postalCode = MESSAGES.postalCode;
    if (!maxLength(state.city, LIMITS.city))
      errors.city = tooLong("La ville", LIMITS.city);
  }

  if (step === 2) {
    const surface = parseDecimalFR(state.surface);
    if (isBlank(state.surface) || surface === null)
      errors.surface = MESSAGES.surface;
    else if (surface < LIMITS.surfaceMin || surface > LIMITS.surfaceMax)
      errors.surface = MESSAGES.surfaceRange;

    if (!isOneOf(state.rooms, ROOMS)) errors.rooms = MESSAGES.rooms;

    const rooms = roomsAsNumber(state.rooms);
    const bedrooms = bedroomsAsNumber(state.bedrooms);
    if (rooms !== null && bedrooms !== null && bedrooms > rooms)
      errors.bedrooms = MESSAGES.bedrooms;

    if (state.propertyType === "MAISON" && !isBlank(state.landSurface)) {
      const land = parseDecimalFR(state.landSurface);
      if (land === null || land > LIMITS.landMax)
        errors.landSurface =
          "La surface du terrain doit être comprise entre 0\u00a0et 100\u202f000\u00a0m².";
    }
    if (!maxLength(state.renovations, LIMITS.renovations))
      errors.renovations = tooLong(
        "La description des travaux",
        LIMITS.renovations,
      );
  }

  if (step === 3) {
    if (isBlank(state.firstName)) errors.firstName = MESSAGES.firstName;
    else if (!maxLength(state.firstName, LIMITS.name))
      errors.firstName = tooLong("Le prénom", LIMITS.name);
    if (isBlank(state.lastName)) errors.lastName = MESSAGES.lastName;
    else if (!maxLength(state.lastName, LIMITS.name))
      errors.lastName = tooLong("Le nom", LIMITS.name);
    if (!isEmail(state.email)) errors.email = MESSAGES.email;
    if (isBlank(state.phone)) {
      if (state.contactPreference === "telephone")
        errors.phone = MESSAGES.phoneRequired;
    } else if (!isPhoneFR(state.phone)) {
      errors.phone = MESSAGES.phone;
    }
    if (!maxLength(state.message, LIMITS.message))
      errors.message = tooLong("Votre message", LIMITS.message);
  }

  if (step === 4) {
    if (state.rgpd !== true) errors.rgpd = MESSAGES.rgpd;
  }

  return errors;
}

/** Validation complète (Server Action). Interface figée : doc 04 §7. */
export function validateEstimation(state: EstimationState): EstimationErrors {
  return Object.assign(
    {},
    ...ESTIMATION_STEPS.map((step) => validateEstimationStep(step, state)),
  ) as EstimationErrors;
}

/** Première étape incomplète (arrivée directe sur `?etape=3`), ou 4 si tout est valide. */
export function firstIncompleteStep(state: EstimationState): EstimationStep {
  for (const step of [1, 2, 3] as const) {
    if (Object.keys(validateEstimationStep(step, state)).length > 0)
      return step;
  }
  return 4;
}

/** Étape à laquelle appartient un champ (liens du résumé d'erreurs, « Modifier »). */
export function stepOfField(field: EstimationField): EstimationStep {
  if (
    ["intent", "propertyType", "address", "postalCode", "city"].includes(field)
  )
    return 1;
  if (
    [
      "firstName",
      "lastName",
      "email",
      "phone",
      "contactPreference",
      "contactMoment",
      "message",
    ].includes(field)
  )
    return 3;
  if (field === "rgpd") return 4;
  return 2;
}

// --- Formatage partagé (récapitulatif, A34) --------------------------------------------

/** « 1 pièce », « 3 pièces », « 5 pièces ou plus ». */
export function formatRooms(rooms: Rooms | ""): string {
  if (rooms === "") return "";
  if (rooms === "5+") return "5\u00a0pièces ou plus";
  return rooms === "1" ? "1\u00a0pièce" : `${rooms}\u00a0pièces`;
}

/** « 59.5 » ou « 59,5 » → « 59,5 m² ». Chaîne vide si illisible. */
export function formatSurface(value: string): string {
  const n = parseDecimalFR(value);
  if (n === null) return "";
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(n)} m²`;
}
