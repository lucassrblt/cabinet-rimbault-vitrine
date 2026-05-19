import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { ReviewsData } from "@/lib/reviews/types";
import { HeroImage } from "./HeroImage";
import { HeroReassurance } from "./HeroReassurance";
import { HeroSocialProof } from "./HeroSocialProof";

/**
 * Hero de la page Estimation : deux colonnes (accroche + preuves sociales /
 * photo). Le padding bas généreux laisse la carte du tunnel chevaucher le bas
 * du hero (cf. `page.tsx`).
 */
export function EstimationHero({ reviews }: { reviews: ReviewsData | null }) {
  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-6xl px-4 pt-14 pb-16 md:px-8 md:pt-20 md:pb-24">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:items-start md:gap-14">
          <ScrollReveal>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-600">
              Estimation gratuite
            </p>
            <h1 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-primary md:text-5xl">
              Estimez votre bien
              <br />
              en quelques minutes.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-body">
              Une fourchette de prix fiable et argumentée, réalisée par un agent
              indépendant.
            </p>
            <div className="mt-7">
              <HeroSocialProof reviews={reviews} />
            </div>
            <div className="mt-6">
              <HeroReassurance />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12} direction="left">
            <HeroImage />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
