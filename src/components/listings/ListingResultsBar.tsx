import { SortSelect } from "./SortSelect";

/**
 * Ligne au-dessus de la grille de résultats : compteur à gauche, tri à droite.
 * Rendue uniquement quand il y a au moins un bien (`total ≥ 1`).
 */
export function ListingResultsBar({
  mode,
  total,
  basePath,
  sort,
}: {
  mode: "sale" | "rent";
  total: number;
  basePath: string;
  sort?: string;
}) {
  const plural = total > 1 ? "s" : "";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-primary">
        {total} bien{plural} disponible{plural}
      </p>
      <SortSelect mode={mode} basePath={basePath} value={sort} />
    </div>
  );
}
