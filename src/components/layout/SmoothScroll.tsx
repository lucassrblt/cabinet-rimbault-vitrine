"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

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
      <NavigationScrollReset />
      {children}
    </ReactLenis>
  );
}

/**
 * Remet le scroll à 0 dès le clic utilisateur sur un Link interne, AVANT que
 * Next ne commence le rendu. Combiné au top loader, l'utilisateur perçoit
 * « ça part » au lieu d'attendre 1-2 s avant qu'il se passe quelque chose.
 *
 * Le filet post-navigation (effet sur `pathname`) rattrape les cas où le
 * scroll n'aurait pas été initié par un clic (back/forward, router.push
 * programmatique, etc.).
 */
function NavigationScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  // Reset au clic sur un lien interne — instantané, avant le commit Next.
  useEffect(() => {
    if (typeof window === "undefined") return;

    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      // `data-no-scroll-reset` pour opt-out ponctuel.
      if (anchor.dataset.noScrollReset !== undefined) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      // Lien externe : on ne touche à rien.
      if (url.origin !== window.location.origin) return;
      // Ancre sur la page courante → laisser le scroll vers la cible.
      if (url.pathname === window.location.pathname && url.hash) return;
      // Même URL exacte (re-clic) → ne pas perturber.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        !url.hash
      ) {
        return;
      }

      const instance = lenisRef.current;
      if (instance) {
        instance.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 0);
      }
    }

    // Capture phase : on passe avant le handler de Next sur le Link.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Filet de sécurité : back/forward, router.push programmatique, etc.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    void pathname;
    const instance = lenisRef.current;
    if (instance) {
      instance.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
