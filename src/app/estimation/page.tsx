import type { LucideIcon } from "lucide-react";
import { ClipboardList, MessageSquareText, UserCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { EstimationForm } from "@/components/forms/EstimationForm";
import { GoogleRatingBadge } from "@/components/reviews/GoogleRatingBadge";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AGENT } from "@/lib/config/agent";
import { getReviewsData } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Estimation gratuite de votre bien",
  description:
    "Quelques questions pour obtenir une première estimation de votre bien par le Cabinet Rimbault.",
};

const DELIVERABLES: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: ClipboardList,
    title: "Une fourchette argumentée",
    description:
      "Prix bas, prix de marché, prix haut — accompagnés des comparables locaux qui justifient l'analyse.",
  },
  {
    icon: MessageSquareText,
    title: "Un échange direct",
    description:
      "Un appel personnel pour préciser la stratégie de vente ou de location adaptée à votre bien.",
  },
  {
    icon: UserCircle2,
    title: "Un interlocuteur unique",
    description:
      "Le cabinet vous accompagne du premier contact à la signature, sans transmission de dossier.",
  },
];

export default function EstimationPage() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <FormSection />
      <DeliverablesSection />
      <PhoneFallbackSection />
    </main>
  );
}

async function HeroSection() {
  const reviews = await getReviewsData();
  return (
    <section className="bg-header">
      <div className="mx-auto w-full max-w-3xl px-4 pb-8 pt-16 text-center md:pb-10 md:pt-20">
        <ScrollReveal>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-600">
            Estimation gratuite
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-primary md:text-5xl">
            Estimez votre bien
            <br />
            en quelques minutes.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-body md:text-base">
            Une fourchette argumentée par un agent indépendant. Sans engagement.
            Réponse personnelle sous 24&nbsp;h ouvrées.
          </p>
          {reviews && (
            <div className="mt-7 flex justify-center">
              <GoogleRatingBadge data={reviews} variant="inline" />
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}

function FormSection() {
  return (
    <section className="bg-header">
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 md:pb-20">
        <div className="rounded-lg border border-subtle bg-card p-6 shadow-lg md:p-10">
          <EstimationForm />
        </div>
      </div>
    </section>
  );
}

function DeliverablesSection() {
  return (
    <section className="bg-header">
      <div className="mx-auto w-full max-w-5xl px-4 pb-20 md:pb-24">
        <div className="rounded-lg border border-neutral-200/70 bg-neutral-100/60 px-6 py-10 md:px-10 md:py-12">
          <ScrollReveal>
            <div className="text-center">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-600">
                Ce que vous recevez
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-primary md:text-3xl">
                Une réponse soignée, sans pression.
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {DELIVERABLES.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="flex flex-col items-start text-left">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card">
                    <item.icon
                      className="h-5 w-5 text-primary-600"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneFallbackSection() {
  return (
    <section className="bg-header">
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 text-center md:pb-28">
        <ScrollReveal>
          <p className="text-sm text-muted md:text-base">
            Vous préférez parler de vive voix&nbsp;?
          </p>
          <a
            href={`tel:${AGENT.phoneE164}`}
            className="mt-3 inline-flex items-baseline gap-2 font-display text-2xl font-medium tracking-tight text-primary transition-colors hover:text-primary-600 md:text-3xl"
          >
            {AGENT.phoneDisplay}
          </a>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            {AGENT.hours.weekdays}
            {AGENT.hours.saturday ? ` — ${AGENT.hours.saturday}` : null}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
