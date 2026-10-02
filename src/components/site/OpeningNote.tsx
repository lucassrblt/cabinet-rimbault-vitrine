"use client";

import { useEffect, useState } from "react";
import { type OpeningStatus, openingStatus } from "@/lib/opening";
import { cn } from "@/lib/utils";

/**
 * Le statut d'ouverture en une ligne, là où il sert : à côté d'un bouton
 * d'appel. Calculé dans le navigateur, les pages étant mises en cache.
 */
export function OpeningNote({ className }: { className?: string }) {
  const [status, setStatus] = useState<OpeningStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(openingStatus());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p
      aria-live="polite"
      className={cn(
        "text-mention text-gris transition-opacity duration-500",
        status ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {status ? `${status.label}.` : " "}
    </p>
  );
}
