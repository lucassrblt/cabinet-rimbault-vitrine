import "server-only";
import { agency } from "@/lib/agency";
import { getProperties } from "@/lib/api/properties";
import { getGoogleReviews } from "@/lib/reviews/google";

const ratingFormat = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
});

/** Données communes aux trois directions de l'accueil. */
export async function homeData() {
  const [properties, reviews] = await Promise.all([
    getProperties(),
    getGoogleReviews(),
  ]);
  const sorted = [...properties].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  return {
    properties: sorted,
    recent: sorted.slice(0, 3),
    reviews: reviews?.reviews ?? [],
    rating: reviews
      ? ratingFormat.format(reviews.rating)
      : agency.google.rating,
    count: reviews?.totalCount ?? agency.google.count,
    reviewsUrl: reviews?.sourceUrl || agency.google.href,
  };
}

export type HomeData = Awaited<ReturnType<typeof homeData>>;

// Photos provisoires sous licence libre (crédits affichés en pied de page).
export const PHOTOS = {
  quartier: "/maquettes/ouverture-quai-dervaux.jpg",
  mairie: "/maquettes/mairie-asnieres.jpg",
  devanture: "/maquettes/devanture-provisoire.jpg",
};
export const CREDITS =
  "Photos provisoires : quai du Docteur-Dervaux, Arseni Mourzenko, CC BY 2.0 ; mairie d’Asnières, Brumathechec, CC BY-SA 4.0.";
