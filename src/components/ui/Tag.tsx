import { cn } from "@/lib/utils";

// Badges de statut (doc 03 §6.4, brief A22). Hanken 500 13 px, 24 px de haut,
// rayon 2, casse normale. Un bien disponible n'a aucun badge ; deux au plus.
// - vente : « En vente », seulement dans une liste qui mêle vente et location
// - location : « À louer », idem
// - offre : « Sous offre » ou « Sous compromis »
// - exclusivite : « Exclusivité », le seul badge grenat
// - archive : « Vendu » ou « Loué », sans année

export type TagVariant =
  | "vente"
  | "location"
  | "offre"
  | "exclusivite"
  | "archive";

type TagProps = {
  variant: TagVariant;
  /** Posé sur une photo : fond crème, à 12 px du coin supérieur gauche. Le
   *  parent doit être en position relative. */
  onPhoto?: boolean;
  className?: string;
  children: string;
};

export function Tag({ variant, onPhoto, className, children }: TagProps) {
  return (
    <span
      className={cn(
        "ui-tag",
        `ui-tag--${variant}`,
        onPhoto && "ui-tag--sur-photo",
        className,
      )}
    >
      {children}
    </span>
  );
}
