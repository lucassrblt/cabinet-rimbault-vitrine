"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChoiceCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  layout?: "vertical" | "horizontal";
  size?: "md" | "sm";
}

/**
 * Carte de choix sélectionnable du tunnel d'estimation.
 * - `vertical`   : icône + texte centrés (grille de catégories — étape 1).
 * - `horizontal` : icône en pastille + texte aligné à gauche (listes compactes).
 * L'indicateur de sélection (coche bordeaux) n'apparaît qu'une fois la carte
 * choisie, pour un signal franc sans redondance visuelle.
 */
export function ChoiceCard({
  selected,
  onClick,
  icon,
  title,
  description,
  layout = "vertical",
  size = "md",
}: ChoiceCardProps) {
  const isVertical = layout === "vertical";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "relative flex w-full rounded-sm border transition-colors duration-200",
        isVertical
          ? "flex-col items-center gap-3 px-4 py-5 text-center"
          : cn(
              "items-start gap-3 text-left",
              size === "sm" ? "px-4 py-3.5" : "px-4 py-4",
            ),
        selected
          ? "border-primary-600 bg-primary-50"
          : "border-subtle bg-card hover:border-default hover:shadow-md",
      )}
    >
      {icon &&
        (isVertical ? (
          <span
            className={cn(
              "transition-colors duration-200",
              selected ? "text-primary-600" : "text-primary",
            )}
          >
            {icon}
          </span>
        ) : (
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
              selected
                ? "bg-primary-600 text-on-primary"
                : "bg-neutral-100 text-neutral-500",
            )}
          >
            {icon}
          </span>
        ))}

      <span
        className={cn(
          "flex flex-col gap-1",
          isVertical ? "items-center" : "flex-1 pr-6",
        )}
      >
        <span
          className={cn(
            "leading-tight text-primary",
            isVertical
              ? "text-[15px] font-semibold"
              : "text-[15px] font-medium",
            size === "sm" && !isVertical && "text-sm",
          )}
        >
          {title}
        </span>
        {description && (
          <span className="text-xs leading-relaxed text-muted">
            {description}
          </span>
        )}
      </span>

      {selected && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-on-primary"
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}
