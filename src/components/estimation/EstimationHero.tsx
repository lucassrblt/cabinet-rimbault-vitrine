import { Suspense } from "react";
import { RevealMask } from "@/components/ui/RevealMask";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getReviewsData } from "@/lib/reviews";
import { HeroImage } from "./HeroImage";
import { HeroReassurance } from "./HeroReassurance";
import { HeroSocialProof } from "./HeroSocialProof";

/**
 * Hero de la page Estimation : deux colonnes (accroche + preuves sociales /
 * photo). Le padding bas généreux laisse la carte du tunnel chevaucher le bas
 * du hero (cf. `page.tsx`).
 *
 * Colonne gauche : les blocs arrivent en cascade. Colonne droite : la photo se
 * révèle par un balayage. Le bloc social proof attend les avis Google via une
 * Suspense locale pour ne pas bloquer le rendu du hero.
 */
export function EstimationHero() {
  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-6xl px-4 pt-14 pb-16 md:px-8 md:pt-20 md:pb-24">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:items-start md:gap-14">
          <div>
            <ScrollReveal index={0}>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-600">
                Estimation gratuite
              </p>
            </ScrollReveal>
            <ScrollReveal index={1} className="mt-4">
              <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-primary md:text-5xl">
                Estimez votre bien
                <br />
                en quelques minutes.
              </h1>
            </ScrollReveal>
            <ScrollReveal index={2} className="mt-5">
              <p className="max-w-md text-base leading-relaxed text-body">
                Une fourchette de prix fiable et argumentée, réalisée par un
                agent indépendant.
              </p>
            </ScrollReveal>
            <ScrollReveal index={3} className="mt-7">
              <Suspense fallback={null}>
                <HeroSocialProofWithReviews />
              </Suspense>
            </ScrollReveal>
            <ScrollReveal index={4} className="mt-6">
              <HeroReassurance />
            </ScrollReveal>
          </div>

          <RevealMask delay={0.12} direction="left">
            <HeroImage />
          </RevealMask>
        </div>
      </div>
    </section>
  );
}

async function HeroSocialProofWithReviews() {
  const reviews = await getReviewsData();
  return <HeroSocialProof reviews={reviews} />;
}
