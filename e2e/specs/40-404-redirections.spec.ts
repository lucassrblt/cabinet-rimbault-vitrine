import { expect, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";
import {
  cadrePresent,
  PAGE_INTROUVABLE,
  suivreConsole,
} from "../support/galerie";

// Pages 404 de la Galerie, lisibles sans JavaScript, et redirections 307
// des anciennes adresses (next.config.ts).

test.beforeEach(async ({ request }) => {
  await mock.reset(request);
});

async function pageIntrouvableComplete(page: Page, h1: string) {
  // Pas d'enveloppe d'erreur vide : le HTML servi contient la page.
  await expect(page.locator("html#__next_error__")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  const titre = page.getByRole("heading", { level: 1 });
  await expect(titre).toHaveCount(1);
  await expect(titre).toHaveText(h1);
  await expect(titre).toBeVisible();
  await cadrePresent(page);
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: "Accueil" })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(main.getByRole("link", { name: "Nos biens" })).toHaveAttribute(
    "href",
    "/biens",
  );
  await expect(
    main.getByRole("link", { name: "01 73 64 56 10" }),
  ).toHaveAttribute("href", "tel:+33173645610");
  const robots = page.locator('meta[name="robots"]');
  await expect(robots, "une seule meta robots").toHaveCount(1);
  await expect(robots).toHaveAttribute("content", /noindex/);
}

const CAS = [
  {
    nom: "fiche inconnue",
    chemin: "/biens/ZZ",
    h1: "Ce bien n’est plus en ligne.",
  },
  {
    nom: "URL inconnue",
    chemin: PAGE_INTROUVABLE,
    h1: "Cette page n’existe pas ou n’existe plus.",
  },
  {
    // La variante « bien disparu » n'est pas une adresse : 404 générale.
    nom: "variante tapée telle quelle",
    chemin: "/biens-introuvable",
    h1: "Cette page n’existe pas ou n’existe plus.",
  },
];

for (const cas of CAS) {
  test(`404 · ${cas.nom} (${cas.chemin})`, async ({ page }) => {
    const erreurs = suivreConsole(page, 404);
    const res = await page.goto(cas.chemin);
    expect(res?.status(), "statut HTTP").toBe(404);
    await pageIntrouvableComplete(page, cas.h1);
    expect(erreurs, erreurs.join("\n")).toEqual([]);
  });

  test.describe("sans JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    test(`404 lisible · ${cas.nom} (${cas.chemin})`, async ({ page }) => {
      const res = await page.goto(cas.chemin);
      expect(res?.status(), "statut HTTP").toBe(404);
      await pageIntrouvableComplete(page, cas.h1);
    });
  });
}

test("URL inconnue : titre « Page introuvable »", async ({ page }) => {
  await page.goto(PAGE_INTROUVABLE);
  await expect(page).toHaveTitle("Page introuvable | Cabinet Rimbault");
});

// Titre commun à toutes les 404 (décision du 06/11/2026) : servie par la
// réécriture du proxy avec le statut 404, la page du bien disparu reçoit les
// métadonnées de la 404 générale (Next 16.3, `is404` dans app-render). Seul le
// corps distingue le bien disparu (h1 « Ce bien n’est plus en ligne. »).
test("fiche inconnue : titre commun « Page introuvable »", async ({ page }) => {
  await page.goto("/biens/ZZ");
  await expect(page).toHaveTitle("Page introuvable | Cabinet Rimbault");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Ce bien n’est plus en ligne.",
  );
});

test("fiche d'un bien retiré (scénario empty) : 404 « bien disparu »", async ({
  page,
  request,
}) => {
  await mock.scenario(request, "empty");
  try {
    const res = await page.goto("/biens/10.131");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Ce bien n’est plus en ligne.",
    );
  } finally {
    await mock.scenario(request, "default");
  }
});

// Anciennes adresses du site de main (audit du site en ligne, §3.1) et du
// banc `/galerie/...`. `/cookies` vise l'ancre `#cookies` : le fragment ne
// part pas au serveur, seul le chemin est comparé ici.
const REDIRECTIONS = [
  ["/acheter", "/biens"],
  ["/louer", "/biens"],
  ["/bien/10.131", "/biens/10.131"],
  ["/agence", "/le-cabinet"],
  ["/politique-de-confidentialite", "/confidentialite"],
  ["/cookies", "/confidentialite"],
  ["/estimation", "/vendre/estimation"],
  ["/galerie", "/"],
  ["/galerie/biens", "/biens"],
  ["/galerie/biens/10.131", "/biens/10.131"],
  ["/galerie/le-cabinet", "/le-cabinet"],
] as const;

test("redirection 307 · /cookies → /confidentialite#cookies", async ({
  request,
}) => {
  const res = await request.get("/cookies", { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  expect(res.headers().location).toMatch(/\/confidentialite#cookies$/);
});

test("redirection 307 · /acheter garde la requête", async ({ request }) => {
  const res = await request.get("/acheter?commune=Asnieres", {
    maxRedirects: 0,
  });
  expect(res.status()).toBe(307);
  const cible = new URL(res.headers().location, "http://x");
  expect(cible.pathname).toBe("/biens");
  expect(cible.searchParams.get("commune")).toBe("Asnieres");
});

for (const [depuis, vers] of REDIRECTIONS) {
  test(`redirection 307 · ${depuis} → ${vers}`, async ({ request, page }) => {
    const res = await request.get(depuis, { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(new URL(res.headers().location, "http://x").pathname).toBe(vers);

    // Suivie par le navigateur, elle aboutit à une page en 200.
    const arrivee = await page.goto(depuis);
    expect(arrivee?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(vers);
  });
}
