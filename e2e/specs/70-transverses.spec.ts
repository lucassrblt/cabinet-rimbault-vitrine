import { expect, type Page, type TestInfo, test } from "@playwright/test";
import { mock } from "../mock-client";
import {
  auditerDom,
  capturer,
  finAnimations,
  PAGES,
  PAGES_PAR_SCENARIO,
  type PageRecette,
  parcourirLaPage,
  type Scenario,
  sautsDeNiveau,
  suivreLaPage,
} from "../support/recette";

// Critères transverses du brief §9, sur toutes les pages et les 4 scénarios
// du mock, en 1440 (projet desktop) et 390 (projet mobile), plus un contrôle
// à 320 px dans le projet mobile. Une page = un test ; chaque critère est une
// assertion souple (`expect.soft`) pour que le rapport les liste tous.
//
// Captures : docs/refonte/captures/T/recette/<scénario>/.

async function controlerPage(
  page: Page,
  info: TestInfo,
  scenario: Scenario,
  cible: PageRecette,
) {
  const statutAttendu = cible.statut ?? 200;
  const suivi = suivreLaPage(page, statutAttendu);
  const res = await page.goto(cible.chemin);
  const statut = res?.status();
  // Fiche en scénario `error` : la frontière d'erreur du site (500) est la
  // réponse attendue ; on la contrôle à part (80-pages).
  expect(statut, `statut de ${cible.chemin}`).toBe(statutAttendu);
  await page.waitForLoadState("networkidle");
  await parcourirLaPage(page);
  await finAnimations(page);

  const a = await auditerDom(page);
  const ctx = `${scenario} ${cible.chemin} (${info.project.name})`;

  expect.soft(a.lang, `${ctx} : lang`).toBe("fr");
  expect.soft(a.titre.trim(), `${ctx} : <title> vide`).not.toBe("");
  expect
    .soft(a.description?.trim() ?? "", `${ctx} : meta description`)
    .not.toBe("");
  expect.soft(a.h1, `${ctx} : un seul h1`).toHaveLength(1);
  expect
    .soft(sautsDeNiveau(a.titres), `${ctx} : niveau de titre sauté`)
    .toEqual([]);
  expect.soft(a.interdits, `${ctx} : chaînes interdites`).toEqual([]);
  // Revue finale n° 2 (C-P6, C-B4) : l'engagement « toutes taxes comprises
  // sur chaque annonce » est faux pour un mandat à la charge du vendeur. On
  // cherche dans tout le DOM (texte masqué, attributs, charge RSC comprise),
  // espaces normalisées.
  const engagementTtc = await page.evaluate(() => {
    const norm = (t: string) => t.replace(/[\s\u00a0\u202f]+/g, " ");
    const re = /toutes taxes comprises sur chaque annonce/i;
    return (
      re.test(norm(document.documentElement.textContent ?? "")) ||
      re.test(norm(document.documentElement.outerHTML))
    );
  });
  expect
    .soft(
      engagementTtc,
      `${ctx} : « toutes taxes comprises sur chaque annonce » dans le DOM`,
    )
    .toBe(false);
  expect.soft(a.premierePersonne, `${ctx} : « je » hors citations`).toEqual([]);
  expect
    .soft(a.apostrophesDroites, `${ctx} : apostrophe droite ' (U+0027)`)
    .toEqual([]);
  expect.soft(a.capitales, `${ctx} : capitales calculées`).toEqual([]);
  expect.soft(a.ombresFloues, `${ctx} : ombre portée floue`).toEqual([]);
  expect.soft(a.degrades, `${ctx} : dégradé`).toEqual([]);
  expect.soft(a.fixes, `${ctx} : élément position: fixed`).toEqual([]);
  expect.soft(a.recherche, `${ctx} : champ ou rôle de recherche`).toEqual([]);
  if (!["/estimation", "/contact"].includes(cible.chemin)) {
    expect.soft(a.selects, `${ctx} : <select> hors tunnel et contact`).toBe(0);
  }

  // Un seul bouton grenat dans le premier écran, jamais dans l'en-tête (A19).
  expect
    .soft(
      a.boutonsGrenatPremierEcran.length,
      `${ctx} : boutons grenat dans le premier écran ${JSON.stringify(a.boutonsGrenatPremierEcran)}`,
    )
    .toBeLessThanOrEqual(1);
  expect
    .soft(
      a.boutonsGrenatPremierEcran.filter((b) => b.dansEntete),
      `${ctx} : bouton grenat dans l'en-tête`,
    )
    .toEqual([]);

  // Images : photos de biens (Supabase) et illustrations seulement ; les
  // photos passent par /_next/image avec un alt non vide et non numérique.
  const etrangeres = a.images.filter(
    (i) => !i.photo && !i.illustration && !i.energie,
  );
  expect
    .soft(etrangeres, `${ctx} : image ni photo de bien ni illustration`)
    .toEqual([]);
  const photosFautives = a.images.filter(
    (i) =>
      i.photo &&
      (!i.optimisee || !i.alt?.trim() || /^\s*\d+\s*$/.test(i.alt ?? "")),
  );
  expect
    .soft(
      photosFautives,
      `${ctx} : photo sans /_next/image ou alt vide/numérique`,
    )
    .toEqual([]);

  // Défilement horizontal à la largeur du projet (1440 ou 390).
  expect
    .soft(a.debordement.scrollWidth, `${ctx} : défilement horizontal`)
    .toBeLessThanOrEqual(a.debordement.clientWidth);

  // Lien d'évitement en premier focus.
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.keyboard.press("Tab");
  const premierFocus = await page.evaluate(() => ({
    id: document.activeElement?.id ?? "",
    href: document.activeElement?.getAttribute("href") ?? "",
  }));
  expect
    .soft(premierFocus, `${ctx} : lien d'évitement en premier focus`)
    .toEqual({
      id: "evitement",
      href: "#contenu",
    });
  await page.keyboard.press("Escape");

  // En-tête et pied.
  await controlerEnteteEtPied(page, info, ctx, !!cible.tunnel);

  // Polices et cookies.
  expect
    .soft(suivi.policesExternes, `${ctx} : requête Google Fonts`)
    .toEqual([]);
  expect
    .soft(await page.context().cookies(), `${ctx} : cookie déposé`)
    .toEqual([]);

  await capturer(page, info, scenario, cible.nom);

  // Contrôle à 320 px (projet mobile).
  if (info.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.waitForTimeout(150);
    const d = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    expect
      .soft(d.sw, `${ctx} : défilement horizontal à 320 px`)
      .toBeLessThanOrEqual(d.cw);
    if (!cible.tunnel) {
      const entete = page.locator("header[data-mv-entete]");
      await expect
        .soft(
          entete.getByRole("link", { name: "Estimer", exact: true }),
          `${ctx} : « Estimer » sous 380 px`,
        )
        .toBeVisible();
    }
    await capturer(page, info, scenario, `${cible.nom}-320`);
    await page.setViewportSize({ width: 390, height: 664 });
  }

  expect(suivi.erreurs, `${ctx} : erreurs console ou pageerror`).toEqual([]);
}

