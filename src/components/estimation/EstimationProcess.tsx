import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PROCESS_STEPS } from "./estimation-content";

/**
 * Bloc « Comment ça se passe » : déroulé honnête de l'estimation en 3 temps.
 *
 * Reprend le motif des grilles de réassurance du site (cf. `ReassuranceSection`
 * de la page d'accueil) — `SectionHeader`, cellules bordées, icônes bordeaux —
 * pour rester cohérent avec les autres pages.
 */
export function EstimationProcess({
  eyebrow = "Comment ça se passe",
  title = "Une estimation humaine, en trois temps.",
}: {
  eyebrow?: string;
  title?: string;
} = {}) {
  return (
    <div>
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3">
        {PROCESS_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <ScrollReveal
              key={step.title}
              index={i}
              className={`flex flex-col items-center px-6 py-10 text-center ${
                i < PROCESS_STEPS.length - 1
                  ? "border-b border-neutral-200/70 md:border-b-0 md:border-r"
                  : ""
              }`}
            >
              <Icon
                className="h-10 w-10 text-primary-600"
                strokeWidth={1.25}
                aria-hidden="true"
              />
              <h3 className="mt-5 font-display text-base font-semibold tracking-tight text-primary">
                <span className="text-primary-600">{i + 1}.</span> {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
