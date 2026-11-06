import { readFileSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";
import { capturer, finAnimations } from "../support/recette";

// Tunnel d'estimation (brief §9, A1, A17, A18, A23, A34 ; doc 04 §3.5).
// Le vidage de sessionStorage après envoi et « Recommencer » est dans 40,
// axe dans 50. Chaque envoi est retrouvé dans le mock par une adresse
// e-mail propre au test (le journal du mock n'est jamais remis à zéro).

const DELAI_ANTI_SPAM_MS = 4_500;
const S = "[\\s\\u00a0\\u202f]";

/** Fin du changement d'étape : le focus passe au titre de l'étape (§7). */
async function etapePrete(page: Page) {
  await expect(page.locator("[data-titre-etape]")).toBeFocused();
  await finAnimations(page);
}
const continuer = (page: Page) =>
  page.getByRole("button", { name: "Continuer" }).click();
const envoyer = (page: Page) =>
  page.getByRole("button", { name: "Envoyer la demande" });

async function etape1(
  page: Page,
  type: "Appartement" | "Maison" = "Appartement",
) {
  await page.getByRole("radio", { name: type, exact: true }).check();
  await page.locator('input[name="postalCode"]').fill("92600");
  await continuer(page);
  await expect(page).toHaveURL(/etape=2/);
  await etapePrete(page);
}
async function etape2(page: Page, pieces = "3 pièces") {
  await page.locator('input[name="surface"]').fill("59.5");
  await page.getByRole("radio", { name: pieces, exact: true }).check();
  await continuer(page);
  await expect(page).toHaveURL(/etape=3/);
  await etapePrete(page);
}
async function etape3(page: Page, email: string) {
  await page.locator('input[name="firstName"]').fill("Camille");
  await page.locator('input[name="lastName"]').fill("Essai");
  await page.locator('input[name="email"]').fill(email);
  await continuer(page);
  await expect(page).toHaveURL(/etape=4/);
  await etapePrete(page);
}
const cocherRgpd = (page: Page) =>
  page.locator('label[for="estimation-rgpd"]').click();

async function attendreAntiSpam(page: Page) {
  // Délai entier : `startedAt` est posé à l'hydratation, qui peut suivre
  // l'ouverture de plusieurs secondes sur une route compilée à froid.
  const reste = DELAI_ANTI_SPAM_MS;
  if (reste > 0) await page.waitForTimeout(reste);
}

const recusPour = async (page: Page, email: string) =>
  (await mock.requests(page.request, "/evaluation")).filter((r) =>
    JSON.stringify(r.body).includes(email),
  );

// Le repli <Suspense> (TunnelFallback) reste dans le flux HTML sous un nœud
// masqué : on ne lit que la progression rendue dans <main id="contenu">.
const progression = (page: Page) =>
  page.locator("#contenu").getByText(new RegExp(`^Étape${S}\\d${S}sur${S}4, `));

test.beforeEach(async ({ request }) => {
  await mock.scenario(request, "default");
});

test("4 étapes, progression A23, URL ?etape= et bouton Précédent", async ({
  page,
}, info) => {
  await page.goto("/estimation");
  await expect(progression(page)).toHaveText(
    new RegExp(`Étape${S}1${S}sur${S}4, votre bien`),
  );
  await etape1(page);
  await expect(progression(page)).toHaveText(
    new RegExp(`Étape${S}2${S}sur${S}4, ses caractéristiques`),
  );
  await etape2(page);
  await expect(progression(page)).toHaveText(
    new RegExp(`Étape${S}3${S}sur${S}4, vous`),
  );
  await page.goBack();
  await expect(page).toHaveURL(/etape=2/);
  await etapePrete(page);
  await expect(progression(page)).toHaveText(
    new RegExp(`Étape${S}2${S}sur${S}4`),
  );
  // Retour sans perte.
  await expect(page.locator('input[name="surface"]')).toHaveValue("59.5");
  await expect(
    page.getByRole("radio", { name: "3 pièces", exact: true }),
  ).toBeChecked();
  await page.goBack();
  await expect(page).toHaveURL(/\/estimation$/);
  await expect(
    page.getByRole("radio", { name: "Appartement", exact: true }),
  ).toBeChecked();
  await expect(page.locator('input[name="postalCode"]')).toHaveValue("92600");
  await page.goForward();
  await expect(page).toHaveURL(/etape=2/);
  await etapePrete(page);
  // Bouton « Retour » de l'interface.
  await page.getByRole("button", { name: "Retour" }).click();
  await expect(page).toHaveURL(/\/estimation$/);
  await expect(page.locator('input[name="postalCode"]')).toHaveValue("92600");
  await capturer(page, info, "estimation", "etape-1-remplie");
});

test("arrivée directe sur l'étape 3 : retour à la première étape incomplète", async ({
  page,
}) => {
  await page.goto("/estimation?etape=3");
  await expect(progression(page)).toHaveText(
    new RegExp(`Étape${S}1${S}sur${S}4`),
  );
  await expect(page).toHaveURL(/\/estimation$/);
});

test("objet de l'estimation : défaut et ?objet= (A1), options retirées absentes", async ({
  page,
}) => {
  await page.goto("/estimation");
  await expect(
    page.getByRole("radio", { name: "Le prix de vente" }),
  ).toBeChecked();
  await page.goto("/estimation?objet=loyer");
  await expect(page.getByRole("radio", { name: "Le loyer" })).toBeChecked();
  await page.goto("/estimation?objet=vente");
  await expect(
    page.getByRole("radio", { name: "Le prix de vente" }),
  ).toBeChecked();
  // Aucune des trois intentions retirées, à aucune étape.
  const interdites =
    /mise en vente envisagée|mise en location envisagée|juste une idée de prix/i;
  await expect(page.locator("body")).not.toContainText(interdites);
  await etape1(page);
  await expect(page.locator("body")).not.toContainText(interdites);
  await etape2(page);
  await expect(page.locator("body")).not.toContainText(interdites);
  await etape3(page, `objet-${Date.now()}@example.com`);
  await expect(page.locator("body")).not.toContainText(interdites);
});

test("messages de validation exacts (doc 04 §3.5)", async ({ page }, info) => {
  await page.goto("/estimation");
  await continuer(page);
  const main = page.locator("main");
  await expect(main).toContainText("Choisissez le type de bien.");
  await expect(main).toContainText(
    new RegExp(`Indiquez un code postal à 5${S}chiffres, par exemple 92600\\.`),
  );
  await page.getByRole("radio", { name: "Appartement", exact: true }).check();
  await page.locator('input[name="postalCode"]').fill("926");
  await continuer(page);
  await expect(main).toContainText(/Indiquez un code postal à 5.chiffres/);
  await page.locator('input[name="postalCode"]').fill("92600");
  await continuer(page);
  await expect(page).toHaveURL(/etape=2/);
  await etapePrete(page);

  await continuer(page);
  await expect(main).toContainText(
    "Indiquez la surface en m², par exemple 62.",
  );
  await expect(main).toContainText("Indiquez le nombre de pièces.");
  await page.locator('input[name="surface"]').fill("3");
  await page.getByRole("radio", { name: "2 pièces", exact: true }).check();
  await page.locator('select[name="bedrooms"]').selectOption("3");
  await continuer(page);
  await expect(main).toContainText(
    new RegExp(`La surface doit être comprise entre 8${S}et 2${S}000${S}m²\\.`),
  );
  await expect(main).toContainText(
    "Le nombre de chambres ne peut pas dépasser le nombre de pièces.",
  );
  await capturer(page, info, "estimation", "etape-2-erreurs");
  await page.locator('input[name="surface"]').fill("52");
  await page.locator('select[name="bedrooms"]').selectOption("1");
  await continuer(page);
  await expect(page).toHaveURL(/etape=3/);
  await etapePrete(page);

  await page.locator('input[name="email"]').fill("pas-une-adresse");
  await page.locator('input[name="phone"]').fill("12");
  // Sortie du champ d'abord : son message (validation au blur) décale le
  // bouton, et le clic tomberait à côté.
  await page.locator('input[name="phone"]').blur();
  await continuer(page);
  await expect(main).toContainText("Indiquez votre prénom.");
  await expect(main).toContainText("Indiquez votre nom.");
  await expect(main).toContainText(
    "Indiquez une adresse e-mail valide, par exemple nom@exemple.fr.",
  );
  await expect(main).toContainText(
    /Ce numéro ne semble pas valide\. Indiquez un numéro français à 10.chiffres\./,
  );
  await page.locator('input[name="firstName"]').fill("Camille");
  await page.locator('input[name="lastName"]').fill("Essai");
  await page
    .locator('input[name="email"]')
    .fill(`validation-${Date.now()}@example.com`);
  await page.locator('input[name="phone"]').fill("");
  await continuer(page);
  await expect(page).toHaveURL(/etape=4/);
  await etapePrete(page);

  // RGPD non cochée par défaut, obligatoire.
  await expect(page.locator('input[name="rgpd"]')).not.toBeChecked();
  await envoyer(page).click();
  await expect(main).toContainText(
    "Votre accord est nécessaire pour que nous puissions vous recontacter.",
  );
  await capturer(page, info, "estimation", "etape-4-erreurs");
});

test("reprise depuis sessionStorage après rechargement, avec « Recommencer »", async ({
  page,
}) => {
  await page.goto("/estimation");
  await etape1(page);
  await page.locator('input[name="surface"]').fill("70");
  await page.waitForTimeout(800); // sauvegarde différée de 300 ms
  await page.reload();
  await expect(
    page.getByText("Nous avons retrouvé vos réponses."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Recommencer" })).toBeVisible();
  await expect(page.locator('input[name="surface"]')).toHaveValue("70");
});

test("charge utile du mock : champs, chaînes, rgpd, source, intent, sans timeframe (A34)", async ({
  page,
}, info) => {
  const email = `charge-${info.project.name}-${Date.now()}@example.com`;
  await page.goto("/estimation?objet=loyer");
  await etape1(page, "Maison");
  await etape2(page, "5 pièces ou plus");
  await etape3(page, email);
  // Récapitulatif : « 5 pièces ou plus », jamais « 5+ ».
  await expect(page.locator("main")).toContainText(/5.pièces ou plus/);
  await expect(page.locator("main")).not.toContainText("5+");
  await cocherRgpd(page);
  await attendreAntiSpam(page);
  // Double clic : un seul POST.
  await envoyer(page).dblclick();
  const h1 = page.getByRole("heading", {
    level: 1,
    name: "Votre demande est bien arrivée.",
  });
  await expect(h1).toBeVisible();
  await expect(h1).toBeFocused();
  await finAnimations(page);
  await capturer(page, info, "estimation", "confirmation");

  // Aucun délai annoncé (brief §10-9, non validé).
  const texte = await page.locator("main").innerText();
  expect(texte).not.toMatch(
    /\b(24|48|72)\s?h\b|heures|jours ouvrés|sous \d|dans les \d/i,
  );
  expect(
    await page.evaluate(() => sessionStorage.getItem("cr:estimation:v1")),
  ).toBeNull();

  await page.waitForTimeout(1_000);
  const recus = await recusPour(page, email);
  expect(recus, "un seul POST malgré le double clic").toHaveLength(1);
  const body = recus[0].body as Record<string, unknown>;
  for (const champ of [
    "propertyType",
    "postalCode",
    "firstName",
    "lastName",
    "email",
  ]) {
    expect(body[champ], champ).toBeTruthy();
  }
  expect(body).toMatchObject({
    propertyType: "MAISON",
    postalCode: "92600",
    rgpd: true,
    source: "vitrine/estimation",
    intent: "ESTIMATION_LOYER",
    rooms: "5+",
    surface: "59.5",
  });
  expect(body).not.toHaveProperty("timeframe");
  for (const [k, v] of Object.entries(body)) {
    expect(typeof v === "number", `${k} envoyé en nombre`).toBe(false);
    expect(String(v)).not.toMatch(/\bNaN\b|\bundefined\b|\bnull\b/);
  }
});

test("erreur 500 : bandeau, données conservées, puis renvoi réussi", async ({
  page,
}, info) => {
  const email = `echec-${info.project.name}-${Date.now()}@example.com`;
  await page.goto("/estimation");
  await etape1(page);
  await etape2(page);
  await etape3(page, email);
  await cocherRgpd(page);
  await attendreAntiSpam(page);
  await mock.failNext(page.request, "/evaluation", 500);
  await envoyer(page).click();
  const bandeau = page
    .getByRole("alert")
    .filter({ hasText: "n’a pas pu être envoyée" });
  await expect(bandeau).toBeVisible();
  await expect(bandeau).toContainText(
    /conservées : réessayez dans un instant, ou appelez-nous au 01.73.64.56.10\./,
  );
  await expect(page).toHaveURL(/etape=4/);
  await expect(page.locator("main")).toContainText(email);
  await capturer(page, info, "estimation", "echec-500");
  await envoyer(page).click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Votre demande est bien arrivée.",
    }),
  ).toBeVisible();
  const recus = await recusPour(page, email);
  expect(recus).toHaveLength(2); // l'échec simulé, puis le renvoi
});

