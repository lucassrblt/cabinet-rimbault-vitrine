import { X } from "lucide-react";
import Link from "next/link";
import { COMMUNES } from "@/lib/config/communes";
import type { ListingQuery } from "@/lib/listing";

export type ChipsMode = "sale" | "rent";

interface Props {
  mode: ChipsMode;
  basePath: string;
  query: ListingQuery;
}

const TYPE_LABELS: Record<string, string> = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  VILLA: "Villa",
  TERRAIN: "Terrain",
  LOCAL_COMMERCIAL: "Local pro",
  PARKING: "Parking",
  AUTRE: "Autre",
  LOFT: "Loft",
};

function formatEuro(v: string): string {
  return `${Number(v).toLocaleString("fr-FR")} €`;
}

type Chip = { key: keyof ListingQuery; label: string };

function buildChips(mode: ChipsMode, q: ListingQuery): Chip[] {
  const chips: Chip[] = [];

  if (q.commune) {
    const c = COMMUNES.find((x) => x.slug === q.commune);
    chips.push({ key: "commune", label: c?.name ?? q.commune });
  }
  if (q.type) chips.push({ key: "type", label: TYPE_LABELS[q.type] ?? q.type });
  if (q.pieces) chips.push({ key: "pieces", label: `${q.pieces}+ pièces` });
  if (q.budgetMin)
    chips.push({ key: "budgetMin", label: `≥ ${formatEuro(q.budgetMin)}` });
  if (q.budgetMax)
    chips.push({ key: "budgetMax", label: `≤ ${formatEuro(q.budgetMax)}` });
  if (q.surfaceMin)
    chips.push({ key: "surfaceMin", label: `≥ ${q.surfaceMin} m²` });
  if (q.surfaceMax)
    chips.push({ key: "surfaceMax", label: `≤ ${q.surfaceMax} m²` });
  if (q.balcon === "true") chips.push({ key: "balcon", label: "Balcon" });
  if (q.terrasse === "true") chips.push({ key: "terrasse", label: "Terrasse" });
  if (q.jardin === "true") chips.push({ key: "jardin", label: "Jardin" });
  if (q.cave === "true") chips.push({ key: "cave", label: "Cave" });
  if (q.parking === "true")
    chips.push({ key: "parking", label: "Place de parking" });
  if (q.garage === "true") chips.push({ key: "garage", label: "Garage" });
  if (q.ascenseur === "true")
    chips.push({ key: "ascenseur", label: "Ascenseur" });
  if (mode === "rent" && q.meuble === "true")
    chips.push({ key: "meuble", label: "Meublé" });
  if (q.dpe) chips.push({ key: "dpe", label: `DPE max ${q.dpe}` });
  if (q.hideFG === "true") chips.push({ key: "hideFG", label: "Sans F/G" });

  return chips;
}

function hrefWithout(
  basePath: string,
  q: ListingQuery,
  removeKey: keyof ListingQuery,
): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (!v || k === removeKey || k === "page") continue;
    params.set(k, String(v));
  }
  const qs = params.toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}

export function ActiveFiltersChips({ mode, basePath, query }: Props) {
  const chips = buildChips(mode, query);
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Filtres actifs
      </span>
      <ul className="flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <li key={chip.key}>
            <Link
              href={hrefWithout(basePath, query, chip.key)}
              className="inline-flex items-center gap-1.5 rounded-full border border-default bg-card px-3 py-1 text-xs text-primary transition-colors hover:border-strong hover:bg-section"
              aria-label={`Retirer le filtre ${chip.label}`}
            >
              {chip.label}
              <X className="h-3 w-3" aria-hidden="true" />
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={basePath}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted underline underline-offset-2 hover:text-primary"
          >
            Tout effacer
          </Link>
        </li>
      </ul>
    </div>
  );
}
