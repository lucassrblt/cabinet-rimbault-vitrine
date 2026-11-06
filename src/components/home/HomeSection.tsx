import type { ReactNode } from "react";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

// Section de l'accueil au gabarit « intertitre + corps » (doc 03 §4.1), le
// même que Le cabinet, Vendre et Louer : en desktop (≥ 1024 px), l'intertitre
// sur les colonnes 1 à 4 et le corps sur 5 à 12 ; en dessous, empilés, 32 px
// puis 48 px entre le titre et le contenu (doc 03 §4.3).

type HomeSectionProps = {
  id: string;
  title: string;
  separation?: "aucune" | "filet" | "soutenu";
  /** Sous le titre, en desktop seulement dans la colonne de gauche. */
  aside?: ReactNode;
  children: ReactNode;
};

export function HomeSection({
  id,
  title,
  separation = "filet",
  aside,
  children,
}: HomeSectionProps) {
  const headingId = `${id}-titre`;
  return (
    <Section id={id} separation={separation} aria-labelledby={headingId}>
      <Grid className="gap-y-8 md:gap-y-12">
        <div className="col-span-full lg:col-span-4">
          <Heading level={2} id={headingId} className="max-w-[12em]">
            {title}
          </Heading>
          {aside}
        </div>
        <div className="col-span-full min-w-0 lg:col-span-8 lg:col-start-5">
          {children}
        </div>
      </Grid>
    </Section>
  );
}
