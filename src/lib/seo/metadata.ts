import type { Metadata } from "next";
import { agency } from "@/lib/agency";

// Aides de métadonnées (doc 04 §4.4). Next fusionne les métadonnées des segments
// de façon SUPERFICIELLE : une page qui définit `openGraph` ou `robots` remplace
// entièrement ceux du layout. `pageMetadata` reconstruit donc tout le bloc.

/** URL publique du site. `SITE_URL` (domaine à confirmer, brief §10-4). */
export function getSiteUrl(): URL {
  const raw = process.env.SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw);
    } catch {
      // Valeur illisible : on retombe sur l'URL locale (check-launch la signale).
    }
  }
  return new URL(`http://localhost:${process.env.PORT ?? "3000"}`);
}

/**
 * Seule la production est indexable (`SITE_ENV=production`), et jamais tant
 * que la porte de maintenance est posée (`MAINTENANCE_MODE=on`, `src/proxy.ts`) :
 * `robots.txt`, le plan du site et les balises `robots` restent alors fermés.
 */
export function isIndexable(): boolean {
  return (
    process.env.SITE_ENV === "production" &&
    process.env.MAINTENANCE_MODE !== "on"
  );
}

export const SITE_NAME = agency.name;

/**
 * Image Open Graph par défaut (`app/opengraph-image.png`, Cantona). Une page qui
 * définit `openGraph` perd l'image de fichier héritée : on la repose donc ici.
 * Alt identique à `app/opengraph-image.alt.txt`.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Cabinet Rimbault, vente, location et estimation à Asnières-sur-Seine. Dessin au trait d’une rue bordée d’un pavillon et d’un immeuble.",
  type: "image/png",
};

/** Titre par défaut (accueil) et gabarit « %s | Cabinet Rimbault ». */
export const DEFAULT_TITLE =
  "Cabinet Rimbault, agence immobilière à Asnières-sur-Seine depuis 2009";
export const DEFAULT_DESCRIPTION =
  "Vente et location d’appartements et de maisons à Asnières-sur-Seine. Un cabinet indépendant au 117 boulevard Voltaire, depuis 2009. Estimation sur rendez-vous.";

function robots(noindex = false): Metadata["robots"] {
  const index = isIndexable() && !noindex;
  return { index, follow: index };
}

/** Métadonnées du layout racine. */
export function baseMetadata(): Metadata {
  return {
    metadataBase: getSiteUrl(),
    title: { default: DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: robots(),
  };
}

export type PageMetadataInput = {
  /** Titre de la page, sans le suffixe « | Cabinet Rimbault ». */
  title: string;
  description: string;
  /** Chemin canonique, sans paramètre (« /biens/10.131 »). */
  path: string;
  /** Image Open Graph propre à la page (photo principale d'une fiche). */
  image?: { url: string; alt: string; width?: number; height?: number };
  /**
   * Titre affiché tel quel, sans gabarit (accueil). Automatique quand le titre
   * contient déjà le nom du cabinet (pas de « … Cabinet Rimbault | Cabinet Rimbault »).
   */
  absoluteTitle?: boolean;
  /** Pages à ne jamais indexer (confirmation, erreurs). */
  noindex?: boolean;
};

/** Métadonnées complètes d'une page : titre, description, canonique, Open Graph, robots. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  absoluteTitle = false,
  noindex = false,
}: PageMetadataInput): Metadata {
  const absolute = absoluteTitle || title.includes(SITE_NAME);
  const ogTitle = absolute ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
      url: path,
      title: ogTitle,
      description,
      images: [image ?? DEFAULT_OG_IMAGE],
    },
    robots: robots(noindex),
  };
}
