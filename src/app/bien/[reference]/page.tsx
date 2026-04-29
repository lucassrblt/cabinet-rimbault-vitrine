import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VisitRequestForm } from "@/components/forms/VisitRequestForm";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PropertyBadgesList } from "@/components/property/PropertyBadges";
import { SalePropertyCard } from "@/components/property/PropertyCard";
import { PropertyGallery } from "@/components/property/PropertyGallery";
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
  const title = `${formatPropertyType(property.propertyType)} ${city ? `à ${city}` : ""} — ${property.reference}`;
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
  const property = await safeGet(reference);
  if (!property) notFound();

  const isRental = property.transactionType === "LOCATION";
  const city = property.location?.city ?? "";
  const rooms = property.characteristics?.rooms;
  const bedrooms = property.characteristics?.bedrooms;
  const surface = property.characteristics?.surface;
  const floor = property.characteristics?.floor;
  const totalFloors = property.characteristics?.totalFloors;
  const price = property.finance?.price;
  const charges = property.finance?.charges;
  const chargesIncluses = property.finance?.chargesIncluses;
  const depot = property.finance?.depot;
  const honorairesLabel = honorairesChargeLabel(property.finance);
  const energy = property.energy;

  const similar = await loadSimilar(property.reference);

  const typeLabel = formatPropertyType(property.propertyType);
  const title = `${typeLabel}${rooms != null ? ` de ${rooms} pièces` : ""}${city ? ` à ${city}` : ""}`;

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 md:px-6 md:pt-8">
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

      <section className="mx-auto w-full max-w-6xl px-4 pt-6 md:px-6">
        <PropertyGallery images={property.images} title={title} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        <PropertyBadgesList property={property} />
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-body">
          Référence {property.reference}
          {property.publishedAt
            ? ` · Mis en ligne le ${formatDate(property.publishedAt)}`
            : ""}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
          <div>
            <div className="rounded-sm border border-subtle bg-neutral-50/50 p-5">
              {isRental ? (
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-primary">
                    {formatRent(price)}
                  </p>
                  <p className="mt-1 text-sm text-body">
                    {chargesIncluses
                      ? "Charges comprises"
                      : charges != null
                        ? `Hors charges — ${charges} € / mois de charges`
                        : "Hors charges"}
                  </p>
                  <p className="mt-1 text-sm text-body">
                    {depot != null
                      ? `Dépôt de garantie : ${formatPrice(depot)}`
                      : "Dépôt de garantie : voir conditions"}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-primary">
                    {formatPrice(price)}
                  </p>
                  <p className="mt-1 text-sm text-body">
                    {honorairesLabel
                      ? `Honoraires inclus — charge ${honorairesLabel}`
                      : "Honoraires inclus"}
                  </p>
                </div>
              )}
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {surface != null && <StatPill>{formatSurface(surface)}</StatPill>}
              {rooms != null && (
                <StatPill>
                  {rooms} pièce{rooms > 1 ? "s" : ""}
                </StatPill>
              )}
              {bedrooms != null && bedrooms > 0 && (
                <StatPill>{bedrooms} ch.</StatPill>
              )}
              {floor != null && (
                <StatPill>
                  Étage {floor}
                  {totalFloors != null ? ` / ${totalFloors}` : ""}
                </StatPill>
              )}
              {energy?.energyClass && (
                <StatPill>DPE {energy.energyClass}</StatPill>
              )}
            </ul>
          </div>

          <div className="rounded-sm border border-subtle bg-card p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Contact direct
            </p>
            <p className="mt-2 text-base font-semibold text-primary">
              {AGENT.fullName}
            </p>
            <p className="text-xs text-muted">{AGENT.title}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`tel:${AGENT.phoneE164}`}
                className="inline-flex items-center gap-2 rounded-sm bg-primary-600 px-3 py-2 text-sm font-medium text-on-primary hover:bg-primary-700"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Appeler
              </a>
              <a
                href={`mailto:${AGENT.email}?subject=Bien ${property.reference}`}
                className="inline-flex items-center gap-2 rounded-sm border border-default px-3 py-2 text-sm font-medium"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-subtle">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Description</h2>
          <div className="mt-4 max-w-3xl whitespace-pre-wrap text-sm text-primary md:text-base">
            {property.description}
          </div>
        </div>
      </section>

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

      <VisitFormSection reference={property.reference} isRental={isRental} />

      {similar.length > 0 && (
        <SimilarSection similar={similar} isRental={isRental} />
      )}

      <LegalStrip />
    </main>
  );
}

