import type { EnergyClass } from "@/lib/api/types";

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
};

/** Échelle compacte : la classe du bien ressort, les autres s'effacent. */
export function EnergyCompact({ kind, value, amount }: Props) {
  const label =
    kind === "dpe"
      ? "Diagnostic de performance énergétique"
      : "Émissions de gaz à effet de serre";
  const unit = kind === "dpe" ? "kWh/m²/an" : "kg CO₂/m²/an";

  if (!value || value === "VIERGE") {
    return (
      <div>
        <p className="text-mention text-gris">{label}</p>
        <p className="mt-2">Diagnostic vierge ou non communiqué</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-mention text-gris">{label}</p>
      <div
        className="mt-3 flex items-end gap-0.5"
        role="img"
        aria-label={`Classe ${value}${amount != null ? `, ${amount} ${unit}` : ""}`}
      >
        {CLASSES.map((c, i) => (
          <span
            key={c}
            className={`flex flex-1 items-center justify-center text-[0.8125rem] font-semibold text-[#222] ${c === value ? "h-10" : "h-6 opacity-30"}`}
            style={{ background: COLORS[kind][i] }}
          >
            {c === value ? c : ""}
          </span>
        ))}
      </div>
      {amount != null && (
        <p className="mt-2 text-mention">
          {amount} {unit}
        </p>
      )}
    </div>
  );
}
