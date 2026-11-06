import { mkdirSync } from "node:fs";
import path from "node:path";
import { type Browser, expect, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";

// Non-régression du fondu de page (brief §7, doc 06 §1, revue du lot I tour 2).
//
// Pendant une navigation côté client :
// 1. `::view-transition-old(root)` existe et s'anime : la racine (fond, pied)
//    fond à chaque changement de page, que la page quittée soit défilée ou
//    non. Ce comportement repose sur un détail interne de react-dom (le style
//    en ligne `view-transition-name` de <html>, voir PageTransition.tsx) :
//    un bump de Next ou de React peut le casser sans erreur visible.
// 2. `[data-mv-entete]` n'est jamais recouvert. Animations du pseudo-arbre
//    figées à 0, 30, 80, 120, 160 et 220 ms, la zone de l'en-tête doit être
//    identique, au pixel près (tolérance d'anticrénelage), à l'en-tête final.
//    La page quittée est défilée de sorte qu'un texte de l'ancien contenu
//    passe exactement sous l'en-tête : s'il remontait au-dessus, on le lirait.
// 3. Après la transition, le style en ligne de <html> est rendu vide.
//
// Captures figées (contrôle visuel) : E2E_CAPTURES_DIR=<dossier>.

type Parcours = { nom: string; depart: string; arrivee: string };

// Pages réelles du site uniquement : (site)/template.tsx porte le même
// <PageTransition> sur toutes les pages. Le banc `/design-system/mouvement`
// d'Iniesta n'est plus visé (revue finale n° 1, C-M1 : il est supprimé du
// projet, C-X1). Deux parcours aux contenus différents (texte long avec
// illustration, puis grille de photos) pour que l'image `old` diffère.
const PARCOURS: Parcours[] = [
  { nom: "accueil-vendre", depart: "/", arrivee: "/vendre" },
  { nom: "biens-cabinet", depart: "/biens", arrivee: "/le-cabinet" },
];

const INSTANTS_MS = [0, 30, 80, 120, 160, 220];

/**
 * Vrai si une image `old` (ou `new`) du contenu existe. React nomme lui-même
 * le <ViewTransition> de PageTransition (`_t_0_`…) ; la classe `mv-page`
 * n'apparaît pas dans le nom du pseudo-élément.
 */
function imageDuContenu(pseudos: string[], cote: "old" | "new") {
  const motif = new RegExp(`^::view-transition-${cote}\\((.+)\\)$`);
  return pseudos.some((p) => {
    const nom = p.match(motif)?.[1];
    return nom !== undefined && nom !== "root" && nom !== "mv-entete";
  });
}

/** La page de départ peut-elle amener un texte sous l'en-tête ? */
async function peutDefiler(page: Page) {
  return page.evaluate(
    () =>
      document.documentElement.scrollHeight > window.innerHeight + 300 &&
      document.querySelector("main") !== null,
  );
}

type Releve = {
  pseudos: string[];
  nomRacine: string;
  erreur?: string;
  fin: boolean;
};

declare global {
  interface Window {
    __vt?: Releve[];
    __vtFiger?: boolean;
  }
}

// Instrumente document.startViewTransition (appelé par React) : relève les
// pseudo-éléments animés dès `ready` et, sur demande, fige le pseudo-arbre.
function instrumenter() {
  window.__vt = [];
  const origine = Document.prototype.startViewTransition;
  if (!origine) return;
  Document.prototype.startViewTransition = function (
    this: Document,
    ...args: Parameters<Document["startViewTransition"]>
  ) {
    const t = origine.apply(this, args);
    const releve: Releve = {
      pseudos: [],
      nomRacine: getComputedStyle(document.documentElement).viewTransitionName,
      fin: false,
    };
    window.__vt?.push(releve);
    t.ready
      .then(() => {
        const animations = document
          .getAnimations()
          .filter((a) =>
            (a.effect as KeyframeEffect | null)?.pseudoElement?.startsWith(
              "::view-transition",
            ),
          );
        releve.pseudos = animations.map(
          (a) => (a.effect as KeyframeEffect).pseudoElement ?? "",
        );
        if (window.__vtFiger) for (const a of animations) a.pause();
      })
      .catch((e: unknown) => {
        releve.erreur = String(e);
      });
    t.finished.finally(() => {
      releve.fin = true;
    });
    return t;
  };
}

/** Navigation côté client sans défilement induit (pas de scrollIntoView). */
async function naviguer(page: Page, href: string) {
  const lien = page.locator(`[data-mv-entete] a[href="${href}"]`);
  if ((await lien.count()) > 0) {
    await lien.first().evaluate((a: HTMLElement) => a.click());
    return;
  }
  // Lien absent de l'en-tête (accueil) : routeur public de Next, qui passe
  // par la même transition React qu'un <Link>.
  await page.evaluate((h) => {
    const next = (
      window as unknown as { next?: { router?: { push(u: string): void } } }
    ).next;
    if (!next?.router) throw new Error("window.next.router indisponible");
    next.router.push(h);
  }, href);
}

/** Défile pour amener un texte de l'ancien contenu juste sous le haut. */
async function placerUnTexteEnHaut(page: Page): Promise<number> {
  return page.evaluate(() => {
    const candidats = [
      ...document.querySelectorAll<HTMLElement>(
        "main h2, main h3, main p, main li",
      ),
    ];
    const cible = candidats.find(
      (el) =>
        el.getBoundingClientRect().top + window.scrollY > 300 &&
        (el.textContent ?? "").trim().length > 20 &&
        el.getBoundingClientRect().height > 0,
    );
    if (!cible) return Number.NaN;
    window.scrollTo({
      top: cible.getBoundingClientRect().top + window.scrollY - 12,
      behavior: "instant",
    });
    return cible.getBoundingClientRect().top;
  });
}

async function attendreHydratation(page: Page) {
  await page.waitForFunction(
    () =>
      (window as unknown as { next?: { router?: unknown } }).next?.router !==
      undefined,
  );
  await page.waitForLoadState("networkidle");
}

/** Part des pixels qui diffèrent nettement entre deux PNG de même taille. */
async function ecartPixels(
  browser: Browser,
  a: Buffer,
  b: Buffer,
): Promise<number> {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const ecart = await p.evaluate(
    async ([x, y]) => {
      const lire = async (b64: string) => {
        const blob = await (await fetch(`data:image/png;base64,${b64}`)).blob();
        const img = await createImageBitmap(blob);
        const c = new OffscreenCanvas(img.width, img.height);
        const g = c.getContext("2d");
        if (!g) throw new Error("canvas");
        g.drawImage(img, 0, 0);
        return g.getImageData(0, 0, img.width, img.height);
      };
      const [ia, ib] = await Promise.all([lire(x), lire(y)]);
      if (ia.width !== ib.width || ia.height !== ib.height) return 1;
      let differents = 0;
      for (let i = 0; i < ia.data.length; i += 4) {
        const d = Math.max(
          Math.abs(ia.data[i] - ib.data[i]),
          Math.abs(ia.data[i + 1] - ib.data[i + 1]),
          Math.abs(ia.data[i + 2] - ib.data[i + 2]),
        );
        if (d > 48) differents++;
      }
      return differents / (ia.width * ia.height);
    },
    [a.toString("base64"), b.toString("base64")] as const,
  );
  await ctx.close();
  return ecart;
}

test.use({ reducedMotion: "no-preference" });

test.beforeEach(async ({ request, page }) => {
  await mock.reset(request);
  await page.addInitScript(instrumenter);
});

for (const parcours of PARCOURS) {
  test.describe(`Fondu de page · ${parcours.nom}`, () => {
    for (const defilee of [false, true]) {
      test(`la racine fond (${defilee ? "page quittée défilée" : "depuis le haut"})`, async ({
        page,
      }) => {
        const erreurs: string[] = [];
        page.on("pageerror", (e) => erreurs.push(e.message));
        await page.goto(parcours.depart);
        await attendreHydratation(page);
        test.skip(
          !(await page.evaluate(() => "startViewTransition" in document)),
          "Navigateur sans View Transitions",
        );
        if (defilee) {
          expect(await peutDefiler(page), "page de départ défilable").toBe(
            true,
          );
          const haut = await placerUnTexteEnHaut(page);
          expect(haut, "page de départ trop courte pour défiler").toBeLessThan(
            40,
          );
        }

        await naviguer(page, parcours.arrivee);
        await expect(page).toHaveURL(new RegExp(`${parcours.arrivee}$`));
        await page.waitForFunction(() => window.__vt?.at(-1)?.fin === true);

        const releves = await page.evaluate(() => window.__vt ?? []);
        expect(releves, "une seule transition par navigation").toHaveLength(1);
        const [vt] = releves;
        expect(vt.erreur).toBeUndefined();
        expect(vt.pseudos).toContain("::view-transition-old(root)");
        expect(vt.pseudos).toContain("::view-transition-new(root)");
        expect(imageDuContenu(vt.pseudos, "old"), vt.pseudos.join(" ")).toBe(
          true,
        );
        expect(imageDuContenu(vt.pseudos, "new"), vt.pseudos.join(" ")).toBe(
          true,
        );
        // Rendu propre : React ne doit pas laisser `root` ni `none` en ligne.
        expect(
          await page.evaluate(
            () => document.documentElement.style.viewTransitionName,
          ),
        ).toBe("");
        expect(erreurs).toEqual([]);
      });
    }

    test("l'en-tête n'est jamais recouvert par l'ancien contenu", async ({
      page,
      browser,
    }, testInfo) => {
      await page.goto(parcours.depart);
      await attendreHydratation(page);
      test.skip(
        !(await page.evaluate(() => "startViewTransition" in document)),
        "Navigateur sans View Transitions",
      );
      const enTetes = page.locator("[data-mv-entete]");
      await expect(enTetes, "un seul élément porte data-mv-entete").toHaveCount(
        1,
      );

      expect(await peutDefiler(page), "page de départ défilable").toBe(true);
      const haut = await placerUnTexteEnHaut(page);
      expect(haut, "page de départ trop courte pour défiler").toBeLessThan(40);

      await page.evaluate(() => {
        window.__vtFiger = true;
      });
      await naviguer(page, parcours.arrivee);
      await page.waitForFunction(
        () => (window.__vt?.at(-1)?.pseudos.length ?? 0) > 0,
      );
      const pseudos = await page.evaluate(
        () => window.__vt?.at(-1)?.pseudos ?? [],
      );
      expect(imageDuContenu(pseudos, "old"), pseudos.join(" ")).toBe(true);
      // Laisse finir les transitions CSS de la page vivante (trait du lien
      // courant, 180 ms) : seul le pseudo-arbre reste figé.
      await page.waitForTimeout(400);

      const zone = await enTetes.boundingBox();
      if (!zone) throw new Error("en-tête invisible");
      const viewport = page.viewportSize();
      if (!viewport) throw new Error("viewport");
      const clip = {
        x: 0,
        y: Math.max(0, zone.y),
        width: viewport.width,
        height:
          Math.min(zone.y + zone.height, viewport.height) - Math.max(0, zone.y),
      };
      expect(clip.height).toBeGreaterThan(0);

      const dossier = process.env.E2E_CAPTURES_DIR;
      if (dossier) mkdirSync(dossier, { recursive: true });
      const largeur = viewport.width;
      const figees: { t: number; image: Buffer }[] = [];
      for (const t of INSTANTS_MS) {
        await page.evaluate((ms) => {
          for (const a of document.getAnimations()) {
            const pseudo = (a.effect as KeyframeEffect | null)?.pseudoElement;
            if (pseudo?.startsWith("::view-transition")) a.currentTime = ms;
          }
        }, t);
        await page.evaluate(
          () =>
            new Promise((r) =>
              requestAnimationFrame(() => requestAnimationFrame(r)),
            ),
        );
        figees.push({ t, image: await page.screenshot({ clip }) });
        if (dossier) {
          await page.screenshot({
            path: path.join(
              dossier,
              `fige-${parcours.nom}-${largeur}-${String(t).padStart(3, "0")}.png`,
            ),
          });
        }
      }

      // Fin de la transition, puis référence : l'en-tête final, au repos.
      await page.evaluate(() => {
        window.__vtFiger = false;
        for (const a of document.getAnimations()) a.play();
      });
      await page.waitForFunction(() => window.__vt?.at(-1)?.fin === true);
      await expect(page).toHaveURL(new RegExp(`${parcours.arrivee}$`));
      const reference = await page.screenshot({ clip });
      await testInfo.attach("en-tete-final.png", {
        body: reference,
        contentType: "image/png",
      });

      for (const { t, image } of figees) {
        const ecart = await ecartPixels(browser, image, reference);
        if (ecart > 0.002) {
          await testInfo.attach(`en-tete-${t}ms.png`, {
            body: image,
            contentType: "image/png",
          });
        }
        expect(
          ecart,
          `zone de l'en-tête à ${t} ms : ${(ecart * 100).toFixed(2)} % de pixels différents de l'en-tête final`,
        ).toBeLessThanOrEqual(0.002);
      }
    });
  });
}
