// Contrat de l'API publique (cabinet-rimbault-api, /api/public), tel que
// renvoyé réellement (capture du 30/10/2026, doc 02 §4). L'API renvoie davantage
// de champs : on ne type que ce que la vitrine lit. Les composants ne lisent
// jamais ces champs bruts : ils passent par `src/lib/property/view.ts` (lot 2).
//
// À ne jamais afficher : `location.address` (adresse postale complète), les ids
// internes, `viewCount`, `contactCount`.

export type TransactionType =
  | "VENTE"
  | "LOCATION"
  | "VIAGER"
  | "LOCATION_SAISONNIERE";

/** Statuts visibles par défaut sur la liste publique. */
export type PublicPropertyStatus =
  | "DISPONIBLE"
  | "SOUS_OFFRE"
  | "SOUS_COMPROMIS";
/** Statuts de l'archive « Récemment vendus et loués » (A14). */
export type ArchivedPropertyStatus = "VENDU" | "LOUE";
export type PropertyStatus = PublicPropertyStatus | ArchivedPropertyStatus;

export type PropertyType =
  | "APPARTEMENT"
  | "MAISON"
  | "VILLA"
  | "TERRAIN"
  | "LOCAL_COMMERCIAL"
  | "BUREAUX"
  | "IMMEUBLE"
  | "PARKING"
  | "CAVE"
  | "LOFT"
  | "ATELIER"
  | "FERME"
  | "CHATEAU"
  | "PROPRIETE"
  | "AUTRE";

export type EnergyClass = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "VIERGE";

/**
 * Charge des honoraires, saisie en minuscules dans l'admin (`honorairesType`).
 * C'est la vraie information de charge : `honorairesCharge` est toujours `null`.
 * « locataire » apparaît sur les biens en location.
 */
export type FeesPayer = "acquereur" | "vendeur" | "locataire";

export type PropertyImage = {
  id: string;
  url: string;
  /** Nom de fichier (« 1 », « IMG_3895 ») : inutilisable comme alt. */
  alt: string | null;
  caption: string | null;
  order: number;
  isMain: boolean;
  /** Toujours `null` en base : le ratio vient du conteneur. */
  width: number | null;
  height: number | null;
};

export type PropertyFinance = {
  /** Prix FAI en vente (honoraires inclus), loyer mensuel en location. */
  price: number;
  /** Charges mensuelles. */
  charges: number | null;
  chargesIncluses: boolean | null;
  /** Montant TTC. `-1` est une sentinelle de saisie : à traiter comme `null`. */
  honoraires: number | null;
  honorairesPct: number | null;
  honorairesType: FeesPayer | null;
  /** Toujours `null` dans les données réelles. Ne pas s'y fier. */
  honorairesCharge: string | null;
  /** Dépôt de garantie (location). */
  depot: number | null;
  taxeFonciere: number | null;
};

export type PropertyLocation = {
  city: string;
  postalCode: string;
  /** Saisie hétérogène (« collange », « Gabriél Péri ») : normaliser à l'affichage. */
  neighborhood: string | null;
};

export type PropertyCharacteristics = {
  surface: number;
  surfaceCarrez: number | null;
  surfaceTerrain: number | null;
  rooms: number;
  bedrooms: number;
  bathrooms: number | null;
  showerRooms: number | null;
  floor: number | null;
  floorIsRezDeChaussee: boolean | null;
  totalFloors: number | null;
  levelsCount: number | null;
  yearBuilt: number | null;
};

export type PropertyAmenities = {
  hasBalcony: boolean | null;
  hasTerrace: boolean | null;
  hasGarden: boolean | null;
  hasParking: boolean | null;
  hasGarage: boolean | null;
  hasCellar: boolean | null;
  hasElevator: boolean | null;
  isFurnished: boolean | null;
};

