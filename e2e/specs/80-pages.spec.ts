import { expect, type Page, test } from "@playwright/test";
import { MOCK_URL, type MockScenario, mock } from "../mock-client";
import {
  capturer,
  finAnimations,
  PAGES,
  parcourirLaPage,
} from "../support/recette";

// Critères par page du brief §9 (accueil, Nos biens, fiche, Vendre, Louer,
// Le cabinet, Honoraires, légal, 404, illustrations). Le tunnel et le
// contact ont leurs propres specs (90, 95). Mock PRIVÉ obligatoire : les
// scénarios changent l'état du serveur.

const NBSP = " ";
const NNBSP = " ";
const ESP = `[ ${NBSP}${NNBSP}]`;

/** Biens visibles du mock (DISPONIBLE, SOUS_OFFRE, SOUS_COMPROMIS). */
async function biensVisibles(
  request: import("@playwright/test").APIRequestContext,
) {
  const res = await request.get(`${MOCK_URL}/api/public/properties?limit=100`, {
    headers: { "X-API-Key": "e2e-test-key" },
  });
  if (!res.ok()) return [];
  const json = (await res.json()) as {
    data: { reference: string; transactionType: string; status: string }[];
  };
  return json.data;
}

/** Références des cartes (liens vers une fiche) d'un conteneur, dans l'ordre. */
function referencesDes(page: Page, conteneur: string) {
  return page.$$eval(`${conteneur} a[href^="/biens/"]`, (liens) => [
    ...new Set(
      liens.map((a) =>
        decodeURIComponent(a.getAttribute("href") ?? "").slice(7),
      ),
    ),
  ]);
}

/** Section (élément `section`) qui contient le h2 donné. */
const sectionDe = (page: Page, h2: string | RegExp) =>
  page.locator("main section").filter({
    has: page.getByRole("heading", { level: 2, name: h2 }),
  });

async function scenario(page: Page, nom: MockScenario) {
  await mock.scenario(page.request, nom);
}

// ---------------------------------------------------------------- Accueil
test.describe("Accueil /", () => {
  test("ouverture : un seul bouton grenat, dans le contenu, ILL-01 préchargée", async ({
    page,
  }, info) => {
    await scenario(page, "default");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const grenats = await page.$$eval("a, button", (els) =>
      els
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width > 0 &&
            r.bottom > 0 &&
            r.top < window.innerHeight &&
            getComputedStyle(el).backgroundColor === "rgb(95, 26, 36)"
          );
        })
        .map((el) => ({
          texte: (el.textContent ?? "").trim(),
          entete: !!el.closest("header"),
        })),
    );
    expect(grenats, info.project.name).toEqual([
      { texte: "Faire estimer votre bien", entete: false },
    ]);
    const preload = await page.$$eval('link[rel="preload"][as="image"]', (l) =>
      l.map(
        (x) => `${x.getAttribute("href")} ${x.getAttribute("imagesrcset")}`,
      ),
    );
    expect(preload.some((s) => /ill-01/.test(decodeURIComponent(s)))).toBe(
      true,
    );
    await capturer(page, info, "pages", "accueil-premier-ecran", false);
  });

  test("sections : crème soutenu, engagements, fin de page, Itinéraire", async ({
    page,
  }) => {
    await scenario(page, "default");
    await page.goto("/");
    // Seule section en crème soutenu : « Ce que disent nos clients » (A31).
    const soutenues = await page.$$eval("main *", (els) =>
      els
        .filter(
          (el) => getComputedStyle(el).backgroundColor === "rgb(239, 230, 215)",
        )
        .filter(
          (el) => el.getBoundingClientRect().width > window.innerWidth * 0.9,
        )
        .map((el) => el.querySelector("h2")?.textContent?.trim() ?? el.tagName),
    );
    expect(soutenues).toEqual(["Ce que disent nos clients"]);

    // Engagements : sans numéros, sans <ol>, sans illustration (A15, A27).
    const engagements = sectionDe(page, "Nos engagements");
    await expect(engagements).toHaveCount(1);
    await expect(engagements.locator("ol, img")).toHaveCount(0);
    const titres = await engagements.locator("h3").allTextContents();
    expect(titres.length).toBeGreaterThan(0);
    for (const t of titres) expect(t).not.toMatch(/^\s*0?\d/);

    // Aucun bloc d'estimation en fin de page (A31).
    const derniere = page.locator("main section").last();
    await expect(derniere.locator('a[href^="/estimation"]')).toHaveCount(0);

    // Itinéraire : vers mapsDirections, même onglet (A16).
    const itineraire = page.getByRole("link", {
      name: "Itinéraire",
      exact: true,
    });
    await expect(itineraire).toHaveCount(1);
    await expect(itineraire).toHaveAttribute(
      "href",
      /google\.[a-z.]+\/maps\/dir/,
    );
    expect(await itineraire.getAttribute("target")).toBeNull();

    // Ligne factuelle en phrase, sans point médian (§6.3).
    await expect(page.locator("main")).toContainText(
      new RegExp(`117${ESP}boulevard Voltaire, 01${ESP}73`),
    );
  });

  for (const nom of ["default", "edge", "empty"] as const) {
    test(`nombre de biens annoncé conforme au mock (${nom})`, async ({
      page,
    }, info) => {
      await scenario(page, nom);
      const n = (await biensVisibles(page.request)).length;
      await page.goto("/");
      const section = sectionDe(page, "Nos biens du moment");
      if (n === 0) {
        await expect(section).toHaveCount(0);
        await expect(page.locator("main")).not.toContainText(/\(0\)|0 bien/);
      } else {
        await expect(section).toHaveCount(1);
        await expect(
          page.getByRole("link", { name: `Voir nos biens (${n})` }),
        ).toBeVisible();
      }
      await capturer(page, info, "pages", `accueil-${nom}`);
    });
  }
});

