import { X } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { SelectInput } from "@/components/ui/FormField";
import { COMMUNES } from "@/lib/config/communes";

export type ListingMode = "sale" | "rent";

export interface ListingFilters {
  type?: string;
  commune?: string;
  pieces?: string;
  budgetMin?: string;
  budgetMax?: string;
  surfaceMin?: string;
  surfaceMax?: string;
  sort?: string;
  page?: string;
  meuble?: string;
  dpe?: string;
}

const SALE_TYPES = [
  { value: "", label: "Tous types" },
  { value: "APPARTEMENT", label: "Appartement" },
  { value: "MAISON", label: "Maison" },
  { value: "TERRAIN", label: "Terrain" },
  { value: "LOCAL_COMMERCIAL", label: "Local pro" },
  { value: "PARKING", label: "Parking" },
  { value: "AUTRE", label: "Autre" },
];

const RENT_TYPES = [
  { value: "", label: "Tous types" },
  { value: "APPARTEMENT", label: "Appartement" },
  { value: "MAISON", label: "Maison" },
  { value: "LOCAL_COMMERCIAL", label: "Local pro" },
  { value: "PARKING", label: "Parking" },
  { value: "AUTRE", label: "Autre" },
];

const ROOMS = [
  { value: "", label: "Pièces" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

const SALE_BUDGETS_MIN = [
  "",
  "100000",
  "200000",
  "300000",
  "500000",
  "800000",
  "1200000",
];
const SALE_BUDGETS_MAX = [
  "",
  "200000",
  "400000",
  "600000",
  "900000",
  "1500000",
  "2500000",
];

const RENT_BUDGETS_MIN = ["", "500", "1000", "1500", "2000", "3000"];
const RENT_BUDGETS_MAX = ["", "1000", "1500", "2000", "3000", "5000"];

const SURFACES = ["", "30", "50", "70", "90", "120", "150", "200"];

function formatEuro(v: string): string {
  if (!v) return "—";
  return `${Number(v).toLocaleString("fr-FR")} €`;
}
function formatM2(v: string): string {
  if (!v) return "—";
  return `${v} m²`;
}

export function FilterBar({
  mode,
  filters,
  basePath,
}: {
  mode: ListingMode;
  filters: ListingFilters;
  basePath: string;
}) {
  const types = mode === "sale" ? SALE_TYPES : RENT_TYPES;
  const budgetsMin = mode === "sale" ? SALE_BUDGETS_MIN : RENT_BUDGETS_MIN;
  const budgetsMax = mode === "sale" ? SALE_BUDGETS_MAX : RENT_BUDGETS_MAX;
  const budgetLabel = mode === "sale" ? "Budget" : "Loyer";

  return (
    <form method="GET" action={basePath} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        <SelectInput
          name="type"
          defaultValue={filters.type ?? ""}
          aria-label="Type"
        >
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          name="commune"
          defaultValue={filters.commune ?? ""}
          aria-label="Commune"
        >
          <option value="">Toutes communes</option>
          {COMMUNES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          name="pieces"
          defaultValue={filters.pieces ?? ""}
          aria-label="Pièces"
        >
          {ROOMS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </SelectInput>
        <div className="grid grid-cols-2 gap-1.5">
          <SelectInput
            name="budgetMin"
            defaultValue={filters.budgetMin ?? ""}
            aria-label={`${budgetLabel} min`}
          >
            {budgetsMin.map((b) => (
              <option key={b} value={b}>
                {b === "" ? `${budgetLabel} min` : formatEuro(b)}
              </option>
            ))}
          </SelectInput>
          <SelectInput
            name="budgetMax"
            defaultValue={filters.budgetMax ?? ""}
            aria-label={`${budgetLabel} max`}
          >
            {budgetsMax.map((b) => (
              <option key={b} value={b}>
                {b === "" ? `${budgetLabel} max` : formatEuro(b)}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <SelectInput
            name="surfaceMin"
            defaultValue={filters.surfaceMin ?? ""}
            aria-label="Surface min"
          >
            {SURFACES.map((s) => (
              <option key={`smin-${s}`} value={s}>
                {s === "" ? "Surface min" : formatM2(s)}
              </option>
            ))}
          </SelectInput>
          <SelectInput
            name="surfaceMax"
            defaultValue={filters.surfaceMax ?? ""}
            aria-label="Surface max"
          >
            {SURFACES.map((s) => (
              <option key={`smax-${s}`} value={s}>
                {s === "" ? "Surface max" : formatM2(s)}
              </option>
            ))}
          </SelectInput>
        </div>
      </div>
      {filters.sort && <input type="hidden" name="sort" value={filters.sort} />}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Appliquer
        </button>
        {hasActive(filters) && (
          <LinkButton href={basePath} variant="ghost" size="sm">
            <X className="h-3.5 w-3.5" aria-hidden="true" /> Réinitialiser
          </LinkButton>
        )}
      </div>

      <ActiveChips mode={mode} filters={filters} basePath={basePath} />
    </form>
  );
}

function hasActive(filters: ListingFilters): boolean {
  return Boolean(
    filters.type ||
      filters.commune ||
      filters.pieces ||
      filters.budgetMin ||
      filters.budgetMax ||
      filters.surfaceMin ||
      filters.surfaceMax ||
      filters.meuble ||
      filters.dpe,
  );
}

function ActiveChips({
  mode: _mode,
  filters,
  basePath,
}: {
  mode: ListingMode;
  filters: ListingFilters;
  basePath: string;
}) {
  const chips: { key: keyof ListingFilters; label: string }[] = [];
  if (filters.type)
    chips.push({ key: "type", label: readableType(filters.type) });
  if (filters.commune) {
    const c = COMMUNES.find((x) => x.slug === filters.commune);
    chips.push({ key: "commune", label: c?.name ?? filters.commune });
  }
  if (filters.pieces)
    chips.push({ key: "pieces", label: `${filters.pieces}+ pièces` });
  if (filters.budgetMin)
    chips.push({
      key: "budgetMin",
      label: `≥ ${formatEuro(filters.budgetMin)}`,
    });
  if (filters.budgetMax)
    chips.push({
      key: "budgetMax",
      label: `≤ ${formatEuro(filters.budgetMax)}`,
    });
  if (filters.surfaceMin)
    chips.push({ key: "surfaceMin", label: `≥ ${filters.surfaceMin} m²` });
  if (filters.surfaceMax)
    chips.push({ key: "surfaceMax", label: `≤ ${filters.surfaceMax} m²` });
  if (filters.meuble === "true") chips.push({ key: "meuble", label: "Meublé" });
  if (filters.dpe) chips.push({ key: "dpe", label: `DPE ${filters.dpe}` });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(filters)) {
          if (v && k !== chip.key) params.set(k, String(v));
        }
        const href = `${basePath}${params.size ? `?${params.toString()}` : ""}`;
        return (
          <Link
            key={chip.key}
            href={href}
            className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs text-zinc-800 hover:border-zinc-900"
          >
            {chip.label}
            <X className="h-3 w-3" aria-hidden="true" />
          </Link>
        );
      })}
    </div>
  );
}

function readableType(v: string): string {
  const m: Record<string, string> = {
    APPARTEMENT: "Appartement",
    MAISON: "Maison",
    TERRAIN: "Terrain",
    LOCAL_COMMERCIAL: "Local pro",
    PARKING: "Parking",
    AUTRE: "Autre",
  };
  return m[v] ?? v;
}
