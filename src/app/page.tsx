import { ArrowRight, Mail, MapPin, Phone, Star } from "lucide-react";
import Link from "next/link";
import { QuickContactForm } from "@/components/forms/QuickContactForm";
import { HeroSearch } from "@/components/home/HeroSearch";
import {
  AutoPropertyCard,
  SoldPropertyCard,
} from "@/components/property/PropertyCard";
import { LinkButton } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { listRecentProperties } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { AGENT } from "@/lib/config/agent";
import { COMMUNES } from "@/lib/config/communes";
import { REVIEWS } from "@/lib/config/reviews";

export default async function Home() {
  const { recent, sold, errorMessage } = await loadHomeData();

  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <FeaturedSection properties={recent} error={errorMessage} />
      <AgentSection />
      <SectorsSection />
      <SoldSection properties={sold} />
      <SellerPathSection />
      <ReviewsSection />
      <QuickContactSection />
    </main>
  );
}

async function loadHomeData() {
  try {
    const res = await listRecentProperties(20);
    const all = res.data ?? [];
    const published = all.filter((p) => p.isPublished);
    const active = published.filter(
      (p) =>
        p.status === "DISPONIBLE" ||
        p.status === "SOUS_OFFRE" ||
        p.status === "SOUS_COMPROMIS",
    );
    const sold = published.filter(
      (p) => p.status === "VENDU" || p.status === "LOUE",
    );
    return {
      recent: active.slice(0, 6),
      sold: sold.slice(0, 4),
      errorMessage: undefined as string | undefined,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur inconnue lors du chargement.";
    return { recent: [], sold: [], errorMessage: message };
  }
}

function HeroSection() {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            Agence immobilière indépendante en Île-de-France
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-600 md:text-lg">
            {AGENT.fullName}, {AGENT.stats.years} ans d&apos;expérience,{" "}
            {AGENT.stats.communesCount} communes couvertes. Un interlocuteur
            unique, de l&apos;estimation à la signature.
          </p>
        </div>
        <div className="mt-8 max-w-3xl">
          <HeroSearch />
        </div>
        <div className="mt-4">
          <Link
            href="/estimation"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 underline underline-offset-4"
          >
            Estimer mon bien
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedSection({
  properties,
  error,
}: {
  properties: Property[];
  error?: string;
}) {
  return (
    <section className="border-b border-zinc-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <SectionHeader
          title="Sélection du moment"
          lede="Les biens récemment mis en ligne, à la vente et à la location."
        />
        <div className="mt-8">
          {error ? (
            <div className="rounded border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700">
              <p className="font-medium">
                Biens indisponibles pour l&apos;instant.
              </p>
              <p className="mt-1 text-zinc-600">{error}</p>
            </div>
          ) : properties.length === 0 ? (
            <p className="text-sm text-zinc-600">
              Aucun bien publié pour le moment.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => (
                <li key={p.id}>
                  <AutoPropertyCard property={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/acheter" variant="secondary">
            Voir tous les biens à vendre
          </LinkButton>
          <LinkButton href="/louer" variant="secondary">
            Voir tous les biens à louer
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

function AgentSection() {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50/50">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-[240px_1fr] md:px-6 md:py-16">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-200">
          <div className="flex h-full items-center justify-center text-zinc-400">
            Portrait
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Votre interlocuteur
          </p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {AGENT.fullName}
          </h2>
          <p className="text-sm text-zinc-600">{AGENT.title}</p>
          <p className="max-w-xl text-base text-zinc-700">
            J&apos;accompagne vendeurs, acheteurs et locataires sur un périmètre
            resserré que je connais de rue en rue. Mon métier : estimer juste,
            défendre votre intérêt, et vous faire gagner du temps.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span>
              <strong className="text-zinc-900">{AGENT.stats.years}</strong>{" "}
              <span className="text-zinc-600">ans d&apos;expérience</span>
            </span>
            <span>
              <strong className="text-zinc-900">
                {AGENT.stats.communesCount}
              </strong>{" "}
              <span className="text-zinc-600">communes couvertes</span>
            </span>
            <span>
              <strong className="text-zinc-900">
                {AGENT.stats.transactions}+
              </strong>{" "}
              <span className="text-zinc-600">transactions réalisées</span>
            </span>
          </div>
          <div>
            <LinkButton href="/a-propos" variant="secondary" size="sm">
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
    <section className="border-b border-zinc-200">
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
                className="flex items-center justify-between rounded border border-zinc-200 bg-white px-3 py-3 text-sm font-medium text-zinc-800 hover:border-zinc-900"
              >
                <span className="flex items-center gap-2">
                  <MapPin
                    className="h-4 w-4 text-zinc-400"
                    aria-hidden="true"
                  />
                  {c.name}
                </span>
                <ArrowRight
                  className="h-4 w-4 text-zinc-400"
                  aria-hidden="true"
                />
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
    <section className="border-b border-zinc-200 bg-zinc-50/50">
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
    <section className="border-b border-zinc-200 bg-zinc-900 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Vous envisagez de vendre ?
          </h2>
          <p className="mt-3 text-zinc-300">
            Estimation gratuite, analyse sérieuse du marché local,
            accompagnement de bout en bout. Réponse personnalisée sous 24 à 48
            h.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/estimation"
              className="inline-flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
            >
              Estimer mon bien
            </Link>
            <Link
              href="/vendre"
              className="inline-flex items-center gap-2 rounded border border-zinc-700 px-4 py-2 text-sm font-medium text-white hover:border-white"
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
    <section className="border-b border-zinc-200">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <SectionHeader
          title="Ce que disent mes clients"
          lede={
            <span className="inline-flex items-center gap-1.5">
              <Rating value={avg} />
              <span className="text-sm font-medium text-zinc-900">
                {avg.toFixed(1)} / 5
              </span>
              <span className="text-sm text-zinc-600">
                sur Google — {REVIEWS.length} avis
              </span>
            </span>
          }
        />
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {selected.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-3 rounded border border-zinc-200 bg-white p-5"
            >
              <Rating value={r.rating} />
              <p className="text-sm italic text-zinc-700">« {r.excerpt} »</p>
              <p className="text-xs text-zinc-500">
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
          <div className="flex flex-col justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            <Phone className="h-6 w-6 text-zinc-500" aria-hidden="true" />
            <a
              href={`tel:${AGENT.phoneE164}`}
              className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 underline-offset-4 hover:underline"
            >
              {AGENT.phoneDisplay}
            </a>
            <p className="mt-1 text-sm text-zinc-600">
              Du lundi au samedi — réponse rapide.
            </p>
            <a
              href={`mailto:${AGENT.email}`}
              className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-700 underline underline-offset-4"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> {AGENT.email}
            </a>
          </div>
          <div>
            <QuickContactForm />
            <p className="mt-4 text-sm text-zinc-600">
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
