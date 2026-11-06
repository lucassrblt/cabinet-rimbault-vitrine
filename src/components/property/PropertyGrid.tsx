import type { PropertyView } from "@/lib/property/view";
import { cn } from "@/lib/utils";
import { PropertyCard } from "./PropertyCard";

// Grille des biens selon leur nombre (brief A21, doc 03 §6.5, doc 04 §2.2),
// sur la grille de 12 colonnes à partir de 768 px :
//   1 bien    : carte horizontale (photo 7 colonnes, texte 5) ;
//   2 biens   : 2 colonnes de 6 ;
//   4 biens   : 2 × 2 ;
//   3, 5 et + : 2 colonnes de 768 à 1023 px, 3 à partir de 1024 px, la
//               dernière rangée alignée à gauche.
// Sous 768 px : toujours une colonne. Rangées espacées de 48 px.
// Interface figée (doc 04 §7) : `headingLevel` est le niveau des titres des
// cartes. Ne rend rien si la liste est vide (l'état vide appartient à la page).

type PropertyGridProps = {
  items: readonly PropertyView[];
  headingLevel: 2 | 3 | 4;
  /**
   * Liste en haut de page : la première rangée se charge sans attendre
   * (`loading="eager"`, ni préchargement ni `priority`), pour le LCP.
   */
  eager?: boolean;
  /**
   * Liste qui peut mêler vente et location (accueil) : si elle les mêle
   * effectivement, chaque carte porte « En vente » ou « À louer » (doc 03
   * §6.4). Sans effet sur une liste d'une seule transaction.
   */
  markTransaction?: boolean;
  className?: string;
};

const SIZES = {
  one: "(min-width: 1280px) 692px, (min-width: 768px) 58vw, 100vw",
  two: "(min-width: 1280px) 588px, (min-width: 768px) 50vw, 100vw",
  three:
    "(min-width: 1280px) 384px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
} as const;

export function PropertyGrid({
  items,
  headingLevel,
  eager = false,
  markTransaction = false,
  className,
}: PropertyGridProps) {
  const count = items.length;
  if (count === 0) return null;
  const transactionBadge =
    markTransaction &&
    items.some((view) => view.transaction !== items[0].transaction);

  if (count === 1) {
    return (
      <div className={className}>
        <PropertyCard
          view={items[0]}
          headingLevel={headingLevel}
          layout="horizontal"
          sizes={SIZES.one}
          eager={eager}
          transactionBadge={transactionBadge}
        />
      </div>
    );
  }

  const twoColumns = count === 2 || count === 4;
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2",
        !twoColumns && "lg:grid-cols-3",
        className,
      )}
    >
      {items.map((view, index) => (
        <li key={view.reference} className="min-w-0">
          <PropertyCard
            view={view}
            headingLevel={headingLevel}
            sizes={twoColumns ? SIZES.two : SIZES.three}
            eager={eager && index < (twoColumns ? 2 : 3)}
            transactionBadge={transactionBadge}
          />
        </li>
      ))}
    </ul>
  );
}
