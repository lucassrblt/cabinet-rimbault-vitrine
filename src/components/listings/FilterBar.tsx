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
  balcon?: string;
  terrasse?: string;
  jardin?: string;
  hideFG?: string;
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

const DPE_OPTIONS = [
  { value: "", label: "DPE — tous" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "D", label: "D" },
  { value: "E", label: "E" },
  { value: "F", label: "F" },
  { value: "G", label: "G" },
];

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

      <div className="flex flex-wrap items-center gap-4 text-sm text-body">
        <SelectInput
          name="dpe"
          defaultValue={filters.dpe ?? ""}
          aria-label="DPE"
          className="w-auto"
        >
          {DPE_OPTIONS.map((o) => (
            <option key={`dpe-${o.value}`} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectInput>

        <label className="inline-flex items-center gap-1.5">
          <input
            type="checkbox"
            name="hideFG"
            value="true"
            defaultChecked={filters.hideFG === "true"}
            className="h-4 w-4"
          />
          Masquer F / G
        </label>

        <label className="inline-flex items-center gap-1.5">
          <input
            type="checkbox"
            name="balcon"
            value="true"
            defaultChecked={filters.balcon === "true"}
            className="h-4 w-4"
          />
          Balcon
        </label>
        <label className="inline-flex items-center gap-1.5">
          <input
            type="checkbox"
            name="terrasse"
            value="true"
            defaultChecked={filters.terrasse === "true"}
            className="h-4 w-4"
          />
          Terrasse
        </label>
        <label className="inline-flex items-center gap-1.5">
          <input
            type="checkbox"
            name="jardin"
            value="true"
            defaultChecked={filters.jardin === "true"}
            className="h-4 w-4"
          />
          Jardin
        </label>

        {mode === "rent" && (
          <label className="inline-flex items-center gap-1.5">
            <input
              type="checkbox"
              name="meuble"
              value="true"
              defaultChecked={filters.meuble === "true"}
              className="h-4 w-4"
            />
            Meublé
          </label>
        )}
      </div>

      {filters.sort && <input type="hidden" name="sort" value={filters.sort} />}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-sm bg-primary-600 px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-700"
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
      filters.dpe ||
      filters.balcon ||
      filters.terrasse ||
      filters.jardin ||
      filters.hideFG,
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
  if (filters.balcon === "true") chips.push({ key: "balcon", label: "Balcon" });
  if (filters.terrasse === "true")
    chips.push({ key: "terrasse", label: "Terrasse" });
  if (filters.jardin === "true") chips.push({ key: "jardin", label: "Jardin" });
  if (filters.hideFG === "true")
    chips.push({ key: "hideFG", label: "Sans F/G" });

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
            className="inline-flex items-center gap-1 rounded-full border border-default bg-card px-3 py-1 text-xs text-primary hover:border-strong"
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
