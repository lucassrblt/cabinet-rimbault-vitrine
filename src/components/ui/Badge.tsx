import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "warning" | "success" | "muted";

const tones: Record<Tone, string> = {
  neutral: "bg-zinc-900 text-white",
  accent: "bg-amber-100 text-amber-900 border border-amber-200",
  warning: "bg-red-100 text-red-900 border border-red-200",
  success: "bg-emerald-100 text-emerald-900 border border-emerald-200",
  muted: "bg-white/90 text-zinc-800 border border-zinc-200",
};

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
