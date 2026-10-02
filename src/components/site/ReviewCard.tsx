import { Star } from "lucide-react";
import type { GoogleReview } from "@/lib/reviews/google";

export function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <figure className="flex w-[80vw] max-w-[22rem] shrink-0 snap-start flex-col rounded-carte bg-blanc p-6 carte-avis">
      <p
        className="flex gap-0.5"
        role="img"
        aria-label={`${review.rating} étoiles sur 5`}
      >
        {Array.from({ length: review.rating }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: étoiles identiques
          <Star key={i} size={14} className="fill-current" aria-hidden />
        ))}
      </p>
      <blockquote className="citation mt-4 line-clamp-4">
        {review.text}
      </blockquote>
      <figcaption className="mt-auto pt-4 text-mention text-gris">
        {review.authorUrl ? (
          <a href={review.authorUrl} className="lien" rel="noopener">
            {review.authorName}
          </a>
        ) : (
          review.authorName
        )}
        , {review.relativeTime}
      </figcaption>
    </figure>
  );
}
