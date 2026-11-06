import { mkdirSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";

// Le texte du h1 tient dans la boîte du h1, à 360 et 375 px, sur toutes les
// pages (demande de Zidane après le défaut de l'accueil).
//
// Pourquoi ce contrôle en plus de scrollWidth : sous `overflow-x: clip`
// (en-tête, sections, <main>), un mot trop long pour la colonne déborde de
// son h1 SANS créer de défilement horizontal. `scrollWidth` ne voit rien, le
// mot est simplement coupé à l'écran. On mesure donc le Range du contenu du
// h1 (les boîtes réelles des glyphes, transformations comprises) et on le
// compare à la boîte du h1.
//
// Passé une fois, dans le projet mobile (profil tactile) : la largeur est
// imposée par setViewportSize, la double exécution desktop n'apporterait rien.
// Captures : docs/refonte/captures/T/h1/<page>-<largeur>.png (premier écran).

const LARGEURS = [360, 375] as const;
const CAPTURES = "docs/refonte/captures/T/h1";
const TOLERANCE = 1; // px, arrondis sous-pixel

const PAGES: { nom: string; chemin: string }[] = [
  { nom: "accueil", chemin: "/" },
  { nom: "biens", chemin: "/biens" },
  { nom: "fiche", chemin: "/biens/09.362" },
  { nom: "vendre", chemin: "/vendre" },
  { nom: "louer", chemin: "/louer" },
  { nom: "le-cabinet", chemin: "/le-cabinet" },
  { nom: "honoraires", chemin: "/honoraires" },
  { nom: "contact", chemin: "/contact" },
  { nom: "estimation", chemin: "/estimation" },
  { nom: "mentions-legales", chemin: "/mentions-legales" },
  { nom: "confidentialite", chemin: "/confidentialite" },
  { nom: "fiche-inconnue", chemin: "/biens/99.999" },
  { nom: "url-inconnue", chemin: "/page-qui-n-existe-pas" },
];

type Mesure = {
  texte: string;
  boite: { gauche: number; droite: number; haut: number; bas: number };
  texteBoite: { gauche: number; droite: number; haut: number; bas: number };
  depasse: { gauche: number; droite: number };
};

test.beforeEach(async ({ request }, info) => {
  test.skip(
    info.project.name !== "mobile",
    "Largeurs imposées : exécuté une seule fois, dans le projet mobile.",
  );
  await mock.scenario(request, "default");
});

/** Attend la fin des animations Web Animations et CSS en cours. */
async function finAnimations(page: Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running"),
  );
}

/** Boîte du h1 visible et boîte du Range de son contenu. */
function mesurer(page: Page): Promise<Mesure[]> {
  return page.$$eval("h1", (all) =>
    all
      .filter((h) => (h as HTMLElement).offsetParent !== null)
      .map((h) => {
        const b = h.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(h);
        // Union des boîtes de lignes non vides (les boîtes vides d'un <br>
        // ou d'un nœud blanc fausseraient l'union).
        const rects = [...range.getClientRects()].filter(
          (r) => r.width > 0 && r.height > 0,
        );
        const t = {
          gauche: Math.min(...rects.map((r) => r.left)),
          droite: Math.max(...rects.map((r) => r.right)),
          haut: Math.min(...rects.map((r) => r.top)),
          bas: Math.max(...rects.map((r) => r.bottom)),
        };
        const arr = (n: number) => Math.round(n * 10) / 10;
        return {
          texte: (h.textContent ?? "").trim().replace(/\s+/g, " "),
          boite: {
            gauche: arr(b.left),
            droite: arr(b.right),
            haut: arr(b.top),
            bas: arr(b.bottom),
          },
          texteBoite: {
            gauche: arr(t.gauche),
            droite: arr(t.droite),
            haut: arr(t.haut),
            bas: arr(t.bas),
          },
          depasse: {
            gauche: arr(b.left - t.gauche),
            droite: arr(t.droite - b.right),
          },
        };
      }),
  );
}

for (const { nom, chemin } of PAGES) {
  test(`h1 : le texte tient dans sa boîte à 360 et 375 px · ${chemin}`, async ({
    page,
  }) => {
    mkdirSync(CAPTURES, { recursive: true });
    for (const largeur of LARGEURS) {
      await page.setViewportSize({ width: largeur, height: 760 });
      await page.goto(chemin);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      await finAnimations(page);

      const mesures = await mesurer(page);
      await page.screenshot({ path: `${CAPTURES}/${nom}-${largeur}.png` });

      expect(
        mesures,
        `${chemin} à ${largeur} px : aucun h1 visible`,
      ).toHaveLength(1);
      const [m] = mesures;
      expect(
        Math.max(m.depasse.gauche, m.depasse.droite),
        `${chemin} à ${largeur} px : le texte du h1 sort de sa boîte\n${JSON.stringify(m, null, 2)}`,
      ).toBeLessThanOrEqual(TOLERANCE);
      // Et la boîte elle-même reste dans l'écran (gouttière comprise).
      expect(
        m.boite.droite,
        `${chemin} à ${largeur} px : le h1 sort de l'écran\n${JSON.stringify(m, null, 2)}`,
      ).toBeLessThanOrEqual(largeur + TOLERANCE);
      expect(m.boite.gauche).toBeGreaterThanOrEqual(-TOLERANCE);
    }
  });
}
