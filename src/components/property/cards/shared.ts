import type { Property, PropertyImage } from "@/lib/api/types";
import {
  formatFloor,
  formatPrice,
  formatPropertyType,
  formatRent,
  formatSurface,
} from "@/lib/utils";

/** Renvoie l'image principale + une éventuelle seconde, pour le swap au hover. */
export function getPrimaryImages(property: Property): {
  primary: PropertyImage | null;
  secondary: PropertyImage | null;
} {
  if (property.images.length === 0) {
    return { primary: null, secondary: null };
  }
  const sorted = property.images.slice().sort((a, b) => a.order - b.order);
  const primary = sorted.find((img) => img.isMain) ?? sorted[0] ?? null;
  const secondary = sorted.find((img) => img.id !== primary?.id) ?? null;
  return { primary, secondary };
}

/** Toutes les images d'un bien, triées : image principale d'abord, puis ordre. */
export function getSliderImages(property: Property): PropertyImage[] {
  return property.images.slice().sort((a, b) => {
    if (a.isMain !== b.isMain) return a.isMain ? -1 : 1;
    return a.order - b.order;
  });
}

/** Construit un fallback éditorial à partir des caractéristiques quand
 *  `property.title` est vide ou trop générique. */
export function buildFallbackTitle(property: Property): string {
  const rooms = property.characteristics?.rooms;
  const type = formatPropertyType(property.propertyType);
  if (rooms == null) return type;
  return `${type} ${rooms} pièce${rooms > 1 ? "s" : ""}`;
}

/** Titre prioritaire : `property.title` si saisi par l'agent, sinon fallback. */
export function getDisplayTitle(property: Property): string {
  const t = property.title?.trim();
  if (t && t.length > 0) return t;
  return buildFallbackTitle(property);
}

/** Eyebrow géographique : "PARIS 16e — AUTEUIL" (capitales, séparateur tiret cadratin). */
export function getGeoEyebrow(property: Property): string | null {
  const city = property.location?.city;
  if (!city) return null;
  const neighborhood = property.location?.neighborhood;
  if (neighborhood) return `${city} — ${neighborhood}`;
  return city;
}

/** Formatage du prix selon le type de transaction. */
export function getDisplayPrice(property: Property): string {
  const price = property.finance?.price;
  if (property.transactionType === "LOCATION") return formatRent(price);
  return formatPrice(price);
}

export interface MetaItem {
  /** Slug court (debug / clé React) */
  key: "surface" | "rooms" | "bedrooms" | "floor";
  /** Texte court : "85 m²", "4 pièces", "2 ch.", "3e ét." */
  label: string;
  /** Texte long pour aria-label : "85 mètres carrés", "4 pièces", ... */
  aria: string;
}

/** Items méta affichés avec leurs icônes lucide.
 *  L'étage n'apparaît que pour un appartement (ailleurs il n'est pas pertinent). */
export function getMetaItems(property: Property): MetaItem[] {
  const c = property.characteristics;
  if (!c) return [];
  const items: MetaItem[] = [];

  if (c.surface > 0) {
    items.push({
      key: "surface",
      label: formatSurface(c.surface),
      aria: `${c.surface} mètres carrés`,
    });
  }
  if (c.rooms > 0) {
    items.push({
      key: "rooms",
      label: `${c.rooms} pièce${c.rooms > 1 ? "s" : ""}`,
      aria: `${c.rooms} pièce${c.rooms > 1 ? "s" : ""}`,
    });
  }
  if (c.bedrooms > 0) {
    items.push({
      key: "bedrooms",
      label: `${c.bedrooms} ch.`,
      aria: `${c.bedrooms} chambre${c.bedrooms > 1 ? "s" : ""}`,
    });
  }
  if (property.propertyType === "APPARTEMENT" && c.floor != null) {
    const f = formatFloor(c.floor);
    if (f) {
      items.push({
        key: "floor",
        label: f.replace(" étage", " ét.").replace("RDC", "RDC"),
        aria: f,
      });
    }
  }
  return items;
}

/** aria-label complet et lisible pour le lien englobant.
 *  Ex. "Appartement 4 pièces, Paris 16e — Auteuil, 1 350 000 €" */
export function buildCardAriaLabel(property: Property): string {
  const parts: string[] = [getDisplayTitle(property)];
  const geo = getGeoEyebrow(property);
  if (geo) parts.push(geo);
  parts.push(getDisplayPrice(property));
  return parts.join(", ");
}

/** Indique si le bien est dans un état "non commercialisé" (vendu / loué / archivé). */
export function isSold(property: Property): boolean {
  return (
    property.status === "VENDU" ||
    property.status === "LOUE" ||
    property.status === "ARCHIVE"
  );
}
