"use client";

// Note Google comptée une fois jusqu'à sa valeur (900 ms), quand elle entre à
// l'écran. Valeur exacte dès le rendu serveur et sous `prefers-reduced-motion`.
import { useEffect, useRef, useState } from "react";
import s from "./base.module.css";

export function Note({ value }: { value: string }) {
  const cible = Number(value.replace(",", "."));
  const [txt, setTxt] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      !Number.isFinite(cible) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 900);
        const k = 1 - (1 - p) ** 3;
        setTxt((cible * k).toFixed(1).replace(".", ","));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [cible]);

  return (
    <span ref={ref}>
      <span className={s.sr}>{value}</span>
      <span aria-hidden>{txt}</span>
    </span>
  );
}
