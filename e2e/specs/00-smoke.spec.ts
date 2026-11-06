import { expect, test } from "@playwright/test";
import { mock } from "../mock-client";
import {
  cadrePresent,
  debordement,
  hydrate,
  PAGES,
  suivreConsole,
} from "../support/galerie";

// Fumée : chaque page répond 200, porte son <title>, un seul h1, l'en-tête,
// le <main> et le pied ; aucune erreur console ; pas de défilement
// horizontal à la largeur du projet (desktop 1440, mobile 390).

test.beforeEach(async ({ request }) => {
  await mock.reset(request);
});

for (const p of PAGES) {
  test(`fumée · ${p.chemin}`, async ({ page }) => {
    const erreurs = suivreConsole(page);
    const res = await page.goto(p.chemin);
    expect(res?.status(), "statut HTTP").toBe(200);
    await expect(page).toHaveTitle(p.titre);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(p.h1);
    await cadrePresent(page);

    // L'hydratation passe sans erreur (les erreurs d'hydratation sont
    // journalisées en console).
    await hydrate(page.getByRole("banner"));
    await page.waitForLoadState("networkidle");

    const { scrollWidth, clientWidth } = await debordement(page);
    expect(scrollWidth, "défilement horizontal").toBeLessThanOrEqual(
      clientWidth,
    );
    expect(erreurs, erreurs.join("\n")).toEqual([]);
  });
}
