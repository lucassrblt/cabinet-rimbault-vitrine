import type {
  EnergyClass,
  PropertyType,
  SearchFilters,
  SortBy,
  TransactionType,
} from "./api/types";
import { COMMUNES } from "./config/communes";

export interface ListingQuery {
  type?: string;
  commune?: string;
  pieces?: string;
  budgetMin?: string;
  budgetMax?: string;
  surfaceMin?: string;
  surfaceMax?: string;
  sort?: string;
  page?: string;
  meuble?: string;
  dpe?: string;
  balcon?: string;
  terrasse?: string;
  jardin?: string;
  cave?: string;
  parking?: string;
  garage?: string;
  ascenseur?: string;
  hideFG?: string;
}

export const PER_PAGE = 12;

/** true si au moins un filtre utilisateur est actif (tri et page exclus) —
 *  permet de distinguer « portefeuille vide » de « filtres trop restrictifs ». */
export function hasActiveFilters(query: ListingQuery): boolean {
  const { sort: _sort, page: _page, ...filters } = query;
  return Object.values(filters).some((v) => v != null && v !== "");
}

export function parseQuery(
  sp: Record<string, string | string[] | undefined>,
): ListingQuery {
  const get = (k: string): string | undefined => {
    const v = sp[k];
    if (Array.isArray(v)) return v[0];
    return v;
  };
  return {
    type: get("type"),
    commune: get("commune"),
    pieces: get("pieces"),
    budgetMin: get("budgetMin") ?? get("prix_min"),
    budgetMax: get("budgetMax") ?? get("prix_max"),
    surfaceMin: get("surfaceMin"),
    surfaceMax: get("surfaceMax"),
    sort: get("sort"),
    page: get("page"),
    meuble: get("meuble"),
    dpe: get("dpe"),
    balcon: get("balcon"),
    terrasse: get("terrasse"),
    jardin: get("jardin"),
    cave: get("cave"),
    parking: get("parking"),
    garage: get("garage"),
    ascenseur: get("ascenseur"),
    hideFG: get("hideFG"),
  };
}

function num(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function bool(v: string | undefined): boolean | undefined {
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return undefined;
}

const ENERGY_CLASSES: readonly EnergyClass[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "VIERGE",
];

const DPE_ORDER: readonly EnergyClass[] = ["A", "B", "C", "D", "E", "F", "G"];

function dpeMaxRange(letter: string): EnergyClass[] | undefined {
  const idx = DPE_ORDER.indexOf(letter as EnergyClass);
  if (idx < 0) return undefined;
  return DPE_ORDER.slice(0, idx + 1) as EnergyClass[];
}

const SORT_VALUES: readonly SortBy[] = [
  "date",
  "price_asc",
  "price_desc",
  "rent_asc",
  "rent_desc",
  "surface_asc",
  "surface_desc",
];

export function mapSort(value: string | undefined): SortBy | undefined {
  if (!value) return undefined;
  return SORT_VALUES.find((s) => s === value);
}

export function pageFromQuery(query: ListingQuery): number {
  const n = Number(query.page ?? "1");
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

export function queryToSearchFilters(
  query: ListingQuery,
  transactionType: TransactionType,
  page: number,
): SearchFilters {
  const commune = query.commune
    ? COMMUNES.find((c) => c.slug === query.commune)
    : null;

  const dpeRaw = query.dpe;
  let dpe: EnergyClass[] | undefined;
  if (dpeRaw) {
    const range = dpeMaxRange(dpeRaw);
    if (range) {
      dpe = range;
    } else if (ENERGY_CLASSES.includes(dpeRaw as EnergyClass)) {
      dpe = [dpeRaw as EnergyClass];
    }
  }

  // Pour Paris (intra-muros) on filtre par "city contains Paris" sans CP fixe.
  // L'API matche tous les arrondissements (75001-75020 + libellés "Paris 16e", etc.).
  const communeCityFilter = commune
    ? commune.slug === "paris"
      ? "Paris"
      : commune.name
    : undefined;

  const filters: SearchFilters = {
    transactionType,
    propertyType: (query.type as PropertyType) || undefined,
    postalCode: commune?.postalCode,
    city: communeCityFilter,
    minPrice: num(query.budgetMin),
    maxPrice: num(query.budgetMax),
    minSurface: num(query.surfaceMin),
    maxSurface: num(query.surfaceMax),
    minRooms: num(query.pieces),
    dpe,
    hideEnergyFG: bool(query.hideFG),
    hasBalcony: bool(query.balcon),
    hasTerrace: bool(query.terrasse),
    hasGarden: bool(query.jardin),
    isFurnished: bool(query.meuble),
    sortBy: mapSort(query.sort),
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
  };

  return filters;
}

export function paginateServerSide(
  total: number,
  page: number,
  perPage = PER_PAGE,
) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  return { page: current, totalPages, total };
}
