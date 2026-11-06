// Outils communs de la recette (lot T, Maldini). Critères : brief §9.
//
// - `PAGES` : toutes les pages publiques, avec leur statut attendu.
// - `PAGES_PAR_SCENARIO` : pages contrôlées dans chaque scénario du mock.
// - `auditerDom` : une seule passe dans le navigateur, qui relève tout ce que
//   les critères transverses interdisent (chaînes, capitales, ombres floues,
//   dégradés, éléments fixes, boutons grenat du premier écran, images…).
// - `suivreLaPage` : erreurs console, `pageerror`, requêtes vers Google Fonts.
// - `capturer` : captures de contrôle visuel dans docs/refonte/captures/T/.
//
// Le scénario du mock est un état du serveur : la recette se lance sur un
// mock PRIVÉ (MOCK_API_PORT), jamais sur le mock partagé 3101, pour ne pas
// changer le scénario sous les pieds des autres agents.

import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Page, TestInfo } from "@playwright/test";

export type Scenario = "default" | "empty" | "error" | "edge";

export type PageRecette = {
  /** Chemin ouvert. */
  chemin: string;
  /** Nom court des captures. */
  nom: string;
  /** Statut HTTP attendu. */
  statut?: number;
  /** Mise en page du tunnel (en-tête réduit, sans navigation). */
  tunnel?: boolean;
};

export const PAGES: Record<string, PageRecette> = {
  accueil: { chemin: "/", nom: "accueil" },
  biens: { chemin: "/biens", nom: "biens" },
  fiche10131: { chemin: "/biens/10.131", nom: "fiche-10.131" },
  fiche10129: { chemin: "/biens/10129", nom: "fiche-10129" },
  fiche10130: { chemin: "/biens/10.130", nom: "fiche-10.130" },
  fiche09362: { chemin: "/biens/09.362", nom: "fiche-09.362" },
  estimation: { chemin: "/estimation", nom: "estimation", tunnel: true },
  vendre: { chemin: "/vendre", nom: "vendre" },
  louer: { chemin: "/louer", nom: "louer" },
  cabinet: { chemin: "/le-cabinet", nom: "le-cabinet" },
  honoraires: { chemin: "/honoraires", nom: "honoraires" },
  contact: { chemin: "/contact", nom: "contact" },
  mentions: { chemin: "/mentions-legales", nom: "mentions-legales" },
  confidentialite: { chemin: "/confidentialite", nom: "confidentialite" },
  introuvable: {
    chemin: "/page-qui-n-existe-pas",
    nom: "404-url",
    statut: 404,
  },
  ficheInconnue: { chemin: "/biens/99.999", nom: "404-fiche", statut: 404 },
};

const P = PAGES;

/** Pages contrôlées par scénario (les fiches n'existent pas en `empty`). */
export const PAGES_PAR_SCENARIO: Record<Scenario, PageRecette[]> = {
  default: Object.values(PAGES),
  edge: [
    P.accueil,
    P.biens,
    P.vendre,
    P.louer,
    { chemin: "/biens/TEST-LOC-1", nom: "fiche-location" },
    { chemin: "/biens/TEST-NOIMG", nom: "fiche-sans-photo" },
    { chemin: "/biens/TEST-MAISON", nom: "fiche-maison" },
    { chemin: "/biens/TEST-LONG", nom: "fiche-longue" },
  ],
  empty: [
    P.accueil,
    P.biens,
    P.vendre,
    P.louer,
    { chemin: "/biens/10.131", nom: "fiche-absente", statut: 404 },
  ],
  error: [P.accueil, P.biens, P.vendre, P.louer, P.cabinet, P.contact],
};

export const GRENAT = "rgb(95, 26, 36)";

/** Dossier des captures de recette ; `E2E_RECETTE_DIR` pour garder un tour à part. */
export const DOSSIER_CAPTURES =
  process.env.E2E_RECETTE_DIR ?? "docs/refonte/captures/T/recette";

