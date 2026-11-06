import { expect, type Locator, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";
import { attendreAntiSpam, hydrate } from "../support/galerie";

// Tunnel d'estimation (/vendre/estimation) : six questions, une par écran,
// puis la Server Action `submitEstimation` → POST /evaluation (mock privé).
// Les envois attendent 4 s après l'affichage : plus tôt, la Server Action
// répond « succès » sans appeler l'API (anti-spam, MIN_FILL_MS).
//
// La saisie automatique de l'adresse appelle la Géoplateforme de l'IGN depuis
// le navigateur : elle est interceptée ici (réponse figée, ou panne simulée),
// aucun appel ne sort.

const URL = "/vendre/estimation";
const IGN = "https://data.geopf.fr/geocodage/**";

const MESSAGES = {
  propertyType: "Choisissez le type de bien.",
  postalCode: /Indiquez un code postal à 5\schiffres/,
  surface: /Indiquez la surface en m²/,
  rooms: "Indiquez le nombre de pièces.",
  condition: "Choisissez l’état qui s’en approche le plus.",
  echeance: "Choisissez une échéance, même approximative.",
  email: /Indiquez une adresse e-mail valide/,
  rgpd: "Votre accord est nécessaire pour que nous puissions vous recontacter.",
  sendFailed:
    /Votre demande n’a pas pu être envoyée\. Vos réponses sont conservées/,
};

/** Réponse de la Géoplateforme : la voie seule, sans numéro (cas réel). */
const VOIE_SEULE = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "92004_essai",
        name: "Rue de l’Essai",
        postcode: "92600",
        city: "Asnières-sur-Seine",
        type: "street",
      },
    },
  ],
};

