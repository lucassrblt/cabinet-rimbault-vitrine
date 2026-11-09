// Outils communs de la suite e2e de la Galerie.
//
// - `PAGES` : toutes les pages publiques, titre <title> et h1 attendus.
// - `suivreConsole` : erreurs console et `pageerror` relevées dès l'ouverture.
// - `hydrate` : attend que React ait pris la main sur un élément (les champs
//   des formulaires sont contrôlés : une saisie avant l'hydratation est perdue).
// - `attendreAntiSpam` : la Server Action traite en silence comme un robot
//   tout envoi fait moins de 4 s après l'affichage (MIN_FILL_MS).
// - `debordement` : largeur du document comparée à celle de la fenêtre.

import { expect, type Locator, type Page } from "@playwright/test";

export type PageGalerie = {
  chemin: string;
  titre: string | RegExp;
  h1: string | RegExp;
};

export const PAGES: PageGalerie[] = [
  {
    chemin: "/",
    titre:
      "Cabinet Rimbault, agence immobilière à Asnières-sur-Seine depuis 2009",
    h1: /^Agent immobilier indépendant, au 117 boulevard Voltaire/,
  },
  {
    chemin: "/biens",
    // Fixtures : des ventes seulement, donc ni « louer » ni « location ».
    titre: "Nos biens à vendre à Asnières-sur-Seine | Cabinet Rimbault",
    h1: /^Biens en vente\s*\d/,
  },
  {
    chemin: "/biens/10.131",
    titre:
      /^Appartement\s2\spièces\sde\s46,6\sm²\sà\sAsnières-sur-Seine,\s300\s000\s€\s\|\sCabinet Rimbault$/,
    h1: /^Appartement\s2\spièces,\s46,6\sm²$/,
  },
  {
    chemin: "/le-cabinet",
    titre:
      "Le Cabinet Rimbault, agence immobilière indépendante à Asnières depuis 2009",
    h1: /^Le cabinet/,
  },
  {
    chemin: "/vendre",
    titre:
      "Vendre votre appartement ou votre maison à Asnières-sur-Seine | Cabinet Rimbault",
    h1: /^Vendre votre bien/,
  },
  {
    chemin: "/vendre/estimation",
    titre: "Faire estimer votre bien à Asnières-sur-Seine | Cabinet Rimbault",
    h1: "Faire estimer votre bien",
  },
  {
    chemin: "/contact",
    titre: "Contacter le Cabinet Rimbault, 117 boulevard Voltaire, Asnières",
    h1: "Nous contacter",
  },
  {
    chemin: "/honoraires",
    titre: "Nos honoraires de vente et de location | Cabinet Rimbault",
    h1: /^Nos honoraires/,
  },
  {
    chemin: "/mentions-legales",
    titre: "Mentions légales | Cabinet Rimbault",
    h1: /^Mentions légales/,
  },
  {
    chemin: "/confidentialite",
    titre: "Confidentialité et données personnelles | Cabinet Rimbault",
    h1: /^Confidentialité/,
  },
];

export const PAGE_INTROUVABLE = "/page-qui-n-existe-pas";

/** Erreurs de la page relevées dès l'ouverture. */
export function suivreConsole(page: Page, statutAttendu = 200) {
  const erreurs: string[] = [];
  page.on("pageerror", (e) => erreurs.push(`pageerror : ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const texte = msg.text();
    // Chrome journalise le statut du document lui-même (404 attendu).
    if (
      statutAttendu !== 200 &&
      /Failed to load resource: the server responded with a status of 404/.test(
        texte,
      )
    )
      return;
    erreurs.push(`console : ${texte.slice(0, 300)}`);
  });
  return erreurs;
}

/** Vrai quand React a hydraté l'élément (propriétés `__reactFiber…`). */
export async function hydrate(cible: Locator) {
  await expect
    .poll(
      () =>
        cible.evaluate((el) =>
          Object.keys(el).some((k) => k.startsWith("__reactFiber")),
        ),
      { message: "hydratation React", timeout: 30_000 },
    )
    .toBe(true);
}

/** Délai anti-spam (4 s) plus une marge, compté depuis `depuis`. */
export async function attendreAntiSpam(page: Page, depuis: number) {
  const reste = 4_500 - (Date.now() - depuis);
  if (reste > 0) await page.waitForTimeout(reste);
}

export function debordement(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}

/** En-tête (bannière) et pied (contentinfo) de la Galerie. */
export async function cadrePresent(page: Page) {
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Cabinet Rimbault", exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Mentions légales" }),
  ).toBeAttached();
  await expect(page.getByRole("main")).toHaveCount(1);
}
