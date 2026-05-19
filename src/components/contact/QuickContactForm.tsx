"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CircleAlert, Send } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { submitContactLead } from "@/app/actions/leads";
import { Button } from "@/components/ui/Button";
import {
  Field,
  SelectInput,
  TextareaInput,
  TextInput,
} from "@/components/ui/FormField";
import {
  type ContactInput,
  type ContactSubject,
  type QuickContactInput,
  quickContactSchema,
} from "@/lib/validation";

/** Message envoyé au back-office quand le visiteur n'en saisit pas. */
const DEFAULT_MESSAGE = "Souhaite être recontacté(e).";

/** Motifs proposés dans le sélecteur — libellés courts adaptés au drawer. */
const SUBJECT_OPTIONS: { value: ContactSubject; label: string }[] = [
  { value: "vente", label: "Un bien à vendre" },
  { value: "location", label: "Un bien à louer" },
  { value: "estimation", label: "Estimer mon bien" },
  { value: "rdv", label: "Prendre contact" },
  { value: "autre", label: "Autre demande" },
];

/**
 * Formulaire de contact court, monté dans le drawer réutilisable.
 * Réutilise le server action `submitContactLead` et les composants de
 * formulaire du design system.
 */
export function QuickContactForm({
  subject,
  reference,
  onSent,
  onClose,
}: {
  subject: ContactSubject;
  reference?: string;
  onSent?: () => void;
  onClose?: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<QuickContactInput>({
    resolver: zodResolver(quickContactSchema),
    defaultValues: {
      subject,
      reference: reference ?? "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      message: "",
      rgpd: false,
      website: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setRootError(null);
    startTransition(async () => {
      const payload: ContactInput = {
        subject: values.subject,
        reference: values.reference?.trim() || undefined,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
        message: values.message.trim() ? values.message : DEFAULT_MESSAGE,
        rgpd: values.rgpd,
        website: values.website,
      };
      const res = await submitContactLead(payload);
      if (res.ok) {
        setSent(true);
        onSent?.();
        return;
      }
      setRootError(res.error);
      if (res.fields) {
        for (const [path, message] of Object.entries(res.fields)) {
          const field = path.split(".").pop() as keyof QuickContactInput;
          setError(field, { type: "server", message });
        }
      }
    });
  });

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-sm border border-secondary-200 bg-success-bg p-7 text-center"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
          <Check className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <p className="mt-4 font-display text-lg font-semibold tracking-tight text-primary">
          Message bien reçu
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Je vous réponds sous 24&nbsp;h ouvrées.
        </p>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={onClose}
          >
            Fermer
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
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
          className="flex items-start gap-2.5 rounded-sm border border-primary-200 bg-error-bg px-4 py-3 text-sm text-primary-800"
        >
          <CircleAlert
            className="mt-0.5 h-4 w-4 shrink-0 text-primary-600"
            aria-hidden="true"
          />
          <span>{rootError}</span>
        </div>
      )}

      <Field
        label="Objet de votre demande"
        required
        htmlFor="qc-subject"
        error={errors.subject?.message}
      >
        <SelectInput id="qc-subject" {...register("subject")}>
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </SelectInput>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Prénom"
          required
          htmlFor="qc-fn"
          error={errors.firstName?.message}
        >
          <TextInput
            id="qc-fn"
            autoComplete="given-name"
            {...register("firstName")}
          />
        </Field>
        <Field
          label="Nom"
          required
          htmlFor="qc-ln"
          error={errors.lastName?.message}
        >
          <TextInput
            id="qc-ln"
            autoComplete="family-name"
            {...register("lastName")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Téléphone"
          required
          htmlFor="qc-phone"
          error={errors.phone?.message}
        >
          <TextInput
            id="qc-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...register("phone")}
          />
        </Field>
        <Field
          label="Email"
          required
          htmlFor="qc-email"
          error={errors.email?.message}
        >
          <TextInput
            id="qc-email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
        </Field>
      </div>

      <Field
        label="Votre message"
        hint="Facultatif — quelques mots sur votre projet."
        htmlFor="qc-msg"
        error={errors.message?.message}
      >
        <TextareaInput id="qc-msg" rows={3} {...register("message")} />
      </Field>

      {/* Consentement RGPD — encadré discret, obligatoire */}
      <div className="flex flex-col gap-1.5">
        <label className="flex cursor-pointer gap-2.5 rounded-sm border border-subtle bg-section px-3.5 py-3 text-sm leading-relaxed text-body transition-colors hover:border-default">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary-600"
            {...register("rgpd")}
          />
          <span>
            J&apos;accepte que mes informations soient utilisées pour me
            recontacter, conformément à la{" "}
            <Link
              href="/politique-de-confidentialite"
              className="font-medium text-link underline underline-offset-2 hover:text-link-hover"
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
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        disabled={isPending}
      >
        {isPending ? (
          "Envoi…"
        ) : (
          <>
            Envoyer ma demande
            <Send className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-subtle">
        Réponse personnelle sous 24&nbsp;h ouvrées.
      </p>
    </form>
  );
}