test.beforeEach(async ({ request, page }) => {
  await mock.reset(request);
  await page.route(IGN, (route) => route.fulfill({ json: VOIE_SEULE }));
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
      .replace(/-/g, "-⁠?")
      .replace(/ /g, "\\s")}$`,
  );
const Q = {
  1: titre("Quel bien souhaitez-vous vendre ?"),
  2: titre("Où se trouve-t-il ?"),
  3: /Quelle est sa surface/,
  4: titre("Dans quel état est-il ?"),
  5: titre("Quand pensez-vous vendre ?"),
  6: titre("Comment vous recontacter ?"),
};
const continuer = (page: Page) =>
  page.getByRole("button", { name: "Continuer" });
const envoyer = (page: Page) =>
  page.getByRole("button", { name: /^(Envoyer ma demande|Envoi en cours…)$/ });
const choix = (page: Page, nom: string | RegExp) =>
  page.getByRole("radio", { name: nom });

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

/**
 * Questions 1 à 5 à la souris : un clic sur un choix unique passe à la
 * question suivante (Appartement, 92600, 48,5 m², 2 p., à rafraîchir, dès que
 * possible).
 */
async function questions1a5(page: Page) {
  await choix(page, "Appartement").click();
  await expect(question(page)).toHaveText(Q[2]);
  await page.getByLabel("Code postal").fill("92600");
  await page.getByLabel("Commune").fill("Asnières-sur-Seine");
  await continuer(page).click();
  await expect(question(page)).toHaveText(Q[3]);
  await page.getByLabel("Surface habitable, en m²").fill("48,5");
  await choix(page, "2").click();
  await continuer(page).click();
  await expect(question(page)).toHaveText(Q[4]);
  await choix(page, /^À rafraîchir/).click();
  await expect(question(page)).toHaveText(Q[5]);
  await choix(page, "Dès que possible").click();
  await expect(question(page)).toHaveText(Q[6]);
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

  // Question 1 : au clavier, Espace choisit sans faire avancer.
  await question(page).focus();
  await tabVers(page, choix(page, "Appartement"));
  await k.press("Space");
  await expect(choix(page, "Appartement")).toBeChecked();
  await page.waitForTimeout(500);
  await expect(question(page)).toHaveText(Q[1]);
  await tabVers(page, continuer(page));
  await k.press("Enter");

  // Question 2 : saisie automatique au clavier ; le numéro tapé est gardé
  // même si le service ne propose que la voie.
  await expect(question(page)).toHaveText(Q[2]);
  await expect(question(page)).toBeFocused();
  await k.press("Tab");
  const adresse = page.getByRole("combobox", { name: /Adresse/ });
  await expect(adresse).toBeFocused();
  await k.type("12 rue de l’Essai");
  const option = page.getByRole("option", { name: /12 Rue de l’Essai/ });
  await expect(option).toBeVisible();
  await k.press("ArrowDown");
  await expect(option).toHaveAttribute("aria-selected", "true");
  await k.press("Enter");
  await expect(adresse).toHaveValue("12 Rue de l’Essai");
  await expect(page.getByLabel("Code postal")).toHaveValue("92600");
  await expect(page.getByLabel("Commune")).toHaveValue("Asnières-sur-Seine");
  await k.press("Enter");

  // Question 3 : surface, puis pièces aux flèches.
  await expect(question(page)).toHaveText(Q[3]);
  await expect(question(page)).toBeFocused();
  await k.press("Tab");
  await k.type("48,5");
  await tabVers(page, choix(page, "1"));
  await k.press("ArrowRight");
  await expect(choix(page, "2")).toBeChecked();
  await tabVers(page, continuer(page));
  await k.press("Enter");

  // Question 4 : les flèches changent l'état sans faire avancer.
  await expect(question(page)).toHaveText(Q[4]);
  await tabVers(page, choix(page, /^Neuf ou refait/));
  await k.press("ArrowDown");
  await k.press("ArrowDown");
  await expect(choix(page, /^À rafraîchir/)).toBeChecked();
  await page.waitForTimeout(500);
  await expect(question(page)).toHaveText(Q[4]);
  await tabVers(page, continuer(page));
  await k.press("Enter");

  // Question 5 : échéance.
  await expect(question(page)).toHaveText(Q[5]);
  await tabVers(page, choix(page, "Dès que possible"));
  await k.press("ArrowDown");
  await expect(choix(page, "Dans les trois mois")).toBeChecked();
  await tabVers(page, continuer(page));
  await k.press("Enter");

  // Question 6 : coordonnées, mot libre et accord.
  await expect(question(page)).toHaveText(Q[6]);
  await k.press("Tab");
  await k.type("Camille");
  await k.press("Tab");
  await k.type("Essai");
  await k.press("Tab");
  await k.type(email);
  await k.press("Tab");
  await k.type("06 12 34 56 78");
  await k.press("Tab");
  await expect(page.getByLabel(/Un mot à ajouter/)).toBeFocused();
  await k.type("Parquet refait.");
  await tabVers(page, page.getByRole("checkbox"));
  await k.press("Space");
  await expect(page.getByRole("checkbox")).toBeChecked();

  // Le cartel récapitule les réponses (masqué sous 1100 px).
  if (info.project.name === "desktop") {
    const recap = page.getByRole("complementary", { name: "Votre bien" });
    await expect(recap).toContainText("Appartement");
    await expect(recap).toContainText("12 Rue de l’Essai");
    await expect(recap).toContainText("À rafraîchir");
    await expect(recap).toContainText("Dans les trois mois");
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
  await expect(page.getByRole("main")).toContainText(
    /Une question d’ici là\s?\?\sAppelez-nous au 01\s73\s64\s56\s10/,
  );

  const recus = await mock.requests(page.request, "/evaluation");
  expect(recus).toHaveLength(1);
  expect(recus[0].body).toMatchObject({
    propertyType: "APPARTEMENT",
    postalCode: "92600",
    address: "12 Rue de l’Essai, Asnières-sur-Seine",
    surface: "48.5",
    rooms: "2",
    condition: "A_RAFRAICHIR",
    timeframe: "Dans les trois mois",
    situation: "vente",
    intent: "ESTIMATION_VENTE",
    firstName: "Camille",
    lastName: "Essai",
    email: `estimation-${info.project.name}@example.com`,
    phone: "06 12 34 56 78",
    message: "[Message]\nParquet refait.",
    rgpd: true,
    source: "vitrine/estimation",
    referer: URL,
  });
  // L'échéance n'est plus recopiée dans le message.
  expect(JSON.stringify(recus[0].body)).not.toContain("Échéance du projet");
  // Le brouillon est effacé après l'envoi.
  expect(
    await page.evaluate(() => sessionStorage.getItem("cr:estimation:v1")),
  ).toBeNull();
});

test("souris : un clic avance, retour possible, la question reste à l'écran", async ({
  page,
}) => {
  await ouvrir(page);
  await choix(page, "Maison").click();
  await expect(question(page)).toHaveText(Q[2]);
  await expect(page).toHaveURL(/\?question=2$/);
  await expect(question(page)).toBeFocused();

  // Retour du navigateur : la réponse est gardée ; recliquer le même choix
  // fait de nouveau avancer.
  await page.goBack();
  await expect(question(page)).toHaveText(Q[1]);
  await expect(choix(page, "Maison")).toBeChecked();
  await choix(page, "Maison").click();
  await expect(question(page)).toHaveText(Q[2]);

  await page.getByLabel("Code postal").fill("92600");
  await continuer(page).click();
  await page.getByLabel("Surface habitable, en m²").fill("120");
  await choix(page, "5 ou plus").click();
  await continuer(page).click();
  await choix(page, /^Bon état/).click();
  await expect(question(page)).toHaveText(Q[5]);
  // Sur mobile comme sur grand écran, la nouvelle question est visible.
  await expect(question(page)).toBeInViewport();
  await page.getByRole("button", { name: "Question précédente" }).click();
  await expect(question(page)).toHaveText(Q[4]);
  await expect(choix(page, /^Bon état/)).toBeChecked();
});

test("brouillon : gardé au rechargement, effacé par « Recommencer »", async ({
  page,
}) => {
  await ouvrir(page);
  await choix(page, "Appartement").click();
  await page.getByLabel("Code postal").fill("92600");
  await continuer(page).click();
  await page.getByLabel("Surface habitable, en m²").fill("48,5");
  await choix(page, "2").click();
  await continuer(page).click();
  await expect(question(page)).toHaveText(Q[4]);

  await page.reload();
  await hydrate(continuer(page));
  await expect(question(page)).toHaveText(Q[4]);
  await expect(page).toHaveURL(/\?question=4$/);
  await expect(
    page.getByText("Nous avons repris vos réponses là où vous les aviez"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Question précédente" }).click();
  await expect(question(page)).toHaveText(Q[3]);
  await expect(page.getByLabel("Surface habitable, en m²")).toHaveValue("48,5");
  await expect(choix(page, "2")).toBeChecked();

  await page.getByRole("button", { name: "Recommencer" }).click();
  await expect(question(page)).toHaveText(Q[1]);
  await expect(choix(page, "Appartement")).not.toBeChecked();
  expect(
    await page.evaluate(() => sessionStorage.getItem("cr:estimation:v1")),
  ).toBeNull();
  await page.reload();
  await hydrate(continuer(page));
  await expect(question(page)).toHaveText(Q[1]);
  await expect(page.getByRole("button", { name: "Recommencer" })).toHaveCount(
    0,
  );
});

test("adresse : service indisponible, saisie à la main", async ({ page }) => {
  await page.unroute(IGN);
  await page.route(IGN, (route) => route.abort());
  await ouvrir(page);
  await choix(page, "Appartement").click();
  await page.getByRole("combobox", { name: /Adresse/ }).fill("12 rue Voltaire");
  await expect(
    page.getByText("La saisie automatique ne répond pas"),
  ).toBeVisible();
  await expect(page.getByRole("option")).toHaveCount(0);
  await page.getByLabel("Code postal").fill("92600");
  await continuer(page).click();
  await expect(question(page)).toHaveText(Q[3]);
});

test("validation : erreurs sur les champs requis, focus sur le premier", async ({
  page,
}) => {
  await ouvrir(page);

  // Question 1 sans choix.
  await continuer(page).click();
  await expect(page.getByText(MESSAGES.propertyType)).toBeVisible();
  await expect(choix(page, "Appartement")).toBeFocused();
  await expect(question(page)).toHaveText(Q[1]);
  await choix(page, "Maison").click();
  await expect(question(page)).toHaveText(Q[2]);

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
  await expect(choix(page, "1")).toBeFocused();
  await choix(page, "4").check();
  await continuer(page).click();

  // Question 4 : état.
  await continuer(page).click();
  await expect(page.getByText(MESSAGES.condition)).toBeVisible();
  await expect(choix(page, /^Neuf ou refait/)).toBeFocused();
  await choix(page, /^À rénover/).click();
  await expect(question(page)).toHaveText(Q[5]);

  // Question 5 : échéance.
  await continuer(page).click();
  await expect(page.getByText(MESSAGES.echeance)).toBeVisible();
  await choix(page, "Je ne sais pas encore").click();
  await expect(question(page)).toHaveText(Q[6]);

  // Question 6 : e-mail manquant, premier champ en erreur.
  await page.getByLabel("Prénom").fill("Camille");
  await page.getByLabel("Nom", { exact: true }).fill("Essai");
  await envoyer(page).click();
  await expect(page.getByText(MESSAGES.email)).toBeVisible();
  await expect(page.getByText(MESSAGES.rgpd)).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeFocused();

  // Retour : question précédente, réponse conservée.
  await page.getByRole("button", { name: "Question précédente" }).click();
  await expect(question(page)).toHaveText(Q[5]);
  await expect(choix(page, "Je ne sais pas encore")).toBeChecked();

  expect(await mock.requests(page.request, "/evaluation")).toHaveLength(0);
});

test("consentement RGPD obligatoire", async ({ page }, info) => {
  const debut = await ouvrir(page);
  await questions1a5(page);
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
  expect(recus[0].body).toMatchObject({
    rgpd: true,
    condition: "A_RAFRAICHIR",
    timeframe: "Dès que possible",
    situation: "vente",
  });
});

test("double clic : un seul envoi", async ({ page }, info) => {
  const debut = await ouvrir(page);
  await questions1a5(page);
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
  await questions1a5(page);
  await coordonnees(page, email);
  await attendreAntiSpam(page, debut);
  await envoyer(page).click();

  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    MESSAGES.sendFailed,
  );
  await expect(question(page)).toHaveText(Q[6]);
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
