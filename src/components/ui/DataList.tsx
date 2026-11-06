import { cn } from "@/lib/utils";

// Lignes de données (doc 03 §6.6) : liste de définitions séparée par des
// filets, libellé encre douce à gauche, valeur à droite en chiffres
// tabulaires. Copropriété de la fiche, récapitulatif du tunnel.

export type DataItem = { label: string; value: React.ReactNode };

type DataListProps = {
  items: DataItem[];
  className?: string;
};

export function DataList({ items, className }: DataListProps) {
  if (items.length === 0) return null;
  return (
    <dl className={cn("ui-lignes", className)}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
