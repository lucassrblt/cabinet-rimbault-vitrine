"use client";

import { usePathname } from "next/navigation";
import {
  type ReactNode,
  useEffect,
  useInsertionEffect,
  ViewTransition,
} from "react";
import { useMarquerHydratation } from "./hydration";

// Fondu enchaîné du contenu du <main> entre deux pages (brief §7) :
// 160 ms en sortie, 220 ms en entrée, aucun glissement.
//
// Repose sur <ViewTransition> de React, intégré au routeur de Next 16 (les
// navigations sont des transitions). Ne joue que lors d'une navigation côté
// client : jamais au premier chargement, jamais sans JavaScript. Navigateur
// sans View Transitions : la page change instantanément.
//
// La clé `pathname` force l'entrée et la sortie même quand le gabarit
// (template.tsx) n'est pas remonté, par exemple d'une fiche à une autre.
//
// En-tête et pied (bloc MOUVEMENT de globals.css, journal lot I, tour 3) :
// - l'en-tête porte `data-mv-entete` (lot 1) : son groupe passe au-dessus de
//   tout, sans animation. L'ancien contenu ne le recouvre jamais ;
// - à chaque changement de page, l'instantané racine (le fond et le pied)
//   fond lui aussi, en 220 ms, avec le même décalage de 80 ms que le nouveau
//   contenu : l'ancien pied s'efface et le nouveau apparaît pendant que
//   l'ancien contenu a déjà presque disparu (160 ms), jamais d'un coup sous
//   un texte encore lisible, que la page quittée soit défilée ou non.
//   React supprime d'ordinaire l'instantané racine quand seul un
//   <ViewTransition> imbriqué change (il pose `view-transition-name: none`
//   en ligne sur <html> si ce style est vide). Un nom `root` en ligne, posé
//   avant cette vérification (effet d'insertion, phase de mutation) et retiré
//   juste après la transition (effet passif), le garde.

let cheminPrecedent: string | null = null;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useMarquerHydratation();

  useInsertionEffect(() => {
    const html = document.documentElement;
    if (
      cheminPrecedent !== null &&
      cheminPrecedent !== pathname &&
      html.style.viewTransitionName === ""
    ) {
      html.style.viewTransitionName = "root";
    }
    cheminPrecedent = pathname;
  }, [pathname]);

  // Après chaque validation (sans dépendances : le gabarit n'est pas
  // toujours remonté d'une page à l'autre).
  useEffect(() => {
    const html = document.documentElement;
    if (html.style.viewTransitionName === "root") {
      html.style.viewTransitionName = "";
    }
  });

  return (
    <ViewTransition
      key={pathname}
      enter="mv-page"
      exit="mv-page"
      default="none"
    >
      <div className="mv-page">{children}</div>
    </ViewTransition>
  );
}
