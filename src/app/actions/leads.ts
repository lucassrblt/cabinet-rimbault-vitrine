"use server";

import { headers } from "next/headers";
import {
  type ContactMeta,
  type ContactPayload,
  type EvaluationPayload,
  type LeadFinancing,
  type LeadProfile,
  type LeadSubject,
  postContactLead,
  postEvaluation,
  type VisitAvailability,
} from "@/lib/api/leads";
import {
  type ContactInput,
  contactSchema,
  type EstimationStep1,
  type EstimationStep2,
  estimationStep1Schema,
  estimationStep2Schema,
  type VisitFormInput,
  visitFormSchema,
} from "@/lib/validation";

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fields?: Record<string, string> };

async function buildMeta(page?: string): Promise<ContactMeta> {
  const h = await headers();
  return {
    source: "vitrine",
    page,
    userAgent: h.get("user-agent") ?? undefined,
    referer: h.get("referer") ?? undefined,
  };
}

const SUBJECT_MAP: Record<ContactInput["subject"], LeadSubject> = {
  vente: "BIEN_SALE",
  location: "BIEN_RENT",
  estimation: "ESTIMATION",
  rdv: "APPOINTMENT",
  autre: "OTHER",
};

const PROFILE_MAP: Record<VisitFormInput["profile"], LeadProfile> = {
  acquereur: "BUYER",
  investisseur: "INVESTOR",
  locataire: "TENANT",
  curieux: "CURIOUS",
};

const FINANCING_MAP: Record<
  NonNullable<VisitFormInput["financing"]>,
  LeadFinancing | undefined
> = {
  ok: "APPROVED",
  etude: "TO_STUDY",
  comptant: "CASH",
  na: undefined,
};

const AVAIL_MAP: Record<string, VisitAvailability> = {
  matin: "MORNING",
  aprem: "AFTERNOON",
  soir: "EVENING",
  samedi: "SATURDAY",
};

const PROPERTY_TYPE_MAP: Record<EstimationStep1["type"], string> = {
  appartement: "APPARTEMENT",
  maison: "MAISON",
  terrain: "TERRAIN",
  autre: "AUTRE",
};

const CONDITION_MAP: Record<EstimationStep1["condition"], string> = {
  neuf: "NEUF",
  bon: "BON_ETAT",
  rafraichir: "A_RAFRAICHIR",
  renover: "A_RENOVER",
};

const INTENT_MAP: Record<EstimationStep2["intent"], string> = {
  vendre: "SELL",
  louer: "RENT_OUT",
  renseigne: "EXPLORATION",
};

function parseRooms(v: string): number | undefined {
  if (!v) return undefined;
  if (v.endsWith("+")) return Number.parseInt(v, 10);
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

function parseYear(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n > 1800 && n < 2100 ? n : undefined;
}

function parseSurface(v: string): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function mapZodIssues(
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>,
): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.map((p) => String(p)).join(".");
    fields[key] = issue.message;
  }
  return fields;
}

function honeypotTripped(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export async function submitContactLead(
  input: ContactInput,
): Promise<ActionResult> {
  if (honeypotTripped(input.website)) {
    return { ok: true, id: "silent" };
  }
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Formulaire invalide",
      fields: mapZodIssues(parsed.error.issues),
    };
  }
  const data = parsed.data;
  const payload: ContactPayload = {
    subject: SUBJECT_MAP[data.subject],
    propertyReference: data.reference || undefined,
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      message: data.message,
    },
    consent: { rgpd: data.rgpd },
    meta: await buildMeta("/contact"),
  };
  const res = await postContactLead(payload);
  if (!res.ok || !res.data) {
    return {
      ok: false,
      error: res.error ?? "Erreur lors de l'envoi.",
      fields: res.fields,
    };
  }
  return { ok: true, id: res.data.id };
}

export async function submitVisitRequest(
  input: VisitFormInput,
): Promise<ActionResult> {
  if (honeypotTripped(input.website)) {
    return { ok: true, id: "silent" };
  }
  const parsed = visitFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Formulaire invalide",
      fields: mapZodIssues(parsed.error.issues),
    };
  }
  const data = parsed.data;
  const financing = data.financing ? FINANCING_MAP[data.financing] : undefined;
  const visitAvailability: VisitAvailability[] = (data.availabilities ?? [])
    .map((v) => AVAIL_MAP[v])
    .filter((v): v is VisitAvailability => Boolean(v));

  const payload: ContactPayload = {
    subject: data.isRental ? "BIEN_RENT" : "BIEN_SALE",
    propertyReference: data.reference,
    profile: PROFILE_MAP[data.profile],
    financing,
    visitAvailability: visitAvailability.length ? visitAvailability : undefined,
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      message:
        data.message && data.message.trim().length > 0
          ? data.message
          : `Demande de visite pour le bien ${data.reference}.`,
    },
    consent: { rgpd: data.rgpd },
    meta: await buildMeta(`/bien/${data.reference}`),
  };
  const res = await postContactLead(payload);
  if (!res.ok || !res.data) {
    return {
      ok: false,
      error: res.error ?? "Erreur lors de l'envoi.",
      fields: res.fields,
    };
  }
  return { ok: true, id: res.data.id };
}

export interface EstimationInput {
  step1: EstimationStep1;
  step2: EstimationStep2;
}

export async function submitEvaluation(
  input: EstimationInput,
): Promise<ActionResult> {
  if (honeypotTripped(input.step2.website)) {
    return { ok: true, id: "silent" };
  }
  const s1 = estimationStep1Schema.safeParse(input.step1);
  if (!s1.success) {
    return {
      ok: false,
      error: "Étape 1 invalide",
      fields: mapZodIssues(s1.error.issues),
    };
  }
  const s2 = estimationStep2Schema.safeParse(input.step2);
  if (!s2.success) {
    return {
      ok: false,
      error: "Étape 2 invalide",
      fields: mapZodIssues(s2.error.issues),
    };
  }
  const step1 = s1.data;
  const step2 = s2.data;

  const outdoor = step1.outdoor ?? [];
  const meta = await buildMeta("/estimation");

  const payload: EvaluationPayload = {
    propertyType: PROPERTY_TYPE_MAP[step1.type],
    postalCode: step1.postalCode,
    address: step1.address,
    surface: parseSurface(step1.surface),
    rooms: parseRooms(step1.rooms),
    constructionYear: parseYear(step1.year),
    hasBalcony: outdoor.includes("balcon"),
    hasTerrace: outdoor.includes("terrasse"),
    hasGarden: outdoor.includes("jardin"),
    hasGarage: outdoor.includes("garage"),
    hasParking: outdoor.includes("parking"),
    hasPool: outdoor.includes("piscine"),
    condition: CONDITION_MAP[step1.condition],
    intent: INTENT_MAP[step2.intent],
    message: step2.message || undefined,
    rgpd: step2.rgpd,
    firstName: step2.firstName,
    lastName: step2.lastName,
    email: step2.email,
    phone: step2.phone,
    source: meta.source,
    userAgent: meta.userAgent,
    referer: meta.referer,
  };

  const res = await postEvaluation(payload);
  if (!res.ok || !res.data) {
    return {
      ok: false,
      error: res.error ?? "Erreur lors de l'envoi.",
      fields: res.fields,
    };
  }
  return { ok: true, id: res.data.id };
}