test("champ piège rempli : succès affiché, aucun POST", async ({
  page,
}, info) => {
  const email = `piege-${info.project.name}-${Date.now()}@example.com`;
  await page.goto("/estimation");
  await etape1(page);
  await etape2(page);
  await etape3(page, email);
  await cocherRgpd(page);
  await page.$eval("#site_web", (el) => {
    (el as HTMLInputElement).value = "https://exemple.invalid";
  });
  await attendreAntiSpam(page);
  await envoyer(page).click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Votre demande est bien arrivée.",
    }),
  ).toBeVisible();
  await page.waitForTimeout(500);
  expect(await recusPour(page, email)).toHaveLength(0);
});

test("envoi en moins de 4 s : succès affiché, aucun POST", async ({
  page,
}, info) => {
  const email = `rapide-${info.project.name}-${Date.now()}@example.com`;
  // Réponses complètes déposées avant le premier rendu, saisie commencée à
  // l'instant : l'envoi part en moins de 4 s.
  await page.addInitScript((mail) => {
    if (sessionStorage.getItem("e2e:injecte")) return;
    sessionStorage.setItem("e2e:injecte", "1");
    const now = Date.now();
    sessionStorage.setItem(
      "cr:estimation:v1",
      JSON.stringify({
        v: 1,
        savedAt: now,
        startedAt: now,
        referer: "",
        state: {
          intent: "ESTIMATION_VENTE",
          propertyType: "APPARTEMENT",
          address: "",
          postalCode: "92600",
          city: "",
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
          email: mail,
          phone: "",
          contactPreference: "",
          contactMoment: "",
          message: "",
          rgpd: false,
        },
      }),
    );
  }, email);
  await page.goto("/estimation?etape=4");
  await cocherRgpd(page);
  await envoyer(page).click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Votre demande est bien arrivée.",
    }),
  ).toBeVisible();
  await page.waitForTimeout(500);
  expect(await recusPour(page, email)).toHaveLength(0);
});

