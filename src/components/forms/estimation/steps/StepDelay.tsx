"use client";

import { CalendarClock, CalendarRange, Clock3, HelpCircle } from "lucide-react";
import { ChoiceCard } from "@/components/forms/estimation/ChoiceCard";
import type { FormState } from "@/components/forms/estimation/estimation-funnel";
import {
  StepError,
  StepHeading,
} from "@/components/forms/estimation/StepHeading";
import type { EstimationStep2 } from "@/lib/validation";

export function StepDelay({
  value,
  onChange,
  error,
}: {
  value: FormState["delay"];
  onChange: (v: EstimationStep2["delay"]) => void;
  error?: string;
}) {
  const options: {
    value: EstimationStep2["delay"];
    label: string;
    icon: typeof Clock3;
    description: string;
  }[] = [
    {
      value: "3m",
      label: "Moins de 3 mois",
      icon: Clock3,
      description: "Projet urgent",
    },
    {
      value: "3-6m",
      label: "3 à 6 mois",
      icon: CalendarClock,
      description: "À court terme",
    },
    {
      value: "6-12m",
      label: "6 à 12 mois",
      icon: CalendarRange,
      description: "À moyen terme",
    },
    {
      value: "plus-tard",
      label: "Plus tard",
      icon: HelpCircle,
      description: "Pas encore décidé",
    },
  ];
  return (
    <div>
      <StepHeading
        title="Sous quel délai ?"
        description="Une simple indication. Vous restez maître du calendrier."
      />
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <ChoiceCard
              key={opt.value}
              selected={value === opt.value}
              onClick={() => onChange(opt.value)}
              icon={<Icon className="h-4 w-4" aria-hidden="true" />}
              title={opt.label}
              description={opt.description}
              layout="horizontal"
              size="sm"
            />
          );
        })}
      </div>
      <StepError message={error} />
    </div>
  );
}
