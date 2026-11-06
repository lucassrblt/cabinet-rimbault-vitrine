import { buttonClassName } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Lien d'évitement (doc 04 §4.1) : premier élément focusable de chaque page.
// Hors focus : `sr-only` (le bouton n'existe que pour les lecteurs d'écran).
// Au focus : bouton secondaire compact de 40 px (padding 0 16), fond crème
// opaque, posé sur l'en-tête au-dessus du logotype, qu'il recouvre, et aligné
// sur son bord gauche à toutes les largeurs : la marge, ou le bord du
// conteneur de 1200 px au-delà (120 px à 1440). Position absolue, jamais
// fixe (brief §9). `not-focus:sr-only` plutôt que `focus:not-sr-only`, qui
// remettait le padding à 0 et la position à `static`.

/** Bord gauche du conteneur (`.conteneur`), donc du logotype. */
const ALIGNEMENT_LOGOTYPE =
  "max(var(--marge), calc((100% - var(--container-site)) / 2))";

export function SkipLink({ target = "contenu" }: { target?: string }) {
  return (
    <a
      id="evitement"
      href={`#${target}`}
      className={cn(
        buttonClassName({ variant: "secondaire", size: "compact" }),
        "not-focus:sr-only",
        // Largeur minimale : celle du logotype (142, 158 px), puis du sous-titre
        // « Asnières-sur-Seine, depuis 2009 » affiché dès 480 px (189 px).
        "absolute top-3 z-50 bg-creme hover:bg-encre min-[380px]:min-w-40 min-[480px]:min-w-48 lg:top-5",
      )}
      style={{ left: ALIGNEMENT_LOGOTYPE }}
    >
      Aller au contenu
    </a>
  );
}
