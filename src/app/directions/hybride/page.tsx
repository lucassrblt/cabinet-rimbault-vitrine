import { Star } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { CREDITS, homeData, PHOTOS } from "@/components/directions/data";
import { Bouton, BoutonAppel, LienAppuye } from "@/components/site/Action";
import { ListeBiens } from "@/components/site/Listing";
import { OpeningNote } from "@/components/site/OpeningNote";
import { SearchRequest } from "@/components/site/SearchRequest";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { agency } from "@/lib/agency";

export const metadata = { title: "Direction hybride" };

/**
 * Direction hybride : « le serif parle, le rond agit ». Le serif pour ce que
 * dit l'agence (titres, biens, prix, adresse, avis), la sans et la pilule pour
 * tout ce qui se touche. Un seul petit arrondi, aucune ombre, aucune carte
 * flottante : le texte se pose à côté des photos.
 */
const SYSTEME = {
  "--radius-photo": "6px",
  "--radius-carte": "6px",
} as React.CSSProperties;

const METHODE = [
  [
    "Nous refusons les estimations gonflées.",
    "Un prix trop haut fait perdre des mois et décote le bien. Si nous n’y croyons pas, nous le disons.",
  ],
  [
    "Un seul interlocuteur, jusqu’au notaire.",
    "La personne qui estime votre bien le fait visiter, le négocie et vous suit jusqu’à la signature.",
  ],
  [
    "Asnières et ses voisines, rue par rue.",
    "Au-delà de notre secteur, nous préférons vous adresser à quelqu’un dont c’est le terrain.",
  ],
];

export default async function Hybride() {
  const d = await homeData();

  return (
    <div style={SYSTEME}>
      <SiteHeader base="/maquettes" />

      <main>
        {/* Ouverture : le texte à gauche, la photo déborde à droite. */}
        <section className="md:grid md:grid-cols-12 md:items-center md:gap-10 md:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
          <div
            className="conteneur py-12 md:col-span-5 md:px-0 md:py-20"
            data-reveal="monte"
          >
            <h1 className="titre text-[2.5rem] leading-[1.05] tracking-[-0.015em] md:text-page">
              Agence immobilière à Asnières-sur-Seine, depuis&nbsp;
              {agency.since}.
            </h1>
            <p className="mt-6 max-w-[42ch] text-gris">
              Une agence indépendante au 117 boulevard Voltaire. Peu de biens à
              la fois, suivis par la même personne jusqu’à la signature.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Bouton href="/maquettes/biens">Voir nos biens</Bouton>
              <LienAppuye href={agency.phone.href}>Appeler</LienAppuye>
            </div>
            <a
              href={d.reviewsUrl}
              className="mt-8 inline-flex items-center gap-2 text-mention text-gris hover:text-encre"
            >
              <Star size={14} className="fill-current text-encre" aria-hidden />
              {d.rating} sur 5, {d.count} avis Google
            </a>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-pierre md:col-span-7 md:aspect-auto md:h-[min(40rem,78vh)] md:rounded-l-photo">
            <Image
              src={PHOTOS.quartier}
              alt="Les quais de Seine à Asnières"
              fill
              preload
              sizes="(min-width: 768px) 58vw, 100vw"
              className="anim-ouverture-photo object-cover"
            />
          </div>
        </section>

        {/* Les biens : la liste alternée de la page Nos biens, trois récents. */}
        <section className="conteneur mt-24 md:mt-32">
          <div
            className="flex items-baseline justify-between gap-4"
            data-reveal="monte"
          >
            <h2 className="titre text-section">En vente</h2>
            <LienAppuye href="/maquettes/biens">
              Voir les {d.properties.length} biens
            </LienAppuye>
          </div>
          <div className="mt-12">
            <ListeBiens items={d.recent} />
          </div>
        </section>

        {/* Avis : trois citations en serif, séparées par des filets. */}
        {d.reviews.length > 0 && (
          <section className="conteneur mt-28 md:mt-36">
            <div
              className="flex flex-wrap items-baseline justify-between gap-4"
              data-reveal="monte"
            >
              <h2 className="titre text-section">
                {d.rating} sur 5, {d.count} avis
              </h2>
              <LienAppuye href={d.reviewsUrl}>Lire tous les avis</LienAppuye>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-10">
              {d.reviews.slice(0, 3).map((r) => (
                <figure
                  key={r.id}
                  className="border-t border-encre pt-5"
                  data-reveal="monte"
                >
                  <blockquote className="titre line-clamp-6 text-[1.1875rem] leading-[1.45]">
                    « {r.text} »
                  </blockquote>
                  <figcaption className="mt-4 text-mention text-gris">
                    {r.authorName}, {r.relativeTime}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Méthode : le titre à gauche, trois engagements à droite. */}
        <section className="conteneur mt-28 md:mt-36 md:grid md:grid-cols-12 md:gap-10">
          <h2 className="titre text-section md:col-span-4" data-reveal="monte">
            Notre façon de travailler
          </h2>
          <div className="mt-8 md:col-span-8 md:mt-0">
            {METHODE.map(([t, x]) => (
              <div
                key={t}
                className="grid gap-2 border-t border-filet py-6 md:grid-cols-2 md:gap-10"
                data-reveal="monte"
              >
                <h3 className="titre text-intertitre">{t}</h3>
                <p className="text-gris">{x}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nous trouver : la devanture déborde à gauche, le texte se pose à côté. */}
        <section className="mt-28 md:mt-36 md:grid md:grid-cols-12 md:items-center md:gap-10 md:pr-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
          <div
            className="relative aspect-[4/3] overflow-hidden bg-pierre md:col-span-7 md:rounded-r-photo"
            data-reveal="decouvre"
          >
            <Image
              src={PHOTOS.devanture}
              alt="La devanture de l’agence"
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          <div
            className="conteneur pt-8 md:col-span-5 md:px-0 md:pt-0"
            data-reveal="monte"
          >
            <h2 className="titre text-section leading-tight">
              {agency.address.street}
              <br />
              {agency.address.postalCode} {agency.address.city}
            </h2>
            <dl className="mt-6 text-mention">
              {agency.hours.map((h) => (
                <div
                  key={h.days}
                  className="flex justify-between border-b border-filet py-2"
                >
                  <dt className="text-gris">{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
            <OpeningNote className="mt-3" />
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <BoutonAppel />
              <LienAppuye href={agency.mapsDirections}>Itinéraire</LienAppuye>
            </div>
          </div>
        </section>

        <div className="conteneur mt-28 pb-24 md:mt-36 md:pb-32">
          <SearchRequest />
          <p className="mt-10 text-[0.75rem] text-gris">{CREDITS}</p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
