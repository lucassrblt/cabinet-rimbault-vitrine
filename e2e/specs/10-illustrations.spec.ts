import { expect, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";

// Illustrations (brief §9, A27 amendé par A37, revue du lot C correction 2).
// - Vendre : ILL-09, jamais ILL-02 ni ILL-04.
// - Pendant le chargement, aucun cadre d'illustration n'a de fond opaque : le
//   dessin est détouré, seul le fondu d'opacité d'ImageFade est permis.

const PAGES = [
  "/",
  "/biens",
  "/vendre",
  "/louer",
  "/le-cabinet",
  "/contact",
  "/honoraires",
  "/mentions-legales",
  "/confidentialite",
  "/page-introuvable-e2e", // 404 : ILL-08
];

// Une illustration est servie par /_next/image?url=%2Fillustrations%2F… ou,
// sans optimisation, par /illustrations/… : on repère les deux formes.
const MOTIF_ILLUSTRATION = /(?:\/|%2F)illustrations(?:\/|%2F)ill-(\d{2})\./i;
const estIllustration = (url: URL) => MOTIF_ILLUSTRATION.test(url.href);

/** Numéros (« 02 », « 09 »…) des illustrations présentes dans le DOM. */
async function illustrationsDuDom(page: Page): Promise<string[]> {
  const sources = await page.$$eval("img", (imgs) =>
    imgs.map((img) => `${img.getAttribute("src") ?? ""} ${img.srcset}`),
  );
  const numeros = new Set<string>();
  for (const s of sources) {
    for (const m of s.matchAll(new RegExp(MOTIF_ILLUSTRATION, "gi"))) {
      numeros.add(m[1]);
    }
  }
  return [...numeros].sort();
}

test.beforeEach(async ({ request }) => {
  await mock.reset(request);
});

test.describe("Vendre (A37)", () => {
  test("ni ILL-02 ni ILL-04 ne sont rendues ni chargées", async ({ page }) => {
    const chargees: string[] = [];
    page.on("request", (req) => {
      const m = req.url().match(MOTIF_ILLUSTRATION);
      if (m) chargees.push(m[1]);
    });
    const res = await page.goto("/vendre");
    expect(res?.status()).toBe(200);
    // Les images différées doivent avoir eu l'occasion de partir.
    await page.evaluate(() =>
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }),
    );
    await page.waitForLoadState("networkidle");

    const dansLeDom = await illustrationsDuDom(page);
    for (const interdite of ["02", "04"]) {
      expect(dansLeDom, `ILL-${interdite} rendue sur Vendre`).not.toContain(
        interdite,
      );
      expect(chargees, `ILL-${interdite} chargée sur Vendre`).not.toContain(
        interdite,
      );
    }
    // Avant validation d'ILL-09 : aucune illustration (A37). Après : ILL-09 seule.
    expect(
      dansLeDom.every((n) => n === "09"),
      `illustrations sur Vendre : ${dansLeDom.join(", ")}`,
    ).toBe(true);
  });

  test("l'en-tête porte ILL-09, une seule fois", async ({ page }) => {
    // A37 : ILL-09 validée en revue du lot C (tour 2) et intégrée par le lot 4 :
    // contrôle toujours actif (E2E_ILL09_VALIDEE n'est plus nécessaire).
    await page.goto("/vendre");
    const ill09 = page.locator(
      'main img[src*="ill-09."], main img[srcset*="ill-09."]',
    );
    await expect(ill09).toHaveCount(1);
    await expect(ill09).toHaveAttribute("alt", "");
    // En-tête (PageIntro : h1 et illustration côte à côte, sans élément
    // header ni section) : l'image vient après le h1 et avant le premier h2.
    const dansEnTete = await ill09.evaluate((img) => {
      const h1 = document.querySelector("main h1");
      const h2 = document.querySelector("main h2");
      if (!h1) return false;
      const apresH1 = !!(
        h1.compareDocumentPosition(img) & Node.DOCUMENT_POSITION_FOLLOWING
      );
      const avantH2 =
        !h2 ||
        !!(img.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING);
      return apresH1 && avantH2;
    });
    expect(dansEnTete, "ILL-09 hors de l'en-tête de Vendre").toBe(true);
  });
});