// ------------------------------------------------------------- Nos biens
test.describe("Nos biens /biens", () => {
  test("cartes = biens visibles, ordre, une tabulation par carte (edge)", async ({
    page,
  }) => {
    await scenario(page, "edge");
    const visibles = await biensVisibles(page.request);
    await page.goto("/biens");
    const vente = await referencesDes(
      page,
      "main section:has(h2:text-is('En vente'))",
    );
    const location = await referencesDes(
      page,
      "main section:has(h2:text-is('En location'))",
    );
    expect([...vente, ...location].sort()).toEqual(
      visibles.map((p) => p.reference).sort(),
    );
    // Disponibles d'abord, puis sous offre et sous compromis.
    const statut = new Map(visibles.map((p) => [p.reference, p.status]));
    const rang = (r: string) => (statut.get(r) === "DISPONIBLE" ? 0 : 1);
    const rangs = vente.map(rang);
    expect(rangs, vente.join(", ")).toEqual([...rangs].sort());
    // Chaque carte : un seul arrêt de tabulation.
    const arrets = await page.$$eval(
      "main li:has(a[href^='/biens/'])",
      (cartes) =>
        cartes.map(
          (c) =>
            c.querySelectorAll(
              "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
            ).length,
        ),
    );
    expect(
      arrets.every((n) => n === 1),
      JSON.stringify(arrets),
    ).toBe(true);
  });

  const MISES_EN_PAGE: [MockScenario, number, string][] = [
    ["n1", 1, "horizontale"],
    ["n2", 2, "2"],
    ["n4", 4, "2"],
    ["n5", 5, "3"],
    ["n12", 12, "3"],
  ];
  for (const [nom, n, attendu] of MISES_EN_PAGE) {
    test(`grille A21 avec ${n} bien(s) : ${attendu}`, async ({
      page,
    }, info) => {
      await scenario(page, nom);
      await page.goto("/biens");
      const section = page.locator("main section:has(h2:text-is('En vente'))");
      const refs = await referencesDes(
        page,
        "main section:has(h2:text-is('En vente'))",
      );
      expect(refs).toHaveLength(n);
      const mobile = (page.viewportSize()?.width ?? 0) < 768;
      if (attendu === "horizontale") {
        await expect(section.locator("ul:has(a[href^='/biens/'])")).toHaveCount(
          0,
        );
        if (!mobile) {
          // Photo à gauche, texte à droite, sur la même rangée.
          const carte = section.locator("a[href^='/biens/']").first();
          const photo = await section.locator("img").first().boundingBox();
          const titre = await section.locator("h3").first().boundingBox();
          expect(carte).toBeTruthy();
          expect(photo && titre && titre.x > photo.x + photo.width - 1).toBe(
            true,
          );
          expect(photo && titre && titre.y < photo.y + photo.height).toBe(true);
        }
      } else {
        const colonnes = await section
          .locator("ul:has(a[href^='/biens/'])")
          .first()
          .evaluate(
            (ul) => getComputedStyle(ul).gridTemplateColumns.split(" ").length,
          );
        expect(colonnes).toBe(mobile ? 1 : Number(attendu));
        if (n === 5 && !mobile) {
          // Dernière rangée alignée à gauche.
          const xs = await section
            .locator("ul > li")
            .evaluateAll((lis) =>
              lis.map((li) => Math.round(li.getBoundingClientRect().x)),
            );
          expect(xs[3]).toBe(xs[0]);
        }
      }
      await capturer(page, info, "grille", `biens-${n}`);
    });
  }

  test("location vide : état rédigé et deux sorties (default)", async ({
    page,
  }) => {
    await scenario(page, "default");
    await page.goto("/biens");
    const location = page.locator(
      "main section:has(h2:text-is('En location'))",
    );
    await expect(location).toContainText(
      "Nous n’avons aucun logement à louer en ce moment.",
    );
    await expect(location.getByRole("link")).toHaveCount(2);
    await expect(page.locator("main")).not.toContainText(/\b0 bien/);
    // Archive vide : section absente.
    await expect(
      page.getByRole("heading", { name: "Récemment vendus et loués" }),
    ).toHaveCount(0);
  });

  test("scénario empty : un seul état vide", async ({ page }, info) => {
    await scenario(page, "empty");
    await page.goto("/biens");
    const main = page.locator("main");
    await expect(main.getByText(/en ligne en ce moment|aucun/i)).toHaveCount(1);
    await expect(main.locator("a[href^='/biens/']")).toHaveCount(0);
    await capturer(page, info, "pages", "biens-empty");
  });

  test("scénario error : message sobre avec le téléphone, sans archive", async ({
    page,
  }, info) => {
    // Passage par `edge` d'abord : l'archive ne doit pas survivre au
    // changement de scénario (aucun cache sous E2E_NO_CACHE).
    await scenario(page, "edge");
    await page.goto("/biens");
    await expect(
      page.getByRole("heading", { name: "Récemment vendus et loués" }),
    ).toHaveCount(1);
    await scenario(page, "error");
    await page.goto("/biens");
    const main = page.locator("main");
    await expect(main).toContainText(
      "Nos annonces ne peuvent pas s’afficher pour le moment.",
    );
    await expect(main.locator('a[href^="tel:"]')).toHaveCount(1);
    await expect(main.locator("a[href^='/biens/']")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Récemment vendus et loués" }),
    ).toHaveCount(0);
    await capturer(page, info, "pages", "biens-error");
  });

  test("archive (edge) : non cliquable, sans prix, badge sans année", async ({
    page,
  }, info) => {
    await scenario(page, "edge");
    await page.goto("/biens");
    const archive = page.locator("section").filter({
      has: page.getByRole("heading", { name: "Récemment vendus et loués" }),
    });
    await expect(archive).toHaveCount(1);
    await expect(archive.locator("a")).toHaveCount(0);
    await expect(archive).not.toContainText("€");
    const badges = await archive.getByText(/^(Vendu|Loué)/).allTextContents();
    expect(badges.length).toBeGreaterThanOrEqual(3);
    for (const b of badges) expect(b.trim()).toMatch(/^(Vendu|Loué)$/);
    // Aucun traitement de la photo (A14), une fois le fondu d'ImageFade fini.
    // Chaque photo est amenée à l'écran : en mobile, les cartes s'empilent et
    // une image `loading="lazy"` hors écran reste à opacité 0 (non décodée).
    const imgs = archive.locator("img");
    for (let i = 0; i < (await imgs.count()); i++) {
      await imgs.nth(i).scrollIntoViewIfNeeded();
      await expect(imgs.nth(i)).toHaveCSS("opacity", "1", { timeout: 10_000 });
    }
    const filtres = await archive
      .locator("img")
      .evaluateAll((imgs) =>
        imgs.map(
          (i) => `${getComputedStyle(i).filter} ${getComputedStyle(i).opacity}`,
        ),
      );
    for (const f of filtres) expect(f).toBe("none 1");
    await archive.scrollIntoViewIfNeeded();
    await capturer(page, info, "pages", "biens-edge-archive");
  });
});

