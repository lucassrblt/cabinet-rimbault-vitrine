import { ArrowRight, KeyRound, MapPin, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { HeroContent } from "@/components/home/HeroContent";
import { HeroSearch } from "@/components/home/HeroSearch";
import { ReviewsStrip } from "@/components/reviews/ReviewsStrip";
import { Magnetic } from "@/components/ui/Magnetic";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealMask } from "@/components/ui/RevealMask";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ShimmerImage } from "@/components/ui/ShimmerImage";
import { listRecentProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { AGENT } from "@/lib/config/agent";
import { HERO_AGENCE, HERO_HOME } from "@/lib/images";

export default async function Home() {
  const featured = await loadFeaturedProperties();

  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <FeaturedSection properties={featured} />
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
   Hero — INCHANGÉ
   ───────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative -mt-20 bg-cream pb-12 md:pb-14">
      <div className="relative overflow-hidden">
        <ParallaxImage
          src={HERO_HOME}
          alt="Intérieur d'un appartement parisien lumineux"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent"
        />
        <HeroContent />
      </div>

      <div className="relative z-20 mx-auto -mt-14 w-full max-w-5xl px-gutter md:-mt-16">
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
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-6xl px-gutter py-24 md:py-32">
        <SectionHeader
          eyebrow="Notre sélection"
          title="Nos coups de cœur dans votre quartier."
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
    <section className="bg-cream-light">
      <div className="mx-auto w-full max-w-6xl px-gutter py-24 md:py-32">
        <SectionHeader
          eyebrow="Nos engagements"
          title="Votre projet immobilier entre de bonnes mains."
        />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4">
          {REASSURANCE_ITEMS.map((item, i) => (
            <ScrollReveal
              key={item.title}
              index={i}
              className={`flex flex-col items-center px-4 py-8 text-center md:px-6 md:py-10 ${
                i < REASSURANCE_ITEMS.length - 1
                  ? "border-r border-neutral-200"
                  : ""
              } ${i < 2 ? "border-b border-neutral-200 md:border-b-0" : ""}`}
            >
              <item.icon
                className="h-10 w-10 text-primary-600"
                strokeWidth={1.25}
                aria-hidden="true"
              />
              <h3 className="mt-5 font-display text-base font-semibold tracking-tight text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
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
                <div className="mt-8">
                  <Magnetic>
                    <Link
                      href="/estimation"
                      className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow-md active:translate-y-0"
                    >
                      Estimer mon bien
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                    </Link>
                  </Magnetic>
                </div>
              </div>
              <RevealMask
                direction="left"
                delay={0.15}
                className="relative hidden min-h-[240px] md:block"
              >
                <ShimmerImage
                  src={HERO_AGENCE}
                  alt="Façade d'un immeuble de caractère"
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
