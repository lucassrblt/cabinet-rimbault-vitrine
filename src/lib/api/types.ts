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

export type TransactionType =
  | "VENTE"
  | "LOCATION"
  | "VIAGER"
  | "LOCATION_SAISONNIERE";

export type PropertyStatus =
  | "DISPONIBLE"
  | "SOUS_COMPROMIS"
  | "SOUS_OFFRE"
  | "VENDU"
  | "LOUE"
  | "ARCHIVE"
  | "BROUILLON";

export type EnergyClass = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "VIERGE";

export type ImageCategory =
  | "GENERAL"
  | "FACADE"
  | "SEJOUR"
  | "CUISINE"
  | "CHAMBRE"
  | "SALLE_DE_BAIN"
  | "WC"
  | "TERRASSE"
  | "BALCON"
  | "JARDIN"
  | "PISCINE"
  | "PARKING"
  | "CAVE"
  | "PLAN"
  | "VUE"
  | "AUTRE";

export interface PropertyImage {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  order: number;
  isMain: boolean;
  category: ImageCategory;
  width: number | null;
  height: number | null;
}

export interface PropertyFinance {
  price: number;
  pricePerMeter: number | null;
  charges: number | null;
  chargesIncluses: boolean;
  honoraires: number | null;
  honorairesType: string | null;
  honorairesPct: number | null;
  depot: number | null;
  taxeFonciere: number | null;
}

export interface PropertyLocation {
  address: string;
  city: string;
  postalCode: string;
  department: string | null;
  neighborhood: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface PropertyCharacteristics {
  surface: number;
  surfaceCarrez: number | null;
  surfaceTerrain: number | null;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: number | null;
  totalFloors: number | null;
}

export interface PropertyAmenities {
  hasBalcony: boolean;
  hasTerrace: boolean;
  hasGarden: boolean;
  hasPool: boolean;
  hasParking: boolean;
  hasGarage: boolean;
  hasElevator: boolean;
  hasCellar: boolean;
}

export interface PropertyEnergy {
  energyClass: EnergyClass | null;
  energyValue: number | null;
  gesClass: EnergyClass | null;
  gesValue: number | null;
}

export interface Property {
  id: string;
  reference: string;
  title: string;
  description: string;
  shortDescription: string | null;
  propertyType: PropertyType;
  transactionType: TransactionType;
  status: PropertyStatus;
  isPublished: boolean;
  isFeatured: boolean;
  isExclusive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  viewCount: number;
  finance: PropertyFinance | null;
  location: PropertyLocation | null;
  characteristics: PropertyCharacteristics | null;
  amenities: PropertyAmenities | null;
  energy: PropertyEnergy | null;
  images: PropertyImage[];
}

export interface ApiListResponse<T> {
  success: boolean;
  count: number;
  total?: number;
  offset?: number;
  limit?: number;
  filters?: Record<string, unknown>;
  data: T[];
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}

export interface SearchFilters {
  postalCode?: string;
  city?: string;
  transactionType?: TransactionType;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minSurface?: number;
  maxSurface?: number;
  bedrooms?: number;
  sortBy?: "date" | "price_asc" | "price_desc";
  limit?: number;
  offset?: number;
}

export interface ListFilters {
  postalCode?: string;
  city?: string;
  limit?: number;
}
