import "server-only";
import { ApiError, apiFetch } from "./client";
import type { Property } from "./types";

export async function getProperties(): Promise<Property[]> {
  const { data } = await apiFetch<{ data: Property[] }>(
    "/properties?limit=50",
    { tags: ["properties"] },
  );
  return data;
}

export async function getProperty(reference: string): Promise<Property | null> {
  try {
    const { data } = await apiFetch<{ data: Property }>(
      `/properties/${encodeURIComponent(reference)}`,
      { revalidate: 600, tags: [`property:${reference}`] },
    );
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
