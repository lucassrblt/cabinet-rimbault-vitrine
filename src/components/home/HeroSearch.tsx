"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { COMMUNES } from "@/lib/config/communes";
import { cn } from "@/lib/utils";

type Mode = "acheter" | "louer";

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
  { value: "", label: "Tous budgets" },
  { value: "0-200000", label: "< 200 000 €" },
  { value: "200000-400000", label: "200 000 – 400 000 €" },
  { value: "400000-600000", label: "400 000 – 600 000 €" },
  { value: "600000-900000", label: "600 000 – 900 000 €" },
  { value: "900000-1500000", label: "900 000 – 1 500 000 €" },
  { value: "1500000-", label: "> 1 500 000 €" },
];

const RENT_BUDGETS = [
  { value: "", label: "Tous budgets" },
  { value: "0-1000", label: "< 1 000 €" },
  { value: "1000-1500", label: "1 000 – 1 500 €" },
  { value: "1500-2000", label: "1 500 – 2 000 €" },
  { value: "2000-3000", label: "2 000 – 3 000 €" },
  { value: "3000-", label: "> 3 000 €" },
];

export function HeroSearch() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("acheter");
  const [commune, setCommune] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (commune) params.set("commune", commune);
    if (propertyType) params.set("type", propertyType);
    if (budget) {
      const [min, max] = budget.split("-");
      if (min) params.set("prix_min", min);
      if (max) params.set("prix_max", max);
    }
    const qs = params.toString();
    router.push(`/${mode}${qs ? `?${qs}` : ""}`);
  };

  const budgets = mode === "acheter" ? SALE_BUDGETS : RENT_BUDGETS;

  return (
    <form
      onSubmit={onSubmit}
      className="overflow-hidden rounded-sm bg-card shadow-lg"
    >
      <div className="flex border-b border-subtle">
        {(["acheter", "louer"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setBudget("");
            }}
            className={cn(
              "px-8 py-4 text-sm font-semibold tracking-wide transition-colors duration-150",
              mode === m
                ? "bg-primary-600 text-on-primary"
                : "bg-card text-body hover:bg-section",
            )}
          >
            {m === "acheter" ? "Acheter" : "Louer"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-0 md:grid-cols-[1fr_1fr_1fr_auto]">
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
          label="Budget max"
          value={budget}
          onChange={setBudget}
          options={budgets}
          last
        />

        <div className="flex items-stretch p-4">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary-600 px-8 py-4 text-sm font-semibold text-on-primary transition-colors duration-150 hover:bg-primary-700 md:w-auto"
          >
            Rechercher
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </form>
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
        "group relative cursor-pointer border-b border-subtle px-6 py-5 transition-colors duration-150 hover:bg-neutral-50/80 md:border-b-0",
        !last && "md:border-r",
      )}
    >
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </span>
      <div className="relative mt-2">
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
          className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-colors group-hover:text-primary"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
