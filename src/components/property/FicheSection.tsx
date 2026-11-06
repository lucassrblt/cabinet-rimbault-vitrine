import type { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/utils";

// Bloc de la colonne de contenu de la fiche : filet en haut, `h2` au corps
// `h3` (la colonne fait 8 colonnes au plus : un titre de section de 36 px y
// serait disproportionné), 48 px puis 64 px entre deux blocs (doc 03 §4.3).

type FicheSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function FicheSection({
  id,
  title,
  children,
  className,
}: FicheSectionProps) {
  const headingId = `${id}-titre`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("border-t border-filet pt-8 md:pt-10", className)}
    >
      <Heading level={2} size="h3" id={headingId}>
        {title}
      </Heading>
      <div className="mt-6 md:mt-8">{children}</div>
    </section>
  );
}
