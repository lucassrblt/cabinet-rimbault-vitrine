// Libellés des données d'un bien (doc 04 §2.2). Pur.

import type { PropertyStatus, PropertyType } from "@/lib/api/types";

export const TYPE_LABELS: Record<PropertyType, string> = {
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
  AUTRE: "Bien",
};

/** Types dont le titre cite le nombre de pièces. */
export const TYPES_WITH_ROOMS: ReadonlySet<PropertyType> = new Set([
  "APPARTEMENT",
  "MAISON",
  "VILLA",
  "LOFT",
  "PROPRIETE",
  "FERME",
  "CHATEAU",
]);

/** Badge de statut ; `null` pour un bien disponible (aucun badge). */
export const STATUS_LABELS: Record<PropertyStatus, string | null> = {
  DISPONIBLE: null,
  SOUS_OFFRE: "Sous offre",
  SOUS_COMPROMIS: "Sous compromis",
  VENDU: "Vendu",
  LOUE: "Loué",
};
