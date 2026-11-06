import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";

// État « service indisponible » d'une page publique (doc 04 §2.11, revue
// finale n° 3, D8). Composant serveur partagé : rendu par `(site)/error.tsx`
// (erreur inattendue) et par une page qui intercepte elle-même une panne de
// l'API (fiche d'un bien). Il s'affiche dans le gabarit (site), donc avec
// l'en-tête et le pied. Même ouverture que `PageIntro` (64 px puis 128 px sous
// l'en-tête, texte sur les colonnes 1 à 8, aligné sur le logotype).
// `action` : emplacement sous le chapô, pour le bouton « Réessayer » d'
// `error.tsx`, qui exige du client et reste donc hors de ce composant.

type ServiceErrorProps = {
  action?: ReactNode;
};

export function ServiceError({ action }: ServiceErrorProps) {
  return (
    <Container className="pt-16 pb-16 md:pt-32 md:pb-24">
      <Grid>
        <div className="col-span-full lg:col-span-8">
          <Heading level={1} className="max-w-[17em]">
            Un problème technique empêche l’affichage de cette page.
          </Heading>
          <p className="t-chapo mesure-chapo mt-6 text-encre-douce md:mt-8">
            Vous pouvez réessayer dans un instant, ou nous appeler au{" "}
            <TextLink
              href={agency.phone.href}
              className="chiffres whitespace-nowrap"
            >
              {agency.phone.display}
            </TextLink>
            .
          </p>
          {action}
        </div>
      </Grid>
    </Container>
  );
}
