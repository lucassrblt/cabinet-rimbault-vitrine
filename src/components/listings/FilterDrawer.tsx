"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { SelectInput } from "@/components/ui/FormField";
import type { ListingQuery } from "@/lib/listing";
import { cn } from "@/lib/utils";

export type FilterDrawerMode = "sale" | "rent";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: FilterDrawerMode;
  basePath: string;
  query: ListingQuery;
  total: number;
}

type DrawerState = {
  pieces: string;
  surfaceMin: string;
  surfaceMax: string;
  balcon: boolean;
  terrasse: boolean;
  jardin: boolean;
  meuble: boolean;
  dpe: string;
  hideFG: boolean;
};

function fromQuery(q: ListingQuery): DrawerState {
  return {
    pieces: q.pieces ?? "",
    surfaceMin: q.surfaceMin ?? "",
    surfaceMax: q.surfaceMax ?? "",
    balcon: q.balcon === "true",
    terrasse: q.terrasse === "true",
    jardin: q.jardin === "true",
    meuble: q.meuble === "true",
    dpe: q.dpe ?? "",
    hideFG: q.hideFG === "true",
  };
}

const EMPTY: DrawerState = {
  pieces: "",
  surfaceMin: "",
  surfaceMax: "",
  balcon: false,
  terrasse: false,
  jardin: false,
  meuble: false,
  dpe: "",
  hideFG: false,
};

const ROOMS = ["1", "2", "3", "4", "5"];
const SURFACES = [20, 30, 50, 70, 90, 120, 150, 200];
const DPE_LETTERS = ["A", "B", "C", "D", "E", "F", "G"] as const;

export function FilterDrawer({
  open,
  onClose,
  mode,
  basePath,
  query,
  total,
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<DrawerState>(() => fromQuery(query));

  useEffect(() => {
    if (open) setState(fromQuery(query));
  }, [open, query]);

  const apply = () => {
    const params = new URLSearchParams();
    if (query.commune) params.set("commune", query.commune);
    if (query.type) params.set("type", query.type);
    if (query.budgetMin) params.set("budgetMin", query.budgetMin);
    if (query.budgetMax) params.set("budgetMax", query.budgetMax);
    if (query.sort) params.set("sort", query.sort);

    if (state.pieces) params.set("pieces", state.pieces);
    if (state.surfaceMin) params.set("surfaceMin", state.surfaceMin);
    if (state.surfaceMax) params.set("surfaceMax", state.surfaceMax);
    if (state.balcon) params.set("balcon", "true");
    if (state.terrasse) params.set("terrasse", "true");
    if (state.jardin) params.set("jardin", "true");
    if (mode === "rent" && state.meuble) params.set("meuble", "true");
    if (state.dpe) params.set("dpe", state.dpe);
    if (state.hideFG) params.set("hideFG", "true");

    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
    onClose();
  };

  const reset = () => setState(EMPTY);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filtres avancés"
      side="right"
      size="md"
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={reset}
            className="text-sm text-muted underline underline-offset-2 hover:text-primary"
          >
            Réinitialiser
          </button>
          <Button onClick={apply}>
            Voir {total} bien{total > 1 ? "s" : ""}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-7">
        <Group title="Pièces">
          <div className="flex flex-wrap gap-2">
            {ROOMS.map((r) => {
              const active = state.pieces === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() =>
                    setState((s) => ({ ...s, pieces: active ? "" : r }))
                  }
                  className={cn(
                    "inline-flex h-10 min-w-[3rem] items-center justify-center rounded-sm border px-3 text-sm font-medium transition-colors",
                    active
                      ? "border-primary-600 bg-primary-600 text-on-primary"
                      : "border-default bg-card text-primary hover:border-strong",
                  )}
                >
                  {r}+
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted">
            Nombre minimum de pièces principales.
          </p>
        </Group>

        <Group title="Surface">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="fd-surface-min"
                className="text-xs font-medium text-muted"
              >
                Surface min.
              </label>
              <SelectInput
                id="fd-surface-min"
                value={state.surfaceMin}
                onChange={(e) =>
                  setState((s) => ({ ...s, surfaceMin: e.target.value }))
                }
              >
                <option value="">Min.</option>
                {SURFACES.map((s) => (
                  <option key={`min-${s}`} value={String(s)}>
                    {s} m²
                  </option>
                ))}
              </SelectInput>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="fd-surface-max"
                className="text-xs font-medium text-muted"
              >
                Surface max.
              </label>
              <SelectInput
                id="fd-surface-max"
                value={state.surfaceMax}
                onChange={(e) =>
                  setState((s) => ({ ...s, surfaceMax: e.target.value }))
                }
              >
                <option value="">Max.</option>
                {SURFACES.map((s) => (
                  <option key={`max-${s}`} value={String(s)}>
                    {s} m²
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>
        </Group>

        <Group title="Extérieur">
          <CheckboxRow
            checked={state.balcon}
            onChange={(v) => setState((s) => ({ ...s, balcon: v }))}
            label="Balcon"
          />
          <CheckboxRow
            checked={state.terrasse}
            onChange={(v) => setState((s) => ({ ...s, terrasse: v }))}
            label="Terrasse"
          />
          <CheckboxRow
            checked={state.jardin}
            onChange={(v) => setState((s) => ({ ...s, jardin: v }))}
            label="Jardin"
          />
        </Group>

        {mode === "rent" && (
          <Group title="Location">
            <CheckboxRow
              checked={state.meuble}
              onChange={(v) => setState((s) => ({ ...s, meuble: v }))}
              label="Meublé"
            />
          </Group>
        )}

        <Group title="Performance énergétique">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fd-dpe" className="text-sm text-body">
                DPE maximum
              </label>
              <SelectInput
                id="fd-dpe"
                value={state.dpe}
                onChange={(e) =>
                  setState((s) => ({ ...s, dpe: e.target.value }))
                }
              >
                <option value="">Tous DPE</option>
                {DPE_LETTERS.map((l) => (
                  <option key={l} value={l}>
                    Jusqu&apos;à {l}
                  </option>
                ))}
              </SelectInput>
            </div>
            <CheckboxRow
              checked={state.hideFG}
              onChange={(v) => setState((s) => ({ ...s, hideFG: v }))}
              label="Masquer les biens F et G"
            />
          </div>
        </Group>
      </div>
    </Drawer>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
        {title}
      </h3>
      <div className={cn("flex flex-col gap-2.5")}>{children}</div>
    </section>
  );
}

function CheckboxRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-body">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded-sm border-default text-primary-600 focus:ring-primary-600"
      />
      {label}
    </label>
  );
}
