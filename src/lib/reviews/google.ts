import "server-only";

/**
 * Avis via l'API Google Places (New), « Place Details ».
 * Lecture seule des données publiques de la fiche ; 5 avis au plus.
 */

export type GoogleReview = {
  id: string;
  authorName: string;
  authorUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
};

export type ReviewsData = {
  rating: number;
  totalCount: number;
  sourceUrl: string;
  reviews: GoogleReview[];
};

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    name?: string;
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string };
  }[];
};

/** Ne lève jamais : les avis sont un contenu non critique. */
export async function getGoogleReviews(): Promise<ReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=fr&regionCode=FR`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: 86400, tags: ["reviews"] },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) {
      console.warn(`[avis] Places API : ${res.status}`);
      return null;
    }
    const place = (await res.json()) as PlacesResponse;
    if (place.rating == null || place.userRatingCount == null) return null;

    const reviews = (place.reviews ?? []).flatMap((r) => {
      const authorName = r.authorAttribution?.displayName?.trim();
      const text = (r.text?.text ?? r.originalText?.text ?? "").trim();
      if (!r.name || !authorName || !r.rating || !text) return [];
      return [
        {
          id: r.name,
          authorName,
          authorUrl: r.authorAttribution?.uri ?? null,
          rating: r.rating,
          text,
          relativeTime: r.relativePublishTimeDescription ?? "",
        },
      ];
    });

    return {
      rating: place.rating,
      totalCount: place.userRatingCount,
      sourceUrl: place.googleMapsUri ?? "",
      reviews,
    };
  } catch (error) {
    console.warn("[avis] Échec de l'appel Places API :", error);
    return null;
  }
}
