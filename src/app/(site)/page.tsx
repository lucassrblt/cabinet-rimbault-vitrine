import type { Metadata } from "next";
import { ReviewsSummary } from "@/components/agency/ReviewsSummary";
import { Commitments } from "@/components/home/Commitments";
import { CurrentListings } from "@/components/home/CurrentListings";
import { FindUs } from "@/components/home/FindUs";
import { HomeSection } from "@/components/home/HomeSection";
import { Opening } from "@/components/home/Opening";
import { Services } from "@/components/home/Services";
import { formatRating } from "@/components/layout/typo";
import { agency } from "@/lib/agency";
import { getProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { sortForListing, toPropertyView } from "@/lib/property/view";
import { getGoogleReviews } from "@/lib/reviews/google";
import { pageMetadata } from "@/lib/seo/metadata";

// Accueil (doc 04 §2.1, corrigé par le brief §6.3, A15, A19, A27, A31) :
// 1. ouverture asymétrique avec ILL-01 et la ligne factuelle ;
// 2. nos biens du moment (absente s'il n'y a aucun bien ou si l'API échoue) ;
// 3. ce que nous faisons, en texte ;
// 4. nos engagements, sans numéro ni illustration ;
// 5. ce que disent nos clients : la seule section en crème soutenu ;
// 6. nous trouver, avec ILL-03.
// Aucun bloc d'estimation en fin de page (A31), aucun chiffre clé.

export const metadata: Metadata = pageMetadata({
  title:
    "Cabinet Rimbault, agence immobilière à Asnières-sur-Seine depuis 2009",
  description:
    "Vente et location d’appartements et de maisons à Asnières-sur-Seine. Un cabinet indépendant au 117 boulevard Voltaire, depuis 2009. Estimation sur rendez-vous.",
  path: "/",
  absoluteTitle: true,
});

export default async function Page() {
  const [properties, reviews] = await Promise.all([
    getProperties().catch((): Property[] | null => null),
    getGoogleReviews(),
  ]);
  const views = properties
    ? sortForListing(properties.map(toPropertyView))
    : [];

  return (
    <>
      <Opening
        listingCount={properties ? views.length : null}
        rating={reviews ? formatRating(reviews.rating) : agency.google.rating}
        reviewCount={reviews ? reviews.totalCount : agency.google.count}
      />

      <CurrentListings views={views} />

      <Services />

      <Commitments />

      <HomeSection
        id="avis"
        title="Ce que disent nos clients"
        separation="soutenu"
      >
        <ReviewsSummary data={reviews} excerpts={2} />
      </HomeSection>

      <FindUs />
    </>
  );
}
