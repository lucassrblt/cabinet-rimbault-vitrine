import { ArrowRight, Home as HomeIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PROCESS_STEPS } from "@/components/estimation/estimation-content";
import { EstimationPreview } from "@/components/home/EstimationPreview";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { HeroContent } from "@/components/home/HeroContent";
import { PontAsnieres } from "@/components/home/PontAsnieres";
import {
  PictoCle,
  PictoFacade,
  PictoPlan,
  PictoPoignee,
} from "@/components/home/pictos";
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
        <ReviewsStrip heading="La parole à nos clients" className="bg-cream" />
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
    <section className="relative bg-[#fbf9f4]">
      {/* Photo pleine largeur, fondue derrière le panneau texte (desktop) ;
          bandeau photo simple au-dessus du texte en mobile. */}
      <div className="relative h-60 w-full sm:h-72 md:absolute md:inset-0 md:h-full">
        <ShimmerImage
          src={HERO_HOME}
          alt="Intérieur d'un appartement lumineux"
          fill
          priority
          placeholder="blur"
          className="object-cover md:object-[70%_center]"
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-[#fbf9f4] from-[32%] via-[#fbf9f4]/85 via-[52%] to-transparent to-[78%] md:block"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-gutter md:flex md:min-h-[520px] md:items-center">
        <div className="max-w-xl py-12 md:py-16">
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
      <div className="mx-auto w-full max-w-6xl px-gutter py-16 md:py-20">
        <SectionHeader
          eyebrow={
            <span className="inline-flex items-center gap-2.5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-secondary-500">
                <HomeIcon
                  className="h-3.5 w-3.5 text-white"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
              Notre sélection
            </span>
          }
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

/** Étapes de la timeline vendeur — mêmes 3 temps que le tunnel, avec une
 *  3e description raccourcie pour le format timeline (la page estimation
 *  garde sa version longue via PROCESS_STEPS). */
const SELLER_STEPS = PROCESS_STEPS.map((step, i) =>
  i === 2
    ? {
        ...step,
        description:
          "Une première fourchette de prix argumentée, les atouts de votre bien, ses conseils.",
      }
    : step,
);

function SellerSection() {
  return (
    <section className="relative overflow-hidden bg-secondary-50">
      {/* Pont d'Asnières au trait — signature graphique, haut droit de la
          bande ; la carte formulaire vient se poser sur sa moitié basse. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-8 hidden w-[56%] md:block"
      >
        <PontAsnieres className="h-auto w-full text-secondary-500/35" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-gutter py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[45fr_45fr] md:justify-between md:gap-[10%]">
          {/* Timeline — se conclut sur l'action */}
          <div>
            <SectionHeader
              eyebrow="Vous vendez ?"
              title="Confiez-nous votre bien."
            />

            <ol className="mt-10 space-y-0">
              {SELLER_STEPS.map((step, i) => (
                <li key={step.title} className="relative flex gap-4 pb-8">
                  {i < SELLER_STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px bg-secondary-300"
                    />
                  )}
                  <span className="z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-500 font-display text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-display text-base font-semibold tracking-tight text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-body">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex flex-col items-start gap-3">
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
              <p className="mt-2 text-sm leading-relaxed text-body">
                Des honoraires transparents, affichés publiquement.{" "}
                <Link
                  href="/honoraires"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary-600"
                >
                  Consulter le barème
                </Link>
              </p>
            </div>
          </div>

          {/* Aperçu du tunnel d'estimation — l'objet de conversion, posé
              sur la moitié basse du pont */}
          <ScrollReveal className="self-end md:pb-4">
            <EstimationPreview />
          </ScrollReveal>
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
    icon: PictoFacade,
    title: `Depuis ${AGENT.stats.sinceYear}`,
    description: `${AGENT.stats.years} ans d’expérience à vos côtés.`,
  },
  {
    icon: PictoPoignee,
    title: "Accompagnement sur-mesure",
    description: "Notre cabinet, à votre écoute à chaque étape.",
  },
  {
    icon: PictoPlan,
    title: "Ancrage local",
    description: "Une expertise détaillée et éclairée en fonction du marché",
  },
  {
    icon: PictoCle,
    title: "Service global",
    description: "Transaction, location : nous simplifions vos projets.",
  },
] as const;

function ReassuranceSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-6xl px-gutter py-16 md:py-20">
        <SectionHeader
          eyebrow="Nos engagements"
          title="Votre projet immobilier entre de bonnes mains."
        />
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {REASSURANCE_ITEMS.map((item, i) => (
            <ScrollReveal key={item.title} index={i}>
              <div className="flex flex-col items-center gap-4 text-center">
                <span aria-hidden="true" className="text-primary-600">
                  <item.icon className="h-12 w-12" />
                </span>
                <h3 className="font-display text-base font-semibold tracking-tight text-primary">
                  {item.title}
                </h3>
                <p className="max-w-[26ch] text-sm leading-relaxed text-body">
                  {item.description}
                </p>
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
      <div className="mx-auto w-full max-w-6xl px-gutter py-16 md:py-20">
        <ScrollReveal>
          <div className="overflow-hidden rounded-xl shadow-sm">
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
