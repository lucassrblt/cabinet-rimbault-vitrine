"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { type PointerEvent, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

/** Ressort léger — suivi vif du curseur, retour élastique. */
const SPRING = { stiffness: 150, damping: 15, mass: 0.1 };

/**
 * Bouton « magnétique » — l'enfant suit légèrement le curseur au survol, puis
 * revient en place (ressort) au départ du curseur.
 *
 * Le `<div>` externe reste stable (repère de mesure fiable) ; seul le
 * `motion.div` interne est translaté. Souris uniquement ; neutralisé sous
 * `prefers-reduced-motion`.
 */
export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  /** Fraction de l'écart curseur ↔ centre reportée sur le bouton. */
  strength?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      className={cn("inline-flex", className)}
    >
      <motion.div className="inline-flex" style={{ x: springX, y: springY }}>
        {children}
      </motion.div>
    </div>
  );
}