// ------------------------------------------------------------------ Fiche
test.describe("Fiche /biens/[reference]", () => {
  test.beforeEach(async ({ page }) => scenario(page, "default"));

  test("10.131 : titre composé, prix U+202F, honoraires vendeur, énergie, copropriété", async ({
    page,
  }) => {
    await page.goto("/biens/10.131");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText(`Appartement 2 pièces, 46,6${NBSP}m²`);
    await expect(page).toHaveTitle(/^Appartement 2\spièces de 46,6\sm²/);
    const main = page.locator("main");
    await expect(main).toContainText(`300${NNBSP}000${NBSP}€`);
    await expect(
      main.getByText("Honoraires à la charge du vendeur"),
    ).toHaveCount(1);
    await expect(main).not.toContainText(/honoraires exclus/);
    await expect(main).toContainText(new RegExp(`Classe D, 216${ESP}kWh`));
    await expect(main).toContainText(new RegExp(`Classe B, 6${ESP}kg`));
    await expect(main).toContainText(
      new RegExp(
        `Montant estimé des dépenses annuelles d’énergie pour un usage standard${ESP}?:${ESP}non communiqué\\.`,
      ),
    );
    for (const libelle of [
      "Nombre de lots",
      "Charges annuelles moyennes",
      "Procédure en cours sur la copropriété",
      "Taxe foncière",
    ]) {
      await expect(main.getByText(libelle, { exact: true })).toBeVisible();
    }
    await expect(
      main.getByRole("link", { name: /Géorisques/ }),
    ).toHaveAttribute("href", /georisques\.gouv\.fr/);
  });

  test("09.362 : honoraires acquéreur en trois lignes", async ({ page }) => {
    await page.goto("/biens/09.362");
    const main = page.locator("main");
    await expect(main).toContainText(`198${NNBSP}000${NBSP}€`);
    await expect(main).toContainText(
      new RegExp(`Soit 189${NNBSP}000${NBSP}€ honoraires exclus`),
    );
    await expect(main).toContainText(
      new RegExp(`Honoraires de 4,76${ESP}% TTC à la charge de l’acquéreur`),
    );
  });

  test("10.130 : coûts d'énergie avec date d'indexation (A29)", async ({
    page,
  }) => {
    await page.goto("/biens/10.130");
    const main = page.locator("main");
    await expect(main).toContainText(
      new RegExp(
        `entre 830${ESP}€ et 1${ESP}190${ESP}€ par an\\. Prix moyens des énergies indexés au 1er${ESP}janvier${ESP}2021 \\(abonnements compris\\)\\.`,
      ),
    );
    await expect(main).toContainText(
      "Les coûts sont estimés en fonction des caractéristiques du logement et pour une utilisation standard.",
    );
  });

  test("09.345 : coûts absents, « non communiqué »", async ({ page }) => {
    await page.goto("/biens/09.345");
    await expect(page.locator("main")).toContainText(
      /usage standard\s?:\snon communiqué\./,
    );
  });

  test("pas d'adresse exacte, JSON-LD RealEstateListing limité à la ville", async ({
    page,
  }) => {
    await page.goto("/biens/10.131");
    const main = (await page.locator("main").innerText()).replace(/⁠/g, "");
    expect(main).not.toMatch(
      /\b\d{1,4}(?:\s?(?:bis|ter))?,?\s(?:rue|avenue|av\.|boulevard|bd|allée|place|impasse|quai|chemin)\b/i,
    );
    const blocs = await page.$$eval('script[type="application/ld+json"]', (s) =>
      s.map((x) => JSON.parse(x.textContent ?? "{}")),
    );
    const annonce = blocs.find((b) => b["@type"] === "RealEstateListing");
    expect(annonce).toBeTruthy();
    expect(annonce.name).toMatch(/^Appartement 2\spièces de 46,6\sm²$/);
    const adresse = annonce.about?.address ?? annonce.address;
    expect(Object.keys(adresse).sort()).toEqual(
      ["@type", "addressCountry", "addressLocality", "postalCode"].sort(),
    );
    expect(annonce.offers?.price).toBe(300000);
  });

  test("galerie : clavier (flèches, Échap, retour du focus)", async ({
    page,
  }) => {
    await page.goto("/biens/10.131");
    const ouvrir = page
      .getByRole("button", { name: /Agrandir la photo 1 sur/ })
      .first();
    await ouvrir.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Photos du bien" });
    await expect(dialog).toBeVisible();
    const compteur = dialog.locator('[aria-live="polite"]');
    // « Photo 1 / sur 4 » (morceaux masqués aux lecteurs d'écran).
    await expect(compteur).toContainText(/^\D*1\D+4$/);
    await page.keyboard.press("ArrowRight");
    await expect(compteur).toContainText(/^\D*2\D+4$/);
    await page.keyboard.press("ArrowLeft");
    await expect(compteur).toContainText(/^\D*1\D+4$/);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(ouvrir).toBeFocused();
  });

  test("galerie : défilement aimanté au toucher (mobile)", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "mobile", "Tactile : projet mobile.");
    await page.goto("/biens/10.131");
    const aimants = await page.$$eval(
      "main *",
      (els) =>
        els.filter((el) => getComputedStyle(el).scrollSnapType.startsWith("x"))
          .length,
    );
    expect(aimants).toBeGreaterThan(0);
  });

  test("mobile : galerie, h1, lieu, prix, deux boutons (A30, A6)", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "mobile", "Ordre mobile.");
    await page.goto("/biens/10.131");
    const y = async (sel: ReturnType<Page["locator"]>) =>
      (await sel.first().boundingBox())?.y ?? -1;
    const galerie = await y(page.locator("main img"));
    const h1 = await y(page.getByRole("heading", { level: 1 }));
    const lieu = await y(
      page
        .locator("main")
        .getByText(/Impressionnistes/)
        .first(),
    );
    const prix = await y(
      page.locator("main").getByText(`300${NNBSP}000${NBSP}€`),
    );
    const appeler = page.getByRole("link", { name: "Appeler le cabinet" });
    const visite = page
      .getByRole("link", { name: "Demander une visite" })
      .first();
    await expect(appeler).toBeVisible();
    await expect(appeler).toHaveAttribute("href", /^tel:/);
    await expect(visite).toBeVisible();
    const b1 = await y(appeler);
    const b2 = await y(visite);
    expect(
      [galerie, h1, lieu, prix, b1].every((v, i, a) => i === 0 || v > a[i - 1]),
    ).toBe(true);
    expect(b2).toBeGreaterThanOrEqual(b1);
    // Boutons pleine largeur.
    const largeur = (await appeler.boundingBox())?.width ?? 0;
    expect(largeur).toBeGreaterThan(300);
    await capturer(page, info, "pages", "fiche-mobile-premier-ecran", false);
  });

  test("formulaire de visite : subject BIEN_SALE et propertyReference", async ({
    page,
    request,
  }, info) => {
    const email = `visite-${info.project.name}-${Date.now()}@example.com`;
    await page.goto("/biens/10.131");
    const form = page
      .locator("form")
      .filter({ has: page.locator('input[name="email"]') });
    await form.locator('input[name="firstName"]').fill("Camille");
    await form.locator('input[name="lastName"]').fill("Essai");
    await form.locator('input[name="email"]').fill(email);
    await form.locator('label[for$="-accord"]').click();
    // Délai entier : `startedAt` est posé à l'hydratation, qui peut suivre
    // l'ouverture de plusieurs secondes sur une route compilée à froid.
    const reste = 4_500;
    if (reste > 0) await page.waitForTimeout(reste);
    await form.getByRole("button", { name: /Envoyer/ }).click();
    await expect(
      page.getByText("Votre message est bien arrivé."),
    ).toBeVisible();
    const recus = (await mock.requests(request, "/contact")).filter((r) =>
      JSON.stringify(r.body).includes(email),
    );
    expect(recus).toHaveLength(1);
    expect(recus[0].body).toMatchObject({
      subject: "BIEN_SALE",
      propertyReference: "10.131",
      consent: { rgpd: true },
    });
  });

  test("location (edge) : BIEN_RENT et « par mois charges comprises »", async ({
    page,
    request,
  }, info) => {
    await scenario(page, "edge");
    const email = `visite-loc-${info.project.name}-${Date.now()}@example.com`;
    await page.goto("/biens/TEST-LOC-1");
    await expect(page.locator("main")).toContainText(
      new RegExp(`1${ESP}250${ESP}€\\s*par mois charges comprises`),
    );
    const form = page
      .locator("form")
      .filter({ has: page.locator('input[name="email"]') });
    await form.locator('input[name="firstName"]').fill("Camille");
    await form.locator('input[name="lastName"]').fill("Essai");
    await form.locator('input[name="email"]').fill(email);
    await form.locator('label[for$="-accord"]').click();
    // Délai entier : `startedAt` est posé à l'hydratation, qui peut suivre
    // l'ouverture de plusieurs secondes sur une route compilée à froid.
    const reste = 4_500;
    if (reste > 0) await page.waitForTimeout(reste);
    await form.getByRole("button", { name: /Envoyer/ }).click();
    await expect(
      page.getByText("Votre message est bien arrivé."),
    ).toBeVisible();
    const recus = (await mock.requests(request, "/contact")).filter((r) =>
      JSON.stringify(r.body).includes(email),
    );
    expect(recus).toHaveLength(1);
    expect(recus[0].body).toMatchObject({
      subject: "BIEN_RENT",
      propertyReference: "TEST-LOC-1",
    });
  });

  test("biens similaires masqués si vides (edge, seule maison)", async ({
    page,
  }) => {
    await scenario(page, "edge");
    await page.goto("/biens/TEST-MAISON");
    await expect(
      page.getByRole("heading", { name: /Nos autres biens/ }),
    ).toHaveCount(0);
  });

  test("référence inconnue : 404 et page dédiée", async ({ page }) => {
    const res = await page.goto("/biens/99.999");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Ce bien n’est plus en ligne.",
    );
  });

  test("API en erreur : frontière d'erreur sobre, avec le téléphone", async ({
    page,
  }, info) => {
    await scenario(page, "error");
    page.on("pageerror", () => undefined);
    // Référence jamais pré-rendue : en production, une fiche générée au build
    // (generateStaticParams, ISR) reste servie telle quelle quand l'API tombe,
    // ce qui est voulu. La frontière ne se voit que sur une fiche rendue à la
    // demande (le proxy laisse passer : liste illisible, « la page décide »).
    const res = await page.goto("/biens/88.888");
    expect([500, 200]).toContain(res?.status());
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Un problème technique",
    );
    await expect(
      page
        .locator('main a[href^="tel:"], [id="contenu"] a[href^="tel:"]')
        .first(),
    ).toBeVisible();
    await expect(page.locator("header[data-mv-entete]")).toHaveCount(1);
    await expect(page.locator("footer#pied")).toHaveCount(1);
    // D8 : la page d'erreur peut répondre 200 (rendu ISR de ServiceError) ;
    // elle ne doit alors jamais être indexée.
    if (res?.status() === 200) {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/,
      );
    }
    await capturer(page, info, "pages", "fiche-error");
  });
});

