import { ArrowRight, KeyRound, MapPin, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PROCESS_STEPS } from "@/components/estimation/estimation-content";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { HeroContent } from "@/components/home/HeroContent";
import { ReviewsStrip } from "@/components/reviews/ReviewsStrip";
import { Magnetic } from "@/components/ui/Magnetic";
import { RevealMask } from "@/components/ui/RevealMask";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ShimmerImage } from "@/components/ui/ShimmerImage";
import { listRecentProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { AGENT } from "@/lib/config/agent";
import { HERO_AGENCE, HERO_HOME } from "@/lib/images";
import { getReviewsData } from "@/lib/reviews";

export default async function Home() {
  const featured = await loadFeaturedProperties();

  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <FeaturedSection properties={featured} />
      <SellerSection />
      <ReassuranceSection />
      <Suspense fallback={null}>
        <ReviewsStrip
          heading="La parole à nos clients"
          className="bg-cream-light"
        />
      </Suspense>
      <EstimationCtaSection />
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
   Hero — carte claire flottante : accroche + 2 CTA + preuve Google
   ───────────────────────────────────────────── */

async function HeroSection() {
  // Note Google en direct (cachée) ; pastille masquée si la fiche est indispo.
  const reviews = await getReviewsData().catch(() => null);

  return (
    <section className="bg-cream pt-6 pb-4 md:pt-8">
      <div className="mx-auto w-full max-w-7xl px-gutter">
        <div className="grid grid-cols-1 overflow-hidden rounded-lg bg-header shadow-md md:min-h-[520px] md:grid-cols-2">
          <HeroContent
            reviews={
              reviews
                ? {
                    rating: reviews.rating,
                    totalCount: reviews.totalCount,
                    sourceUrl: reviews.sourceUrl,
                  }
                : null
            }
          />
          <div className="relative order-first min-h-[240px] md:order-none md:min-h-0">
            <ShimmerImage
              src={HERO_HOME}
              alt="Intérieur d'un appartement lumineux"
              fill
              priority
              placeholder="blur"
              className="object-cover"
              sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Notre sélection — la rareté assumée comme preuve
   ───────────────────────────────────────────── */

function FeaturedSection({ properties }: { properties: Property[] }) {
  if (properties.length === 0) return null;

  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-6xl px-gutter py-24 md:py-32">
        <SectionHeader
          eyebrow="Notre sélection"
          title="Une sélection volontairement restreinte."
          lede="Chaque bien présenté est un mandat que nous suivons personnellement, de la première visite à la signature."
          action={
            <Link
              href="/acheter"
              className="group inline-flex items-center gap-2 rounded-lg border border-primary-600 bg-transparent px-5 py-2.5 text-sm font-medium text-primary-600 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-600 hover:text-on-primary hover:shadow-md active:translate-y-0"
            >
              Voir tous nos biens
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                aria-hidden="true"
              />
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
   Bloc vendeur — le cœur de la page (objectif : lead estimation)
   ───────────────────────────────────────────── */

function SellerSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-7xl px-gutter py-16 md:py-24">
        <div className="relative overflow-hidden rounded-lg bg-secondary-50 px-6 py-12 md:px-12 md:py-16">
          {/* Slot illustration au trait (pont d'Asnières) — SVG fourni par le
              PO, posé en fond discret haut-droite. */}
          <div
            aria-hidden="true"
            data-illustration-slot="pont-asnieres"
            className="pointer-events-none absolute right-0 top-0 hidden h-48 w-1/2 md:block"
          />

          <div className="relative">
            <SectionHeader
              eyebrow="Vous vendez ?"
              title="Confiez-nous votre bien."
            />

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {PROCESS_STEPS.map((step, i) => (
                <ScrollReveal key={step.title} index={i} className="h-full">
                  <div className="flex h-full flex-col gap-4 rounded-lg bg-card p-6 shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-50 font-display text-sm font-semibold text-secondary-600">
                        {i + 1}
                      </span>
                      <step.icon
                        className="h-5 w-5 text-secondary-500"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold tracking-tight text-primary">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-body">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="mt-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <p className="max-w-xl text-sm leading-relaxed text-body">
                  Des honoraires transparents, affichés publiquement.{" "}
                  <Link
                    href="/honoraires"
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary-600"
                  >
                    Consulter le barème
                  </Link>
                </p>
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <Magnetic>
                    <Link
                      href="/estimation"
                      className="group inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-on-primary shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md active:translate-y-0"
                    >
                      Estimer mon bien
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </Magnetic>
                  <ReassuranceChips />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Chips pilules de micro-réassurance (grammaire de la page estimation). */
function ReassuranceChips({ light = false }: { light?: boolean }) {
  const items = ["Gratuit", "Sans engagement", "Réponse rapide"];
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {items.map((label) => (
        <li
          key={label}
          className={
            light
              ? "rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90"
              : "rounded-full border border-subtle bg-card px-3 py-1 text-xs font-medium text-body"
          }
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

/* ─────────────────────────────────────────────
   Réassurance — barre de confiance
   ───────────────────────────────────────────── */

const REASSURANCE_ITEMS = [
  {
    icon: ShieldCheck,
    title: `Depuis ${AGENT.stats.sinceYear}`,
    description: `${AGENT.stats.years} ans d’expérience à vos côtés.`,
  },
  {
    icon: Users,
    title: "Accompagnement sur-mesure",
    description: "Notre cabinet, à votre écoute à chaque étape.",
  },
  {
    icon: MapPin,
    title: "Ancrage local",
    description: "Une expertise détaillée et éclairée en fonction du marché",
  },
  {
    icon: KeyRound,
    title: "Service global",
    description: "Transaction, location : nous simplifions vos projets.",
  },
] as const;

function ReassuranceSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-7xl px-gutter py-16 md:py-24">
        <SectionHeader
          eyebrow="Nos engagements"
          title="Votre projet immobilier entre de bonnes mains."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASSURANCE_ITEMS.map((item, i) => (
            <ScrollReveal key={item.title} index={i} className="h-full">
              <div className="flex h-full flex-col gap-4 rounded-lg bg-card p-6 shadow-md">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary-50">
                  <item.icon
                    className="h-5 w-5 text-secondary-500"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold tracking-tight text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">
                    {item.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Estimation CTA — bannière conversion
   ───────────────────────────────────────────── */

function EstimationCtaSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-6xl px-gutter py-24 md:py-32">
        <ScrollReveal>
          <div className="overflow-hidden rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col justify-center bg-primary-600 px-6 py-10 md:px-12 md:py-16">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
                  Vous avez un projet&nbsp;?
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-white">
                  Estimez votre bien
                  <br />
                  en quelques minutes.
                </h2>
                <p className="mt-4 text-base text-primary-100">
                  Une estimation fiable et gratuite.
                </p>
                <div className="mt-8 flex flex-col items-start gap-4">
                  <Magnetic>
                    <Link
                      href="/estimation"
                      className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow-md active:translate-y-0"
                    >
                      Estimer mon bien
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                    </Link>
                  </Magnetic>
                  <ReassuranceChips light />
                </div>
              </div>
              <RevealMask
                direction="left"
                delay={0.15}
                className="relative hidden min-h-[240px] md:block"
              >
                <ShimmerImage
                  src={HERO_AGENCE}
                  alt="Vitrine du Cabinet Rimbault, boulevard Voltaire à Asnières-sur-Seine"
                  fill
                  placeholder="blur"
                  className="object-cover"
                  sizes="(min-width: 1152px) 576px, (min-width: 768px) 50vw, 1px"
                />
              </RevealMask>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
