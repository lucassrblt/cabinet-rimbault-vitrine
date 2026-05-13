"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface FilterPopoverProps {
  label: string;
  valueLabel?: string;
  active?: boolean;
  icon?: React.ElementType;
  width?: "sm" | "md" | "lg";
  variant?: "standalone" | "cell";
  children: (close: () => void) => ReactNode;
}

const PANEL_WIDTHS: Record<NonNullable<FilterPopoverProps["width"]>, string> = {
  sm: "md:w-64",
  md: "md:w-72",
  lg: "md:w-96",
};

const ease = [0.4, 0, 0.2, 1] as const;

export function FilterPopover({
  label,
  valueLabel,
  active = false,
  icon: Icon,
  width = "md",
  variant = "standalone",
  children,
}: FilterPopoverProps) {
  const isCell = variant === "cell";
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 text-left transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus",
          isCell
            ? cn(
                "h-full rounded-lg px-3.5 py-2 md:px-4 md:py-2.5",
                active ? "bg-primary-50/60" : "hover:bg-section/40",
              )
            : cn(
                "rounded-lg border bg-card px-4 py-2.5 shadow-[0_1px_0_rgba(28,27,25,0.02)]",
                active
                  ? "border-primary-200 bg-primary-50/60"
                  : "border-subtle hover:border-default hover:bg-section/40",
              ),
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "shrink-0 transition-colors",
              isCell ? "h-5 w-5" : "h-4 w-4",
              active ? "text-primary-600" : "text-primary-600/80",
            )}
            aria-hidden="true"
          />
        )}
        <span className="flex min-w-0 flex-col">
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors",
              active ? "text-primary-600/80" : "text-muted",
            )}
          >
            {label}
          </span>
          <span
            className={cn(
              "truncate text-sm font-medium transition-colors",
              active ? "text-primary-700" : "text-primary",
            )}
          >
            {valueLabel ?? "Indifférent"}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "ml-auto h-3 w-3 shrink-0 transition-all duration-200",
            active ? "text-primary-600" : "text-muted",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={close}
              className="fixed inset-0 z-30 cursor-default bg-black/20 md:hidden"
            />
            <motion.div
              id={panelId}
              role="dialog"
              aria-label={label}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease }}
              className={cn(
                "fixed inset-x-3 bottom-3 z-40 max-h-[70vh] overflow-y-auto rounded-lg border border-subtle bg-card p-4 shadow-xl",
                "md:absolute md:inset-x-auto md:bottom-auto md:left-0 md:top-[calc(100%+8px)] md:max-h-[80vh] md:p-4",
                PANEL_WIDTHS[width],
              )}
            >
              {children(close)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
