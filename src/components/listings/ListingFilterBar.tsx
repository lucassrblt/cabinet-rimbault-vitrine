"use client";

import { Coins, Home, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { COMMUNES } from "@/lib/config/communes";
import type { ListingQuery } from "@/lib/listing";
import { cn } from "@/lib/utils";
import { FilterDrawer } from "./FilterDrawer";
import { FilterPopover } from "./FilterPopover";

export type FilterBarMode = "sale" | "rent";

interface Props {
  mode: FilterBarMode;
  basePath: string;
  query: ListingQuery;
  total: number;
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
  budgetMax?: string;
}

function pendingFromQuery(q: ListingQuery): PendingState {
  return {
    commune: q.commune,
    type: q.type,
    budgetMax: q.budgetMax,
  };
}

export function ListingFilterBar({ mode, basePath, query, total }: Props) {
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
  const budgetLabel = mode === "sale" ? "Budget max" : "Loyer max";

  const search = (override?: Partial<PendingState>) => {
    const next = { ...pending, ...(override ?? {}) };
    router.push(
      buildHref(basePath, query, {
        commune: next.commune || undefined,
        type: next.type || undefined,
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
      pending.budgetMax !== query.budgetMax;
    if (hasPendingDelta) {
      router.push(
        buildHref(basePath, query, {
          commune: pending.commune || undefined,
          type: pending.type || undefined,
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
    if (!pending.budgetMax) return undefined;
    return `≤ ${formatEuro(Number(pending.budgetMax))}`;
  }, [pending.budgetMax]);

  const advancedCount =
    (query.balcon === "true" ? 1 : 0) +
    (query.terrasse === "true" ? 1 : 0) +
    (query.jardin === "true" ? 1 : 0) +
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
                width="sm"
              >
                {(close) => (
                  <RadioList
                    value={pending.commune ?? ""}
                    onSelect={(v) => {
                      setPending((p) => ({ ...p, commune: v || undefined }));
                      close();
                    }}
                    options={[
                      { value: "", label: "Toutes les communes" },
                      ...COMMUNES.map((c) => ({
                        value: c.slug,
                        label: c.name,
                      })),
                    ]}
                  />
                )}
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
                valueLabel={budgetValueLabel ?? "Tous budgets"}
                active={Boolean(pending.budgetMax)}
                variant="cell"
                width="md"
              >
                {(close) => (
                  <BudgetChoice
                    value={pending.budgetMax}
                    steps={budgets}
                    onSelect={(v) => {
                      setPending((p) => ({ ...p, budgetMax: v || undefined }));
                      close();
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

function BudgetChoice({
  value,
  steps,
  onSelect,
}: {
  value?: string;
  steps: number[];
  onSelect: (v: string) => void;
}) {
  return (
    <ul className="flex max-h-[60vh] flex-col gap-0.5 overflow-y-auto">
      <li>
        <button
          type="button"
          onClick={() => onSelect("")}
          className={cn(
            "flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors",
            !value
              ? "bg-primary-50 text-primary-600"
              : "text-primary hover:bg-section",
          )}
        >
          <span>Tous budgets</span>
          {!value && (
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-primary-600"
            />
          )}
        </button>
      </li>
      {steps.map((s) => {
        const active = value === String(s);
        return (
          <li key={s}>
            <button
              type="button"
              onClick={() => onSelect(String(s))}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors",
                active
                  ? "bg-primary-50 text-primary-600"
                  : "text-primary hover:bg-section",
              )}
            >
              <span>Jusqu&apos;à {formatEuro(s)}</span>
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
