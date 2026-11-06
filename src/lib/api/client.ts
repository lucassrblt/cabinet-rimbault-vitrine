import "server-only";
import type { ApiErrorBody } from "./types";

// Client de l'API publique. Serveur uniquement : la clé ne part jamais au navigateur.
// Next 16 ne met plus `fetch` en cache par défaut : la durée est toujours explicite.

export class ApiConfigError extends Error {
  constructor(message = "PUBLIC_API_URL ou PUBLIC_API_KEY manquante") {
    super(message);
    this.name = "ApiConfigError";
  }
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    /** Corps JSON de la réponse d'erreur, s'il a pu être lu. */
    readonly body: ApiErrorBody | null = null,
    message = `API ${status}`,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Durées de revalidation (doc 04 §5), en secondes. */
export const REVALIDATE = {
  list: 300,
  detail: 600,
  archive: 3600,
} as const;

/** Délai maximal d'une requête vers l'API, en millisecondes. */
const TIMEOUT_MS = 10_000;

/**
 * `E2E_NO_CACHE=1` (posé par Playwright) désactive le cache de données Next :
 * un changement de scénario du mock est visible immédiatement.
 */
export function isCacheDisabled(): boolean {
  return process.env.E2E_NO_CACHE === "1";
}

function config(): { baseUrl: string; apiKey: string } {
  const baseUrl = process.env.PUBLIC_API_URL;
  const apiKey = process.env.PUBLIC_API_KEY;
  if (!baseUrl || !apiKey) throw new ApiConfigError();
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

async function readErrorBody(res: Response): Promise<ApiErrorBody | null> {
  try {
    const json: unknown = await res.json();
    return json && typeof json === "object" ? (json as ApiErrorBody) : null;
  } catch {
    return null;
  }
}

type FetchOptions = { revalidate?: number; tags?: string[] };

/** Lecture (GET). Lève `ApiConfigError` ou `ApiError(status, body)`. */
export async function apiFetch<T>(
  path: string,
  { revalidate = REVALIDATE.list, tags }: FetchOptions = {},
): Promise<T> {
  const { baseUrl, apiKey } = config();
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { "X-API-Key": apiKey, Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    ...(isCacheDisabled()
      ? { cache: "no-store" as const }
      : { next: { revalidate, tags } }),
  });
  if (!res.ok) {
    throw new ApiError(
      res.status,
      await readErrorBody(res),
      `API ${res.status} sur GET ${path}`,
    );
  }
  return res.json() as Promise<T>;
}

/**
 * Écriture (POST JSON), jamais mise en cache. Lève `ApiConfigError` ou
 * `ApiError(status, body)` ; `body.fields` porte les erreurs champ par champ.
 */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const { baseUrl, apiKey } = config();
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new ApiError(
      res.status,
      await readErrorBody(res),
      `API ${res.status} sur POST ${path}`,
    );
  }
  return res.json() as Promise<T>;
}
