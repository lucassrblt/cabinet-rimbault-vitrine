"use client";

import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { agency } from "@/lib/agency";
import { AddressAutocomplete } from "./AddressAutocomplete";
import {
  INTENT_LABELS,
  INTENTS,
  isOneOfIntent,
  LIMITS,
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPES,
} from "./options";
import { fieldId, StepHeading, type StepProps } from "./shared";

// Étape 1, votre bien (doc 04 §3.3, A1) : objet de l'estimation, type de
// bien, adresse, code postal, ville.

export function StepProperty({
  state,
  errors,
  update,
  onBlurField,
  summary,
}: StepProps) {
  return (
    <>
      <StepHeading
        title="Votre bien"
        intro="Ce que vous souhaitez faire estimer, et où se trouve le bien."
        summary={summary}
      />
      <div className="space-y-8">
        <ChoiceGroup
          id={fieldId("intent")}
          legend={"Que souhaitez-vous faire estimer\u202f?"}
          name="intent"
          columns={2}
          options={INTENTS.map((value) => ({
            value,
            label: INTENT_LABELS[value],
          }))}
          value={state.intent}
          onChange={(event) => {
            const value = event.target.value;
            if (isOneOfIntent(value)) update({ intent: value });
          }}
        />
        <ChoiceGroup
          id={fieldId("propertyType")}
          legend="Type de bien"
          name="propertyType"
          columns={2}
          options={PROPERTY_TYPES.map((value) => ({
            value,
            label: PROPERTY_TYPE_LABELS[value],
          }))}
          value={state.propertyType}
          error={errors.propertyType}
          onChange={(event) =>
            update({
              propertyType: event.target
                .value as (typeof PROPERTY_TYPES)[number],
            })
          }
        />
        <Field
          id={fieldId("address")}
          label="Adresse"
          optional
          error={errors.address}
          hint="Elle nous permet de situer le bien et n’est jamais publiée. Choisissez une proposition pour remplir aussi le code postal et la ville."
        >
          {(control) => (
            <AddressAutocomplete
              control={control}
              name="address"
              value={state.address}
              maxLength={LIMITS.address}
              onChange={(address) => update({ address })}
              onSelect={(suggestion) =>
                update({
                  address: suggestion.name,
                  postalCode: suggestion.postcode,
                  city: suggestion.city,
                })
              }
              onBlur={() => onBlurField("address")}
            />
          )}
        </Field>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
          <Field
            id={fieldId("postalCode")}
            label="Code postal"
            error={errors.postalCode}
          >
            <Input
              name="postalCode"
              inputMode="numeric"
              autoComplete="postal-code"
              enterKeyHint="next"
              maxLength={5}
              className="chiffres"
              value={state.postalCode}
              onChange={(event) => {
                const postalCode = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 5);
                const city =
                  postalCode === agency.address.postalCode &&
                  state.city.trim() === ""
                    ? agency.address.city
                    : state.city;
                update({ postalCode, city });
              }}
              onBlur={() => onBlurField("postalCode")}
            />
          </Field>
          <Field
            id={fieldId("city")}
            label="Ville"
            optional
            error={errors.city}
          >
            <Input
              name="city"
              autoComplete="address-level2"
              autoCapitalize="words"
              enterKeyHint="next"
              maxLength={LIMITS.city}
              value={state.city}
              onChange={(event) => update({ city: event.target.value })}
              onBlur={() => onBlurField("city")}
            />
          </Field>
        </div>
      </div>
    </>
  );
}
