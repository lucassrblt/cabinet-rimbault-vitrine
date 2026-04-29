import "server-only";

import { type ApiPostResult, apiPost } from "./client";

export type LeadSubject =
  | "BIEN_SALE"
  | "BIEN_RENT"
  | "ESTIMATION"
  | "APPOINTMENT"
  | "OTHER";

export type LeadProfile = "BUYER" | "INVESTOR" | "CURIOUS" | "TENANT";

export type LeadFinancing = "APPROVED" | "IN_PROGRESS" | "TO_STUDY" | "CASH";

export type VisitAvailability =
  | "MORNING"
  | "AFTERNOON"
  | "EVENING"
  | "SATURDAY";

export interface ContactMeta {
  source?: string;
  page?: string;
  userAgent?: string;
  referer?: string;
}

export interface ContactPayload {
  subject: LeadSubject;
  propertyReference?: string;
  profile?: LeadProfile;
  financing?: LeadFinancing;
  visitAvailability?: VisitAvailability[];
  contact: {
    firstName: string;
    lastName: string;
    phone?: string;
    email: string;
    message: string;
  };
  consent: { rgpd: boolean };
  meta?: ContactMeta;
}

export interface EvaluationPayload {
  propertyType: string;
  postalCode: string;
  address?: string;
  surface?: number;
  rooms?: number;
  bedrooms?: number;
  constructionYear?: number;
  hasBalcony?: boolean;
  hasTerrace?: boolean;
  hasGarden?: boolean;
  hasParking?: boolean;
  hasGarage?: boolean;
  hasPool?: boolean;
  condition?: string;
  intent?: string;
  timeframe?: string;
  situation?: string;
  message?: string;
  rgpd?: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source?: string;
  userAgent?: string;
  referer?: string;
}

export interface LeadResult {
  id: string;
  createdAt?: string;
}

export function postContactLead(
  input: ContactPayload,
): Promise<ApiPostResult<LeadResult>> {
  return apiPost<LeadResult>("/contact", input);
}

export function postEvaluation(
  input: EvaluationPayload,
): Promise<ApiPostResult<LeadResult>> {
  return apiPost<LeadResult>("/evaluation", input);
}
