/**
 * Types des avis clients.
 *
 * Forme calquée sur la réponse de l'API Google Places (New) — champs `rating`,
 * `userRatingCount`, `reviews[]`. En phase design, ces types sont alimentés par
 * des fausses données (`./mock`) ; le branchement réel ne changera pas le contrat.
 */

export interface GoogleReview {
  id: string;
  authorName: string;
  /** Photo de profil Google. Peut être absente → fallback initiales. */
  avatarUrl?: string | null;
  /** Lien Google vers l'auteur / l'avis (attribution obligatoire). */
  authorUrl?: string | null;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Libellé relatif fourni par Google, ex. « il y a 2 mois ». */
  relativeTime: string;
  /** Date ISO de publication (tri / affichage). */
  publishedAt: string;
}

export interface ReviewsData {
  /** Note moyenne globale de la fiche Google (tous avis confondus). */
  rating: number;
  /** Nombre total d'avis publiés sur la fiche Google. */
  totalCount: number;
  /** URL publique de la fiche Google (liste complète des avis). */
  sourceUrl: string;
  reviews: GoogleReview[];
}
