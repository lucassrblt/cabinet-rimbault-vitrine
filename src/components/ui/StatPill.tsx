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
    <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-card px-3 py-1.5 text-sm text-primary">
      {icon && <span className="text-muted">{icon}</span>}
      <span className="font-semibold">{value}</span>
      <span className="text-muted">{label}</span>
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
    <div className="flex flex-col items-center justify-center rounded-sm border border-subtle p-5 text-center">
      <span className="text-3xl font-semibold tracking-tight text-primary">
        {value}
      </span>
      <span className="mt-1 text-sm text-body">{label}</span>
    </div>
  );
}
