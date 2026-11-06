import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Texte réservé aux lecteurs d'écran (classe sr-only de Tailwind).

type VisuallyHiddenProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
};

export function VisuallyHidden({
  as: Tag = "span",
  className,
  ...rest
}: VisuallyHiddenProps) {
  return <Tag className={cn("sr-only", className)} {...rest} />;
}
