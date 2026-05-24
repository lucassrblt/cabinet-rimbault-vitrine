import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyContactForm } from "@/components/forms/PropertyContactForm";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AutoPropertyCard } from "@/components/property/PropertyCard";
import { PropertyEstimationCTA } from "@/components/property/PropertyEstimationCTA";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { LinkButton } from "@/components/ui/Button";
import { EnergyScale } from "@/components/ui/EnergyRating";
import {
  getPropertyByReference,
  getSimilarProperties,
} from "@/lib/api/properties";
import type { HonorairesCharge, Property } from "@/lib/api/types";
import { AGENT } from "@/lib/config/agent";
import {
  formatDate,
  formatPrice,
  formatPropertyType,
  formatRent,
  formatSurface,
} from "@/lib/utils";

interface Params {
  reference: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { reference } = await params;
  const property = await safeGet(reference);
  if (!property) {
    return {
      title: "Bien introuvable",
      robots: { index: false, follow: false },
    };
  }
  const firstImage =
    property.images.find((i) => i.isMain) ?? property.images[0];
  const city = property.location?.city ?? "";
  const rooms = property.characteristics?.rooms;
  const title = [
    formatPropertyType(property.propertyType),
    rooms != null ? `${rooms} pièce${rooms > 1 ? "s" : ""}` : null,
    city ? `à ${city}` : null,
  ]
    .filter(Boolean)
    .join(" ");
  return {
    title,
    description:
      property.shortDescription ?? property.description.slice(0, 160),
    openGraph: firstImage ? { images: [firstImage.url] } : undefined,
  };
}

async function safeGet(ref: string): Promise<Property | null> {
  try {
    return await getPropertyByReference(ref);
  } catch {
    return null;
  }
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { reference } = await params;
  // Appel direct (pas de safeGet) : une vraie erreur API doit remonter à
  // error.tsx, seul un 404 (→ null) déclenche notFound().
  const property = await getPropertyByReference(reference);
  if (!property) notFound();

  const isRental = property.transactionType === "LOCATION";
  const city = property.location?.city ?? "";
  const neighborhood = property.location?.neighborhood ?? "";
  const rooms = property.characteristics?.rooms;
  const energy = property.energy;

  const similar = await loadSimilar(property.reference);

  const typeLabel = formatPropertyType(property.propertyType);
  const roomsLabel =
    rooms != null ? ` ${rooms} pièce${rooms > 1 ? "s" : ""}` : "";
  const title = `${typeLabel}${roomsLabel}${city ? ` à ${city}` : ""}`;
  const subline = [neighborhood, city].filter(Boolean).join(" · ");

  return (
    <main className="flex flex-1 flex-col bg-page">
      {/* Breadcrumb */}
      <div className="mx-auto w-full max-w-6xl px-gutter pt-6 md:pt-8">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            {
              label: isRental ? "Louer" : "Acheter",
              href: isRental ? "/louer" : "/acheter",
            },
            ...(city
              ? [
                  {
                    label: city,
                    href: `${isRental ? "/louer" : "/acheter"}?commune=${slugify(city)}`,
                  },
                ]
              : []),
            { label: typeLabel },
          ]}
        />
      </div>

      {/* Corps — galerie (gauche) + carte contact sticky (droite) */}
      <section className="mx-auto w-full max-w-6xl px-gutter pt-6 pb-12 md:pt-8 md:pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
          {/* GAUCHE — galerie + en-tête + caractéristiques + description */}
          <div className="flex min-w-0 flex-col gap-8">
            <PropertyGallery images={property.images} title={title} />

            <PropertyHeader
              property={property}
              title={title}
              subline={subline}
              isRental={isRental}
            />

            {/* Description — editorial body */}
            <article className="flex flex-col gap-3">
              <SectionEyebrow label="Description" />
              <div className="max-w-3xl whitespace-pre-wrap text-[0.95rem] leading-[1.7] text-body md:text-base">
                {property.description}
              </div>
            </article>
          </div>

          {/* RIGHT — sticky aside (price + form) */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
            <PriceCard property={property} isRental={isRental} />
            <PropertyContactForm
              reference={property.reference}
              isRental={isRental}
            />
          </aside>
        </div>
      </section>

      {/* Full-width sections below */}
      <CharacteristicsSection property={property} isRental={isRental} />

      {property.copro?.isInCopro && <CoproSection property={property} />}

      {energy && (energy.energyClass || energy.gesClass) && (
        <EnergySection property={property} />
      )}

      <HonorairesSection property={property} isRental={isRental} />

      <LocationSection property={property} />

      {property.documents && property.documents.length > 0 && (
        <DocumentsSection property={property} />
      )}

      {similar.length > 0 && (
        <SimilarSection similar={similar} isRental={isRental} />
      )}

      <PropertyEstimationCTA />

      <LegalStrip />
    </main>
  );
}

