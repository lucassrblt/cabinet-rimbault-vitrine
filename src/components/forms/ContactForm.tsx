"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { submitContactLead } from "@/app/actions/leads";
import { Button } from "@/components/ui/Button";
import {
  Field,
  FieldLabel,
  TextareaInput,
  TextInput,
} from "@/components/ui/FormField";
import { type ContactInput, contactSchema } from "@/lib/validation";

const SUBJECTS: { value: ContactInput["subject"]; label: string }[] = [
  { value: "vente", label: "Information sur un bien en vente" },
  { value: "location", label: "Information sur un bien en location" },
  { value: "estimation", label: "Estimation de mon bien" },
  { value: "rdv", label: "Prendre rendez-vous" },
  { value: "autre", label: "Partenariat / autre" },
];

export function ContactForm({
  defaultSubject,
  defaultReference,
}: {
  defaultSubject?: ContactInput["subject"];
  defaultReference?: string;
}) {
  const [sent, setSent] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: defaultSubject ?? "vente",
      reference: defaultReference ?? "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      message: "",
      rgpd: false,
      website: "",
    },
  });

  const subject = watch("subject");
  const showReference = subject === "vente" || subject === "location";

  const onSubmit = handleSubmit((values) => {
    setRootError(null);
    startTransition(async () => {
      const res = await submitContactLead(values);
      if (res.ok) {
        setSent(true);
        return;
      }
      setRootError(res.error);
      if (res.fields) {
        for (const [path, message] of Object.entries(res.fields)) {
          const field = path.split(".").pop() as keyof ContactInput;
          setError(field, { type: "server", message });
        }
      }
    });
  });

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-sm border border-emerald-200 bg-emerald-50 p-6 text-emerald-900"
      >
        <p className="text-lg font-semibold">Message reçu</p>
        <p className="mt-1 text-sm">Je vous réponds sous 24 h ouvrées.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
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
        <FieldLabel required>Sujet de votre demande</FieldLabel>
        <div className="grid grid-cols-1 gap-1.5">
          {SUBJECTS.map((s) => (
            <label
              key={s.value}
              className="flex cursor-pointer items-center gap-2 rounded-sm border border-subtle px-3 py-2 text-sm hover:border-default"
            >
              <input
                type="radio"
                value={s.value}
                className="h-4 w-4"
                {...register("subject")}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
        {errors.subject && (
          <p role="alert" className="text-xs text-red-600">
            {errors.subject.message}
          </p>
        )}
      </fieldset>

      {showReference && (
        <Field
          label="Référence du bien"
          htmlFor="ct-ref"
          hint="Optionnel — si votre demande concerne un bien précis."
          error={errors.reference?.message}
        >
          <TextInput id="ct-ref" {...register("reference")} />
        </Field>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Prénom"
          required
          htmlFor="ct-fn"
          error={errors.firstName?.message}
        >
          <TextInput
            id="ct-fn"
            autoComplete="given-name"
            {...register("firstName")}
          />
        </Field>
        <Field
          label="Nom"
          required
          htmlFor="ct-ln"
          error={errors.lastName?.message}
        >
          <TextInput
            id="ct-ln"
            autoComplete="family-name"
            {...register("lastName")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Téléphone"
          required
          htmlFor="ct-phone"
          error={errors.phone?.message}
        >
          <TextInput
            id="ct-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...register("phone")}
          />
        </Field>
        <Field
          label="Email"
          required
          htmlFor="ct-email"
          error={errors.email?.message}
        >
          <TextInput
            id="ct-email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
        </Field>
      </div>

      <Field
        label="Votre message"
        required
        htmlFor="ct-msg"
        error={errors.message?.message}
      >
        <TextareaInput id="ct-msg" rows={5} {...register("message")} />
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

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Envoi…" : "Envoyer"}
        </Button>
      </div>
    </form>
  );
}
