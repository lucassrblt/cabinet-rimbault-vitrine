import "server-only";
import { ApiError, apiFetch, REVALIDATE } from "./client";
import type {
  ArchivedPropertyStatus,
  Property,
  PropertyDetailResponse,
  PropertyListResponse,
} from "./types";

const ARCHIVE_STATUSES: readonly ArchivedPropertyStatus[] = ["VENDU", "LOUE"];

/** Tous les biens visibles (disponibles, sous offre, sous compromis). */
export async function getProperties(): Promise<Property[]> {
  const { data } = await apiFetch<PropertyListResponse>(
    "/properties?limit=100",
    { revalidate: REVALIDATE.list, tags: ["properties"] },
  );
  return data;
}

/** Fiche complète, ou `null` si la référence est inconnue (404). */
export async function getProperty(reference: string): Promise<Property | null> {
  try {
    const { data } = await apiFetch<PropertyDetailResponse>(
      `/properties/${encodeURIComponent(reference)}`,
      { revalidate: REVALIDATE.detail, tags: [`property:${reference}`] },
    );
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** Biens proches ; `[]` en cas d'erreur (section masquée). */
export async function getSimilarProperties(
  reference: string,
  limit = 3,
): Promise<Property[]> {
  try {
    const { data } = await apiFetch<PropertyListResponse>(
      `/properties/${encodeURIComponent(reference)}/similar?limit=${limit}`,
      { revalidate: REVALIDATE.detail, tags: [`property:${reference}`] },
    );
    return data;
  } catch {
    return [];
  }
}

/**
 * Archive « Récemment vendus et loués » (A14). `[]` en cas d'erreur : la
 * section est conditionnelle. Le statut est re-filtré ici par prudence
 * (le mock e2e ignore le paramètre `status`).
 */
export async function getArchivedProperties(limit = 12): Promise<Property[]> {
  try {
    const query = ARCHIVE_STATUSES.map((s) => `status=${s}`).join("&");
    const { data } = await apiFetch<PropertyListResponse>(
      `/properties?${query}&limit=${limit}`,
      { revalidate: REVALIDATE.archive, tags: ["properties:archive"] },
    );
    return data.filter((p) =>
      (ARCHIVE_STATUSES as readonly string[]).includes(p.status),
    );
  } catch {
    return [];
  }
}
