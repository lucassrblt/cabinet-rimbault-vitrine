/**
 * Pont d'Asnières au trait — signature graphique locale (cf. DA).
 * Version dessinée à la main servant de placeholder fidèle au mock ; à
 * remplacer par le SVG définitif fourni par le PO le moment venu.
 * Décoratif : toujours rendu dans un conteneur `aria-hidden`.
 */
export function PontAsnieres({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 180"
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMaxYMid meet"
    >
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {/* Tablier */}
        <path d="M8 108 H632" />
        <path d="M8 116 H632" />
        {/* Pylônes */}
        <path d="M180 116 V38" />
        <path d="M188 116 V38" />
        <path d="M178 38 H190" />
        <path d="M452 116 V38" />
        <path d="M460 116 V38" />
        <path d="M450 38 H462" />
        {/* Câbles porteurs */}
        <path d="M8 74 Q 96 108 184 42" strokeWidth="1.6" />
        <path d="M184 42 Q 320 128 456 42" strokeWidth="1.6" />
        <path d="M456 42 Q 544 108 632 74" strokeWidth="1.6" />
        {/* Suspentes */}
        <path d="M60 92 V108" strokeWidth="1" />
        <path d="M110 99 V108" strokeWidth="1" />
        <path d="M150 82 V108" strokeWidth="1" />
        <path d="M230 74 V108" strokeWidth="1" />
        <path d="M270 90 V108" strokeWidth="1" />
        <path d="M320 97 V108" strokeWidth="1" />
        <path d="M370 90 V108" strokeWidth="1" />
        <path d="M410 74 V108" strokeWidth="1" />
        <path d="M490 82 V108" strokeWidth="1" />
        <path d="M530 99 V108" strokeWidth="1" />
        <path d="M580 92 V108" strokeWidth="1" />
        {/* Piles et arches sous le tablier */}
        <path d="M184 116 V150" />
        <path d="M456 116 V150" />
        <path d="M60 116 Q 122 150 184 116" strokeWidth="1" />
        <path d="M184 116 Q 320 158 456 116" strokeWidth="1" />
        <path d="M456 116 Q 518 150 580 116" strokeWidth="1" />
        {/* Seine */}
        <path d="M40 162 Q 60 158 80 162 T 120 162" strokeWidth="1" />
        <path d="M240 168 Q 260 164 280 168 T 320 168" strokeWidth="1" />
        <path d="M480 164 Q 500 160 520 164 T 560 164" strokeWidth="1" />
      </g>
    </svg>
  );
}
