"use client";

// Onglets de la fiche : changer d'onglet change la couleur du mur (blanc
// chaud, crème, poudré, 550 ms) et le texte passe en fondu. Les étiquettes
// énergie restent visibles à droite. Navigation clavier WAI-ARIA (flèches,
// Début, Fin).
import { type KeyboardEvent, type ReactNode, useRef, useState } from "react";
import s from "./base.module.css";
import f from "./fiche.module.css";

export type Onglet = {
  id: string;
  label: string;
  /** Libellé court sous 420 px, pour tenir sur une ligne à 320 px. */
  court?: string;
  mur: "blanc" | "creme" | "poudre";
  contenu: ReactNode;
};

export function Onglets({
  onglets,
  aside,
  children,
}: {
  onglets: Onglet[];
  aside: ReactNode;
  /** Bandeau « Visiter ce bien », posé sur le même mur. */
  children?: ReactNode;
}) {
  const [sel, setSel] = useState(0);
  const [shown, setShown] = useState(0);
  const [out, setOut] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    if (i === sel) return;
    setSel(i);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.clearTimeout(timer.current);
    if (reduce) {
      setShown(i);
      return;
    }
    setOut(true);
    timer.current = window.setTimeout(() => {
      setShown(i);
      setOut(false);
    }, 240);
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = onglets.length;
    let k: number | null = null;
    if (e.key === "ArrowRight") k = (i + 1) % n;
    else if (e.key === "ArrowLeft") k = (i - 1 + n) % n;
    else if (e.key === "Home") k = 0;
    else if (e.key === "End") k = n - 1;
    if (k === null) return;
    e.preventDefault();
    select(k);
    refs.current[k]?.focus();
  };

  return (
    <div className={f.tabzone} data-bg={onglets[sel]?.mur ?? "blanc"}>
      <div className={`${s.w} ${s.g} ${f.tabgrid}`} data-rv>
        <div
          className={`${f.tabs} ${s.up}`}
          role="tablist"
          aria-label="Détails du bien"
        >
          {onglets.map((o, i) => (
            <button
              key={o.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${o.id}`}
              aria-controls={`panel-${o.id}`}
              aria-selected={i === sel}
              tabIndex={i === sel ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {o.court ? (
                <>
                  <span className={f.long}>{o.label}</span>
                  <span className={f.court}>{o.court}</span>
                </>
              ) : (
                o.label
              )}
            </button>
          ))}
        </div>
        <div className={`${f.panels} ${s.up}`} style={{ "--i": 1 } as never}>
          {onglets.map((o, i) => (
            <div
              key={o.id}
              role="tabpanel"
              id={`panel-${o.id}`}
              aria-labelledby={`tab-${o.id}`}
              hidden={i !== shown}
              // biome-ignore lint/a11y/noNoninteractiveTabindex: modèle WAI-ARIA des onglets, le panneau reçoit le focus après l'onglet
              tabIndex={0}
              className={f.panel}
              data-out={out || undefined}
            >
              {o.contenu}
            </div>
          ))}
        </div>
        {aside}
      </div>
      {children}
    </div>
  );
}
