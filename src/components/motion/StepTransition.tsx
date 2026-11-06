"use client";

import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useMarquerHydratation } from "./hydration";
import { mouvementAutorise } from "./reducedMotion";
import { DECALAGE_ETAPE, DUREES, EASE_SOBRE } from "./tokens";

// Changement d'étape du tunnel d'estimation (brief §7) :
//   1. l'étape courante sort en fondu (120 ms, opacité seule) ;
//   2. la nouvelle entre en fondu avec 12 px de translation horizontale
//      (220 ms) : elle arrive par la droite et glisse vers la gauche pour
//      « Continuer » (sens "avant"), par la gauche vers la droite pour
//      « Retour » (sens "arriere") ;
//   3. à la fin de l'entrée, le focus passe au titre de l'étape.
//
// Sous `prefers-reduced-motion: reduce` ou sans Web Animations API : échange
// immédiat, focus immédiat. Au premier rendu (y compris l'hydratation) :
// aucune animation, aucun déplacement du focus.
//
// Pendant les 120 ms de sortie, c'est le contenu de l'étape précédente qui
// reste affiché (dernier rendu validé), puis `children` prend le relais.

type Props = {
  /** Identifiant de l'étape affichée (ex. le `?etape=`). Change = transition. */
  etape: string | number;
  /** Sens de la navigation : "avant" (Continuer), "arriere" (Retour). */
  sens: "avant" | "arriere";
  children: ReactNode;
  className?: string;
  /**
   * Déplacer le focus sur le titre de l'étape à la fin de l'entrée
   * (élément `[data-titre-etape]`, sinon premier `h1` ou `h2`). Vrai par défaut.
   */
  focusTitre?: boolean;
  /** Appelé à la fin de l'entrée (après le focus). */
  onEntree?: () => void;
};

function focaliserTitre(racine: HTMLElement) {
  const titre =
    racine.querySelector<HTMLElement>("[data-titre-etape]") ??
    racine.querySelector<HTMLElement>("h1, h2");
  if (!titre) return;
  if (!titre.hasAttribute("tabindex")) titre.setAttribute("tabindex", "-1");
  titre.focus();
}

export function StepTransition({
  etape,
  sens,
  children,
  className,
  focusTitre = true,
  onEntree,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [etapeAffichee, setEtapeAffichee] = useState(etape);
  // Contenu du dernier rendu validé pour l'étape affichée : c'est lui qui
  // sort en fondu pendant que `etape` a déjà changé.
  const contenuAffiche = useRef<ReactNode>(children);
  const enSortie = etape !== etapeAffichee;
  // Dernière étape dont l'entrée a été jouée. Initialisée à l'étape du
  // premier rendu : ni animation ni focus au montage (y compris le double
  // montage du mode strict de React en développement).
  const entreeJouee = useRef(etape);
  // Derniers rappels, lus à la fin de l'animation.
  const options = useRef({ sens, focusTitre, onEntree });
  // Animation de sortie en cours, s'il y en a une.
  const sortieEnCours = useRef<Animation | null>(null);
  useMarquerHydratation();

  useLayoutEffect(() => {
    options.current = { sens, focusTitre, onEntree };
    if (!enSortie) contenuAffiche.current = children;
  });

  // 1. Sortie de l'étape affichée.
  useEffect(() => {
    if (!enSortie) {
      // Retour à l'étape affichée pendant sa sortie (double « Retour »
      // rapide) : on annule le fondu, l'étape redevient visible. Après une
      // sortie terminée, l'entrée l'a déjà annulée : sans effet.
      sortieEnCours.current?.cancel();
      sortieEnCours.current = null;
      return;
    }
    const el = ref.current;
    if (!el || !mouvementAutorise() || typeof el.animate !== "function") {
      setEtapeAffichee(etape);
      return;
    }
    let annule = false;
    // Image clé unique : la sortie part de l'opacité courante (si l'étape
    // change de nouveau pendant une sortie, rien ne saute).
    const sortie = el.animate([{ opacity: 0 }], {
      duration: DUREES.etapeSortie,
      easing: EASE_SOBRE,
      fill: "forwards",
    });
    sortieEnCours.current = sortie;
    sortie.finished.then(
      () => {
        if (!annule) setEtapeAffichee(etape);
      },
      () => {},
    );
    return () => {
      annule = true;
    };
  }, [enSortie, etape]);

  // 2. Entrée de la nouvelle étape, avant la première peinture.
  useLayoutEffect(() => {
    if (entreeJouee.current === etapeAffichee) return;
    entreeJouee.current = etapeAffichee;
    const el = ref.current;
    if (!el) return;
    for (const a of el.getAnimations()) a.cancel();

    const terminer = () => {
      if (options.current.focusTitre) focaliserTitre(el);
      options.current.onEntree?.();
    };
    if (!mouvementAutorise() || typeof el.animate !== "function") {
      terminer();
      return;
    }
    const depart =
      options.current.sens === "arriere" ? -DECALAGE_ETAPE : DECALAGE_ETAPE;
    const entree = el.animate(
      [
        { opacity: 0, transform: `translateX(${depart}px)` },
        { opacity: 1, transform: "translateX(0)" },
      ],
      { duration: DUREES.etapeEntree, easing: EASE_SOBRE },
    );
    entree.finished.then(terminer, () => {});
  }, [etapeAffichee]);

  return (
    <div
      ref={ref}
      className={className}
      aria-busy={enSortie || undefined}
      data-mv-etape=""
    >
      {enSortie ? contenuAffiche.current : children}
    </div>
  );
}