// ---------------------------------------------------------- Vendre, Louer
for (const [chemin, objet] of [
  ["/vendre", "vente"],
  ["/louer", "loyer"],
] as const) {
  test.describe(`${chemin}`, () => {
    test.beforeEach(async ({ page }) => scenario(page, "default"));
    test("déroulé en <ol>, FAQ en details avec JSON-LD FAQPage, lien d'estimation", async ({
      page,
    }) => {
      await page.goto(chemin);
      const deroule = sectionDe(page, /^Comment se passe/);
      await expect(deroule.locator("ol > li").first()).toBeVisible();
      const questions = await page.locator("main details > summary").count();
      expect(questions).toBeGreaterThan(0);
      const faq = await page.$$eval('script[type="application/ld+json"]', (s) =>
        s
          .map((x) => JSON.parse(x.textContent ?? "{}"))
          .find((b) => b["@type"] === "FAQPage"),
      );
      expect(faq?.mainEntity).toHaveLength(questions);
      await expect(
        page.locator(`main a[href="/estimation?objet=${objet}"]`).first(),
      ).toBeVisible();
    });
  });
}

test.describe("Vendre et Louer : illustrations et renvoi du locataire", () => {
  test("Vendre : ILL-09, jamais ILL-02 ni ILL-04", async ({ page }) => {
    await scenario(page, "default");
    const chargees: string[] = [];
    page.on("request", (r) => {
      const m = decodeURIComponent(r.url()).match(/illustrations\/ill-(\d{2})/);
      if (m) chargees.push(m[1]);
    });
    await page.goto("/vendre");
    await parcourirLaPage(page);
    await page.waitForLoadState("networkidle");
    expect(chargees).toContain("09");
    expect(chargees).not.toContain("02");
    expect(chargees).not.toContain("04");
  });

  const RENVOIS: [MockScenario, RegExp][] = [
    ["default", /Nous n’avons aucun logement à louer en ce moment\./],
    ["empty", /Nous n’avons aucun logement à louer en ce moment\./],
    ["edge", /Nous avons un logement à louer en ce moment\./],
  ];
  for (const [nom, attendu] of RENVOIS) {
    test(`Louer : renvoi du locataire accordé (${nom})`, async ({ page }) => {
      test.skip(
        process.env.E2E_SERVEUR === "prod" && nom !== "default",
        "Production : /louer est statique (ISR 5 min), générée au build sur le scénario default ; un changement de scénario n'y paraît qu'après révalidation. Contrôlé en dev.",
      );
      await scenario(page, nom);
      await page.goto("/louer");
      await expect(page.locator("main")).toContainText(attendu);
      await expect(page.locator("main")).not.toContainText(
        /\b0\s(bien|logement)/,
      );
    });
  }
});