export type PropertyEnergy = {
  energyClass: EnergyClass | null;
  energyValue: number | null;
  gesClass: EnergyClass | null;
  gesValue: number | null;
  annualEnergyCostMin: number | null;
  annualEnergyCostMax: number | null;
  /**
   * « Date d'indexation du prix de l'énergie » (admin), date ISO
   * (`2021-01-01T00:00:00.000Z`). Formulations d'affichage : A29.
   */
  dateReferenceEnergie: string | null;
  /** Étiquettes SVG générées par l'admin (Supabase). */
  dpeImageUrl: string | null;
  gesImageUrl: string | null;
};

export type PropertyCopro = {
  isInCopro: boolean | null;
  coprLots: number | null;
  /** Charges annuelles. */
  coprCharges: number | null;
  coprProcedure: boolean | null;
};

export type Property = {
  id: string;
  reference: string;
  /** Saisi en capitales avec des « + » : jamais affiché tel quel en titre. */
  title: string;
  description: string | null;
  /** Toujours `null` aujourd'hui. */
  shortDescription: string | null;
  propertyType: PropertyType;
  propertySubType: string | null;
  transactionType: TransactionType;
  status: PropertyStatus;
  isExclusive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  finance: PropertyFinance | null;
  location: PropertyLocation | null;
  characteristics: PropertyCharacteristics | null;
  amenities: PropertyAmenities | null;
  energy: PropertyEnergy | null;
  copro: PropertyCopro | null;
  /** 5 au plus dans les listes, toutes sur la fiche. Trier par `order`. */
  images: PropertyImage[];
};

/** Réponse de `GET /properties`. */
export type PropertyListResponse = {
  success: boolean;
  count: number;
  total?: number;
  offset?: number;
  limit?: number;
  data: Property[];
};

/** Réponse de `GET /properties/{ref}`. */
export type PropertyDetailResponse = {
  success: boolean;
  data: Property;
};

// ---------------------------------------------------------------------------
// Écriture (doc 02 §3, doc 04 §3.4 et §3.8)

export type EvaluationIntent = "ESTIMATION_VENTE" | "ESTIMATION_LOYER";

export type EvaluationCondition =
  | "NEUF"
  | "TRES_BON_ETAT"
  | "BON_ETAT"
  | "A_RAFRAICHIR"
  | "A_RENOVER"
  | "A_RESTAURER";

/**
 * Corps à plat de `POST /evaluation`. Les nombres partent en chaînes
 * (colonnes `String?` en base) : `surface: "59.5"`, `rooms: "5+"`.
 * `timeframe`, `situation` et `hasPool` ne sont jamais envoyés (A1).
 */
export type EvaluationPayload = {
  propertyType: "APPARTEMENT" | "MAISON";
  postalCode: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  surface?: string;
  levels?: string;
  rooms?: string;
  bedrooms?: string;
  bathrooms?: string;
  constructionYear?: string;
  renovations?: string;
  hasBalcony?: boolean;
  hasTerrace?: boolean;
  hasGarden?: boolean;
  hasParking?: boolean;
  condition?: EvaluationCondition;
  intent: EvaluationIntent;
  phone?: string;
  message?: string;
  rgpd: true;
  source: "vitrine/estimation";
  userAgent?: string;
  referer?: string;
};

export type ContactSubject =
  | "BIEN_SALE"
  | "BIEN_RENT"
  | "ESTIMATION"
  | "APPOINTMENT"
  | "OTHER";

/** Corps imbriqué de `POST /contact` (schéma zod de l'API). */
export type ContactPayload = {
  subject: ContactSubject;
  propertyReference?: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    /** 1 à 500 caractères. */
    message: string;
  };
  consent: { rgpd: true };
  meta?: {
    source?: "vitrine/contact" | "vitrine/fiche";
    page?: string;
    userAgent?: string;
    referer?: string;
  };
};

/** Réponse 201 commune aux deux routes d'écriture. */
export type CreatedResponse = {
  success: true;
  message: string;
  data: { id: string; createdAt: string };
};

/** Corps d'erreur des routes d'écriture (400, 422, 5xx). */
export type ApiErrorBody = {
  success?: false;
  error?: string;
  code?: string;
  /** 400 de `/contact` : clés à points (« contact.email »). */
  fields?: Record<string, string>;
};
