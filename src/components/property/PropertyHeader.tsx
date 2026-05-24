"use client";

import { motion } from "framer-motion";
import {
  BedDouble,
  Building2,
  LayoutGrid,
  Leaf,
  type LucideIcon,
  MapPin,
  Maximize2,
  Zap,
} from "lucide-react";
import { EnergyBadge } from "@/components/ui/EnergyRating";
import type { Property } from "@/lib/api/types";
import { EASE, STAGGER_STEP, VIEWPORT } from "@/lib/motion";
import { formatCondition, formatDate, formatFloor } from "@/lib/utils";
import { PropertyBadgesList } from "./PropertyBadges";

/**
 * En-tête de fiche bien — bloc titre + faits clés, sous la galerie.
 *
 * Faits clés en bandeau plat (filets `border-y`, pas d'encadré ni d'ombre) :
 * chaque fait est porté par une icône `primary-600`, valeur en `font-display`.
 * Les informations secondaires (état, équipements…) restent en retrait sur une
 * ligne sobre. Entrée animée en cascade.
 */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_STEP } },
};

const line = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const fact = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

export function PropertyHeader({
  property,
  title,
  subline,
  isRental,
}: {
  property: Property;
  title: string;
  subline: string;
  isRental: boolean;
}) {
  const c = property.characteristics;
  const a = property.amenities;
  const e = property.energy;

  const floorStr = formatFloor(c?.floor);

  // Faits clés chiffrés — chacun porté par une icône.
  const metrics: { icon: LucideIcon; value: string | number; unit?: string }[] =
    [];
  if (c?.surface != null)
    metrics.push({ icon: Maximize2, value: c.surface, unit: "m²" });
  if (c?.rooms != null)
    metrics.push({
      icon: LayoutGrid,
      value: c.rooms,
      unit: `pièce${c.rooms > 1 ? "s" : ""}`,
    });
  if (c?.bedrooms != null && c.bedrooms > 0)
    metrics.push({
      icon: BedDouble,
      value: c.bedrooms,
      unit: `chambre${c.bedrooms > 1 ? "s" : ""}`,
    });
  if (floorStr)
    metrics.push({
      icon: Building2,
      value: floorStr,
      unit: c?.totalFloors != null ? `/ ${c.totalFloors}` : undefined,
    });

  const dpe = e?.energyClass;
  const ges = e?.gesClass;

  // Étiquettes secondaires — état, ameublement, disponibilité, équipements.
  const tags: string[] = [];
  if (property.condition) tags.push(formatCondition(property.condition));
  if (a?.isFurnished) tags.push("Meublé");
  else if (isRental) tags.push("Non meublé");
  const availability = availabilityLabel(property.availableFrom);
  if (availability) tags.push(availability);
  if (a?.hasBalcony) tags.push("Balcon");
  if (a?.hasTerrace) tags.push("Terrasse");
  if (a?.hasGarden) tags.push("Jardin");
  if (a?.hasPool) tags.push("Piscine");
  if (a?.hasParking) tags.push("Parking");
  if (a?.hasGarage) tags.push("Garage");
  if (a?.hasElevator) tags.push("Ascenseur");
  if (a?.hasCellar) tags.push("Cave");

  const showDpe = !!dpe && dpe !== "VIERGE";
  const showGes = !!ges && ges !== "VIERGE";
  const hasBand = metrics.length > 0 || showDpe || showGes;

  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={container}
      className="flex flex-col gap-4"
    >
      <motion.div variants={line} className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-primary-600">
          <span
            aria-hidden="true"
            className="inline-block h-px w-6 bg-primary-600"
          />
          {isRental ? "À louer" : "À vendre"}
        </span>
        <PropertyBadgesList property={property} />
      </motion.div>

      <motion.h1
        variants={line}
        className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-primary"
      >
        {title}
      </motion.h1>

      {subline && (
        <motion.p
          variants={line}
          className="flex items-center gap-2 text-sm text-body"
        >
          <MapPin
            className="h-4 w-4 shrink-0 text-primary-600"
            aria-hidden="true"
          />
          {subline}
        </motion.p>
      )}

      <motion.p
        variants={line}
        className="text-xs uppercase tracking-[0.12em] text-subtle"
      >
        Réf.&nbsp;<span className="text-muted">{property.reference}</span>
        {property.publishedAt
          ? ` · En ligne le ${formatDate(property.publishedAt)}`
          : ""}
      </motion.p>

      {hasBand && (
        <motion.ul
          variants={container}
          className="flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-subtle py-5"
        >
          {metrics.map((m) => (
            <motion.li
              key={`${m.value}-${m.unit}`}
              variants={fact}
              className="flex items-center gap-2.5"
            >
              <m.icon
                className="h-5 w-5 shrink-0 text-primary-600"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>
                <span className="font-display text-lg font-semibold text-primary">
                  {m.value}
                </span>
                {m.unit && (
                  <span className="ml-1 text-sm text-muted">{m.unit}</span>
                )}
              </span>
            </motion.li>
          ))}
          {showDpe && (
            <motion.li variants={fact} className="flex items-center gap-2.5">
              <Zap
                className="h-5 w-5 shrink-0 text-primary-600"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="inline-flex items-center gap-1.5">
                <EnergyBadge kind="DPE" value={dpe} size="md" />
                <span className="text-sm font-medium text-muted">DPE</span>
              </span>
            </motion.li>
          )}
          {showGes && (
            <motion.li variants={fact} className="flex items-center gap-2.5">
              <Leaf
                className="h-5 w-5 shrink-0 text-primary-600"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="inline-flex items-center gap-1.5">
                <EnergyBadge kind="GES" value={ges} size="md" />
                <span className="text-sm font-medium text-muted">GES</span>
              </span>
            </motion.li>
          )}
        </motion.ul>
      )}

      {tags.length > 0 && (
        <motion.p
          variants={line}
          className="text-sm leading-relaxed text-muted"
        >
          {tags.join("  ·  ")}
        </motion.p>
      )}
    </motion.header>
  );
}

function availabilityLabel(iso: string | null): string | null {
  if (!iso) return null;
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return null;
  if (time <= Date.now()) return "Disponible de suite";
  return `Disponible le ${formatDate(iso)}`;
}
