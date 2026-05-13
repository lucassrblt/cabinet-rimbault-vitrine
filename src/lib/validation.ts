import { z } from "zod";

export const frenchPhoneRegex = /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/;
export const postalCodeRegex = /^\d{5}$/;

export const phoneSchema = z
  .string()
  .min(1, "Téléphone requis")
  .regex(frenchPhoneRegex, "Format de téléphone invalide (ex. 06 12 34 56 78)");

export const rgpdConsentSchema = z.boolean().refine((v) => v === true, {
  message: "Vous devez accepter la politique de confidentialité",
});

export const nameSchema = z.string().min(2, "Minimum 2 caractères").max(60);
export const emailSchema = z.email("Email invalide");
export const postalCodeSchema = z
  .string()
  .regex(postalCodeRegex, "Code postal invalide (5 chiffres)");

export const quickContactSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  message: z.string().min(5, "Merci de préciser votre message").max(500),
  rgpd: rgpdConsentSchema,
  website: z.string().max(0).optional(),
});
export type QuickContactInput = z.infer<typeof quickContactSchema>;

export const contactSchema = z.object({
  subject: z.enum(["vente", "location", "estimation", "rdv", "autre"]),
  reference: z.string().max(40).optional(),
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  message: z.string().min(5, "Merci de préciser votre message").max(500),
  rgpd: rgpdConsentSchema,
  website: z.string().max(0).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const visitFormSchema = z.object({
  profile: z.enum(["acquereur", "investisseur", "locataire", "curieux"]),
  financing: z.enum(["ok", "etude", "comptant", "na"]).optional(),
  availabilities: z.array(z.string()).optional(),
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  message: z.string().max(500).optional(),
  rgpd: rgpdConsentSchema,
  reference: z.string(),
  isRental: z.boolean(),
  website: z.string().max(0).optional(),
});
export type VisitFormInput = z.infer<typeof visitFormSchema>;

export const estimationStep1Schema = z.object({
  address: z.string().min(3, "Adresse requise").max(200),
  postalCode: postalCodeSchema,
  type: z.enum(["appartement", "maison", "terrain", "autre"]),
  surface: z
    .string()
    .min(1, "Surface requise")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) > 0 && Number(v) < 100000,
      { message: "Surface invalide" },
    ),
  rooms: z.string().min(1, "Nombre de pièces requis"),
  floor: z.string().optional(),
  year: z.string().optional(),
  outdoor: z.array(z.string()).optional(),
  condition: z.enum(["neuf", "bon", "rafraichir", "renover"]),
});
export type EstimationStep1 = z.infer<typeof estimationStep1Schema>;

export const projectRequestSchema = z.object({
  mode: z.enum(["sale", "rent"]),
  commune: z.string().min(1, "Commune requise"),
  propertyType: z.string().optional(),
  budgetMax: z
    .string()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), { message: "Budget invalide" }),
  piecesMin: z.string().optional(),
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  message: z.string().max(500).optional(),
  rgpd: rgpdConsentSchema,
  website: z.string().max(0).optional(),
});
export type ProjectRequestInput = z.infer<typeof projectRequestSchema>;

export const estimationStep2Schema = z.object({
  intent: z.enum(["vendre", "louer", "renseigne"]),
  delay: z.enum(["3m", "3-6m", "6-12m", "plus-tard"]),
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  message: z.string().max(300).optional(),
  rgpd: rgpdConsentSchema,
  website: z.string().max(0).optional(),
});
export type EstimationStep2 = z.infer<typeof estimationStep2Schema>;
