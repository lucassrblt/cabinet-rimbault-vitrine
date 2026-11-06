import { AgencyAddress } from "@/components/agency/AgencyAddress";
import { Illustration } from "@/components/illustrations/Illustration";
import { streetLine } from "@/components/layout/typo";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

// Nous trouver (doc 04 §2.1-6, brief A16) : adresse, téléphone, horaires
// (masqués par `OpeningHours` tant qu'ils ne sont pas validés, brief §10-7)
// et « Itinéraire » dans le même onglet, sans icône : `AgencyAddress`
// (lot 6). ILL-03, la devanture, sur les colonnes 9 à 12, calée en haut sur
// la ligne du titre ; l'adresse suit le titre à l'écart standard. Sous
// 1024 px, le texte puis le dessin (l'information d'abord, écart au doc 04
// consigné au journal). Section suivie du pied grenat, séparée des avis
// (crème soutenu) par le seul changement de fond.

export function FindUs() {
  return (
    <Section id="nous-trouver" aria-labelledby="nous-trouver-titre">
      <Grid className="gap-y-12">
        <div className="col-span-full lg:col-span-6">
          <Heading level={2} id="nous-trouver-titre" className="max-w-[12em]">
            Au {streetLine()}
          </Heading>
          <AgencyAddress showHours className="mt-8 md:mt-12" />
        </div>
        <div className="col-span-full lg:col-span-4 lg:col-start-9">
          <Illustration
            name="ILL-03"
            sizes="(min-width: 1024px) 360px, (min-width: 400px) 360px, calc(100vw - 40px)"
          />
        </div>
      </Grid>
    </Section>
  );
}
