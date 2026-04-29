"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

const fmt = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

export function AnimatedCounter({
  target,
  suffix = "",
  decimals = 0,
  duration = 1.5,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => {
    const rounded =
      decimals > 0 ? Number.parseFloat(v.toFixed(decimals)) : Math.round(v);
    return fmt.format(rounded);
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, motionVal, target, duration]);

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
