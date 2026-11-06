import Image from "next/image";
import {
  DPE_VIERGE_NOTE,
  type EnergyCosts,
  type EnergyLabel,
} from "@/lib/property/energy";

// Bilan énergétique (doc 03 §6.7, brief A29). Étiquettes SVG générées par
// l'admin (source unique `scale.ts`), côte à côte à partir de 640 px. La
// classe et la valeur sont toujours écrites en texte, image ou non. Sous un
// filet, l'une des trois formulations des coûts (A29), jamais masquée.
// Les SVG sont servis tels quels (`unoptimized`) : l'optimiseur d'images ne
// traite pas les SVG, et ce ne sont pas des photos.

function Label({ label }: { label: EnergyLabel }) {
  return (
    <div className="min-w-0">
      <h3 className="t-nav text-encre">{label.title}</h3>
      <p className="t-ui chiffres mt-1 text-encre-douce">{label.value}</p>
      {label.imageUrl ? (
        <Image
          src={label.imageUrl}
          alt={label.alt}
          width={750}
          height={560}
          unoptimized
          className="mt-4 h-auto w-full max-w-[22rem]"
        />
      ) : null}
    </div>
  );
}

type EnergyBlockProps = {
  dpe: EnergyLabel;
  ges: EnergyLabel;
  costs: EnergyCosts;
};

export function EnergyBlock({ dpe, ges, costs }: EnergyBlockProps) {
  const vierge = dpe.value.endsWith("vierge") || ges.value.endsWith("vierge");
  return (
    <div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
        <Label label={dpe} />
        <Label label={ges} />
      </div>
      {vierge ? (
        <p className="t-petit mt-4 text-encre-douce">{DPE_VIERGE_NOTE}</p>
      ) : null}
      <div className="mesure-bloc mt-8 border-t border-filet pt-6">
        <p className="t-ui chiffres text-encre">{costs.sentence}</p>
        {costs.note ? (
          <p className="t-legal mt-2 text-gris">{costs.note}</p>
        ) : null}
      </div>
    </div>
  );
}
