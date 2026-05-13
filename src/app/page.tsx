import { ArrowRight, KeyRound, MapPin, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { HeroContent } from "@/components/home/HeroContent";
import { HeroSearch } from "@/components/home/HeroSearch";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { listRecentProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { AGENT } from "@/lib/config/agent";

export default async function Home() {
  const featured = await loadFeaturedProperties();

  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <FeaturedSection properties={featured} />
      <ReassuranceSection />
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
    <section className="relative -mt-20 bg-header pb-12 md:pb-14">
      <div className="relative overflow-hidden">
        <Image
          src="/hero-home.jpg"
          alt="Intérieur d'un appartement parisien lumineux"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
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
      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16">
        <SectionHeader
          eyebrow={<span className="text-primary-600">Notre sélection</span>}
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
    title: "Depuis 1969",
    description: "Plus de 50 ans d’expérience à vos côtés.",
  },
  {
    icon: Users,
    title: "Accompagnement sur-mesure",
    description: "Une équipe à votre écoute à chaque étape.",
  },
  {
    icon: MapPin,
    title: "Ancrage local",
    description: "Une connaissance fine du marché à Tours et ses environs.",
  },
  {
    icon: KeyRound,
    title: "Service global",
    description:
      "Transaction, location, gestion : nous simplifions vos projets.",
  },
] as const;

function ReassuranceSection() {
  return (
    <section className="bg-header">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="rounded-lg border border-neutral-200/70 bg-neutral-100/60">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {REASSURANCE_ITEMS.map((item, i) => (
              <ScrollReveal
                key={item.title}
                delay={i * 0.12}
                className={`flex flex-col items-center px-6 py-10 text-center ${
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
                <h3 className="mt-5 font-serif text-base font-semibold tracking-tight text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </ScrollReveal>
            ))}
          </div>
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
    <section className="bg-header">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <ScrollReveal>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col justify-center bg-primary-600 px-8 py-12 md:px-12 md:py-16">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
                  Vous avez un projet&nbsp;?
                </p>
                <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
                  Estimez votre bien
                  <br />
                  en quelques minutes.
                </h2>
                <p className="mt-4 text-base text-primary-100">
                  Une estimation fiable et gratuite par nos experts.
                </p>
                <div className="mt-8">
                  <Link
                    href="/estimation"
                    className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow-md active:translate-y-0"
                  >
                    Estimer mon bien
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
              <div className="relative hidden min-h-[240px] md:block">
                <Image
                  src="/hero-agence.jpg"
                  alt="Façade d'un immeuble de caractère"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
