"use client";

import type { ReactNode } from "react";
import { LIEU_DE_RENDU, useMarquerHydratation } from "./hydration";

// Ouverture de l'accueil : la seule séquence orchestrée du site (brief §7),
// 500 ms au total, au premier chargement du document seulement.
//   - [data-ouverture="titre"]        : opacité 0 → 1, 8 px vers le haut, 0 ms
//   - [data-ouverture="suite"]        : chapô et actions, même mouvement, +80 ms
//   - [data-ouverture="illustration"] : ILL-01, fondu seul, +160 ms
// Rien d'autre ne bouge.
//
// La séquence est une animation CSS (bloc MOUVEMENT de globals.css) qui
// part dès la première peinture et finit toujours visible, même si le
// JavaScript ne s'exécute jamais. Elle n'est active que sous
// `(scripting: enabled)` et `(prefers-reduced-motion: no-preference)` :
// sans JavaScript, tout est visible d'emblée. Poser l'état invisible après
// l'hydratation ferait clignoter un contenu déjà peint (visible, puis caché,
// puis visible) : voir journal-implementation.md, lot I.
//
// Premier chargement seulement : `data-mv-ouverture` vaut « serveur » quand
// le bloc vient du HTML du serveur (gardé tel quel à l'hydratation), et
// « client » quand l'accueil est monté après une navigation côté client ;
// la CSS n'anime que la première valeur, seul le fondu de page joue alors.
// Aucune lecture d'état pendant le rendu : robuste à un loading.tsx ou à une
// frontière <Suspense> au-dessus (voir hydration.ts).

type Props = {
  children: ReactNode;
  className?: string;
  /** Balise de l'enveloppe (par défaut `div`). */
  as?: "div" | "section" | "header";
  /** Transmis tel quel (ex. `aria-labelledby` d'une section). */
  "aria-labelledby"?: string;
};

export function HomeOpening({
  children,
  className,
  as: Balise = "div",
  ...aria
}: Props) {
  useMarquerHydratation();

  return (
    <Balise
      className={className}
      data-mv-ouverture={LIEU_DE_RENDU}
      suppressHydrationWarning
      {...aria}
    >
      {children}
    </Balise>
  );
}
