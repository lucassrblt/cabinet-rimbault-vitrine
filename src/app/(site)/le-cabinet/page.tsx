import type { Metadata } from "next";
import { AgencyAddress } from "@/components/agency/AgencyAddress";
import { CommitmentsDetailed } from "@/components/agency/CommitmentsDetailed";
import { ReviewsSummary } from "@/components/agency/ReviewsSummary";
import { Illustration } from "@/components/illustrations/Illustration";
import { PageIntro } from "@/components/layout/PageIntro";
import { amount, streetLine } from "@/components/layout/typo";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import { getGoogleReviews } from "@/lib/reviews/google";
import { pageMetadata } from "@/lib/seo/metadata";

// Le cabinet (doc 04 §2.7, brief A9, A13, §8bis). La page qui doit convaincre
// en trente secondes le propriétaire « qui vérifie » : ancienneté, adresse,
// façon de travailler, avis réels, informations professionnelles.
// - L'agent n'est ni nommé ni montré (A9, brief §1) : le site dit « nous ».
// - ILL-06 en 10:3, décorative, sans légende (A13). ILL-03 dans « Venir au
//   cabinet ».
// - Ni « Votre interlocuteur » ni « Notre secteur » : les engagements 2 et 3
//   de « Notre façon de travailler » le disent déjà (revue Zidane/Maldini,
//   brief §6.1). Le secteur reviendra avec agency.sector et ILL-07 ; tant
//   que sector est nul, rien n'est affiché.
// - Avis : extraits réels de l'API Places, sinon la note seule.

export const metadata: Metadata = pageMetadata({
  title:
    "Le Cabinet Rimbault, agence immobilière indépendante à Asnières depuis 2009",
  description: `Installé au ${agency.address.street} à ${agency.address.city} depuis ${agency.since}, le ${agency.name} vend et loue des appartements et des maisons. Notre façon de travailler, nos avis et nos informations professionnelles.`,
  path: "/le-cabinet",
});

/** Intertitre sur les colonnes 1 à 4, contenu sur 5 à 12 (doc 03 §4.1). */
function Split({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Grid className="gap-y-8 md:gap-y-12">
      <Heading
        level={2}
        id={id}
        className="col-span-full max-w-[12em] lg:col-span-4"
      >
        {title}
      </Heading>
      <div className="col-span-full min-w-0 lg:col-span-8 lg:col-start-5">
        {children}
      </div>
    </Grid>
  );
}

function ProfessionalDetails() {
  const { legal } = agency;
  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Carte professionnelle",
      value: (
        <>
          <span className="whitespace-nowrap">{legal.cardNumber}</span>,
          délivrée par la{" "}
          <span className="whitespace-nowrap">{legal.cardIssuer}</span>, mention
          «{" "}Transactions sur immeubles et fonds de commerce
          {" "}».
        </>
      ),
    },
    {
      label: "Garant financier",
      value: (
        <>
          <span className="whitespace-nowrap">{legal.guarantorName}</span>
          {legal.guarantorAddress ? `, ${legal.guarantorAddress}` : ""}.
        </>
      ),
    },
    {
      label: "Société",
      value: (
        <>
          {legal.legalForm} au capital de{" "}
          <span className="whitespace-nowrap">{amount(legal.capital)}</span>,
          immatriculée au <span className="whitespace-nowrap">{legal.rcs}</span>
          .
        </>
      ),
    },
  ];
  if (legal.mediator) {
    const m = legal.mediator;
    rows.push({
      label: "Médiateur de la consommation",
      value: (
        <>
          {m.name}, {m.address}, <TextLink href={m.url}>{m.url}</TextLink>.
        </>
      ),
    });
  }
  rows.push({
    label: "Honoraires",
    value: (
      <>
        Chaque annonce indique qui les paie et, lorsqu’ils sont à la charge de
        l’acquéreur ou du locataire, leur montant toutes taxes comprises. Ils
        sont présentés sur la page{" "}
        <TextLink href="/honoraires">{"Nos\u00A0honoraires"}</TextLink>.
      </>
    ),
  });

  return (
    <dl className="border-filet border-b">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid gap-1 border-filet border-t py-5 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-6"
        >
          <dt className="t-nav pt-1 text-encre-douce">{row.label}</dt>
          <dd className="t-texte hyphens-manual">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function Page() {
  const reviews = await getGoogleReviews();

  return (
    <>
      <PageIntro
        title="Le cabinet"
        lead={
          <p>
            Le {agency.name} est installé au{" "}
            <span className="whitespace-nowrap">{streetLine()}</span> à{" "}
            <span className="whitespace-nowrap">{agency.address.city}</span>{" "}
            depuis {agency.since}. Nous vendons et louons des appartements et
            des maisons dans la ville et les communes voisines.
          </p>
        }
        className="pb-12 md:pb-16"
      />

      <Container>
        <Illustration
          name="ILL-06"
          className="mx-auto"
          priority
          sizes="(min-width: 1280px) 1200px, calc(100vw - 64px)"
        />
      </Container>

      <Section aria-labelledby="facon-de-travailler">
        <Split id="facon-de-travailler" title="Notre façon de travailler">
          <CommitmentsDetailed />
        </Split>
      </Section>

      <Section separation="soutenu" aria-labelledby="avis">
        <Split id="avis" title="Ce que disent nos clients">
          <ReviewsSummary data={reviews} excerpts={5} />
        </Split>
      </Section>

      <Section aria-labelledby="venir">
        <Grid className="gap-y-8 md:gap-y-12">
          <Heading
            level={2}
            id="venir"
            className="col-span-full max-w-[12em] lg:col-span-4"
          >
            Venir au cabinet
          </Heading>
          <AgencyAddress
            showHours
            className="col-span-full lg:col-span-4 lg:col-start-5"
          />
          <div className="col-span-full lg:col-span-4 lg:col-start-9">
            <Illustration
              name="ILL-03"
              sizes="(min-width: 1024px) 360px, min(360px, calc(100vw - 40px))"
            />
          </div>
        </Grid>
      </Section>

      <Section separation="filet" aria-labelledby="informations">
        <Split id="informations" title="Informations professionnelles">
          <p className="t-texte mesure mb-8">
            L’activité d’agent immobilier est réglementée par la loi Hoguet.
            Voici ce qui nous autorise à l’exercer, et ce qui vous protège.
          </p>
          <ProfessionalDetails />
        </Split>
      </Section>
    </>
  );
}
