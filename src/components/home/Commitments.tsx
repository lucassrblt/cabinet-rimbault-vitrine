import { ButtonLink } from "@/components/ui/ButtonLink";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { commitments } from "@/lib/agency";

// Nos engagements (doc 04 §2.1-4, brief A15, A27) : les trois engagements
// d'`agency.ts` (source unique), affirmés ici, démontrés sur Le cabinet. Ce
// n'est pas une séquence : liste `<ul>` sans numéro, sans icône ni
// illustration. En desktop (≥ 1024 px), trois colonnes de quatre, chacune
// sous un filet ; dessous, empilés.

export function Commitments() {
  return (
    <Section
      id="engagements"
      separation="filet"
      aria-labelledby="engagements-titre"
    >
      <Heading level={2} id="engagements-titre">
        Nos engagements
      </Heading>
      <ul className="mt-8 grid gap-x-6 md:mt-12 lg:grid-cols-3">
        {commitments.map((item) => (
          <li
            key={item.title}
            className="min-w-0 border-filet border-t py-8 lg:pt-8 lg:pb-0"
          >
            <h3 className="t-h3 max-w-[16em]">{item.title}</h3>
            <p className="t-texte mesure mt-4">{item.text}</p>
          </li>
        ))}
      </ul>
      <p className="border-filet border-t pt-6 lg:mt-12 lg:border-t-0 lg:pt-0">
        <ButtonLink href="/le-cabinet" variant="tertiaire">
          Mieux connaître le cabinet
        </ButtonLink>
      </p>
    </Section>
  );
}
