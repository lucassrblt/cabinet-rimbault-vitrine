"use client";

import { KeyRound, Search, Tag } from "lucide-react";
import { ChoiceCard } from "@/components/forms/estimation/ChoiceCard";
import type { FormState } from "@/components/forms/estimation/estimation-funnel";
import {
  StepError,
  StepHeading,
} from "@/components/forms/estimation/StepHeading";
import type { EstimationStep2 } from "@/lib/validation";

export function StepIntent({
  value,
  onChange,
  error,
}: {
  value: FormState["intent"];
  onChange: (v: EstimationStep2["intent"]) => void;
  error?: string;
}) {
  const options: {
    value: EstimationStep2["intent"];
    label: string;
    icon: typeof Tag;
  }[] = [
    { value: "vendre", label: "Je veux vendre", icon: Tag },
    { value: "louer", label: "Je veux louer", icon: KeyRound },
    { value: "renseigne", label: "Je me renseigne", icon: Search },
  ];
  return (
    <div>
      <StepHeading
        title="Quel est votre projet ?"
        description="Pour adapter la réponse du cabinet à votre situation. Aucun engagement à cette étape."
      />
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <ChoiceCard
              key={opt.value}
              selected={value === opt.value}
              onClick={() => onChange(opt.value)}
              icon={<Icon className="h-5 w-5" aria-hidden="true" />}
              title={opt.label}
            />
          );
        })}
      </div>
      <StepError message={error} />
    </div>
  );
}
