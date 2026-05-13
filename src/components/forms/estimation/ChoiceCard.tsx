"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChoiceCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  layout?: "vertical" | "horizontal";
  size?: "md" | "sm";
}

export function ChoiceCard({
  selected,
  onClick,
  icon,
  title,
  description,
  layout = "vertical",
  size = "md",
}: ChoiceCardProps) {
  const padding = size === "sm" ? "px-4 py-3.5" : "px-4 py-4";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-sm border bg-card text-left transition-colors duration-200",
        padding,
        selected
          ? "border-primary-600"
          : "border-subtle hover:border-default hover:shadow-md",
        layout === "vertical" && "flex-col gap-3 sm:gap-3",
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex items-center justify-center rounded-full transition-colors duration-200",
            layout === "vertical" ? "h-10 w-10" : "h-9 w-9 shrink-0",
            selected
              ? "bg-primary-600 text-on-primary"
              : "bg-neutral-100 text-neutral-500",
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex flex-1 flex-col gap-1 pr-6">
        <span
          className={cn(
            "font-medium leading-tight text-primary",
            size === "sm" ? "text-sm" : "text-[15px]",
          )}
        >
          {title}
        </span>
        {description && (
          <span className="text-xs leading-relaxed text-muted">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-200",
          selected
            ? "border-primary-600 bg-primary-600 text-on-primary"
            : "border-default bg-card text-transparent",
        )}
      >
        <Check className="h-2.5 w-2.5" strokeWidth={3} />
      </span>
    </button>
  );
}
