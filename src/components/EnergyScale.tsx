import type { EnergyClass } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const CLASSES = ["A", "B", "C", "D", "E", "F", "G"] as const;

const COLORS = {
  dpe: [
    "#009c6d",
    "#52b153",
    "#a5cc74",
    "#f4e70f",
    "#f0b50f",
    "#eb8235",
    "#d7221f",
  ],
  ges: [
    "#f6edfd",
    "#e4c7fa",
    "#d4a9f6",
    "#cb95f3",
    "#ba72ef",
    "#a74dea",
    "#8a2be2",
  ],
};

type Props = {
  kind: "dpe" | "ges";
  value: EnergyClass | null;
  amount: number | null;
  className?: string;
};

/** Échelle DPE ou GES, la classe du bien mise en évidence. */
export function EnergyScale({ kind, value, amount, className }: Props) {
  const label =
    kind === "dpe"
      ? "Performance énergétique (DPE)"
      : "Émissions de gaz à effet de serre (GES)";
  const unit = kind === "dpe" ? "kWh/m²/an" : "kg CO₂/m²/an";

  if (!value || value === "VIERGE") {
    return (
      <div className={className}>
        <p className="font-medium">{label}</p>
        <p className="mt-1 opacity-70">Diagnostic vierge ou non communiqué.</p>
      </div>
    );
  }

  return (
    <figure className={className}>
      <figcaption className="font-medium">{label}</figcaption>
      <ol className="mt-3 space-y-1" aria-label={`${label} : classe ${value}`}>
        {CLASSES.map((c, i) => {
          const active = c === value;
          return (
            <li key={c} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-6 items-center px-2 text-xs font-semibold",
                  kind === "ges" && i < 4 ? "text-[#3b2a4d]" : "text-white",
                  kind === "dpe" && (i === 3 || i === 4) && "text-[#3a3300]",
                  !active && "opacity-35",
                )}
                style={{
                  width: `${2.25 + i * 0.75}rem`,
                  background: COLORS[kind][i],
                }}
                aria-hidden={!active}
              >
                {c}
              </span>
              {active && amount != null && (
                <span className="text-sm tabular-nums">
                  {amount} {unit}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
