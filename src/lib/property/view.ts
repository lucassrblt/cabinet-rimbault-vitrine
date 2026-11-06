// Property (API) → PropertyView (prêt à afficher). Les composants ne lisent
// jamais les champs bruts (doc 04 §5 et §7, interface figée). Pur, testé.
//
// Jamais lus ici : `location.address` (adresse exacte), ids internes,
// compteurs. Le titre saisi par l'agent n'est jamais le titre affiché : le
// titre est composé depuis les données (brief §3.2, A33).

import type { Property, PropertyStatus, PropertyType } from "@/lib/api/types";
import { descriptionParagraphs } from "./description";
import {
  type EnergyCosts,
  type EnergyLabel,
  energyCosts,
  energyLabels,
} from "./energy";
import { priceInfo, type Transaction } from "./fees";
import {
  formatEuros,
  formatSurface,
  isPositive,
  ordinal,
  plural,
} from "./format";
import { STATUS_LABELS, TYPE_LABELS, TYPES_WITH_ROOMS } from "./labels";
import { normalizeCapitals, normalizePlace } from "./text";

export type Fact = { label: string; value: string };
export type PropertyImageView = { url: string; alt: string };

export type PropertyView = {
  reference: string;
  /** « /biens/10.131 ». */
  href: string;
  /** Titre affiché (A33, forme « affiche ») : « Appartement 3 pièces, 59,5 m² ». */
  title: string;
  /** Titre de l'agent en casse normale, s'il apporte une information. */
  subtitle: string | null;
  /** Début du titre composé, sans la surface : « Appartement 3 pièces ». */
  head: string;
  /** Surface formatée, ou `null`. */
  surfaceLabel: string | null;
  /**
   * « Asnières-sur-Seine, Impressionnistes ». Sans ville : le quartier seul,
   * ou une chaîne vide (aucune ville n'est jamais supposée).
   */
  place: string;
  /** Ville saisie, normalisée ; `null` si absente (jamais de repli inventé). */
  city: string | null;
  postalCode: string;
  neighborhood: string | null;
  transaction: Transaction;
  status: PropertyStatus;
  /** « Sous offre », « Sous compromis », « Vendu », « Loué » ; `null` si disponible. */
  statusLabel: string | null;
  isExclusive: boolean;
  /** « 375 000 € » ; « 1 250 € par mois charges comprises ». Vide sans prix. */
  priceLabel: string;
  /** Montant seul (« 1 250 € ») et suite (« par mois charges comprises »), pour la fiche. */
  priceAmount: string;
  priceSuffix: string | null;
  feeLines: string[];
  /** L'essentiel : seulement les valeurs connues. */
  facts: Fact[];
  /** Triées par `order`, alt composé. */
  images: PropertyImageView[];
  paragraphs: string[];
  energy: { dpe: EnergyLabel; ges: EnergyLabel; costs: EnergyCosts };
  /** Copropriété et taxe foncière (lignes de données). */
  copro: Fact[];
  // Données pour le JSON-LD et les métadonnées.
  propertyType: PropertyType;
  price: number | null;
  surface: number | null;
  rooms: number | null;
  createdAt: string;
};

/** Transaction affichée : le viager se lit comme une vente, le saisonnier comme une location. */
export function transactionOf(
  p: Pick<Property, "transactionType">,
): Transaction {
  return p.transactionType === "LOCATION" ||
    p.transactionType === "LOCATION_SAISONNIERE"
    ? "LOCATION"
    : "VENTE";
}

function headOf(p: Property): string {
  const type = TYPE_LABELS[p.propertyType] ?? "Bien";
  const rooms = p.characteristics?.rooms;
  if (!TYPES_WITH_ROOMS.has(p.propertyType) || !isPositive(rooms)) return type;
  if (p.propertyType === "APPARTEMENT" && rooms === 1) return "Studio";
  return `${type} ${rooms} ${plural(rooms, "pièce")}`;
}

function surfaceOf(p: Property): number | null {
  const c = p.characteristics;
  if (!c) return null;
  if (p.propertyType === "TERRAIN") {
    return isPositive(c.surfaceTerrain) ? c.surfaceTerrain : null;
  }
  return isPositive(c.surface) ? c.surface : null;
}

/**
 * Titre composé (A33). « affiche » : `h1` de la fiche et carte, à virgule
 * (« Appartement 3 pièces, 59,5 m² ») ; « phrase » : `<title>` et alt des
 * photos, avec « de » (« Appartement 3 pièces de 59,5 m² »).
 */
