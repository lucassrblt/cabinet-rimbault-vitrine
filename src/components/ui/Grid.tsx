import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Grille de 4 colonnes sous 768 px, 12 au-delà ; gouttière de 16 puis 24 px
// (doc 03 §4.1). Les enfants se placent avec col-span-* / col-start-*.

type GridProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
};

export function Grid({ as: Tag = "div", className, ...rest }: GridProps) {
  return <Tag className={cn("grille", className)} {...rest} />;
}
