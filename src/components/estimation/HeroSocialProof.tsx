import { GoogleGlyph } from "@/components/reviews/GoogleGlyph";
import { Rating } from "@/components/ui/Rating";
import type { ReviewsData } from "@/lib/reviews/types";

function formatRating(value: number): string {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/**
 * Bloc de preuve sociale du hero : une pastille unique qui combine la note
 * Google (lien sortant vers la fiche) et l'ancrage local depuis 2009.
 *
 * Reconstruit depuis `GoogleGlyph` + `Rating` plutôt qu'imbriqué dans
 * `GoogleRatingBadge` pour éviter une double bordure de pastille.
 *
 * Fallback `reviews === null` : on affiche uniquement la ligne d'ancrage,
 * sans bordure (preuve sociale dégradée propre).
 */
export function HeroSocialProof({ reviews }: { reviews: ReviewsData | null }) {
  if (!reviews) {
    return (
      <p className="text-sm text-body">
        <span className="font-semibold text-primary">Depuis 2009</span> à
        Asnières-sur-Seine
      </p>
    );
  }

  const rating = formatRating(reviews.rating);

  return (
    <div className="inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1.5 rounded-full border border-subtle bg-card px-4 py-2 shadow-sm">
      <a
        href={reviews.sourceUrl}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Note de ${rating} sur 5 — ${reviews.totalCount} avis Google, voir la fiche`}
        className="inline-flex items-center gap-2 transition-colors hover:text-primary"
      >
        <GoogleGlyph className="h-4 w-4 shrink-0" />
        <span className="font-display text-base font-semibold text-primary">
          {rating}
        </span>
        <Rating value={reviews.rating} />
        <span className="text-sm text-muted">{reviews.totalCount} avis</span>
      </a>

      <span
        aria-hidden="true"
        className="hidden h-3.5 w-px bg-subtle sm:inline-block"
      />

      <span className="text-sm text-body">
        <span className="font-semibold text-primary">Depuis 2009</span> à
        Asnières-sur-Seine
      </span>
    </div>
  );
}
