import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";

// Sauvegarde du tunnel d'estimation dans sessionStorage (doc 04 §3.5).
//
// La clé `cr:estimation:v1` garde les réponses pendant la saisie. Elle doit
// être VIDE :
// 1. après un envoi réussi (écran « Votre demande est bien arrivée. »), et le
//    rester : la sauvegarde différée de 300 ms ne doit pas la réécrire, et un
//    rechargement doit rouvrir un tunnel vierge, sans « Nous avons retrouvé
//    vos réponses » ;
// 2. après « Recommencer », et le rester tant qu'aucune nouvelle réponse
//    n'est donnée (un formulaire vierge n'est jamais enregistré).
//
// Le mock est partagé avec d'autres agents : on ne le remet pas à zéro, on
// retrouve NOTRE envoi par une adresse e-mail propre au test.
//
// Captures (contrôle visuel) : E2E_CAPTURES_DIR=<dossier>.

const KEY = "cr:estimation:v1";
/** Au-delà de la sauvegarde différée (300 ms) du tunnel. */
const APRES_SAUVEGARDE_MS = 800;
/** Délai minimal anti-spam (MIN_FILL_MS = 4 s) plus une marge. */
const DELAI_ANTI_SPAM_MS = 4_500;

const lireCle = (page: Page) =>
  page.evaluate((k) => window.sessionStorage.getItem(k), KEY);

async function capture(page: Page, nom: string, projet: string) {
  const dossier = process.env.E2E_CAPTURES_DIR;
  if (!dossier) return;
  mkdirSync(dossier, { recursive: true });
  await page.screenshot({
    path: path.join(dossier, `${nom}-${projet}.png`),
    fullPage: true,
  });
}

/** Réponses complètes et valides, au format de `lib/estimation/storage.ts`. */
function sauvegardeComplete(email: string) {
  const now = Date.now();
  return {
    v: 1,
    savedAt: now,
    startedAt: now - 60_000,
    referer: "/vendre",
    state: {
      intent: "ESTIMATION_VENTE",
      propertyType: "APPARTEMENT",
      address: "",
      postalCode: "92600",
      city: "Asnières-sur-Seine",
      surface: "52",
      rooms: "3",
      bedrooms: "",
      bathrooms: "",
      floor: "",
      isTopFloor: false,
      hasElevator: "",
      levels: "",
      landSurface: "",
      hasBalcony: false,
      hasTerrace: false,
      hasGarden: false,
      hasParking: false,
      hasCellar: false,
      condition: "",
      constructionPeriod: "",
      renovations: "",
      firstName: "Camille",
      lastName: "Essai",
      email,
      phone: "",
      contactPreference: "",
      contactMoment: "",
      message: "",
      rgpd: false,
    },
  };
}

