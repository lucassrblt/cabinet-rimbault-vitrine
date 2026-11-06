import { cn } from "@/lib/utils";

// Filet de 1 px (doc 03 §5) : `--filet` sur crème, crème à 22 % sur le pied
// grenat (brief A20). Décoratif : rendu en <hr> pour séparer des contenus de
// même niveau, sinon préférer un border sur l'élément.

type DividerProps = {
  tone?: "filet" | "sur-grenat";
  className?: string;
};

export function Divider({ tone = "filet", className }: DividerProps) {
  return (
    <hr
      className={cn(
        "m-0 h-px border-0",
        tone === "filet" ? "bg-filet" : "bg-creme/22",
        className,
      )}
    />
  );
}
