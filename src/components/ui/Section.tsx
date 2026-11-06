import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

// Section de page (doc 03 §4.3) : 64 px au-dessus et en dessous en mobile,
// 96 px en desktop. Séparée de la précédente soit par l'espace seul, soit par
// un filet, soit par le fond crème soutenu ; jamais filet ET fond.
// Le crème soutenu sert à une section sur trois au plus.

type SectionProps = HTMLAttributes<HTMLElement> & {
  /** "filet" : filet en haut. "soutenu" : fond crème soutenu. */
  separation?: "aucune" | "filet" | "soutenu";
  /** false pour gérer soi-même la largeur (pleine largeur, grille). */
  contained?: boolean;
  containerClassName?: string;
};

export function Section({
  separation = "aucune",
  contained = true,
  className,
  containerClassName,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(
        "ui-section",
        separation === "filet" && "ui-section--filet",
        separation === "soutenu" && "ui-section--soutenu",
        className,
      )}
      {...rest}
    >
      {contained ? (
        <Container className={containerClassName}>{children}</Container>
      ) : (
        children
      )}
    </section>
  );
}
