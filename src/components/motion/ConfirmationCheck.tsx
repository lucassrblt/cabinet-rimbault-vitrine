"use client";

import { LIEU_DE_RENDU, useMarquerHydratation } from "./hydration";

// Coche de la confirmation du tunnel (brief §7) : le trait se trace une seule
// fois, 400 ms (`stroke-dashoffset`, bloc MOUVEMENT de globals.css), quand
// elle est montée dans une page déjà hydratée (après l'envoi du tunnel).
// Rendue par le serveur, sans JavaScript ou sous `prefers-reduced-motion:
// reduce` : la coche est simplement dessinée, sans animation.
//
// Couleur : `--color-succes`, seul usage autorisé de cette teinte (brief
// §3.1). Trait de 1,5 comme les icônes lucide (doc 03 §7). Décorative : le
// titre de la confirmation porte le sens.

type Props = {
  /** Côté en pixels (24 par défaut). */
  taille?: number;
  className?: string;
};

export function ConfirmationCheck({ taille = 24, className }: Props) {
  // `data-mv-rendu` : « serveur » si la coche vient du HTML du serveur
  // (gardé à l'hydratation, rien ne rejoue sur une coche déjà peinte),
  // « client » si elle est montée dans le navigateur ; seule la seconde se
  // trace (voir hydration.ts).
  useMarquerHydratation();

  return (
    <svg
      className={["mv-coche text-succes", className].filter(Boolean).join(" ")}
      data-mv-rendu={LIEU_DE_RENDU}
      suppressHydrationWarning
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" pathLength={1} />
    </svg>
  );
}
