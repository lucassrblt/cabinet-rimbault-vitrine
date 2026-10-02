"use client";

import { useEffect } from "react";

/**
 * Pilote le mouvement de la page sans envelopper chaque bloc :
 * - pose `data-visible` sur les éléments `[data-reveal]` quand ils entrent
 *   dans l'écran (une seule fois) ;
 * - pose `data-scrolled` sur l'en-tête dès qu'on a défilé.
 */
export function Motion() {
  // Observe aussi les blocs ajoutés après coup (changement de page ou de
  // variante sans rechargement) grâce à un MutationObserver.
  useEffect(() => {
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
    const scan = () => {
      for (const el of document.querySelectorAll(
        "[data-reveal]:not([data-visible])",
      )) {
        observer.observe(el);
      }
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

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
