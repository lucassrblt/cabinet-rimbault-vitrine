import { expect, test } from "@playwright/test";
import { mock } from "../mock-client";

// Ouverture de l'accueil (brief §7, revue du lot I) : aucune alerte
// d'hydratation sur `/` ; `data-mv-ouverture` vaut « serveur » au premier
// chargement et « client » après une navigation côté client vers `/`.

test.beforeEach(async ({ request }) => {
  await mock.scenario(request, "default");
});

test("aucune alerte d'hydratation, ouverture serveur puis client", async ({
  page,
}) => {
  const alertes: string[] = [];
  page.on("console", (m) => {
    if (/hydrat/i.test(m.text()))
      alertes.push(`${m.type()} : ${m.text().slice(0, 200)}`);
  });
  page.on("pageerror", (e) => alertes.push(`pageerror : ${e.message}`));
  await page.goto("/");
  await page.locator("html[data-mv-hydrate]").waitFor({ state: "attached" });
  await expect(page.locator("[data-mv-ouverture]")).toHaveAttribute(
    "data-mv-ouverture",
    "serveur",
  );
  await page.waitForLoadState("networkidle");

  // Navigation côté client : /vendre, puis retour à / par le logotype.
  await page.goto("/vendre");
  await page.locator("html[data-mv-hydrate]").waitFor({ state: "attached" });
  await page.locator("header[data-mv-entete] a[href='/']").first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("[data-mv-ouverture]")).toHaveAttribute(
    "data-mv-ouverture",
    "client",
  );
  expect(alertes).toEqual([]);
});
