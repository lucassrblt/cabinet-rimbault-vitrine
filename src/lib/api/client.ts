import "server-only";

export class ApiConfigError extends Error {}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type FetchOptions = { revalidate?: number; tags?: string[] };

export async function apiFetch<T>(
  path: string,
  { revalidate = 300, tags }: FetchOptions = {},
): Promise<T> {
  const baseUrl = process.env.PUBLIC_API_URL;
  const apiKey = process.env.PUBLIC_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new ApiConfigError("PUBLIC_API_URL ou PUBLIC_API_KEY manquante");
  }

  const res = await fetch(`${baseUrl}${path}`, {
    headers: { "X-API-Key": apiKey },
    next: { revalidate, tags },
  });
  if (!res.ok) {
    throw new ApiError(res.status, `API ${res.status} sur ${path}`);
  }
  return res.json() as Promise<T>;
}
