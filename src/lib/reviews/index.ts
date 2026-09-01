import { cache } from "react";
import { fetchGoogleReviews } from "./google";
import { MOCK_REVIEWS_DATA } from "./mock";
import type { GoogleReview, ReviewsData } from "./types";

/**
 * Point d'accès unique aux avis clients.
 *
 * - Production : avis réels Google, ou `null` si indisponible (jamais de faux
 *   avis publiés).
 * - Développement : repli sur les fausses données quand la clé n'est pas
 *   configurée, pour garder l'itération design possible en local.
 *
 * Mémoïsé par requête via `cache()` : plusieurs composants d'une même page
 * peuvent l'appeler sans déclencher plusieurs traitements.
 */
export const getReviewsData = cache(async (): Promise<ReviewsData | null> => {
  const data = await fetchGoogleReviews();
  if (data) return data;
  if (process.env.NODE_ENV !== "production") return MOCK_REVIEWS_DATA;
  return null;
});

/**
 * Sélection affichable : avis ≥ 4★ au texte non vide, triés par richesse du
 * texte (les avis détaillés d'abord — un avis d'une ligne signé d'un pseudo
 * n'a pas sa place en tête de home). La note globale, elle, reste celle
 * renvoyée par Google (non recalculée). Tronque à `limit`.
 */
export function featuredReviews(
  data: ReviewsData,
  limit?: number,
): GoogleReview[] {
  const filtered = data.reviews
    .filter((review) => review.rating >= 4 && review.text.trim().length > 0)
    .sort((a, b) => b.text.trim().length - a.text.trim().length);
  return limit ? filtered.slice(0, limit) : filtered;
}