async function controlerEnteteEtPied(
  page: Page,
  info: TestInfo,
  ctx: string,
  tunnel: boolean,
) {
  const entete = page.locator("header[data-mv-entete]");
  await expect.soft(entete, `${ctx} : en-tête unique`).toHaveCount(1);
  // Logotype par <Logotype /> (SVG role="img"), pas par du texte HTML.
  await expect
    .soft(
      entete.locator('svg[role="img"][aria-label]'),
      `${ctx} : logotype SVG de l'en-tête`,
    )
    .toHaveCount(1);
  if (tunnel) return;

  const desktop = info.project.name === "desktop";
  const position = await entete.evaluate((el) => getComputedStyle(el).position);
  expect
    .soft(position, `${ctx} : en-tête ${desktop ? "statique" : "collant"}`)
    .toBe(desktop ? "static" : "sticky");

  // « Faire estimer » de l'en-tête : secondaire, fond transparent au repos.
  const estimer = entete.locator('a[href="/estimation"]');
  await expect.soft(estimer).toHaveCount(1);
  const fond = await estimer.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  expect
    .soft(fond, `${ctx} : fond du « Faire estimer » de l'en-tête`)
    .toBe("rgba(0, 0, 0, 0)");
  await expect
    .soft(estimer, `${ctx} : libellé « Faire estimer » dès 380 px`)
    .toHaveAccessibleName(/^Faire estimer$/);

  // Navigation : 5 entrées (desktop) ; bouton texte « Menu » (mobile, A4).
  if (desktop) {
    await expect
      .soft(
        page
          .getByRole("navigation", { name: "Navigation principale" })
          .getByRole("link"),
      )
      .toHaveText(["Nos biens", "Vendre", "Louer", "Le cabinet", "Contact"]);
  } else {
    const menu = entete.getByRole("button", { name: "Menu", exact: true });
    await expect.soft(menu).toHaveAttribute("aria-expanded", "false");
    await expect.soft(menu).toHaveAttribute("aria-controls", /.+/);
    const taille = await menu.boundingBox();
    expect
      .soft(
        (taille?.height ?? 0) >= 48 && (taille?.width ?? 0) >= 48,
        `${ctx} : cible du menu 48 × 48`,
      )
      .toBe(true);
  }

  // Pied (A20) : trois colonnes, puis mentions professionnelles visibles.
  const pied = page.locator("footer#pied");
  await expect
    .soft(pied.locator("h2"))
    .toHaveText([
      "Nous trouver",
      "Le site",
      "Informations",
      "Mentions professionnelles",
    ]);
  for (const mention of [
    /Carte professionnelle/,
    /CCI/,
    /Garant financier/,
    /SAS/,
    /RCS/,
  ]) {
    await expect
      .soft(pied.getByText(mention).first(), `${ctx} : pied, ${mention}`)
      .toBeVisible();
  }
  await expect
    .soft(
      pied.locator('svg[role="img"][aria-label]'),
      `${ctx} : logotype SVG du pied`,
    )
    .toHaveCount(1);
  await expect
    .soft(
      pied.getByText(
        new RegExp(`© 2009-${new Date().getFullYear()} Cabinet Rimbault`),
      ),
    )
    .toBeVisible();
  const fondPied = await pied.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  expect.soft(fondPied, `${ctx} : pied grenat`).toBe("rgb(95, 26, 36)");
}

