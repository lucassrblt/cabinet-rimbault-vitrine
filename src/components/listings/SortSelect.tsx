"use client";

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
          { value: "price_asc", label: "Prix ↑" },
          { value: "price_desc", label: "Prix ↓" },
          { value: "surface_asc", label: "Surface ↑" },
          { value: "surface_desc", label: "Surface ↓" },
        ]
      : [
          { value: "recent", label: "Plus récents" },
          { value: "rent_asc", label: "Loyer ↑" },
          { value: "rent_desc", label: "Loyer ↓" },
          { value: "surface_asc", label: "Surface ↑" },
          { value: "surface_desc", label: "Surface ↓" },
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
    <label className="flex items-center gap-2 text-sm text-zinc-700">
      <span>Trier par</span>
      <select
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm"
        value={value ?? "recent"}
        onChange={onChange}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