function StatPill({ children }: { children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center rounded-full border border-subtle bg-card px-3 py-1 text-sm text-primary">
      {children}
    </li>
  );
}

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
    <section className="border-t border-subtle bg-neutral-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Caractéristiques
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {groups.map((g) => (
            <div
              key={g.title}
              className="rounded-sm border border-subtle bg-card p-5"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                {g.title}
              </h3>
              <dl className="mt-3 grid grid-cols-1 gap-1.5 text-sm">
                {g.rows.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-4 border-b border-subtle pb-1.5 last:border-none"
                  >
                    <dt className="text-body">{k}</dt>
                    <dd className="font-medium text-primary">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        {roomsDetails.length > 0 && (
          <div className="mt-6 rounded-sm border border-subtle bg-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Pièces
            </h3>
            <ul className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {roomsDetails.map((r) => (
                <li
                  key={r.id}
                  className="flex items-start justify-between gap-4 border-b border-subtle pb-1.5 last:border-none"
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
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Copropriété</h2>
        <p className="mt-2 max-w-2xl text-sm text-body">
          Informations Alur — transparence sur la copropriété dans laquelle se
          situe le bien.
        </p>
        {rows.length > 0 && (
          <dl className="mt-6 grid max-w-3xl grid-cols-1 gap-1.5 rounded-sm border border-subtle bg-card p-5 text-sm">
            {rows.map(([k, v]) => (
              <div
                key={k}
                className="flex items-start justify-between gap-4 border-b border-subtle pb-1.5 last:border-none"
              >
                <dt className="text-body">{k}</dt>
                <dd className="text-right font-medium text-primary">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {c.coprProcedure && (
          <div className="mt-4 max-w-3xl rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
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
    <section className="border-t border-subtle bg-neutral-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Documents à télécharger
        </h2>
        <ul className="mt-6 grid max-w-3xl grid-cols-1 gap-2 text-sm">
          {docs.map((d) => (
            <li
              key={d.id}
              className="rounded-sm border border-subtle bg-card px-4 py-3"
            >
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2"
              >
                {d.label ?? d.type ?? "Document"}
              </a>
              {d.type && (
                <span className="ml-2 text-xs uppercase text-muted">
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
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Performance énergétique
        </h2>
        <div className="mt-6 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
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
        <dl className="mt-6 grid max-w-3xl grid-cols-1 gap-2 text-sm text-body sm:grid-cols-2">
          {referenceDate && (
            <div className="flex items-center justify-between gap-4 rounded-sm border border-subtle bg-card px-3 py-2">
              <dt className="text-body">Date de référence énergie</dt>
              <dd className="font-medium text-primary">
                {formatDate(referenceDate)}
              </dd>
            </div>
          )}
          {(costMin != null || costMax != null) && (
            <div className="flex items-center justify-between gap-4 rounded-sm border border-subtle bg-card px-3 py-2">
              <dt className="text-body">Coût annuel estimé</dt>
              <dd className="font-medium text-primary">
                {costMin != null && costMax != null
                  ? `Entre ${formatPrice(costMin)} et ${formatPrice(costMax)}`
                  : formatPrice(costMin ?? costMax ?? 0)}
              </dd>
            </div>
          )}
        </dl>
        {isRentalFG && (
          <div className="mt-6 max-w-3xl rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            <strong className="font-semibold">
              Loi Climat &amp; Résilience :
            </strong>{" "}
            ce logement est classé {e.energyClass}. Le loyer ne peut pas être
            réévalué entre deux locataires et la mise en location de ce type de
            bien fait l&apos;objet d&apos;interdictions progressives.
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
    <section className="border-t border-subtle bg-neutral-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Honoraires</h2>
        <div className="mt-4 max-w-2xl text-sm text-primary">
          {isRental ? (
            <p>
              Honoraires à la charge du locataire : dans la limite des plafonds
              légaux de la loi ALUR (zone tendue).
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
        <div className="mt-4">
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
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Localisation</h2>
        <p className="mt-2 text-sm text-body">
          Secteur {loc.city}
          {loc.neighborhood ? ` — quartier ${loc.neighborhood}` : ""}
        </p>
        <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-sm border border-subtle bg-section">
          <div className="relative h-full w-full">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(24,24,27,0.18) 0%, rgba(24,24,27,0.05) 40%, transparent 60%)",
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex items-center justify-center text-muted">
              <div className="flex flex-col items-center gap-2 text-center">
                <MapPin className="h-8 w-8" aria-hidden="true" />
                <p className="text-sm">
                  Zone approximative — {loc.city}
                  {loc.postalCode ? ` (${loc.postalCode})` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          Localisation approximative (rayon d&apos;environ 500 m).
          L&apos;adresse exacte vous est communiquée lors de la prise de
          contact.
        </p>
        {proximities.length > 0 && (
          <div className="mt-8 max-w-3xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              À proximité
            </h3>
            <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {proximities.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 rounded-sm border border-subtle bg-card px-3 py-2 text-sm"
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

function VisitFormSection({
  reference,
  isRental,
}: {
  reference: string;
  isRental: boolean;
}) {
  return (
    <section className="border-t border-subtle bg-neutral-50/50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Ce bien vous intéresse ?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-body">
          Remplissez le formulaire ci-dessous — je vous recontacte sous 24 h
          ouvrées pour convenir d&apos;un créneau de visite.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
          <div className="rounded-sm border border-subtle bg-card p-5">
            <p className="text-sm font-semibold text-primary">
              {AGENT.fullName}
            </p>
            <p className="text-xs text-muted">{AGENT.title}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`tel:${AGENT.phoneE164}`}
                className="inline-flex items-center gap-2 rounded-sm bg-primary-600 px-3 py-2 text-sm font-medium text-on-primary hover:bg-primary-700"
              >
                <Phone className="h-4 w-4" aria-hidden="true" /> Appeler
              </a>
              <a
                href={`mailto:${AGENT.email}?subject=Bien ${reference}`}
                className="inline-flex items-center gap-2 rounded-sm border border-default px-3 py-2 text-sm font-medium"
              >
                <Mail className="h-4 w-4" aria-hidden="true" /> Email
              </a>
            </div>
            <p className="mt-4 text-xs text-muted">
              Référence du bien : <strong>{reference}</strong>
            </p>
          </div>
          <div className="rounded-sm border border-subtle bg-card p-5">
            <VisitRequestForm reference={reference} isRental={isRental} />
          </div>
        </div>
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
    <section className="border-t border-subtle">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Autres biens qui pourraient vous plaire
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((p) => (
            <li key={p.id}>
              <SalePropertyCard property={p} />
            </li>
          ))}
        </ul>
        <div className="mt-6">
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
      <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-body md:px-6">
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