// ----------------------------------------- Calage des en-têtes (C-B1)
// Accueil, Vendre et Louer : trois pages sœurs, une seule composition. À
// 1440 px, le pied du dessin d'en-tête tombe sur le bas du bouton principal
// (grenat) : écart vertical < 8 px (revue finale n° 1, C-M2). Le « bas du
// dessin » est la dernière rangée d'encre (alpha > 32) de l'image décodée,
// rapportée à sa boîte rendue (translation comprise), et rognée par un
// cadre `overflow: hidden` éventuel.
test.describe("Calage des en-têtes : pied du dessin sur le bas du bouton", () => {
  for (const chemin of ["/", "/vendre", "/louer"]) {
    test(`${chemin}`, async ({ page }, info) => {
      test.skip(
        info.project.name !== "desktop",
        "Composition côte à côte (≥ 1024 px) : projet desktop, 1440 px.",
      );
      await scenario(page, "default");
      await page.goto(chemin);
      await page.waitForLoadState("networkidle");
      await finAnimations(page);
      const mesure = await page.evaluate(async () => {
        const main = document.querySelector("main");
        const img = main?.querySelector<HTMLImageElement>(
          'img[src*="illustrations"]',
        );
        const bouton = [...(main?.querySelectorAll("a, button") ?? [])].find(
          (el) => getComputedStyle(el).backgroundColor === "rgb(95, 26, 36)",
        );
        if (!img || !bouton) return null;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const g = c.getContext("2d");
        if (!g) return null;
        g.drawImage(img, 0, 0);
        const { data } = g.getImageData(0, 0, c.width, c.height);
        let derniere = -1;
        for (let y = c.height - 1; y >= 0 && derniere < 0; y--) {
          for (let x = 0; x < c.width; x++) {
            if (data[(y * c.width + x) * 4 + 3] > 32) {
              derniere = y;
              break;
            }
          }
        }
        const r = img.getBoundingClientRect();
        let basEncre = r.top + ((derniere + 1) / c.height) * r.height;
        for (
          let el = img.parentElement;
          el && el !== main;
          el = el.parentElement
        ) {
          if (getComputedStyle(el).overflowY !== "visible") {
            basEncre = Math.min(basEncre, el.getBoundingClientRect().bottom);
          }
        }
        return {
          basEncre: basEncre + window.scrollY,
          basBouton: bouton.getBoundingClientRect().bottom + window.scrollY,
          bouton: (bouton.textContent ?? "").trim(),
        };
      });
      expect(
        mesure,
        "illustration et bouton grenat dans <main>",
      ).not.toBeNull();
      if (!mesure) return;
      await capturer(page, info, "calage", chemin.slice(1) || "accueil", false);
      const ecart = Math.abs(mesure.basEncre - mesure.basBouton);
      expect(
        ecart,
        `${chemin} : pied du dessin à ${mesure.basEncre.toFixed(1)} px, bas de « ${mesure.bouton} » à ${mesure.basBouton.toFixed(1)} px`,
      ).toBeLessThan(8);
    });
  }
});

