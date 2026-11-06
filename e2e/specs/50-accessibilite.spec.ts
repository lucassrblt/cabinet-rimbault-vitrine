import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";
import { hydrate, PAGE_INTROUVABLE, PAGES } from "../support/galerie";

// Accessibilité :
// - axe-core, règles WCAG 2.1 A et AA : AUCUNE violation, quel que soit son
//   impact, sur toutes les pages, les 404, et les états d'erreur des deux
//   formulaires. Analyse en mouvement réduit : les apparitions (`data-rv`)
//   sont alors immédiates, l'analyse ne tombe pas sur un texte à mi-fondu.
// - `prefers-reduced-motion: reduce` ne masque aucun contenu, même sous la
//   ligne de flottaison (jamais atteinte par l'IntersectionObserver).
// - Menu mobile au clavier : ouverture, parcours, Échap referme et rend le
//   focus au bouton.

test.beforeEach(async ({ request }) => {
  await mock.reset(request);
});

async function sansViolation(page: Page, contexte: string) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude("nextjs-portal")
    .analyze();
  const lisible = violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    aide: v.help,
    cibles: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
  }));
  expect(lisible, `${contexte}\n${JSON.stringify(lisible, null, 2)}`).toEqual(
    [],
  );
}

test.describe("axe WCAG 2.1 AA", () => {
  test.use({ reducedMotion: "reduce" });

  for (const p of [
    ...PAGES.map((x) => x.chemin),
    PAGE_INTROUVABLE,
    "/biens/ZZ",
  ]) {
    test(`axe · ${p}`, async ({ page }) => {
      await page.goto(p);
      await hydrate(page.getByRole("banner"));
      await page.waitForLoadState("networkidle");
      await sansViolation(page, p);
    });
  }

  test("axe · tunnel d'estimation en erreur", async ({ page }) => {
    await page.goto("/vendre/estimation");
    const continuer = page.getByRole("button", { name: "Continuer" });
    await hydrate(continuer);
    await continuer.click();
    await expect(page.getByText("Choisissez le type de bien.")).toBeVisible();
    await sansViolation(page, "question 1 en erreur");

    await page.getByRole("radio", { name: "Appartement" }).check();
    await continuer.click();
    await continuer.click();
    await expect(page.getByLabel("Code postal")).toBeFocused();
    await sansViolation(page, "question 2 en erreur");
  });

  test("axe · contact en erreur", async ({ page }) => {
    await page.goto("/contact?ref=10.131");
    const envoyer = page.getByRole("button", { name: "Envoyer le message" });
    await hydrate(envoyer);
    await envoyer.click();
    await expect(
      page.getByRole("region", { name: /informations? à corriger/ }),
    ).toBeVisible();
    await sansViolation(page, "contact en erreur");
  });
});

/** Textes de <main> rendus invisibles (opacité cumulée sous 0,5). */
function contenusMasques(page: Page) {
  return page.evaluate(() => {
    const out: string[] = [];
    for (const el of document.querySelectorAll("main *")) {
      if (el.closest("img, picture, svg")) continue;
      const texte = [...el.childNodes].some(
        (n) => n.nodeType === 3 && (n.nodeValue ?? "").trim() !== "",
      );
      if (!texte) continue;
      // display: none voulu (variante mobile ou desktop) : hors sujet.
      if (!(el as HTMLElement).checkVisibility({ visibilityProperty: true }))
        continue;
      let opacite = 1;
      for (let x: Element | null = el; x; x = x.parentElement) {
        opacite *= Number(getComputedStyle(x).opacity);
      }
      if (opacite < 0.5)
        out.push(
          `${el.tagName.toLowerCase()} « ${(el.textContent ?? "").trim().slice(0, 50)} » (opacité ${opacite.toFixed(2)})`,
        );
    }
    return out;
  });
}

test.describe("mouvement réduit", () => {
  test.use({ reducedMotion: "reduce" });

  for (const p of PAGES) {
    test(`aucun contenu masqué · ${p.chemin}`, async ({ page }) => {
      await page.goto(p.chemin);
      await hydrate(page.getByRole("banner"));
      // Sans défilement : les blocs sous la ligne de flottaison n'ont jamais
      // croisé l'IntersectionObserver.
      const masques = await contenusMasques(page);
      expect(masques, masques.join("\n")).toEqual([]);
    });
  }
});

test("témoin : sans mouvement réduit, le bas de l'accueil attend le défilement", async ({
  page,
}) => {
  // Garantit que le contrôle ci-dessus détecte bien un contenu masqué.
  await page.goto("/");
  await hydrate(page.getByRole("banner"));
  await expect.poll(() => contenusMasques(page)).not.toEqual([]);
});

test.describe("menu mobile au clavier", () => {
  test("ouverture, parcours, Échap referme et rend le focus", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "mobile", "Menu replié sous 900 px");
    await page.goto("/");
    const bouton = page.getByRole("button", { name: "Menu" });
    await hydrate(bouton);
    await expect(bouton).toHaveAttribute("aria-expanded", "false");
    const nav = page.getByRole("navigation", { name: "Navigation principale" });
    await expect(nav.getByRole("link", { name: "Vendre" })).toBeHidden();

    // Tabulation depuis le début de la page jusqu'au bouton.
    await page.locator("body").focus();
    for (let n = 0; n < 5; n++) {
      if (await bouton.evaluate((el) => el === document.activeElement)) break;
      await page.keyboard.press("Tab");
    }
    await expect(bouton).toBeFocused();

    await page.keyboard.press("Enter");
    const fermer = page.getByRole("button", { name: "Fermer" });
    await expect(fermer).toHaveAttribute("aria-expanded", "true");
    await expect(nav.getByRole("link", { name: "Vendre" })).toBeVisible();

    // Le premier Tab entre dans la liste.
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: "Accueil" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: /^Biens/ })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: "Vendre" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(bouton).toHaveAttribute("aria-expanded", "false");
    await expect(bouton).toBeFocused();
    await expect(nav.getByRole("link", { name: "Vendre" })).toBeHidden();

    // Rouvert puis suivi d'un lien : le menu se referme à la navigation.
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/vendre$/);
    await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
