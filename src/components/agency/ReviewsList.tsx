import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/utils";
import type { ReviewWithExcerpt } from "./reviewExcerpt";

// Extraits d'avis Google réels (API Places), tels que publiés : jamais
// réécrits, ni choisis pour leur note (coupe et ordre : `reviewExcerpt.ts`).
// Citation en Spectral italique, seul usage de l'italique (doc 03 §3.3). Auteur cité comme Google l'exige, lien
// vers son profil dans le même onglet (A16). Pas d'étoiles : « 5 sur 5 ».

/** Guillemets français avec espaces fines insécables. */
function quoted(text: string) {
  return `« ${text} »`;
}

type ReviewsListProps = {
  reviews: readonly ReviewWithExcerpt[];
  className?: string;
};

export function ReviewsList({ reviews, className }: ReviewsListProps) {
  if (reviews.length === 0) return null;
  return (
    <ul
      className={cn(
        "grid gap-x-6 gap-y-10 md:grid-cols-2 md:gap-y-12",
        className,
      )}
    >
      {reviews.map((review) => (
        <li key={review.id} className="min-w-0">
          <figure>
            <blockquote className="t-citation saisie whitespace-pre-line">
              <p>{quoted(review.excerpt)}</p>
            </blockquote>
            <figcaption className="t-petit mt-4 text-encre-douce">
              {review.authorUrl ? (
                <TextLink
                  href={review.authorUrl}
                  variant="discret"
                  className="font-medium text-encre"
                >
                  {review.authorName}
                </TextLink>
              ) : (
                <span className="font-medium text-encre">
                  {review.authorName}
                </span>
              )}
              , {review.rating}
              {" "}sur 5{review.relativeTime ? `, ${review.relativeTime}` : ""}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
