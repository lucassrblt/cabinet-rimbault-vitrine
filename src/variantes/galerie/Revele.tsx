"use client";

// Observateur d'apparitions d'une zone `data-rv-local` (voir apparitions.ts),
// monté dans la zone : son effet ne court qu'une fois la zone hydratée.
import { useEffect, useRef } from "react";
import { observerApparitions, ZONE_LOCALE } from "./apparitions";

export function Revele() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const zone = ref.current?.closest(`[${ZONE_LOCALE}]`);
    return zone ? observerApparitions(zone) : undefined;
  }, []);
  return <span ref={ref} hidden />;
}
