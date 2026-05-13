"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect({
  mode,
  basePath,
  value,
}: {
  mode: "sale" | "rent";
  basePath: string;
  value?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const options =
    mode === "sale"
      ? [
          { value: "recent", label: "Plus récents" },
          { value: "price_asc", label: "Prix croissant" },
          { value: "price_desc", label: "Prix décroissant" },
          { value: "surface_asc", label: "Surface croissante" },
          { value: "surface_desc", label: "Surface décroissante" },
        ]
      : [
          { value: "recent", label: "Plus récents" },
          { value: "rent_asc", label: "Loyer croissant" },
          { value: "rent_desc", label: "Loyer décroissant" },
          { value: "surface_asc", label: "Surface croissante" },
          { value: "surface_desc", label: "Surface décroissante" },
        ];

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    const next = e.target.value;
    if (next && next !== "recent") params.set("sort", next);
    else params.delete("sort");
    params.delete("page");
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="inline-flex items-center gap-3 rounded-lg border border-subtle bg-card px-4 py-2.5 shadow-[0_1px_0_rgba(28,27,25,0.02)] transition-colors duration-150 hover:border-default hover:bg-section/40 focus-within:ring-2 focus-within:ring-focus">
      <ArrowUpDown className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      <span className="flex min-w-0 flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          Trier par
        </span>
        <span className="relative">
          <select
            aria-label="Trier par"
            value={value ?? "recent"}
            onChange={onChange}
            className="w-full cursor-pointer appearance-none bg-transparent pr-5 text-sm font-medium text-primary focus:outline-none"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        </span>
      </span>
    </div>
  );
}