test.describe("Cadre des illustrations pendant le chargement", () => {
  test.use({ reducedMotion: "no-preference", javaScriptEnabled: true });

  test("aucun fond opaque sur l'image ni sur son cadre", async ({ page }) => {
    test.setTimeout(PAGES.length * 45_000); // next dev compile chaque route
    let controlees = 0;
    const fautes: string[] = [];

    for (const chemin of PAGES) {
      // Les illustrations sont retenues tant que le contrôle n'est pas fait :
      // la page reste dans l'état « chargement » (data-fondu="attente").
      let liberer: () => void = () => {};
      const retenue = new Promise<void>((r) => {
        liberer = r;
      });
      await page.route(estIllustration, async (route) => {
        await retenue;
        await route.continue().catch(() => {});
      });

      // next dev peut interrompre une première navigation (recompilation).
      await page
        .goto(chemin, { waitUntil: "domcontentloaded" })
        .catch(() => page.goto(chemin, { waitUntil: "domcontentloaded" }));
      // Hydratation : ImageFade pose data-fondu="attente" après le montage.
      await page
        .waitForSelector('img[data-fondu="attente"]', {
          state: "attached",
          timeout: 8_000,
        })
        .catch(() => {});
      // Laisse finir une éventuelle transition de couleur (300 ms).
      await page.waitForTimeout(450);

      const releves = await page.$$eval(
        "img",
        (imgs, source) => {
          const motif = new RegExp(source, "i");
          const transparent = (el: Element) => {
            const cs = getComputedStyle(el);
            const fond = cs.backgroundColor.replace(/\s/g, "");
            const sansCouleur =
              fond === "transparent" ||
              /^rgba\(\d+,\d+,\d+,0(?:\.0+)?\)$/.test(fond) ||
              /\/0(?:\.0+)?%?\)$/.test(fond);
            return sansCouleur && cs.backgroundImage === "none";
          };
          return imgs
            .filter((img) =>
              motif.test(`${img.getAttribute("src") ?? ""} ${img.srcset}`),
            )
            .filter((img) => img.getClientRects().length > 0)
            .map((img) => {
              // Cadre : l'image et ses ancêtres qui l'épousent (même boîte à
              // 2 px près), c'est-à-dire l'enveloppe d'ImageFade et ses alias.
              const r = img.getBoundingClientRect();
              const cadre: Element[] = [img];
              let el = img.parentElement;
              while (el && el !== document.body) {
                const b = el.getBoundingClientRect();
                const epouse =
                  getComputedStyle(el).display === "contents" ||
                  (Math.abs(b.width - r.width) <= 2 &&
                    Math.abs(b.height - r.height) <= 2);
                if (!epouse) break;
                cadre.push(el);
                el = el.parentElement;
              }
              const opaques = cadre
                .filter((e) => !transparent(e))
                .map(
                  (e) =>
                    `<${e.tagName.toLowerCase()} class="${e.getAttribute("class") ?? ""}"> ${getComputedStyle(e).backgroundColor} ${getComputedStyle(e).backgroundImage}`,
                );
              return {
                nom: img.getAttribute("src") ?? "",
                attente: img.getAttribute("data-fondu") === "attente",
                opaques,
              };
            });
        },
        MOTIF_ILLUSTRATION.source,
      );

      for (const r of releves) {
        if (r.attente) controlees++;
        for (const o of r.opaques) fautes.push(`${chemin} ${r.nom} : ${o}`);
      }

      liberer();
      await page.unrouteAll({ behavior: "ignoreErrors" });
    }

    expect(fautes, "fond opaque sous une illustration en chargement").toEqual(
      [],
    );
    // Garde-fou : le test n'a de sens que s'il a vu au moins une illustration
    // en attente (sinon aucune page n'intègre encore d'illustration fondue).
    expect(
      controlees,
      "aucune illustration observée en data-fondu=attente",
    ).toBeGreaterThan(0);
  });
});
