import {
  ArrowUpRight,
  Clock,
  Handshake,
  MapPin,
  Phone,
  Scale,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { CREDITS, homeData, PHOTOS } from "@/components/directions/data";
import { CardCarousel } from "@/components/site/CardCarousel";
import { OpeningNote } from "@/components/site/OpeningNote";
import { agency } from "@/lib/agency";
import {
  priceLabel,
  propertyPlace,
  propertySurface,
  propertyTitle,
} from "@/lib/property";

export const metadata = { title: "Direction moderne" };

/**
 * Direction moderne, type application : une seule famille (Instrument Sans),
 * titres gras resserrés, cartes très arrondies, grille régulière, pilules.
 * Le serif disparaît. Le rouge ne sert qu'à l'étoile et au survol.
 */

function Pilule({
  href,
  children,
  clair,
}: {
  href: string;
  children: React.ReactNode;
  clair?: boolean;
}) {
  return (
    <a
      href={href}
      className={
        clair
          ? "group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-5 text-[0.9375rem] font-semibold text-encre"
          : "group inline-flex items-center gap-3 rounded-full bg-encre py-1.5 pr-1.5 pl-5 text-[0.9375rem] font-semibold text-white"
      }
    >
      {children}
      <span
        className={`flex size-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${clair ? "bg-encre text-white" : "bg-white text-encre"}`}
        aria-hidden
      >
        <ArrowUpRight size={17} />
      </span>
    </a>
  );
}

const METHODE = [
  {
    icon: Scale,
    t: "Des estimations justes",
    x: "Si nous ne croyons pas au prix, nous le disons.",
  },
  {
    icon: Handshake,
    t: "Un seul interlocuteur",
    x: "De la première visite à la signature chez le notaire.",
  },
  {
    icon: MapPin,
    t: "Un périmètre resserré",
    x: "Asnières et ses voisines, connues rue par rue.",
  },
];

export default async function Moderne() {
  const d = await homeData();

  return (
    <div className="min-h-screen bg-[#f7f6f4] font-sans text-encre">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f7f6f4]/90 backdrop-blur-md">
        <div className="conteneur flex h-[4.5rem] items-center justify-between gap-6">
          <Link
            href="/directions/moderne"
            className="text-[1.125rem] font-bold tracking-[-0.03em]"
          >
            Cabinet Rimbault
          </Link>
          <nav className="hidden items-center gap-1 rounded-full bg-white p-1 shadow-[0_1px_2px_rgb(0_0_0/0.06)] md:flex">
            {["Nos biens", "L’agence", "Contact"].map((n, i) => (
              <span
                key={n}
                className={`rounded-full px-4 py-2 text-[0.9375rem] font-medium ${i === 0 ? "bg-encre text-white" : "text-encre/70"}`}
              >
                {n}
              </span>
            ))}
          </nav>
          <a
            href={agency.phone.href}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[0.9375rem] font-semibold shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
          >
            <Phone size={16} aria-hidden />
            <span className="hidden sm:inline">{agency.phone.display}</span>
          </a>
        </div>
      </header>

      <main className="conteneur pb-28">
        {/* Ouverture : grande photo arrondie, texte posé dessus. */}
        <section
          className="relative mt-4 overflow-hidden rounded-[28px] bg-encre md:mt-6"
          data-reveal="monte"
        >
          <div className="relative h-[34rem] md:h-[38rem]">
            <Image
              src={PHOTOS.quartier}
              alt="Les quais de Seine à Asnières"
              fill
              preload
              sizes="100vw"
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-12">
            <div className="flex flex-wrap gap-2 text-[0.8125rem] font-medium">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
                <Star size={13} className="fill-current" aria-hidden />
                {d.rating} · {d.count} avis
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
                Depuis {agency.since}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
                Asnières-sur-Seine
              </span>
            </div>
            <h1 className="mt-5 max-w-[16ch] text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[4rem]">
              Votre agence de quartier, à Asnières.
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Pilule href="/maquettes/biens" clair>
                Voir les {d.properties.length} biens
              </Pilule>
              <a
                href={agency.phone.href}
                className="rounded-full border border-white/40 px-5 py-3 text-[0.9375rem] font-semibold"
              >
                Appeler l’agence
              </a>
            </div>
          </div>
        </section>

        {/* Les biens : grille régulière de cartes. */}
        <section className="mt-20 md:mt-28">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] md:text-[2.25rem]">
              En vente
            </h2>
            <Link
              href="/maquettes/biens"
              className="rounded-full bg-white px-4 py-2 text-[0.875rem] font-semibold shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
            >
              Tout voir
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {d.recent.map((p) => {
              const place = propertyPlace(p);
              return (
                <article
                  key={p.id}
                  className="rounded-[22px] bg-white p-2.5 shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition-shadow hover:shadow-[0_18px_40px_-22px_rgb(0_0_0/0.35)]"
                  data-reveal="monte"
                >
                  <CardCarousel
                    images={p.images}
                    href={`/maquettes/biens/${p.reference}`}
                    ratio="aspect-[4/3]"
                    className="rounded-[16px]"
                    sizes="(min-width: 1024px) 30vw, 50vw"
                  />
                  <Link
                    href={`/maquettes/biens/${p.reference}`}
                    className="block px-2.5 pt-4 pb-3"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em]">
                        {propertyTitle(p)}
                      </h3>
                      <p className="shrink-0 text-[1.0625rem] font-semibold">
                        {priceLabel(p)}
                      </p>
                    </div>
                    <p className="mt-1 text-[0.875rem] text-gris">
                      {[place?.neighborhood, propertySurface(p)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* Avis en cartes. */}
        <section className="mt-20 md:mt-28">
          <div className="flex items-center gap-3">
            <Star size={22} className="fill-rouge text-rouge" aria-hidden />
            <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] md:text-[2.25rem]">
              {d.rating} · {d.count} avis Google
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {d.reviews.slice(0, 3).map((r) => (
              <figure
                key={r.id}
                className="rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.05)]"
                data-reveal="monte"
              >
                <figcaption className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#ece9e4] font-semibold">
                    {r.authorName.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-semibold">{r.authorName}</span>
                    <span className="block text-[0.8125rem] text-gris">
                      {r.relativeTime}
                    </span>
                  </span>
                </figcaption>
                <blockquote className="mt-4 line-clamp-5 text-[0.9375rem] leading-relaxed text-encre/80">
                  {r.text}
                </blockquote>
              </figure>
            ))}
          </div>
        </section>

        {/* Méthode en trois cartes à icône. */}
        <section className="mt-20 grid gap-4 md:mt-28 md:grid-cols-3">
          {METHODE.map(({ icon: Icon, t, x }) => (
            <div
              key={t}
              className="rounded-[22px] bg-white p-7 shadow-[0_1px_2px_rgb(0_0_0/0.05)]"
              data-reveal="monte"
            >
              <span className="flex size-12 items-center justify-center rounded-[14px] bg-[#ece9e4]">
                <Icon size={22} aria-hidden />
              </span>
              <h3 className="mt-6 text-[1.25rem] font-semibold tracking-[-0.02em]">
                {t}
              </h3>
              <p className="mt-2 text-gris">{x}</p>
            </div>
          ))}
        </section>

        {/* L'agence : carte divisée. */}
        <section
          className="mt-20 grid overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.05)] md:mt-28 md:grid-cols-2"
          data-reveal="monte"
        >
          <div className="relative aspect-[4/3] md:aspect-auto">
            <Image
              src={PHOTOS.devanture}
              alt="La devanture de l’agence"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <div className="p-7 md:p-12">
            <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em]">
              Passez nous voir
            </h2>
            <p className="mt-3 flex items-start gap-2 text-gris">
              <MapPin size={18} className="mt-0.5 shrink-0" aria-hidden />
              {agency.address.street}, {agency.address.postalCode}{" "}
              {agency.address.city}
            </p>
            <p className="mt-2 flex items-start gap-2 text-gris">
              <Clock size={18} className="mt-0.5 shrink-0" aria-hidden />
              Mardi au vendredi 9 h – 19 h, samedi 9 h – 18 h, lundi sur
              rendez-vous
            </p>
            <OpeningNote className="mt-2 pl-6.5" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Pilule href={agency.phone.href}>{agency.phone.display}</Pilule>
              <a
                href={agency.mapsDirections}
                className="rounded-full bg-[#ece9e4] px-5 py-3 text-[0.9375rem] font-semibold"
              >
                Itinéraire
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white">
        <div className="conteneur grid gap-8 py-12 pb-24 text-[0.875rem] md:grid-cols-4">
          <p className="text-[1.125rem] font-bold tracking-[-0.03em]">
            Cabinet Rimbault
          </p>
          <p className="text-gris">
            {agency.address.street}
            <br />
            {agency.address.postalCode} {agency.address.city}
          </p>
          <p className="text-gris">{agency.phone.display}</p>
          <p className="text-[0.75rem] text-gris md:col-span-4">
            {agency.legal.card}. {agency.legal.guarantor}.{" "}
            {agency.legal.company}. Médiateur de la consommation :{" "}
            <span className="text-rouge">à compléter</span>. {CREDITS}
          </p>
        </div>
      </footer>
    </div>
  );
}
