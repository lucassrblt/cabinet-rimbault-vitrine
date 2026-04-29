"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { submitQuickContact } from "@/app/actions/leads";
import { Button } from "@/components/ui/Button";
import { Field, TextareaInput, TextInput } from "@/components/ui/FormField";
import { type QuickContactInput, quickContactSchema } from "@/lib/validation";

export function QuickContactForm() {
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
      name: "",
      phone: "",
      message: "",
      rgpd: false,
      website: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setRootError(null);
    startTransition(async () => {
      const res = await submitQuickContact(values);
      if (res.ok) {
        setSent(true);
        return;
      }
      setRootError(res.error);
      if (res.fields) {
        for (const [path, message] of Object.entries(res.fields)) {
          const field = path.split(".").pop() as keyof QuickContactInput;
          if (field in errors || field) {
            setError(field, { type: "server", message });
          }
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
        Message reçu. Je vous réponds sous 24 h ouvrées.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
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
      <Field
        label="Nom"
        required
        error={errors.name?.message}
        htmlFor="qc-name"
      >
        <TextInput id="qc-name" autoComplete="name" {...register("name")} />
      </Field>
      <Field
        label="Téléphone"
        required
        error={errors.phone?.message}
        htmlFor="qc-phone"
      >
        <TextInput
          id="qc-phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          {...register("phone")}
        />
      </Field>
      <Field
        label="Message"
        required
        error={errors.message?.message}
        htmlFor="qc-msg"
      >
        <TextareaInput id="qc-msg" rows={3} {...register("message")} />
      </Field>
      <label className="flex gap-2 text-xs text-body">
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
      <Button type="submit" disabled={isPending} className="w-full md:w-auto">
        {isPending ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}
