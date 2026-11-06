"use client";

import { useEffect } from "react";

// Deux outils, sans aucune lecture d'état global pendant le rendu :
//
// 1. `useMarquerHydratation()` pose `data-mv-hydrate` sur <html> après la
//    première hydratation. Cet attribut active les apparitions en fondu
//    (panneaux, champs du tunnel) : sans JavaScript, ou avant l'hydratation,
//    rien n'est jamais masqué (brief §7). Il n'agit que par CSS, jamais sur
//    le rendu React : aucun désaccord d'hydratation possible.
//
// 2. `LIEU_DE_RENDU` vaut « serveur » pendant le rendu serveur et « client »
//    dans le navigateur. Un composant qui doit distinguer « rendu par le
//    serveur puis hydraté » de « monté côté client » (ouverture de l'accueil,
//    coche de confirmation) écrit cette valeur dans un attribut porteur de
//    `suppressHydrationWarning`. À l'hydratation, React garde l'attribut du
//    serveur (il ne corrige jamais un attribut) ; lors d'un montage côté
//    client, l'attribut vaut la valeur du client. La décision est donc portée
//    par le DOM lui-même : elle ne dépend ni de l'ordre d'hydratation, ni
//    d'une frontière <Suspense> ou d'un loading.tsx (journal, lot I, tour 2).
//    `suppressHydrationWarning` ne couvre que les attributs de l'élément qui
//    le porte, jamais ses enfants.

export const LIEU_DE_RENDU: "serveur" | "client" =
  typeof window === "undefined" ? "serveur" : "client";

let hydrate = false;

/** À appeler dans chaque composant de mouvement (sans effet visible). */
export function useMarquerHydratation(): void {
  useEffect(() => {
    if (hydrate) return;
    hydrate = true;
    document.documentElement.setAttribute("data-mv-hydrate", "");
  }, []);
}
