"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { X } from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DrawerSide = "right" | "bottom";
type DrawerSize = "sm" | "md" | "lg";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: DrawerSide;
  size?: DrawerSize;
  footer?: ReactNode;
  children: ReactNode;
}

const RIGHT_SIZES: Record<DrawerSize, string> = {
  sm: "w-full sm:max-w-sm",
  md: "w-full sm:max-w-md",
  lg: "w-full sm:max-w-lg",
};

const BOTTOM_SIZES: Record<DrawerSize, string> = {
  sm: "max-h-[50vh]",
  md: "max-h-[70vh]",
  lg: "max-h-[85vh]",
};

const ease = [0.4, 0, 0.2, 1] as const;

export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  size = "md",
  footer,
  children,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      previousFocusRef.current?.focus?.();
    };
  }, [open]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleKey]);

  if (!mounted) return null;

  const isRight = side === "right";
  const panelInitial = isRight ? { x: "100%" } : { y: "100%" };
  const panelAnimate = isRight ? { x: 0 } : { y: 0 };

  const panelClass = isRight
    ? cn(
        "absolute inset-y-0 right-0 flex flex-col bg-card shadow-lg",
        RIGHT_SIZES[size],
      )
    : cn(
        "absolute inset-x-0 bottom-0 flex flex-col rounded-t-lg bg-card shadow-lg",
        BOTTOM_SIZES[size],
      );

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <motion.button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease }}
          />
          <motion.aside
            className={panelClass}
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelInitial}
            transition={{ duration: 0.18, ease }}
          >
            <header className="flex items-center justify-between border-b border-subtle px-5 py-4">
              <h2 id={titleId} className="text-base font-semibold text-primary">
                {title}
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Fermer"
                onClick={onClose}
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted hover:bg-section hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer && (
              <footer className="border-t border-subtle bg-card px-5 py-4">
                {footer}
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
