import { expect, type Locator, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";
import { attendreAntiSpam, hydrate } from "../support/galerie";

// Tunnel d'estimation (/vendre/estimation) : cinq questions, une par écran,
// puis la Server Action `submitEstimation` → POST /evaluation (mock privé).
// Les envois attendent 4 s après l'affichage : plus tôt, la Server Action
// répond « succès » sans appeler l'API (anti-spam, MIN_FILL_MS).

const URL = "/vendre/estimation";

const MESSAGES = {
  propertyType: "Choisissez le type de bien.",
  postalCode: /Indiquez un code postal à 5\schiffres/,
  surface: /Indiquez la surface en m²/,
  rooms: "Indiquez le nombre de pièces.",
  echeance: "Choisissez une échéance, même approximative.",
  email: /Indiquez une adresse e-mail valide/,
  rgpd: "Votre accord est nécessaire pour que nous puissions vous recontacter.",
  sendFailed:
    /Votre demande n’a pas pu être envoyée\. Vos réponses sont conservées/,
};

test.beforeEach(async ({ request }) => {
  await mock.reset(request);
});

const question = (page: Page) => page.locator("#estimer-question");

/**
 * Texte exact d'un titre, quelle que soit la typographie du site (liants
 * U+2060 après les traits d'union, espaces insécables).
 */
const titre = (t: string) =>
  new RegExp(
    `^${t
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/-/g, "-\u2060?")
      .replace(/ /g, "\\s")}$`,
  );
const continuer = (page: Page) =>
  page.getByRole("button", { name: "Continuer" });
const envoyer = (page: Page) =>
  page.getByRole("button", { name: /^(Envoyer ma demande|Envoi en cours…)$/ });

async function ouvrir(page: Page) {
  await page.goto(URL);
  await hydrate(continuer(page));
  return Date.now();
}

/** Tabulation jusqu'à l'élément (au plus `max` appuis). */
async function tabVers(page: Page, cible: Locator, max = 20) {
  for (let n = 0; n < max; n++) {
    if (await cible.evaluate((el) => el === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  await expect(cible, "atteint au clavier").toBeFocused();
}

/** Questions 1 à 4 remplies à la souris (Appartement, 92600, 48,5 m², 2 p.). */
async function questions1a4(page: Page) {
  await page.getByRole("radio", { name: "Appartement" }).check();
  await continuer(page).click();
  await page.getByLabel("Adresse").fill("12 rue de l’Essai");
  await page.getByLabel("Code postal").fill("92600");
  await page.getByLabel("Commune").fill("Asnières-sur-Seine");
  await continuer(page).click();
  await page.getByLabel("Surface habitable, en m²").fill("48,5");
  await page.getByRole("radio", { name: "2", exact: true }).check();
  await continuer(page).click();
  await page.getByRole("radio", { name: "Dès que possible" }).check();
  await continuer(page).click();
  await expect(question(page)).toHaveText(titre("Comment vous recontacter ?"));
}

async function coordonnees(page: Page, email: string, accord = true) {
  await page.getByLabel("Prénom").fill("Camille");
  await page.getByLabel("Nom", { exact: true }).fill("Essai");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Téléphone").fill("0612345678");
  if (accord) await page.getByRole("checkbox").check();
}

test("parcours complet au clavier, charge utile vérifiée", async ({
  page,
}, info) => {
  const email = `Estimation-${info.project.name}@Example.com`;
  const debut = await ouvrir(page);
  const k = page.keyboard;

  // Question 1 : on part du titre de la question.
  await question(page).focus();
  await tabVers(page, page.getByRole("radio", { name: "Appartement" }));
  await k.press("Space");
  await expect(page.getByRole("radio", { name: "Appartement" })).toBeChecked();
  await tabVers(page, continuer(page));
  await k.press("Enter");

  // Question 2 : le focus va au titre ; Entrée dans un champ envoie l'écran.
  await expect(question(page)).toHaveText(titre("Où se trouve-t-il ?"));
  await expect(question(page)).toBeFocused();
  await k.press("Tab");
  await k.type("12 rue de l’Essai");
  await k.press("Tab");
  await k.type("92600");
  await k.press("Tab");
  await k.type("Asnières-sur-Seine");
  await k.press("Enter");

  // Question 3 : surface, puis pièces aux flèches.
  await expect(question(page)).toHaveText(/Quelle est sa surface/);
  await expect(question(page)).toBeFocused();
  await k.press("Tab");
  await k.type("48,5");
  await tabVers(page, page.getByRole("radio", { name: "1", exact: true }));
  await k.press("ArrowRight");
  await expect(
    page.getByRole("radio", { name: "2", exact: true }),
  ).toBeChecked();
  await tabVers(page, continuer(page));
  await k.press("Enter");

  // Question 4 : échéance.
  await expect(question(page)).toHaveText(titre("Quand pensez-vous vendre ?"));
  await tabVers(page, page.getByRole("radio", { name: "Dès que possible" }));
  await k.press("Space");
  await tabVers(page, continuer(page));
  await k.press("Enter");

  // Question 5 : coordonnées et accord.
  await expect(question(page)).toHaveText(titre("Comment vous recontacter ?"));
  await k.press("Tab");
  await k.type("Camille");
  await k.press("Tab");
  await k.type("Essai");
  await k.press("Tab");
  await k.type(email);
  await k.press("Tab");
  await k.type("06 12 34 56 78");
  await tabVers(page, page.getByRole("checkbox"));
  await k.press("Space");
  await expect(page.getByRole("checkbox")).toBeChecked();

  // Le cartel récapitule les réponses (masqué sous 1100 px).
  if (info.project.name === "desktop") {
    const recap = page.getByRole("complementary", { name: "Votre bien" });
    await expect(recap).toContainText("Appartement");
    await expect(recap).toContainText("92600");
    await expect(recap).toContainText("Dès que possible");
  }

  await attendreAntiSpam(page, debut);
  await tabVers(page, envoyer(page));
  await k.press("Enter");

  const merci = page.getByRole("heading", {
    level: 1,
    name: "Votre demande est bien arrivée.",
  });
  await expect(merci).toBeVisible();
  await expect(merci).toBeFocused();
  await expect(page.getByRole("main")).toContainText(
    `estimation-${info.project.name}@example.com`,
  );

  const recus = await mock.requests(page.request, "/evaluation");
  expect(recus).toHaveLength(1);
  expect(recus[0].body).toMatchObject({
    propertyType: "APPARTEMENT",
    postalCode: "92600",
    address: "12 rue de l’Essai, Asnières-sur-Seine",
    surface: "48.5",
    rooms: "2",
    firstName: "Camille",
    lastName: "Essai",
    email: `estimation-${info.project.name}@example.com`,
    phone: "06 12 34 56 78",
    rgpd: true,
    source: "vitrine/estimation",
    referer: URL,
  });
  expect((recus[0].body as { message: string }).message).toContain(
    "Échéance du projet : dès que possible",
  );
});

test("validation : erreurs sur les champs requis, focus sur le premier", async ({
  page,
}) => {
  await ouvrir(page);

  // Question 1 sans choix.
  await continuer(page).click();
  await expect(page.getByText(MESSAGES.propertyType)).toBeVisible();
  await expect(page.getByRole("radio", { name: "Appartement" })).toBeFocused();
  await expect(question(page)).toHaveText(
    titre("Quel bien souhaitez-vous vendre ?"),
  );
  await page.getByRole("radio", { name: "Maison" }).check();
  await expect(page.getByText(MESSAGES.propertyType)).toHaveCount(0);
  await continuer(page).click();

  // Question 2 : code postal manquant puis invalide.
  await continuer(page).click();
  const cp = page.getByLabel("Code postal");
  await expect(page.getByText(MESSAGES.postalCode)).toBeVisible();
  await expect(cp).toBeFocused();
  await expect(cp).toHaveAttribute("aria-invalid", "true");
  await cp.fill("926");
  await continuer(page).click();
  await expect(page.getByText(MESSAGES.postalCode)).toBeVisible();
  await cp.fill("92600");
  await continuer(page).click();

  // Question 3 : surface et pièces manquantes, focus sur la surface.
  await continuer(page).click();
  await expect(page.getByText(MESSAGES.surface)).toBeVisible();
  await expect(page.getByText(MESSAGES.rooms)).toBeVisible();
  await expect(page.getByLabel("Surface habitable, en m²")).toBeFocused();
  await page.getByLabel("Surface habitable, en m²").fill("90");
  await continuer(page).click();
  await expect(page.getByText(MESSAGES.rooms)).toBeVisible();
  await expect(
    page.getByRole("radio", { name: "1", exact: true }),
  ).toBeFocused();
  await page.getByRole("radio", { name: "4", exact: true }).check();
  await continuer(page).click();

  // Question 4 : échéance.
  await continuer(page).click();
  await expect(page.getByText(MESSAGES.echeance)).toBeVisible();
  await page.getByRole("radio", { name: "Je ne sais pas encore" }).check();
  await continuer(page).click();

  // Question 5 : e-mail manquant, premier champ en erreur.
  await page.getByLabel("Prénom").fill("Camille");
  await page.getByLabel("Nom", { exact: true }).fill("Essai");
  await envoyer(page).click();
  await expect(page.getByText(MESSAGES.email)).toBeVisible();
  await expect(page.getByText(MESSAGES.rgpd)).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeFocused();

  // Retour du navigateur : question précédente, réponse conservée.
  await page.getByRole("button", { name: "Question précédente" }).click();
  await expect(question(page)).toHaveText(titre("Quand pensez-vous vendre ?"));
  await expect(
    page.getByRole("radio", { name: "Je ne sais pas encore" }),
  ).toBeChecked();

  expect(await mock.requests(page.request, "/evaluation")).toHaveLength(0);
});

test("consentement RGPD obligatoire", async ({ page }, info) => {
  const debut = await ouvrir(page);
  await questions1a4(page);
  await coordonnees(page, `rgpd-${info.project.name}@example.com`, false);
  await attendreAntiSpam(page, debut);
  await envoyer(page).click();

  const accord = page.getByRole("checkbox");
  await expect(page.getByText(MESSAGES.rgpd)).toBeVisible();
  await expect(accord).toBeFocused();
  await expect(accord).toHaveAttribute("aria-invalid", "true");
  expect(await mock.requests(page.request, "/evaluation")).toHaveLength(0);

  await accord.check();
  await expect(page.getByText(MESSAGES.rgpd)).toHaveCount(0);
  await envoyer(page).click();
  await expect(
    page.getByRole("heading", { name: "Votre demande est bien arrivée." }),
  ).toBeVisible();
  const recus = await mock.requests(page.request, "/evaluation");
  expect(recus).toHaveLength(1);
  expect(recus[0].body).toMatchObject({ rgpd: true });
});

test("double clic : un seul envoi", async ({ page }, info) => {
  const debut = await ouvrir(page);
  await questions1a4(page);
  await coordonnees(page, `double-${info.project.name}@example.com`);
  await attendreAntiSpam(page, debut);
  await envoyer(page).dblclick();
  await expect(
    page.getByRole("heading", { name: "Votre demande est bien arrivée." }),
  ).toBeVisible();
  // Laisse le temps à un éventuel second envoi d'arriver au mock.
  await page.waitForTimeout(1_000);
  expect(await mock.requests(page.request, "/evaluation")).toHaveLength(1);
});

test("échec de l'API : message d'erreur, saisie conservée, nouvel essai", async ({
  page,
}, info) => {
  const email = `echec-${info.project.name}@example.com`;
  await mock.failNext(page.request, "/evaluation", 500);
  const debut = await ouvrir(page);
  await questions1a4(page);
  await coordonnees(page, email);
  await attendreAntiSpam(page, debut);
  await envoyer(page).click();

  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    MESSAGES.sendFailed,
  );
  await expect(question(page)).toHaveText(titre("Comment vous recontacter ?"));
  await expect(page.getByLabel("Prénom")).toHaveValue("Camille");
  await expect(page.getByLabel("E-mail")).toHaveValue(email);
  await expect(page.getByLabel("Téléphone")).toHaveValue("0612345678");
  await expect(page.getByRole("checkbox")).toBeChecked();
  await expect(envoyer(page)).toHaveText("Envoyer ma demande");
  await expect(envoyer(page)).toBeEnabled();

  // Le second essai passe (l'échec simulé ne vaut qu'une fois).
  await envoyer(page).click();
  await expect(
    page.getByRole("heading", { name: "Votre demande est bien arrivée." }),
  ).toBeVisible();
  expect(await mock.requests(page.request, "/evaluation")).toHaveLength(2);
});
