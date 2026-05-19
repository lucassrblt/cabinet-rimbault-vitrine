"use client";

import {
  Brush,
  Check,
  Hammer,
  HelpCircle,
  Sparkles,
  Sprout,
  Trees,
} from "lucide-react";
import { ChoiceCard } from "@/components/forms/estimation/ChoiceCard";
import type { FormState } from "@/components/forms/estimation/estimation-funnel";
import {
  StepError,
  StepHeading,
} from "@/components/forms/estimation/StepHeading";
import { cn } from "@/lib/utils";
import type { EstimationStep1 } from "@/lib/validation";

export function StepCondition({
  condition,
  outdoor,
  type,
  onChange,
  errors,
}: {
  condition: FormState["condition"];
  outdoor: string[];
  type: EstimationStep1["type"];
  onChange: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  errors: Partial<Record<keyof FormState, string>>;
}) {
  const isTerrain = type === "terrain";
  const conditions: {
    value: EstimationStep1["condition"];
    label: string;
    icon: typeof Sparkles;
    description: string;
  }[] = [
    {
      value: "neuf",
      label: "Neuf / refait",
      icon: Sparkles,
      description: "Rien à prévoir",
    },
    {
      value: "bon",
      label: "Bon état",
      icon: Check,
      description: "Quelques petits travaux",
    },
    {
      value: "rafraichir",
      label: "À rafraîchir",
      icon: Brush,
      description: "Peintures, sols, cuisine…",
    },
    {
      value: "renover",
      label: "À rénover",
      icon: Hammer,
      description: "Travaux importants",
    },
  ];

  const outdoorOpts: { value: string; label: string; icon: typeof Sprout }[] = [
    { value: "balcon", label: "Balcon", icon: Sprout },
    { value: "terrasse", label: "Terrasse", icon: Sprout },
    { value: "jardin", label: "Jardin", icon: Trees },
    { value: "aucun", label: "Aucun", icon: HelpCircle },
  ];

  function toggleOutdoor(v: string) {
    if (v === "aucun") {
      onChange("outdoor", outdoor.includes("aucun") ? [] : ["aucun"]);
      return;
    }
    const cleaned = outdoor.filter((o) => o !== "aucun");
    if (cleaned.includes(v)) {
      onChange(
        "outdoor",
        cleaned.filter((o) => o !== v),
      );
    } else {
      onChange("outdoor", [...cleaned, v]);
    }
  }

  return (
    <div>
      <StepHeading
        title={
          isTerrain
            ? "Quelques précisions sur le terrain"
            : "État général et extérieur"
        }
        description={
          isTerrain
            ? "Ces informations affinent l'analyse."
            : "Travaux à prévoir et extérieurs influencent fortement le prix."
        }
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-primary">
          État général <span className="text-red-600">*</span>
        </legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {conditions.map((opt) => {
            const Icon = opt.icon;
            return (
              <ChoiceCard
                key={opt.value}
                selected={condition === opt.value}
                onClick={() => onChange("condition", opt.value)}
                icon={<Icon className="h-4 w-4" aria-hidden="true" />}
                title={opt.label}
                description={opt.description}
                layout="horizontal"
                size="sm"
              />
            );
          })}
        </div>
        <StepError message={errors.condition} />
      </fieldset>

      {!isTerrain && (
        <fieldset className="mt-6 flex flex-col gap-3">
          <legend className="text-sm font-medium text-primary">
            Extérieur (facultatif)
          </legend>
          <div className="flex flex-wrap gap-2">
            {outdoorOpts.map((opt) => {
              const Icon = opt.icon;
              const selected = outdoor.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleOutdoor(opt.value)}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm transition-colors",
                    selected
                      ? "border-primary-600 text-primary"
                      : "border-default text-body hover:border-neutral-400",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
