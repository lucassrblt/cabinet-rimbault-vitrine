import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { PropertyEmptyState } from "@/components/property/PropertyEmptyState";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { SoldArchive } from "@/components/property/SoldArchive";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import { getArchivedProperties, getProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import {
  type PropertyView,
  sortForListing,
  toPropertyView,
} from "@/lib/property/view";
import { pageMetadata } from "@/lib/seo/metadata";

// Nos biens (doc 04 §2.2, brief A14, A21, §9). Tous les biens sur une page :
// en vente, puis en location (état vide rédigé), puis l'archive
// conditionnelle. Aucun moteur, filtre, tri ni pagination. API en erreur :
// message sobre avec le téléphone, statut 200.

export const metadata: Metadata = pageMetadata({
  title: "Nos biens à vendre et à louer à Asnières-sur-Seine",
  description:
    "Tous les appartements et maisons que nous proposons en ce moment à la vente et à la location, à Asnières-sur-Seine et alentour.",
  path: "/biens",
});

/** « 5 en vente », « un en vente », « aucun en vente ». */
function countPhrase(count: number, suffix: string): string {
  if (count === 0) return `aucun ${suffix}`;
  if (count === 1) return `un ${suffix}`;
  return `${count}\u00a0${suffix}`;
}

/** « 5 biens », « 1 bien ». */
function countLabel(count: number): string {
  return `${count} ${count > 1 ? "biens" : "bien"}`;
}

const TENANT_EXITS = [
  {
    question: "Vous cherchez un logement ?",
    answer: "Écrivez-nous ce que vous cherchez, nous vous préviendrons.",
    href: "/contact?objet=location",
    link: "Nous écrire",
  },
  {
    question: "Vous êtes propriétaire ?",
    answer: "",
    href: "/louer",
    link: "Louer avec nous",
  },
] as const;

function ListHeading({
  id,
  title,
  count,
}: {
  id: string;
  title: string;
  count: number;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <Heading level={2} id={id}>
        {title}
      </Heading>
      {count > 0 ? (
        <p className="t-petit chiffres text-gris">{countLabel(count)}</p>
      ) : null}
    </div>
  );
}

export default async function Page() {
  let properties: Property[] | null;
  try {
    properties = await getProperties();
  } catch {
    // API indisponible : message sobre (scénario `error`), sans journal
    // côté navigateur ; l'erreur est déjà visible dans les journaux de l'API.
    properties = null;
  }

  if (properties === null) {
    return (
      <>
        <PageIntro title="Nos biens" />
        <Section separation="filet">
          <PropertyEmptyState
            message={
              <>
                Nos annonces ne peuvent pas s’afficher pour le moment.
                Appelez-nous au{"\u00a0"}
                <TextLink
                  href={agency.phone.href}
                  className="chiffres whitespace-nowrap"
                >
                  {agency.phone.display}
                </TextLink>
                .
              </>
            }
          />
        </Section>
      </>
    );
  }

  const views = sortForListing(properties.map(toPropertyView));
  const sale = views.filter((v) => v.transaction === "VENTE");
  const rent = views.filter((v) => v.transaction === "LOCATION");
  const archive: PropertyView[] = (await getArchivedProperties()).map(
    toPropertyView,
  );

  const closing = (
    <Section separation="filet">
      <p className="t-chapo mesure-chapo text-encre">
        Vous souhaitez vendre{" "}? Nous estimons votre bien sur place.{" "}
        <TextLink href="/estimation?objet=vente" className="whitespace-nowrap">
          Faire estimer votre bien
        </TextLink>
      </p>
    </Section>
  );

  if (sale.length === 0 && rent.length === 0) {
    return (
      <>
        <PageIntro title="Nos biens" />
        <Section separation="filet">
          <PropertyEmptyState
            message="Aucun bien n’est en ligne en ce moment."
            exits={TENANT_EXITS}
          />
        </Section>
        <SoldArchive items={archive} />
        {closing}
      </>
    );
  }

  const both = sale.length > 0 && rent.length > 0;
  const lead = (
    <>
      <p>
        Tous les biens que nous proposons sont sur cette page{" "}:{" "}
        {countPhrase(sale.length, "en vente")},{" "}
        {countPhrase(rent.length, "en location")}.
      </p>
      {both ? (
        <p className="t-ui mt-4 flex gap-6">
          <TextLink href="#vente" variant="discret">
            En vente
          </TextLink>
          <TextLink href="#location" variant="discret">
            En location
          </TextLink>
        </p>
      ) : null}
    </>
  );

  return (
    <>
      <PageIntro title="Nos biens" lead={lead} />

      <Section separation="filet" id="vente" aria-labelledby="vente-titre">
        <ListHeading id="vente-titre" title="En vente" count={sale.length} />
        {sale.length ? (
          <PropertyGrid
            items={sale}
            headingLevel={3}
            eager
            className="mt-8 md:mt-12"
          />
        ) : (
          <PropertyEmptyState
            className="mt-8"
            message="Nous n’avons aucun bien en vente en ce moment."
          />
        )}
      </Section>

      <Section
        separation="filet"
        id="location"
        aria-labelledby="location-titre"
      >
        <ListHeading
          id="location-titre"
          title="En location"
          count={rent.length}
        />
        {rent.length ? (
          <PropertyGrid
            items={rent}
            headingLevel={3}
            className="mt-8 md:mt-12"
          />
        ) : (
          <PropertyEmptyState
            className="mt-8"
            message="Nous n’avons aucun logement à louer en ce moment."
            exits={TENANT_EXITS}
          />
        )}
      </Section>

      <SoldArchive items={archive} />
      {closing}
    </>
  );
}