export function composeTitle(
  view: Pick<PropertyView, "head" | "surfaceLabel">,
  form: "affiche" | "phrase",
): string {
  if (!view.surfaceLabel) return view.head;
  return form === "affiche"
    ? `${view.head}, ${view.surfaceLabel}`
    : `${view.head} de ${view.surfaceLabel}`;
}

/**
 * Titre saisi (« 3 PIÈCES + 1 TERRASSE + 1 PARKING + 1 CAVE ») → sous-titre
 * en casse normale (« 3 pièces, terrasse, parking et cave »). `null` s'il ne
 * dit rien de plus que le titre composé (une seule partie).
 */
export function subtitleFromRaw(raw: string | null | undefined): string | null {
  const parts = (raw ?? "")
    .split("+")
    .map((s) => normalizeCapitals(s.replace(/\s+/g, " ").trim()))
    .filter(Boolean)
    .map((s, i) => (i > 0 ? s.replace(/^1\s+/, "") : s))
    .map((s) => s.replace(/(\d)\s+/g, "$1 "));
  if (parts.length < 2) return null;
  const last = parts.pop();
  const text = `${parts.join(", ")} et ${last}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function floorFact(p: Property): Fact | null {
  const c = p.characteristics;
  if (!c) return null;
  if (c.floorIsRezDeChaussee)
    return { label: "Étage", value: "Rez-de-chaussée" };
  if (typeof c.floor !== "number" || c.floor < 0) return null;
  if (c.floor === 0) return { label: "Étage", value: "Rez-de-chaussée" };
  const total =
    isPositive(c.totalFloors) && c.totalFloors >= c.floor
      ? ` sur ${c.totalFloors}`
      : "";
  return { label: "Étage", value: `${ordinal(c.floor)}${total}` };
}

function listFr(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function factsOf(p: Property, transaction: Transaction): Fact[] {
  const c = p.characteristics;
  const a = p.amenities;
  const facts: Fact[] = [];
  const count = (n: number | null | undefined, one: string, many: string) => {
    if (isPositive(n))
      facts.push({ label: n > 1 ? many : one, value: String(n) });
  };

  if (c && isPositive(c.surface) && p.propertyType !== "TERRAIN") {
    facts.push({ label: "Surface habitable", value: formatSurface(c.surface) });
  }
  if (c && isPositive(c.surfaceCarrez)) {
    facts.push({
      label: "Surface loi Carrez",
      value: formatSurface(c.surfaceCarrez),
    });
  }
  if (c && isPositive(c.surfaceTerrain)) {
    facts.push({ label: "Terrain", value: formatSurface(c.surfaceTerrain) });
  }
  if (c && TYPES_WITH_ROOMS.has(p.propertyType)) {
    count(c.rooms, "Pièce", "Pièces");
    count(c.bedrooms, "Chambre", "Chambres");
    count(c.bathrooms, "Salle de bains", "Salles de bains");
    count(c.showerRooms, "Salle d’eau", "Salles d’eau");
    count(
      c.levelsCount && c.levelsCount > 1 ? c.levelsCount : null,
      "Niveau",
      "Niveaux",
    );
  }
  const floor = floorFact(p);
  if (floor) facts.push(floor);
  if (a?.hasElevator) facts.push({ label: "Ascenseur", value: "Oui" });

  const outside = [
    a?.hasBalcony ? "balcon" : null,
    a?.hasTerrace ? "terrasse" : null,
    a?.hasGarden ? "jardin" : null,
  ].filter((x): x is string => x !== null);
  if (outside.length) {
    facts.push({ label: "Extérieur", value: capitalize(listFr(outside)) });
  }
  const parking = [
    a?.hasParking ? "place de parking" : null,
    a?.hasGarage ? "garage" : null,
  ].filter((x): x is string => x !== null);
  if (parking.length) {
    facts.push({ label: "Stationnement", value: capitalize(listFr(parking)) });
  }
  if (a?.hasCellar) facts.push({ label: "Cave", value: "Oui" });
  if (transaction === "LOCATION" && a?.isFurnished) {
    facts.push({ label: "Meublé", value: "Oui" });
  }
  if (c && isPositive(c.yearBuilt) && c.yearBuilt > 1000) {
    facts.push({ label: "Année de construction", value: String(c.yearBuilt) });
  }
  return facts;
}

function coproOf(p: Property): Fact[] {
  const copro = p.copro;
  const facts: Fact[] = [];
  if (copro?.isInCopro === true) {
    facts.push({
      label: "Bien soumis au statut de la copropriété",
      value: "Oui",
    });
    if (isPositive(copro.coprLots)) {
      facts.push({ label: "Nombre de lots", value: String(copro.coprLots) });
    }
    if (isPositive(copro.coprCharges)) {
      facts.push({
        label: "Charges annuelles moyennes",
        value: formatEuros(copro.coprCharges),
      });
    }
    if (typeof copro.coprProcedure === "boolean") {
      facts.push({
        label: "Procédure en cours sur la copropriété",
        value: copro.coprProcedure ? "Oui" : "Aucune",
      });
    }
  } else if (copro?.isInCopro === false) {
    facts.push({
      label: "Bien soumis au statut de la copropriété",
      value: "Non",
    });
  }
  if (isPositive(p.finance?.taxeFonciere)) {
    facts.push({
      label: "Taxe foncière",
      value: formatEuros(p.finance.taxeFonciere),
    });
  }
  return facts;
}

/**
 * Photos triées par `order`, alt composé (« … de 59,5 m² à Asnières-sur-Seine,
 * photo 2 sur 4 ») ; sans ville, le segment « à … » disparaît.
 */
function imagesOf(
  p: Property,
  phrase: string,
  city: string | null,
): PropertyImageView[] {
  const images = [...(p.images ?? [])]
    .filter((img) => typeof img.url === "string" && img.url.length > 0)
    .sort((a, b) => a.order - b.order);
  const total = images.length;
  return images.map((img, index) => ({
    url: img.url,
    alt: `${withCity(phrase, city)}, photo ${index + 1} sur ${total}`,
  }));
}

export function toPropertyView(p: Property): PropertyView {
  const transaction = transactionOf(p);
  const surface = surfaceOf(p);
  const head = headOf(p);
  const surfaceLabel = surface ? formatSurface(surface) : null;
  const parts = { head, surfaceLabel };
  const city = normalizePlace(p.location?.city);
  const neighborhood = normalizePlace(p.location?.neighborhood);
  const place = [city, neighborhood !== city ? neighborhood : null]
    .filter((x): x is string => Boolean(x))
    .join(", ");
  const { priceLabel, amount, suffix, feeLines } = priceInfo(
    transaction,
    p.finance,
  );
  const phrase = composeTitle(parts, "phrase");

  return {
    reference: p.reference,
    href: `/biens/${encodeURIComponent(p.reference)}`,
    title: composeTitle(parts, "affiche"),
    subtitle: subtitleFromRaw(p.title),
    head,
    surfaceLabel,
    place,
    city,
    postalCode: p.location?.postalCode ?? "",
    neighborhood,
    transaction,
    status: p.status,
    statusLabel: STATUS_LABELS[p.status] ?? null,
    isExclusive: p.isExclusive === true,
    priceLabel: priceLabel ?? "",
    priceAmount: amount ?? "",
    priceSuffix: suffix,
    feeLines,
    facts: factsOf(p, transaction),
    images: imagesOf(p, phrase, city),
    paragraphs: descriptionParagraphs(p.description, p.title),
    energy: { ...energyLabels(p.energy), costs: energyCosts(p.energy) },
    copro: coproOf(p),
    propertyType: p.propertyType,
    price: isPositive(p.finance?.price) ? p.finance.price : null,
    surface,
    rooms: isPositive(p.characteristics?.rooms)
      ? p.characteristics.rooms
      : null,
    createdAt: p.createdAt,
  };
}

/** « … de 59,5 m² à Asnières-sur-Seine » ; la phrase seule sans ville. */
export function withCity(phrase: string, city: string | null): string {
  return city ? `${phrase} à ${city}` : phrase;
}

/** `<title>` de la fiche : « Appartement 3 pièces de 59,5 m² à Asnières-sur-Seine, 375 000 € ». */
export function pageTitle(view: PropertyView): string {
  const base = withCity(composeTitle(view, "phrase"), view.city);
  if (view.price === null) return base;
  const price =
    view.transaction === "LOCATION"
      ? `${formatEuros(view.price)} par mois`
      : formatEuros(view.price);
  return `${base}, ${price}`;
}

/** Ordre de la liste (brief §9) : disponibles d'abord, du plus récent au plus ancien. */
export function sortForListing<
  T extends Pick<PropertyView, "status" | "createdAt">,
>(items: readonly T[]): T[] {
  const rank = (s: PropertyStatus) => (s === "DISPONIBLE" ? 0 : 1);
  return [...items].sort(
    (a, b) =>
      rank(a.status) - rank(b.status) || b.createdAt.localeCompare(a.createdAt),
  );
}

/** « Réf. 10.130 » : l'abréviation reste liée au numéro. */
export function referenceLabel(reference: string): string {
  return `Réf. ${reference}`;
}