export async function capturer(
  page: Page,
  info: TestInfo,
  sousDossier: string,
  nom: string,
  pleinePage = true,
) {
  const dossier = path.join(DOSSIER_CAPTURES, sousDossier);
  mkdirSync(dossier, { recursive: true });
  await page.screenshot({
    path: path.join(dossier, `${nom}-${info.project.name}.png`),
    fullPage: pleinePage,
  });
}

/** Erreurs de la page et requêtes interdites, relevées dès l'ouverture. */
export function suivreLaPage(page: Page, statutAttendu = 200) {
  const erreurs: string[] = [];
  const policesExternes: string[] = [];
  page.on("pageerror", (e) => erreurs.push(`pageerror : ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const texte = msg.text();
    // Chrome journalise le statut du document lui-même (404 attendu).
    if (
      statutAttendu !== 200 &&
      /Failed to load resource: the server responded with a status of (404|500)/.test(
        texte,
      )
    )
      return;
    erreurs.push(`console : ${texte.slice(0, 300)}`);
  });
  page.on("request", (req) => {
    const host = new URL(req.url()).host;
    if (host === "fonts.googleapis.com" || host === "fonts.gstatic.com")
      policesExternes.push(req.url());
  });
  return { erreurs, policesExternes };
}

/** Attend la fin des animations Web Animations et CSS en cours. */
export async function finAnimations(page: Page) {
  await page
    .waitForFunction(
      () => document.getAnimations().every((a) => a.playState !== "running"),
      undefined,
      { timeout: 5_000 },
    )
    .catch(() => undefined);
}

export type AuditDom = {
  lang: string | null;
  titre: string;
  description: string | null;
  h1: string[];
  titres: { niveau: number; texte: string }[];
  interdits: { motif: string; extrait: string }[];
  premierePersonne: string[];
  /** Texte lu ou entendu contenant une apostrophe droite U+0027 (C-P3). */
  apostrophesDroites: string[];
  capitales: string[];
  ombresFloues: string[];
  degrades: string[];
  fixes: string[];
  boutonsGrenatPremierEcran: { texte: string; dansEntete: boolean }[];
  images: {
    src: string;
    alt: string | null;
    illustration: boolean;
    photo: boolean;
    energie: boolean;
    optimisee: boolean;
  }[];
  recherche: string[];
  selects: number;
  debordement: { scrollWidth: number; clientWidth: number };
};

/**
 * Passe unique dans le DOM. Tout est relevé, rien n'est jugé ici : les
 * assertions sont faites côté test, avec des messages lisibles.
 */
export function auditerDom(page: Page): Promise<AuditDom> {
  return page.evaluate(() => {
    const visible = (el: Element) =>
      (el as HTMLElement).checkVisibility?.({
        visibilityProperty: true,
        opacityProperty: false,
      }) ?? true;
    const decrire = (el: Element) => {
      const id = el.id ? `#${el.id}` : "";
      const cls =
        typeof el.className === "string" && el.className
          ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}`
          : "";
      const texte = (el.textContent ?? "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 50);
      return `${el.tagName.toLowerCase()}${id}${cls}${texte ? ` « ${texte} »` : ""}`;
    };
    const horsSite = (el: Element) =>
      !!el.closest("script, style, noscript, template, nextjs-portal");

    // --- Texte du DOM (nœuds texte, plus les attributs lus à voix haute)
    const morceaux: { texte: string; el: Element }[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      const t = n.nodeValue ?? "";
      if (!el || !t.trim() || horsSite(el)) continue;
      morceaux.push({ texte: t, el });
    }
    for (const el of document.body.querySelectorAll(
      "[alt], [aria-label], [title], [placeholder]",
    )) {
      if (horsSite(el)) continue;
      for (const a of ["alt", "aria-label", "title", "placeholder"]) {
        const v = el.getAttribute(a);
        if (v?.trim()) morceaux.push({ texte: v, el });
      }
    }
    const description =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") ?? null;
    const tout = [
      document.title,
      description ?? "",
      ...morceaux.map((m) => m.texte),
    ].join("\n");

    const ESP = "[\\s\\u00a0\\u202f]";
    const MOTIFS: [string, RegExp][] = [
      ["null", /\bnull\b/],
      ["undefined", /\bundefined\b/],
      ["NaN", /\bNaN\b/],
      ["-1 €", new RegExp(`-1${ESP}*€`)],
      ["lorem", /lorem/i],
      ["TODO", /\bTODO\b/i],
      ["xxx", /xxx/i],
      ["Découvrez", /d[ée]couvrez/i],
      ["N'hésitez pas", /n[’']h[ée]sitez pas/i],
      ["[À CONFIRMER]", /à confirmer/i],
      ["[À FOURNIR]", /à fournir/i],
      ["[ZIDANE", /\[zidane/i],
      ["point médian", /·/],
      ["emoji", /(?![©®™])\p{Extended_Pictographic}/u],
      ["étoile", /[★☆⭐]/],
      ["2021, 2022 et 2023", /2021, 2022 et 2023/],
      ["date ISO", /\b\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?/],
      ["Expertise", /\bexpertise\b/i],
      ["Passion", /\bpassion\b/i],
      ["partenaire de confiance", /partenaire de confiance/i],
      ["CC (charges comprises)", /\bCC\b/],
    ];
    const interdits: { motif: string; extrait: string }[] = [];
    for (const [motif, re] of MOTIFS) {
      const m = re.exec(tout);
      if (m) {
        const i = Math.max(0, m.index - 40);
        interdits.push({
          motif,
          extrait: tout.slice(i, m.index + 40).replace(/\s+/g, " "),
        });
      }
    }

    // « je » et « j’ » hors citations d'avis et hors saisie du visiteur
    // (textarea préremplie « Bonjour, je souhaite visiter… », doc 04).
    const JE = /(?<!\p{L})(?:je(?!\p{L})|j[’'](?=\p{L}))/iu;
    const premierePersonne = morceaux
      .filter(
        (m) =>
          JE.test(m.texte) &&
          !m.el.closest("blockquote, q, textarea, figure, [data-citation]"),
      )
      .map((m) => `${decrire(m.el)} : ${m.texte.trim().slice(0, 80)}`);

    // Apostrophe droite U+0027 : interdite partout dans le texte lu ou
    // entendu, citations d'avis comprises (revue finale n° 1, C-P3 et C-M2).
    // Titre et description comptent aussi (onglet, résultats de recherche).
    const apostrophesDroites = [
      ...[document.title, description ?? ""]
        .filter((t) => t.includes("'"))
        .map((t) => `<head> : ${t.slice(0, 80)}`),
      ...morceaux
        .filter((m) => m.texte.includes("'"))
        .map((m) => {
          const i = m.texte.indexOf("'");
          const extrait = m.texte
            .slice(Math.max(0, i - 30), i + 30)
            .replace(/\s+/g, " ");
          return `${decrire(m.el)} : …${extrait}…`;
        }),
    ];

    // --- Styles calculés
    const capitales: string[] = [];
    const ombresFloues: string[] = [];
    const degrades: string[] = [];
    const fixes: string[] = [];
    const tous = [...document.body.querySelectorAll("*")].filter(
      (el) => !horsSite(el),
    );
    const flouDe = (ombre: string) => {
      // « rgb(…) 0px 4px 6px -1px, … » : 3e longueur = rayon de flou.
      const parts = ombre.split(/,(?![^(]*\))/);
      return parts.some((p) => {
        const px = [...p.matchAll(/(-?[\d.]+)px/g)].map((x) => Number(x[1]));
        return (px[2] ?? 0) > 0;
      });
    };
    for (const el of tous) {
      const s = getComputedStyle(el);
      const aDuTexte = [...el.childNodes].some(
        (c) => c.nodeType === 3 && (c.nodeValue ?? "").trim(),
      );
      if (aDuTexte && visible(el)) {
        if (s.textTransform === "uppercase")
          capitales.push(`${decrire(el)} (text-transform)`);
        if (s.fontVariantCaps !== "normal")
          capitales.push(
            `${decrire(el)} (font-variant-caps ${s.fontVariantCaps})`,
          );
      }
      const energie = el.closest(
        "[data-energie], [data-etiquette-energie], [data-energy]",
      );
      for (const pseudo of [null, "::before", "::after"] as const) {
        const ps = pseudo ? getComputedStyle(el, pseudo) : s;
        if (pseudo && (ps.content === "none" || ps.content === "normal"))
          continue;
        if (ps.boxShadow !== "none" && flouDe(ps.boxShadow))
          ombresFloues.push(`${decrire(el)}${pseudo ?? ""} : ${ps.boxShadow}`);
        if (!energie && /gradient\(/.test(ps.backgroundImage))
          degrades.push(`${decrire(el)}${pseudo ?? ""}`);
      }
      if (s.position === "fixed" && visible(el)) fixes.push(decrire(el));
    }

    // --- Boutons grenat visibles dans le premier écran
    const boutonsGrenatPremierEcran = [
      ...document.querySelectorAll("a, button"),
    ]
      .filter((el) => {
        if (!visible(el) || horsSite(el)) return false;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.bottom <= 0 || r.top >= window.innerHeight)
          return false;
        return getComputedStyle(el).backgroundColor === "rgb(95, 26, 36)";
      })
      .map((el) => ({
        texte: (el.textContent ?? "").trim().replace(/\s+/g, " "),
        dansEntete: !!el.closest("header"),
      }));

    // --- Images
    const images = [...document.querySelectorAll("img")]
      .filter((img) => !horsSite(img))
      .map((img) => {
        const src = img.getAttribute("src") ?? "";
        const decode = decodeURIComponent(src);
        return {
          src: decode.slice(0, 160),
          alt: img.getAttribute("alt"),
          illustration: /\/illustrations\//.test(decode),
          // Étiquettes DPE et GES (SVG de l'admin) : servies telles quelles.
          energie: /property-files\/[^/]+\/energy\//.test(decode),
          photo:
            /supabase\.co|property-files/.test(decode) &&
            !/property-files\/[^/]+\/energy\//.test(decode),
          optimisee: src.startsWith("/_next/image"),
        };
      });

    const recherche = [
      ...document.querySelectorAll('input[type="search"], [role="search"]'),
    ].map(decrire);

    const titres = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
      .filter((h) => !horsSite(h) && getComputedStyle(h).display !== "none")
      .filter((h) => !h.closest("[hidden]"))
      .map((h) => ({
        niveau: Number(h.tagName.slice(1)),
        texte: (h.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 80),
      }));

    return {
      lang: document.documentElement.getAttribute("lang"),
      titre: document.title,
      description,
      h1: titres.filter((t) => t.niveau === 1).map((t) => t.texte),
      titres,
      interdits,
      premierePersonne,
      apostrophesDroites,
      capitales,
      ombresFloues,
      degrades,
      fixes,
      boutonsGrenatPremierEcran,
      images,
      recherche,
      selects: document.querySelectorAll("select").length,
      debordement: {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      },
    };
  });
}

/** Niveaux sautés dans la suite des titres (h2 suivi d'un h4…). */
export function sautsDeNiveau(titres: AuditDom["titres"]) {
  return titres
    .map((t, i) => ({ t, avant: titres[i - 1] }))
    .filter(({ t, avant }) => avant && t.niveau > avant.niveau + 1)
    .map(
      ({ t, avant }) =>
        `h${avant.niveau} « ${avant.texte} » → h${t.niveau} « ${t.texte} »`,
    );
}

/** Défile jusqu'en bas par paliers (images différées), puis revient en haut.
 * Défilement `instant` : <html data-scroll-behavior="smooth"> rend
 * `scrollTo` animé hors mouvement réduit (C-X7), ce qui fausserait les mesures.
 */
export async function parcourirLaPage(page: Page) {
  await page.evaluate(async () => {
    const pas = Math.max(300, window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += pas) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}
