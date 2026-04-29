"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { COMMUNES } from "@/lib/config/communes";
import { cn } from "@/lib/utils";
import { RangeSlider } from "./RangeSlider";

export type FilterMode = "sale" | "rent";

const SALE_TYPES = [
  { value: "", label: "Tous les types" },
  { value: "APPARTEMENT", label: "Appartement" },
  { value: "MAISON", label: "Maison" },
  { value: "TERRAIN", label: "Terrain" },
  { value: "LOCAL_COMMERCIAL", label: "Local pro" },
  { value: "PARKING", label: "Parking" },
  { value: "AUTRE", label: "Autre" },
];

const RENT_TYPES = [
  { value: "", label: "Tous les types" },
  { value: "APPARTEMENT", label: "Appartement" },
  { value: "MAISON", label: "Maison" },
  { value: "LOCAL_COMMERCIAL", label: "Local pro" },
  { value: "PARKING", label: "Parking" },
  { value: "AUTRE", label: "Autre" },
];

const ROOMS = ["1", "2", "3", "4", "5"];

interface Props {
  mode: FilterMode;
  basePath: string;
  total: number;
  defaultValues?: {
    commune?: string;
    type?: string;
    pieces?: string;
    budgetMin?: string;
    budgetMax?: string;
    surfaceMin?: string;
    surfaceMax?: string;
    balcon?: string;
    terrasse?: string;
    jardin?: string;
    parking?: string;
    garage?: string;
    hideFG?: string;
    meuble?: string;
    dpe?: string;
    sort?: string;
  };
}

