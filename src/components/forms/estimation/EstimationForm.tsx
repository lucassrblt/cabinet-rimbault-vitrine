"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { EstimationStep1 } from "@/lib/validation";
import { EstimationConfirmation } from "./EstimationConfirmation";
import { FunnelNav } from "./FunnelNav";
import { FunnelProgress } from "./FunnelProgress";
import { StepAddress } from "./steps/StepAddress";
import { StepCondition } from "./steps/StepCondition";
import { StepContact } from "./steps/StepContact";
import { StepDelay } from "./steps/StepDelay";
import { StepIntent } from "./steps/StepIntent";
import { StepSurface } from "./steps/StepSurface";
import { StepType } from "./steps/StepType";
import { useEstimationFunnel } from "./useEstimationFunnel";

/**
 * Tunnel d'estimation en 7 étapes. Orchestrateur : la logique est portée par
 * `useEstimationFunnel`, le rendu est délégué aux composants d'étape et au
 * shell (`FunnelProgress`, `FunnelNav`).
 */
export function EstimationForm() {
  const {
    step,
    direction,
    data,
    errors,
    rootError,
    isPending,
    done,
    progress,
    canProceed,
    phase,
    update,
    next,
    prev,
    submit,
  } = useEstimationFunnel();

  if (done) {
    return <EstimationConfirmation leadId={done} firstName={data.firstName} />;
  }

  return (
    <div className="flex flex-col">
      <FunnelProgress step={step} progress={progress} phase={phase} />

      <div className="relative min-h-[420px] overflow-hidden px-1 sm:px-2">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction === 1 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 1 ? -40 : 40 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="pt-2"
          >
            {step === 0 && (
              <StepType
                value={data.type}
                onChange={(v) => update("type", v)}
                error={errors.type}
              />
            )}
            {step === 1 && (
              <StepAddress
                type={data.type as EstimationStep1["type"] | ""}
                value={data.address}
                onChange={(v) => update("address", v)}
                error={errors.address}
              />
            )}
            {step === 2 && (
              <StepSurface
                type={data.type as EstimationStep1["type"]}
                surface={data.surface}
                rooms={data.rooms}
                floor={data.floor}
                year={data.year}
                onChange={update}
                errors={errors}
              />
            )}
            {step === 3 && (
              <StepCondition
                condition={data.condition}
                outdoor={data.outdoor}
                type={data.type as EstimationStep1["type"]}
                onChange={update}
                errors={errors}
              />
            )}
            {step === 4 && (
              <StepIntent
                value={data.intent}
                onChange={(v) => update("intent", v)}
                error={errors.intent}
              />
            )}
            {step === 5 && (
              <StepDelay
                value={data.delay}
                onChange={(v) => update("delay", v)}
                error={errors.delay}
              />
            )}
            {step === 6 && (
              <StepContact
                data={data}
                update={update}
                errors={errors}
                rootError={rootError}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <FunnelNav
        step={step}
        canProceed={canProceed}
        isPending={isPending}
        onPrev={prev}
        onNext={next}
        onSubmit={submit}
      />
    </div>
  );
}
