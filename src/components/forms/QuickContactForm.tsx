"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field, TextareaInput, TextInput } from "@/components/ui/FormField";
import { type QuickContactInput, quickContactSchema } from "@/lib/validation";

export function QuickContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuickContactInput>({
    resolver: zodResolver(quickContactSchema),
    defaultValues: { name: "", phone: "", message: "", rgpd: false },
  });

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 400));
    setSent(true);
  });

  if (sent) {
    return (
      <div
        role="status"
        className="rounded border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
      >
        Message reçu. Je vous réponds sous 24 h ouvrées.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
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
      <label className="flex gap-2 text-xs text-zinc-600">
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
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}
