import type { Metadata } from "next";
import { EstimationHero } from "@/components/estimation/EstimationHero";
import { EstimationProcess } from "@/components/estimation/EstimationProcess";
import { EstimationForm } from "@/components/forms/estimation/EstimationForm";
import { getReviewsData } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Estimation gratuite de votre bien",
  description:
    "Quelques questions pour obtenir une première estimation de votre bien par le Cabinet Rimbault.",
};

export default async function EstimationPage() {
  const reviews = await getReviewsData();
  return (
    <main className="flex flex-1 flex-col bg-cream">
      <EstimationHero reviews={reviews} />

      {/* Carte du tunnel : remontée par marge négative pour chevaucher le bas du hero. */}
      <section className="relative z-10 -mt-28 md:-mt-44">
        <div className="mx-auto w-full max-w-5xl px-4 md:px-8">
          <div className="rounded-lg border border-subtle bg-card p-6 shadow-lg md:p-9">
            <EstimationForm />
          </div>
        </div>
      </section>

      <section className="pt-14 pb-24 md:pt-16 md:pb-28">
        <div className="mx-auto w-full max-w-5xl px-4 md:px-8">
          <EstimationProcess />
        </div>
      </section>
    </main>
  );
}
