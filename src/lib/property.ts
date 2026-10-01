import type { Property } from "@/lib/api/types";
import { formatPrice, formatSurface } from "@/lib/utils";

// Les titres saisis dans le back-office sont au format portail
// (« 5 PIÈCES + 2 TERRASSES… ») : le site reconstruit les siens
// à partir des données structurées.

const TYPE_LABELS: Record<string, string> = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  LOFT: "Loft",
  TERRAIN: "Terrain",
  LOCAL_COMMERCIAL: "Local commercial",
  BUREAUX: "Bureaux",
  PARKING: "Parking",
};

export function propertyTitle(p: Property) {
  const type = TYPE_LABELS[p.propertyType] ?? "Bien";
  const rooms = p.characteristics?.rooms;
  if (p.propertyType === "APPARTEMENT" && rooms === 1) return "Studio";
  if (!rooms) return type;
  return `${type} ${rooms} pièces`;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function propertyPlace(p: Property) {
  if (!p.location) return null;
  const city = p.location.city.replace(/^Asnieres/, "Asnières");
  return {
    city,
    neighborhood: p.location.neighborhood
      ? capitalize(p.location.neighborhood)
      : null,
  };
}

export function propertySurface(p: Property) {
  const c = p.characteristics;
  if (!c) return null;
  return formatSurface(c.surfaceCarrez ?? c.surface);
}

export function propertyFeatures(p: Property) {
  const a = p.amenities;
  if (!a) return [];
  const features: string[] = [];
  if (a.hasTerrace) features.push("Terrasse");
  if (a.hasGarden) features.push("Jardin");
  if (a.hasBalcony) features.push("Balcon");
  if (a.hasParking || a.hasGarage) features.push("Parking");
  if (a.hasCellar) features.push("Cave");
  if (a.hasElevator) features.push("Ascenseur");
  return features;
}

export function propertyFloor(p: Property, { short = false } = {}) {
  const c = p.characteristics;
  if (!c) return null;
  if (c.floorIsRezDeChaussee) return short ? "RDC" : "Rez-de-chaussée";
  if (c.floor == null) return null;
  const ordinal = c.floor === 1 ? "1er" : `${c.floor}e`;
  if (short) return ordinal;
  const floor = `${ordinal} étage`;
  return c.totalFloors && c.floor === c.totalFloors
    ? `${floor}, dernier`
    : floor;
}

export function statusLabel(p: Property) {
  if (p.status === "SOUS_OFFRE") return "Sous offre";
  if (p.status === "SOUS_COMPROMIS") return "Sous compromis";
  return null;
}

export function priceLabel(p: Property) {
  if (!p.finance) return null;
  const price = formatPrice(p.finance.price);
  return p.transactionType === "LOCATION" ? `${price} par mois` : price;
}

/** Mention d'honoraires obligatoire (arrêté du 10 janvier 2017). */
export function feesLabel(p: Property) {
  const f = p.finance;
  if (!f) return null;
  const charge =
    f.honorairesCharge ??
    (f.honorairesType?.toLowerCase().startsWith("vend") ? "VENDEUR" : null) ??
    (f.honorairesType?.toLowerCase().startsWith("acq") ? "ACQUEREUR" : null);

  if (charge === "VENDEUR") return "Honoraires à la charge du vendeur.";
  if (charge === "ACQUEREUR" && f.honorairesPct) {
    const net = f.price / (1 + f.honorairesPct / 100);
    return `Honoraires inclus : ${String(f.honorairesPct).replace(".", ",")} % TTC du prix hors honoraires, à la charge de l’acquéreur (${formatPrice(Math.round(net))} hors honoraires).`;
  }
  return null;
}

/** Découpe la description saisie au format « … - … - … » en paragraphes lisibles. */
export function descriptionParagraphs(p: Property) {
  const isShouting = (s: string) => s === s.toUpperCase() && /[A-Z]/.test(s);
  return p.description
    .split(/\s*-\s+(?=\S)/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part, index) => !(index === 0 && isShouting(part)))
    .map((part) => (isShouting(part) ? capitalize(part.toLowerCase()) : part));
}

/**
 * Sépare la description en repères courts (quartier, transports…) et en
 * paragraphes de fond.
 */
export function descriptionParts(p: Property) {
  const parts = descriptionParagraphs(p);
  return {
    highlights: parts.filter((part) => part.length < 90),
    paragraphs: parts.filter((part) => part.length >= 90),
  };
}

export function mainImage(p: Property) {
  return p.images.find((image) => image.isMain) ?? p.images[0] ?? null;
}
