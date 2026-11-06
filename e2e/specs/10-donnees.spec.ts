import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";
import { hydrate } from "../support/galerie";

// Données : la salle des biens et la fiche affichent ce que sert le mock
// (e2e/fixtures), dans les scénarios `default`, `empty` et `n12`.
// Le scénario est remis à `default` après chaque test.

type Fixture = {
  reference: string;
  transactionType: string;
  status: string;
  createdAt: string;
  finance: { price: number };
  characteristics: { surface: number };
  location: { city: string };
};

const FIXTURES: Fixture[] = JSON.parse(
  readFileSync(path.join(__dirname, "../fixtures/properties.json"), "utf8"),
).properties;

const VISIBLES = FIXTURES.filter((p) =>
  ["DISPONIBLE", "SOUS_OFFRE", "SOUS_COMPROMIS"].includes(p.status),
).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

const nombre = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
/** Toutes les espaces (fines, insécables) ramenées à l'espace simple. */
const espaces = (t: string) => t.replace(/[\s  ⁠]+/g, " ");

test.beforeEach(async ({ request }) => {
  await mock.reset(request);
});

test.afterEach(async ({ request }) => {
  await mock.scenario(request, "default");
});

const liste = (page: Page) =>
  page.getByRole("region", { name: "Liste des biens" }).getByRole("link");

test("salle des biens : références, prix et surfaces du mock", async ({
  page,
}) => {
  await page.goto("/biens");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    `${VISIBLES.length} biens`,
  );
  const lignes = liste(page);
  await expect(lignes).toHaveCount(VISIBLES.length);

  for (const [k, bien] of VISIBLES.entries()) {
    const ligne = lignes.nth(k);
    const texte = espaces((await ligne.textContent()) ?? "");
    expect(texte, `ligne ${k + 1}`).toContain(bien.reference);
    expect(texte).toContain(
      `${nombre.format(bien.finance.price)} €`.replace(/\s/g, " "),
    );
    expect(texte).toContain(
      `${nombre.format(bien.characteristics.surface)} m²`,
    );
    await expect(ligne).toHaveAttribute("href", `/biens/${bien.reference}`);
  }

  // Chaque bien est aussi accroché au mur, avec un lien vers sa fiche.
  for (const bien of VISIBLES) {
    await expect(
      page.locator(`main a[href="/biens/${bien.reference}"]`),
    ).toHaveCount(2);
  }
});

test("salle des biens : le lien mène à la fiche", async ({ page }) => {
  await page.goto("/biens");
  await hydrate(page.getByRole("banner"));
  await liste(page).filter({ hasText: "10.131" }).click();
  await expect(page).toHaveURL(/\/biens\/10\.131$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Appartement 2 pièces",
  );
});

test("fiche : prix, DPE, GES et galerie photo (clic et clavier)", async ({
  page,
}) => {
  await page.goto("/biens/10.131");
  const main = page.getByRole("main");
  await expect(main).toContainText("Réf. 10.131");
  expect(espaces((await main.textContent()) ?? "")).toContain("300 000 €");

  const energie = page.getByRole("region", {
    name: "Performance énergétique",
  });
  await expect(
    energie.getByRole("img", { name: /\(DPE\) : Classe D, 216 kWh/ }),
  ).toBeVisible();
  await expect(
    energie.getByRole("img", { name: /\(GES\) : Classe B, 6 kg/ }),
  ).toBeVisible();

  // Galerie : quatre photos. Le bouton « Photo suivante » est sur la grande
  // photo (desktop et mobile) ; son nom annonce la photo qu'il affichera.
  const suivante = page.getByRole("button", { name: /^Photo suivante/ });
  await expect(suivante).toHaveAccessibleName("Photo suivante, 2 sur 4");
  await hydrate(suivante);
  const grande = page.locator("figure img:not([alt=''])");
  const src1 = await grande.getAttribute("src");

  await suivante.click();
  await expect(suivante).toHaveAccessibleName("Photo suivante, 3 sur 4");
  await expect(grande).not.toHaveAttribute("src", src1 ?? "");

  // Clavier : flèche droite puis gauche depuis le bouton.
  await suivante.focus();
  await page.keyboard.press("ArrowRight");
  await expect(suivante).toHaveAccessibleName("Photo suivante, 4 sur 4");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(suivante).toHaveAccessibleName("Photo suivante, 2 sur 4");
  await expect(grande).toHaveAttribute("src", src1 ?? "");
  // Entrée sur le bouton : photo suivante.
  await page.keyboard.press("Enter");
  await expect(suivante).toHaveAccessibleName("Photo suivante, 3 sur 4");
});

test("fiche : vignettes (desktop)", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Vignettes masquées sous 900 px");
  await page.goto("/biens/10.131");
  const vignette3 = page.getByRole("button", { name: "Photo 3 sur 4" });
  await hydrate(vignette3);
  await vignette3.click();
  await expect(vignette3).toHaveAttribute("aria-current", "true");
  await expect(page.getByText("3 / 4", { exact: true })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("button", { name: "Photo 4 sur 4" }),
  ).toHaveAttribute("aria-current", "true");
});

test("scénario empty : salle vide, accueil sans exposition", async ({
  page,
  request,
}) => {
  await mock.scenario(request, "empty");
  await page.goto("/biens");
  await expect(page.getByRole("main")).toContainText(
    "Aucun bien en vente en ce moment.",
  );
  await expect(page.locator("main a[href^='/biens/']")).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Liste des biens" }),
  ).toHaveCount(0);

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Nos biens du moment/ }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Voir les biens", exact: true }),
  ).toBeVisible();
});

test("scénario n12 : douze biens accrochés et listés", async ({
  page,
  request,
}) => {
  await mock.scenario(request, "n12");
  await page.goto("/biens");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "12 biens",
  );
  await expect(liste(page)).toHaveCount(12);
  await expect(
    liste(page).filter({ hasText: "09.345-c6" }).first(),
  ).toBeAttached();

  // Une copie a sa fiche (celle du bien d'origine).
  const res = await page.goto("/biens/09.345-c6");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("main")).toContainText("Réf. 09.345-c6");
});

test("offre : vente seule tant qu'aucune location n'est publiée", async ({
  page,
}) => {
  await page.goto("/biens");
  await expect(page).toHaveTitle(
    "Nos biens à vendre à Asnières-sur-Seine | Cabinet Rimbault",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /à la vente, à Asnières/,
  );
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toContainText("Biens en vente");
  await expect(h1).not.toContainText("location");
});

test("offre : une location publiée (scénario edge) l'ajoute au titre et au h1", async ({
  page,
  request,
}) => {
  await mock.scenario(request, "edge");
  await page.goto("/biens");
  await expect(page).toHaveTitle(
    "Nos biens à vendre et à louer à Asnières-sur-Seine | Cabinet Rimbault",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /à la vente et à la location/,
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Biens en vente et en location",
  );
});
