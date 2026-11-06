import type { Fact } from "@/lib/property/view";
import { KeyFacts } from "./KeyFacts";

// Copropriété et charges (doc 03 §6.6, A32) : une seule formulation, en
// lignes de données (« Procédure en cours sur la copropriété : Aucune »).
// Tableau de données : mêmes lignes et même largeur (8 colonnes) que
// L'essentiel (revue finale C-P2), pour un seul bord droit dans la fiche.

export function CoproBlock({ items }: { items: readonly Fact[] }) {
  if (items.length === 0) return null;
  return <KeyFacts facts={items} />;
}
