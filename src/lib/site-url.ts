// URL publique du site et interrupteur d'indexation : SEULE source pour
// `metadataBase`, les canoniques, Open Graph, JSON-LD, `robots.txt` et le plan
// du site. Aucun import : `next.config.ts` et `scripts/check-launch.ts` (Node
// seul, sans alias) l'importent aussi.
//
// URL (premier trouvé) :
//   1. `NEXT_PUBLIC_SITE_URL` (https, sauf hôte local) ;
//   2. sur Netlify : `URL` en production (`CONTEXT=production`), sinon
//      `DEPLOY_PRIME_URL` (deploy preview, branch deploy) ;
//   3. `http://localhost:${PORT ?? 3000}`, en développement et en test SEULEMENT.
// Sinon (build de production sans URL) : erreur, le build échoue au lieu de
// publier des canoniques en `localhost`.
//
// `NEXT_PUBLIC_*` est figée au build (Next la remplace dans le code). Les
// variables Netlify le sont aussi, sous les clés `SITE_NETLIFY_*` posées par
// `next.config.ts` (`netlifyBuildEnv`) : les pages rendues à la demande par la
// fonction Netlify ne dépendent donc pas de l'environnement d'exécution.

export type SiteEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_ALLOW_INDEXING?: string;
  NETLIFY?: string;
  CONTEXT?: string;
  URL?: string;
  DEPLOY_PRIME_URL?: string;
  NODE_ENV?: string;
  PORT?: string;
  MAINTENANCE_MODE?: string;
};

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export function isLocalHost(hostname: string): boolean {
  return LOCAL_HOSTS.has(hostname) || hostname.endsWith(".localhost");
}

/** URL absolue, en https hors hôte local ; sinon erreur qui nomme la variable. */
function parseSiteUrl(raw: string, source: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`${source} n’est pas une URL valide : « ${raw} ».`);
  }
  const local = isLocalHost(url.hostname);
  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
    throw new Error(
      `${source} doit être en https (hôte local excepté) : « ${raw} ».`,
    );
  }
  // Origine seule : le site est servi à la racine.
  return new URL(url.origin);
}

const clean = (value: string | undefined) => value?.trim() || undefined;

export const MISSING_SITE_URL_MESSAGE =
  "URL publique du site introuvable : poser NEXT_PUBLIC_SITE_URL (ex. https://cabinet-rimbault.fr) " +
  "avant le build de production, ou builder sur Netlify (URL / DEPLOY_PRIME_URL). " +
  "En local : NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run build. " +
  "Aucun repli sur localhost hors développement (voir docs/galerie/DEPLOIEMENT.md).";

/** Résout l'URL publique à partir d'un environnement (pur, testable). */
export function resolveSiteUrl(env: SiteEnv): URL {
  const explicit = clean(env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return parseSiteUrl(explicit, "NEXT_PUBLIC_SITE_URL");

  if (env.NETLIFY === "true") {
    const production = env.CONTEXT === "production";
    const name = production ? "URL" : "DEPLOY_PRIME_URL";
    const raw = clean(production ? env.URL : env.DEPLOY_PRIME_URL);
    if (raw) return parseSiteUrl(raw, `${name} (Netlify, ${env.CONTEXT})`);
  }

  if (env.NODE_ENV === "development" || env.NODE_ENV === "test") {
    return new URL(`http://localhost:${clean(env.PORT) ?? "3000"}`);
  }

  throw new Error(MISSING_SITE_URL_MESSAGE);
}

/**
 * Indexable = `NEXT_PUBLIC_ALLOW_INDEXING=true` (production seulement), porte
 * de maintenance levée (`MAINTENANCE_MODE` ≠ `on`, `src/proxy.ts`), et, sur
 * Netlify, contexte `production` : les deploy previews restent en noindex.
 */
export function resolveIndexable(env: SiteEnv): boolean {
  return (
    env.NEXT_PUBLIC_ALLOW_INDEXING === "true" &&
    env.MAINTENANCE_MODE !== "on" &&
    (env.NETLIFY !== "true" || env.CONTEXT === "production")
  );
}

/**
 * Variables Netlify du build, recopiées sous des clés propres (`env` de
 * `next.config.ts`) pour être figées dans le code compilé.
 */
export function netlifyBuildEnv(
  env: Record<string, string | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  const keys = [
    ["SITE_NETLIFY", "NETLIFY"],
    ["SITE_NETLIFY_CONTEXT", "CONTEXT"],
    ["SITE_NETLIFY_URL", "URL"],
    ["SITE_NETLIFY_DEPLOY_PRIME_URL", "DEPLOY_PRIME_URL"],
  ] as const;
  if (env.NETLIFY !== "true") return out;
  for (const [to, from] of keys) {
    const value = env[from];
    if (value !== undefined) out[to] = value;
  }
  return out;
}

/**
 * Environnement courant. Chaque `process.env.X` est écrit en toutes lettres :
 * c'est la forme que Next remplace au build (`NEXT_PUBLIC_*`, `env` du config).
 */
function currentEnv(): SiteEnv {
  return {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_ALLOW_INDEXING: process.env.NEXT_PUBLIC_ALLOW_INDEXING,
    NETLIFY: process.env.SITE_NETLIFY ?? process.env.NETLIFY,
    CONTEXT: process.env.SITE_NETLIFY_CONTEXT ?? process.env.CONTEXT,
    URL: process.env.SITE_NETLIFY_URL ?? process.env.URL,
    DEPLOY_PRIME_URL:
      process.env.SITE_NETLIFY_DEPLOY_PRIME_URL ?? process.env.DEPLOY_PRIME_URL,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
  };
}

/** URL publique du site (origine, sans chemin). */
export function getSiteUrl(): URL {
  return resolveSiteUrl(currentEnv());
}

/** Le site peut-il être indexé (balises `robots`, `robots.txt`, plan du site) ? */
export function isIndexable(): boolean {
  return resolveIndexable(currentEnv());
}

/** URL absolue d'un chemin du site (« /biens/10129 »). */
export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
