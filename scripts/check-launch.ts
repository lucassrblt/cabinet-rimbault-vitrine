// Contrôle « prêt pour la mise en ligne » (doc 04 §6, brief §9 et §10).
//
//   npm run check:launch            rapport, sortie 0 hors production
//   SITE_ENV=production npm run build   lancé par `prebuild` : échoue (code 1)
//                                       si une information bloquante manque
//   node scripts/check-launch.ts --strict   échoue même hors production
//
// Exécuté directement par Node (suppression des types native) : aucun import
// d'alias `@/` ici, `src/lib/agency.ts`, `src/lib/site-url.ts`,
// `src/content/legal.ts` et `src/content/honoraires.ts` n'importent rien.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

type Check = { label: string; ok: boolean; blocking: boolean; hint?: string };

const root = fileURLToPath(new URL("..", import.meta.url));

// Mêmes fichiers d'environnement que Next (les variables déjà posées priment).
for (const name of [
  ".env.production.local",
  ".env.local",
  ".env.production",
  ".env",
]) {
  const path = join(root, name);
  if (existsSync(path)) process.loadEnvFile(path);
}

const strict =
  process.argv.includes("--strict") || process.env.SITE_ENV === "production";

/** Marqueurs qui ne doivent jamais partir en production. */
const PLACEHOLDER_RE = /\[À (?:FOURNIR|CONFIRMER)[^\]]*\]|\bTODO\b|\blorem\b/i;

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

async function main(): Promise<void> {
  const agencyPath = pathToFileURL(join(root, "src/lib/agency.ts")).href;
  const { agency } = (await import(agencyPath)) as {
    agency: {
      email: string | null;
      hoursConfirmed: boolean;
      sector: readonly string[] | null;
      google: { profileUrl: string | null };
      legal: {
        mediator: { name: string; address: string; url: string } | null;
        publicationDirector: string | null;
        guarantorAddress: string | null;
      };
    };
  };

  const legalPath = pathToFileURL(join(root, "src/content/legal.ts")).href;
  const { siteHost, dataRetention } = (await import(legalPath)) as {
    siteHost: { name: string; address: string; url: string } | null;
    dataRetention: string | null;
  };

  const checks: Check[] = [];
  const add = (label: string, ok: boolean, blocking: boolean, hint?: string) =>
    checks.push({ label, ok, blocking, hint });

  // --- Bloquant (brief §10, en gras) -----------------------------------------
  const mediator = agency.legal.mediator;
  add(
    "Médiateur de la consommation (nom, adresse, site)",
    Boolean(mediator?.name && mediator.address && mediator.url),
    true,
    "src/lib/agency.ts › legal.mediator",
  );

  add(
    "E-mail public du cabinet",
    Boolean(agency.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agency.email)),
    true,
    "src/lib/agency.ts › email",
  );

  // Même règle que le site (`src/lib/site-url.ts`), mais l'URL doit être
  // posée explicitement : le domaine public, pas une URL de repli Netlify.
  const sitePath = pathToFileURL(join(root, "src/lib/site-url.ts")).href;
  const { isLocalHost } = (await import(sitePath)) as {
    isLocalHost: (hostname: string) => boolean;
  };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  let siteUrlOk = false;
  try {
    const u = new URL(siteUrl);
    siteUrlOk = u.protocol === "https:" && !isLocalHost(u.hostname);
  } catch {
    siteUrlOk = false;
  }
  add(
    "NEXT_PUBLIC_SITE_URL (domaine public en https)",
    siteUrlOk,
    true,
    "variable d’environnement, figée au build",
  );

  add(
    "PUBLIC_API_URL et PUBLIC_API_KEY",
    Boolean(process.env.PUBLIC_API_URL && process.env.PUBLIC_API_KEY),
    true,
    "variables d’environnement",
  );

  // Barème : on lit la valeur exportée (`feeSchedule !== null`), et pas
  // seulement le texte, car le marqueur peut être retiré sans que le barème
  // soit fourni. `src/content/honoraires.ts` n'importe rien.
  const feesPath = join(root, "src/content/honoraires.ts");
  const feesText = existsSync(feesPath) ? readFileSync(feesPath, "utf8") : "";
  let feeSchedule: unknown = null;
  if (existsSync(feesPath)) {
    ({ feeSchedule } = (await import(pathToFileURL(feesPath).href)) as {
      feeSchedule: unknown;
    });
  }
  add(
    "Barème d’honoraires renseigné",
    feeSchedule !== null &&
      feeSchedule !== undefined &&
      !PLACEHOLDER_RE.test(feesText),
    true,
    "src/content/honoraires.ts › feeSchedule (lot 4)",
  );

  const contentFiles = listFiles(join(root, "src/content"));
  const withMarkers = contentFiles.filter((f) =>
    PLACEHOLDER_RE.test(readFileSync(f, "utf8")),
  );
  add(
    "Aucun marqueur [À FOURNIR], [À CONFIRMER] ou TODO dans src/content",
    withMarkers.length === 0,
    true,
    withMarkers.map((f) => relative(root, f)).join(", ") || undefined,
  );

  // Mentions légales (LCEN art. 1-1 et 6-III ; loi Hoguet, décret 72-678 ;
  // RGPD art. 13-2-a).
  add(
    "Directeur de la publication (LCEN)",
    Boolean(agency.legal.publicationDirector?.trim()),
    true,
    "src/lib/agency.ts › legal.publicationDirector",
  );
  add(
    "Adresse du garant financier (décret 72-678)",
    Boolean(agency.legal.guarantorAddress?.trim()),
    true,
    "src/lib/agency.ts › legal.guarantorAddress",
  );
  add(
    "Hébergeur du site : nom, adresse, site (LCEN)",
    Boolean(siteHost?.name && siteHost.address && siteHost.url),
    true,
    "src/content/legal.ts › siteHost",
  );
  add(
    "Durée de conservation des données",
    Boolean(dataRetention?.trim()),
    true,
    "src/content/legal.ts › dataRetention",
  );

  // --- À compléter, non bloquant ------------------------------------------------
  add(
    "Horaires validés par l’agent",
    agency.hoursConfirmed,
    false,
    "src/lib/agency.ts › hoursConfirmed",
  );
  add(
    "Communes du secteur",
    Boolean(agency.sector?.length),
    false,
    "src/lib/agency.ts › sector",
  );
  add(
    "URL de la fiche Google du cabinet",
    Boolean(agency.google.profileUrl),
    false,
    "src/lib/agency.ts › google.profileUrl",
  );

  add(
    "Indexation ouverte (NEXT_PUBLIC_ALLOW_INDEXING=true)",
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
    false,
    "sans elle, le site reste en noindex",
  );

  // --- Rapport ----------------------------------------------------------------------
  const failures = checks.filter((c) => !c.ok && c.blocking);
  console.log(
    `\nContrôle de mise en ligne (${strict ? "strict" : "rapport seul"})\n`,
  );
  for (const c of checks) {
    const mark = c.ok ? "ok  " : c.blocking ? "MANQUE" : "à compléter";
    console.log(
      `  ${mark.padEnd(12)} ${c.label}${!c.ok && c.hint ? ` (${c.hint})` : ""}`,
    );
  }
  console.log("");

  if (failures.length > 0 && strict) {
    console.error(
      `${failures.length} information(s) bloquante(s) manquante(s) : mise en ligne refusée.\n`,
    );
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
