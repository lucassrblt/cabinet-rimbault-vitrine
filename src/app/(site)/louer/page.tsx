import type { Metadata } from "next";
import { Illustration } from "@/components/illustrations/Illustration";
import { PageIntro } from "@/components/layout/PageIntro";
import { FaqList } from "@/components/owners/FaqList";
import { FeesSummary } from "@/components/owners/FeesSummary";
import { OwnerClosing } from "@/components/owners/OwnerClosing";
import { OwnerSection } from "@/components/owners/OwnerSection";
import { StepsList } from "@/components/owners/StepsList";
import { TenantRedirect } from "@/components/owners/TenantRedirect";
import { fr } from "@/components/owners/typo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { faqLocation } from "@/content/faq-location";
import { getProperties } from "@/lib/api/properties";
import { pageMetadata } from "@/lib/seo/metadata";

// Louer (doc 04 §1.4 et §2.6, brief §6.3, lot 4). La page parle aux
// propriétaires bailleurs ; les locataires sont renvoyés dès la première ligne
// vers les biens en location, avec le nombre réel (accords 0, 1, n).
// Section « Ce que nous ne faisons pas » (gestion locative) non publiée tant
// que l'agent n'a pas répondu (brief §10-10).

export const metadata: Metadata = pageMetadata({
  title: "Mettre votre logement en location à Asnières-sur-Seine",
  description:
    "Mettre un appartement ou une maison en location à Asnières-sur-Seine avec le Cabinet Rimbault : le déroulé de la location, les honoraires et les réponses à vos questions.",
  path: "/louer",
});

const ESTIMATION_LOYER = "/estimation?objet=loyer";

const STEPS = [
  "Nous visitons votre logement et vous indiquons le loyer que nous pensons pouvoir obtenir.",
  "Nous publions l'annonce et faisons visiter le logement.",
  "Nous vérifions les dossiers des candidats et vous présentons ceux qui correspondent.",
  "Nous rédigeons le bail et le faisons signer.",
  "Nous remettons les clés au locataire le jour de son entrée dans les lieux.",
];

/** Nombre de biens en location visibles ; `null` si l'API ne répond pas. */
async function rentalCount(): Promise<number | null> {
  try {
    const properties = await getProperties();
    return properties.filter((p) => p.transactionType === "LOCATION").length;
  } catch {
    return null;
  }
}

export default async function Page() {
  const count = await rentalCount();
  return (
    <>
      <TenantRedirect count={count} />

      <PageIntro
        // Composition de Vendre et de l'accueil (revue finale 1, C-B1) : dès
        // 1024 px, le texte est calé en bas de la grille (`PageIntro` le cale
        // en haut), et ILL-05 (colonnes 9 à 12) descend de 3,3 % de sa
        // hauteur, la réserve vide sous le trottoir (33 px sur 1 000), pour
        // que le trottoir se pose sur le bas de « Faire estimer le loyer ».
        // Sous 1024 px, rien ne change (empilé).
        title="Louer votre logement avec nous"
        className="lg:[&_.grille>div:first-child]:self-end"
        lead={
          <>
            <p>
              {fr(
                "Nous estimons le loyer, trouvons le locataire et préparons le bail.",
              )}
            </p>
            <div className="mt-8 md:mt-10">
              <ButtonLink href={ESTIMATION_LOYER}>
                Faire estimer le loyer
              </ButtonLink>
            </div>
          </>
        }
        aside={
          <Illustration
            name="ILL-05"
            priority
            className="lg:translate-y-[3.3%]"
          />
        }
      />

      <OwnerSection id="deroule" title="Comment se passe une location">
        <StepsList steps={STEPS} />
      </OwnerSection>

      <OwnerSection id="honoraires" title="Nos honoraires de location">
        <FeesSummary kind="location" />
      </OwnerSection>

      <OwnerSection id="questions" title="Questions fréquentes">
        <FaqList items={faqLocation} />
      </OwnerSection>

      <OwnerClosing
        title="Parlons de votre logement"
        text="Appelez-nous, ou décrivez-nous votre logement en ligne : nous vous recontactons pour convenir d'une visite."
        estimationHref={ESTIMATION_LOYER}
        estimationLabel="Faire estimer le loyer"
      />
    </>
  );
}
