"use client";

import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { COMMUNES } from "@/lib/config/communes";
import { cn } from "@/lib/utils";

export type SearchMode = "sale" | "rent";

const PROPERTY_TYPES = [
  { value: "", label: "Tous les types" },
  { value: "APPARTEMENT", label: "Appartement" },
  { value: "MAISON", label: "Maison" },
  { value: "VILLA", label: "Villa" },
  { value: "TERRAIN", label: "Terrain" },
  { value: "LOCAL_COMMERCIAL", label: "Local commercial" },
  { value: "BUREAUX", label: "Bureaux" },
  { value: "LOFT", label: "Loft" },
];

const SALE_BUDGETS = [
  { value: "", label: "Indifférent" },
  { value: "200000", label: "200 000 €" },
  { value: "400000", label: "400 000 €" },
  { value: "600000", label: "600 000 €" },
  { value: "900000", label: "900 000 €" },
  { value: "1500000", label: "1 500 000 €" },
];

const RENT_BUDGETS = [
  { value: "", label: "Indifférent" },
  { value: "1000", label: "1 000 €" },
  { value: "1500", label: "1 500 €" },
  { value: "2000", label: "2 000 €" },
  { value: "3000", label: "3 000 €" },
  { value: "5000", label: "5 000 €" },
];

const ROOMS = [
  { value: "", label: "Toutes" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

interface Props {
  mode: SearchMode;
  basePath: string;
  defaultValues?: {
    commune?: string;
    type?: string;
    budgetMax?: string;
    pieces?: string;
  };
}

export function ListingSearchBar({ mode, basePath, defaultValues }: Props) {
  const router = useRouter();
  const [commune, setCommune] = useState(defaultValues?.commune ?? "");
  const [propertyType, setPropertyType] = useState(defaultValues?.type ?? "");
  const [budgetMax, setBudgetMax] = useState(defaultValues?.budgetMax ?? "");
  const [pieces, setPieces] = useState(defaultValues?.pieces ?? "");

  const budgets = mode === "sale" ? SALE_BUDGETS : RENT_BUDGETS;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (commune) params.set("commune", commune);
    if (propertyType) params.set("type", propertyType);
    if (budgetMax) params.set("budgetMax", budgetMax);
    if (pieces) params.set("pieces", pieces);
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="relative z-20 mx-auto -mt-10 w-full max-w-5xl px-4 md:-mt-12 md:px-8">
      <form
        onSubmit={onSubmit}
        className="overflow-hidden rounded-sm bg-card shadow-lg"
      >
        <div className="grid grid-cols-2 items-stretch gap-0 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <SearchField
            label="Localisation"
            value={commune}
            onChange={setCommune}
            options={[
              { value: "", label: "Toutes les communes" },
              ...COMMUNES.map((c) => ({ value: c.slug, label: c.name })),
            ]}
          />
          <SearchField
            label="Type de bien"
            value={propertyType}
            onChange={setPropertyType}
            options={PROPERTY_TYPES}
          />
          <SearchField
            label="Budget max."
            value={budgetMax}
            onChange={setBudgetMax}
            options={budgets}
          />
          <SearchField
            label="Pièces min."
            value={pieces}
            onChange={setPieces}
            options={ROOMS}
            last
          />
          <div className="col-span-2 flex items-stretch p-3 md:col-span-1">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary-600 px-6 py-3 text-sm font-semibold text-on-primary transition-colors duration-150 hover:bg-primary-700 md:w-auto"
            >
              Rechercher
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>

      <div className="mt-3 flex justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-body transition-colors hover:text-primary"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          Filtres avancés
        </button>
      </div>
    </div>
  );
}

function SearchField({
  label,
  value,
  onChange,
  options,
  last,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative cursor-pointer border-b border-subtle px-5 py-4 transition-colors duration-150 hover:bg-neutral-50/80 md:border-b-0",
        !last && "md:border-r",
      )}
    >
      <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      <div className="relative mt-1.5">
        <select
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none border-0 bg-transparent p-0 pr-6 text-sm font-medium text-primary focus:outline-none focus:ring-0"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted transition-colors group-hover:text-primary"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
