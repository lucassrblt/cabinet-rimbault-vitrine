import { ChevronDown, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Bouton, BoutonAppel, LienAppuye } from "@/components/site/Action";
import { EnergyCompact } from "@/components/site/EnergyCompact";
import { Gallery } from "@/components/site/Gallery";
import { OpeningNote } from "@/components/site/OpeningNote";
import { PropertyCard } from "@/components/site/PropertyCard";
import { agency } from "@/lib/agency";
import { getProperty, getSimilarProperties } from "@/lib/api/properties";
import {
  descriptionParts,
  feesLabel,
  priceLabel,
  propertyFeatures,
  propertyFloor,
  propertyPlace,
  propertySurface,
  propertyTitle,
  statusLabel,
} from "@/lib/property";
import { formatPrice, formatSurface } from "@/lib/utils";

type Params = PageProps<"/maquettes/biens/[reference]">;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getProperty((await params).reference);
  if (!p) return { title: "Bien introuvable" };
  return {
    title: `${propertyTitle(p)}, ${propertySurface(p)} à ${propertyPlace(p)?.city}`,
  };
}

function Details({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="repliable group border-b border-filet">
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          size={18}
          className="transition-transform group-open:rotate-180 motion-reduce:transition-none"
          aria-hidden
        />
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}

function Facts({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="flex justify-between gap-4 border-b border-filet/70 pb-2 text-mention"
        >
          <dt className="text-gris">{k}</dt>
          <dd className="text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function FicheBienMaquette({ params }: Params) {
  const { reference } = await params;
  const [p, similar] = await Promise.all([
    getProperty(reference),
    getSimilarProperties(reference),
  ]);
  if (!p) notFound();

  const title = propertyTitle(p);
  const place = propertyPlace(p);
  const fees = feesLabel(p);
  const features = propertyFeatures(p);
  const { highlights, paragraphs } = descriptionParts(p);
  const c = p.characteristics;
  const e = p.energy;
  const f = p.finance;

  const legend: [string, string | number | null | undefined][] = [
    ["Surface", propertySurface(p)],
    ["Pièces", c?.rooms],
    ["Chambres", c?.bedrooms],
    ["Étage", propertyFloor(p, { short: true })],
  ];

  const characteristics = (
    [
      ["Surface habitable", c ? formatSurface(c.surface) : null],
      [
        "Surface Carrez",
        c?.surfaceCarrez ? formatSurface(c.surfaceCarrez) : null,
      ],
      ["Pièces", c?.rooms],
      ["Chambres", c?.bedrooms],
      ["Salles de bain", c?.bathrooms || null],
      ["Salles d’eau", c?.showerRooms || null],
      ["Étage", propertyFloor(p)],
      ["Année de construction", c?.yearBuilt],
      ["Taxe foncière", f?.taxeFonciere ? formatPrice(f.taxeFonciere) : null],
    ] as [string, ReactNode][]
  ).filter(([, v]) => v != null && v !== "");

  const contactActions = (
    <>
      <BoutonAppel className="justify-between" />
      {agency.whatsapp && (
        <LienAppuye href={agency.whatsapp} className="self-start">
          WhatsApp
        </LienAppuye>
      )}
      <LienAppuye href="#visite" className="self-start">
        Demander une visite
      </LienAppuye>
    </>
  );

  return (
    <main className="pb-24 md:pb-0">
      <div className="conteneur py-4 text-mention text-gris">
        <Link href="/maquettes/biens" className="lien">
          Nos biens
        </Link>
        <span aria-hidden> / </span>
        Référence {p.reference}
      </div>

      <div className="md:conteneur">
        <Gallery images={p.images} title={title} status={statusLabel(p)} />
      </div>

      <div className="conteneur mt-8 md:mt-12 md:grid md:grid-cols-12 md:gap-10">
        <div className="min-w-0 md:col-span-8">
          <section>
            <p className="text-mention text-gris">
              {place?.neighborhood ? `Quartier ${place.neighborhood}, ` : ""}
              {place?.city}
            </p>
            <h1 className="titre mt-1 text-[2.25rem] leading-tight md:text-page">
              {title}
            </h1>
            <p className="titre mt-3 text-chiffre font-semibold">
              {priceLabel(p)}
            </p>
            {fees && (
              <p className="mt-1 max-w-[46ch] text-mention text-gris">{fees}</p>
            )}
            <dl className="mt-8 grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-3 border-y border-filet py-5">
              {legend
                .filter(([, v]) => v != null && v !== 0)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-mention text-gris">{k}</dt>
                    <dd className="titre mt-1 text-[1.25rem] whitespace-nowrap md:text-chiffre">
                      {v}
                    </dd>
                  </div>
                ))}
            </dl>
          </section>

          <section className="mt-12">
            <h2 className="sr-only">Le bien</h2>
            {features.length > 0 && (
              <p className="text-gris">{features.join(", ")}</p>
            )}
            {highlights.length > 0 && (
              <ul className="mt-6 space-y-1.5">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5">
                    <MapPin
                      size={16}
                      className="mt-1 shrink-0 text-gris"
                      aria-hidden
                    />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            {paragraphs.length > 0 && (
              <details className="group mt-6 max-w-[62ch]">
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="line-clamp-4 group-open:line-clamp-none">
                    {paragraphs[0]}
                  </span>
                  <span className="lien mt-2 inline-block group-open:hidden">
                    Lire la description complète
                  </span>
                </summary>
                <div className="space-y-4 pt-4">
                  {paragraphs.slice(1).map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </details>
            )}
          </section>

          <section className="mt-14" data-reveal="monte">
            <h2 className="titre text-intertitre">Énergie</h2>
            <div className="mt-5 grid gap-8 sm:grid-cols-2">
              <EnergyCompact
                kind="dpe"
                value={e?.energyClass ?? null}
                amount={e?.energyValue ?? null}
              />
              <EnergyCompact
                kind="ges"
                value={e?.gesClass ?? null}
                amount={e?.gesValue ?? null}
              />
            </div>
            <p className="mt-5 max-w-[62ch] text-mention text-gris">
              {e?.annualEnergyCostMin && e.annualEnergyCostMax
                ? `Dépenses annuelles d’énergie estimées pour un usage standard : entre ${formatPrice(e.annualEnergyCostMin)} et ${formatPrice(e.annualEnergyCostMax)}${e.dateReferenceEnergie ? `, prix de référence ${new Date(e.dateReferenceEnergie).getFullYear()}` : ""}.`
                : "Estimation des dépenses annuelles d’énergie : information à compléter."}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="sr-only">Détails</h2>
            <Details title="Caractéristiques complètes">
              <Facts rows={characteristics} />
            </Details>
            {p.copro?.isInCopro && (
              <Details title="Copropriété et charges">
                <Facts
                  rows={(
                    [
                      ["Nombre de lots", p.copro.coprLots],
                      [
                        "Charges annuelles",
                        p.copro.coprCharges != null
                          ? formatPrice(p.copro.coprCharges)
                          : null,
                      ],
                      [
                        "Procédure en cours",
                        p.copro.coprProcedure ? "Oui" : "Non",
                      ],
                    ] as [string, ReactNode][]
                  ).filter(([, v]) => v != null)}
                />
              </Details>
            )}
            <Details title="Honoraires et frais">
              <p className="max-w-[62ch] text-mention">
                {fees ?? "Honoraires : information à compléter."}
              </p>
              <p className="mt-3 text-mention">
                <span className="lien">Consulter le barème des honoraires</span>
              </p>
            </Details>
          </section>

          <section className="mt-14" data-reveal="monte">
            <h2 className="titre text-intertitre">Le quartier</h2>
            <div className="mt-5 flex aspect-[16/9] flex-col items-center rounded-carte md:aspect-[21/9] justify-center gap-2 bg-pierre text-gris">
              <MapPin size={22} aria-hidden />
              <p className="text-mention">
                Carte du secteur,{" "}
                {place?.neighborhood ? `${place.neighborhood}, ` : ""}
                {place?.city}
              </p>
              <p className="text-[0.75rem]">
                Zone approximative, l’adresse exacte est communiquée lors de la
                visite
              </p>
            </div>
          </section>

          <section
            id="visite"
            data-reveal="monte"
            className="mt-14 scroll-mt-32 rounded-carte bg-pierre p-6 md:p-10"
          >
            <h2 className="titre text-section">Demander une visite</h2>
            <p className="mt-2 text-gris">
              Nous vous rappelons pour convenir d’un créneau.
            </p>
            <form className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-mention">
                Prénom et nom
                <input className="champ mt-1" name="name" autoComplete="name" />
              </label>
              <label className="text-mention">
                Téléphone
                <input
                  className="champ mt-1"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                />
              </label>
              <label className="text-mention sm:col-span-2">
                E-mail
                <input
                  className="champ mt-1"
                  name="email"
                  type="email"
                  autoComplete="email"
                />
              </label>
              <p className="text-[0.8125rem] text-gris sm:col-span-2">
                Vos coordonnées servent uniquement à répondre à votre demande.{" "}
                <span className="lien">Politique de confidentialité</span>
              </p>
              <div className="sm:col-span-2">
                <Bouton as="button">Envoyer la demande</Bouton>
              </div>
            </form>
          </section>
        </div>

        <aside className="hidden md:col-span-4 md:block">
          <div className="sticky top-32 rounded-carte border border-filet p-7">
            <p className="titre text-chiffre font-semibold">{priceLabel(p)}</p>
            <p className="mt-1 text-mention text-gris">
              {title}, {propertySurface(p)}
            </p>
            <div className="mt-6 flex flex-col gap-3">{contactActions}</div>
            <OpeningNote className="mt-3" />
            <p className="mt-6 text-mention text-gris">
              Référence {p.reference}
            </p>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="conteneur mt-24 pb-24 md:mt-32 md:pb-32">
          <h2 className="titre text-section" data-reveal="monte">
            D’autres biens
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-12 md:gap-x-10">
            {similar.slice(0, 3).map((s, i) => (
              <PropertyCard
                key={s.id}
                property={s}
                href={`/maquettes/biens/${s.reference}`}
                ratio="aspect-[4/3]"
                sizes="(min-width: 768px) 30vw, 50vw"
                className={
                  [
                    "md:col-span-4",
                    "md:col-span-4 md:mt-16",
                    "md:col-span-4 md:mt-6",
                  ][i]
                }
                revealDelay={i * 140}
              />
            ))}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 border-t border-filet bg-blanc/95 px-4 py-3 backdrop-blur md:hidden">
        <LienAppuye href="#visite">Visiter</LienAppuye>
        {agency.whatsapp && (
          <LienAppuye href={agency.whatsapp}>WhatsApp</LienAppuye>
        )}
        <BoutonAppel label="Appeler" />
      </div>
    </main>
  );
}