test.describe("tunnel d'estimation : sessionStorage", () => {
  test.beforeEach(async ({ request }) => {
    await mock.scenario(request, "default");
  });

  test("la clé est vide après un envoi réussi, et le reste", async ({
    page,
    request,
  }, info) => {
    const email = `stockage-${info.project.name}-${Date.now()}@example.com`;
    await page.goto("/estimation");
    // Formulaire vierge : rien n'est écrit.
    await expect(
      page.getByRole("radio", { name: "Appartement", exact: true }),
    ).toBeVisible();
    await page.waitForTimeout(APRES_SAUVEGARDE_MS);
    expect(await lireCle(page)).toBeNull();

    // Étape 1
    await page.getByRole("radio", { name: "Appartement", exact: true }).check();
    await page.locator('input[name="postalCode"]').fill("92600");
    await page.getByRole("button", { name: "Continuer" }).click();
    await expect(page).toHaveURL(/etape=2/);

    // Étape 2
    await page.locator('input[name="surface"]').fill("52");
    await page.getByRole("radio", { name: "3 pièces", exact: true }).check();
    await page.getByRole("button", { name: "Continuer" }).click();
    await expect(page).toHaveURL(/etape=3/);

    // Étape 3
    await page.locator('input[name="firstName"]').fill("Camille");
    await page.locator('input[name="lastName"]').fill("Essai");
    await page.locator('input[name="email"]').fill(email);
    await page.getByRole("button", { name: "Continuer" }).click();
    await expect(page).toHaveURL(/etape=4/);

    // Pendant la saisie, les réponses sont bien gardées.
    await expect
      .poll(async () => JSON.parse((await lireCle(page)) ?? "null"))
      .toMatchObject({ v: 1, state: { email, postalCode: "92600" } });

    // Étape 4 : consentement, puis envoi après le délai anti-spam (sinon la
    // Server Action répond « succès » sans appeler l'API et le test ne
    // prouverait rien sur un vrai envoi).
    // Case native masquée sous la case dessinée : on coche par le libellé.
    await page.locator(`label[for="estimation-rgpd"]`).click();
    await expect(page.locator('input[name="rgpd"]')).toBeChecked();
    // Délai entier : `startedAt` est posé à l'hydratation, qui peut suivre
    // l'ouverture de plusieurs secondes sur une route compilée à froid.
    const reste = DELAI_ANTI_SPAM_MS;
    if (reste > 0) await page.waitForTimeout(reste);
    await page.getByRole("button", { name: "Envoyer la demande" }).click();

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Votre demande est bien arrivée.",
      }),
    ).toBeVisible();

    // L'envoi est réellement parti vers l'API (le mock), une seule fois.
    const recus = (await mock.requests(request, "/evaluation")).filter((r) =>
      JSON.stringify(r.body).includes(email),
    );
    expect(recus).toHaveLength(1);

    // Clé effacée, et pas réécrite par la sauvegarde différée.
    expect(await lireCle(page)).toBeNull();
    await page.waitForTimeout(APRES_SAUVEGARDE_MS);
    expect(await lireCle(page)).toBeNull();
    await capture(page, "envoi-reussi", info.project.name);

    // Rechargement : tunnel vierge, aucune reprise proposée.
    await page.goto("/estimation");
    await expect(
      page.getByRole("radio", { name: "Appartement", exact: true }),
    ).not.toBeChecked();
    await expect(
      page.getByText("Nous avons retrouvé vos réponses."),
    ).toHaveCount(0);
    await page.waitForTimeout(APRES_SAUVEGARDE_MS);
    expect(await lireCle(page)).toBeNull();
  });

  test("la clé est vide après « Recommencer », et le reste", async ({
    page,
  }, info) => {
    const email = `recommencer-${info.project.name}-${Date.now()}@example.com`;
    // Une saisie en cours (sauvegarde déposée avant le premier rendu).
    await page.addInitScript(
      ([k, v]) => {
        // Une seule fois : les rechargements suivants doivent voir l'effet
        // réel du tunnel, pas une nouvelle sauvegarde injectée.
        if (window.sessionStorage.getItem("e2e:injecte")) return;
        window.sessionStorage.setItem("e2e:injecte", "1");
        window.sessionStorage.setItem(k, v);
      },
      [KEY, JSON.stringify(sauvegardeComplete(email))] as const,
    );
    await page.goto("/estimation?etape=3");

    await expect(
      page.getByText("Nous avons retrouvé vos réponses."),
    ).toBeVisible();
    await expect(page.locator('input[name="email"]')).toHaveValue(email);
    expect(await lireCle(page)).not.toBeNull();

    await page.getByRole("button", { name: "Recommencer" }).click();

    // Retour à l'étape 1, formulaire vierge, bandeau retiré.
    await expect(page).toHaveURL(/\/estimation$/);
    await expect(
      page.getByRole("radio", { name: "Appartement", exact: true }),
    ).not.toBeChecked();
    await expect(page.locator('input[name="postalCode"]')).toHaveValue("");
    await expect(
      page.getByText("Nous avons retrouvé vos réponses."),
    ).toHaveCount(0);

    // Clé effacée, et pas réécrite pour un formulaire vierge.
    expect(await lireCle(page)).toBeNull();
    await page.waitForTimeout(APRES_SAUVEGARDE_MS);
    expect(await lireCle(page)).toBeNull();
    await capture(page, "apres-recommencer", info.project.name);

    // Le masquage de la page (pagehide) n'écrit rien non plus.
    await page.reload();
    await expect(
      page.getByRole("radio", { name: "Appartement", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Nous avons retrouvé vos réponses."),
    ).toHaveCount(0);
    expect(await lireCle(page)).toBeNull();

    // Contrôle de débordement à 320 px (captures seulement).
    if (process.env.E2E_CAPTURES_DIR && info.project.name === "mobile") {
      await page.setViewportSize({ width: 320, height: 640 });
      const deborde = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect(deborde).toBe(false);
      await capture(page, "apres-recommencer-320", info.project.name);
    }
  });
});