const SCENARIOS: Scenario[] = ["default", "edge", "empty", "error"];

for (const scenario of SCENARIOS) {
  test.describe(`transverses · ${scenario}`, () => {
    test.beforeEach(async ({ request }) => {
      await mock.scenario(request, scenario);
    });
    for (const cible of PAGES_PAR_SCENARIO[scenario]) {
      test(`${cible.chemin}`, async ({ page }, info) => {
        await controlerPage(page, info, scenario, cible);
      });
    }
  });
}

test.describe("transverses · routes de travail retirées (C-X1)", () => {
  for (const chemin of [
    "/design-system",
    "/design-system/mouvement",
    "/design-system/mouvement/suite",
  ]) {
    test(`${chemin} : 404`, async ({ request }, info) => {
      test.skip(info.project.name !== "desktop", "Contrôle serveur, une fois.");
      const res = await request.get(chemin);
      expect(res.status(), `${chemin} répond encore`).toBe(404);
    });
  }
});

test.describe("transverses · unicité des titres et descriptions", () => {
  test.beforeEach(async ({ request }) => {
    await mock.scenario(request, "default");
  });
  test("<title> et meta description uniques sur les pages indexables", async ({
    request,
  }, info) => {
    test.skip(info.project.name !== "desktop", "Contrôle serveur, une fois.");
    const titres = new Map<string, string>();
    const descriptions = new Map<string, string>();
    const doublons: string[] = [];
    for (const cible of Object.values(PAGES)) {
      if (cible.statut) continue; // 404 : noindex
      const html = await (await request.get(cible.chemin)).text();
      const titre = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      const desc =
        html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
      if (titres.has(titre))
        doublons.push(
          `titre « ${titre} » : ${titres.get(titre)} et ${cible.chemin}`,
        );
      if (descriptions.has(desc))
        doublons.push(
          `description : ${descriptions.get(desc)} et ${cible.chemin}`,
        );
      titres.set(titre, cible.chemin);
      descriptions.set(desc, cible.chemin);
    }
    expect(doublons).toEqual([]);
  });
});
