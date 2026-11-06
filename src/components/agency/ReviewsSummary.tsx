import { formatRating } from "@/components/layout/typo";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import type { ReviewsData } from "@/lib/reviews/google";
import { cn } from "@/lib/utils";
import { ReviewsList } from "./ReviewsList";
import { pickReviews } from "./reviewExcerpt";

// Note et avis Google (doc 04 §7, interface figée). `data` vient de
// `getGoogleReviews()` (cache 24 h, ne lève jamais). Si l'API ne répond pas,
// repli sur la note d'`agency.ts`, sans aucun extrait : rien n'est inventé.
// Le titre de section appartient à la page.

type ReviewsSummaryProps = {
  data: ReviewsData | null;
  excerpts: 0 | 2 | 5;
  className?: string;
};

const integer = new Intl.NumberFormat("fr-FR");

export function ReviewsSummary({
  data,
  excerpts,
  className,
}: ReviewsSummaryProps) {
  const rating = data ? formatRating(data.rating) : agency.google.rating;
  const count = data ? data.totalCount : agency.google.count;
  const href =
    data?.sourceUrl || agency.google.profileUrl || agency.google.href;
  const reviews = data ? pickReviews(data.reviews, excerpts) : [];

  return (
    <div className={className}>
      <p className="t-h2 chiffres">
        {rating}
        {" "}sur 5
      </p>
      <p className="t-ui mt-2 text-encre-douce">
        Note moyenne de nos clients sur Google, sur{" "}
        <span className="whitespace-nowrap">
          {integer.format(count)}
          {" "}avis
        </span>
        .
      </p>
      {reviews.length > 0 ? (
        // Information sur les avis diffusés (art. L111-7-2 du code de la
        // consommation, revue finale C-P3). Seulement quand des extraits sont
        // montrés : avec la note seule, la phrase serait sans objet.
        <p className="t-petit mt-2 text-gris">
          Extraits des avis que Google affiche en premier, cités sans retouche
          et parfois abrégés […].
        </p>
      ) : null}
      <ReviewsList reviews={reviews} className={cn("mt-10 md:mt-12")} />
      <p className={cn("t-ui", reviews.length > 0 ? "mt-10 md:mt-12" : "mt-6")}>
        <TextLink href={href}>Lire tous les avis sur Google</TextLink>
      </p>
    </div>
  );
}
