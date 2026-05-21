"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, STAGGER_STEP, VIEWPORT } from "@/lib/motion";

const directionOffset = {
  up: { y: 20 },
  left: { x: -20 },
  right: { x: 20 },
} as const;

export function ScrollReveal({
  children,
  className,
  delay = 0,
  index = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Position dans une cascade — ajoute `index * STAGGER_STEP` au délai. */
  index?: number;
  direction?: "up" | "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={VIEWPORT}
      transition={{
        duration: 0.7,
        delay: delay + index * STAGGER_STEP,
        ease: EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
