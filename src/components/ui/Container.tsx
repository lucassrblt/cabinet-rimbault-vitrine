import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Conteneur du site (brief §3.3) : 1200 px de contenu, marges latérales de
// 20, 32 puis 40 px (768 et 1280 px). Aligné à gauche à l'intérieur.

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
};

export function Container({
  as: Tag = "div",
  className,
  ...rest
}: ContainerProps) {
  return <Tag className={cn("conteneur", className)} {...rest} />;
}
