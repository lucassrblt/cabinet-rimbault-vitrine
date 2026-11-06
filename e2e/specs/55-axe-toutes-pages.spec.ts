import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { mock } from "../mock-client";
import { finAnimations, PAGES, parcourirLaPage } from "../support/recette";

// axe-core sans violation `serious` ou `critical` (brief §9) sur TOUTES les
// pages, dans les scénarios où leur contenu change (default, edge pour les
// listes et une location, empty pour l'état vide). Le tunnel, étape par
// étape, est dans 50-accessibilite-axe. Les FAQ sont ouvertes avant analyse.

const CAS: { scenario: "default" | "edge" | "empty"; chemin: string }[] = [
  ...Object.values(PAGES).map((p) => ({
    scenario: "default" as const,
    chemin: p.chemin,
  })),
  { scenario: "edge", chemin: "/biens" },
  { scenario: "edge", chemin: "/biens/TEST-LOC-1" },
  { scenario: "edge", chemin: "/biens/TEST-NOIMG" },
  { scenario: "edge", chemin: "/" },
  { scenario: "empty", chemin: "/biens" },
  { scenario: "empty", chemin: "/" },
];

for (const { scenario, chemin } of CAS) {
  test(`axe · ${scenario} · ${chemin}`, async ({ page, request }) => {
    await mock.scenario(request, scenario);
    await page.goto(chemin);
    await page.waitForLoadState("networkidle");
    await page.$$eval("main details", (all) => {
      for (const d of all) (d as HTMLDetailsElement).open = true;
    });
    await parcourirLaPage(page);
    await finAnimations(page);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .exclude("nextjs-portal")
      .analyze();
    const graves = violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => ({
        id: v.id,
        impact: v.impact,
        aide: v.help,
        cibles: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
      }));
    expect(graves, JSON.stringify(graves, null, 2)).toEqual([]);
  });
}
