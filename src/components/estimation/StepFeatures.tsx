"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { EstimationState } from "@/lib/forms/estimation-schema";
import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  CONDITION_OPTIONS,
  ELEVATOR_OPTIONS,
  EXTRA_OPTIONS,
  FLOOR_OPTIONS,
  LEVEL_OPTIONS,
  LIMITS,
  PERIOD_OPTIONS,
  ROOM_OPTIONS,
} from "./options";
import {
  fieldId,
  HintWithCount,
  Optional,
  StepHeading,
  type StepProps,
} from "./shared";

// Étape 2, ses caractéristiques (doc 04 §3.3, A18). Les champs propres au
// type de bien apparaissent en fondu sur place (`mv-apparition`, 180 ms,
// sans animation de hauteur).

function SurfaceInput({
  control,
  name,
  value,
  onChange,
  onBlur,
}: {
  control: React.ComponentProps<typeof Input>;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="relative max-w-[14rem]">
      <Input
        {...control}
        name={name}
        inputMode="decimal"
        autoComplete="off"
        enterKeyHint="next"
        className="chiffres pr-12"
        value={value}
        onChange={(event) =>
          onChange(event.target.value.replace(/[^\d,.\s  ]/g, ""))
        }
        onBlur={onBlur}
      />
      <span
        aria-hidden="true"
        className="t-ui pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2 text-encre-douce"
      >
        m²
      </span>
    </div>
  );
}

