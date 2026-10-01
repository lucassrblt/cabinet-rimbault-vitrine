import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnergyScale } from "@/components/EnergyScale";
import { agency } from "@/lib/agency";
import { getProperty } from "@/lib/api/properties";
import {
  descriptionParagraphs,
  feesLabel,
  priceLabel,
  propertyFeatures,
  propertyFloor,
  propertyPlace,
  propertySurface,
  propertyTitle,
  statusLabel,
} from "@/lib/property";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/exploration/a/biens/[reference]">): Promise<Metadata> {
  const p = await getProperty((await params).reference);
  if (!p) return { title: "Bien introuvable" };
  return {
    title: `${propertyTitle(p)}, ${propertySurface(p)} — ${propertyPlace(p)?.city}`,
  };
}

export default async function PropertyA({
  params,
}: PageProps<"/exploration/a/biens/[reference]">) {
  const p = await getProperty((await params).reference);
  if (!p) notFound();

  const place = propertyPlace(p);
  const status = statusLabel(p);
  const fees = feesLabel(p);
  const floor = propertyFloor(p);
  const features = propertyFeatures(p);
  const [first, ...others] = p.images;
  const c = p.characteristics;
  const e = p.energy;

  const facts = [
    ["Surface", propertySurface(p)],
    ["Pièces", c?.rooms],
    ["Chambres", c?.bedrooms],
    ["Étage", floor],
    ["Construction", c?.yearBuilt],
  ].filter(([, v]) => v != null && v !== 0) as [string, string | number][];

  return (
    <main className="pb-24 md:pb-0">
      <div className="a-wrap pt-6 text-sm text-(--a-muted)">
        <Link href="/exploration/a#biens" className="a-link">
          Nos biens
        </Link>
        <span aria-hidden> / </span>
        <span>Référence {p.reference}</span>
      </div>

      <div className="a-wrap mt-6 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div className="min-w-0">
          {first && (
            <div className="relative aspect-[4/3] overflow-hidden bg-(--a-stone)">
              <Image
                src={first.url}
                alt={first.alt ?? ""}
                fill
                preload
                sizes="(min-width: 1024px) 50rem, 100vw"
                className="object-cover"
              />
              {status && (
                <span className="absolute left-3 top-3 bg-(--a-white) px-2.5 py-1 text-sm">
                  {status}
                </span>
              )}
            </div>
          )}
          {others.length > 0 && (
            <ul
              className="mt-3 flex gap-3 overflow-x-auto pb-2"
              aria-label="Autres photos"
            >
              {others.map((img) => (
                <li
                  key={img.id}
                  className="h-44 shrink-0 bg-(--a-stone) md:h-56"
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? ""}
                    width={1200}
                    height={900}
                    sizes="24rem"
                    className="h-full w-auto"
                  />
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-sm text-(--a-muted)">
            {p.images.length} photos
          </p>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <h1 className="a-serif text-[1.875rem] leading-tight">
            {propertyTitle(p)}
          </h1>
          <p className="mt-1 text-(--a-muted)">
            {place?.neighborhood ? `Quartier ${place.neighborhood}, ` : ""}
            {place?.city}
          </p>
          <p className="mt-5 text-[1.75rem] font-medium tabular-nums">
            {priceLabel(p)}
          </p>
          {fees && <p className="mt-1 text-sm text-(--a-muted)">{fees}</p>}

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-(--a-line) pt-5">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-(--a-muted)">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          {features.length > 0 && (
            <p className="mt-4 text-[0.9375rem]">{features.join(", ")}</p>
          )}

          <div className="mt-7 hidden flex-col gap-3 md:flex">
            <a href={agency.phone.href} className="a-button">
              Appeler le {agency.phone.display}
            </a>
            <a href="#contact" className="a-button-ghost">
              Demander une visite
            </a>
          </div>
        </aside>
      </div>

      <div className="a-wrap mt-16 grid gap-16 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div className="min-w-0 space-y-16">
          <section>
            <h2 className="a-serif text-[1.5rem]">Le bien</h2>
            <div className="mt-5 max-w-[40rem] space-y-4">
              {descriptionParagraphs(p).map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="a-serif text-[1.5rem]">Performance énergétique</h2>
            <div className="mt-6 grid gap-10 sm:grid-cols-2">
              <EnergyScale
                kind="dpe"
                value={e?.energyClass ?? null}
                amount={e?.energyValue ?? null}
              />
              <EnergyScale
                kind="ges"
                value={e?.gesClass ?? null}
                amount={e?.gesValue ?? null}
              />
            </div>
            <p className="mt-6 max-w-[40rem] text-sm text-(--a-muted)">
              {e?.annualEnergyCostMin && e.annualEnergyCostMax
                ? `Montant estimé des dépenses annuelles d’énergie pour un usage standard : entre ${formatPrice(e.annualEnergyCostMin)} et ${formatPrice(e.annualEnergyCostMax)}${e.dateReferenceEnergie ? ` (prix de référence ${new Date(e.dateReferenceEnergie).getFullYear()})` : ""}.`
                : "Estimation des dépenses annuelles d’énergie : à compléter."}
            </p>
          </section>

          {p.copro?.isInCopro && (
            <section>
              <h2 className="a-serif text-[1.5rem]">Copropriété</h2>
              <dl className="mt-5 grid max-w-[40rem] gap-x-8 gap-y-3 sm:grid-cols-3">
                {p.copro.coprLots != null && (
                  <div>
                    <dt className="text-sm text-(--a-muted)">Lots</dt>
                    <dd className="font-medium">{p.copro.coprLots}</dd>
                  </div>
                )}
                {p.copro.coprCharges != null && (
                  <div>
                    <dt className="text-sm text-(--a-muted)">
                      Charges annuelles
                    </dt>
                    <dd className="font-medium tabular-nums">
                      {formatPrice(p.copro.coprCharges)}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-(--a-muted)">
                    Procédure en cours
                  </dt>
                  <dd className="font-medium">
                    {p.copro.coprProcedure ? "Oui" : "Non"}
                  </dd>
                </div>
              </dl>
            </section>
          )}

          <section
            id="contact"
            className="scroll-mt-6 bg-(--a-stone) p-6 md:p-10"
          >
            <h2 className="a-serif text-[1.5rem]">Ce bien vous intéresse</h2>
            <p className="mt-2 max-w-[36rem] text-(--a-muted)">
              Laissez-nous vos coordonnées, nous vous rappelons pour répondre à
              vos questions ou organiser une visite.
            </p>
            <form className="mt-6 grid max-w-[36rem] gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Prénom et nom
                <input
                  className="a-field mt-1"
                  name="name"
                  autoComplete="name"
                />
              </label>
              <label className="text-sm">
                Téléphone
                <input
                  className="a-field mt-1"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                E-mail
                <input
                  className="a-field mt-1"
                  name="email"
                  type="email"
                  autoComplete="email"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                Message
                <textarea
                  className="a-field mt-1 min-h-28"
                  name="message"
                  defaultValue={`Bonjour, je souhaite visiter le bien référence ${p.reference}.`}
                />
              </label>
              <p className="text-xs text-(--a-muted) sm:col-span-2">
                Vos coordonnées servent uniquement à répondre à votre demande.
                Elles ne sont ni cédées ni utilisées à d’autres fins. Politique
                de confidentialité.
              </p>
              <div className="sm:col-span-2">
                <button type="button" className="a-button">
                  Envoyer la demande
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-2 gap-2 border-t border-(--a-line) bg-(--a-white) p-3 md:hidden">
        <a href={agency.phone.href} className="a-button">
          Appeler
        </a>
        <a href="#contact" className="a-button-ghost">
          Visiter
        </a>
      </div>
    </main>
  );
}
