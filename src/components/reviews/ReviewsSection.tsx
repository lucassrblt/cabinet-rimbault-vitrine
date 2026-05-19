import { ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { featuredReviews, getReviewsData } from "@/lib/reviews";
import { GoogleRatingBadge } from "./GoogleRatingBadge";
import { ReviewCard } from "./ReviewCard";

/**
 * Section pleine « Avis clients » — destinée à `/agence`.
 * Porte `id="avis"` : cible de l'ancre `/agence#avis` du footer.
 */
export async function ReviewsSection() {
  const data = await getReviewsData();
  if (!data) return null;

  const reviews = featuredReviews(data, 6);
  if (reviews.length === 0) return null;

  return (
    <section id="avis" className="scroll-mt-24 bg-header">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <SectionHeader
          eyebrow="Avis clients"
          title="Ils m’ont fait confiance"
          lede="Des retours authentiques, publiés directement sur Google par les propriétaires et acquéreurs que j’ai accompagnés."
          action={<GoogleRatingBadge data={data} variant="block" />}
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <ScrollReveal
              key={review.id}
              delay={index * 0.08}
              className="h-full"
            >
              <ReviewCard review={review} variant="full" />
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-10">
          <LinkButton href={data.sourceUrl} variant="secondary" external>
            Voir tous les avis sur Google
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
