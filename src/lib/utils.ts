import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "Prix sur demande";
  return priceFormatter.format(price);
}

export function formatRent(price: number | null | undefined): string {
  if (price == null) return "Loyer sur demande";
  return `${priceFormatter.format(price)} / mois`;
}

export function formatSurface(surface: number | null | undefined): string {
  if (surface == null) return "—";
  return `${surface} m²`;
}

export function formatPropertyType(type: string): string {
  const map: Record<string, string> = {
    APPARTEMENT: "Appartement",
    MAISON: "Maison",
    VILLA: "Villa",
    TERRAIN: "Terrain",
    LOCAL_COMMERCIAL: "Local commercial",
    BUREAUX: "Bureaux",
    IMMEUBLE: "Immeuble",
    PARKING: "Parking",
    CAVE: "Cave",
    LOFT: "Loft",
    ATELIER: "Atelier",
    FERME: "Ferme",
    CHATEAU: "Château",
    PROPRIETE: "Propriété",
    AUTRE: "Autre",
  };
  return map[type] ?? type;
}

export function formatTransactionType(type: string): string {
  const map: Record<string, string> = {
    VENTE: "À vendre",
    LOCATION: "À louer",
    VIAGER: "Viager",
    LOCATION_SAISONNIERE: "Location saisonnière",
  };
  return map[type] ?? type;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function formatStatusLabel(status: string): string {
  const map: Record<string, string> = {
    DISPONIBLE: "Disponible",
    SOUS_COMPROMIS: "Sous compromis",
    SOUS_OFFRE: "Sous offre",
    VENDU: "Vendu",
    LOUE: "Loué",
    ARCHIVE: "Archivé",
    BROUILLON: "Brouillon",
  };
  return map[status] ?? status;
}
