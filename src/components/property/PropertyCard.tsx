import { Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { EnergyBadge } from "@/components/ui/EnergyRating";
import type { Property } from "@/lib/api/types";
import {
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
      className="h-full w-full object-cover"
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
    "group flex h-full flex-col overflow-hidden rounded-sm border border-subtle bg-card transition hover:border-strong";
  if (!href) return <div className={cls}>{children}</div>;
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function SalePropertyCard({ property }: { property: Property }) {
  const city = property.location?.city ?? "—";
  const surface = property.characteristics?.surface;
  const rooms = property.characteristics?.rooms;
  const price = property.finance?.price;
  const energy = property.energy?.energyClass;

  return (
    <CardShell href={`/bien/${property.reference}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-section">
        <MainImage property={property} />
        <div className="absolute left-2 top-2">
          <PropertyBadgesList property={property} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-lg font-semibold tracking-tight text-primary">
          {formatPrice(price)}
        </p>
        <p className="text-sm font-medium text-primary">{city}</p>
        <p className="text-sm text-body">
          {formatPropertyType(property.propertyType)} · {formatSurface(surface)}
          {rooms != null && ` · ${rooms} pièce${rooms > 1 ? "s" : ""}`}
        </p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-xs text-muted">Réf. {property.reference}</span>
          <EnergyBadge value={energy} />
        </div>
      </div>
    </CardShell>
  );
}

export function RentPropertyCard({ property }: { property: Property }) {
  const city = property.location?.city ?? "—";
  const surface = property.characteristics?.surface;
  const rooms = property.characteristics?.rooms;
  const price = property.finance?.price;
  const charges = property.finance?.charges;
  const chargesIncluses = property.finance?.chargesIncluses;
  const energy = property.energy?.energyClass;
  const isFG = energy === "F" || energy === "G";

  return (
    <CardShell href={`/bien/${property.reference}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-section">
        <MainImage property={property} />
        <div className="absolute left-2 top-2">
          <PropertyBadgesList property={property} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <p className="text-lg font-semibold tracking-tight text-primary">
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
        <p className="text-sm font-medium text-primary">{city}</p>
        <p className="text-sm text-body">
          {formatPropertyType(property.propertyType)} · {formatSurface(surface)}
          {rooms != null && ` · ${rooms} pièce${rooms > 1 ? "s" : ""}`}
        </p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-xs text-muted">Réf. {property.reference}</span>
          <EnergyBadge value={energy} />
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
