import type { Metadata } from "next";
import { Illustration } from "@/components/illustrations/Illustration";
import { PageIntro } from "@/components/layout/PageIntro";
import { FaqList } from "@/components/owners/FaqList";
import { FeesSummary } from "@/components/owners/FeesSummary";
import { OwnerClosing } from "@/components/owners/OwnerClosing";
import { OwnerSection } from "@/components/owners/OwnerSection";
import { StepsList } from "@/components/owners/StepsList";
import { ASNIERES, fr, phoneLabel } from "@/components/owners/typo";
import { SoldArchive } from "@/components/property/SoldArchive";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TextLink } from "@/components/ui/TextLink";
import { faqVente } from "@/content/faq-vente";
import { agency } from "@/lib/agency";
import { getArchivedProperties } from "@/lib/api/properties";
import { toPropertyView } from "@/lib/property/view";
import { pageMetadata } from "@/lib/seo/metadata";

// Vendre (doc 04 §2.5, brief §4 et §9, lot 4). En-tête avec ILL-09 (A37),
// déroulé en <ol> (A15), estimation, honoraires, FAQ (details natifs et
// JSON-LD FAQPage), archive « Biens vendus récemment » (doc 04 §2.5-6 :
// vendus seulement, jamais « Loué » ; section absente si la liste est vide ou
// si l'API échoue, `getArchivedProperties` renvoyant alors []), puis fin.

export const metadata: Metadata = pageMetadata({
  title: "Vendre votre appartement ou votre maison à Asnières-sur-Seine",
  description:
    "Vendre un appartement ou une maison à Asnières-sur-Seine avec le Cabinet Rimbault : le déroulé de la vente, notre façon d’estimer, nos honoraires et les réponses à vos questions.",
  path: "/vendre",
});

const ESTIMATION_VENTE = "/estimation?objet=vente";

const STEPS = [
  "Nous visitons votre bien et vous donnons le prix auquel nous pensons pouvoir le vendre.",
  "Nous convenons ensemble du prix de mise en vente et signons le mandat.",
  "Nous rédigeons l'annonce et réunissons avec vous les documents de la vente, dont les diagnostics obligatoires.",
  "Nous faisons visiter votre bien nous-mêmes.",
  "Nous recevons les offres, les négocions et vous les présentons par écrit.",
  "Une fois l'accord trouvé, nous suivons le dossier avec les notaires, du compromis jusqu'à la signature de l'acte.",
];

export default async function Page() {
  const vendus = (await getArchivedProperties())
    .map(toPropertyView)
    .filter((view) => view.status === "VENDU");

  return (
    <>
      <PageIntro
        // « à Asnières-sur-Seine » ne se coupe jamais : U+00A0 après « à »,
        // gluon après chaque trait d'union. Sous 360 px, la ligne insécable
        // (299 px en h1 de 34 px) dépasse la colonne de 280 px : le h1 passe
        // à 30/36, exception hors échelle, acceptée par Zidane, revue lot 4
        // tour 1 (journal).
        title={`Vendre votre bien à\u00A0${ASNIERES}`}
        className="max-[359px]:[&_h1]:text-[30px] max-[359px]:[&_h1]:leading-[36px]"
        lead={
          <>
            <p>
              {fr(
                "Nous commençons toujours par une visite. Le prix que nous vous donnons est celui auquel nous pensons pouvoir vendre, pas celui qui ferait plaisir.",
              )}
            </p>
            <div className="mt-8 md:mt-10">
              <ButtonLink href={ESTIMATION_VENTE}>
                Faire estimer votre bien
              </ButtonLink>
            </div>
          </>
        }
        aside={<Illustration name="ILL-09" priority />}
      />

      <OwnerSection id="deroule" title="Comment se passe une vente">
        <StepsList steps={STEPS} />
      </OwnerSection>

      <OwnerSection id="estimation" title="Notre estimation">
        <div className="ui-prose">
          <p>
            {fr(
              "Nous ne donnons pas de prix en ligne : un prix sérieux demande de voir le bien. Pendant la visite, nous regardons ce qui fait sa valeur : la surface, l'étage, l'exposition, l'état, la copropriété et les ventes récentes du quartier.",
            )}
          </p>
          <p>
            {fr(
              "Si le prix que vous espérez nous paraît trop haut, nous vous le disons, quitte à ne pas prendre le mandat. Un prix trop haut fait perdre des mois et finit par décoter le bien.",
            )}
          </p>
          <p>
            Pour demander une visite d’estimation, remplissez{" "}
            <TextLink href={ESTIMATION_VENTE}>
              notre formulaire d’estimation
            </TextLink>{" "}
            ou appelez-⁠nous au{" "}
            <TextLink href={agency.phone.href} className="whitespace-nowrap">
              {phoneLabel(agency.phone.display)}
            </TextLink>
            .
          </p>
        </div>
      </OwnerSection>

      <OwnerSection id="honoraires" title="Nos honoraires de vente">
        <FeesSummary kind="vente" />
      </OwnerSection>

      <OwnerSection id="questions" title="Questions fréquentes">
        <FaqList items={faqVente} />
      </OwnerSection>

      <SoldArchive
        items={vendus}
        limit={4}
        title="Biens vendus récemment"
        id="vendus"
      />

      <OwnerClosing
        title="Parlons de votre bien"
        text="Appelez-nous, ou décrivez-nous votre bien en ligne : nous vous recontactons pour convenir d'une visite."
        estimationHref={ESTIMATION_VENTE}
        estimationLabel="Faire estimer votre bien"
      />
    </>
  );
}
