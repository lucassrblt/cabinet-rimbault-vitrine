import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { featuredReviews, getReviewsData } from "@/lib/reviews";
import { GoogleRatingBadge } from "./GoogleRatingBadge";
import { ReviewCard } from "./ReviewCard";

/**
 * Bande compacte « Avis clients » (3 avis) — destinée à la home et `/vendre`.
 *
 * `className` remplace les classes de fond du `<section>` afin de s'adapter
 * aux conventions de chaque page (bande teintée vs filet de séparation).
 */
export async function ReviewsStrip({
  heading,
  className = "bg-header",
}: {
  heading: string;
  className?: string;
}) {
  const data = await getReviewsData();
  if (!data) return null;

  const reviews = featuredReviews(data, 3);
  // Garde-fou : sous 3 avis affichables, la bande perd son intérêt.
  if (reviews.length < 3) return null;

  return (
    <section className={className}>
      <div className="mx-auto w-full max-w-6xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeader
          eyebrow="Avis clients"
          title={heading}
          action={<GoogleRatingBadge data={data} variant="inline" />}
        />

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {reviews.map((review, index) => (
            <ScrollReveal
              key={review.id}
              delay={0.12 + index * 0.08}
              className="h-full"
            >
              <ReviewCard review={review} variant="compact" />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.1} className="mt-8">
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary-600"
          >
            Voir tous les avis sur Google
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
