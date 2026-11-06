import type { Metadata } from "next";
import { Suspense } from "react";
import { OpeningHours } from "@/components/agency/OpeningHours";
import { ContactForm } from "@/components/forms/ContactForm";
import { Illustration } from "@/components/illustrations/Illustration";
import { PageIntro } from "@/components/layout/PageIntro";
import { cityLine, streetLine } from "@/components/layout/typo";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import { pageMetadata } from "@/lib/seo/metadata";
import { ContactFormFromUrl } from "./ContactFormFromUrl";

// Contact (doc 04 §2.9, brief §9). Desktop : coordonnées sur 5 colonnes,
// formulaire sur 7. Mobile : coordonnées d'abord, le téléphone étant l'action
// la plus rapide. ILL-03 en desktop seulement, sans préchargement (masquée
// sous 1024 px, jamais le LCP) : fondu d'ImageFade comme sur Le cabinet.
// Aucun délai de réponse annoncé tant que l'agent ne l'a pas validé (brief
// §10-9). E-mail et WhatsApp affichés seulement quand ils existent dans
// agency.ts.

export const metadata: Metadata = pageMetadata({
  title: "Contacter le Cabinet Rimbault, 117 boulevard Voltaire, Asnières",
  description: `Appeler le ${agency.phone.display} ou nous écrire : les coordonnées du ${agency.name}, ${agency.address.street} à ${agency.address.city}.`,
  path: "/contact",
});

function Coordinate({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-filet border-t pt-5">
      <dt className="t-nav text-encre-douce">{label}</dt>
      <dd className="mt-2">{children}</dd>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <PageIntro
        title="Nous contacter"
        lead={
          <p>
            Le plus simple est de nous appeler. Vous pouvez aussi nous écrire
            avec le formulaire ci-dessous.
          </p>
        }
        className="pb-12 md:pb-16"
      />

      <Container className="pb-16 md:pb-24">
        <Grid className="gap-y-16">
          <section
            aria-labelledby="coordonnees"
            className="col-span-full min-w-0 lg:col-span-5"
          >
            <Heading level={2} size="h3" id="coordonnees">
              Nos coordonnées
            </Heading>
            <dl className="mt-6 flex flex-col gap-6">
              <Coordinate label="Par téléphone">
                <TextLink
                  href={agency.phone.href}
                  className="t-h2 chiffres whitespace-nowrap"
                >
                  {agency.phone.display}
                </TextLink>
              </Coordinate>
              {agency.email ? (
                <Coordinate label="Par e-mail">
                  <TextLink href={`mailto:${agency.email}`} className="t-texte">
                    {agency.email}
                  </TextLink>
                </Coordinate>
              ) : null}
              {agency.whatsapp ? (
                <Coordinate label="Par WhatsApp">
                  <TextLink href={agency.whatsapp} className="t-texte">
                    Nous écrire sur WhatsApp
                  </TextLink>
                </Coordinate>
              ) : null}
              <Coordinate label="Au cabinet">
                <address className="t-texte">
                  {streetLine()}
                  <br />
                  <span className="whitespace-nowrap">{cityLine()}</span>
                </address>
                <OpeningHours className="mt-3" />
                <p className="t-ui mt-3">
                  <TextLink href={agency.mapsDirections}>Itinéraire</TextLink>
                </p>
              </Coordinate>
            </dl>
            <div className="mt-16 hidden max-w-[300px] lg:block">
              <Illustration name="ILL-03" sizes="300px" />
            </div>
          </section>

          <section
            aria-labelledby="ecrire"
            className="col-span-full min-w-0 lg:col-span-7 lg:col-start-6 lg:border-filet lg:border-l lg:pl-12"
          >
            <Heading level={2} size="h3" id="ecrire">
              Nous écrire
            </Heading>
            <p className="t-ui mesure mt-3 text-encre-douce">
              Vous souhaitez faire estimer un bien{" "}? Le{" "}
              <TextLink href="/estimation">formulaire d’estimation</TextLink>{" "}
              est plus adapté.
            </p>
            <div className="mt-8">
              <Suspense fallback={<ContactForm source="vitrine/contact" />}>
                <ContactFormFromUrl />
              </Suspense>
            </div>
          </section>
        </Grid>
      </Container>
    </>
  );
}
