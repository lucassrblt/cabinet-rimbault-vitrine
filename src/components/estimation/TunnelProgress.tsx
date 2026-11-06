import { ProgressBar } from "@/components/motion/ProgressBar";
import {
  ESTIMATION_STEPS,
  type EstimationStep,
  progressLabel,
  STEP_TITLES,
} from "@/lib/forms/estimation-schema";
import { cn } from "@/lib/utils";

// Progression (doc 03 §6.3, A23) : barre d'Iniesta en 4 segments. Au-dessus
// de 768 px, les libellés des étapes sont écrits sous la barre ; en dessous,
// « Étape 2 sur 4, ses caractéristiques ».

const LABELS = ESTIMATION_STEPS.map(
  (step) =>
    STEP_TITLES[step].charAt(0).toUpperCase() + STEP_TITLES[step].slice(1),
);

export function TunnelProgress({ step }: { step: EstimationStep }) {
  return (
    <div className="mb-8 md:mb-10">
      <ProgressBar
        etape={step}
        total={ESTIMATION_STEPS.length}
        libelles={LABELS}
      />
      <div
        aria-hidden="true"
        className="t-legal mt-3 hidden grid-cols-4 gap-[6px] text-gris md:grid"
      >
        {LABELS.map((label, index) => (
          <span
            key={label}
            className={cn(index + 1 === step && "font-medium text-encre")}
          >
            {label}
          </span>
        ))}
      </div>
      <p className="t-petit mt-3 text-encre-douce md:hidden">
        {progressLabel(step)}
      </p>
    </div>
  );
}
