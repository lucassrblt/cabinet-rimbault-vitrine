"use client";

import { useSyncExternalStore } from "react";

// Préférence de mouvement du visiteur. Le mouvement n'est joué que sous
// `prefers-reduced-motion: no-preference` (brief §7).

const REQUETE = "(prefers-reduced-motion: no-preference)";

/** Vrai si le visiteur accepte le mouvement. Faux côté serveur. */
export function mouvementAutorise(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REQUETE).matches;
}

function abonner(rappel: () => void): () => void {
  const liste = window.matchMedia(REQUETE);
  liste.addEventListener("change", rappel);
  return () => liste.removeEventListener("change", rappel);
}

/**
 * Hook : vrai si le visiteur a demandé de réduire les animations.
 * Rend `true` au rendu serveur et pendant l'hydratation (aucun mouvement
 * tant que la préférence n'est pas connue), puis la vraie valeur.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    abonner,
    () => !mouvementAutorise(),
    () => true,
  );
}
