"use client";

import { ReactLenis } from "lenis/react";
import { type ReactNode, useEffect, useMemo, useState } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // En reduced-motion, Lenis reste monté mais en passthrough (scroll natif) :
  // on évite ainsi de remonter tout l'arbre du site.
  const options = useMemo(
    () =>
      reduced
        ? { lerp: 1, smoothWheel: false }
        : { lerp: 0.1, duration: 1.1, smoothWheel: true },
    [reduced],
  );

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}
