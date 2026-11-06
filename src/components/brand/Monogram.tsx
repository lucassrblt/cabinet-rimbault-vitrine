// Généré par scripts/illustrations/marque.py (A26) : ne pas éditer à la main.
// Monogramme CR crème sur grenat (Spectral 500 vectorisé). Réservé aux icônes : jamais affiché dans la page.

const C =
  "M20.67 50.45Q15.16 50.45 11.12 48.21Q7.09 45.96 4.92 42.06Q2.75 38.15 2.75 33.18Q2.75 29.33 4.25 25.88Q5.75 22.42 8.34 19.78Q10.94 17.13 14.33 15.6Q17.73 14.08 21.47 14.08Q24.2 14.08 26.08 14.43Q27.95 14.78 29.42 15.34Q30.89 15.9 32.39 16.65L32.71 26.17H31.75L28.11 19.22Q26.24 17.93 24.76 17.34Q23.29 16.75 21.47 16.75Q17.73 16.75 14.81 18.68Q11.9 20.61 10.21 24Q8.53 27.4 8.53 31.84Q8.53 36.81 10.16 40.37Q11.79 43.93 14.57 45.8Q17.36 47.67 20.73 47.67Q23.45 47.67 25.35 46.92Q27.25 46.18 28.75 45.21L32.39 39.17H33.3L32.65 47.78Q30.3 49.01 27.63 49.73Q24.95 50.45 20.67 50.45Z";
const R =
  "M27.98 49.92V49.06L32.31 46.92V17.61L27.98 15.47V14.61H42.85Q48.46 14.61 51.7 16.94Q54.94 19.27 54.94 23.33Q54.94 26.33 52.9 28.66Q50.87 30.98 47.55 32.16L57.66 47.08L61.25 49.06V49.92H52.64L42.42 33.66H37.92V46.87L41.94 49.06V49.92ZM41.08 17.56H37.92V30.82H41.4Q44.72 30.82 46.88 28.92Q49.05 27.03 49.05 24.08Q49.05 21.03 46.94 19.3Q44.83 17.56 41.08 17.56Z";

export function Monogram({
  size = 64,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      <rect width="64" height="64" fill="var(--grenat, #5F1A24)" />
      <path fill="var(--creme, #F8F2E9)" d={C} />
      <path
        fill="var(--creme, #F8F2E9)"
        stroke="var(--grenat, #5F1A24)"
        strokeWidth={2.41}
        strokeLinejoin="round"
        paintOrder="stroke"
        d={R}
      />
    </svg>
  );
}
