"use client";

import { Coins, Home, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, use, useEffect, useId, useMemo, useState } from "react";
import { TextInput } from "@/components/ui/FormField";
import { COMMUNES } from "@/lib/config/communes";
import type { ListingQuery } from "@/lib/listing";
import type { CommuneCounts } from "@/lib/listing-counts";
import { cn } from "@/lib/utils";
import { FilterDrawer } from "./FilterDrawer";
import { FilterPopover } from "./FilterPopover";

export type FilterBarMode = "sale" | "rent";

interface Props {
  mode: FilterBarMode;
  basePath: string;
  query: ListingQuery;
  total: number;
  // Promesse (non-attendue côté serveur) : les compteurs streament dans le
  // popover via use() sans bloquer le rendu de la page. Cf. getCommuneCounts.
  communeCountsPromise?: Promise<CommuneCounts>;
}

const SALE_TYPES = [
  { value: "", label: "Tous les types" },
  { value: "APPARTEMENT", label: "Appartement" },
  { value: "MAISON", label: "Maison" },
  { value: "TERRAIN", label: "Terrain" },
  { value: "LOCAL_COMMERCIAL", label: "Local professionnel" },
  { value: "PARKING", label: "Parking" },
  { value: "AUTRE", label: "Autre" },
];

const RENT_TYPES = [
  { value: "", label: "Tous les types" },
  { value: "APPARTEMENT", label: "Appartement" },
  { value: "MAISON", label: "Maison" },
  { value: "LOCAL_COMMERCIAL", label: "Local professionnel" },
  { value: "PARKING", label: "Parking" },
  { value: "AUTRE", label: "Autre" },
];

const SALE_BUDGETS = [
  100_000, 200_000, 300_000, 400_000, 500_000, 600_000, 800_000, 1_000_000,
  1_500_000, 2_500_000,
];
const RENT_BUDGETS = [500, 800, 1000, 1300, 1500, 2000, 2500, 3000, 5000];

function formatEuro(n: number): string {
  return `${n.toLocaleString("fr-FR")} €`;
}

