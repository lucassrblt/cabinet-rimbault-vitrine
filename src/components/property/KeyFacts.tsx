import type { Fact } from "@/lib/property/view";

// L'essentiel (doc 04 §2.3-4) : lignes de données, seulement les valeurs
// connues, libellé accordé au nombre en regard de la valeur (« Chambre » et
// « 1 », « Chambres » et « 3 »).
// Deux colonnes à partir de 768 px, chaque ligne séparée par un filet.

export function KeyFacts({ facts }: { facts: readonly Fact[] }) {
  if (facts.length === 0) return null;
  return (
    <dl className="grid grid-cols-1 gap-x-10 font-sans text-[15px] leading-[22px] md:grid-cols-2">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="flex items-baseline justify-between gap-4 border-b border-filet py-[10px]"
        >
          <dt className="text-encre-douce">{fact.label}</dt>
          <dd className="chiffres m-0 text-right text-encre">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
