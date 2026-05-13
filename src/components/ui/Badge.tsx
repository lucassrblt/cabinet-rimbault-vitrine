import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "warning" | "success" | "muted";

const tones: Record<Tone, string> = {
  neutral: "bg-inverse text-white",
  accent: "bg-amber-100 text-amber-900 border border-amber-200",
  warning: "bg-red-100 text-red-900 border border-red-200",
  success: "bg-emerald-100 text-emerald-900 border border-emerald-200",
  muted: "bg-white/90 text-primary border border-subtle",
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
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
