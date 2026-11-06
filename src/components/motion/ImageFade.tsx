"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { useMarquerHydratation } from "./hydration";
import { mouvementAutorise } from "./reducedMotion";

// Fondu d'une image au moment où elle est décodée (brief §7 et A25) :
// 300 ms, opacité seule. Ce n'est PAS une apparition au défilement : l'image
// apparaît quand ses pixels sont prêts, où qu'elle soit dans la page, pour
// éviter le « pop » d'une image qui se peint par morceaux.
//
// Règles :
// - L'état invisible n'est posé qu'en JavaScript, après l'hydratation, sous
//   `prefers-reduced-motion: no-preference`, et seulement sur une image qui
//   n'est pas encore chargée. Sans JavaScript, ou image déjà en cache : rien
//   ne bouge, l'image est visible tout de suite.
// - Erreur de chargement : l'image est rendue visible (texte alternatif).
// - Ne pas envelopper une image `priority` (ILL-01, photo principale d'une
//   fiche) : le LCP n'attend jamais une animation. ILL-01 a sa propre entrée
//   dans <HomeOpening>.
//
// Enveloppe :
// - sans `className`, elle est en `display: contents` : aucune boîte, la mise
//   en page ne change pas (image à dimensions fixes) ;
// - avec `<Image fill />`, Next exige un parent direct positionné : passer
//   alors le cadre lui-même en `className` (ex. `relative aspect-[4/3]
//   overflow-hidden bg-creme-soutenu`), l'enveloppe devient ce cadre.

type Props = {
  children: ReactNode;
  /** Classes du cadre. Absent : enveloppe sans boîte (`display: contents`). */
  className?: string;
  /** Balise de l'enveloppe : `span` dans un contexte de texte, sinon `div`. */
  as?: "div" | "span";
};

export function ImageFade({ children, className, as: Balise = "div" }: Props) {
  const ref = useRef<HTMLDivElement & HTMLSpanElement>(null);
  useMarquerHydratation();

  useLayoutEffect(() => {
    const racine = ref.current;
    if (!racine || !mouvementAutorise()) return;

    const nettoyages: (() => void)[] = [];
    for (const img of racine.querySelectorAll("img")) {
      if (img.complete) continue; // déjà peinte (ou en erreur) : on n'y touche pas
      img.setAttribute("data-fondu", "attente");

      let fini = false;
      const montrer = () => {
        if (fini) return;
        fini = true;
        img.setAttribute("data-fondu", "visible");
      };
      const auChargement = () => {
        // decode() garantit que la première image peinte est complète.
        img.decode().then(montrer, montrer);
      };
      img.addEventListener("load", auChargement, { once: true });
      img.addEventListener("error", montrer, { once: true });
      nettoyages.push(() => {
        img.removeEventListener("load", auChargement);
        img.removeEventListener("error", montrer);
        if (!fini) img.removeAttribute("data-fondu");
      });
    }
    return () => {
      for (const n of nettoyages) n();
    };
  }, []);

  return (
    <Balise ref={ref} className={className ?? "mv-image-fade"}>
      {children}
    </Balise>
  );
}
