import { commitments } from "@/lib/agency";
import { cn } from "@/lib/utils";

// Nos engagements, version développée (Le cabinet, doc 04 §2.7-2). Les
// titres viennent d'`agency.ts` (source unique, repris sur l'accueil) ; le
// développement est propre à cette page (revue finale C-P4) : sur l'accueil,
// le visiteur a déjà lu le texte court. Chaque phrase reprend un fait déjà
// publié ailleurs sur le site (Vendre, Louer, estimation, fiche) : aucune
// promesse, aucun délai, aucun chiffre nouveaux. Pas de numéros : ce n'est
// pas une séquence (A15). Séparés par des filets, sans carte ni icône.

const N = "\u202F";

/** Développement de chaque engagement, dans l'ordre de `commitments`. */
const DETAILS: readonly string[] = [
  `Nous ne donnons pas de prix en ligne${N}: un prix sérieux demande de voir le bien. Nous commençons toujours par une visite, où nous regardons la surface, l’étage, l’exposition, l’état, la copropriété et les ventes récentes du quartier. Si nous ne croyons pas au prix espéré, nous le disons, quitte à ne pas prendre le mandat.`,
  `La personne qui estime votre bien est celle qui le fait visiter, le négocie et vous suit jusqu’à la signature chez le notaire. Pour une location, c’est elle aussi qui fait visiter le logement, jusqu’à la signature du bail. Pas de transfert de dossier, pas de standard.`,
  `Nous travaillons à Asnières-sur-Seine depuis 2009, et dans les communes voisines. Nos prix de vente s’appuient sur les ventes récentes du quartier, nos loyers sur ceux de logements comparables. Au-delà de ce secteur, nous préférons vous adresser à quelqu’un dont c’est le terrain.`,
];

type CommitmentsDetailedProps = {
  headingLevel?: 3 | 4;
  className?: string;
};

export function CommitmentsDetailed({
  headingLevel = 3,
  className,
}: CommitmentsDetailedProps) {
  const Title = `h${headingLevel}` as const;
  return (
    <ul className={cn("border-filet border-b", className)}>
      {commitments.map((item, index) => (
        <li
          key={item.title}
          className="border-filet border-t py-8 first:pt-8 md:py-10"
        >
          <Title className="t-h3 max-w-[24em] text-balance">{item.title}</Title>
          <p className="t-texte mesure mt-3">{DETAILS[index] ?? item.text}</p>
        </li>
      ))}
    </ul>
  );
}
