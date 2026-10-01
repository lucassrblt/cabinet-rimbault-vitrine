// Sous-ensemble du contrat de l'API publique utilisé par le site.
// L'API renvoie davantage de champs : on ne type que ce qu'on affiche.

export type TransactionType = "VENTE" | "LOCATION";
export type PropertyStatus = "DISPONIBLE" | "SOUS_OFFRE" | "SOUS_COMPROMIS";
export type EnergyClass = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "VIERGE";

export type PropertyImage = {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  isMain: boolean;
  width: number | null;
  height: number | null;
};

export type Property = {
  id: string;
  reference: string;
  title: string;
  description: string;
  propertyType: string;
  propertySubType: string | null;
  transactionType: TransactionType;
  status: PropertyStatus;
  createdAt: string;
  finance: {
    price: number;
    charges: number | null;
    chargesIncluses: boolean | null;
    honoraires: number | null;
    honorairesPct: number | null;
    honorairesCharge: "ACQUEREUR" | "VENDEUR" | "PARTAGE" | null;
    honorairesType: string | null;
    depot: number | null;
    taxeFonciere: number | null;
  } | null;
  location: {
    city: string;
    postalCode: string;
    neighborhood: string | null;
  } | null;
  characteristics: {
    surface: number;
    surfaceCarrez: number | null;
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    showerRooms: number | null;
    floor: number | null;
    floorIsRezDeChaussee: boolean | null;
    totalFloors: number | null;
    yearBuilt: number | null;
  } | null;
  amenities: {
    hasBalcony: boolean | null;
    hasTerrace: boolean | null;
    hasGarden: boolean | null;
    hasParking: boolean | null;
    hasGarage: boolean | null;
    hasCellar: boolean | null;
    hasElevator: boolean | null;
  } | null;
  energy: {
    energyClass: EnergyClass | null;
    energyValue: number | null;
    gesClass: EnergyClass | null;
    gesValue: number | null;
    annualEnergyCostMin: number | null;
    annualEnergyCostMax: number | null;
    dateReferenceEnergie: string | null;
  } | null;
  copro: {
    isInCopro: boolean | null;
    coprLots: number | null;
    coprCharges: number | null;
    coprProcedure: boolean | null;
  } | null;
  images: PropertyImage[];
};
