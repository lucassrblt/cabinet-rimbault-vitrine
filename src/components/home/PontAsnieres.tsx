/**
 * Pont d'Asnières au trait — signature graphique locale (cf. DA).
 * Version arches + treillis fidèle au mock validé ; placeholder dessiné à la
 * main, à remplacer par le SVG définitif du PO le moment venu.
 * Décoratif : toujours rendu dans un conteneur `aria-hidden`.
 */
export function PontAsnieres({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 720 220"
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMaxYMid meet"
    >
      <g stroke="currentColor" strokeLinecap="round">
        {/* Tablier double */}
        <path d="M10 120 H710" strokeWidth="1.6" />
        <path d="M10 130 H710" strokeWidth="1.2" />
        {/* Garde-corps */}
        <path d="M10 108 H710" strokeWidth="0.9" />
        {[...Array(35)].map((_, i) => {
          const x = 20 + i * 20;
          return <path key={`gc${x}`} d={`M${x} 108 V120`} strokeWidth="0.7" />;
        })}
        {/* Arc principal central */}
        <path d="M180 130 Q 360 30 540 130" strokeWidth="1.8" />
        <path d="M180 130 Q 360 46 540 130" strokeWidth="1.1" />
        {/* Treillis de l'arc (montants entre les deux courbes et le tablier) */}
        <path d="M240 130 V96" strokeWidth="0.8" />
        <path d="M280 130 V82" strokeWidth="0.8" />
        <path d="M320 130 V73" strokeWidth="0.8" />
        <path d="M360 130 V70" strokeWidth="0.8" />
        <path d="M400 130 V73" strokeWidth="0.8" />
        <path d="M440 130 V82" strokeWidth="0.8" />
        <path d="M480 130 V96" strokeWidth="0.8" />
        {/* Croisillons */}
        <path
          d="M240 96 L280 130 M280 82 L320 130 M320 73 L360 130"
          strokeWidth="0.55"
        />
        <path
          d="M480 96 L440 130 M440 82 L400 130 M400 73 L360 130"
          strokeWidth="0.55"
        />
        {/* Arches latérales */}
        <path d="M40 130 Q 110 84 180 130" strokeWidth="1.3" />
        <path d="M540 130 Q 610 84 680 130" strokeWidth="1.3" />
        <path d="M80 130 V106 M110 130 V101 M140 130 V106" strokeWidth="0.7" />
        <path d="M580 130 V106 M610 130 V101 M640 130 V106" strokeWidth="0.7" />
        {/* Piles */}
        <path d="M176 130 V178 M184 130 V178" strokeWidth="1.2" />
        <path d="M536 130 V178 M544 130 V178" strokeWidth="1.2" />
        <path d="M172 178 H188 M532 178 H548" strokeWidth="1" />
        {/* Lampadaire */}
        <path d="M360 108 V88" strokeWidth="0.9" />
        <path d="M354 88 H366" strokeWidth="0.9" />
        {/* Seine */}
        <path d="M60 196 Q 85 191 110 196 T 160 196" strokeWidth="0.8" />
        <path d="M300 202 Q 325 197 350 202 T 400 202" strokeWidth="0.8" />
        <path d="M520 194 Q 545 189 570 194 T 620 194" strokeWidth="0.8" />
        <path d="M180 188 Q 200 184 220 188" strokeWidth="0.7" />
        <path d="M440 190 Q 460 186 480 190" strokeWidth="0.7" />
      </g>
    </svg>
  );
}
