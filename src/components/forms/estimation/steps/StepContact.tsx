"use client";

import Link from "next/link";
import { useId } from "react";
import type { FormState } from "@/components/forms/estimation/estimation-funnel";
import { StepHeading } from "@/components/forms/estimation/StepHeading";
import { Field, TextareaInput, TextInput } from "@/components/ui/FormField";

export function StepContact({
  data,
  update,
  errors,
  rootError,
}: {
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  errors: Partial<Record<keyof FormState, string>>;
  rootError: string | null;
}) {
  const rgpdId = useId();
  return (
    <div>
      <StepHeading
        title="Où vous joindre ?"
        description="Le Cabinet Rimbault revient vers vous avec une première estimation de votre bien."
      />
      {rootError && (
        <div
          role="alert"
          className="mb-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {rootError}
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Prénom"
            required
            htmlFor="es-fn"
            error={errors.firstName}
          >
            <TextInput
              id="es-fn"
              autoComplete="given-name"
              value={data.firstName}
              onChange={(e) => update("firstName", e.target.value)}
            />
          </Field>
          <Field label="Nom" required htmlFor="es-ln" error={errors.lastName}>
            <TextInput
              id="es-ln"
              autoComplete="family-name"
              value={data.lastName}
              onChange={(e) => update("lastName", e.target.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Téléphone"
            required
            htmlFor="es-ph"
            error={errors.phone}
          >
            <TextInput
              id="es-ph"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <Field label="Email" required htmlFor="es-em" error={errors.email}>
            <TextInput
              id="es-em"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.fr"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
        </div>
        <Field
          label="Un mot à ajouter ? (facultatif)"
          htmlFor="es-msg"
          error={errors.message}
        >
          <TextareaInput
            id="es-msg"
            rows={3}
            placeholder="Travaux récents, copropriété, particularités…"
            value={data.message}
            onChange={(e) => update("message", e.target.value)}
          />
        </Field>
        <label
          htmlFor={rgpdId}
          className="flex cursor-pointer items-start gap-2.5 rounded-sm border border-subtle bg-neutral-50 px-4 py-3 text-sm"
        >
          <input
            id={rgpdId}
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-primary-600"
            checked={data.rgpd}
            onChange={(e) => update("rgpd", e.target.checked)}
          />
          <span className="text-body">
            J&apos;accepte que mes informations soient utilisées uniquement pour
            répondre à ma demande, conformément à la{" "}
            <Link
              href="/politique-de-confidentialite"
              className="font-medium text-primary underline underline-offset-2"
            >
              politique de confidentialité
            </Link>
            .
          </span>
        </label>
        {errors.rgpd && (
          <p role="alert" className="text-xs text-red-600">
            {errors.rgpd}
          </p>
        )}
      </div>
    </div>
  );
}
