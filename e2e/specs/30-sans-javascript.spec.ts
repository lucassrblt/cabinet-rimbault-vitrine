import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";
import { mock } from "../mock-client";

// Pages 404 sans JavaScript (brief §9 : « Sans JavaScript, tout le contenu est
// visible » ; 404 : en-tête et pied présents, ILL-08, liens Accueil, Nos biens
// et téléphone). Revue du lot 1, tour 1.
//
// Ne vaut que sur `next build` + `next start` (E2E_SERVEUR=prod) : en dev, un
// notFound() levé dans une page renvoie l'enveloppe `__next_error__` vide, que
// seul le client remplit. C'est un comportement de `next dev`, pas du site.
//
// Captures (contrôle visuel) : E2E_CAPTURES_DIR=<dossier>.

const SERVEUR_PROD = process.env.E2E_SERVEUR === "prod";

test.use({ javaScriptEnabled: false });

test.skip(
  !SERVEUR_PROD,
  "Contrôle sans JavaScript réservé au serveur de production (E2E_SERVEUR=prod).",
);

test.beforeEach(async ({ request }) => {
  await mock.reset(request);
});

const CAS = [
  // Référence absente de la liste : `src/proxy.ts` réécrit vers la page
  // statique `(site)/biens-introuvable` avec le statut 404 (lot 0).
  // En `next dev`, le <head> portait deux meta robots et « Page introuvable »
  // (revue du lot 2, tour 2) : contrôlé ici en build + start.
  {
    nom: "fiche-inconnue",
    chemin: "/biens/99.999",
    h1: "Ce bien n’est plus en ligne.",
    titre: "Bien introuvable | Cabinet Rimbault",
  },
  // URL hors de toute route : app/not-found.tsx (racine).
  {
    nom: "url-inconnue",
    chemin: "/page-qui-n-existe-pas",
    h1: /n’existe pas/,
    titre: "Page introuvable | Cabinet Rimbault",
  },
];

async function capturer(page: Page, nom: string, projet: string) {
  const dossier = process.env.E2E_CAPTURES_DIR;
  if (!dossier) return;
  mkdirSync(dossier, { recursive: true });
  await page.screenshot({
    path: path.join(dossier, `${nom}-${projet}.png`),
    fullPage: true,
  });
}

for (const cas of CAS) {
  test(`404 lisible sans JavaScript · ${cas.chemin}`, async ({
    page,
  }, info) => {
    const res = await page.goto(cas.chemin);
    expect(res?.status(), "statut HTTP").toBe(404);

    // Pas d'enveloppe d'erreur vide : le HTML servi contient la page.
    await expect(page.locator("html#__next_error__")).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    // Une seule balise robots (pas de doublon `noindex` / `noindex, nofollow`).
    const robots = page.locator('meta[name="robots"]');
    await expect(robots, "nombre de meta robots").toHaveCount(1);
    await expect(robots).toHaveAttribute("content", /noindex/);
    await expect(page).toHaveTitle(cas.titre);

    // Un seul h1, visible, avec le texte de la 404.
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(cas.h1);

    // En-tête et pied présents, un seul <main>.
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("footer").first()).toBeVisible();

    // ILL-08 visible (pas d'opacité nulle en attente d'un script).
    const ill = page.locator(
      'main img[src*="ill-08"], main img[srcset*="ill-08"]',
    );
    await expect(ill).toHaveCount(1);
    await expect(ill).toBeVisible();
    expect(
      await ill.evaluate((el) => {
        let n: Element | null = el;
        let o = 1;
        while (n) {
          o *= Number(getComputedStyle(n).opacity);
          n = n.parentElement;
        }
        return o;
      }),
      "opacité cumulée d'ILL-08",
    ).toBe(1);

    // Trois sorties.
    const main = page.locator("main");
    await expect(
      main.getByRole("link", { name: "Accueil", exact: true }),
    ).toHaveAttribute("href", "/");
    await expect(
      main.getByRole("link", { name: "Nos biens", exact: true }),
    ).toHaveAttribute("href", "/biens");
    await expect(main.locator('a[href^="tel:"]')).toHaveCount(1);
    await expect(main.locator('a[href^="tel:"]')).toBeVisible();

    // Aucun texte du contenu masqué par une opacité ou une visibilité de départ
    // (animation d'entrée qui attendrait un script).
    const masques = await main.evaluate((m) => {
      const out: string[] = [];
      for (const el of m.querySelectorAll<HTMLElement>("*")) {
        if (!el.innerText?.trim() || el.children.length > 0) continue;
        let n: Element | null = el;
        let o = 1;
        let cache = false;
        while (n) {
          const cs = getComputedStyle(n);
          o *= Number(cs.opacity);
          if (cs.visibility === "hidden" || cs.display === "none") cache = true;
          n = n.parentElement;
        }
        if (cache || o < 1) out.push(el.innerText.trim().slice(0, 60));
      }
      return out;
    });
    expect(masques, "textes masqués sans JavaScript").toEqual([]);

    // Aucun débordement horizontal.
    const debord = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(debord, "défilement horizontal (px)").toBeLessThanOrEqual(0);

    await capturer(page, cas.nom, info.project.name);
  });
}
