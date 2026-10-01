import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/api/types";
import {
  mainImage,
  priceLabel,
  propertyPlace,
  propertySurface,
  propertyTitle,
  statusLabel,
} from "@/lib/property";
import { cn } from "@/lib/utils";

type Props = {
  property: Property;
  href: string;
  ratio: string;
  sizes: string;
  className?: string;
  preload?: boolean;
};

export function PropertyCard({
  property: p,
  href,
  ratio,
  sizes,
  className,
  preload,
}: Props) {
  const image = mainImage(p);
  const place = propertyPlace(p);
  const status = statusLabel(p);

  return (
    <Link href={href} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden bg-pierre", ratio)}>
        {image && (
          <Image
            src={image.url}
            alt=""
            fill
            sizes={sizes}
            preload={preload}
            className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
          />
        )}
        {status && (
          <span className="absolute top-3 left-3 bg-blanc px-2.5 py-1 text-mention">
            {status}
          </span>
        )}
      </div>
      <p className="mt-3 text-mention text-gris">
        {place?.neighborhood ? `${place.neighborhood}, ` : ""}
        {place?.city}
      </p>
      <h3 className="titre mt-0.5 text-intertitre transition-colors group-hover:text-rouge">
        {propertyTitle(p)}, {propertySurface(p)}
      </h3>
      <p className="titre mt-0.5 font-semibold">{priceLabel(p)}</p>
    </Link>
  );
}
