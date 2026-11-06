import { expect, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";
import { attendreAntiSpam, hydrate } from "../support/galerie";

// Formulaire de contact (/contact) : Server Action `envoyerContact` →
// POST /contact (mock privé). Envois au moins 4 s après l'affichage (sinon
// succès silencieux sans appel à l'API : anti-spam).

const MERCI = "Votre message est bien arrivé.";
/** Message de visite pré-rempli (espaces insécables de la typographie). */
const VISITE = /^Bonjour, je souhaite visiter l’appartement réf\.\s10\.131\.$/;
const ECHEC =
  /Votre message n’a pas pu être envoyé\. Ce que vous avez écrit est conservé/;

test.beforeEach(async ({ request }) => {
  await mock.reset(request);
});

const form = (page: Page) => page.getByRole("form", { name: "Nous écrire" });
const envoyer = (page: Page) =>
  page.getByRole("button", { name: /^(Envoyer le message|Envoi en cours…)$/ });

async function ouvrir(page: Page, url = "/contact") {
  await page.goto(url);
  await hydrate(envoyer(page));
  return Date.now();
}

async function remplir(
  page: Page,
  email: string,
  { objet = "Une autre question", message = "Bonjour, une question." } = {},
) {
  const f = form(page);
  if (objet) await f.getByRole("radio", { name: objet }).check();
  await f.getByLabel("Prénom").fill("Camille");
  await f.getByLabel("Nom", { exact: true }).fill("Essai");
  await f.getByLabel("Adresse e-mail").fill(email);
  await f.getByLabel(/^Téléphone/).fill("0612345678");
  if (message)
    await f.getByRole("textbox", { name: "Votre message" }).fill(message);
  await f.getByRole("checkbox").check();
}

test("envoi standard : charge utile et confirmation", async ({
  page,
}, info) => {
  const email = `Contact-${info.project.name}@Example.com`;
  const debut = await ouvrir(page);
  await remplir(page, email);
  await attendreAntiSpam(page, debut);
  await envoyer(page).click();

  const merci = page.getByRole("heading", { name: MERCI });
  await expect(merci).toBeVisible();
  await expect(merci).toBeFocused();

  const recus = await mock.requests(page.request, "/contact");
  expect(recus).toHaveLength(1);
  expect(recus[0].body).toMatchObject({
    subject: "OTHER",
    contact: {
      firstName: "Camille",
      lastName: "Essai",
      email: email.toLowerCase(),
      phone: "06 12 34 56 78",
      message: "Bonjour, une question.",
    },
    consent: { rgpd: true },
    meta: { source: "vitrine/contact", page: "/contact" },
  });
  expect(recus[0].body).not.toHaveProperty("propertyReference");
});

test("validation : résumé des erreurs, aucun envoi", async ({ page }) => {
  await ouvrir(page);
  await envoyer(page).click();
  const resume = page.getByRole("region", { name: /informations à corriger/ });
  await expect(resume).toBeVisible();
  await expect(resume).toBeFocused();
  await expect(resume).toContainText("Choisissez l’objet de votre message.");
  await expect(resume).toContainText("Écrivez votre message.");
  await expect(form(page).getByLabel("Prénom")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(await mock.requests(page.request, "/contact")).toHaveLength(0);
});

test("?ref=10.131 : bien cité, référence et message pré-remplis", async ({
  page,
}, info) => {
  const debut = await ouvrir(page, "/contact?ref=10.131");
  const f = form(page);
  await expect(
    f.getByRole("radio", { name: "Un bien en particulier" }),
  ).toBeChecked();
  await expect(f.getByLabel("Référence du bien")).toHaveValue("10.131");
  await expect(f.getByRole("textbox", { name: "Votre message" })).toHaveValue(
    VISITE,
  );
  await expect(f).toContainText("Votre message concerne");
  await expect(f).toContainText("Réf. 10.131");

  await remplir(page, `ref-${info.project.name}@example.com`, {
    objet: "",
    message: "",
  });
  await attendreAntiSpam(page, debut);
  await envoyer(page).click();
  await expect(page.getByRole("heading", { name: MERCI })).toBeVisible();

  const recus = await mock.requests(page.request, "/contact");
  expect(recus).toHaveLength(1);
  expect(recus[0].body).toMatchObject({
    subject: "BIEN_SALE",
    propertyReference: "10.131",
  });
  expect(
    (recus[0].body as { contact: { message: string } }).contact.message,
  ).toMatch(VISITE);
});

test("objet « vente » : renvoi vers Vendre, sujet ESTIMATION", async ({
  page,
}, info) => {
  const debut = await ouvrir(page);
  await remplir(page, `vente-${info.project.name}@example.com`, {
    objet: "La vente de votre bien",
  });
  await expect(
    form(page).getByRole("link", { name: "Vendre", exact: true }),
  ).toHaveAttribute("href", "/vendre");
  await attendreAntiSpam(page, debut);
  await envoyer(page).click();
  await expect(page.getByRole("heading", { name: MERCI })).toBeVisible();
  const recus = await mock.requests(page.request, "/contact");
  expect(recus).toHaveLength(1);
  expect(recus[0].body).toMatchObject({ subject: "ESTIMATION" });
});

test("double clic : un seul envoi", async ({ page }, info) => {
  const debut = await ouvrir(page);
  await remplir(page, `double-${info.project.name}@example.com`);
  await attendreAntiSpam(page, debut);
  await envoyer(page).dblclick();
  await expect(page.getByRole("heading", { name: MERCI })).toBeVisible();
  await page.waitForTimeout(1_000);
  expect(await mock.requests(page.request, "/contact")).toHaveLength(1);
});

test("échec de l'API : alerte, saisie conservée, nouvel essai", async ({
  page,
}, info) => {
  const email = `echec-${info.project.name}@example.com`;
  await mock.failNext(page.request, "/contact", 500);
  const debut = await ouvrir(page);
  await remplir(page, email);
  await attendreAntiSpam(page, debut);
  await envoyer(page).click();

  await expect(form(page).getByRole("alert")).toContainText(ECHEC);
  const f = form(page);
  await expect(f.getByLabel("Prénom")).toHaveValue("Camille");
  await expect(f.getByLabel("Adresse e-mail")).toHaveValue(email);
  await expect(f.getByRole("textbox", { name: "Votre message" })).toHaveValue(
    "Bonjour, une question.",
  );
  await expect(f.getByRole("checkbox")).toBeChecked();
  await expect(
    f.getByRole("radio", { name: "Une autre question" }),
  ).toBeChecked();

  await envoyer(page).click();
  await expect(page.getByRole("heading", { name: MERCI })).toBeVisible();
  expect(await mock.requests(page.request, "/contact")).toHaveLength(2);
});

test.describe("sans JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("le formulaire s'envoie (amélioration progressive)", async ({
    page,
  }, info) => {
    const email = `sans-js-${info.project.name}@example.com`;
    await page.goto("/contact");
    const debut = Date.now();
    await remplir(page, email);
    await attendreAntiSpam(page, debut);
    await envoyer(page).click();

    await expect(page.getByRole("heading", { name: MERCI })).toBeVisible();
    const recus = await mock.requests(page.request, "/contact");
    expect(recus).toHaveLength(1);
    expect(recus[0].body).toMatchObject({
      subject: "OTHER",
      contact: { email, message: "Bonjour, une question." },
      consent: { rgpd: true },
    });
  });

  test("erreurs renvoyées par le serveur, saisie conservée", async ({
    page,
  }) => {
    await page.goto("/contact");
    await form(page).getByLabel("Prénom").fill("Camille");
    await envoyer(page).click();
    await expect(
      page.getByRole("region", { name: /informations à corriger/ }),
    ).toBeVisible();
    await expect(form(page).getByLabel("Prénom")).toHaveValue("Camille");
    expect(await mock.requests(page.request, "/contact")).toHaveLength(0);
  });
});
