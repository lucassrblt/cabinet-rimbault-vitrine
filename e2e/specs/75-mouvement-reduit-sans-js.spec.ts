import { expect, test } from "@playwright/test";
import { mock } from "../mock-client";
import { capturer, PAGES, parcourirLaPage } from "../support/recette";

// Brief §9 et §7 :
// - sous `prefers-reduced-motion: reduce`, aucune transition ni animation de
//   plus de 0 ms, hors changements de couleur ;
// - sans JavaScript, tout le contenu est visible (l'état initial invisible
//   n'est posé qu'en JavaScript). La 404 d'une fiche sans JavaScript est
//   contrôlée en production par 30-sans-javascript.

const PAGES_200 = Object.values(PAGES).filter((p) => !p.statut);

const COULEURS = new Set([
  "color",
  "background-color",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "text-decoration-color",
  "fill",
  "stroke",
  "caret-color",
]);

test.beforeEach(async ({ request }) => {
  await mock.scenario(request, "default");
});

test.describe("mouvement réduit", () => {
  for (const cible of PAGES_200) {
    test(`${cible.chemin} : aucune durée hors couleurs`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(cible.chemin);
      await page.waitForLoadState("networkidle");
      await parcourirLaPage(page);
      const fautes = await page.evaluate(
        (couleurs) => {
          const autorisees = new Set(couleurs);
          const secondes = (v: string) =>
            v.split(",").map((x) => {
              const t = x.trim();
              return t.endsWith("ms")
                ? Number.parseFloat(t) / 1000
                : Number.parseFloat(t);
            });
          const out: string[] = [];
          for (const el of document.querySelectorAll("body *")) {
            if (el.closest("nextjs-portal, script, style")) continue;
            for (const pseudo of [null, "::before", "::after"] as const) {
              const s = getComputedStyle(el, pseudo);
              const props = s.transitionProperty
                .split(",")
                .map((x) => x.trim());
              const durees = secondes(s.transitionDuration);
              props.forEach((p, i) => {
                const d = durees[i % durees.length] ?? 0;
                if (d > 0 && !autorisees.has(p))
                  out.push(
                    `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}${pseudo ?? ""} : transition ${p} ${d}s`,
                  );
              });
              if (s.animationName !== "none") {
                const da = Math.max(...secondes(s.animationDuration));
                if (da > 0)
                  out.push(
                    `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}${pseudo ?? ""} : animation ${s.animationName} ${da}s`,
                  );
              }
            }
          }
          const enCours = document
            .getAnimations()
            .filter((a) => {
              const t = a.effect?.getTiming();
              return Number(t?.duration ?? 0) > 0 && a.playState === "running";
            })
            .map(
              (a) =>
                `Web Animation ${(a as CSSAnimation).animationName ?? a.id}`,
            );
          return [...new Set([...out, ...enCours])];
        },
        [...COULEURS],
      );
      expect(fautes).toEqual([]);
    });
  }
});

test.describe("sans JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const cible of PAGES_200) {
    test(`${cible.chemin} : tout le contenu est visible`, async ({
      page,
    }, info) => {
      const res = await page.goto(cible.chemin);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const caches = await page.evaluate(() => {
        const opacite = (el: Element | null): number => {
          let o = 1;
          for (let e = el; e; e = e.parentElement)
            o *= Number.parseFloat(getComputedStyle(e).opacity);
          return o;
        };
        const out: string[] = [];
        for (const el of document.querySelectorAll(
          "main *, header *, footer *",
        )) {
          const aContenu =
            el.tagName === "IMG" ||
            [...el.childNodes].some(
              (c) => c.nodeType === 3 && (c.nodeValue ?? "").trim(),
            );
          if (!aContenu) continue;
          const s = getComputedStyle(el);
          if (
            s.display === "none" ||
            el.closest("[hidden], noscript, dialog:not([open])")
          )
            continue;
          if (s.visibility === "hidden" || opacite(el) < 0.99)
            out.push(
              `${el.tagName.toLowerCase()} « ${(el.textContent ?? el.getAttribute("src") ?? "").trim().slice(0, 50)} » opacité ${opacite(el).toFixed(2)}`,
            );
        }
        return out;
      });
      expect(caches).toEqual([]);
      if (cible.tunnel) {
        // Le tunnel a besoin de JavaScript : il le dit, avec le téléphone.
        await expect(
          page.getByText(/a besoin de JavaScript/).filter({ visible: true }),
        ).toHaveCount(1);
      }
      await capturer(page, info, "sans-js", cible.nom);
    });
  }
});
