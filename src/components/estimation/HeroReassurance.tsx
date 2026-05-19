import { HERO_REASSURANCES } from "./estimation-content";

/**
 * Ligne de micro-réassurances du hero : Gratuit · Sans engagement · 24 h.
 */
export function HeroReassurance() {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {HERO_REASSURANCES.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex items-center gap-1.5 text-sm text-body"
        >
          <Icon
            className="h-4 w-4 text-primary-600"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          {label}
        </li>
      ))}
    </ul>
  );
}