// ------------------------------- Titres de section en colonnes 1 à 4 (C-B6)
// Revue finale n° 3 : à 1440, le texte d'un intertitre posé sur les colonnes
// 1 à 4 (contenu en 5 à 12) finit au moins 40 px avant la colonne 5. Mesure :
// colonne 5 calculée sur la grille de 12 du parent (pistes + gouttières),
// fin du texte = bord droit le plus à droite des rectangles de ses lignes.
test.describe("Intertitres en colonnes 1 à 4 : 40 px avant la colonne 5", () => {
  const ATTENDUS = new Set(["/", "/vendre", "/louer", "/honoraires"]);
  for (const cible of Object.values(PAGES)) {
    test(`${cible.chemin}`, async ({ page }, info) => {
      test.skip(
        info.project.name !== "desktop",
        "Intertitre et contenu côte à côte (≥ 1024 px) : projet desktop, 1440 px.",
      );
      await scenario(page, "default");
      await page.goto(cible.chemin);
      await finAnimations(page);
      const mesures = await page.evaluate(() => {
        const sortie: { titre: string; finTexte: number; colonne5: number }[] =
          [];
        for (const h of document.querySelectorAll<HTMLElement>(
          "main h2, main h3",
        )) {
          // Enfant de grille qui porte le titre.
          let item: HTMLElement = h;
          let grille = h.parentElement;
          while (grille && getComputedStyle(grille).display !== "grid") {
            item = grille;
            grille = grille.parentElement;
          }
          if (!grille || !grille.closest("main")) continue;
          const cs = getComputedStyle(grille);
          const pistes = cs.gridTemplateColumns
            .split(" ")
            .map((v) => Number.parseFloat(v));
          if (pistes.length !== 12) continue;
          const gouttiere = Number.parseFloat(cs.columnGap) || 0;
          const rg = grille.getBoundingClientRect();
          const gauche =
            rg.left +
            Number.parseFloat(cs.paddingLeft) +
            Number.parseFloat(cs.borderLeftWidth);
          const colonne5 =
            gauche +
            pistes.slice(0, 4).reduce((a, b) => a + b, 0) +
            4 * gouttiere;
          const ri = item.getBoundingClientRect();
          if (Math.abs(ri.left - gauche) > 2 || ri.right > colonne5 + 1)
            continue;
          // Un voisin de la même grille doit occuper la colonne 5 en regard.
          const voisin = [...grille.children].some((el) => {
            if (el === item) return false;
            const r = el.getBoundingClientRect();
            return (
              r.width > 0 &&
              Math.abs(r.left - colonne5) <= 2 &&
              r.top < ri.bottom &&
              r.bottom > ri.top
            );
          });
          if (!voisin) continue;
          const range = document.createRange();
          range.selectNodeContents(h);
          const finTexte = Math.max(
            ...[...range.getClientRects()].map((r) => r.right),
          );
          sortie.push({
            titre: (h.textContent ?? "").replace(/\s+/g, " ").trim(),
            finTexte,
            colonne5,
          });
        }
        return sortie;
      });
      info.annotations.push({
        type: "mesures",
        description: mesures
          .map((m) => `${m.titre} : ${(m.colonne5 - m.finTexte).toFixed(0)} px`)
          .join(" ; "),
      });
      if (ATTENDUS.has(cible.chemin)) {
        expect(
          mesures.length,
          `${cible.chemin} : au moins un intertitre en colonnes 1 à 4`,
        ).toBeGreaterThan(0);
      }
      for (const m of mesures) {
        expect(
          m.colonne5 - m.finTexte,
          `${cible.chemin}, « ${m.titre} » : texte fini à ${m.finTexte.toFixed(1)} px, colonne 5 à ${m.colonne5.toFixed(1)} px`,
        ).toBeGreaterThanOrEqual(40);
      }
    });
  }
});

