import { ArrowRight, Mail, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QuickContactForm } from "@/components/forms/QuickContactForm";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { HeroContent } from "@/components/home/HeroContent";
import { HeroSearch } from "@/components/home/HeroSearch";
import { SoldPropertyCard } from "@/components/property/PropertyCard";
import { LinkButton } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { listRecentProperties, searchProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { AGENT } from "@/lib/config/agent";
import { COMMUNES } from "@/lib/config/communes";
import { REVIEWS } from "@/lib/config/reviews";

export default async function Home() {
  const [sold, featured] = await Promise.all([
    loadSoldProperties(),
    loadFeaturedProperties(),
  ]);

  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <FeaturedSection properties={featured} />
      <AgentSection />
      <SectorsSection />
      <SoldSection properties={sold} />
      <SellerPathSection />
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

async function loadSoldProperties(): Promise<Property[]> {
  try {
    const res = await searchProperties({
      status: ["VENDU", "LOUE"],
      limit: 4,
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

function HeroSection() {
  return (
    <section className="relative bg-header pb-12 md:pb-14">
      {/* Hero image area */}
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

      {/* Search bar — flottante, 50% sur l'image / 50% en dehors */}
      <div className="relative z-20 mx-auto -mt-14 w-full max-w-5xl px-4 md:-mt-16 md:px-8">
        <HeroSearch />
      </div>
    </section>
  );
}

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

function AgentSection() {
  return (
    <section className="border-b border-subtle bg-neutral-50/50">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-[240px_1fr] md:px-6 md:py-16">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-neutral-200">
          <div className="flex h-full items-center justify-center text-muted">
            Portrait
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Votre interlocuteur
          </p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {AGENT.fullName}
          </h2>
          <p className="text-sm text-body">{AGENT.title}</p>
          <p className="max-w-xl text-base text-body">
            J&apos;accompagne vendeurs, acheteurs et locataires sur un périmètre
            resserré que je connais de rue en rue. Mon métier : estimer juste,
            défendre votre intérêt, et vous faire gagner du temps.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span>
              <strong className="text-primary">{AGENT.stats.years}</strong>{" "}
              <span className="text-body">ans d&apos;expérience</span>
            </span>
            <span>
              <strong className="text-primary">
                {AGENT.stats.communesCount}
              </strong>{" "}
              <span className="text-body">communes couvertes</span>
            </span>
            <span>
              <strong className="text-primary">
                {AGENT.stats.transactions}+
              </strong>{" "}
              <span className="text-body">transactions réalisées</span>
            </span>
          </div>
          <div>
            <LinkButton href="/agence" variant="secondary" size="sm">
              En savoir plus sur l&apos;agence
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectorsSection() {
  return (
    <section className="border-b border-subtle">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <SectionHeader
          title="Les communes où j'interviens"
          lede="Un périmètre choisi pour rester pertinent sur chaque marché local."
        />
        <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {COMMUNES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/acheter?commune=${c.slug}`}
                className="flex items-center justify-between rounded-sm border border-subtle bg-card px-3 py-3 text-sm font-medium text-primary hover:border-strong"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted" aria-hidden="true" />
                  {c.name}
                </span>
                <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SoldSection({ properties }: { properties: Property[] }) {
  if (properties.length < 4) return null;
  return (
    <section className="border-b border-subtle bg-neutral-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <SectionHeader
          title="Mes dernières transactions"
          lede="Preuve de compétence locale — sans prix affiché, confidentialité oblige."
        />
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((p) => (
            <li key={p.id}>
              <SoldPropertyCard property={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SellerPathSection() {
  return (
    <section className="border-b border-subtle bg-inverse text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Vous envisagez de vendre ?
          </h2>
          <p className="mt-3 text-subtle">
            Estimation gratuite, analyse sérieuse du marché local,
            accompagnement de bout en bout. Réponse personnalisée sous 24 à 48
            h.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/estimation"
              className="inline-flex items-center gap-2 rounded-sm bg-card px-4 py-2 text-sm font-medium text-primary hover:bg-section"
            >
              Estimer mon bien
            </Link>
            <Link
              href="/vendre"
              className="inline-flex items-center gap-2 rounded-sm border border-neutral-700 px-4 py-2 text-sm font-medium text-white hover:border-white"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  if (REVIEWS.length < 5) return null;
  const selected = REVIEWS.slice(0, 3);
  const avg = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length || 0;

  return (
    <section className="border-b border-subtle">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <SectionHeader
          title="Ce que disent mes clients"
          lede={
            <span className="inline-flex items-center gap-1.5">
              <Rating value={avg} />
              <span className="text-sm font-medium text-primary">
                {avg.toFixed(1)} / 5
              </span>
              <span className="text-sm text-body">
                sur Google — {REVIEWS.length} avis
              </span>
            </span>
          }
        />
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {selected.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-3 rounded-sm border border-subtle bg-card p-5"
            >
              <Rating value={r.rating} />
              <p className="text-sm italic text-body">« {r.excerpt} »</p>
              <p className="text-xs text-muted">
                — {r.author}
                {r.commune && `, ${r.commune}`} · {r.date}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-8">
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
      </div>
    </section>
  );
}

function QuickContactSection() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <SectionHeader
          title="Discutons de votre projet"
          lede="Un coup de fil ou un message — je vous réponds sous 24 h ouvrées."
        />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[320px_1fr]">
          <div className="flex flex-col justify-center rounded-sm border border-subtle bg-page p-6">
            <Phone className="h-6 w-6 text-muted" aria-hidden="true" />
            <a
              href={`tel:${AGENT.phoneE164}`}
              className="mt-3 text-2xl font-semibold tracking-tight text-primary underline-offset-4 hover:underline"
            >
              {AGENT.phoneDisplay}
            </a>
            <p className="mt-1 text-sm text-body">
              Du lundi au samedi — réponse rapide.
            </p>
            <a
              href={`mailto:${AGENT.email}`}
              className="mt-3 inline-flex items-center gap-2 text-sm text-body underline underline-offset-4"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> {AGENT.email}
            </a>
          </div>
          <div>
            <QuickContactForm />
            <p className="mt-4 text-sm text-body">
              <Link href="/contact" className="underline underline-offset-4">
                Coordonnées complètes &amp; horaires
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
