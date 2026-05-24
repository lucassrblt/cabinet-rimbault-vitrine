import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AgenceHeroContent } from "@/components/agence/AgenceHeroContent";
import { ContactTrigger } from "@/components/contact/ContactTrigger";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { LinkButton } from "@/components/ui/Button";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextReveal } from "@/components/ui/TextReveal";
import { AGENT, isPlaceholder } from "@/lib/config/agent";
import { RENT_TIERS, SALE_TIERS } from "@/lib/config/honoraires";
import { getReviewsData } from "@/lib/reviews";

export const metadata: Metadata = {
  title: `L'agence — agent immobilier à ${AGENT.address.city}`,
  description: `${AGENT.fullName}, agent immobilier indépendant à ${AGENT.address.city}. Notre histoire, nos chiffres, nos honoraires.`,
};

export default function AgencePage() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <HistoireSection />
      <Suspense fallback={null}>
        <ChiffresSection />
      </Suspense>
      <Suspense fallback={null}>
        <ReviewsSection />
      </Suspense>
      <HonorairesSection />
      <ProjetSection />
    </main>
  );
}

/* ─── Hero ─── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-900">
      <ParallaxImage
        src="/hero-agence.jpg"
        alt="Vitrine du Cabinet Rimbault — Transactions Immobilières"
        objectPosition="center 35%"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      <AgenceHeroContent
        badgeLabel={`Agence immobilière à ${AGENT.address.city}`}
        tagline={`L'immobilier\nà taille humaine.`}
        subtitle={`Un seul interlocuteur, de l'estimation à la signature. Cabinet indépendant à ${AGENT.address.city} depuis ${new Date().getFullYear() - AGENT.stats.years}.`}
        ctaLabel="Découvrir l'agence"
        ctaHref="#notre-histoire"
      />
    </section>
  );
}

/* ─── Notre histoire ─── */

const VALUES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: User,
    title: "Accompagnement personnalisé",
    description:
      "Un interlocuteur dédié vous accompagne à chaque étape de votre projet : découverte, recherche de biens, estimation, avis de valeur, visite, négociation et signature.",
  },
  {
    icon: MapPin,
    title: "Expertise locale",
    description: `Parfaitement implantés à ${AGENT.address.city} et dans ses environs, nous connaissons le marché et ses spécificités.`,
  },
  {
    icon: Zap,
    title: "Indépendance & réactivité",
    description:
      "Agence indépendante, nous vous garantissons un conseil objectif et des décisions réfléchies en fonction de votre projet.",
  },
  {
    icon: Shield,
    title: "Transparence & confiance",
    description:
      "Des honoraires clairs, des échanges honnêtes et un suivi rigoureux jusqu'à la finalisation de votre projet.",
  },
];

