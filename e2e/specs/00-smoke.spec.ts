import { expect, test } from "@playwright/test";
import { MOCK_URL, mock } from "../mock-client";

// Test fumée : le banc démarre (mock + vitrine) et la page d'accueil répond.
test.beforeEach(async ({ request }) => {
  await mock.reset(request);
});

test("la page d'accueil répond sans erreur serveur", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const response = await page.goto("/");
  expect(response?.status()).toBeLessThan(500);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  expect(errors).toEqual([]);
});

test("le mock enregistre les POST sans jamais toucher l'API réelle", async ({
  request,
}) => {
  const res = await request.post(`${MOCK_URL}/api/public/evaluation`, {
    headers: { "X-API-Key": "e2e-test-key" },
    data: {
      propertyType: "APPARTEMENT",
      postalCode: "92600",
      firstName: "Test",
      lastName: "E2E",
      email: "test@example.com",
      rgpd: true,
    },
  });
  expect(res.status()).toBe(201);
  const recorded = await mock.requests(request, "/evaluation");
  expect(recorded).toHaveLength(1);
  expect(recorded[0].body).toMatchObject({ postalCode: "92600", rgpd: true });
});
