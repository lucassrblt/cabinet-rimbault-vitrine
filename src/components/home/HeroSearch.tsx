"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SelectInput } from "@/components/ui/FormField";
import { COMMUNES } from "@/lib/config/communes";
import { cn } from "@/lib/utils";

type Mode = "acheter" | "louer";

const SALE_BUDGETS: { value: string; label: string }[] = [
  { value: "", label: "Budget" },
  { value: "0-200000", label: "< 200 000 €" },
  { value: "200000-400000", label: "200 000 – 400 000 €" },
  { value: "400000-600000", label: "400 000 – 600 000 €" },
  { value: "600000-900000", label: "600 000 – 900 000 €" },
  { value: "900000-1500000", label: "900 000 – 1 500 000 €" },
  { value: "1500000-", label: "> 1 500 000 €" },
];

const RENT_BUDGETS: { value: string; label: string }[] = [
  { value: "", label: "Loyer" },
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
  const [budget, setBudget] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (commune) params.set("commune", commune);
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
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
    >
      <div
        className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-0.5"
        role="tablist"
        aria-label="Type de transaction"
      >
        {(["acheter", "louer"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              mode === m ? "bg-zinc-900 text-white" : "text-zinc-700",
            )}
          >
            {m === "acheter" ? "Acheter" : "Louer"}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
        <SelectInput
          aria-label="Commune"
          value={commune}
          onChange={(e) => setCommune(e.target.value)}
        >
          <option value="">Toutes les communes</option>
          {COMMUNES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          aria-label="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        >
          {budgets.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </SelectInput>
        <Button type="submit" size="md">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Rechercher</span>
        </Button>
      </div>
    </form>
  );
}
