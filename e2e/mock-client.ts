// Helpers de pilotage du mock d'API depuis les tests Playwright.
import type { APIRequestContext } from "@playwright/test";

// Mock joint de serveur à serveur : 127.0.0.1 (il n'écoute pas sur ::1).
// Les PAGES, elles, s'ouvrent toujours sur localhost (voir playwright.config.ts).
export const MOCK_URL = `http://127.0.0.1:${process.env.MOCK_API_PORT ?? 3111}`;

export type MockRecord = {
  at: string;
  path: "/evaluation" | "/contact";
  body: unknown;
};

export type MockScenario =
  | "default"
  | "empty"
  | "error"
  | "edge"
  // Volumes de la grille (A21) : ventes disponibles seulement.
  | "n1"
  | "n2"
  | "n4"
  | "n5"
  | "n12";

export const mock = {
  async reset(request: APIRequestContext) {
    await request.delete(`${MOCK_URL}/__mock/requests`);
    await request.post(`${MOCK_URL}/__mock/scenario`, {
      data: { name: "default" },
    });
  },
  async scenario(request: APIRequestContext, name: MockScenario) {
    await request.post(`${MOCK_URL}/__mock/scenario`, { data: { name } });
  },
  async failNext(
    request: APIRequestContext,
    path: "/evaluation" | "/contact",
    status = 500,
    body?: unknown,
  ) {
    await request.post(`${MOCK_URL}/__mock/fail-next`, {
      data: { path, status, ...(body === undefined ? {} : { body }) },
    });
  },
  async requests(
    request: APIRequestContext,
    path?: "/evaluation" | "/contact",
  ): Promise<MockRecord[]> {
    const qs = path ? `?path=${encodeURIComponent(path)}` : "";
    const res = await request.get(`${MOCK_URL}/__mock/requests${qs}`);
    return res.json();
  },
};
