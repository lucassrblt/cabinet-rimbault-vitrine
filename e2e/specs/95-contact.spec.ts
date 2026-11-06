import { expect, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";
import { capturer } from "../support/recette";

// Contact (brief §9) : charge utile imbriquée, compteur de 500 caractères,
// erreurs 400 `fields["contact.email"]` sous le bon champ, `?bien=` et
// `?objet=`. Envois retrouvés dans le mock par une adresse propre au test.

const DELAI_ANTI_SPAM_MS = 4_500;
const S = "[\\s\\u00a0\\u202f]";

test.beforeEach(async ({ request }) => {
  await mock.scenario(request, "default");
});

// `#contenu` : pendant l'hydratation, le repli <Suspense> (formulaire vide)
// reste un instant dans un nœud masqué hors de <main>.
const form = (page: Page) =>
  page
    .locator("#contenu form")
    .filter({ has: page.locator('input[name="email"]') });

async function remplir(
  page: Page,
  email: string,
  objet = "Une autre question",
) {
  await form(page).getByRole("radio", { name: objet, exact: true }).check();
  await form(page).locator('input[name="firstName"]').fill("Camille");
  await form(page).locator('input[name="lastName"]').fill("Essai");
  await form(page).locator('input[name="email"]').fill(email);
  await form(page).locator('input[name="phone"]').fill("06 12 34 56 78");
  await form(page)
    .locator('textarea[name="message"]')
    .fill("Bonjour, une question sur un bien.");
  await form(page).locator('label[for$="-accord"]').click();
}

/** Ouvre la page et attend l'hydratation (champs contrôlés par React). */
async function ouvrir(page: Page, url: string) {
  await page.goto(url);
  await page.locator("html[data-mv-hydrate]").waitFor({ state: "attached" });
}

async function attendre(page: Page) {
  // Délai entier : `startedAt` est posé à l'hydratation, qui peut suivre
  // l'ouverture de plusieurs secondes sur une route compilée à froid.
  const reste = DELAI_ANTI_SPAM_MS;
  if (reste > 0) await page.waitForTimeout(reste);
}

const recusPour = async (page: Page, email: string) =>
  (await mock.requests(page.request, "/contact")).filter((r) =>
    JSON.stringify(r.body).includes(email),
  );

test("charge utile imbriquée conforme", async ({ page }, info) => {
  const email = `contact-${info.project.name}-${Date.now()}@example.com`;
  await ouvrir(page, "/contact");
  await remplir(page, email);
  await attendre(page);
  await form(page).getByRole("button", { name: "Envoyer le message" }).click();
  await expect(page.getByText("Votre message est bien arrivé.")).toBeVisible();
  await capturer(page, info, "contact", "envoye");
  const recus = await recusPour(page, email);
  expect(recus).toHaveLength(1);
  const body = recus[0].body as Record<string, unknown>;
  expect(body).toMatchObject({
    subject: "OTHER",
    contact: {
      firstName: "Camille",
      lastName: "Essai",
      email,
      phone: "06 12 34 56 78",
      message: "Bonjour, une question sur un bien.",
    },
    consent: { rgpd: true },
    meta: { source: "vitrine/contact", page: "/contact" },
  });
  expect(body).not.toHaveProperty("propertyReference");
  expect(body).not.toHaveProperty("email"); // jamais à plat
});

test("compteur de 500 caractères", async ({ page }, info) => {
  await ouvrir(page, "/contact");
  const zone = form(page).locator('textarea[name="message"]');
  // Le formulaire est sous <Suspense> : il s'hydrate après l'en-tête. On
  // ressaisit tant que React n'a pas pris la main sur le champ.
  await expect(async () => {
    await zone.fill("a".repeat(120));
    await expect(form(page)).toContainText(
      new RegExp(`120${S}sur${S}500${S}caractères`),
      { timeout: 500 },
    );
  }).toPass({ timeout: 15_000 });
  await zone.fill("a".repeat(512));
  await expect(form(page)).toContainText(/12.caractères de trop/);
  await capturer(page, info, "contact", "compteur-depasse", false);
});

test("400 de l'API : erreur `contact.email` sous le champ e-mail", async ({
  page,
}, info) => {
  const email = `refus-${info.project.name}-${Date.now()}@example.com`;
  await ouvrir(page, "/contact");
  await remplir(page, email);
  await attendre(page);
  await mock.failNext(page.request, "/contact", 400, {
    success: false,
    error: "L'adresse email n'est pas valide",
    fields: { "contact.email": "L'adresse email n'est pas valide" },
  });
  await form(page).getByRole("button", { name: "Envoyer le message" }).click();
  const champ = form(page).locator('input[name="email"]');
  await expect(champ).toHaveAttribute("aria-invalid", "true");
  const decrit = (await champ.getAttribute("aria-describedby")) ?? "";
  const textes = await Promise.all(
    decrit
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => page.locator(`[id="${id}"]`).textContent()),
  );
  expect(textes.join(" ")).toContain(
    "Indiquez une adresse e-mail valide, par exemple nom@exemple.fr.",
  );
  // Aucun autre champ en erreur.
  await expect(form(page).locator('[aria-invalid="true"]')).toHaveCount(1);
  await capturer(page, info, "contact", "erreur-400-email", false);
});

test("?bien=10.131 pré-remplit la référence", async ({ page }) => {
  await ouvrir(page, "/contact?bien=10.131");
  await expect(
    form(page).getByRole("radio", { name: "Un bien en particulier" }),
  ).toBeChecked();
  await expect(
    form(page).locator('input[name="propertyReference"]').first(),
  ).toHaveValue("10.131");
});

test("?objet=location présélectionne l'objet", async ({ page }) => {
  await ouvrir(page, "/contact?objet=location");
  await expect(
    form(page).getByRole("radio", { name: "Une recherche de location" }),
  ).toBeChecked();
});

test("coordonnées avant le formulaire en mobile", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "Ordre mobile.");
  await ouvrir(page, "/contact");
  const coords = await page
    .getByRole("heading", { name: "Nos coordonnées" })
    .boundingBox();
  const ecrire = await page
    .getByRole("heading", { name: "Nous écrire" })
    .boundingBox();
  expect(coords && ecrire && coords.y < ecrire.y).toBe(true);
});
