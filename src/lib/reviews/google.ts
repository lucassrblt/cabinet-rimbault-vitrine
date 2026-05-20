import "server-only";
import type { GoogleReview, ReviewsData } from "./types";

/**
 * Récupération des avis via l'API Google Places (New) — `Place Details`.
 *
 * Lecture seule des données publiques de la fiche (pas besoin d'un profil
 * revendiqué). L'API renvoie au plus 5 avis. Aucune donnée n'est stockée.
 */

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";
const FIELD_MASK = "id,rating,userRatingCount,googleMapsUri,reviews";

/** Forme partielle de la réponse — limitée aux champs demandés via le FieldMask. */
interface PlacesApiResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesApiReview[];
}

interface PlacesApiReview {
  name?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

function readConfig(): { apiKey: string; placeId: string } | null {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) {
    console.warn(
      "[reviews] GOOGLE_PLACES_API_KEY ou GOOGLE_PLACE_ID manquante — avis Google désactivés.",
    );
    return null;
  }
  return { apiKey, placeId };
}

function normalizeRating(
  value: number | undefined,
): GoogleReview["rating"] | null {
  if (value == null) return null;
  const rounded = Math.round(value);
  if (rounded < 1 || rounded > 5) return null;
  return rounded as GoogleReview["rating"];
}

function mapReview(review: PlacesApiReview): GoogleReview | null {
  const rating = normalizeRating(review.rating);
  const authorName = review.authorAttribution?.displayName?.trim();
  // Un avis sans note, sans auteur ou sans identifiant est inexploitable.
  if (rating == null || !authorName || !review.name) return null;

  return {
    id: review.name,
    authorName,
    avatarUrl: review.authorAttribution?.photoUri ?? null,
    authorUrl: review.authorAttribution?.uri ?? null,
    rating,
    text: (review.text?.text ?? review.originalText?.text ?? "").trim(),
    relativeTime: review.relativePublishTimeDescription ?? "",
    publishedAt: review.publishTime ?? "",
  };
}

/**
 * Récupère la fiche Google et ses avis.
 *
 * Ne *throw* jamais : renvoie `null` si la configuration est absente ou si
 * l'appel échoue — les avis sont un contenu non critique.
 */
export async function fetchGoogleReviews(): Promise<ReviewsData | null> {
  const config = readConfig();
  if (!config) return null;

  try {
    const url = `${PLACES_ENDPOINT}/${encodeURIComponent(
      config.placeId,
    )}?languageCode=fr&regionCode=FR`;

    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": config.apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      // ISR 24 h ; le tag autorise un futur revalidateTag("reviews").
      next: { revalidate: 86400, tags: ["reviews"] },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.warn(
        `[reviews] Places API a répondu ${res.status} ${res.statusText}.`,
      );
      return null;
    }

    const place = (await res.json()) as PlacesApiResponse;
    if (place.rating == null || place.userRatingCount == null) {
      console.warn("[reviews] Réponse Places API sans note exploitable.");
      return null;
    }

    const reviews = (place.reviews ?? [])
      .map(mapReview)
      .filter((review): review is GoogleReview => review !== null);

    return {
      rating: place.rating,
      totalCount: place.userRatingCount,
      sourceUrl: place.googleMapsUri ?? "",
      reviews,
    };
  } catch (error) {
    console.warn("[reviews] Échec de l'appel Places API :", error);
    return null;
  }
}
