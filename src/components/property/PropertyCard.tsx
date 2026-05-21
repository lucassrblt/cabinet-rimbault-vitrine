import { ArrowRight, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EnergyBadge } from "@/components/ui/EnergyRating";
import type { Property } from "@/lib/api/types";
import {
  formatFloor,
  formatPrice,
  formatPropertyType,
  formatRent,
  formatSurface,
  PHOTO_BLUR_DATA_URL,
} from "@/lib/utils";
import { PropertyBadgesList } from "./PropertyBadges";

function MainImage({ property }: { property: Property }) {
  const main =
    property.images.find((img) => img.isMain) ??
    property.images.slice().sort((a, b) => a.order - b.order)[0];
  if (!main) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-section text-muted">
        <ImageIcon className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }
  return (
    <Image
      src={main.url}
      alt={main.alt ?? property.title}
      fill
      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
      placeholder="blur"
      blurDataURL={PHOTO_BLUR_DATA_URL}
      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
    />
  );
}

function CardShell({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  const cls =
    "group flex h-full flex-col overflow-hidden rounded-lg border border-transparent bg-card shadow-md";
  if (!href) return <div className={cls}>{children}</div>;
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

function CityLine({ property }: { property: Property }) {
  const city = property.location?.city;
  const neighborhood = property.location?.neighborhood;
  if (!city) return null;
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
      {city}
      {neighborhood && ` – ${neighborhood}`}
    </p>
  );
}

function buildDescriptiveTitle(property: Property): string {
  const parts: string[] = [];
  const rooms = property.characteristics?.rooms;

  if (rooms != null) parts.push(`${rooms} pièce${rooms > 1 ? "s" : ""}`);

  const features = getFeatureLabels(property);
  for (const f of features.slice(0, 2)) parts.push(f);

  if (parts.length === 0) {
    parts.push(formatPropertyType(property.propertyType));
  }

  return parts.join(" - ");
}

function getFeatureLabels(property: Property): string[] {
  const a = property.amenities;
  if (!a) return [];
  const list: string[] = [];
  if (a.hasTerrace) list.push("Terrasse");
  if (a.hasBalcony) list.push("Balcon");
  if (a.hasGarden) list.push("Jardin");
  if (a.hasParking || a.hasGarage)
    list.push(a.hasGarage ? "Garage" : "Parking");
  if (a.hasCellar) list.push("Cave");
  return list;
}

function buildMetaLine(property: Property): string | null {
  const surface = property.characteristics?.surface;
  const floor = property.characteristics?.floor;
  const parts: string[] = [];

  if (surface != null) parts.push(formatSurface(surface));

  const floorLabel = formatFloor(floor);
  if (floorLabel && property.propertyType === "APPARTEMENT") {
    parts.push(floorLabel);
  }

  return parts.length > 0 ? parts.join(" • ") : null;
}

function EnergyOverlay({ property }: { property: Property }) {
  const dpe = property.energy?.energyClass;
  const ges = property.energy?.gesClass;
  return (
    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-white/90 px-1.5 py-1 backdrop-blur-sm">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
        DPE
      </span>
      <EnergyBadge value={dpe} />
      <span className="ml-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
        GES
      </span>
      <EnergyBadge value={ges} />
    </div>
  );
}

function ActionChip() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-600 text-on-primary transition-colors duration-200 group-hover:bg-primary-700"
    >
      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
    </span>
  );
}

export function SalePropertyCard({ property }: { property: Property }) {
  const price = property.finance?.price;
  const meta = buildMetaLine(property);

  return (
    <CardShell href={`/bien/${property.reference}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-section">
        <MainImage property={property} />
        <div className="absolute left-2.5 top-2.5">
          <PropertyBadgesList property={property} />
        </div>
        <EnergyOverlay property={property} />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <CityLine property={property} />
        <p className="mt-1 text-sm font-semibold text-primary">
          {buildDescriptiveTitle(property)}
        </p>
        {meta && <p className="text-xs text-muted">{meta}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-lg font-bold tracking-tight text-primary">
            {formatPrice(price)}
          </p>
          <ActionChip />
        </div>
      </div>
    </CardShell>
  );
}

export function RentPropertyCard({ property }: { property: Property }) {
  const price = property.finance?.price;
  const charges = property.finance?.charges;
  const chargesIncluses = property.finance?.chargesIncluses;
  const energy = property.energy?.energyClass;
  const isFG = energy === "F" || energy === "G";
  const meta = buildMetaLine(property);

  return (
    <CardShell href={`/bien/${property.reference}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-section">
        <MainImage property={property} />
        <div className="absolute left-2.5 top-2.5">
          <PropertyBadgesList property={property} />
        </div>
        <EnergyOverlay property={property} />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <CityLine property={property} />
        <p className="mt-1 text-sm font-semibold text-primary">
          {buildDescriptiveTitle(property)}
        </p>
        {meta && <p className="text-xs text-muted">{meta}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div>
            <p className="text-lg font-bold tracking-tight text-primary">
              {formatRent(price)}
            </p>
            <p className="text-xs text-muted">
              {chargesIncluses
                ? "Charges comprises"
                : charges != null
                  ? `+ ${charges} € de charges`
                  : "Hors charges"}
            </p>
          </div>
          <ActionChip />
        </div>
        {isFG && (
          <div className="mt-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-800">
            {energy === "F"
              ? "⚠ Loi Climat : loyer gelé entre deux locataires"
              : "⚠ Loi Climat : restrictions de mise en location"}
          </div>
        )}
      </div>
    </CardShell>
  );
}

export function SoldPropertyCard({ property }: { property: Property }) {
  const city = property.location?.city ?? "—";
  const surface = property.characteristics?.surface;
  const rooms = property.characteristics?.rooms;
  const status = property.status;
  const label = status === "LOUE" ? "Loué" : "Vendu";

  return (
    <CardShell>
      <div className="relative aspect-[4/3] overflow-hidden bg-section">
        <MainImage property={property} />
        <div className="absolute left-2 top-2">
          <Badge tone="neutral">{label}</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-5">
        <p className="text-sm font-medium text-primary">{city}</p>
        <p className="text-sm text-body">
          {formatPropertyType(property.propertyType)} · {formatSurface(surface)}
          {rooms != null && ` · ${rooms} pièce${rooms > 1 ? "s" : ""}`}
        </p>
      </div>
    </CardShell>
  );
}

export function AutoPropertyCard({ property }: { property: Property }) {
  if (property.transactionType === "LOCATION") {
    return <RentPropertyCard property={property} />;
  }
  return <SalePropertyCard property={property} />;
}
