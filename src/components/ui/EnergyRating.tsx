import type { EnergyClass } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const LETTERS: EnergyClass[] = ["A", "B", "C", "D", "E", "F", "G"];

const COLORS: Record<Exclude<EnergyClass, "VIERGE">, string> = {
  A: "bg-emerald-600 text-white",
  B: "bg-emerald-500 text-white",
  C: "bg-lime-500 text-primary",
  D: "bg-yellow-400 text-primary",
  E: "bg-orange-400 text-white",
  F: "bg-orange-600 text-white",
  G: "bg-red-600 text-white",
};

export function EnergyBadge({
  value,
  size = "sm",
  kind = "DPE",
}: {
  value: EnergyClass | null | undefined;
  size?: "sm" | "md";
  kind?: "DPE" | "GES";
}) {
  if (!value || value === "VIERGE") {
    return (
      <span className="inline-flex items-center rounded-sm border border-subtle px-2 py-0.5 text-xs text-muted">
        {kind} —
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-sm font-semibold",
        COLORS[value as Exclude<EnergyClass, "VIERGE">],
        size === "md" ? "h-7 w-7 text-sm" : "h-5 px-1.5 text-xs",
      )}
      role="img"
      aria-label={`${kind} ${value}`}
    >
      {value}
    </span>
  );
}

export function EnergyScale({
  value,
  label,
  unit,
  numericValue,
}: {
  value: EnergyClass | null | undefined;
  label: "DPE" | "GES";
  unit: string;
  numericValue: number | null | undefined;
}) {
  const activeLetter = value && value !== "VIERGE" ? value : null;
  return (
    <div>
      <p className="text-sm font-semibold text-primary">{label}</p>
      <ul className="mt-2 flex flex-col gap-0.5">
        {LETTERS.map((letter) => {
          if (letter === "VIERGE") return null;
          const l = letter as Exclude<EnergyClass, "VIERGE">;
          const isActive = l === activeLetter;
          return (
            <li
              key={l}
              className={cn(
                "flex items-center justify-between rounded-sm px-3 py-1 text-sm font-medium",
                COLORS[l],
                !isActive && "opacity-40",
              )}
              aria-current={isActive ? "true" : undefined}
            >
              <span>{l}</span>
              {isActive && (
                <span className="text-xs font-normal">
                  {numericValue != null ? `${numericValue} ${unit}` : unit}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
