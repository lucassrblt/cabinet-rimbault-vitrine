"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { useMarquerHydratation } from "./hydration";
import { mouvementAutorise } from "./reducedMotion";
import { DUREES, EASE_SOBRE } from "./tokens";

// Fondu enchaîné entre deux contenus de même emplacement (brief §7) :
// changement de photo au clavier ou par les boutons dans la visionneuse,
// 180 ms. La nouvelle photo est posée tout de suite ; l'ancienne reste
// par-dessus, le temps de disparaître, puis elle est retirée. Aucun
// déplacement, aucune échelle.
//
// Le conteneur est une grille d'une seule cellule : le calque courant et le
// calque sortant s'y superposent exactement. Chaque calque centre son
// contenu (`display: grid; place-items: center`), ce que `calqueClassName`
// peut remplacer ; il s'applique aux deux calques, qui restent identiques.
//
// Le défilement tactile (scroll-snap natif) n'utilise pas ce composant :
// la photo y suit le doigt.

type Props = {
  /** Identifiant du contenu (ex. l'index de la photo). Change = fondu. */
  cle: string | number;
  children: ReactNode;
  /** Classes du conteneur (taille, fond). */
  className?: string;
  /** Classes communes aux deux calques (alignement du contenu). */
  calqueClassName?: string;
};

type Sortant = { cle: string | number; contenu: ReactNode };

export function CrossFade({
  cle,
  children,
  className,
  calqueClassName,
}: Props) {
  const [sortant, setSortant] = useState<Sortant | null>(null);
  // Contenu tel qu'il était au premier rendu de la clé courante : c'est lui
  // qui sortira en fondu au prochain changement de clé.
  const [courant, setCourant] = useState<Sortant>({ cle, contenu: children });
  const calque = useRef<HTMLDivElement>(null);
  useMarquerHydratation();

  // Changement de clé (ajustement d'état pendant le rendu, sans effet) :
  // l'ancien contenu passe dans le calque sortant.
  if (courant.cle !== cle) {
    setCourant({ cle, contenu: children });
    setSortant(mouvementAutorise() ? courant : null);
  }

  useLayoutEffect(() => {
    const el = calque.current;
    if (!sortant || !el || typeof el.animate !== "function") {
      if (sortant) setSortant(null);
      return;
    }
    const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: DUREES.fonduPhoto,
      easing: EASE_SOBRE,
      fill: "forwards",
    });
    a.finished.then(
      () => setSortant(null),
      () => {},
    );
    return () => a.cancel();
  }, [sortant]);

  return (
    <div className={["mv-fondu-enchaine", className].filter(Boolean).join(" ")}>
      <div className={classes(calqueClassName)}>{children}</div>
      {sortant ? (
        <div
          ref={calque}
          key={String(sortant.cle)}
          className={classes(calqueClassName, "mv-fondu-enchaine-sortant")}
          aria-hidden="true"
          inert
        >
          {sortant.contenu}
        </div>
      ) : null}
    </div>
  );
}

function classes(...autres: (string | undefined)[]) {
  return ["mv-fondu-enchaine-calque", ...autres].filter(Boolean).join(" ");
}
