import { ArrowRight, Mail, Phone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QuickContactForm } from "@/components/forms/QuickContactForm";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { HeroContent } from "@/components/home/HeroContent";
import { HeroSearch } from "@/components/home/HeroSearch";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { LinkButton } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextReveal } from "@/components/ui/TextReveal";
import { listRecentProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { AGENT, SELLING_STEPS } from "@/lib/config/agent";
import { REVIEWS } from "@/lib/config/reviews";

export default async function Home() {
  const featured = await loadFeaturedProperties();

  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <FeaturedSection properties={featured} />
      <ChiffresSection />
      <AgentSection />
      <ParcoursVendeurSection />
      <ReviewsSection />
      <QuickContactSection />
    </main>
  );
}

async function loadFeaturedProperties(): Promise<Property[]> {
  try {
    const res = await listRecentProperties(5);
    return res.data ?? [];
  } catch {
    return [];
  }
}

/* ─────────────────────────────────────────────
   Hero — INCHANGÉ
   ───────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative bg-header pb-12 md:pb-14">
      <div className="relative overflow-hidden">
        <Image
          src="/hero-home.jpg"
          alt="Intérieur d'un appartement parisien lumineux"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        <HeroContent years={AGENT.stats.years} />
      </div>

      <div className="relative z-20 mx-auto -mt-14 w-full max-w-5xl px-4 md:-mt-16 md:px-8">
        <HeroSearch />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Notre sélection — INCHANGÉ
   ───────────────────────────────────────────── */

