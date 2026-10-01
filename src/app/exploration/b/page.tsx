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

const COUNT_WORDS = [
  "Aucun",
  "Un",
  "Deux",
  "Trois",
  "Quatre",
  "Cinq",
  "Six",
  "Sept",
  "Huit",
  "Neuf",
  "Dix",
  "Onze",
  "Douze",
];

export default async function HomeB() {
  const properties = await getProperties();
  const count = COUNT_WORDS[properties.length] ?? String(properties.length);
  const plural = properties.length > 1;

  return (
    <main>
      <section className="b-wrap pb-16 pt-10 md:pb-28 md:pt-20">
        <h1 className="b-display b-rise text-[2.125rem] sm:text-[4rem] lg:text-[5.5rem]">
          <span className="block">
            {count} {plural ? "biens" : "bien"} en vente,
          </span>
          <span className="block">
            à <span className="whitespace-nowrap">Asnières-sur-Seine</span>
          </span>
          <span className="block text-(--b-muted)">et alentour.</span>
        </h1>
        <dl className="mt-12 grid gap-6 text-[0.9375rem] sm:grid-cols-3 md:mt-16 md:max-w-4xl">
          <div>
            <dt className="text-(--b-muted)">Depuis {agency.since}</dt>
            <dd>Au {agency.address.street}</dd>
          </div>
          <div>
            <dt className="text-(--b-muted)">Avis Google</dt>
            <dd>
              <a href={agency.google.href} className="b-link">
                {agency.google.rating} sur 5, {agency.google.count} avis
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-(--b-muted)">Agence indépendante</dt>
            <dd>Un seul interlocuteur, de la visite au notaire</dd>
          </div>
        </dl>
      </section>

      <section
        id="biens"
        className="b-wrap scroll-mt-6 space-y-20 pb-20 md:space-y-28 md:pb-28"
      >
        {properties.map((p, index) => {
          const image = mainImage(p);
          const place = propertyPlace(p);
          const status = statusLabel(p);
          const features = propertyFeatures(p);
          return (
            <article
              key={p.id}
              className="grid gap-6 md:grid-cols-12 md:gap-10"
            >
              <Link
                href={`/exploration/b/biens/${p.reference}`}
                className="group relative block aspect-[4/3] overflow-hidden bg-(--b-fog) md:col-span-7"
              >
                {image && (
                  <Image
                    src={image.url}
                    alt={`${propertyTitle(p)}, ${place?.city}`}
                    fill
                    sizes="(min-width: 768px) 46rem, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    preload={index === 0}
                  />
                )}
                {status && (
                  <span className="absolute left-3 top-3 rounded-full bg-(--b-paper) px-3 py-1 text-sm">
                    {status}
                  </span>
                )}
              </Link>
              <div className="flex flex-col md:col-span-5 md:pt-2">
                <p className="text-(--b-muted)">
                  {place?.neighborhood ? `${place.neighborhood}, ` : ""}
                  {place?.city}
                </p>
                <h2 className="mt-1 text-[1.25rem] font-medium">
                  {propertyTitle(p)}
                </h2>
                <p className="b-figure mt-6 text-[3.5rem] md:text-[4.5rem]">
                  {propertySurface(p)}
                </p>
                <p className="b-figure mt-2 text-[1.75rem] text-(--b-muted)">
                  {priceLabel(p)}
                </p>
                {features.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-[0.9375rem]">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="b-mark text-[0.75rem]" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/exploration/b/biens/${p.reference}`}
                  className="b-link mt-8 self-start"
                >
                  Voir le bien
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section id="agence" className="scroll-mt-6 bg-(--b-fog)">
        <div className="b-wrap py-20 md:py-28">
          <p className="b-italic text-[1.5rem] text-(--b-muted)">
            Notre façon de travailler
          </p>
          <div className="mt-10 space-y-14">
            {commitments.map((c) => (
              <div
                key={c.title}
                className="grid gap-4 md:grid-cols-12 md:gap-10"
              >
                <h2 className="b-display text-[1.75rem] md:col-span-7 md:text-[2.5rem]">
                  {c.title}
                </h2>
                <p className="text-(--b-muted) md:col-span-5 md:pt-2">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="b-wrap scroll-mt-6 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 className="b-display text-[2.25rem] md:col-span-5 md:text-[3rem]">
            Passez à l’agence, ou appelez-nous.
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 md:col-span-7">
            <div>
              <p>{agency.address.street}</p>
              <p>
                {agency.address.postalCode} {agency.address.city}
              </p>
              <dl className="mt-5 space-y-1 text-(--b-muted)">
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
            <div className="flex flex-col items-start gap-3">
              <a href={agency.phone.href} className="b-button">
                Appeler le {agency.phone.display}
              </a>
              <span className="b-button-ghost">Écrire un message</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
