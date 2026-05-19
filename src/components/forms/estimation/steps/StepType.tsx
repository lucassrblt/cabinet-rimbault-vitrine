"use client";

import { Box, Building2, Home, Trees } from "lucide-react";
import { ChoiceCard } from "@/components/forms/estimation/ChoiceCard";
import type { FormState } from "@/components/forms/estimation/estimation-funnel";
import {
  StepError,
  StepHeading,
} from "@/components/forms/estimation/StepHeading";
import type { EstimationStep1 } from "@/lib/validation";

const OPTIONS: {
  value: EstimationStep1["type"];
  label: string;
  icon: typeof Home;
  description: string;
}[] = [
  {
    value: "appartement",
    label: "Appartement",
    icon: Building2,
    description: "Du studio au T5 et plus",
  },
  {
    value: "maison",
    label: "Maison",
    icon: Home,
    description: "Pavillon, maison de ville",
  },
  {
    value: "terrain",
    label: "Terrain",
    icon: Trees,
    description: "À bâtir ou loisir",
  },
  {
    value: "autre",
    label: "Autre",
    icon: Box,
    description: "Loft, local, immeuble",
  },
];

export function StepType({
  value,
  onChange,
  error,
}: {
  value: FormState["type"];
  onChange: (v: EstimationStep1["type"]) => void;
  error?: string;
}) {
  return (
    <div>
      <StepHeading
        title="Quel type de bien souhaitez-vous estimer ?"
        description="Choisissez la catégorie qui correspond le mieux. Cela orientera l'analyse comparable du marché."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <ChoiceCard
              key={opt.value}
              selected={value === opt.value}
              onClick={() => onChange(opt.value)}
              icon={<Icon className="h-6 w-6" aria-hidden="true" />}
              title={opt.label}
              description={opt.description}
            />
          );
        })}
      </div>
      <StepError message={error} />
    </div>
  );
}
