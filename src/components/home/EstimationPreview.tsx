import { Box, Building2, Home, Trees } from "lucide-react";
import Link from "next/link";

/** Mêmes tuiles que la vraie étape 1 du tunnel (`steps/StepType.tsx`) —
 *  version décorative, sans interactivité interne. */
const PREVIEW_OPTIONS = [
  { label: "Appartement", icon: Building2, description: "Du studio au T5" },
  { label: "Maison", icon: Home, description: "Pavillon, maison de ville" },
  { label: "Terrain", icon: Trees, description: "À bâtir ou loisir" },
  { label: "Autre", icon: Box, description: "Loft, local, immeuble" },
] as const;

/**
 * Aperçu stylisé de la première étape du tunnel d'estimation — l'objet
 * visuel de la bande « Vous vendez ? ». Réplique fidèle mais statique :
 * tout l'objet est un seul lien vers /estimation (inclinaison douce qui se
 * redresse au hover, contenu interne décoratif).
 */
export function EstimationPreview() {
  return (
    <Link
      href="/estimation"
      aria-label="Commencer l'estimation de votre bien — gratuit et sans engagement"
      className="group block -rotate-[1.5deg] rounded-lg bg-card p-6 shadow-md transition-all duration-300 ease-out hover:rotate-0 hover:shadow-lg focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:p-7"
    >
      <div aria-hidden="true">
        <div className="flex items-center justify-between">
          <span className="border-b-2 border-primary-600 pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary-600">
            Votre bien
          </span>
          <span className="text-xs tabular-nums text-muted">1 / 6</span>
        </div>

        <p className="mt-5 font-display text-lg font-semibold tracking-tight text-primary">
          Quel type de bien souhaitez-vous estimer&nbsp;?
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Choisissez la catégorie qui correspond le mieux.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PREVIEW_OPTIONS.map((o) => (
            <span
              key={o.label}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-subtle bg-card px-2 py-3 text-center transition-colors group-hover:border-default"
            >
              <o.icon
                className="h-5 w-5 text-primary"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-primary">
                {o.label}
              </span>
              <span className="hidden text-[0.6rem] leading-tight text-muted sm:block">
                {o.description}
              </span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