/* ─────────────────────────── Inline UI helpers ─────────────────────────── */

function SectionEyebrow({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-primary-600">
      <span
        aria-hidden="true"
        className="inline-block h-px w-6 bg-primary-600"
      />
      {label}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="flex flex-col gap-3">
      {eyebrow && <SectionEyebrow label={eyebrow} />}
      <h2 className="font-display text-2xl leading-[1.1] tracking-tight text-primary md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm leading-relaxed text-body">
          {description}
        </p>
      )}
    </header>
  );
}

/* ─────────────────────────── Price card (sidebar header) ─────────────────────────── */

function PriceCard({
  property,
  isRental,
}: {
  property: Property;
  isRental: boolean;
}) {
  const f = property.finance;
  const price = f?.price;
  const charges = f?.charges;
  const chargesIncluses = f?.chargesIncluses;
  const depot = f?.depot;
  const pricePerMeter = f?.pricePerMeter;
  const honorairesLabel = honorairesChargeLabel(f);

  return (
    <div className="overflow-hidden rounded-sm border border-subtle bg-card">
      <div className="px-6 pt-5 pb-6">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-subtle">
          {isRental ? "Loyer mensuel" : "Prix de vente"}
        </p>
        <p className="mt-2 font-display text-[2.25rem] leading-[1] tracking-tight text-primary md:text-[2.5rem]">
          {isRental ? formatRent(price) : formatPrice(price)}
        </p>

        <div className="mt-4 flex flex-col gap-1.5 text-xs leading-relaxed text-body">
          {isRental ? (
            <>
              <p>
                {chargesIncluses
                  ? "Charges comprises."
                  : charges != null
                    ? `Hors charges — ${charges} € / mois.`
                    : "Hors charges."}
              </p>
              {depot != null && (
                <p>
                  <span className="text-muted">Dépôt de garantie&nbsp;:</span>{" "}
                  {formatPrice(depot)}
                </p>
              )}
            </>
          ) : (
            <>
              <p>
                {honorairesLabel
                  ? `Honoraires inclus — charge ${honorairesLabel}.`
                  : "Honoraires inclus."}
              </p>
              {pricePerMeter != null && (
                <p>
                  <span className="text-muted">Soit&nbsp;</span>
                  {Math.round(pricePerMeter)} €/m²
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Sections (full-width) ─────────────────────────── */

function CharacteristicsSection({
  property,
  isRental,
}: {
  property: Property;
  isRental: boolean;
}) {
  const c = property.characteristics;
  const a = property.amenities;
  const f = property.finance;

  const general: [string, string][] = [];
  general.push(["Type", formatPropertyType(property.propertyType)]);
  if (c?.surface != null) general.push(["Surface", formatSurface(c.surface)]);
  if (c?.surfaceCarrez != null)
    general.push(["Surface Carrez", formatSurface(c.surfaceCarrez)]);
  if (c?.surfaceTerrain != null)
    general.push(["Terrain", formatSurface(c.surfaceTerrain)]);
  if (c?.rooms != null) general.push(["Pièces", String(c.rooms)]);
  if (c?.floor != null)
    general.push([
      "Étage",
      `${c.floor}${c.totalFloors != null ? ` / ${c.totalFloors}` : ""}`,
    ]);
  if (a?.hasElevator != null)
    general.push(["Ascenseur", a.hasElevator ? "Oui" : "Non"]);

  const interior: [string, string][] = [];
  if (c?.bedrooms != null) interior.push(["Chambres", String(c.bedrooms)]);
  if (c?.bathrooms != null)
    interior.push(["Salle(s) de bain", String(c.bathrooms)]);

  const outdoor: [string, string][] = [];
  if (a?.hasBalcony) outdoor.push(["Balcon", "Oui"]);
  if (a?.hasTerrace) outdoor.push(["Terrasse", "Oui"]);
  if (a?.hasGarden) outdoor.push(["Jardin", "Oui"]);
  if (a?.hasPool) outdoor.push(["Piscine", "Oui"]);
  if (a?.hasParking) outdoor.push(["Parking", "Oui"]);
  if (a?.hasGarage) outdoor.push(["Garage", "Oui"]);
  if (a?.hasCellar) outdoor.push(["Cave", "Oui"]);

  const financial: [string, string][] = [];
  if (isRental) {
    if (f?.charges != null)
      financial.push(["Charges mensuelles", `${f.charges} €`]);
    if (f?.depot != null)
      financial.push(["Dépôt de garantie", formatPrice(f.depot)]);
  } else {
    if (f?.taxeFonciere != null)
      financial.push(["Taxe foncière", `${f.taxeFonciere} € / an`]);
    if (f?.charges != null)
      financial.push(["Charges copro", `${f.charges} € / mois`]);
    if (f?.pricePerMeter != null)
      financial.push(["Prix au m²", `${Math.round(f.pricePerMeter)} €/m²`]);
  }

  const groups: { title: string; rows: [string, string][] }[] = [];
  if (general.length) groups.push({ title: "Général", rows: general });
  if (interior.length) groups.push({ title: "Intérieur", rows: interior });
  if (outdoor.length)
    groups.push({ title: "Extérieur & annexes", rows: outdoor });
  if (financial.length)
    groups.push({
      title: isRental ? "Conditions" : "Copropriété / finances",
      rows: financial,
    });

  const roomsDetails = property.rooms_details ?? [];

  if (groups.length === 0 && roomsDetails.length === 0) return null;

  return (
    <section className="border-t border-subtle bg-section/60">
      <div className="mx-auto w-full max-w-6xl px-gutter py-12 md:py-16">
        <SectionHeading
          eyebrow="Détails"
          title="Caractéristiques du bien"
          description="Tout ce qu'il faut savoir avant la visite — surface, pièces, équipements, charges."
        />
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {groups.map((g) => (
            <div
              key={g.title}
              className="rounded-sm border border-subtle bg-card p-6 shadow-[0_1px_2px_rgba(28,27,25,0.04)]"
            >
              <h3 className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-primary-600">
                {g.title}
              </h3>
              <dl className="mt-4 grid grid-cols-1 gap-2 text-sm">
                {g.rows.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-dotted border-subtle pb-2 last:border-none last:pb-0"
                  >
                    <dt className="text-body">{k}</dt>
                    <dd className="text-right font-medium text-primary">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        {roomsDetails.length > 0 && (
          <div className="mt-6 rounded-sm border border-subtle bg-card p-6">
            <h3 className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-primary-600">
              Pièces principales
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {roomsDetails.map((r) => (
                <li
                  key={r.id}
                  className="flex items-start justify-between gap-4 border-b border-dotted border-subtle pb-2 last:border-none last:pb-0"
                >
                  <div>
                    <p className="font-medium text-primary">{r.name}</p>
                    {r.description && (
                      <p className="text-xs text-body">{r.description}</p>
                    )}
                  </div>
                  <div className="text-xs text-body">
                    {r.surface != null ? `${r.surface} m²` : ""}
                    {r.floor != null ? ` · étage ${r.floor}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function CoproSection({ property }: { property: Property }) {
  const c = property.copro;
  if (!c) return null;
  const rows: [string, string][] = [];
  if (c.coprLots != null) rows.push(["Nombre de lots", String(c.coprLots)]);
  if (c.coprCharges != null)
    rows.push(["Charges annuelles", `${formatPrice(c.coprCharges)} / an`]);
  if (c.lotNumber) rows.push(["Numéro de lot", c.lotNumber]);
  if (c.tantieme != null) rows.push(["Tantièmes", `${c.tantieme} / 10 000`]);
  if (c.coprSyndic) rows.push(["Syndic", c.coprSyndic]);
  if (c.coprChargesDetails)
    rows.push(["Détail des charges", c.coprChargesDetails]);

  return (
    <section className="border-t border-subtle">
      <div className="mx-auto w-full max-w-6xl px-gutter py-12 md:py-16">
        <SectionHeading
          eyebrow="Loi Alur"
          title="Copropriété"
          description="Transparence sur la copropriété dans laquelle se situe le bien."
        />
        {rows.length > 0 && (
          <dl className="mt-8 grid max-w-3xl grid-cols-1 gap-2 rounded-sm border border-subtle bg-card p-6 text-sm">
            {rows.map(([k, v]) => (
              <div
                key={k}
                className="flex items-start justify-between gap-4 border-b border-dotted border-subtle pb-2 last:border-none last:pb-0"
              >
                <dt className="text-body">{k}</dt>
                <dd className="text-right font-medium text-primary">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {c.coprProcedure && (
          <div className="mt-6 max-w-3xl rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong className="font-semibold">
              Procédure en cours sur la copropriété
            </strong>{" "}
            — les informations détaillées vous seront communiquées lors de la
            visite.
          </div>
        )}
      </div>
    </section>
  );
}

function DocumentsSection({ property }: { property: Property }) {
  const docs = property.documents ?? [];
  if (docs.length === 0) return null;
  return (
    <section className="border-t border-subtle bg-section/60">
      <div className="mx-auto w-full max-w-6xl px-gutter py-12 md:py-16">
        <SectionHeading eyebrow="Annexes" title="Documents à télécharger" />
        <ul className="mt-8 grid max-w-3xl grid-cols-1 gap-2 text-sm">
          {docs.map((d) => (
            <li
              key={d.id}
              className="rounded-sm border border-subtle bg-card px-4 py-3 transition-colors hover:border-default"
            >
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2 hover:text-link-hover"
              >
                {d.label ?? d.type ?? "Document"}
              </a>
              {d.type && (
                <span className="ml-2 text-[0.68rem] uppercase tracking-[0.12em] text-subtle">
                  {d.type}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function EnergySection({ property }: { property: Property }) {
  const e = property.energy;
  if (!e) return null;
  const isRentalFG =
    property.transactionType === "LOCATION" &&
    (e.energyClass === "F" || e.energyClass === "G");
  const referenceDate = e.dateReferenceEnergie ?? e.dpeDate;
  const costMin = e.annualEnergyCostMin;
  const costMax = e.annualEnergyCostMax;
  return (
    <section className="border-t border-subtle">
      <div className="mx-auto w-full max-w-6xl px-gutter py-12 md:py-16">
        <SectionHeading eyebrow="Diagnostic" title="Performance énergétique" />
        <div className="mt-8 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          <EnergyScale
            value={e.energyClass}
            label="DPE"
            unit="kWh/m²/an"
            numericValue={e.energyValue}
          />
          <EnergyScale
            value={e.gesClass}
            label="GES"
            unit="kg CO₂/m²/an"
            numericValue={e.gesValue}
          />
        </div>
        <dl className="mt-6 grid max-w-3xl grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {referenceDate && (
            <div className="flex items-center justify-between gap-4 rounded-sm border border-subtle bg-card px-4 py-3">
              <dt className="text-body">Date de référence énergie</dt>
              <dd className="font-medium text-primary">
                {formatDate(referenceDate)}
              </dd>
            </div>
          )}
          {(costMin != null || costMax != null) && (
            <div className="flex items-center justify-between gap-4 rounded-sm border border-subtle bg-card px-4 py-3">
              <dt className="text-body">Coût annuel estimé</dt>
              <dd className="font-medium text-primary">
                {costMin != null && costMax != null
                  ? `${formatPrice(costMin)} – ${formatPrice(costMax)}`
                  : formatPrice(costMin ?? costMax ?? 0)}
              </dd>
            </div>
          )}
        </dl>
        {isRentalFG && (
          <div className="mt-6 max-w-3xl rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            <strong className="font-semibold">
              Loi Climat &amp; Résilience&nbsp;:
            </strong>{" "}
            ce logement est classé {e.energyClass}. Le loyer ne peut pas être
            réévalué entre deux locataires et la mise en location de ce type de
            bien fait l&rsquo;objet d&rsquo;interdictions progressives.
          </div>
        )}
      </div>
    </section>
  );
}

const HONORAIRES_CHARGE_LABEL: Record<HonorairesCharge, string> = {
  ACQUEREUR: "acquéreur",
  VENDEUR: "vendeur",
  PARTAGE: "partagée acquéreur/vendeur",
};

function honorairesChargeLabel(f: Property["finance"]): string | null {
  if (!f) return null;
  if (f.honorairesCharge)
    return HONORAIRES_CHARGE_LABEL[f.honorairesCharge] ?? null;
  if (f.honorairesType) return f.honorairesType.toLowerCase();
  return null;
}

function HonorairesSection({
  property,
  isRental,
}: {
  property: Property;
  isRental: boolean;
}) {
  const f = property.finance;
  return (
    <section className="border-t border-subtle bg-section/60">
      <div className="mx-auto w-full max-w-6xl px-gutter py-12 md:py-16">
        <SectionHeading eyebrow="Frais d'agence" title="Honoraires" />
        <div className="mt-6 max-w-2xl text-sm leading-relaxed text-body">
          {isRental ? (
            <p>
              Honoraires à la charge du locataire&nbsp;: dans la limite des
              plafonds légaux de la loi ALUR (zone tendue).
            </p>
          ) : (
            <p>
              {(() => {
                const label = honorairesChargeLabel(f);
                return label
                  ? `Charge ${label}`
                  : "Honoraires inclus dans le prix affiché";
              })()}
              {f?.honorairesPct != null ? ` — ${f.honorairesPct} % TTC` : ""}
              {f?.honoraires != null
                ? ` (soit ${formatPrice(f.honoraires)} TTC)`
                : ""}
              .
            </p>
          )}
        </div>
        <div className="mt-5">
          <LinkButton href="/honoraires" variant="secondary" size="sm">
            Consulter le barème complet
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

function LocationSection({ property }: { property: Property }) {
  const loc = property.location;
  if (!loc) return null;
  const proximities = property.proximities ?? [];
  return (
    <section className="border-t border-subtle">
      <div className="mx-auto w-full max-w-6xl px-gutter py-12 md:py-16">
        <SectionHeading
          eyebrow="Emplacement"
          title="Localisation"
          description={`Secteur ${loc.city}${loc.neighborhood ? ` — quartier ${loc.neighborhood}` : ""}.`}
        />
        <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-sm border border-subtle bg-section">
          <div className="relative h-full w-full">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(114,1,16,0.10) 0%, rgba(28,27,25,0.05) 40%, transparent 60%)",
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(28,27,25,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,27,25,1) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex items-center justify-center text-muted">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="relative flex h-10 w-10 items-center justify-center">
                  <span
                    className="absolute inset-0 animate-ping rounded-full bg-primary-600/20"
                    aria-hidden="true"
                  />
                  <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-on-primary shadow-md">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </span>
                <p className="text-sm">
                  Zone approximative — {loc.city}
                  {loc.postalCode ? ` (${loc.postalCode})` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          Localisation approximative (rayon d&rsquo;environ 500&nbsp;m).
          L&rsquo;adresse exacte vous est communiquée lors de la prise de
          contact.
        </p>
        {proximities.length > 0 && (
          <div className="mt-10 max-w-3xl">
            <h3 className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-primary-600">
              À proximité
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {proximities.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 rounded-sm border border-subtle bg-card px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-primary">{p.name}</p>
                    {p.category && (
                      <p className="text-xs text-muted">{p.category}</p>
                    )}
                  </div>
                  {p.distance != null && (
                    <span className="text-xs text-body">
                      {p.distance < 1000
                        ? `${p.distance} m`
                        : `${(p.distance / 1000).toFixed(1)} km`}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function SimilarSection({
  similar,
  isRental,
}: {
  similar: Property[];
  isRental: boolean;
}) {
  return (
    <section className="border-t border-subtle bg-section/60">
      <div className="mx-auto w-full max-w-6xl px-gutter py-12 md:py-16">
        <SectionHeading
          eyebrow="Sélection"
          title="Autres biens qui pourraient vous plaire"
        />
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((p) => (
            <li key={p.id}>
              <AutoPropertyCard property={p} />
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <LinkButton
            href={isRental ? "/louer" : "/acheter"}
            variant="secondary"
            size="sm"
          >
            {isRental
              ? "Voir tous les biens à louer"
              : "Voir tous les biens à la vente"}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

function LegalStrip() {
  return (
    <section className="border-t border-subtle bg-page">
      <div className="mx-auto w-full max-w-6xl px-gutter py-6 text-xs leading-relaxed text-body">
        <p>
          Cabinet Rimbault · {AGENT.legal.carteT} · {AGENT.legal.cci} ·{" "}
          {AGENT.legal.garant} · {AGENT.legal.mediator}
        </p>
        <p className="mt-2">
          <a href="/mentions-legales" className="underline underline-offset-2">
            Mentions légales complètes
          </a>
        </p>
      </div>
    </section>
  );
}

async function loadSimilar(reference: string): Promise<Property[]> {
  try {
    return await getSimilarProperties(reference, 3);
  } catch {
    return [];
  }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
