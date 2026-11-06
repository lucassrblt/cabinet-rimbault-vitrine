"use client";

import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { EstimationState } from "@/lib/forms/estimation-schema";
import { LIMITS, MOMENT_OPTIONS, PREFERENCE_OPTIONS } from "./options";
import {
  fieldId,
  HintWithCount,
  Optional,
  StepHeading,
  type StepProps,
} from "./shared";

// Étape 3, vous (doc 04 §3.3). Le moment de rappel n'a de sens que pour un
// appel : il est masqué (et vidé) quand « Par e-mail » est choisi.

export function StepYou({
  state,
  errors,
  update,
  onBlurField,
  summary,
}: StepProps) {
  return (
    <>
      <StepHeading
        title="Vos coordonnées"
        intro="Pour convenir avec vous de la visite. Elles ne servent à rien d’autre."
        summary={summary}
      />
      <div className="space-y-8">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
          <Field
            id={fieldId("firstName")}
            label="Prénom"
            error={errors.firstName}
          >
            <Input
              name="firstName"
              autoComplete="given-name"
              autoCapitalize="words"
              enterKeyHint="next"
              maxLength={LIMITS.name}
              value={state.firstName}
              onChange={(event) => update({ firstName: event.target.value })}
              onBlur={() => onBlurField("firstName")}
            />
          </Field>
          <Field id={fieldId("lastName")} label="Nom" error={errors.lastName}>
            <Input
              name="lastName"
              autoComplete="family-name"
              autoCapitalize="words"
              enterKeyHint="next"
              maxLength={LIMITS.name}
              value={state.lastName}
              onChange={(event) => update({ lastName: event.target.value })}
              onBlur={() => onBlurField("lastName")}
            />
          </Field>
        </div>
        <Field
          id={fieldId("email")}
          label="Adresse e-mail"
          error={errors.email}
          hint="Nous vous y envoyons la confirmation de votre demande."
        >
          <Input
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="next"
            value={state.email}
            onChange={(event) => update({ email: event.target.value })}
            onBlur={() => onBlurField("email")}
          />
        </Field>
        <Field
          id={fieldId("phone")}
          label="Téléphone"
          optional={state.contactPreference !== "telephone"}
          error={errors.phone}
          hint={
            "Recommandé\u202f: c’est le plus simple pour convenir de la visite."
          }
        >
          <Input
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            className="chiffres max-w-[16rem]"
            value={state.phone}
            onChange={(event) => update({ phone: event.target.value })}
            onBlur={() => onBlurField("phone")}
          />
        </Field>
        <ChoiceGroup
          id={fieldId("contactPreference")}
          legend={
            <>
              Comment préférez-vous être recontacté&#8239;?
              <Optional />
            </>
          }
          name="contactPreference"
          columns={2}
          options={PREFERENCE_OPTIONS}
          value={state.contactPreference}
          onChange={(event) => {
            const contactPreference = event.target
              .value as EstimationState["contactPreference"];
            update(
              contactPreference === "email"
                ? { contactPreference, contactMoment: "" }
                : { contactPreference },
            );
          }}
        />
        {state.contactPreference !== "email" ? (
          <ChoiceGroup
            id={fieldId("contactMoment")}
            className="mv-apparition"
            legend={
              <>
                À quel moment de la journée&#8239;?
                <Optional />
              </>
            }
            name="contactMoment"
            columns={2}
            options={MOMENT_OPTIONS}
            value={state.contactMoment}
            onChange={(event) =>
              update({
                contactMoment: event.target
                  .value as EstimationState["contactMoment"],
              })
            }
          />
        ) : null}
        <Field
          id={fieldId("message")}
          label="Un mot à ajouter"
          optional
          error={errors.message}
          hint={
            <HintWithCount
              hint="Une précision sur le bien, vos disponibilités pour la visite."
              length={state.message.length}
              max={LIMITS.message}
            />
          }
        >
          {(control) => (
            <Textarea
              {...control}
              name="message"
              rows={5}
              className="min-h-[140px]"
              value={state.message}
              onChange={(event) => update({ message: event.target.value })}
              onBlur={() => onBlurField("message")}
            />
          )}
        </Field>
      </div>
    </>
  );
}
