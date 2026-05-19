import { SortSelect } from "./SortSelect";
import { ViewToggle } from "./ViewToggle";

export type SectionHeaderMode = "sale" | "rent";

interface Props {
  mode: SectionHeaderMode;
  total: number;
  basePath: string;
  sort?: string;
}

export function ListingSectionHeader({ mode, total, basePath, sort }: Props) {
  const isSale = mode === "sale";
  const eyebrow = isSale ? "Nos biens à la vente" : "Nos biens à la location";
  const title = isSale
    ? "Biens disponibles à l'achat"
    : "Biens disponibles à la location";

  return (
    <header className="flex flex-col gap-5 pb-6 md:flex-row md:items-end md:justify-between md:gap-8 md:pb-8">
      <div className="flex flex-col gap-2">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-600">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight text-primary md:text-[2.25rem]">
          {title}
        </h2>
        {total > 0 && (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {total} bien{total > 1 ? "s" : ""} disponible
            {total > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ViewToggle />
        <SortSelect mode={mode} basePath={basePath} value={sort} />
      </div>
    </header>
  );
}
