import { ArrowRight, Mail, MapPin, Phone, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LinkButton } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatBlock } from "@/components/ui/StatPill";
import { AGENT, AGENT_BIO_PARAGRAPHS } from "@/lib/config/agent";
import { COMMUNES, COMMUNES_COMMENT } from "@/lib/config/communes";
import { REVIEWS } from "@/lib/config/reviews";

export const metadata: Metadata = {
  title: `${AGENT.fullName} — Agent immobilier indépendant`,
  description: `${AGENT.fullName}, agent immobilier indépendant en Île-de-France. Parcours, approche, secteurs d'intervention et avis clients.`,
};

export default function AProposPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <Breadcrumb
            items={[{ label: "Accueil", href: "/" }, { label: "L'agence" }]}
          />
          <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr]">
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-zinc-200">
              <div className="flex h-full items-center justify-center text-zinc-400">
                Portrait
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                {AGENT.fullName}
              </h1>
              <p className="text-lg text-zinc-700">
                Votre agent immobilier indépendant en Île-de-France.
              </p>
              <p className="max-w-xl text-base text-zinc-600">
                Implanté depuis {AGENT.stats.years} ans sur{" "}
                {AGENT.stats.communesCount} communes. J&apos;accompagne
                vendeurs, acheteurs et locataires avec la même exigence.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <a
                  href={`tel:${AGENT.phoneE164}`}
                  className="inline-flex items-center gap-2 rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" /> Appeler
                </a>
                <a
                  href={`mailto:${AGENT.email}`}
                  className="inline-flex items-center gap-2 rounded border border-zinc-300 px-4 py-2 text-sm font-medium"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader title="Mon parcours, mon approche" />
          <div className="mt-6 max-w-3xl space-y-4 text-base text-zinc-800">
            {AGENT_BIO_PARAGRAPHS.map((p) => (
              <p key={p.slice(0, 30)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader title="En quelques chiffres" />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatBlock
              value={`${AGENT.stats.years}`}
              label="années d'expérience"
            />
            <StatBlock
              value={`${AGENT.stats.communesCount}`}
              label="communes couvertes"
            />
            <StatBlock
              value={`${AGENT.stats.transactions}+`}
              label="transactions réalisées"
            />
            <StatBlock
              value={
                AGENT.stats.reviewsCount > 0
                  ? `${AGENT.stats.rating.toFixed(1)}/5`
                  : "—"
              }
              label={
                AGENT.stats.reviewsCount > 0
                  ? `sur ${AGENT.stats.reviewsCount} avis Google`
                  : "avis Google (à venir)"
              }
            />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200" id="secteurs">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader
            title="Les communes où j'interviens"
            lede="Un périmètre resserré pour rester réellement pertinent sur chaque marché."
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
          <p className="mt-6 max-w-3xl text-sm text-zinc-700 md:text-base">
            {COMMUNES_COMMENT}
          </p>
        </div>
      </section>

      {REVIEWS.length >= 6 && (
        <section className="border-b border-zinc-200 bg-zinc-50/50" id="avis">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
            <SectionHeader title="Ce que disent mes clients" />
            <div className="mt-4 inline-flex items-center gap-2 rounded border border-zinc-200 bg-white px-4 py-2 text-sm">
              <Rating
                value={
                  REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
                }
              />
              <span className="font-medium text-zinc-900">
                {(
                  REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
                ).toFixed(1)}{" "}
                / 5
              </span>
              <span className="text-zinc-600">
                — {REVIEWS.length} avis Google
              </span>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {REVIEWS.slice(0, 10).map((r) => (
                <li
                  key={r.id}
                  className="rounded border border-zinc-200 bg-white p-5"
                >
                  <Rating value={r.rating} />
                  <p className="mt-3 text-sm text-zinc-800">« {r.excerpt} »</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    — {r.author}
                    {r.commune ? `, ${r.commune}` : ""}
                    {r.transaction
                      ? ` · ${r.transaction.toLowerCase()} en ${r.date}`
                      : ` · ${r.date}`}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6">
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
      )}

      <section className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader title="Mon engagement professionnel" />
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded border border-zinc-200 bg-white p-5">
              <p className="text-sm font-semibold text-zinc-900">
                Carte professionnelle
              </p>
              <p className="mt-2 text-sm text-zinc-700">{AGENT.legal.carteT}</p>
              <p className="text-sm text-zinc-700">
                Délivrée par la {AGENT.legal.cci}
              </p>
            </div>
            <div className="rounded border border-zinc-200 bg-white p-5">
              <p className="text-sm font-semibold text-zinc-900">
                Garant financier
              </p>
              <p className="mt-2 text-sm text-zinc-700">{AGENT.legal.garant}</p>
            </div>
            <div className="rounded border border-zinc-200 bg-white p-5">
              <p className="text-sm font-semibold text-zinc-900">
                Médiateur consommation
              </p>
              <p className="mt-2 text-sm text-zinc-700">
                {AGENT.legal.mediator}
              </p>
            </div>
            <div className="rounded border border-zinc-200 bg-white p-5">
              <p className="text-sm font-semibold text-zinc-900">
                Forme juridique
              </p>
              <p className="mt-2 text-sm text-zinc-700">{AGENT.legal.rcs}</p>
              <p className="text-sm text-zinc-700">{AGENT.legal.siret}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/mentions-legales" variant="secondary" size="sm">
              Mentions légales complètes
            </LinkButton>
            <LinkButton href="/honoraires" variant="secondary" size="sm">
              Barème honoraires
            </LinkButton>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center md:px-6 md:py-16">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Parlons de votre projet
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-zinc-600">
            Un premier échange sans engagement pour cerner votre besoin.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton href="/estimation">Estimer mon bien</LinkButton>
            <LinkButton href="/contact" variant="secondary">
              Me contacter
            </LinkButton>
          </div>
          <p className="mt-6 text-sm text-zinc-600">
            Ou directement :{" "}
            <a
              href={`tel:${AGENT.phoneE164}`}
              className="font-medium text-zinc-900 underline underline-offset-4"
            >
              {AGENT.phoneDisplay}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
