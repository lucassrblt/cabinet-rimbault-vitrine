"use client";

// Le mur de la variante : blanc chaud partout, grenat sur la page du cabinet.
// Composant client du socle, avec l'en-tête et le défilement : il lit le chemin pour peindre
// le mur et observe les apparitions (apparitions.ts), hors zones locales.
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { observerApparitions } from "./apparitions";

export function Mur({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const grenat = pathname.endsWith("/le-cabinet");

  useEffect(() => observerApparitions(document.body, { horsZones: true }), []);

  return (
    <div className={className} data-mur={grenat ? "grenat" : "blanc"}>
      {children}
    </div>
  );
}
