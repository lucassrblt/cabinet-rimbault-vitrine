import type { ReactNode } from "react";

export function StatPill({
  value,
  label,
  icon,
}: {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800">
      {icon && <span className="text-zinc-500">{icon}</span>}
      <span className="font-semibold">{value}</span>
      <span className="text-zinc-500">{label}</span>
    </div>
  );
}

export function StatBlock({
  value,
  label,
}: {
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-zinc-200 p-5 text-center">
      <span className="text-3xl font-semibold tracking-tight text-zinc-900">
        {value}
      </span>
      <span className="mt-1 text-sm text-zinc-600">{label}</span>
    </div>
  );
}
