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
import Image from "next/image";
import Link from "next/link";
import { AgenceHeroContent } from "@/components/agence/AgenceHeroContent";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { LinkButton } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { AGENT } from "@/lib/config/agent";
import { RENT_TIERS, SALE_TIERS } from "@/lib/config/honoraires";

export const metadata: Metadata = {
  title: "L'agence — Cabinet Rimbault",
  description: `${AGENT.fullName}, agent immobilier indépendant à ${AGENT.address.city}. Notre histoire, nos chiffres, nos honoraires.`,
};

export default function AgencePage() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <HistoireSection />
      <ChiffresSection />
      <HonorairesSection />
      <NousTrouverSection />
      <CTASection />
    </main>
  );
}

/* ─── Hero ─── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-neutral-900">
      <Image
        src="/hero-agence.jpg"
        alt="Vitrine du Cabinet Rimbault — Transactions Immobilières"
        fill
        priority
        className="object-cover object-[center_35%]"
        sizes="100vw"
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
      "Un interlocuteur dédié vous accompagne à chaque étape de votre projet : estimation, recherche, visites, négociation et signature.",
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
      "Agence indépendante, nous vous garantissons un conseil objectif et des décisions rapides.",
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
    <section id="notre-histoire" className="bg-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[2fr_3fr]">
          <ScrollReveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
                Notre histoire
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                Depuis {AGENT.stats.years}&nbsp;ans,
                <br />à vos côtés
              </h2>

              <p className="mt-8 text-[15px] leading-[1.7] text-body">
                Le Cabinet Rimbault, agence immobilière indépendante, installée
                à {AGENT.address.city} depuis{" "}
                {new Date().getFullYear() - AGENT.stats.years}, accompagne
                particuliers et professionnels dans tous leurs projets
                immobiliers.
              </p>
              <p className="mt-5 text-[15px] leading-[1.7] text-body">
                Notre approche repose sur une conviction simple&nbsp;: chaque
                projet est unique. De ce fait, nous vous offrons un
                accompagnement sur mesure, fondé sur l&apos;écoute, la
                transparence et la réactivité.
              </p>
            </div>
          </ScrollReveal>

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

const STATS = [
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
    label: "biens vendus ou loués par an",
  },
  {
    target: AGENT.stats.rating,
    suffix: "/5",
    decimals: 1,
    label: `sur Google (${AGENT.stats.reviewsCount} avis)`,
  },
  {
    target: AGENT.stats.mandateSuccessRate,
    suffix: "%",
    decimals: 0,
    label: "de nos clients nous recommandent",
  },
] as const;

function ChiffresSection() {
  return (
    <section className="border-t border-default bg-page">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
              En quelques chiffres
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-primary md:text-4xl">
              Nos chiffres
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <ScrollReveal
              key={stat.label}
              delay={i * 0.15}
              className={`flex flex-col items-center justify-center px-4 py-8 text-center ${
                i < STATS.length - 1 ? "md:border-r md:border-default" : ""
              } ${i < 2 ? "border-b border-default md:border-b-0" : ""}`}
            >
              <span className="font-serif text-4xl font-semibold tracking-tight text-primary md:text-5xl lg:text-display">
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
    <section className="border-t border-default bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            Transparence
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Nos honoraires
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-body">
            Pas de mauvaise surprise. Voici exactement ce que vous payez.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <h3 className="mb-4 font-serif text-xl font-semibold text-primary">
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
            <h3 className="mb-4 font-serif text-xl font-semibold text-primary">
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

/* ─── Nous trouver ─── */

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

function NousTrouverSection() {
  return (
    <section className="bg-neutral-700">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
            Rendez-nous visite
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-on-inverse md:text-4xl">
            Nous trouver
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-8">
            {CONTACT_ITEMS.map((item, i) => (
              <TextReveal key={item.label} delay={i * 0.08}>
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
            <TextReveal delay={0.4}>
              <div className="pt-2">
                <LinkButton href="/contact">
                  Prendre rendez-vous
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </LinkButton>
              </div>
            </TextReveal>
          </div>

          <ScrollReveal delay={0.15}>
            <div className="overflow-hidden rounded-sm">
              <Image
                src="/hero-agence.jpg"
                alt="Vitrine du Cabinet Rimbault"
                width={800}
                height={600}
                className="aspect-[4/3] w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <a
              href={AGENT.googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-on-inverse"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Voir sur Google Maps
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA final ─── */

function CTASection() {
  return (
    <section className="bg-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 text-center md:px-6 md:py-28">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
            Votre projet commence ici
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Parlons de votre projet
          </h2>
        </ScrollReveal>

        <TextReveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-body">
            Un premier échange sans engagement pour définir vos besoins.
          </p>
        </TextReveal>

        <TextReveal delay={0.25}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <LinkButton href="/estimation">Estimer mon bien</LinkButton>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-sm border border-default px-5 py-2.5 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-neutral-100"
            >
              Me contacter
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </TextReveal>

        <TextReveal delay={0.35}>
          <p className="mt-8 text-sm text-muted">
            Ou directement :{" "}
            <a
              href={`tel:${AGENT.phoneE164}`}
              className="font-medium text-primary underline underline-offset-4"
            >
              {AGENT.phoneDisplay}
            </a>
          </p>
        </TextReveal>
      </div>
    </section>
  );
}
