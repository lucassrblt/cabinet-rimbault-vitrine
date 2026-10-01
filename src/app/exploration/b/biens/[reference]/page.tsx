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
}: PageProps<"/exploration/b/biens/[reference]">): Promise<Metadata> {
  const p = await getProperty((await params).reference);
  if (!p) return { title: "Bien introuvable" };
  return {
    title: `${propertyTitle(p)}, ${propertySurface(p)} à ${propertyPlace(p)?.city}`,
  };
}

export default async function PropertyB({
  params,
}: PageProps<"/exploration/b/biens/[reference]">) {
  const p = await getProperty((await params).reference);
  if (!p) notFound();

  const place = propertyPlace(p);
  const status = statusLabel(p);
  const fees = feesLabel(p);
  const features = propertyFeatures(p);
  const [first, ...others] = p.images;
  const c = p.characteristics;
  const e = p.energy;

  const legend = [
    ["Surface", propertySurface(p)],
    ["Pièces", c?.rooms],
    ["Chambres", c?.bedrooms],
    ["Étage", propertyFloor(p, { short: true })],
  ].filter(([, v]) => v != null && v !== 0) as [string, string | number][];

  return (
    <main className="pb-24 md:pb-0">
      <div className="b-wrap pt-4">
        <Link
          href="/exploration/b#biens"
          className="b-link text-sm text-(--b-muted)"
        >
          Tous les biens
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <div>
            <p className="text-(--b-muted)">
              {place?.neighborhood ? `Quartier ${place.neighborhood}, ` : ""}
              {place?.city}
            </p>
            <h1 className="b-display mt-1 text-[2.5rem] md:text-[4rem]">
              {propertyTitle(p)}
            </h1>
          </div>
          <div className="md:text-right">
            <p className="b-figure text-[2rem] md:text-[2.75rem]">
              {priceLabel(p)}
            </p>
            {fees && (
              <p className="mt-1 max-w-sm text-sm text-(--b-muted)">{fees}</p>
            )}
          </div>
        </div>
      </div>

      <div className="b-wrap mt-8">
        {first && (
          <div className="relative aspect-[4/3] overflow-hidden bg-(--b-fog) md:aspect-[16/8]">
            <Image
              src={first.url}
              alt={first.alt ?? ""}
              fill
              preload
              sizes="(min-width: 768px) 75rem, 100vw"
              className="object-cover"
            />
            {status && (
              <span className="absolute left-3 top-3 rounded-full bg-(--b-paper) px-3 py-1 text-sm">
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
              <li key={img.id} className="h-48 shrink-0 bg-(--b-fog) md:h-72">
                <Image
                  src={img.url}
                  alt={img.alt ?? ""}
                  width={1200}
                  height={900}
                  sizes="28rem"
                  className="h-full w-auto"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <dl className="b-wrap mt-12 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        {legend.map(([label, value]) => (
          <div key={label}>
            <dt className="flex items-center gap-2 text-sm text-(--b-muted)">
              <span className="b-mark text-[0.7rem]" aria-hidden />
              {label}
            </dt>
            <dd className="b-figure mt-2 text-[2.25rem] md:text-[3.25rem]">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="b-wrap mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-10">
        <div className="min-w-0 space-y-16 md:col-span-7">
          <section>
            <h2 className="b-italic text-[1.75rem]">Le bien</h2>
            <div className="mt-5 max-w-[38rem] space-y-4">
              {descriptionParagraphs(p).map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            {features.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="b-mark text-[0.75rem]" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="b-italic text-[1.75rem]">Énergie</h2>
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
            <p className="mt-6 max-w-[38rem] text-sm text-(--b-muted)">
              {e?.annualEnergyCostMin && e.annualEnergyCostMax
                ? `Montant estimé des dépenses annuelles d’énergie pour un usage standard : entre ${formatPrice(e.annualEnergyCostMin)} et ${formatPrice(e.annualEnergyCostMax)}${e.dateReferenceEnergie ? ` (prix de référence ${new Date(e.dateReferenceEnergie).getFullYear()})` : ""}.`
                : "Estimation des dépenses annuelles d’énergie : à compléter."}
            </p>
          </section>

          {p.copro?.isInCopro && (
            <section>
              <h2 className="b-italic text-[1.75rem]">Copropriété</h2>
              <p className="mt-4 max-w-[38rem]">
                {p.copro.coprLots != null && `${p.copro.coprLots} lots. `}
                {p.copro.coprCharges != null &&
                  `Charges annuelles : ${formatPrice(p.copro.coprCharges)}. `}
                {p.copro.coprProcedure
                  ? "Une procédure est en cours."
                  : "Aucune procédure en cours."}
              </p>
            </section>
          )}
        </div>

        <aside id="contact" className="scroll-mt-6 md:col-span-5">
          <div className="bg-(--b-fog) p-6 md:sticky md:top-6 md:p-8">
            <h2 className="text-[1.375rem] font-medium">Visiter ce bien</h2>
            <p className="mt-2 text-(--b-muted)">
              Appelez l’agence, ou laissez vos coordonnées : nous vous
              rappelons.
            </p>
            <a href={agency.phone.href} className="b-button mt-5 w-full">
              Appeler le {agency.phone.display}
            </a>
            <form className="mt-8 space-y-5">
              <label className="block text-sm text-(--b-muted)">
                Prénom et nom
                <input
                  className="b-field text-(--b-ink)"
                  name="name"
                  autoComplete="name"
                />
              </label>
              <label className="block text-sm text-(--b-muted)">
                Téléphone
                <input
                  className="b-field text-(--b-ink)"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                />
              </label>
              <label className="block text-sm text-(--b-muted)">
                E-mail
                <input
                  className="b-field text-(--b-ink)"
                  name="email"
                  type="email"
                  autoComplete="email"
                />
              </label>
              <p className="text-xs text-(--b-muted)">
                Vos coordonnées servent uniquement à répondre à votre demande.
                Politique de confidentialité.
              </p>
              <button type="button" className="b-button-ghost w-full">
                Être rappelé
              </button>
            </form>
            <p className="mt-6 text-sm text-(--b-muted)">
              Référence {p.reference}
            </p>
          </div>
        </aside>
      </div>

      <div className="h-24" />

      <div className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-2 gap-2 bg-(--b-paper)/95 p-3 backdrop-blur md:hidden">
        <a href={agency.phone.href} className="b-button">
          Appeler
        </a>
        <a href="#contact" className="b-button-ghost">
          Être rappelé
        </a>
      </div>
    </main>
  );
}
