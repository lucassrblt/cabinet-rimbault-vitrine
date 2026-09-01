/**
 * Pictogrammes « maison » au trait fin — même esprit croquis que le pont
 * d'Asnières (cf. DA : ils remplacent les icônes de bibliothèque décoratives).
 * Trait `currentColor`, ~6-10 tracés chacun, à rendre dans un conteneur
 * `aria-hidden` (décoratifs).
 */

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Façade d'immeuble de quartier — « Depuis 2009 ». */
export function PictoFacade({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M10 42 V14 L24 6 L38 14 V42" />
      <path d="M6 42 H42" />
      <path d="M16 20 h5 v6 h-5 z" />
      <path d="M27 20 h5 v6 h-5 z" />
      <path d="M16 31 h5 v6 h-5 z" />
      <path d="M27 31 h5 v11" />
      <path d="M27 31 h5" />
      <path d="M32 34 v8" />
    </svg>
  );
}

/** Poignée de main — « Accompagnement sur-mesure ». */
export function PictoPoignee({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 18 L14 14 L24 20" />
      <path d="M44 18 L34 14 L24 20" />
      <path d="M24 20 L30 26 a3 3 0 0 1 -4.5 4 L22 27" />
      <path d="M22 27 L25 31 a3 3 0 0 1 -4.5 3.5 L18 31" />
      <path d="M18 31 a3 3 0 0 1 -4.5 3 L10 30" />
      <path d="M4 18 v12 l6 3" />
      <path d="M44 18 v12 l-8 4" />
    </svg>
  );
}

/** Plan de quartier + épingle — « Ancrage local ». */
export function PictoPlan({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M8 12 L18 8 L30 12 L40 8 V36 L30 40 L18 36 L8 40 Z" />
      <path d="M18 8 V36" />
      <path d="M30 12 V40" />
      <path d="M24 30 c-4 -4.5 -6 -7.5 -6 -10.5 a6 6 0 0 1 12 0 c0 3 -2 6 -6 10.5 Z" />
      <circle cx="24" cy="19" r="1.8" />
    </svg>
  );
}

/** Clé unique — « Service global ». */
export function PictoCle({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="15" cy="18" r="8" />
      <circle cx="15" cy="18" r="3" />
      <path d="M21 24 L38 41" />
      <path d="M32 35 l5 -5" />
      <path d="M36 39 l4 -4" />
    </svg>
  );
}
