"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { submitVisitRequest } from "@/app/actions/leads";
import { Button } from "@/components/ui/Button";
import {
  Field,
  FieldLabel,
  TextareaInput,
  TextInput,
} from "@/components/ui/FormField";
import { type VisitFormInput, visitFormSchema } from "@/lib/validation";

interface Props {
  reference: string;
  isRental: boolean;
}

const AVAIL_OPTIONS = [
  { value: "matin", label: "Matin" },
  { value: "aprem", label: "Après-midi" },
  { value: "soir", label: "Soir" },
  { value: "samedi", label: "Samedi" },
];

export function VisitRequestForm({ reference, isRental }: Props) {
  const [sent, setSent] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VisitFormInput>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      profile: isRental ? "locataire" : "acquereur",
      financing: isRental ? "na" : "etude",
      availabilities: [],
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      message: "",
      rgpd: false,
      reference,
      isRental,
      website: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setRootError(null);
    startTransition(async () => {
      const res = await submitVisitRequest({ ...values, isRental });
      if (res.ok) {
        setSent(true);
        return;
      }
      setRootError(res.error);
      if (res.fields) {
        for (const [path, message] of Object.entries(res.fields)) {
          const field = path.split(".").pop() as keyof VisitFormInput;
          setError(field, { type: "server", message });
        }
      }
    });
  });

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-sm border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
      >
        Demande bien reçue pour le bien <strong>{reference}</strong>. Je vous
        recontacte sous 24 h pour convenir d&apos;un créneau.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <input type="hidden" {...register("reference")} />
      <input
        type="text"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        {...register("website")}
      />
      {rootError && (
        <div
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {rootError}
        </div>
      )}

      <fieldset className="flex flex-col gap-2">
        <FieldLabel required>Votre profil</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {(isRental
            ? [
                { value: "locataire" as const, label: "Locataire" },
                { value: "curieux" as const, label: "Je me renseigne" },
              ]
            : [
                { value: "acquereur" as const, label: "Acquéreur" },
                { value: "investisseur" as const, label: "Investisseur" },
                { value: "curieux" as const, label: "Je me renseigne" },
              ]
          ).map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 rounded-sm border border-subtle px-3 py-1.5 text-sm hover:border-default"
            >
              <input
                type="radio"
                value={opt.value}
                className="h-4 w-4"
                {...register("profile")}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {!isRental && (
        <fieldset className="flex flex-col gap-2">
          <FieldLabel>Financement</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "ok", label: "Accordé / en cours" },
              { value: "etude", label: "À étudier" },
              { value: "comptant", label: "Comptant" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 rounded-sm border border-subtle px-3 py-1.5 text-sm hover:border-default"
              >
                <input
                  type="radio"
                  value={opt.value}
                  className="h-4 w-4"
                  {...register("financing")}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-2">
        <FieldLabel>Disponibilités pour la visite</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {AVAIL_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 rounded-sm border border-subtle px-3 py-1.5 text-sm hover:border-default"
            >
              <input
                type="checkbox"
                value={opt.value}
                className="h-4 w-4"
                {...register("availabilities")}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Prénom"
          required
          htmlFor="vf-fn"
          error={errors.firstName?.message}
        >
          <TextInput
            id="vf-fn"
            autoComplete="given-name"
            {...register("firstName")}
          />
        </Field>
        <Field
          label="Nom"
          required
          htmlFor="vf-ln"
          error={errors.lastName?.message}
        >
          <TextInput
            id="vf-ln"
            autoComplete="family-name"
            {...register("lastName")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Téléphone"
          required
          htmlFor="vf-phone"
          error={errors.phone?.message}
        >
          <TextInput
            id="vf-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...register("phone")}
          />
        </Field>
        <Field
          label="Email"
          required
          htmlFor="vf-email"
          error={errors.email?.message}
        >
          <TextInput
            id="vf-email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
        </Field>
      </div>

      <Field
        label="Message"
        htmlFor="vf-msg"
        hint="Optionnel — précisions sur votre projet."
        error={errors.message?.message}
      >
        <TextareaInput id="vf-msg" rows={3} {...register("message")} />
      </Field>

      <label className="flex gap-2 text-sm text-body">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4"
          {...register("rgpd")}
        />
        <span>
          J&apos;accepte la{" "}
          <Link
            href="/politique-de-confidentialite"
            className="underline underline-offset-2"
          >
            politique de confidentialité
          </Link>
          .
        </span>
      </label>
      {errors.rgpd && (
        <p role="alert" className="text-xs text-red-600">
          {errors.rgpd.message}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Envoi…" : "Envoyer ma demande"}
      </Button>
    </form>
  );
}
