import { Clock, MapPin, Star } from "lucide-react";
import { Suspense } from "react";
import { TextReveal } from "@/components/ui/TextReveal";
import { AGENT } from "@/lib/config/agent";
import { getReviewsData } from "@/lib/reviews";

const SINCE_YEAR = new Date().getFullYear() - AGENT.stats.years;

export function ContactReassuranceBar() {
  return (
    <section className="border-y border-subtle bg-header">
      <div className="mx-auto w-full max-w-6xl px-gutter py-8 md:py-10">
        <div className="grid grid-cols-1 divide-y divide-subtle sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Suspense
            fallback={
              <RatingItem
                rating={AGENT.stats.rating}
                count={AGENT.stats.reviewsCount}
              />
            }
          >
            <RatingItemLive />
          </Suspense>

          <TextReveal delay={0.05}>
            <Item
              icon={
                <MapPin
                  className="h-5 w-5 text-primary-600"
                  aria-hidden="true"
                />
              }
              value={`Depuis ${SINCE_YEAR}`}
              label={`${AGENT.stats.years} ans à ${AGENT.address.city}`}
            />
          </TextReveal>

          <TextReveal delay={0.1}>
            <Item
              icon={
                <Clock
                  className="h-5 w-5 text-primary-600"
                  aria-hidden="true"
                />
              }
              value="Sous 24 h"
              label="Réponse ouvrée garantie"
            />
          </TextReveal>
        </div>
      </div>
    </section>
  );
}

async function RatingItemLive() {
  const reviews = await getReviewsData();
  const rating = reviews?.rating ?? AGENT.stats.rating;
  const count = reviews?.totalCount ?? AGENT.stats.reviewsCount;
  return (
    <TextReveal>
      <RatingItem rating={rating} count={count} />
    </TextReveal>
  );
}

function RatingItem({ rating, count }: { rating: number; count: number }) {
  return (
    <Item
      icon={
        <Star
          className="h-5 w-5 fill-primary-600 text-primary-600"
          aria-hidden="true"
        />
      }
      value={`${rating.toFixed(1).replace(".", ",")} / 5`}
      label={`sur Google (${count} avis)`}
    />
  );
}

function Item({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 sm:justify-center sm:py-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-display text-xl font-semibold text-primary leading-tight">
          {value}
        </p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}
