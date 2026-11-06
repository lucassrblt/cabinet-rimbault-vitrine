import { mkdirSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, type TestInfo, test } from "@playwright/test";
import { mock } from "../mock-client";

// Critère transverse du brief §9 : axe-core sans violation de niveau `serious`
// ou `critical`. Passé :
// - sur les pages propriétaires (/vendre, /louer) et /honoraires, toutes les
//   questions fréquentes ouvertes (les réponses cachées dans un <details>
//   fermé échappent sinon à l'analyse) ;
// - sur le tunnel /estimation : chaque étape (1 à 4) vierge puis en erreur
//   (résumé d'erreurs et messages de champ affichés), et l'écran de
//   confirmation. Sur les étapes en erreur, la hiérarchie des titres est
//   aussi contrôlée : le h2 de l'étape précède tout h3 (dont le titre du
//   résumé d'erreurs) et aucun niveau n'est sauté. `heading-order` n'est
//   que `moderate` pour axe : le filtre serious/critical ne le verrait pas.
// Les projets Playwright couvrent 1440 px (desktop) et 390 px (mobile,
// iPhone 13).
//
// Le mock est partagé avec d'autres agents : on fixe le scénario sans vider
// le journal des requêtes. La confirmation est obtenue par le champ piège
// (succès affiché, AUCUN POST vers le mock, brief §9).

const PAGES = ["/vendre", "/louer", "/honoraires"] as const;
const CAPTURES = "docs/refonte/captures/T/axe";

test.beforeEach(async ({ request }) => {
  await mock.scenario(request, "default");
});

async function capture(page: Page, nom: string, info: TestInfo) {
  mkdirSync(CAPTURES, { recursive: true });
  await page.screenshot({
    path: `${CAPTURES}/${nom}-${info.project.name}.png`,
    fullPage: true,
  });
}

async function violationsGraves(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => ({
      id: v.id,
      impact: v.impact,
      aide: v.help,
      cibles: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
    }));
}

async function sansViolationGrave(page: Page, contexte: string) {
  const graves = await violationsGraves(page);
  expect(graves, `${contexte}\n${JSON.stringify(graves, null, 2)}`).toEqual([]);
}

/**
 * Projet mobile : rendu à 320 px, sans défilement horizontal (capture
 * « -320 »), puis retour à la largeur du projet.
 */
async function controle320(page: Page, nom: string, info: TestInfo) {
  if (info.project.name !== "mobile") return;
  const origine = page.viewportSize();
  await page.setViewportSize({ width: 320, height: 640 });
  const deborde = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  await capture(page, `${nom}-320`, info);
  expect(deborde, `${nom} : défilement horizontal à 320 px`).toBe(false);
  if (origine) await page.setViewportSize(origine);
}

/** Attend la fin des animations Web Animations et CSS en cours. */
async function finAnimations(page: Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running"),
  );
}

/** Titres visibles de <main>, dans l'ordre du document. */
function titres(page: Page) {
  return page.$$eval("main :is(h1, h2, h3, h4, h5, h6)", (all) =>
    all
      .filter((h) => (h as HTMLElement).offsetParent !== null)
      .map((h) => ({
        niveau: Number(h.tagName.slice(1)),
        texte: (h.textContent ?? "").trim().replace(/\s+/g, " "),
      })),
  );
}

/** h2 de l'étape avant tout h3, et aucun niveau sauté. */
async function hierarchieTitres(page: Page, contexte: string) {
  const liste = await titres(page);
  const lisible = liste.map((t) => `h${t.niveau} ${t.texte}`).join("\n");
  const premierH2 = liste.findIndex((t) => t.niveau === 2);
  const premierH3 = liste.findIndex((t) => t.niveau === 3);
  expect(premierH2, `${contexte} : aucun h2\n${lisible}`).toBeGreaterThan(-1);
  if (premierH3 !== -1) {
    expect(
      premierH2,
      `${contexte} : un h3 précède le h2 de l'étape\n${lisible}`,
    ).toBeLessThan(premierH3);
  }
  const sauts = liste.filter(
    (t, i) => i > 0 && t.niveau > liste[i - 1].niveau + 1,
  );
  expect(sauts, `${contexte} : niveau de titre sauté\n${lisible}`).toEqual([]);
}

