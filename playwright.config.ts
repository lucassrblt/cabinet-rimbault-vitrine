import { defineConfig, devices } from "@playwright/test";

// Banc de test de bout en bout (Maldini). Voir docs/refonte/02-donnees-et-tests-maldini.md.
// - La vitrine tourne en `next dev` sur le port 3100, dans un distDir isolé
//   (.next-e2e) pour ne pas entrer en conflit avec le verrou d'un autre `next dev`.
// - Elle parle au mock e2e/mock-api.mjs (port 3101) : aucun POST ne part vers l'API réelle.
// - E2E_SERVEUR=prod : `next build` puis `next start` (distDir .next-e2e-prod) au
//   lieu de `next dev`. Indispensable pour les contrôles sans JavaScript : en dev,
//   un notFound() levé dans une page renvoie l'enveloppe `__next_error__`, que
//   seul le client remplit (page blanche sans JavaScript). Voir 30-sans-javascript.
// - Les pages sont TOUJOURS ouvertes sur `localhost`, jamais sur `127.0.0.1` :
//   Next 16 n'autorise que `localhost` à charger les ressources de dev
//   (`allowedDevOrigins`) ; sur 127.0.0.1, rien ne s'hydrate. Le mock, lui, est
//   un serveur Node joint de serveur à serveur : il écoute sur 127.0.0.1
//   seulement (pas de résolution `localhost` vers ::1 côté Node).

const PORT = Number(process.env.E2E_PORT ?? 3100);
const MOCK_PORT = Number(process.env.MOCK_API_PORT ?? 3101);
const MOCK_KEY = "e2e-test-key";
export const MOCK_URL = `http://127.0.0.1:${MOCK_PORT}`;
export const SERVEUR_PROD = process.env.E2E_SERVEUR === "prod";
const DIST_DIR =
  process.env.E2E_DIST_DIR ?? (SERVEUR_PROD ? ".next-e2e-prod" : ".next-e2e");
const SITE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e/specs",
  outputDir: "./e2e/.results",
  fullyParallel: false, // le mock garde un état partagé (requêtes, scénario)
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "e2e/.report", open: "never" }],
  ],
  timeout: 60_000,
  use: {
    baseURL: SITE_URL,
    locale: "fr-FR",
    timezoneId: "Europe/Paris",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile",
      // Profil iPhone (viewport, DPR, tactile, UA) exécuté sur Chromium.
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: [
    {
      command: "node e2e/mock-api.mjs",
      url: `${MOCK_URL}/__mock/health`,
      reuseExistingServer: !process.env.CI,
      env: { MOCK_API_PORT: String(MOCK_PORT), MOCK_API_KEY: MOCK_KEY },
      timeout: 15_000,
    },
    {
      command: SERVEUR_PROD
        ? `next build && next start --port ${PORT}`
        : `next dev --port ${PORT}`,
      url: SITE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: SERVEUR_PROD ? 600_000 : 180_000,
      env: {
        // Les variables du processus priment sur .env.local.
        PUBLIC_API_URL: `${MOCK_URL}/api/public`,
        PUBLIC_API_KEY: MOCK_KEY,
        NEXT_DIST_DIR: DIST_DIR,
        ...(SERVEUR_PROD
          ? { NEXT_TSCONFIG_PATH: "e2e/tsconfig.build.json" }
          : {}),
        NEXT_TELEMETRY_DISABLED: "1",
        // Cache de données coupé : un changement de scénario du mock est
        // visible à la requête suivante (lu par `apiFetch`, lot 0).
        E2E_NO_CACHE: "1",
      },
    },
  ],
});
