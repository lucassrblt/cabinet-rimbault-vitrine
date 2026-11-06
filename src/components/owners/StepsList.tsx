import { fr } from "./typo";

// Déroulé d'une vente ou d'une location (brief A15, doc 03 §9-19) : une vraie
// séquence, donc une liste ordonnée. Le numéro est celui de la liste, en
// Hanken à chiffres tabulaires, couleur encre, sans zéro initial ni grand
// corps décoratif ; une phrase par étape, séparée par un filet. La mesure
// limite le texte, pas la liste : les filets vont jusqu'au bord droit de la
// colonne, comme ceux de la FAQ.

export function StepsList({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="border-filet border-b [counter-reset:etape]">
      {steps.map((step) => (
        <li
          key={step}
          className="t-texte grid grid-cols-[2rem_minmax(0,1fr)] items-baseline border-filet border-t py-4 [counter-increment:etape] before:font-sans before:font-medium before:text-[15px] before:text-encre before:tabular-nums before:content-[counter(etape)] md:grid-cols-[2.5rem_minmax(0,1fr)] md:py-5"
        >
          <span className="mesure">{fr(step)}</span>
        </li>
      ))}
    </ol>
  );
}
