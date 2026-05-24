import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Placeholder « blur-up » partagé pour les photos distantes (Supabase).
 * L'API admin n'expose pas de LQIP par image : on utilise un dégradé neutre
 * unique, flouté par `next/image` via `placeholder="blur"`, le temps que la
 * variante optimisée arrive. Si l'API expose un jour un blurDataURL réel
 * (ThumbHash/BlurHash par photo), le passer en prop à la place de celui-ci.
 */
export const PHOTO_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxNSI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZWNlYWU1Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZGVkY2Q2Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE1IiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+";

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

export function formatCondition(condition: string): string {
  const map: Record<string, string> = {
    NEUF: "Neuf",
    TRES_BON_ETAT: "Très bon état",
    BON_ETAT: "Bon état",
    A_RAFRAICHIR: "À rafraîchir",
    A_RENOVER: "À rénover",
    A_RESTAURER: "À restaurer",
  };
  return map[condition] ?? condition;
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

export function formatFloor(floor: number | null | undefined): string | null {
  if (floor == null) return null;
  if (floor === 0) return "RDC";
  if (floor === 1) return "1er étage";
  return `${floor}e étage`;
}