function NativeSelect({
  name,
  value,
  options,
  empty,
  onChange,
  ...control
}: Omit<React.ComponentProps<typeof Select>, "onChange" | "value"> & {
  name: string;
  value: string;
  options: { value: string; label: string }[];
  empty: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select
      {...control}
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">{empty}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}

export function StepFeatures({
  state,
  errors,
  update,
  onBlurField,
  summary,
}: StepProps) {
  const isFlat = state.propertyType === "APPARTEMENT";
  const isHouse = state.propertyType === "MAISON";
  const extras = EXTRA_OPTIONS.filter(({ value }) => state[value]).map(
    ({ value }) => value,
  );

  return (
    <>
      <StepHeading
        title="Ses caractéristiques"
        intro="Seules la surface et le nombre de pièces sont nécessaires. Le reste nous aide à préparer la visite."
        summary={summary}
      />
      <div className="space-y-8">
        <Field
          id={fieldId("surface")}
          label="Surface habitable"
          error={errors.surface}
          hint={
            isFlat
              ? "En mètres carrés, la surface loi Carrez si vous la connaissez."
              : "En mètres carrés."
          }
        >
          {(control) => (
            <SurfaceInput
              control={control}
              name="surface"
              value={state.surface}
              onChange={(surface) => update({ surface })}
              onBlur={() => onBlurField("surface")}
            />
          )}
        </Field>

        <ChoiceGroup
          id={fieldId("rooms")}
          legend="Nombre de pièces"
          hint="Hors cuisine, salle de bains et entrée."
          name="rooms"
          options={ROOM_OPTIONS}
          value={state.rooms}
          error={errors.rooms}
          onChange={(event) =>
            update({ rooms: event.target.value as EstimationState["rooms"] })
          }
        />

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
          <Field
            id={fieldId("bedrooms")}
            label="Chambres"
            optional
            error={errors.bedrooms}
          >
            {(control) => (
              <NativeSelect
                {...control}
                name="bedrooms"
                value={state.bedrooms}
                options={BEDROOM_OPTIONS}
                empty="Non précisé"
                onChange={(bedrooms) => update({ bedrooms })}
                onBlur={() => onBlurField("bedrooms")}
              />
            )}
          </Field>
          <Field
            id={fieldId("bathrooms")}
            label="Salles de bains ou d’eau"
            optional
            error={errors.bathrooms}
          >
            {(control) => (
              <NativeSelect
                {...control}
                name="bathrooms"
                value={state.bathrooms}
                options={BATHROOM_OPTIONS}
                empty="Non précisé"
                onChange={(bathrooms) => update({ bathrooms })}
              />
            )}
          </Field>
        </div>

        {isFlat ? (
          <div className="mv-apparition space-y-8">
            <div>
              <Field id={fieldId("floor")} label="Étage" optional>
                {(control) => (
                  <NativeSelect
                    {...control}
                    name="floor"
                    value={state.floor}
                    options={FLOOR_OPTIONS}
                    empty="Non précisé"
                    wrapperClassName="max-w-[14rem]"
                    onChange={(floor) => update({ floor })}
                  />
                )}
              </Field>
              {state.floor !== "" && state.floor !== "RDC" ? (
                <Checkbox
                  id={fieldId("isTopFloor")}
                  name="isTopFloor"
                  className="mv-apparition mt-3"
                  checked={state.isTopFloor}
                  onChange={(event) =>
                    update({ isTopFloor: event.target.checked })
                  }
                >
                  C’est le dernier étage
                </Checkbox>
              ) : null}
            </div>
            <ChoiceGroup
              id={fieldId("hasElevator")}
              legend={
                <>
                  Ascenseur
                  <Optional />
                </>
              }
              name="hasElevator"
              columns={2}
              options={ELEVATOR_OPTIONS}
              value={state.hasElevator}
              onChange={(event) =>
                update({
                  hasElevator: event.target
                    .value as EstimationState["hasElevator"],
                })
              }
            />
          </div>
        ) : null}

        {isHouse ? (
          <div className="mv-apparition grid gap-8 sm:grid-cols-2 sm:gap-6">
            <Field id={fieldId("levels")} label="Niveaux" optional>
              {(control) => (
                <NativeSelect
                  {...control}
                  name="levels"
                  value={state.levels}
                  options={LEVEL_OPTIONS}
                  empty="Non précisé"
                  onChange={(levels) => update({ levels })}
                />
              )}
            </Field>
            <Field
              id={fieldId("landSurface")}
              label="Surface du terrain"
              optional
              error={errors.landSurface}
            >
              {(control) => (
                <SurfaceInput
                  control={control}
                  name="landSurface"
                  value={state.landSurface}
                  onChange={(landSurface) => update({ landSurface })}
                  onBlur={() => onBlurField("landSurface")}
                />
              )}
            </Field>
          </div>
        ) : null}

        <ChoiceGroup
          id={fieldId("hasBalcony")}
          type="checkbox"
          legend={
            <>
              Extérieurs et annexes
              <Optional />
            </>
          }
          name="extras"
          columns={2}
          options={[...EXTRA_OPTIONS]}
          value={extras}
          onChange={(event) =>
            update({
              [event.target.value]: event.target.checked,
            } as Partial<EstimationState>)
          }
        />

        <ChoiceGroup
          id={fieldId("condition")}
          legend={
            <>
              État général
              <Optional />
            </>
          }
          name="condition"
          columns={2}
          options={CONDITION_OPTIONS}
          value={state.condition}
          onChange={(event) =>
            update({
              condition: event.target.value as EstimationState["condition"],
            })
          }
        />

        <Field
          id={fieldId("constructionPeriod")}
          label="Époque de construction"
          optional
        >
          {(control) => (
            <NativeSelect
              {...control}
              name="constructionPeriod"
              value={state.constructionPeriod}
              options={PERIOD_OPTIONS}
              empty="Non précisée"
              wrapperClassName="max-w-[20rem]"
              onChange={(constructionPeriod) => update({ constructionPeriod })}
            />
          )}
        </Field>

        <Field
          id={fieldId("renovations")}
          label="Travaux récents"
          optional
          error={errors.renovations}
          hint={
            <HintWithCount
              hint={
                "Par exemple\u202f: cuisine refaite en 2022, fenêtres changées."
              }
              length={state.renovations.length}
              max={LIMITS.renovations}
            />
          }
        >
          {(control) => (
            <Textarea
              {...control}
              name="renovations"
              rows={4}
              className="min-h-[120px]"
              value={state.renovations}
              onChange={(event) => update({ renovations: event.target.value })}
              onBlur={() => onBlurField("renovations")}
            />
          )}
        </Field>
      </div>
    </>
  );
}
