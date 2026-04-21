import { type ApiFetchOptions, apiFetch } from "./client";
import type {
  ApiItemResponse,
  ApiListResponse,
  ListFilters,
  Property,
  SearchFilters,
} from "./types";

const LIST_TAG = "properties";
const propertyTag = (reference: string) => `property:${reference}`;

export async function listSaleProperties(
  filters: ListFilters = {},
  options: ApiFetchOptions = {},
): Promise<ApiListResponse<Property>> {
  return apiFetch<ApiListResponse<Property>>(
    "/properties/sale",
    filters as Record<string, string | number | undefined>,
    { tags: [LIST_TAG, "properties:sale"], ...options },
  );
}

export async function listRentProperties(
  filters: ListFilters = {},
  options: ApiFetchOptions = {},
): Promise<ApiListResponse<Property>> {
  return apiFetch<ApiListResponse<Property>>(
    "/properties/rent",
    filters as Record<string, string | number | undefined>,
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
    filters as Record<string, string | number | undefined>,
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
      { tags: [propertyTag(reference)], ...options },
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