function FeaturedSection({ properties }: { properties: Property[] }) {
  if (properties.length === 0) return null;

  return (
    <section className="bg-header">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <SectionHeader
          eyebrow={<span className="text-primary">Notre sélection</span>}
          title="Nos coups de cœur dans votre quartier."
          action={
            <Link
              href="/acheter"
              className="inline-flex items-center gap-2 rounded-sm border border-primary-600 px-5 py-2.5 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-primary-600 hover:text-on-primary"
            >
              Voir tous les biens
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-10">
          <FeaturedCarousel properties={properties} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Chiffres clés — NOUVEAU
   ───────────────────────────────────────────── */

const HOME_STATS = [
  {
    target: AGENT.stats.years,
    suffix: " ans",
    decimals: 0,
    label: "d’expérience dans le quartier",
  },
  {
    target: AGENT.stats.transactions,
    suffix: "+",
    decimals: 0,
    label: "transactions accompagnées",
  },
  {
    target: AGENT.stats.rating,
    suffix: "/5",
    decimals: 1,
    label: `sur Google (${AGENT.stats.reviewsCount} avis)`,
  },
  {
    target: AGENT.stats.communesCount,
    suffix: "",
    decimals: 0,
    label: "communes couvertes",
  },
] as const;

function ChiffresSection() {
  return (
    <section className="bg-neutral-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
              En quelques chiffres
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Des résultats concrets
            </h2>
            <div className="mx-auto mt-4 h-px w-12 bg-primary-600" />
          </div>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4">
          {HOME_STATS.map((stat, i) => (
            <ScrollReveal
              key={stat.label}
              delay={i * 0.15}
              className={`flex flex-col items-center justify-center px-4 py-8 text-center ${
                i < HOME_STATS.length - 1
                  ? "md:border-r md:border-neutral-700"
                  : ""
              } ${i < 2 ? "border-b border-neutral-700 md:border-b-0" : ""}`}
            >
              <span className="font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-display">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </span>
              <TextReveal delay={i * 0.15 + 0.2}>
                <span className="mt-3 block text-sm text-neutral-400">
                  {stat.label}
                </span>
              </TextReveal>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Agent — REWORK éditorial
   ───────────────────────────────────────────── */

function AgentSection() {
  return (
    <section className="bg-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            Votre interlocuteur
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {AGENT.fullName}
          </h2>
          <div className="mt-4 h-px w-12 bg-primary-600" />
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-[300px_1fr] md:gap-14">
          <ScrollReveal>
            <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-neutral-200">
              <div className="flex h-full items-center justify-center text-muted">
                Portrait
              </div>
            </div>
          </ScrollReveal>

          <div className="flex flex-col justify-center gap-6">
            <TextReveal>
              <blockquote className="font-serif text-xl italic leading-snug text-primary md:text-2xl">
                « Mon métier : estimer juste, défendre votre intérêt, et vous
                faire gagner du temps. »
              </blockquote>
            </TextReveal>

            <TextReveal delay={0.1}>
              <p className="max-w-xl text-[15px] leading-[1.7] text-body">
                J&apos;accompagne vendeurs, acheteurs et locataires sur un
                périmètre resserré que je connais de rue en rue. Un seul
                interlocuteur, du premier rendez-vous à la signature chez le
                notaire.
              </p>
            </TextReveal>

            <TextReveal delay={0.2}>
              <p className="text-sm text-muted">{AGENT.title}</p>
            </TextReveal>

            <TextReveal delay={0.3}>
              <LinkButton href="/agence" variant="secondary" size="sm">
                En savoir plus sur l&apos;agence
              </LinkButton>
            </TextReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Parcours vendeur — REWORK (remplace SellerPathSection)
   ───────────────────────────────────────────── */

function ParcoursVendeurSection() {
  return (
    <section className="bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            Accompagnement vendeur
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            De l&apos;estimation à la signature
          </h2>
          <div className="mt-4 h-px w-12 bg-primary-600" />
        </ScrollReveal>

        <ol className="relative mt-14 space-y-10 pl-12">
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-primary-100" />

          {SELLING_STEPS.map((step, i) => (
            <li key={step.title} className="relative">
              <ScrollReveal delay={i * 0.15}>
                <span className="absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-on-primary">
                  {i + 1}
                </span>
                <h3 className="font-serif text-lg font-semibold text-primary">
                  {step.title.replace(/^\d+\.\s*/, "")}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
                  {step.duration}
                </p>
                <p className="mt-2 max-w-lg text-[15px] leading-[1.7] text-body">
                  {step.role}
                </p>
              </ScrollReveal>
            </li>
          ))}
        </ol>

        <TextReveal delay={0.6}>
          <div className="mt-14 flex flex-wrap gap-4">
            <LinkButton href="/estimation">Estimer mon bien</LinkButton>
            <LinkButton href="/vendre" variant="secondary" size="sm">
              En savoir plus
            </LinkButton>
          </div>
        </TextReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Avis clients — REWORK éditorial
   ───────────────────────────────────────────── */

function ReviewsSection() {
  if (REVIEWS.length < 5) return null;
  const selected = REVIEWS.slice(0, 3);
  const avg = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length || 0;

  return (
    <section className="bg-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            Ils nous font confiance
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Ce que disent nos clients
          </h2>
          <div className="mt-4 h-px w-12 bg-primary-600" />
        </ScrollReveal>

        <TextReveal delay={0.1}>
          <div className="mt-6 inline-flex items-center gap-2">
            <Rating value={avg} />
            <span className="text-sm font-medium text-primary">
              {avg.toFixed(1)} / 5
            </span>
            <span className="text-sm text-body">
              sur Google — {REVIEWS.length} avis
            </span>
          </div>
        </TextReveal>

        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {selected.map((r, i) => (
            <li key={r.id}>
              <ScrollReveal delay={i * 0.12}>
                <div className="flex flex-col gap-3 rounded-sm border border-subtle bg-card p-6">
                  <span
                    className="font-serif text-4xl leading-none text-primary-200"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <Rating value={r.rating} />
                  <p className="text-[15px] leading-[1.7] italic text-body">
                    {r.excerpt}
                  </p>
                  <p className="mt-auto text-xs text-muted">
                    — {r.author}
                    {r.commune && `, ${r.commune}`} · {r.date}
                  </p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>

        <TextReveal delay={0.4}>
          <div className="mt-10">
            <LinkButton
              href={AGENT.googleBusinessUrl}
              external
              variant="secondary"
              size="sm"
            >
              <Star className="h-4 w-4" aria-hidden="true" />
              Voir tous les avis sur Google
            </LinkButton>
          </div>
        </TextReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Contact rapide — REWORK dark + form
   ───────────────────────────────────────────── */

function QuickContactSection() {
  return (
    <section className="bg-neutral-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
              Votre projet commence ici
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Discutons de votre projet
            </h2>
            <div className="mx-auto mt-4 h-px w-12 bg-primary-600" />
          </div>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-[320px_1fr]">
          <ScrollReveal>
            <div className="flex flex-col justify-center">
              <Phone className="h-6 w-6 text-neutral-400" aria-hidden="true" />
              <a
                href={`tel:${AGENT.phoneE164}`}
                className="mt-3 text-2xl font-semibold tracking-tight text-white underline-offset-4 hover:underline"
              >
                {AGENT.phoneDisplay}
              </a>
              <p className="mt-2 text-sm text-neutral-400">
                Du lundi au samedi — réponse rapide.
              </p>
              <a
                href={`mailto:${AGENT.email}`}
                className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-400 underline underline-offset-4 hover:text-white"
              >
                <Mail className="h-4 w-4" aria-hidden="true" /> {AGENT.email}
              </a>
              <Link
                href="/contact"
                className="mt-6 text-sm text-neutral-400 underline underline-offset-4 hover:text-white"
              >
                Coordonnées complètes &amp; horaires
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="rounded-sm bg-card p-6">
              <QuickContactForm />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
