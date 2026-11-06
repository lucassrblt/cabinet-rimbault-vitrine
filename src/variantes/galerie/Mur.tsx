"use client";

// Le mur de la variante : blanc chaud partout, grenat sur la page du cabinet.
// Seul composant client du socle avec l'en-tête : il lit le chemin pour peindre
// le mur et observe les éléments `data-rv` (apparition une fois).
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";

export function Mur({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const grenat = pathname.endsWith("/le-cabinet");

  useEffect(() => {
    // Chaque nouveau bloc `data-rv` apparaît une fois, à son entrée à l'écran.
    if (!("IntersectionObserver" in window)) {
      for (const el of document.querySelectorAll("[data-rv]")) {
        el.setAttribute("data-in", "");
      }
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    const scan = () => {
      for (const el of document.querySelectorAll("[data-rv]:not([data-in])")) {
        io.observe(el);
      }
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div className={className} data-mur={grenat ? "grenat" : "blanc"}>
      {children}
    </div>
  );
}
