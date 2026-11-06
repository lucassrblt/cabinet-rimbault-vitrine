"use client";

// Défilement doux à la molette et au pavé tactile (Lenis). Rien au doigt : le
// défilement natif des téléphones reste intact. Coupé si le visiteur demande
// moins de mouvement. Les ancres internes passent par Lenis (`anchors`).
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

export function Defilement() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
