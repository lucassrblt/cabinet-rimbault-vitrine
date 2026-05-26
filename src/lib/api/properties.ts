import { type ApiFetchOptions, apiFetch, type QueryValue } from "./client";
import type {
  ApiItemResponse,
  ApiListResponse,
  ListFilters,
  Property,
  SearchFilters,
} from "./types";

const LIST_TAG = "properties";
const propertyTag = (reference: string) => `property:${reference}`;

type QueryRecord = Record<string, QueryValue>;

export async function listSaleProperties(
  filters: ListFilters = {},
  options: ApiFetchOptions = {},
): Promise<ApiListResponse<Property>> {
  return apiFetch<ApiListResponse<Property>>(
    "/properties/sale",
    filters as QueryRecord,
    { tags: [LIST_TAG, "properties:sale"], ...options },
  );
}

export async function listRentProperties(
  filters: ListFilters = {},
  options: ApiFetchOptions = {},
): Promise<ApiListResponse<Property>> {
  return apiFetch<ApiListResponse<Property>>(
    "/properties/rent",
    filters as QueryRecord,
    { tags: [LIST_TAG, "properties:rent"], ...options },
  );
}

export async function listRecentProperties(
  limit?: number,
  options: ApiFetchOptions = {},
): Promise<ApiListResponse<Property>> {
  return apiFetch<ApiListResponse<Property>>(
    "/properties/recent",
    limit ? { limit } : undefined,
    { tags: [LIST_TAG, "properties:recent"], ...options },
  );
}

export async function searchProperties(
  filters: SearchFilters = {},
  options: ApiFetchOptions = {},
): Promise<ApiListResponse<Property>> {
  return apiFetch<ApiListResponse<Property>>(
    "/properties",
    filters as QueryRecord,
    { tags: [LIST_TAG], ...options },
  );
}

export async function getPropertyByReference(
  reference: string,
  options: ApiFetchOptions = {},
): Promise<Property | null> {
  try {
    const response = await apiFetch<ApiItemResponse<Property>>(
      `/properties/${encodeURIComponent(reference)}`,
      undefined,
      { revalidate: 600, tags: [propertyTag(reference)], ...options },
    );
    return response.data;
  } catch (error) {
    if (
      error instanceof Error &&
      "status" in error &&
      (error as { status: number }).status === 404
    ) {
      return null;
    }
    throw error;
  }
}

export async function getSimilarProperties(
  reference: string,
  limit = 3,
  options: ApiFetchOptions = {},
): Promise<Property[]> {
  try {
    const res = await apiFetch<ApiListResponse<Property>>(
      `/properties/${encodeURIComponent(reference)}/similar`,
      limit ? { limit } : undefined,
      { revalidate: 600, tags: [propertyTag(reference), LIST_TAG], ...options },
    );
    return res.data ?? [];
  } catch (error) {
    if (
      error instanceof Error &&
      "status" in error &&
      (error as { status: number }).status === 404
    ) {
      return [];
    }
    throw error;
  }
}
