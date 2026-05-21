"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, VIEWPORT } from "@/lib/motion";

/** clip-path de départ selon le sens du balayage. */
const CLIP_HIDDEN = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
} as const;

const CLIP_SHOWN = "inset(0% 0% 0% 0%)";

/**
 * Révèle ses enfants par un balayage (clip-path) au scroll — primitive
 * d'animation dans la lignée de ScrollReveal / TextReveal.
 *
 * Sous `prefers-reduced-motion`, le balayage est remplacé par un simple fondu
 * (le clip-path piloté en `whileInView` n'est pas couvert par `MotionConfig`).
 */
export function RevealMask({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.8,
}: {
  children: ReactNode;
  className?: string;
  direction?: keyof typeof CLIP_HIDDEN;
  delay?: number;
  duration?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.4, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ clipPath: CLIP_HIDDEN[direction] }}
      whileInView={{ clipPath: CLIP_SHOWN }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
