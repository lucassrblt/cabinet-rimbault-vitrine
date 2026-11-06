import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

// Section éditoriale des pages Vendre, Louer et Honoraires (doc 03 §4.1,
// gabarit « intertitre + corps ») : en desktop (≥ 1024 px), l'intertitre sur
// les colonnes 1 à 4 et le corps sur 5 à 12 ; en dessous, empilés.

type OwnerSectionProps = {
  id?: string;
  title: string;
  separation?: "aucune" | "filet" | "soutenu";
  children: React.ReactNode;
};

export function OwnerSection({
  id,
  title,
  separation = "filet",
  children,
}: OwnerSectionProps) {
  const headingId = id ? `${id}-titre` : undefined;
  return (
    <Section id={id} separation={separation} aria-labelledby={headingId}>
      <Grid className="gap-y-8 md:gap-y-12">
        <Heading
          level={2}
          id={headingId}
          className="col-span-full max-w-[14em] lg:col-span-4 lg:max-w-[22rem]"
        >
          {title}
        </Heading>
        <div className="col-span-full min-w-0 lg:col-span-8 lg:col-start-5">
          {children}
        </div>
      </Grid>
    </Section>
  );
}