// ------------------------------------------------------------- Le cabinet
test.describe("Le cabinet", () => {
  test("aucune personne, informations professionnelles en texte courant, avis", async ({
    page,
  }) => {
    await scenario(page, "default");
    await page.goto("/le-cabinet");
    await parcourirLaPage(page);
    const sources = await page.$$eval("main img", (i) =>
      i.map((x) => decodeURIComponent(x.getAttribute("src") ?? "")),
    );
    for (const s of sources) expect(s).toMatch(/illustrations\/ill-0[367]\./);
    const infos = sectionDe(page, "Informations professionnelles");
    await expect(infos).toHaveCount(1);
    const tailles = await infos
      .locator("p, dd, li")
      .evaluateAll((els) =>
        els.map((e) => Number.parseFloat(getComputedStyle(e).fontSize)),
      );
    expect(Math.min(...tailles)).toBeGreaterThan(13);
    await expect(page.locator("main")).toContainText(/sur 5/);
  });

  test("carte du secteur avec la mention OSM", async ({ page }) => {
    await scenario(page, "default");
    await page.goto("/le-cabinet");
    const carte = await page
      .locator("main img[src*='ill-07'], main svg[data-carte]")
      .count();
    test.skip(
      carte === 0,
      "ILL-07 en attente des communes du secteur (brief §8bis, §10-8) : section absente, jamais un cadre vide.",
    );
    await expect(page.locator("main")).toContainText(
      "© contributeurs OpenStreetMap",
    );
  });
});

// ------------------------------------------------------------- Honoraires
test.describe("Honoraires", () => {
  test("tableau accessible, lisible à 320 px, feuille d'impression", async ({
    page,
  }) => {
    await scenario(page, "default");
    await page.goto("/honoraires");
    const impression = await page.evaluate(() =>
      [...document.styleSheets].some((s) => {
        try {
          return [...s.cssRules].some(
            (r) => r instanceof CSSMediaRule && /print/.test(r.conditionText),
          );
        } catch {
          return false;
        }
      }),
    );
    expect(impression, "règles @media print").toBe(true);
    const tables = await page.locator("main table").count();
    test.skip(
      tables === 0,
      "Barème non fourni (brief §10-2, `feeSchedule` nul) : pas de tableau ; check-launch bloque la mise en ligne.",
    );
    await expect(page.locator("main table caption")).toHaveCount(tables);
    const thSansScope = await page.locator("main th:not([scope])").count();
    expect(thSansScope).toBe(0);
    await page.setViewportSize({ width: 320, height: 640 });
    const deborde = await page.$$eval("main table", (t) =>
      t.some((x) => x.scrollWidth > x.clientWidth + 1),
    );
    expect(deborde).toBe(false);
  });
});

