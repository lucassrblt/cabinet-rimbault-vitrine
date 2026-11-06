import { PropertyGrid } from "@/components/property/PropertyGrid";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { PropertyView } from "@/lib/property/view";

// Nos biens du moment (doc 04 §2.1-2, brief A21) : les trois premiers biens
// de la liste, dans l'ordre de /biens (disponibles d'abord, du plus récent au
// plus ancien, `sortForListing`). La disposition selon le nombre (1, 2 ou 3)
// est celle de `PropertyGrid` (lot 2). Si les biens montrés mêlent vente et
// location, chaque carte porte « En vente » ou « À louer » (`markTransaction`,
// doc 03 §6.4) ; sinon, aucun badge de transaction. Aucun bien : la section
// n'existe pas.
// Le lien vers la liste n'apparaît que s'il mène à plus de biens que la
// section n'en montre, avec le nombre réel.

const SHOWN = 3;

type CurrentListingsProps = {
  /** Biens en ligne, déjà triés pour la liste. */
  views: readonly PropertyView[];
};

export function CurrentListings({ views }: CurrentListingsProps) {
  if (views.length === 0) return null;
  const shown = views.slice(0, SHOWN);

  return (
    <Section
      id="biens-du-moment"
      separation="filet"
      aria-labelledby="biens-du-moment-titre"
    >
      <Heading level={2} id="biens-du-moment-titre">
        Nos biens du moment
      </Heading>
      <PropertyGrid
        items={shown}
        headingLevel={3}
        eager
        markTransaction
        className="mt-8 md:mt-12"
      />
      {views.length > shown.length ? (
        <p className="mt-10 md:mt-12">
          <ButtonLink href="/biens" variant="tertiaire">
            {`Voir les ${views.length}\u00a0biens`}
          </ButtonLink>
        </p>
      ) : null}
    </Section>
  );
}
