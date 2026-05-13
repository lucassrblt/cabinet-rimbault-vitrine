import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function ViewToggle() {
  return (
    <fieldset
      aria-label="Mode d'affichage"
      className="inline-flex items-center gap-1 rounded-lg border border-subtle bg-card p-1"
    >
      <button
        type="button"
        aria-pressed="true"
        aria-label="Affichage en grille"
        className={cn(
          "inline-flex h-8 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600",
        )}
      >
        <LayoutGrid className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-pressed="false"
        aria-label="Affichage en liste (bientôt)"
        disabled
        className="inline-flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-lg text-muted opacity-60"
      >
        <List className="h-4 w-4" aria-hidden="true" />
      </button>
    </fieldset>
  );
}