function formatCompact(n: number, mode: FilterBarMode): string {
  if (mode === "rent") return formatEuro(n);
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const s = m.toFixed(m % 1 === 0 ? 0 : 1).replace(".", ",");
    return `${s} M€`;
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)} k€`;
  return `${n} €`;
}

function parseEuro(raw: string): number | undefined {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  const n = Number(digits);
  return Number.isFinite(n) ? n : undefined;
}

function buildHref(
  base: string,
  query: ListingQuery,
  patch: Partial<ListingQuery>,
): string {
  const merged: Record<string, string | undefined> = { ...query, ...patch };
  delete merged.page;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v) params.set(k, String(v));
  }
  const qs = params.toString();
  return `${base}${qs ? `?${qs}` : ""}`;
}

interface PendingState {
  commune?: string;
  type?: string;
  budgetMin?: string;
  budgetMax?: string;
}

function pendingFromQuery(q: ListingQuery): PendingState {
  return {
    commune: q.commune,
    type: q.type,
    budgetMin: q.budgetMin,
    budgetMax: q.budgetMax,
  };
}

export function ListingFilterBar({
  mode,
  basePath,
  query,
  total,
  communeCountsPromise,
}: Props) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pending, setPending] = useState<PendingState>(() =>
    pendingFromQuery(query),
  );

  // Resync pending state whenever the URL-driven query changes (back/forward,
  // chip removal, etc.) so the bar always reflects the URL on navigation.
  useEffect(() => {
    setPending(pendingFromQuery(query));
  }, [query]);

  const types = mode === "sale" ? SALE_TYPES : RENT_TYPES;
  const budgets = mode === "sale" ? SALE_BUDGETS : RENT_BUDGETS;
  const budgetLabel = mode === "sale" ? "Budget" : "Loyer";

  const search = (override?: Partial<PendingState>) => {
    const next = { ...pending, ...(override ?? {}) };
    router.push(
      buildHref(basePath, query, {
        commune: next.commune || undefined,
        type: next.type || undefined,
        budgetMin: next.budgetMin || undefined,
        budgetMax: next.budgetMax || undefined,
      }),
    );
  };

  const openMoreFilters = () => {
    // Commit any pending main-filter changes first so the drawer starts from
    // an URL-consistent state.
    const hasPendingDelta =
      pending.commune !== query.commune ||
      pending.type !== query.type ||
      pending.budgetMin !== query.budgetMin ||
      pending.budgetMax !== query.budgetMax;
    if (hasPendingDelta) {
      router.push(
        buildHref(basePath, query, {
          commune: pending.commune || undefined,
          type: pending.type || undefined,
          budgetMin: pending.budgetMin || undefined,
          budgetMax: pending.budgetMax || undefined,
        }),
      );
    }
    setDrawerOpen(true);
  };

  const communeLabel = useMemo(() => {
    if (!pending.commune) return undefined;
    return COMMUNES.find((c) => c.slug === pending.commune)?.name;
  }, [pending.commune]);

  const typeLabel = useMemo(() => {
    if (!pending.type) return undefined;
    return types.find((t) => t.value === pending.type)?.label;
  }, [pending.type, types]);

  const budgetValueLabel = useMemo(() => {
    const min = pending.budgetMin ? Number(pending.budgetMin) : undefined;
    const max = pending.budgetMax ? Number(pending.budgetMax) : undefined;
    if (min === undefined && max === undefined) return undefined;
    if (min !== undefined && max !== undefined) {
      return `${formatCompact(min, mode)} – ${formatCompact(max, mode)}`;
    }
    if (max !== undefined) return `≤ ${formatCompact(max, mode)}`;
    return `≥ ${formatCompact(min as number, mode)}`;
  }, [pending.budgetMin, pending.budgetMax, mode]);

  const advancedCount =
    (query.balcon === "true" ? 1 : 0) +
    (query.terrasse === "true" ? 1 : 0) +
    (query.jardin === "true" ? 1 : 0) +
    (query.cave === "true" ? 1 : 0) +
    (query.parking === "true" ? 1 : 0) +
    (query.garage === "true" ? 1 : 0) +
    (query.ascenseur === "true" ? 1 : 0) +
    (query.meuble === "true" ? 1 : 0) +
    (query.dpe ? 1 : 0) +
    (query.hideFG === "true" ? 1 : 0) +
    (query.pieces ? 1 : 0) +
    (query.surfaceMin || query.surfaceMax ? 1 : 0);

  return (
    <div>
      <div className="rounded-lg border border-subtle bg-card p-2 shadow-sm md:p-2.5">
        <div className="flex flex-col gap-2 md:flex-row md:items-stretch md:gap-1">
          <div className="grid grid-cols-1 gap-1 md:grid-cols-3 md:flex-1 md:divide-x md:divide-subtle">
            <div className="md:pr-1">
              <FilterPopover
                label="Localisation"
                icon={MapPin}
                valueLabel={communeLabel ?? "Toutes les communes"}
                active={Boolean(pending.commune)}
                variant="cell"
                width="md"
              >
                {(close) => {
                  const onSelect = (v: string) => {
                    setPending((p) => ({ ...p, commune: v || undefined }));
                    close();
                  };
                  // Compteurs streamés : le popover est instantanément
                  // interactif (fallback = ordre config, sans badge) ; les
                  // badges + le tri se remplissent dès résolution de la promesse.
                  if (!communeCountsPromise) {
                    return (
                      <CommuneList
                        value={pending.commune ?? ""}
                        onSelect={onSelect}
                      />
                    );
                  }
                  return (
                    <Suspense
                      fallback={
                        <CommuneList
                          value={pending.commune ?? ""}
                          onSelect={onSelect}
                        />
                      }
                    >
                      <CommuneListWithCounts
                        promise={communeCountsPromise}
                        value={pending.commune ?? ""}
                        onSelect={onSelect}
                      />
                    </Suspense>
                  );
                }}
              </FilterPopover>
            </div>

            <div className="md:px-1">
              <FilterPopover
                label="Type de bien"
                icon={Home}
                valueLabel={typeLabel ?? "Tous les types"}
                active={Boolean(pending.type)}
                variant="cell"
                width="sm"
              >
                {(close) => (
                  <RadioList
                    value={pending.type ?? ""}
                    onSelect={(v) => {
                      setPending((p) => ({ ...p, type: v || undefined }));
                      close();
                    }}
                    options={types}
                  />
                )}
              </FilterPopover>
            </div>

            <div className="md:pl-1">
              <FilterPopover
                label={budgetLabel}
                icon={Coins}
                valueLabel={
                  budgetValueLabel ??
                  (mode === "sale" ? "Tous budgets" : "Tous loyers")
                }
                active={Boolean(pending.budgetMin || pending.budgetMax)}
                variant="cell"
                width="lg"
              >
                {(close) => (
                  <BudgetRange
                    mode={mode}
                    initialMin={pending.budgetMin}
                    initialMax={pending.budgetMax}
                    steps={budgets}
                    onApply={(min, max) => {
                      setPending((p) => ({
                        ...p,
                        budgetMin: min || undefined,
                        budgetMax: max || undefined,
                      }));
                      close();
                      search({
                        budgetMin: min || undefined,
                        budgetMax: max || undefined,
                      });
                    }}
                  />
                )}
              </FilterPopover>
            </div>
          </div>

          <div className="flex items-stretch gap-2 md:gap-1.5 md:border-l md:border-subtle md:pl-2">
            <button
              type="button"
              onClick={() => search()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:flex-none md:px-6"
            >
              Rechercher
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={openMoreFilters}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                advancedCount > 0
                  ? "border-primary-200 bg-primary-50/60 text-primary-700"
                  : "border-default bg-card text-primary hover:border-strong hover:bg-section/40",
              )}
            >
              <span className="inline-flex h-4 w-4 items-center justify-center text-base leading-none">
                +
              </span>
              <span className="hidden sm:inline">Plus de filtres</span>
              <span className="sm:hidden">Filtres</span>
              <SlidersHorizontal
                className={cn(
                  "h-4 w-4",
                  advancedCount > 0 ? "text-primary-600" : "text-muted",
                )}
                aria-hidden="true"
              />
              {advancedCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[11px] font-semibold text-on-primary">
                  {advancedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={mode}
        basePath={basePath}
        query={query}
        total={total}
      />
    </div>
  );
}

function RadioList({
  value,
  onSelect,
  options,
}: {
  value: string;
  onSelect: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <ul className="flex max-h-[60vh] flex-col gap-0.5 overflow-y-auto">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <li key={o.value}>
            <button
              type="button"
              onClick={() => onSelect(o.value)}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors",
                active
                  ? "bg-primary-50 text-primary-600"
                  : "text-primary hover:bg-section",
              )}
            >
              <span>{o.label}</span>
              {active && (
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-primary-600"
                />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Déballe la promesse de compteurs avec use() (suspend le seul panneau du
 *  popover, jamais la page) puis rend CommuneList enrichi. */
function CommuneListWithCounts({
  promise,
  value,
  onSelect,
}: {
  promise: Promise<CommuneCounts>;
  value: string;
  onSelect: (v: string) => void;
}) {
  const counts = use(promise);
  return <CommuneList value={value} counts={counts} onSelect={onSelect} />;
}

function CommuneList({
  value,
  counts,
  onSelect,
}: {
  value: string;
  counts?: CommuneCounts;
  onSelect: (v: string) => void;
}) {
  // Tri : communes avec stock par décroissant, puis communes vides à la fin.
  // En l'absence de compteurs (fallback), on garde l'ordre de la config.
  const ordered = useMemo(() => {
    if (!counts) return COMMUNES;
    return [...COMMUNES].sort((a, b) => {
      const ca = counts[a.slug] ?? 0;
      const cb = counts[b.slug] ?? 0;
      if (ca === cb) return 0;
      if (ca === 0) return 1;
      if (cb === 0) return -1;
      return cb - ca;
    });
  }, [counts]);

  const totalAvailable = counts
    ? Object.values(counts).reduce((acc, n) => acc + n, 0)
    : undefined;

  return (
    <ul className="flex max-h-[60vh] flex-col gap-0.5 overflow-y-auto">
      <li>
        <button
          type="button"
          onClick={() => onSelect("")}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors",
            !value
              ? "bg-primary-50 text-primary-600"
              : "text-primary hover:bg-section",
          )}
        >
          <span>Toutes les communes</span>
          <span
            className={cn(
              "text-xs tabular-nums",
              !value ? "text-primary-600" : "text-muted",
            )}
          >
            {totalAvailable !== undefined ? totalAvailable : ""}
          </span>
        </button>
      </li>
      {ordered.map((c) => {
        const active = c.slug === value;
        const count = counts?.[c.slug];
        const empty = count === 0;
        return (
          <li key={c.slug}>
            <button
              type="button"
              onClick={() => onSelect(c.slug)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors",
                active
                  ? "bg-primary-50 text-primary-600"
                  : empty
                    ? "text-muted hover:bg-section"
                    : "text-primary hover:bg-section",
              )}
              aria-label={
                count !== undefined
                  ? `${c.name}, ${count} bien${count > 1 ? "s" : ""}`
                  : c.name
              }
            >
              <span className="truncate">{c.name}</span>
              {count !== undefined && (
                <span
                  className={cn(
                    "shrink-0 text-xs tabular-nums",
                    active
                      ? "text-primary-600"
                      : empty
                        ? "text-muted/70"
                        : "text-muted",
                  )}
                >
                  {empty ? "—" : count}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function formatInputEuro(n: number): string {
  return n.toLocaleString("fr-FR");
}

function BudgetRange({
  mode,
  initialMin,
  initialMax,
  steps,
  onApply,
}: {
  mode: FilterBarMode;
  initialMin?: string;
  initialMax?: string;
  steps: number[];
  onApply: (min: string, max: string) => void;
}) {
  const [min, setMin] = useState(() =>
    initialMin ? formatInputEuro(Number(initialMin)) : "",
  );
  const [max, setMax] = useState(() =>
    initialMax ? formatInputEuro(Number(initialMax)) : "",
  );

  const parsedMin = parseEuro(min);
  const parsedMax = parseEuro(max);
  const invalid =
    parsedMin !== undefined && parsedMax !== undefined && parsedMin > parsedMax;

  const handleChange =
    (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const n = parseEuro(e.target.value);
      set(n !== undefined ? formatInputEuro(n) : "");
    };

  const submit = () => {
    if (invalid) return;
    onApply(
      parsedMin !== undefined ? String(parsedMin) : "",
      parsedMax !== undefined ? String(parsedMax) : "",
    );
  };

  const clear = () => {
    setMin("");
    setMax("");
  };

  const chipsTitle =
    mode === "sale" ? "Plafonds rapides" : "Loyers max courants";

  const minId = useId();
  const maxId = useId();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor={minId}
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted"
          >
            Min.
          </label>
          <div className="relative">
            <TextInput
              id={minId}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Pas de min."
              value={min}
              onChange={handleChange(setMin)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              className={cn(
                "pr-7 tabular-nums",
                invalid && "border-error focus:ring-error",
              )}
              aria-invalid={invalid || undefined}
            />
            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-xs text-muted">
              €
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor={maxId}
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted"
          >
            Max.
          </label>
          <div className="relative">
            <TextInput
              id={maxId}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Pas de max."
              value={max}
              onChange={handleChange(setMax)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              className={cn(
                "pr-7 tabular-nums",
                invalid && "border-error focus:ring-error",
              )}
              aria-invalid={invalid || undefined}
            />
            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-xs text-muted">
              €
            </span>
          </div>
        </div>
      </div>

      {invalid && (
        <p className="text-xs text-error" role="alert">
          Le minimum doit être inférieur au maximum.
        </p>
      )}

      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          {chipsTitle}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {steps.map((s) => {
            const active = parsedMax === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setMax(formatInputEuro(s))}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  active
                    ? "border-primary-600 bg-primary-600 text-on-primary"
                    : "border-default bg-card text-primary hover:border-strong",
                )}
              >
                ≤ {formatCompact(s, mode)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={clear}
          className="text-xs text-muted underline underline-offset-2 hover:text-primary"
        >
          Effacer
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={invalid}
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-sm px-4 text-sm font-semibold transition-colors",
            invalid
              ? "cursor-not-allowed bg-section text-muted"
              : "bg-primary-600 text-on-primary hover:bg-primary-700",
          )}
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}
