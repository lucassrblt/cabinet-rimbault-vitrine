import type { Commune } from "@/lib/config/communes";

export type HeaderMode = "sale" | "rent";

interface Props {
  mode: HeaderMode;
  total: number;
  commune?: Commune | null;
}

export function ListingPageHeader({ mode, commune }: Props) {
  const isSale = mode === "sale";

  const eyebrow = isSale ? "Achat immobilier" : "Location immobilière";
  const title = isSale
    ? "Trouvez le bien qui vous ressemble."
    : "Trouvez la location qui vous correspond.";

  const intro = commune
    ? isSale
      ? `Notre sélection de biens à vendre à ${commune.name} et trouvez votre futur chez-vous.`
      : `Locations longue durée à ${commune.name}, dossiers traités sous 48 h.`
    : isSale
      ? "Découvrez notre sélection de biens à vendre en Île-de-France et trouvez votre futur chez-vous."
      : "Locations longue durée en Île-de-France, dossiers complets traités sous 48 h.";

  return (
    <header className="bg-page">
      <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-12 md:px-8 md:pb-8 md:pt-16">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-600">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-medium leading-[1.05] tracking-tight text-primary md:text-5xl lg:text-[3.4rem]">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-body md:text-base">
          {intro}
        </p>
      </div>
    </header>
  );
}
