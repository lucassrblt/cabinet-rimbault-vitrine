import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AgenceHeroContent } from "@/components/a-propos/AgenceHeroContent";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { LinkButton } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AGENT, AGENT_BIO_PARAGRAPHS } from "@/lib/config/agent";
import { RENT_TIERS, SALE_TIERS } from "@/lib/config/honoraires";

export const metadata: Metadata = {
  title: "L'agence — Cabinet Rimbault",
  description: `${AGENT.fullName}, agent immobilier indépendant à ${AGENT.address.city}. Notre histoire, nos chiffres, nos honoraires.`,
};

export default function AProposPage() {
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
    <section className="relative bg-neutral-800">
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-800/40 to-neutral-700/20" />
      <AgenceHeroContent
        agencyName="Cabinet Rimbault"
        tagline={`Un cabinet du quartier,\npour le quartier.`}
        subtitle={`Agent immobilier indépendant à ${AGENT.address.city} depuis ${new Date().getFullYear() - AGENT.stats.years}.`}
      />
    </section>
  );
}

/* ─── Notre histoire ─── */

const BIO_COLUMNS: string[][] = [
  AGENT_BIO_PARAGRAPHS.slice(0, 2),
  AGENT_BIO_PARAGRAPHS.slice(2, 4),
  AGENT_BIO_PARAGRAPHS.slice(4),
];

function HistoireSection() {
  return (
    <section className="bg-neutral-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <ScrollReveal>
          <SectionHeader title="Notre histoire" />
        </ScrollReveal>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {BIO_COLUMNS.map((paragraphs, i) => (
            <ScrollReveal key={paragraphs[0].slice(0, 20)} delay={i * 0.1}>
              <div className="space-y-4 text-base leading-relaxed text-body">
                {paragraphs.map((p) => (
                  <p key={p.slice(0, 30)}>{p}</p>
                ))}
              </div>
            </ScrollReveal>
          ))}
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
    label: "d'expérience dans le quartier",
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
    target: AGENT.stats.mandateSuccessRate,
    suffix: "%",
    decimals: 0,
    label: "de mandats au prix annoncé",
  },
] as const;

function ChiffresSection() {
  return (
    <section className="border-y border-subtle">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <ScrollReveal>
          <SectionHeader title="Nos chiffres" align="center" />
        </ScrollReveal>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <ScrollReveal
              key={stat.label}
              delay={i * 0.15}
              className={`flex flex-col items-center justify-center px-4 py-6 text-center ${
                i < STATS.length - 1 ? "md:border-r md:border-subtle" : ""
              } ${i < 2 ? "border-b border-subtle md:border-b-0" : ""}`}
            >
              <span className="font-serif text-4xl font-semibold tracking-tight text-primary md:text-5xl">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </span>
              <span className="mt-2 text-sm text-muted">{stat.label}</span>
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
    <section className="bg-neutral-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <ScrollReveal>
          <SectionHeader
            title="Nos honoraires"
            lede="Pas de mauvaise surprise. Voici exactement ce que vous payez."
          />
        </ScrollReveal>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <h3 className="mb-3 text-lg font-semibold text-primary">
              Vente (TTC)
            </h3>
            <div className="overflow-hidden rounded-sm border border-subtle">
              <table className="w-full text-sm">
                <thead className="bg-page text-left text-body">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tranche de prix</th>
                    <th className="px-4 py-3 font-semibold">Honoraires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle">
                  {SALE_TIERS.map((t) => (
                    <tr key={t.range}>
                      <td className="px-4 py-3 text-primary">{t.range}</td>
                      <td className="px-4 py-3 font-medium text-primary">
                        {t.fee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <h3 className="mb-3 text-lg font-semibold text-primary">
              Location (TTC)
            </h3>
            <div className="overflow-hidden rounded-sm border border-subtle">
              <table className="w-full text-sm">
                <thead className="bg-page text-left text-body">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Prestation</th>
                    <th className="px-4 py-3 font-semibold">Plafond TTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle">
                  {RENT_TIERS.map((t) => (
                    <tr key={t.label}>
                      <td className="px-4 py-3 text-primary">{t.label}</td>
                      <td className="px-4 py-3 font-medium text-primary">
                        {t.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <p className="text-xs text-muted">
            * FAI = Frais d&apos;Agence Inclus. Barème applicable depuis le 1ᵉʳ
            janvier 2026.
          </p>
          <LinkButton href="/honoraires" variant="ghost" size="sm">
            Voir le barème détaillé
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

/* ─── Nous trouver ─── */

function NousTrouverSection() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <ScrollReveal>
          <SectionHeader title="Nous trouver" />
        </ScrollReveal>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <ul className="space-y-5 text-sm text-primary">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-muted"
                  aria-hidden="true"
                />
                <span>
                  {AGENT.address.line1}
                  <br />
                  {AGENT.address.postalCode} {AGENT.address.city}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 h-5 w-5 shrink-0 text-muted"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${AGENT.phoneE164}`}
                  className="underline underline-offset-4 hover:text-primary-600"
                >
                  {AGENT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 h-5 w-5 shrink-0 text-muted"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${AGENT.email}`}
                  className="underline underline-offset-4 hover:text-primary-600"
                >
                  {AGENT.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock
                  className="mt-0.5 h-5 w-5 shrink-0 text-muted"
                  aria-hidden="true"
                />
                <span>
                  {AGENT.hours.weekdays}
                  <br />
                  {AGENT.hours.saturday}
                </span>
              </li>
            </ul>
            <div className="mt-8">
              <LinkButton href="/contact">Prendre rendez-vous</LinkButton>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col gap-4">
              <div className="flex aspect-[4/3] items-center justify-center rounded-sm bg-neutral-200 text-sm text-muted">
                Photo vitrine
              </div>
              <a
                href={AGENT.googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex aspect-[4/3] items-center justify-center rounded-sm border border-subtle bg-neutral-100 text-sm text-muted transition-colors hover:border-strong"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Ouvrir dans Google Maps
                </span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA final ─── */

function CTASection() {
  return (
    <section className="border-t border-subtle bg-neutral-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center md:px-6 md:py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Parlons de votre projet
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-body">
          Un premier échange sans engagement pour cerner votre besoin.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton href="/estimation">Estimer mon bien</LinkButton>
          <LinkButton href="/contact" variant="secondary">
            Me contacter
          </LinkButton>
        </div>
        <p className="mt-6 text-sm text-body">
          Ou directement :{" "}
          <a
            href={`tel:${AGENT.phoneE164}`}
            className="font-medium text-primary underline underline-offset-4"
          >
            {AGENT.phoneDisplay}
          </a>
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted">
          <Link href="/honoraires" className="underline underline-offset-4">
            Barème honoraires
          </Link>
          <Link
            href="/mentions-legales"
            className="underline underline-offset-4"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </section>
  );
}
