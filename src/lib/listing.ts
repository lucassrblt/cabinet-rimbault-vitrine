import type { Property } from "./api/types";
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
}

export const PER_PAGE = 12;

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
  };
}

function num(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function filterProperties(
  all: Property[],
  query: ListingQuery,
): Property[] {
  const commune = query.commune
    ? COMMUNES.find((c) => c.slug === query.commune)
    : null;
  const pieces = num(query.pieces);
  const budgetMin = num(query.budgetMin);
  const budgetMax = num(query.budgetMax);
  const surfaceMin = num(query.surfaceMin);
  const surfaceMax = num(query.surfaceMax);

  return all.filter((p) => {
    if (query.type && p.propertyType !== query.type) return false;
    if (commune) {
      const city = p.location?.city?.toLowerCase() ?? "";
      const pc = p.location?.postalCode ?? "";
      if (city !== commune.name.toLowerCase() && pc !== commune.postalCode)
        return false;
    }
    if (pieces != null && (p.characteristics?.rooms ?? 0) < pieces)
      return false;
    const price = p.finance?.price ?? 0;
    if (budgetMin != null && price < budgetMin) return false;
    if (budgetMax != null && price > budgetMax) return false;
    const surface = p.characteristics?.surface ?? 0;
    if (surfaceMin != null && surface < surfaceMin) return false;
    if (surfaceMax != null && surface > surfaceMax) return false;
    if (query.dpe && p.energy?.energyClass !== query.dpe) return false;
    return true;
  });
}

export function sortProperties(
  list: Property[],
  sort: string | undefined,
): Property[] {
  const out = [...list];
  switch (sort) {
    case "price_asc":
    case "rent_asc":
      out.sort((a, b) => (a.finance?.price ?? 0) - (b.finance?.price ?? 0));
      break;
    case "price_desc":
    case "rent_desc":
      out.sort((a, b) => (b.finance?.price ?? 0) - (a.finance?.price ?? 0));
      break;
    case "surface_asc":
      out.sort(
        (a, b) =>
          (a.characteristics?.surface ?? 0) - (b.characteristics?.surface ?? 0),
      );
      break;
    case "surface_desc":
      out.sort(
        (a, b) =>
          (b.characteristics?.surface ?? 0) - (a.characteristics?.surface ?? 0),
      );
      break;
    default:
      out.sort((a, b) => {
        const da = new Date(a.publishedAt ?? a.createdAt).getTime();
        const db = new Date(b.publishedAt ?? b.createdAt).getTime();
        return db - da;
      });
  }
  return out;
}

export function paginate<T>(items: T[], page: number, perPage = PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: current,
    totalPages,
    total: items.length,
  };
}

export function findSimilar(
  source: Property,
  pool: Property[],
  limit = 3,
): Property[] {
  const sameTx = pool.filter(
    (p) =>
      p.reference !== source.reference &&
      p.transactionType === source.transactionType,
  );
  const scored = sameTx.map((p) => {
    let score = 0;
    if (p.location?.city && p.location.city === source.location?.city)
      score += 3;
    if (p.propertyType === source.propertyType) score += 2;
    const a = p.finance?.price ?? 0;
    const b = source.finance?.price ?? 0;
    if (a && b) {
      const diff = Math.abs(a - b) / b;
      if (diff < 0.2) score += 1;
    }
    return { p, score };
  });
  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, limit).map((x) => x.p);
}
