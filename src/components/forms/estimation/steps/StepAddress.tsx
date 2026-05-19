"use client";

import { Check } from "lucide-react";
import {
  AddressAutocomplete,
  type AddressSuggestion,
} from "@/components/forms/estimation/AddressAutocomplete";
import { StepHeading } from "@/components/forms/estimation/StepHeading";
import type { EstimationStep1 } from "@/lib/validation";

export function StepAddress({
  type,
  value,
  onChange,
  error,
}: {
  type: EstimationStep1["type"] | "";
  value: AddressSuggestion | null;
  onChange: (v: AddressSuggestion | null) => void;
  error?: string;
}) {
  return (
    <div>
      <StepHeading
        title={
          type === "terrain"
            ? "Où se situe ce terrain ?"
            : "Où se situe votre bien ?"
        }
        description="Le cabinet s'appuie sur les transactions récentes de la même rue ou du même secteur. L'adresse exacte reste confidentielle."
      />
      <AddressAutocomplete
        autoFocus
        value={value}
        onChange={onChange}
        error={error}
      />
      {value && (
        <div className="mt-4 flex items-start gap-3 rounded-sm border border-subtle bg-neutral-50 px-4 py-3 text-sm">
          <Check
            className="mt-0.5 h-4 w-4 shrink-0 text-success"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-primary">{value.label}</span>
            <span className="text-xs text-muted">
              {value.postalCode} {value.city}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
