import Image from "next/image";
import Link from "next/link";
import { agency, commitments } from "@/lib/agency";
import { getProperties } from "@/lib/api/properties";
import {
  mainImage,
  priceLabel,
  propertyFeatures,
  propertyPlace,
  propertySurface,
  propertyTitle,
  statusLabel,
} from "@/lib/property";

export default async function HomeA() {
  const properties = await getProperties();
  const years = new Date().getFullYear() - agency.since;

  return (
    <main>
      <section className="a-band a-sign">
        <div className="a-wrap a-sign-content pb-14 pt-6 md:pb-20 md:pt-10">
          <p className="a-sign-name" aria-hidden>
            Cabinet Rimbault
          </p>
          <p className="a-sign-tagline" aria-hidden>
            {agency.tagline}
          </p>
          <h1 className="a-serif mt-10 max-w-[34ch] text-[1.375rem] leading-snug md:mt-14 md:text-[1.75rem]">
            Agence immobilière indépendante à{" "}
            <span className="whitespace-nowrap">Asnières-sur-Seine</span>, au
            117 boulevard Voltaire depuis {agency.since}.
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-[0.9375rem]">
            <a
              href="#biens"
              className="bg-(--a-white) px-5 py-3 font-medium text-(--a-red) hover:bg-(--a-stone)"
            >
              Voir les biens en vente
            </a>
            <a
              href={agency.google.href}
              className="underline decoration-white/40 underline-offset-4 hover:decoration-white"
            >
              {agency.google.rating} sur 5 sur Google, {agency.google.count}{" "}
              avis
            </a>
          </div>
        </div>
      </section>

      <section id="biens" className="a-wrap scroll-mt-6 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="a-serif text-[1.75rem] md:text-[2.25rem]">
            En vente en ce moment
          </h2>
          <p className="text-(--a-muted)">
            {properties.length} biens, suivis par la même personne de la visite
            à la signature.
          </p>
        </div>

        <ul className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {properties.map((p, index) => {
            const image = mainImage(p);
            const place = propertyPlace(p);
            const status = statusLabel(p);
            return (
              <li
                key={p.id}
                className={index === 0 ? "md:col-span-2" : undefined}
              >
                <Link
                  href={`/exploration/a/biens/${p.reference}`}
                  className="group block"
                >
                  <div
                    className={`relative overflow-hidden bg-(--a-stone) ${index === 0 ? "aspect-[4/3] md:aspect-[16/8]" : "aspect-[4/3]"}`}
                  >
                    {image && (
                      <Image
                        src={image.url}
                        alt=""
                        fill
                        sizes={
                          index === 0
                            ? "(min-width: 768px) 72rem, 100vw"
                            : "(min-width: 768px) 36rem, 100vw"
                        }
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        preload={index === 0}
                      />
                    )}
                    {status && (
                      <span className="absolute left-3 top-3 bg-(--a-white) px-2.5 py-1 text-sm">
                        {status}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="a-serif text-[1.375rem] group-hover:text-(--a-red)">
                      {propertyTitle(p)}, {propertySurface(p)}
                    </h3>
                    <p className="text-[1.125rem] font-medium tabular-nums">
                      {priceLabel(p)}
                    </p>
                  </div>
                  <p className="mt-1 text-(--a-muted)">
                    {place?.neighborhood ? `${place.neighborhood}, ` : ""}
                    {place?.city}
                  </p>
                  {propertyFeatures(p).length > 0 && (
                    <p className="mt-1 text-[0.9375rem]">
                      {propertyFeatures(p).join(", ")}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="agence" className="scroll-mt-6 bg-(--a-stone)">
        <div className="a-wrap py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="a-serif text-[1.75rem] md:text-[2.25rem]">
                Notre façon de travailler
              </h2>
              <p className="mt-4 max-w-sm text-(--a-muted)">
                {years} ans au 117 boulevard Voltaire. Une agence volontairement
                petite, pour connaître chaque dossier sans avoir à le relire.
              </p>
            </div>
            <div className="space-y-10">
              {commitments.map((c) => (
                <div key={c.title} className="border-t border-(--a-line) pt-6">
                  <h3 className="a-serif text-[1.375rem] leading-snug">
                    {c.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-(--a-muted)">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="a-wrap scroll-mt-6 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <h2 className="a-serif text-[1.75rem] md:text-[2.25rem]">
            Nous trouver
          </h2>
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="font-medium">L’agence</p>
              <p className="mt-2 text-(--a-muted)">
                {agency.address.street}
                <br />
                {agency.address.postalCode} {agency.address.city}
              </p>
              <dl className="mt-5 space-y-1 text-(--a-muted)">
                {agency.hours.map((h) => (
                  <div
                    key={h.days}
                    className="flex justify-between gap-4 sm:max-w-xs"
                  >
                    <dt>{h.days}</dt>
                    <dd className="tabular-nums">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="font-medium">Nous joindre</p>
              <p className="mt-2 text-(--a-muted)">
                Pour une visite, une question sur un bien ou un projet de vente.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={agency.phone.href} className="a-button">
                  Appeler le {agency.phone.display}
                </a>
                <span className="a-button-ghost">Écrire un message</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
