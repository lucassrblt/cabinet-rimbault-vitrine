import { agency } from "@/lib/agency";
import { absoluteUrl as absolute } from "@/lib/site-url";

// Constructeurs JSON-LD (doc 04 §4.4). Règles :
// - pas d'`aggregateRating` (avis auto-déclarés refusés par Google) ;
// - adresse d'un bien limitée à la ville et au code postal ;
// - une donnée non confirmée (horaires, secteur) n'est pas publiée ;
// - pas de `legalName` : la dénomination sociale (RCS 511 484 586) n'est pas
//   sourcée tant que l'extrait Kbis n'est pas fourni.

export type JsonLdObject = { "@context"?: string; "@type": string } & Record<
  string,
  unknown
>;

function postalAddress(input: {
  street?: string;
  postalCode: string;
  city?: string | null;
}) {
  return {
    "@type": "PostalAddress",
    ...(input.street ? { streetAddress: input.street } : {}),
    ...(input.postalCode ? { postalCode: input.postalCode } : {}),
    ...(input.city ? { addressLocality: input.city } : {}),
    addressCountry: "FR",
  };
}

/** Cabinet (layout racine). */
export function realEstateAgentJsonLd(): JsonLdObject {
  const { address, phone, legal } = agency;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": absolute("/#cabinet"),
    name: agency.name,
    url: absolute("/"),
    image: absolute("/opengraph-image.png"),
    telephone: phone.href.replace("tel:", ""),
    ...(agency.email ? { email: agency.email } : {}),
    foundingDate: String(agency.since),
    address: postalAddress(address),
    taxID: legal.siren,
    ...(agency.sector
      ? {
          areaServed: agency.sector.map((name) => ({ "@type": "City", name })),
        }
      : {}),
    // Fiche Google réelle seulement (une URL de recherche n'identifie pas le cabinet).
    ...(agency.google.profileUrl ? { sameAs: [agency.google.profileUrl] } : {}),
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(
  items: readonly BreadcrumbItem[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export type FaqItem = { question: string; answer: string };

/** `/vendre`, `/louer` : réponses en texte brut. */
export function faqPageJsonLd(items: readonly FaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export type ListingJsonLdInput = {
  /** Titre « phrase » (A33) : « Appartement 3 pièces de 59,5 m² ». */
  name: string;
  description: string;
  path: string;
  images: readonly string[];
  price: number;
  transaction: "VENTE" | "LOCATION";
  /** Statut public : disponible, ou sous offre / sous compromis. */
  available: boolean;
  propertyType: "APPARTEMENT" | "MAISON" | "AUTRE";
  surface: number | null;
  rooms: number | null;
  postalCode: string;
  /** `null` : ville non saisie, `addressLocality` est omis (rien d'inventé). */
  city: string | null;
  datePosted: string;
};

/** Fiche bien : `RealEstateListing` + `Offer` + objet, adresse ville et code postal seulement. */
export function realEstateListingJsonLd(
  input: ListingJsonLdInput,
): JsonLdObject {
  const itemType =
    input.propertyType === "APPARTEMENT"
      ? "Apartment"
      : input.propertyType === "MAISON"
        ? "SingleFamilyResidence"
        : "Accommodation";
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: input.name,
    description: input.description,
    url: absolute(input.path),
    datePosted: input.datePosted,
    ...(input.images.length ? { image: [...input.images] } : {}),
    offers: {
      "@type": "Offer",
      price: input.price,
      priceCurrency: "EUR",
      businessFunction:
        input.transaction === "LOCATION"
          ? "http://purl.org/goodrelations/v1#LeaseOut"
          : "http://purl.org/goodrelations/v1#Sell",
      availability: input.available
        ? "https://schema.org/InStock"
        : "https://schema.org/LimitedAvailability",
      seller: { "@id": absolute("/#cabinet") },
    },
    about: {
      "@type": itemType,
      ...(input.surface
        ? {
            floorSize: {
              "@type": "QuantitativeValue",
              value: input.surface,
              unitCode: "MTK",
            },
          }
        : {}),
      ...(input.rooms ? { numberOfRooms: input.rooms } : {}),
      address: postalAddress({
        postalCode: input.postalCode,
        city: input.city,
      }),
    },
  };
}
