import { ExternalLink } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import type { ReviewsData } from "@/lib/reviews/types";
import { GoogleGlyph } from "./GoogleGlyph";

function formatRating(value: number): string {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/**
 * Synthèse de la note Google.
 * - `block`  : grand chiffre display — pièce maîtresse d'une section.
 * - `inline` : pastille cliquable compacte — badge de réassurance autonome.
 */
export function GoogleRatingBadge({
  data,
  variant = "inline",
}: {
  data: ReviewsData;
  variant?: "inline" | "block";
}) {
  if (variant === "block") {
    return (
      <div className="flex items-center gap-5">
        <span className="font-display text-5xl font-semibold leading-none tracking-tight text-primary md:text-6xl">
          {formatRating(data.rating)}
        </span>
        <div className="flex flex-col gap-1.5">
          <Rating value={data.rating} />
          <span className="inline-flex items-center gap-1.5 text-sm text-muted">
            <GoogleGlyph className="h-4 w-4" />
            {data.totalCount} avis Google
          </span>
        </div>
      </div>
    );
  }

  return (
    <a
      href={data.sourceUrl}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`Note de ${formatRating(data.rating)} sur 5 — ${data.totalCount} avis Google, voir la fiche`}
      className="group inline-flex items-center gap-2.5 rounded-full border border-subtle bg-card px-4 py-2 shadow-sm transition-colors duration-200 hover:border-default"
    >
      <GoogleGlyph className="h-4 w-4 shrink-0" />
      <span className="font-display text-base font-semibold text-primary">
        {formatRating(data.rating)}
      </span>
      <Rating value={data.rating} />
      <span className="text-sm text-muted">{data.totalCount} avis</span>
      <ExternalLink
        className="h-3.5 w-3.5 text-subtle transition-colors group-hover:text-primary"
        aria-hidden="true"
      />
    </a>
  );
}
