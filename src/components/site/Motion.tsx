"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Pilote le mouvement de la page sans envelopper chaque bloc :
 * - pose `data-visible` sur les éléments `[data-reveal]` quand ils entrent
 *   dans l'écran (une seule fois) ;
 * - pose `data-scrolled` sur l'en-tête dès qu'on a défilé.
 */
export function Motion() {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: le changement de page doit relancer l'observation des nouveaux blocs
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      "[data-reveal]:not([data-visible])",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-visible", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".en-tete");
    if (!header) return;
    const update = () =>
      header.toggleAttribute("data-scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return null;
}