export function FilterSidebar({ mode, basePath, total, defaultValues }: Props) {
  const router = useRouter();

  const budgetMax = mode === "sale" ? 600000 : 5000;
  const budgetStep = mode === "sale" ? 10000 : 100;

  const [commune, setCommune] = useState(defaultValues?.commune ?? "");
  const [type, setType] = useState(defaultValues?.type ?? "");
  const [pieces, setPieces] = useState(defaultValues?.pieces ?? "");
  const [bMin, setBMin] = useState(Number(defaultValues?.budgetMin) || 0);
  const [bMax, setBMax] = useState(
    Number(defaultValues?.budgetMax) || budgetMax,
  );
  const [sMin, setSMin] = useState(Number(defaultValues?.surfaceMin) || 0);
  const [sMax, setSMax] = useState(Number(defaultValues?.surfaceMax) || 200);
  const [balcon, setBalcon] = useState(defaultValues?.balcon === "true");
  const [terrasse, setTerrasse] = useState(defaultValues?.terrasse === "true");
  const [jardin, setJardin] = useState(defaultValues?.jardin === "true");
  const [parking, setParking] = useState(defaultValues?.parking === "true");
  const [garageCheck, setGarageCheck] = useState(
    defaultValues?.garage === "true",
  );
  const [showMore, setShowMore] = useState(false);

  const types = mode === "sale" ? SALE_TYPES : RENT_TYPES;

  const hasFilters =
    commune ||
    type ||
    pieces ||
    bMin > 0 ||
    bMax < budgetMax ||
    sMin > 0 ||
    sMax < 200 ||
    balcon ||
    terrasse ||
    jardin ||
    parking ||
    garageCheck;

  const reset = () => {
    setCommune("");
    setType("");
    setPieces("");
    setBMin(0);
    setBMax(budgetMax);
    setSMin(0);
    setSMax(200);
    setBalcon(false);
    setTerrasse(false);
    setJardin(false);
    setParking(false);
    setGarageCheck(false);
  };

  const apply = () => {
    const params = new URLSearchParams();
    if (commune) params.set("commune", commune);
    if (type) params.set("type", type);
    if (pieces) params.set("pieces", pieces);
    if (bMin > 0) params.set("budgetMin", String(bMin));
    if (bMax < budgetMax) params.set("budgetMax", String(bMax));
    if (sMin > 0) params.set("surfaceMin", String(sMin));
    if (sMax < 200) params.set("surfaceMax", String(sMax));
    if (balcon) params.set("balcon", "true");
    if (terrasse) params.set("terrasse", "true");
    if (jardin) params.set("jardin", "true");
    if (parking) params.set("parking", "true");
    if (garageCheck) params.set("garage", "true");
    if (defaultValues?.sort) params.set("sort", defaultValues.sort);
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  };

  const fmtBudget = (v: number) =>
    v >= budgetMax
      ? mode === "sale"
        ? "600 000 €+"
        : "5 000 €+"
      : `${v.toLocaleString("fr-FR")} €`;

  const fmtSurface = (v: number) => (v >= 200 ? "200 m²+" : `${v} m²`);

  return (
    <aside className="flex flex-col gap-5 rounded-sm border border-subtle bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-primary">Filtres</h3>
        {hasFilters && (
          <button
            type="button"
            onClick={reset}
            className="text-xs text-muted underline underline-offset-2 hover:text-primary"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <FilterGroup label="Localisation">
        <div className="relative">
          <select
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            aria-label="Commune"
            className="w-full appearance-none rounded-sm border border-default bg-card px-3 py-2 pr-8 text-sm text-primary focus:border-focus focus:outline-none"
          >
            <option value="">Saisir une ville, un quartier…</option>
            {COMMUNES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        </div>
      </FilterGroup>

      <FilterGroup label="Type de bien">
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Type de bien"
            className="w-full appearance-none rounded-sm border border-default bg-card px-3 py-2 pr-8 text-sm text-primary focus:border-focus focus:outline-none"
          >
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        </div>
      </FilterGroup>

      <FilterGroup label="Budget">
        <RangeSlider
          min={0}
          max={budgetMax}
          step={budgetStep}
          valueMin={bMin}
          valueMax={bMax}
          onChangeMin={setBMin}
          onChangeMax={setBMax}
          formatLabel={fmtBudget}
        />
      </FilterGroup>

      <FilterGroup label="Surface">
        <RangeSlider
          min={0}
          max={200}
          step={5}
          valueMin={sMin}
          valueMax={sMax}
          onChangeMin={setSMin}
          onChangeMax={setSMax}
          formatLabel={fmtSurface}
        />
      </FilterGroup>

      <FilterGroup label="Pièces">
        <div className="flex gap-1.5">
          {ROOMS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setPieces(pieces === r ? "" : r)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-sm border text-sm font-medium transition-colors",
                pieces === r
                  ? "border-primary-600 bg-primary-600 text-on-primary"
                  : "border-default bg-card text-primary hover:border-strong",
              )}
            >
              {r}+
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Extérieur">
        <div className="flex flex-col gap-2">
          <Checkbox
            checked={balcon}
            onChange={setBalcon}
            label="Balcon / Terrasse"
          />
          <Checkbox checked={jardin} onChange={setJardin} label="Jardin" />
        </div>
      </FilterGroup>

      <FilterGroup label="Stationnement">
        <div className="flex flex-col gap-2">
          <Checkbox checked={parking} onChange={setParking} label="Parking" />
          <Checkbox
            checked={garageCheck}
            onChange={setGarageCheck}
            label="Garage"
          />
        </div>
      </FilterGroup>

      {showMore && (
        <div className="border-t border-subtle pt-4 text-xs text-muted">
          Filtres supplémentaires à venir.
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowMore(!showMore)}
        className="text-xs font-medium text-muted underline underline-offset-2 hover:text-primary"
      >
        {showMore ? "Moins de critères" : "Voir plus de critères"}
      </button>

      <button
        type="button"
        onClick={apply}
        className="w-full rounded-sm bg-primary-600 px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-700"
      >
        Voir les {total} bien{total > 1 ? "s" : ""}
      </button>
    </aside>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-primary">{label}</span>
      {children}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-body">
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
