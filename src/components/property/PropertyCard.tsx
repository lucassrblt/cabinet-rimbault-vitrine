import {
  ArrowUpDown,
  Car,
  Fence,
  Heart,
  Image as ImageIcon,
  LayoutGrid,
  Maximize2,
  Shrub,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Property } from "@/lib/api/types";
import {
  formatFloor,
  formatPrice,
  formatPropertyType,
  formatRent,
  formatSurface,
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
    // biome-ignore lint/performance/noImgElement: remote image host not pre-configured at MVP
    <img
      src={main.url}
      alt={main.alt ?? property.title}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
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
    "group flex h-full flex-col overflow-hidden rounded-sm border border-subtle bg-card transition-shadow duration-200 hover:shadow-md";
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
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-600">
      {city}
      {neighborhood && ` – ${neighborhood}`}
    </p>
  );
}

function buildDescriptiveTitle(property: Property): string {
  const parts: string[] = [];
  const rooms = property.characteristics?.rooms;
  const surface = property.characteristics?.surface;
  const floor = property.characteristics?.floor;

  if (rooms != null) parts.push(`${rooms} pièce${rooms > 1 ? "s" : ""}`);
  if (surface != null) parts.push(`${surface} m²`);

  const floorLabel = formatFloor(floor);
  if (floorLabel && property.propertyType === "APPARTEMENT") {
    parts.push(floorLabel);
  } else if (
    property.propertyType === "MAISON" ||
    property.propertyType === "VILLA"
  ) {
    parts.push("Maison");
  } else {
    const feature = getFirstFeatureLabel(property);
    if (feature) parts.push(feature);
  }

  return parts.join(" – ");
}

function getFirstFeatureLabel(property: Property): string | null {
  const a = property.amenities;
  if (!a) return null;
  if (a.hasTerrace) return "Terrasse";
  if (a.hasBalcony) return "Balcon";
  if (a.hasGarden) return "Jardin";
  if (a.hasParking) return "Parking";
  if (a.hasElevator) return "Ascenseur";
  if (a.hasCellar) return "Cave";
  if (a.hasGarage) return "Garage";
  return null;
}

type FeaturePill = { label: string; icon: React.ElementType };

function getFeaturePills(property: Property): FeaturePill[] {
  const pills: FeaturePill[] = [];
  const rooms = property.characteristics?.rooms;
  const surface = property.characteristics?.surface;

  if (rooms != null)
    pills.push({
      label: `${rooms} pièce${rooms > 1 ? "s" : ""}`,
      icon: LayoutGrid,
    });
  if (surface != null) pills.push({ label: `${surface} m²`, icon: Maximize2 });

  const a = property.amenities;
  if (a?.hasElevator) pills.push({ label: "Ascenseur", icon: ArrowUpDown });
  else if (a?.hasParking) pills.push({ label: "Parking", icon: Car });
  else if (a?.hasGarden) pills.push({ label: "Jardin", icon: Shrub });
  else if (a?.hasCellar) pills.push({ label: "Cave", icon: Warehouse });
  else if (a?.hasBalcony) pills.push({ label: "Balcon", icon: Fence });

  return pills;
}

export function SalePropertyCard({ property }: { property: Property }) {
  const price = property.finance?.price;

  return (
    <CardShell href={`/bien/${property.reference}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-section">
        <MainImage property={property} />
        <div className="absolute left-2.5 top-2.5">
          <PropertyBadgesList property={property} />
        </div>
        <div className="absolute right-2.5 top-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-sm backdrop-blur-sm">
            <Heart className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <CityLine property={property} />
        <p className="text-sm text-body">{buildDescriptiveTitle(property)}</p>
        <p className="text-lg font-bold tracking-tight text-primary">
          {formatPrice(price)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {getFeaturePills(property).map((pill) => (
            <span
              key={pill.label}
              className="inline-flex items-center gap-1 text-xs text-muted"
            >
              <pill.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {pill.label}
            </span>
          ))}
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

  return (
    <CardShell href={`/bien/${property.reference}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-section">
        <MainImage property={property} />
        <div className="absolute left-2.5 top-2.5">
          <PropertyBadgesList property={property} />
        </div>
        <div className="absolute right-2.5 top-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-sm backdrop-blur-sm">
            <Heart className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <CityLine property={property} />
        <p className="text-sm text-body">{buildDescriptiveTitle(property)}</p>
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
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {getFeaturePills(property).map((pill) => (
            <span
              key={pill.label}
              className="inline-flex items-center gap-1 text-xs text-muted"
            >
              <pill.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {pill.label}
            </span>
          ))}
        </div>
        {isFG && (
          <div className="mt-1 rounded-sm border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-800">
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
      <div className="flex flex-col gap-1 p-4">
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
