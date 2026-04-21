import "server-only";

export interface ApiFetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

function getConfig(): { baseUrl: string; apiKey: string } {
  const baseUrl = process.env.ADMIN_API_URL;
  const apiKey = process.env.PUBLIC_API_KEY;
  if (!baseUrl) {
    throw new ApiConfigError("ADMIN_API_URL is not defined");
  }
  if (!apiKey) {
    throw new ApiConfigError("PUBLIC_API_KEY is not defined");
  }
  return { baseUrl, apiKey };
}

export async function apiFetch<T>(
  path: string,
  query?: Record<string, string | number | undefined>,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { baseUrl, apiKey } = getConfig();
  const url = new URL(`${baseUrl}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const { revalidate = 60, tags } = options;

  const res = await fetch(url, {
    headers: {
      "X-API-Key": apiKey,
      Accept: "application/json",
    },
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags,
    },
  });

  if (!res.ok) {
    throw new ApiError(
      `API request failed: ${res.status} ${res.statusText}`,
      res.status,
      path,
    );
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiConfigError";
  }
}
