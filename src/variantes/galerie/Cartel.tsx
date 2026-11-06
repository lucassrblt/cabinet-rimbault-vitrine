// Cartel d'une œuvre (un bien) : référence, titre, lieu, mesures, prix,
// statut et exclusivité, « Voir le bien ». Seules les valeurs connues sont écrites.
import type { CSSProperties } from "react";
import { type PropertyView, referenceLabel } from "@/lib/property/view";
import s from "./base.module.css";
import { mesuresCartel, serifSpaces, titreCartel } from "./data";

export function Cartel({
  view,
  className,
  delay = 2,
  voir = true,
}: {
  view: PropertyView;
  className?: string;
  /** Rang de départ de la cascade d'apparition. */
  delay?: number;
  voir?: boolean;
}) {
  const mesures = mesuresCartel(view);
  const step = (k: number) => ({ "--i": delay + k }) as CSSProperties;
  return (
    <div className={`${s.cartel} ${s.num} ${className ?? ""}`}>
      <span className={`${s.ref} ${s.up}`} style={step(0)}>
        {referenceLabel(view.reference)}
      </span>
      <span className={`${s.ti} ${s.up}`} style={step(0)}>
        <span>{titreCartel(view)}</span>
      </span>
      {view.place ? (
        <span className={s.up} style={step(1)}>
          {view.place}
        </span>
      ) : null}
      {mesures ? (
        <span className={s.up} style={step(1)}>
          {mesures}
        </span>
      ) : null}
      {view.priceLabel ? (
        <span className={`${s.px} ${s.up}`} style={step(2)}>
          {serifSpaces(view.priceLabel)}
        </span>
      ) : null}
      {view.statusLabel ? (
        <em className={`${s.marque} ${s.up}`} style={step(2)}>
          {view.statusLabel}
        </em>
      ) : null}
      {view.isExclusive ? (
        <em className={`${s.marque} ${s.up}`} style={step(2)}>
          En exclusivité
        </em>
      ) : null}
      {voir ? (
        <span className={`${s.voir} ${s.up}`} style={step(3)} aria-hidden>
          Voir le bien
        </span>
      ) : null}
    </div>
  );
}

/** Photo au mur : voir PhotoMur (plafonnée à sa résolution, fondu à l’arrivée). */
export { PhotoMur as Photo } from "./PhotoMur";