for (const path of PAGES) {
  test(`axe : aucune violation serious ou critical sur ${path}`, async ({
    page,
  }, testInfo) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");

    // Ouvre toutes les FAQ (details natifs), puis vérifie qu'elles le sont.
    await page.$$eval("main details", (all) => {
      for (const d of all) (d as HTMLDetailsElement).open = true;
    });
    const fermees = await page.locator("main details:not([open])").count();
    expect(fermees).toBe(0);

    await capture(page, path.slice(1), testInfo);
    await sansViolationGrave(page, path);
  });
}

test.describe("axe : tunnel /estimation", () => {
  const resume = (page: Page) =>
    page.locator("section.ui-resume", {
      hasText: /à corriger/,
    });

  /** Étape vierge puis en erreur : axe, hiérarchie des titres, captures. */
  async function controlerEtape(
    page: Page,
    info: TestInfo,
    etape: number,
    bouton: "Continuer" | "Envoyer la demande",
  ) {
    await expect(page.locator("[data-titre-etape]")).toBeVisible();
    // Fin du changement d'étape (StepTransition : sortie puis entrée, focus
    // sur le titre) : sinon axe lit l'étape sortante à demi-opacité.
    if (etape > 1) {
      await expect(page.locator("[data-titre-etape]")).toBeFocused();
    }
    await finAnimations(page);
    await page.waitForLoadState("networkidle");
    await sansViolationGrave(page, `étape ${etape}, vierge`);

    await page.getByRole("button", { name: bouton }).click();
    await expect(resume(page)).toBeVisible();
    await expect(resume(page)).toBeFocused();
    await finAnimations(page);
    await capture(page, `estimation-etape-${etape}-erreurs`, info);
    await controle320(page, `estimation-etape-${etape}-erreurs`, info);
    await sansViolationGrave(page, `étape ${etape}, en erreur`);
    await hierarchieTitres(page, `étape ${etape}, en erreur`);
  }

  test("étapes 1 à 4 (vierges et en erreur) puis confirmation", async ({
    page,
    request,
  }, info) => {
    const email = `axe-${info.project.name}-${Date.now()}@example.com`;

    const response = await page.goto("/estimation");
    expect(response?.status()).toBe(200);

    // Étape 1
    await controlerEtape(page, info, 1, "Continuer");
    await page.getByRole("radio", { name: "Appartement", exact: true }).check();
    await page.locator('input[name="postalCode"]').fill("92600");
    await page.getByRole("button", { name: "Continuer" }).click();
    await expect(page).toHaveURL(/etape=2/);

    // Étape 2
    await controlerEtape(page, info, 2, "Continuer");
    await page.locator('input[name="surface"]').fill("52");
    await page.getByRole("radio", { name: "3 pièces", exact: true }).check();
    await page.getByRole("button", { name: "Continuer" }).click();
    await expect(page).toHaveURL(/etape=3/);

    // Étape 3
    await controlerEtape(page, info, 3, "Continuer");
    await page.locator('input[name="firstName"]').fill("Camille");
    await page.locator('input[name="lastName"]').fill("Essai");
    await page.locator('input[name="email"]').fill(email);
    await page.getByRole("button", { name: "Continuer" }).click();
    await expect(page).toHaveURL(/etape=4/);

    // Étape 4 : envoi sans consentement RGPD.
    await controlerEtape(page, info, 4, "Envoyer la demande");

    // Confirmation par le champ piège : succès affiché, aucun POST.
    await page.locator(`label[for="estimation-rgpd"]`).click();
    await expect(page.locator('input[name="rgpd"]')).toBeChecked();
    await page.$eval("#site_web", (el) => {
      (el as HTMLInputElement).value = "https://exemple.invalid";
    });
    await page.getByRole("button", { name: "Envoyer la demande" }).click();
    const h1 = page.getByRole("heading", {
      level: 1,
      name: "Votre demande est bien arrivée.",
    });
    await expect(h1).toBeVisible();
    await expect(h1).toBeFocused();
    await finAnimations(page);
    await capture(page, "estimation-confirmation", info);
    await controle320(page, "estimation-confirmation", info);
    await sansViolationGrave(page, "confirmation");
    await hierarchieTitres(page, "confirmation");

    const recus = (await mock.requests(request, "/evaluation")).filter((r) =>
      JSON.stringify(r.body).includes(email),
    );
    expect(recus).toHaveLength(0);
  });
});
