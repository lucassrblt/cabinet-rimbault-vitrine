import "server-only";

export type QueryValue =
  | string
  | number
  | boolean
  | undefined
  | Array<string | number>;

export interface ApiFetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

function getConfig(): { baseUrl: string; apiKey: string } {
  const baseUrl = process.env.PUBLIC_API_URL;
  const apiKey = process.env.PUBLIC_API_KEY;
  if (!baseUrl) {
    throw new ApiConfigError("PUBLIC_API_URL is not defined");
  }
  if (!apiKey) {
    throw new ApiConfigError("PUBLIC_API_KEY is not defined");
  }
  return { baseUrl, apiKey };
}

function appendQuery(url: URL, query: Record<string, QueryValue>) {
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        if (v === undefined || v === "") continue;
        url.searchParams.append(key, String(v));
      }
    } else {
      url.searchParams.set(key, String(value));
    }
  }
}

export async function apiFetch<T>(
  path: string,
  query?: Record<string, QueryValue>,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { baseUrl, apiKey } = getConfig();
  const url = new URL(`${baseUrl}${path}`);
  if (query) appendQuery(url, query);

  const { revalidate = 300, tags } = options;

  const res = await fetch(url, {
    headers: {
      "X-API-Key": apiKey,
      Accept: "application/json",
    },
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags,
    },
    signal: AbortSignal.timeout(5000),
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

export interface ApiPostResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
  code?: string;
  fields?: Record<string, string>;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<ApiPostResult<T>> {
  const { baseUrl, apiKey } = getConfig();
  const url = new URL(`${baseUrl}${path}`);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: null,
      error:
        err instanceof Error
          ? err.message
          : "Erreur réseau — impossible de joindre le serveur.",
    };
  }

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    // ignore parse error — body may be empty on some errors
  }

  const payload = (json ?? {}) as {
    success?: boolean;
    data?: T;
    error?: string;
    code?: string;
    fields?: Record<string, string>;
  };

  if (!res.ok || payload.success === false) {
    return {
      ok: false,
      status: res.status,
      data: payload.data ?? null,
      error: payload.error ?? `Erreur ${res.status}`,
      code: payload.code,
      fields: payload.fields,
    };
  }

  return {
    ok: true,
    status: res.status,
    data: payload.data ?? null,
    error: null,
  };
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
