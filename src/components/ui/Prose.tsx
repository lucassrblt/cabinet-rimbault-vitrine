import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Texte long en Spectral (pages légales, présentation, description d'un bien),
// doc 03 §3.3 : 34em au plus, césure en mobile seulement, liens grenat,
// intertitres h2 et h3 à l'échelle, gras ramené à 500.

type ProseProps = HTMLAttributes<HTMLDivElement> & {
  /** Texte saisi par l'agent : coupe les longues chaînes sans espace. */
  userContent?: boolean;
};

export function Prose({ userContent, className, ...rest }: ProseProps) {
  return (
    <div
      className={cn("ui-prose", userContent && "saisie", className)}
      {...rest}
    />
  );
}
