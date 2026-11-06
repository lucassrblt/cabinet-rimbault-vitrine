import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Titres (doc 03 §3.2 et §3.3) : Spectral, casse de phrase, aligné à gauche,
// `text-wrap: balance`. Jamais en capitales, en italique, ni avec un mot en
// grenat ou en gras : le composant n'accepte que du texte et le style vient
// de l'échelle. Le niveau sémantique (`level`) est indépendant de la taille
// (`size`), pour garder une hiérarchie continue.

export type HeadingSize = "display" | "h1" | "h2" | "h3" | "etape";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level: 1 | 2 | 3 | 4;
  size?: HeadingSize;
  ref?: React.Ref<HTMLHeadingElement>;
};

// Classes écrites en toutes lettres : Tailwind ne détecte pas un nom composé
// à l'exécution (`t-${size}`), l'utilitaire ne serait pas généré.
const sizeClass: Record<HeadingSize, string> = {
  display: "t-display",
  h1: "t-h1",
  h2: "t-h2",
  h3: "t-h3",
  etape: "t-etape",
};

const defaultSize: Record<HeadingProps["level"], HeadingSize> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h3",
};

export function Heading({ level, size, className, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(sizeClass[size ?? defaultSize[level]], className)}
      {...rest}
    />
  );
}
