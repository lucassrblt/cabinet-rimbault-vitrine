import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { CREDITS, homeData, PHOTOS } from "@/components/directions/data";
import { OpeningNote } from "@/components/site/OpeningNote";
import { agency } from "@/lib/agency";
import {
  mainImage,
  priceLabel,
  propertyFloor,
  propertyPlace,
  propertySurface,
  propertyTitle,
} from "@/lib/property";

export const metadata = { title: "Direction éditoriale" };

/**
 * Direction éditoriale : un magazine d'architecture. Tout le contenu en
 * serif, des filets pour structurer, ni arrondi ni ombre. Les actions
 * restent des liens soulignés ; un seul bouton plein par écran.
 */

function Lien({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 border-b border-encre pb-1 font-sans text-[0.875rem] tracking-wide"
    >
      {children}
      <ArrowRight
        size={15}
        className="transition-transform group-hover:translate-x-1"
        aria-hidden
      />
    </Link>
  );
}

function Rubrique({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 border-t border-encre pt-3">
      <h2 className="titre text-[1.0625rem] italic">{children}</h2>
    </div>
  );
}

export default async function Editoriale() {
  const d = await homeData();
  const [quote] = d.reviews;

  return (
    <div className="bg-blanc font-serif">
      {/* En-tête : le nom en serif centré, la navigation dessous. */}
      <header className="conteneur pt-8 pb-5 text-center">
        <Link
          href="/directions/editoriale"
          className="titre text-[2rem] leading-none tracking-[-0.01em] md:text-[2.5rem]"
        >
          Cabinet Rimbault
        </Link>
        <p className="mt-2 text-[0.9375rem] italic text-gris">
          Agence immobilière, Asnières-sur-Seine, depuis {agency.since}
        </p>
        <nav className="mt-6 flex items-center justify-center gap-7 border-y border-filet py-3 font-sans text-[0.8125rem] tracking-[0.06em]">
          <Link href="/maquettes/biens">Nos biens</Link>
          <Link href="/maquettes/agence">L’agence</Link>
          <Link href="/maquettes/contact">Contact</Link>
          <a href={agency.phone.href} className="hidden tabular-nums sm:inline">
            {agency.phone.display}
          </a>
        </nav>
      </header>

      <main className="conteneur">
        {/* Ouverture : un titre de une, une photo, trois repères. */}
        <section className="grid gap-10 pt-10 md:grid-cols-12 md:gap-12 md:pt-16">
          <div className="md:col-span-6 md:pt-6" data-reveal="monte">
            <h1 className="titre text-[2.75rem] leading-[1.02] tracking-[-0.02em] md:text-[4rem]">
              L’immobilier à Asnières, pièce par pièce, rue par rue.
            </h1>
            <p className="mt-8 max-w-[44ch] text-[1.1875rem] leading-relaxed text-encre/80">
              Une agence indépendante au 117 boulevard Voltaire. Peu de biens à
              la fois, suivis par la même personne de la première visite à la
              signature.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <Link
                href="/maquettes/biens"
                className="inline-flex items-center gap-3 bg-encre px-6 py-3.5 font-sans text-[0.875rem] tracking-wide text-blanc"
              >
                Voir les {d.properties.length} biens en vente
              </Link>
              <Lien href={agency.phone.href}>Appeler l’agence</Lien>
            </div>
          </div>
          <figure className="md:col-span-6">
            <div
              className="relative aspect-[4/5] overflow-hidden bg-pierre"
              data-reveal="decouvre"
            >
              <Image
                src={PHOTOS.quartier}
                alt="Les quais de Seine à Asnières"
                fill
                preload
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-[0.875rem] italic text-gris">
              Les quais, à dix minutes de l’agence.
            </figcaption>
          </figure>
        </section>

        <dl
          className="mt-16 grid gap-6 border-y border-encre py-6 sm:grid-cols-3 md:mt-20"
          data-reveal="monte"
        >
          {[
            ["Avis Google", `${d.rating} sur 5, ${d.count} avis`],
            ["Adresse", agency.address.street],
            ["Depuis", `${agency.since}, au même endroit`],
          ].map(([k, v]) => (
            <div
              key={k}
              className="sm:border-l sm:border-filet sm:pl-6 sm:first:border-0 sm:first:pl-0"
            >
              <dt className="font-sans text-[0.75rem] tracking-[0.08em] text-gris">
                {k}
              </dt>
              <dd className="mt-1 text-[1.25rem]">{v}</dd>
            </div>
          ))}
        </dl>

        {/* Les biens, en sommaire de magazine. */}
        <section className="mt-24 md:mt-32">
          <Rubrique>En vente en ce moment</Rubrique>
          <ul className="mt-2">
            {d.recent.map((p) => {
              const image = mainImage(p);
              const place = propertyPlace(p);
              return (
                <li
                  key={p.id}
                  className="border-b border-filet"
                  data-reveal="monte"
                >
                  <Link
                    href={`/maquettes/biens/${p.reference}`}
                    className="group grid items-center gap-5 py-6 sm:grid-cols-12 sm:gap-8"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-pierre sm:col-span-4 md:col-span-3">
                      {image && (
                        <Image
                          src={image.url}
                          alt=""
                          fill
                          sizes="(min-width: 640px) 25vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="sm:col-span-5 md:col-span-6">
                      <p className="text-[0.9375rem] italic text-gris">
                        {[place?.neighborhood, place?.city]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <h3 className="mt-1 text-[1.75rem] leading-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 md:text-[2.125rem]">
                        {propertyTitle(p)}
                      </h3>
                      <p className="mt-2 font-sans text-[0.875rem] text-gris">
                        {[propertySurface(p), propertyFloor(p)]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                    <p className="text-[1.5rem] sm:col-span-3 sm:text-right">
                      {priceLabel(p)}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-8">
            <Lien href="/maquettes/biens">Tous nos biens</Lien>
          </div>
        </section>

        {/* Un avis, en citation pleine page. */}
        {quote && (
          <section className="mt-24 md:mt-32">
            <Rubrique>Ce qu’en disent nos clients</Rubrique>
            <figure
              className="mx-auto mt-12 max-w-3xl text-center md:mt-16"
              data-reveal="monte"
            >
              <blockquote className="text-[1.75rem] leading-[1.3] md:text-[2.5rem]">
                «{" "}
                {quote.text.length > 220
                  ? `${quote.text.slice(0, 220).trimEnd()}…`
                  : quote.text}{" "}
                »
              </blockquote>
              <figcaption className="mt-8 font-sans text-[0.875rem] text-gris">
                {quote.authorName}, sur Google · {d.rating} sur 5, {d.count}{" "}
                avis
              </figcaption>
            </figure>
            <div className="mt-10 text-center">
              <Lien href={d.reviewsUrl}>Lire tous les avis</Lien>
            </div>
          </section>
        )}

        {/* La méthode, en trois colonnes séparées par des filets. */}
        <section className="mt-24 md:mt-32">
          <Rubrique>Notre façon de travailler</Rubrique>
          <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-0">
            {[
              [
                "Des estimations justes",
                "Un prix trop haut fait perdre des mois. Si nous n’y croyons pas, nous le disons.",
              ],
              [
                "Un seul interlocuteur",
                "La personne qui estime votre bien le fait visiter, le négocie et vous suit jusqu’au notaire.",
              ],
              [
                "Un périmètre resserré",
                "Asnières et ses voisines, que nous connaissons rue par rue.",
              ],
            ].map(([t, x]) => (
              <div
                key={t}
                className="md:border-l md:border-filet md:px-8 md:first:border-0 md:first:pl-0"
                data-reveal="monte"
              >
                <h3 className="text-[1.5rem] leading-tight">{t}</h3>
                <p className="mt-3 font-sans text-[0.9375rem] leading-relaxed text-gris">
                  {x}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* L'agence : la devanture en grand, la légende dessous. */}
        <section className="mt-24 md:mt-32">
          <Rubrique>Nous trouver</Rubrique>
          <figure className="mt-8">
            <div
              data-reveal="decouvre"
              className="relative aspect-[16/9] overflow-hidden bg-pierre md:aspect-[21/9]"
            >
              <Image
                src={PHOTOS.devanture}
                alt="La devanture de l’agence"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </figure>
          <div className="mt-8 grid gap-8 md:grid-cols-12" data-reveal="monte">
            <p className="text-[1.75rem] leading-tight md:col-span-5">
              {agency.address.street}
              <br />
              {agency.address.postalCode} {agency.address.city}
            </p>
            <dl className="font-sans text-[0.9375rem] md:col-span-4">
              {agency.hours.map((h) => (
                <div
                  key={h.days}
                  className="flex justify-between border-b border-filet py-2"
                >
                  <dt className="text-gris">{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
              <OpeningNote className="mt-3" />
            </dl>
            <div className="flex flex-col items-start gap-4 md:col-span-3">
              <Lien href={agency.phone.href}>{agency.phone.display}</Lien>
              <Lien href={agency.mapsDirections}>Itinéraire</Lien>
            </div>
          </div>
        </section>
      </main>

      <footer className="conteneur mt-28 border-t border-encre pt-8 pb-24 font-sans text-[0.8125rem] text-gris">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <p className="titre text-[1.25rem] text-encre">Cabinet Rimbault</p>
          <p className="max-w-[70ch]">
            {agency.legal.card}. {agency.legal.guarantor}.{" "}
            {agency.legal.company}. Médiateur de la consommation :{" "}
            <span className="text-rouge">à compléter</span>.
          </p>
        </div>
        <p className="mt-6 text-[0.75rem]">{CREDITS}</p>
      </footer>
    </div>
  );
}