function HistoireSection() {
  return (
    <section id="notre-histoire" className="bg-header">
      <div className="mx-auto w-full max-w-6xl px-gutter py-20 md:py-28">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[2fr_3fr]">
          <div>
            <SectionHeader
              eyebrow="Notre histoire"
              title={
                <>
                  Depuis 2009,
                  <br />à vos côtés
                </>
              }
            />

            <ScrollReveal delay={0.15}>
              <p className="mt-8 text-[15px] leading-[1.7] text-body">
                Le Cabinet Rimbault, agence immobilière indépendante, installée
                à {AGENT.address.city} depuis{" "}
                {new Date().getFullYear() - AGENT.stats.years}, accompagne
                vendeurs, acquéreurs, bailleurs et locataires dans tous leurs
                projets immobiliers.
              </p>
              <p className="mt-5 text-[15px] leading-[1.7] text-body">
                Notre approche repose sur une conviction simple&nbsp;: chaque
                projet est unique. De ce fait, nous vous offrons un
                accompagnement sur mesure, fondé sur l&apos;écoute, la
                transparence et la réactivité.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div>
                  <v.icon
                    className="h-8 w-8 text-neutral-400"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 font-semibold text-primary">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">
                    {v.description}
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

/* ─── Nos chiffres ─── */

async function ChiffresSection() {
  // Note + volume d'avis en direct de Google ; repli sur AGENT.stats si indispo.
  const reviews = await getReviewsData();
  const rating = reviews?.rating ?? AGENT.stats.rating;
  const reviewsCount = reviews?.totalCount ?? AGENT.stats.reviewsCount;

  const stats = [
    {
      target: AGENT.stats.years,
      suffix: " ans",
      decimals: 0,
      label: "d'expérience locale à vos côtés",
    },
    {
      target: AGENT.stats.transactions,
      suffix: "+",
      decimals: 0,
      label: "biens vendus ou loués par notre agence",
    },
    {
      target: rating,
      suffix: "/5",
      decimals: 1,
      label: `sur Google (${reviewsCount} avis)`,
    },
    {
      target: AGENT.stats.mandateSuccessRate,
      suffix: "%",
      decimals: 0,
      label: "de nos clients nous recommandent",
    },
  ];

  return (
    <section className="bg-header">
      <div className="mx-auto w-full max-w-6xl px-gutter py-20 md:py-28">
        <SectionHeader eyebrow="En quelques chiffres" title="Nos chiffres" />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal
              key={stat.label}
              delay={i * 0.15}
              className={`flex flex-col items-center justify-center px-4 py-8 text-center ${
                i < stats.length - 1
                  ? "md:border-r md:border-neutral-200/70"
                  : ""
              } ${i < 2 ? "border-b border-neutral-200/70 md:border-b-0" : ""}`}
            >
              <span className="font-display text-4xl font-semibold tracking-tight text-primary md:text-5xl lg:text-display">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </span>
              <TextReveal delay={i * 0.15 + 0.2}>
                <span className="mt-3 block text-sm text-muted">
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

/* ─── Nos honoraires ─── */

function HonorairesSection() {
  return (
    <section className="bg-header">
      <div className="mx-auto w-full max-w-6xl px-gutter py-20 md:py-28">
        <SectionHeader
          eyebrow="Transparence"
          title="Nos honoraires"
          lede="Ci-dessous le barème de nos d'honoraires"
        />

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <h3 className="mb-4 font-display text-xl font-semibold text-primary">
              Vente (TTC)
            </h3>
            <div className="overflow-hidden rounded-sm border border-default">
              <table className="w-full text-sm">
                <thead className="bg-neutral-100 text-left text-body">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">
                      Tranche de prix
                    </th>
                    <th className="px-5 py-3.5 font-semibold">Honoraires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle">
                  {SALE_TIERS.map((t) => (
                    <tr
                      key={t.range}
                      className="transition-colors hover:bg-neutral-50"
                    >
                      <td className="px-5 py-3.5 text-primary">{t.range}</td>
                      <td className="px-5 py-3.5 font-medium text-primary">
                        {t.fee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h3 className="mb-4 font-display text-xl font-semibold text-primary">
              Location (TTC)
            </h3>
            <div className="overflow-hidden rounded-sm border border-default">
              <table className="w-full text-sm">
                <thead className="bg-neutral-100 text-left text-body">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Prestation</th>
                    <th className="px-5 py-3.5 font-semibold">Plafond TTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle">
                  {RENT_TIERS.map((t) => (
                    <tr
                      key={t.label}
                      className="transition-colors hover:bg-neutral-50"
                    >
                      <td className="px-5 py-3.5 text-primary">{t.label}</td>
                      <td className="px-5 py-3.5 font-medium text-primary">
                        {t.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>

        <TextReveal delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <p className="text-xs text-muted">
              *TVA : Taux en vigueur en 2024. Tarifs applicables à compter du
              1ᵉʳ janvier 2024.
            </p>
            <LinkButton href="/honoraires" variant="ghost" size="sm">
              Voir le barème détaillé
              <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
            </LinkButton>
          </div>
        </TextReveal>
      </div>
    </section>
  );
}

/* ─── Bloc final — votre projet & nous trouver ─── */

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: "Adresse",
    content: (
      <>
        {AGENT.address.line1}
        <br />
        {AGENT.address.postalCode} {AGENT.address.city}
      </>
    ),
  },
  {
    icon: Phone,
    label: "Téléphone",
    content: (
      <a
        href={`tel:${AGENT.phoneE164}`}
        className="underline underline-offset-4 transition-colors hover:text-primary-300"
      >
        {AGENT.phoneDisplay}
      </a>
    ),
  },
  {
    icon: Mail,
    label: "Email",
    content: (
      <a
        href={`mailto:${AGENT.email}`}
        className="underline underline-offset-4 transition-colors hover:text-primary-300"
      >
        {AGENT.email}
      </a>
    ),
  },
  {
    icon: Clock,
    label: "Horaires",
    content: (
      <>
        {AGENT.hours.monday && (
          <>
            {AGENT.hours.monday}
            <br />
          </>
        )}
        {AGENT.hours.weekdays}
        {AGENT.hours.saturday && (
          <>
            <br />
            {AGENT.hours.saturday}
          </>
        )}
      </>
    ),
  },
] as const;

function ProjetSection() {
  return (
    <section className="bg-header">
      <div className="mx-auto w-full max-w-6xl px-gutter py-20 md:py-28">
        <div className="overflow-hidden rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr]">
            {/* Zone gauche — votre projet */}
            <div className="relative overflow-hidden bg-primary-600 px-6 py-14 md:px-12 md:py-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary-400/30 blur-3xl"
              />
              <div className="relative">
                <ScrollReveal>
                  <p className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-wide text-primary-200">
                    <span
                      aria-hidden="true"
                      className="h-px w-7 bg-primary-300"
                    />
                    Votre projet commence ici
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    Parlons de votre projet.
                  </h2>
                </ScrollReveal>

                <TextReveal delay={0.15}>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-primary-100">
                    Achat, vente, location ou simple question&nbsp;: un premier
                    échange sans engagement pour y voir clair, à votre rythme.
                  </p>
                </TextReveal>

                <TextReveal delay={0.25}>
                  <div className="mt-9 flex flex-col gap-3 sm:max-w-sm">
                    <ContactTrigger
                      subject="rdv"
                      className="group flex items-center justify-between gap-3 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-primary-600 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                    >
                      Me contacter
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </ContactTrigger>
                    <Link
                      href="/estimation"
                      className="group flex items-center justify-between gap-3 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
                    >
                      Estimer mon bien
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </TextReveal>
              </div>
            </div>

            {/* Zone droite — nous trouver */}
            <div className="relative overflow-hidden bg-neutral-800 px-6 py-14 md:px-10 md:py-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-primary-600/30 blur-3xl"
              />
              <div className="relative">
                <ScrollReveal delay={0.15}>
                  <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">
                    <span
                      aria-hidden="true"
                      className="h-px w-7 bg-primary-400"
                    />
                    Nous trouver
                  </p>
                </ScrollReveal>

                <div className="mt-8 space-y-6">
                  {CONTACT_ITEMS.map((item, i) => (
                    <TextReveal key={item.label} delay={0.2 + i * 0.08}>
                      <div className="flex items-start gap-4">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600">
                          <item.icon
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                            {item.label}
                          </p>
                          <p className="mt-1 text-[15px] leading-relaxed text-on-inverse">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </TextReveal>
                  ))}
                </div>

                {!isPlaceholder(AGENT.googleBusinessUrl) && (
                  <TextReveal delay={0.5}>
                    <div className="mt-8 border-t border-white/10 pt-6">
                      <a
                        href={AGENT.googleBusinessUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
                      >
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        Voir sur Google Maps
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  </TextReveal>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
