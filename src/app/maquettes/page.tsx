import { Star } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { Bouton, BoutonAppel, LienAppuye } from "@/components/site/Action";
import { PropertyCard } from "@/components/site/PropertyCard";
import { ReviewCard } from "@/components/site/ReviewCard";
import { agency } from "@/lib/agency";
import { getProperties } from "@/lib/api/properties";
import { getGoogleReviews } from "@/lib/reviews/google";

// Photos provisoires sous licence libre, en attendant le reportage
// (cf. docs/brief.md §5). Les crédits sont obligatoires.
const OUVERTURE = {
  src: "/maquettes/ouverture-quai-dervaux.jpg",
  credit:
    "Photo provisoire : quai du Docteur-Dervaux, Arseni Mourzenko, CC BY 2.0",
};
const QUARTIER = {
  src: "/maquettes/mairie-asnieres.jpg",
  credit: "Photo provisoire : mairie d’Asnières, Brumathechec, CC BY-SA 4.0",
};

const ratingFormat = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
});

export default async function AccueilMaquette() {
  const [properties, reviews] = await Promise.all([
    getProperties(),
    getGoogleReviews(),
  ]);
  const recent = [...properties]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);
  const rating = reviews
    ? ratingFormat.format(reviews.rating)
    : agency.google.rating;
  const count = reviews?.totalCount ?? agency.google.count;
  const reviewsUrl = reviews?.sourceUrl || agency.google.href;
  const [first, second, third] = recent;
  const href = (ref: string) => `/maquettes/biens/${ref}`;

  return (
    <main>
      {/* Ouverture : photo maîtrisée, chevauchée par la carte d'identité. */}
      <section className="md:grid md:grid-cols-12">
        <div className="relative aspect-[4/3] overflow-hidden bg-pierre md:col-span-9 md:col-start-1 md:row-start-1 md:aspect-auto md:h-[min(32rem,62vh)] md:rounded-r-photo">
          <Image
            src={OUVERTURE.src}
            alt="Les quais de Seine à Asnières"
            fill
            preload
            sizes="(min-width: 768px) 75vw, 100vw"
            className="anim-ouverture-photo object-cover"
          />
        </div>
        <div className="carte-chevauchante anim-ouverture-carte relative mx-4 -mt-16 bg-blanc p-6 md:col-span-5 md:col-start-8 md:row-start-1 md:mx-0 md:mt-10 md:mr-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] md:self-start md:p-9">
          <h1 className="titre text-[1.75rem] leading-tight xl:text-section">
            Agence immobilière à{" "}
            <span className="whitespace-nowrap">Asnières-sur-Seine</span>,
            depuis {agency.since}.
          </h1>
          <a
            href={reviewsUrl}
            className="mt-4 inline-flex items-center gap-1.5 text-mention text-gris hover:text-encre"
          >
            <Star size={14} className="fill-current text-encre" aria-hidden />
            {rating} sur 5, {count} avis Google
          </a>
          <div className="mt-7 flex flex-wrap gap-3">
            <Bouton href="/maquettes/biens">Voir nos biens</Bouton>
            <LienAppuye href={agency.phone.href} className="self-center">
              Appeler
            </LienAppuye>
          </div>
        </div>
      </section>

      {/* Biens : trois récents, en tailles décalées. */}
      <section id="biens" className="conteneur mt-14 scroll-mt-32 md:mt-16">
        <div
          className="flex items-baseline justify-between gap-4"
          data-reveal="monte"
        >
          <h2 className="titre text-section">En vente</h2>
          <LienAppuye href="/maquettes/biens">
            Voir les {properties.length} biens
          </LienAppuye>
        </div>
        <div className="grille-decalee mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-12 md:gap-x-10">
          {first && (
            <PropertyCard
              property={first}
              href={href(first.reference)}
              preload
              ratio="aspect-[4/3] md:aspect-[4/5]"
              sizes="(min-width: 768px) 40vw, 100vw"
              className="col-span-2 md:col-span-6"
              revealDelay={0}
            />
          )}
          {second && (
            <PropertyCard
              property={second}
              href={href(second.reference)}
              ratio="aspect-[4/5] md:aspect-[4/3]"
              sizes="(min-width: 768px) 34vw, 50vw"
              className="md:col-span-5 md:col-start-8 md:mt-28"
              revealDelay={140}
            />
          )}
          {third && (
            <PropertyCard
              property={third}
              href={href(third.reference)}
              ratio="aspect-[4/5] md:aspect-[4/3]"
              sizes="(min-width: 768px) 28vw, 50vw"
              className="mt-12 md:col-span-4 md:col-start-7 md:-mt-56"
              revealDelay={280}
            />
          )}
        </div>
      </section>

      {/* Avis : la note à gauche, le bandeau déborde à droite. */}
      {reviews && reviews.reviews.length > 0 && (
        <section className="mt-24 md:mt-36" aria-labelledby="avis">
          <div className="md:grid md:grid-cols-12 md:items-start md:gap-10 md:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
            <div
              className="px-4 md:col-span-3 md:px-0 md:pt-10"
              data-reveal="monte"
            >
              <h2 id="avis" className="sr-only">
                Avis clients
              </h2>
              <p className="note-geante titre text-[4.5rem] leading-none md:text-[5.5rem]">
                {rating}
              </p>
              <p className="mt-2 text-gris">sur 5, {count} avis Google</p>
              <a href={reviewsUrl} className="lien mt-4 inline-block">
                Lire tous les avis
              </a>
            </div>
            <div
              data-reveal="glisse"
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
              className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto bg-pierre px-4 py-8 [scrollbar-width:none] md:col-span-9 md:mt-0 md:rounded-l-carte md:px-8 md:py-10"
            >
              {reviews.reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Méthode : trois lignes en escalier, une photo d'intérieur qui déborde. */}
      <section
        id="agence"
        className="mt-24 scroll-mt-32 md:mt-36 md:grid md:grid-cols-12 md:items-center md:gap-10"
      >
        <div className="px-4 md:col-span-7 md:col-start-2 md:px-0">
          <ul className="escalier titre space-y-5 text-[1.375rem] leading-snug md:text-[1.75rem]">
            <li data-reveal="monte">Nous refusons les estimations gonflées.</li>
            <li
              className="md:pl-12"
              data-reveal="monte"
              style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            >
              Un seul interlocuteur, jusqu’au notaire.
            </li>
            <li
              className="md:pl-24"
              data-reveal="monte"
              style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
            >
              Asnières et ses voisines, rue par rue.
            </li>
          </ul>
          <LienAppuye href="/maquettes/agence" className="mt-8">
            Notre façon de travailler
          </LienAppuye>
        </div>
        <div
          data-reveal="decouvre"
          className="relative mt-10 ml-16 aspect-[3/4] overflow-hidden rounded-l-photo bg-pierre md:col-span-4 md:col-start-9 md:mt-0 md:ml-0"
        >
          <Image
            src={QUARTIER.src}
            alt="La mairie d’Asnières-sur-Seine"
            fill
            sizes="(min-width: 768px) 33vw, 80vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Nous trouver : la devanture déborde à gauche, la carte adresse chevauche. */}
      <section
        id="contact"
        className="mt-28 scroll-mt-32 pb-28 md:mt-44 md:grid md:grid-cols-12 md:pb-36"
      >
        <div
          data-reveal="decouvre"
          className="relative aspect-[4/3] overflow-hidden bg-pierre md:col-span-7 md:col-start-1 md:row-start-1 md:aspect-[16/11] md:rounded-r-photo"
        >
          <Image
            src="/maquettes/devanture-provisoire.jpg"
            alt="La devanture de l’agence, boulevard Voltaire"
            fill
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover"
          />
        </div>
        <div
          data-reveal="monte"
          style={{ "--reveal-delay": "260ms" } as React.CSSProperties}
          className="carte-chevauchante relative mx-4 -mt-12 bg-blanc p-6 md:col-span-4 md:col-start-7 md:row-start-1 md:mx-0 md:mb-12 md:self-end md:p-9"
        >
          <p className="titre text-intertitre">{agency.address.street}</p>
          <p className="titre text-intertitre">
            {agency.address.postalCode} {agency.address.city}
          </p>
          <dl className="mt-5 space-y-1 text-mention text-gris">
            {agency.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-6">
                <dt>{h.days}</dt>
                <dd className="tabular-nums">{h.time}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <BoutonAppel />
            <LienAppuye href={agency.mapsDirections} className="self-center">
              Itinéraire
            </LienAppuye>
          </div>
        </div>
      </section>

      <p className="conteneur pb-6 text-[0.75rem] text-gris">
        {OUVERTURE.credit}. {QUARTIER.credit}.
      </p>
    </main>
  );
}