test("aucune clé API dans le JavaScript client", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Bundles identiques : une fois.");
  const corps: string[] = [];
  page.on("response", async (r) => {
    if (r.request().resourceType() !== "script") return;
    try {
      corps.push(await r.text());
    } catch {
      /* réponse vidée */
    }
  });
  for (const chemin of ["/", "/estimation", "/contact", "/biens/10.131"]) {
    await page.goto(chemin);
    await page.waitForLoadState("networkidle");
  }
  const secrets = ["PUBLIC_API_KEY", "e2e-test-key"];
  try {
    const env = readFileSync(".env.local", "utf8");
    const reelle = env.match(/^PUBLIC_API_KEY=["']?([^"'\n]+)/m)?.[1];
    if (reelle) secrets.push(reelle);
  } catch {
    /* pas de .env.local */
  }
  expect(corps.length).toBeGreaterThan(0);
  for (const s of secrets) {
    const trouve = corps.some((c) => c.includes(s));
    // Le nom du secret n'est pas affiché s'il s'agit de la vraie clé.
    expect(
      trouve,
      `secret n° ${secrets.indexOf(s)} présent dans un bundle client`,
    ).toBe(false);
  }
});

// Revue finale n° 2, C-X8 : le cadre lait du tunnel occupe les colonnes 5 à
// 12 et finit sur le bord droit de l'en-tête (« Quitter »), à ±1 px. Le cadre
// est retrouvé sans dépendre de ses classes : premier ancêtre du titre
// d'étape qui porte une bordure visible.
test.describe("cadre du tunnel aligné sur l'en-tête (C-X8)", () => {
  for (const largeur of [1024, 1440]) {
    test(`${largeur} px : bord droit du cadre = bord droit de l'en-tête`, async ({
      page,
    }, info) => {
      test.skip(info.project.name !== "desktop", "Largeurs desktop.");
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto("/estimation");
      await expect(page.locator("#contenu [data-titre-etape]")).toBeVisible();
      await finAnimations(page);
      const m = await page.evaluate(() => {
        const titre = document.querySelector("#contenu [data-titre-etape]");
        let cadre = titre?.parentElement ?? null;
        while (cadre && cadre.id !== "contenu") {
          const s = getComputedStyle(cadre);
          if (
            Number.parseFloat(s.borderRightWidth) > 0 &&
            s.borderRightStyle !== "none"
          )
            break;
          cadre = cadre.parentElement;
        }
        const quitter = [
          ...document.querySelectorAll("header[data-mv-entete] a"),
        ].find((a) => a.textContent?.trim() === "Quitter");
        return {
          cadre:
            cadre && cadre.id !== "contenu"
              ? cadre.getBoundingClientRect().right
              : null,
          entete: quitter?.getBoundingClientRect().right ?? null,
        };
      });
      expect(m.cadre, "cadre du tunnel introuvable").not.toBeNull();
      expect(m.entete, "« Quitter » introuvable").not.toBeNull();
      expect(
        Math.abs((m.cadre ?? 0) - (m.entete ?? 0)),
        `cadre ${m.cadre} px, en-tête ${m.entete} px`,
      ).toBeLessThanOrEqual(1);
      await capturer(page, info, "estimation", `cadre-${largeur}`, false);
    });
  }
});
