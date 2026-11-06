// Étiquettes DPE et GES sur l'échelle officielle 2021 (DPE vert → rouge, GES
// en violets). La classe active est agrandie et cerclée d'encre ; les barres se
// dessinent une fois, de A à G. Formulations des coûts : `energyCosts` (A29).
import type { CSSProperties } from "react";
import type { EnergyCosts, EnergyLabel } from "@/lib/property/energy";
import s from "./base.module.css";
import f from "./fiche.module.css";

const CLASSES = ["A", "B", "C", "D", "E", "F", "G"] as const;

function valeur(label: EnergyLabel): string | null {
  // « Classe D, 216 kWh/m²/an » → « 216 kWh/m²/an »
  const i = label.value.indexOf(", ");
  return i >= 0 ? label.value.slice(i + 2) : null;
}

function Etiquette({
  kind,
  titre,
  label,
}: {
  kind: "dpe" | "ges";
  titre: string;
  label: EnergyLabel;
}) {
  const v = valeur(label);
  return (
    <div
      className={f.etq}
      role="img"
      aria-label={`${label.title} : ${label.value}`}
    >
      <span className={f.etqT}>{titre}</span>
      {CLASSES.map((c, k) => {
        const act = label.grade === c;
        return (
          <div key={c} className={f.r} data-act={act || undefined}>
            <span
              className={f.b}
              data-k={`${kind}${k + 1}`}
              style={{ "--k": k } as CSSProperties}
            >
              {c}
            </span>
            {act && v ? <span className={f.val}>{v}</span> : null}
          </div>
        );
      })}
      {label.grade ? null : <span className={f.etqVide}>{label.value}</span>}
    </div>
  );
}

export function Energie({
  dpe,
  ges,
  costs,
  className,
}: {
  dpe: EnergyLabel;
  ges: EnergyLabel;
  costs: EnergyCosts;
  className?: string;
}) {
  return (
    <section
      className={`${f.energie} ${s.num} ${className ?? ""}`}
      aria-labelledby="energie-t"
    >
      <h2 id="energie-t">Performance énergétique</h2>
      <Etiquette
        kind="dpe"
        titre="Consommation d’énergie, kWh/m²/an"
        label={dpe}
      />
      <Etiquette
        kind="ges"
        titre="Émissions de gaz à effet de serre, kg CO₂/m²/an"
        label={ges}
      />
      <p className={f.legal}>
        {costs.sentence}
        {costs.note ? ` ${costs.note}` : null}
      </p>
    </section>
  );
}
