"use client";

import { Minus, Plus } from "lucide-react";
import type { FormState } from "@/components/forms/estimation/estimation-funnel";
import { StepHeading } from "@/components/forms/estimation/StepHeading";
import { Field, TextInput } from "@/components/ui/FormField";
import { cn } from "@/lib/utils";
import type { EstimationStep1 } from "@/lib/validation";

export function StepSurface({
  type,
  surface,
  rooms,
  floor,
  year,
  onChange,
  errors,
}: {
  type: EstimationStep1["type"];
  surface: string;
  rooms: string;
  floor: string;
  year: string;
  onChange: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  errors: Partial<Record<keyof FormState, string>>;
}) {
  const isTerrain = type === "terrain";
  const isApt = type === "appartement";

  function bumpRooms(delta: number) {
    const current = Number.parseInt(rooms || "0", 10) || 0;
    const next = Math.max(1, Math.min(8, current + delta));
    onChange("rooms", next >= 8 ? "8+" : String(next));
  }

  return (
    <div>
      <StepHeading
        title={isTerrain ? "Quelle est sa superficie ?" : "Surface et pièces"}
        description={
          isTerrain
            ? "Indiquez la surface totale du terrain."
            : "La surface et le nombre de pièces sont les principaux facteurs de prix."
        }
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label={isTerrain ? "Surface totale (m²)" : "Surface habitable (m²)"}
            required
            htmlFor="es-surface"
            error={errors.surface}
          >
            <div className="relative">
              <TextInput
                id="es-surface"
                type="number"
                inputMode="numeric"
                min={0}
                value={surface}
                onChange={(e) => onChange("surface", e.target.value)}
                className="pr-12 text-lg"
                placeholder="65"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">
                m²
              </span>
            </div>
          </Field>

          {!isTerrain && (
            <Field
              label="Nombre de pièces"
              required
              htmlFor="es-rooms"
              error={errors.rooms}
            >
              <div className="flex items-stretch overflow-hidden rounded-sm border border-default bg-card">
                <button
                  type="button"
                  onClick={() => bumpRooms(-1)}
                  aria-label="Retirer une pièce"
                  className="flex w-10 items-center justify-center text-muted transition hover:bg-neutral-50 hover:text-primary"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <div className="flex flex-1 items-center justify-center text-lg font-semibold text-primary">
                  {rooms || "—"}
                </div>
                <button
                  type="button"
                  onClick={() => bumpRooms(1)}
                  aria-label="Ajouter une pièce"
                  className="flex w-10 items-center justify-center text-muted transition hover:bg-neutral-50 hover:text-primary"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </Field>
          )}
        </div>

        {!isTerrain && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {isApt && (
              <fieldset className="flex flex-col gap-2">
                <span className="text-sm font-medium text-primary">Étage</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { v: "rdc", l: "RDC" },
                    { v: "1", l: "1ᵉʳ" },
                    { v: "2", l: "2ᵉ" },
                    { v: "3", l: "3ᵉ" },
                    { v: "4+", l: "4ᵉ +" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => onChange("floor", opt.v)}
                      className={cn(
                        "rounded-sm border px-3.5 py-1.5 text-sm transition-colors",
                        floor === opt.v
                          ? "border-primary-600 text-primary"
                          : "border-default text-body hover:border-neutral-400",
                      )}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            <Field
              label="Année de construction (facultatif)"
              htmlFor="es-year"
              error={errors.year}
            >
              <TextInput
                id="es-year"
                type="number"
                inputMode="numeric"
                min={1800}
                max={new Date().getFullYear() + 1}
                placeholder="1975"
                value={year}
                onChange={(e) => onChange("year", e.target.value)}
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
