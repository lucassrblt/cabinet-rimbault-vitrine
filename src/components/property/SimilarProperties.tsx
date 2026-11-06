import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import type { Transaction } from "@/lib/property/fees";
import type { PropertyView } from "@/lib/property/view";
import { PropertyGrid } from "./PropertyGrid";

// Autres biens (doc 04 §2.3-11) : jusqu'à 3 biens proches renvoyés par l'API,
// sur la grille de `PropertyGrid`. Section masquée si la liste est vide.
// Titre vrai quelle que soit la ville des biens proposés.

type SimilarPropertiesProps = {
  items: readonly PropertyView[];
  transaction: Transaction;
};

export function SimilarProperties({
  items,
  transaction,
}: SimilarPropertiesProps) {
  if (items.length === 0) return null;
  const title =
    transaction === "LOCATION"
      ? "Nos autres biens en location"
      : "Nos autres biens en vente";
  return (
    <Section separation="filet" aria-labelledby="autres-biens-titre">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <Heading level={2} id="autres-biens-titre">
          {title}
        </Heading>
        <p className="t-ui">
          <TextLink href="/biens">Voir tous nos biens</TextLink>
        </p>
      </div>
      <PropertyGrid items={items} headingLevel={3} className="mt-8 md:mt-12" />
    </Section>
  );
}
