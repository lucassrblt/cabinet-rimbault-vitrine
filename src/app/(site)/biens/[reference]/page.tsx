import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ServiceError } from "@/components/layout/ServiceError";
import { CoproBlock } from "@/components/property/CoproBlock";
import { EnergyBlock } from "@/components/property/EnergyBlock";
import { FicheSection } from "@/components/property/FicheSection";
import { KeyFacts } from "@/components/property/KeyFacts";
import { PriceBlock } from "@/components/property/PriceBlock";
import { PropertyContact } from "@/components/property/PropertyContact";
import { PropertyDescription } from "@/components/property/PropertyDescription";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyLocation } from "@/components/property/PropertyLocation";
import { SimilarProperties } from "@/components/property/SimilarProperties";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import {
  getProperties,
  getProperty,
  getSimilarProperties,
} from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { excerpt } from "@/lib/property/description";
import {
  composeTitle,
  type PropertyView,
  pageTitle,
  toPropertyView,
} from "@/lib/property/view";
import { realEstateListingJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

// Fiche bien (doc 04 §2.3, brief A6, A29 à A33, §9).
// Desktop : galerie sur 8 colonnes, colonne d'action de 4 colonnes collante
// (titre, lieu, prix, honoraires, actions), puis le contenu sous la galerie.
// Mobile (A30) : galerie, `h1`, lieu, prix et honoraires, deux boutons
// pleine largeur, puis L'essentiel. Aucune barre fixe. Jamais l'adresse exacte.
// Références brutes, points compris (`/biens/10.131`, journal lot 0).

type Props = { params: Promise<{ reference: string }> };

async function readReference(params: Props["params"]): Promise<string> {
  const { reference } = await params;
  try {
    return decodeURIComponent(reference);
  } catch {
    return reference;
  }
}

/** Fiches pré-rendues au build ; les biens publiés ensuite le sont à la demande. */
export async function generateStaticParams(): Promise<{ reference: string }[]> {
  try {
    const properties = await getProperties();
    return properties.map((p) => ({ reference: p.reference }));
  } catch {
    return [];
  }
}

/** Longueur visée de la meta description (affichage complet dans les moteurs). */
const META_MAX = 160;
/** En deçà, l'extrait serait trop maigre pour être utile : la phrase seule suffit. */
const META_MIN_EXCERPT = 40;

/**
 * Meta description unique (brief §9, revue finale C-P1) : une phrase propre
 * au bien (« Appartement 3 pièces de 59,5 m² à Asnières-sur-Seine,
 * 375 000 €. »), puis l'extrait de la description. Deux annonces dont la
 * description commence pareil ne partagent plus la même description.
 */
function metaDescription(view: PropertyView): string {
  const lead = `${pageTitle(view)}.`;
  const room = META_MAX - lead.length - 1;
  const text = room >= META_MIN_EXCERPT ? excerpt(view.paragraphs, room) : "";
  if (text) return `${lead} ${text}`;
  const offer =
    view.transaction === "LOCATION"
      ? "Proposé à la location"
      : "Proposé à la vente";
  return `${lead} ${offer} par le Cabinet Rimbault, référence ${view.reference}.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const reference = await readReference(params);
  // Règle du lot 0 (journal) : référence inconnue → « Bien introuvable » en
  // noindex ; API en erreur → titre par défaut en noindex, la page rend
  // `ServiceError` (D8).
  let property: Awaited<ReturnType<typeof getProperty>>;
  try {
    property = await getProperty(reference);
  } catch {
    return { robots: { index: false, follow: false } };
  }
  if (!property) {
    return {
      title: "Bien introuvable",
      robots: { index: false, follow: false },
    };
  }
  const view = toPropertyView(property);
  const photo = view.images[0];
  return pageMetadata({
    title: pageTitle(view),
    description: metaDescription(view),
    path: view.href,
    image: photo ? { url: photo.url, alt: photo.alt } : undefined,
  });
}

function listingType(view: PropertyView): "APPARTEMENT" | "MAISON" | "AUTRE" {
  if (view.propertyType === "APPARTEMENT" || view.propertyType === "LOFT") {
    return "APPARTEMENT";
  }
  if (view.propertyType === "MAISON" || view.propertyType === "VILLA") {
    return "MAISON";
  }
  return "AUTRE";
}

/**
 * Biens proches : jamais bloquants. Une erreur (API ou données) masque la
 * section, comme une liste vide (D8).
 */
async function similarViews(reference: string): Promise<PropertyView[]> {
  try {
    return (await getSimilarProperties(reference, 3)).map(toPropertyView);
  } catch {
    return [];
  }
}

export default async function PropertyPage({ params }: Props) {
  const reference = await readReference(params);
  // D8 (revue finale n° 3) : une panne de l'API ne doit jamais sortir de la
  // page. Sinon, en production, une référence absente du build renvoie un
  // « Internal Server Error » nu (rendu ISR à la demande). « Introuvable »
  // (`null`) reste un 404. La route reste statique (ISR) : l'état d'erreur
  // est mis en cache au plus `REVALIDATE.detail` (10 min), voir le journal.
  let property: Property | null;
  try {
    property = await getProperty(reference);
  } catch (error) {
    console.error(error);
    return <ServiceError />;
  }
  if (!property) notFound();

  const view = toPropertyView(property);
  const similar = await similarViews(property.reference);

  return (
    <>
      <Breadcrumb
        items={[
          { name: "Nos biens", path: "/biens" },
          { name: view.head, path: view.href },
        ]}
      />

      <Container className="pt-6 pb-16 md:pt-8 md:pb-24">
        <div className="grille gap-y-8 lg:gap-y-0">
          <div className="col-span-full lg:col-span-8 lg:row-start-1">
            <PropertyGallery images={view.images} />
          </div>

          <div className="col-span-full lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1">
            <div className="lg:sticky lg:top-8">
              <PropertyHeader view={view} />
              <div className="mt-8">
                <PriceBlock view={view} />
              </div>
            </div>
          </div>

          <div className="col-span-full mt-8 flex flex-col gap-12 md:gap-16 lg:col-span-8 lg:row-start-2 lg:mt-16">
            {view.facts.length ? (
              <FicheSection id="essentiel" title="L’essentiel">
                <KeyFacts facts={view.facts} />
              </FicheSection>
            ) : null}

            {view.paragraphs.length ? (
              <FicheSection id="description" title="Description">
                <PropertyDescription paragraphs={view.paragraphs} />
              </FicheSection>
            ) : null}

            <FicheSection id="energie" title="Bilan énergétique">
              <EnergyBlock
                dpe={view.energy.dpe}
                ges={view.energy.ges}
                costs={view.energy.costs}
              />
            </FicheSection>

            {view.copro.length ? (
              <FicheSection id="copropriete" title="Copropriété et charges">
                <CoproBlock items={view.copro} />
              </FicheSection>
            ) : null}

            <FicheSection id="emplacement" title="Emplacement">
              <PropertyLocation view={view} />
            </FicheSection>

            <PropertyContact view={view} />
          </div>
        </div>
      </Container>

      <SimilarProperties items={similar} transaction={view.transaction} />

      {view.price !== null ? (
        <JsonLd
          data={realEstateListingJsonLd({
            name: composeTitle(view, "phrase"),
            description: metaDescription(view),
            path: view.href,
            images: view.images.map((image) => image.url),
            price: view.price,
            transaction: view.transaction,
            available: view.status === "DISPONIBLE",
            propertyType: listingType(view),
            surface: view.surface,
            rooms: view.rooms,
            postalCode: view.postalCode,
            city: view.city,
            datePosted: view.createdAt,
          })}
        />
      ) : null}
    </>
  );
}
