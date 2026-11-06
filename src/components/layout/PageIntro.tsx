import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/utils";

// En-tête de page (doc 04 §7, interface figée) : `h1`, chapô facultatif,
// élément de côté facultatif (illustration). Ouverture de page à 64 px sous
// l'en-tête en mobile et 128 px en desktop (doc 03 §4.3), et le même espace
// de fin qu'une Section, pour qu'un filet ou un fond crème soutenu qui suit
// ne colle jamais au texte. Aligné à gauche. Desktop (≥ 1024 px) : texte sur
// les colonnes 1 à 8, calé en haut (le titre ne descend jamais sous une
// illustration haute) ; côté sur 9 à 12, calé en bas (ILL-09 posée sur la
// ligne du chapô). Dessous : empilés, le côté après le texte.

type PageIntroProps = {
  title: string;
  lead?: ReactNode;
  aside?: ReactNode;
  className?: string;
};

export function PageIntro({ title, lead, aside, className }: PageIntroProps) {
  return (
    <Container className={cn("pt-16 pb-16 md:pt-32 md:pb-24", className)}>
      <Grid className="gap-y-12">
        <div className="col-span-full lg:col-span-8 lg:self-start">
          <Heading level={1} className="max-w-[17em]">
            {title}
          </Heading>
          {lead ? (
            <div className="t-chapo mesure-chapo mt-6 text-encre-douce md:mt-8">
              {lead}
            </div>
          ) : null}
        </div>
        {aside ? (
          <div className="col-span-full lg:col-span-4 lg:col-start-9 lg:self-end">
            {aside}
          </div>
        ) : null}
      </Grid>
    </Container>
  );
}
