import { Tag } from "@/components/ui/Tag";
import { glueHyphens } from "@/lib/property/text";
import { type PropertyView, referenceLabel } from "@/lib/property/view";

// En-tête du bien (doc 04 §2.3-2, A33) : `h1` composé à virgule, lieu (ville
// et quartier, jamais l'adresse), titre de l'agent en casse normale, statut,
// exclusivité, référence.

export function PropertyHeader({ view }: { view: PropertyView }) {
  return (
    <header>
      <h1 className="t-h1 text-encre">{view.title}</h1>
      {view.place ? (
        <p className="t-ui mt-3 text-encre-douce">{glueHyphens(view.place)}</p>
      ) : null}
      {view.subtitle ? (
        <p className="t-petit mt-1 text-encre-douce">{view.subtitle}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        {view.statusLabel ? (
          <Tag variant="offre">{view.statusLabel}</Tag>
        ) : null}
        {view.isExclusive ? <Tag variant="exclusivite">Exclusivité</Tag> : null}
        <p className="t-legal chiffres text-gris">
          {referenceLabel(view.reference)}
        </p>
      </div>
    </header>
  );
}