// ------------------------------------------------------------------ Légal
test.describe("Mentions légales et Confidentialité", () => {
  test("rubriques des mentions légales (doc 04 §2.10)", async ({ page }) => {
    await page.goto("/mentions-legales");
    const main = page.locator("main");
    for (const r of [
      /Éditeur du site/,
      /\(SAS\) au capital/,
      /registre du commerce et des sociétés|RCS/,
      /Carte professionnelle/,
      /CCI/,
      /Garant financier|garant/i,
      /Hébergement/,
      /Propriété intellectuelle/,
      /crédits/i,
    ]) {
      await expect(main, String(r)).toContainText(r);
    }
  });
  test("rubriques de la confidentialité (doc 04 §2.10)", async ({ page }) => {
    await page.goto("/confidentialite");
    const main = page.locator("main");
    for (const r of [
      /Responsable du traitement/,
      /Données collectées/,
      /Finalités/,
      /base légale/i,
      /Destinataires/,
      /Durée de conservation/,
      /Vos droits/,
      /CNIL/,
      /Bloctel/,
      /Cookies/,
      /aucun cookie/i,
    ]) {
      await expect(main, String(r)).toContainText(r);
    }
  });
});

// -------------------------------------------------------------------- 404
test.describe("404", () => {
  for (const chemin of ["/page-qui-n-existe-pas", "/biens/99.999"]) {
    test(`${chemin} : en-tête, pied, ILL-08, Accueil, Nos biens, téléphone`, async ({
      page,
    }, info) => {
      const res = await page.goto(chemin);
      expect(res?.status()).toBe(404);
      await expect(page.locator("header[data-mv-entete]")).toHaveCount(1);
      await expect(page.locator("footer#pied")).toBeVisible();
      const main = page.locator("main");
      await expect(main.locator("img[src*='ill-08']")).toHaveCount(1);
      await expect(main.getByRole("link", { name: "Accueil" })).toHaveAttribute(
        "href",
        "/",
      );
      await expect(
        main.getByRole("link", { name: "Nos biens" }),
      ).toHaveAttribute("href", "/biens");
      await expect(main.locator('a[href^="tel:"]')).toHaveCount(1);
      // `next dev` ajoute son propre noindex : contrôle en production
      // seulement (E2E_SERVEUR=prod), comme 30-sans-javascript.
      if (process.env.E2E_SERVEUR === "prod") {
        const robots = await page.locator('meta[name="robots"]').count();
        expect(robots, "une seule meta robots").toBe(1);
        if (chemin === "/biens/99.999")
          await expect(page).toHaveTitle("Bien introuvable | Cabinet Rimbault");
      }
      await capturer(
        page,
        info,
        "pages",
        chemin === "/biens/99.999" ? "404-fiche" : "404-url",
      );
    });
  }
});

// ----------------------------------------------------------- Illustrations
test.describe("Illustrations et icône", () => {
  test("aucune illustration sur deux pages, sauf ILL-03", async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== "desktop",
      "Inventaire desktop (ILL-03 masquée sur Contact en mobile).",
    );
    await scenario(page, "default");
    const pages = [
      "/",
      "/biens",
      "/vendre",
      "/louer",
      "/le-cabinet",
      "/honoraires",
      "/contact",
      "/mentions-legales",
      "/confidentialite",
      "/estimation",
      "/page-qui-n-existe-pas",
    ];
    const vues = new Map<string, string[]>();
    for (const chemin of pages) {
      await page.goto(chemin);
      const numeros = await page.$$eval("img", (imgs) => [
        ...new Set(
          imgs
            .map(
              (i) =>
                decodeURIComponent(i.getAttribute("src") ?? "").match(
                  /illustrations\/ill-(\d{2})/,
                )?.[1],
            )
            .filter(Boolean) as string[],
        ),
      ]);
      for (const n of numeros) vues.set(n, [...(vues.get(n) ?? []), chemin]);
    }
    const doublons = [...vues].filter(([n, ps]) => n !== "03" && ps.length > 1);
    expect(doublons).toEqual([]);
    expect(vues.get("03")?.sort()).toEqual(["/", "/contact", "/le-cabinet"]);
    expect(vues.get("01")).toEqual(["/"]);
    expect(vues.get("08")).toEqual(["/page-qui-n-existe-pas"]);
  });

  test("icon.svg : monogramme crème sur grenat", async ({ request }) => {
    const svg = (await (await request.get("/icon.svg")).text()).toUpperCase();
    expect(svg).toContain("#5F1A24");
    expect(svg).toContain("#F8F2E9");
    expect(svg).not.toContain("GEORGIA");
  });

  test("cadre d'illustration en attente : aucun fond opaque", async ({
    page,
  }) => {
    await scenario(page, "default");
    // Images retenues : le cadre reste dans l'état « attente ».
    await page.route(
      /illustrations%2Fill-0[3-9]|illustrations\/ill-0[3-9]/,
      () => undefined,
    );
    await page.goto("/le-cabinet", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1_500);
    const attentes = page.locator('img[data-fondu="attente"]');
    const n = await attentes.count();
    test.skip(n === 0, "Aucune illustration en fondu sur la page.");
    const fonds = await attentes.evaluateAll((imgs) =>
      imgs
        .flatMap((img) => [img, img.parentElement as Element])
        .map((el) => {
          const s = getComputedStyle(el);
          return `${s.backgroundColor} ${s.backgroundImage}`;
        }),
    );
    for (const f of fonds) expect(f).toBe("rgba(0, 0, 0, 0) none");
  });
});
