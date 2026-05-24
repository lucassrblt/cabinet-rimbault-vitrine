"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Send } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { submitVisitRequest } from "@/app/actions/leads";
import { Button } from "@/components/ui/Button";
import { Field, TextareaInput, TextInput } from "@/components/ui/FormField";
import { AGENT } from "@/lib/config/agent";
import { type VisitFormInput, visitFormSchema } from "@/lib/validation";

interface Props {
  reference: string;
  isRental: boolean;
}

export function PropertyContactForm({ reference, isRental }: Props) {
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

  return (
    <div className="overflow-hidden rounded-sm border border-subtle bg-card">
      {/* Eyebrow + lead — editorial header */}
      <header className="relative px-6 pt-6 pb-5">
        <span className="inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-primary-600">
          <span
            aria-hidden="true"
            className="inline-block h-px w-6 bg-primary-600"
          />
          Contactez-moi
        </span>
        <p className="mt-3 font-display text-2xl leading-[1.15] tracking-tight text-primary">
          Une question sur ce bien&nbsp;?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-body">
          <span className="font-medium text-primary">{AGENT.fullName}</span> —{" "}
          {AGENT.title.toLowerCase()}. Réponse personnelle sous 24&nbsp;h
          ouvrées.
        </p>
      </header>

      {/* Quick contact strip — direct call / email */}
      <div className="grid grid-cols-2 gap-px border-y border-subtle bg-[var(--color-border-subtle)]">
        <a
          href={`tel:${AGENT.phoneE164}`}
          className="group flex items-center justify-center gap-2 bg-card px-3 py-3 text-sm font-medium text-primary transition-colors hover:bg-section"
        >
          <Phone
            className="h-3.5 w-3.5 text-primary-600 transition-transform group-hover:-rotate-12"
            aria-hidden="true"
          />
          {AGENT.phoneDisplay}
        </a>
        <a
          href={`mailto:${AGENT.email}?subject=Bien ${reference}`}
          className="group flex items-center justify-center gap-2 bg-card px-3 py-3 text-sm font-medium text-primary transition-colors hover:bg-section"
        >
          <Mail
            className="h-3.5 w-3.5 text-primary-600 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
          Écrire
        </a>
      </div>

      {sent ? (
        <div className="px-6 py-8 text-center">
          <div
            aria-hidden="true"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-primary-600 text-primary-600"
          >
            <Send className="h-4 w-4" />
          </div>
          <p
            role="status"
            className="mt-4 font-display text-xl tracking-tight text-primary"
          >
            Demande envoyée.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-body">
            Merci pour votre message concernant le bien&nbsp;
            <strong className="font-medium text-primary">{reference}</strong>.
            Je vous recontacte sous 24&nbsp;h ouvrées.
          </p>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 px-6 pt-5 pb-6"
          noValidate
        >
          {/* Ornamental separator with caption */}
          <div className="-mt-1 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-subtle">
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-[var(--color-border-subtle)]"
            />
            ou par formulaire
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-[var(--color-border-subtle)]"
            />
          </div>

          <input type="hidden" {...register("reference")} />
          <input type="hidden" {...register("profile")} />
          <input type="hidden" {...register("financing")} />
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
              className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800"
            >
              {rootError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Prénom"
              required
              htmlFor="pcf-fn"
              error={errors.firstName?.message}
            >
              <TextInput
                id="pcf-fn"
                autoComplete="given-name"
                placeholder="Camille"
                {...register("firstName")}
              />
            </Field>
            <Field
              label="Nom"
              required
              htmlFor="pcf-ln"
              error={errors.lastName?.message}
            >
              <TextInput
                id="pcf-ln"
                autoComplete="family-name"
                placeholder="Dupont"
                {...register("lastName")}
              />
            </Field>
          </div>

          <Field
            label="Email"
            required
            htmlFor="pcf-email"
            error={errors.email?.message}
          >
            <TextInput
              id="pcf-email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.fr"
              {...register("email")}
            />
          </Field>

          <Field
            label="Téléphone"
            required
            htmlFor="pcf-phone"
            error={errors.phone?.message}
          >
            <TextInput
              id="pcf-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              {...register("phone")}
            />
          </Field>

          <Field
            label="Message"
            htmlFor="pcf-msg"
            error={errors.message?.message}
          >
            <TextareaInput
              id="pcf-msg"
              rows={3}
              placeholder={
                isRental
                  ? "Je souhaite organiser une visite…"
                  : "Je suis intéressé(e) par ce bien et souhaite plus d'informations…"
              }
              {...register("message")}
            />
          </Field>

          <label className="flex items-start gap-2 text-xs leading-relaxed text-body">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary-600)]"
              {...register("rgpd")}
            />
            <span>
              J&rsquo;accepte que mes données soient utilisées pour me
              recontacter — voir la{" "}
              <Link
                href="/politique-de-confidentialite"
                className="text-link underline underline-offset-2 hover:text-link-hover"
              >
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          {errors.rgpd && (
            <p role="alert" className="-mt-2 text-xs text-red-600">
              {errors.rgpd.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 w-full justify-center py-3 text-[0.875rem] font-semibold tracking-tight"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {isPending ? "Envoi…" : "Envoyer ma demande"}
          </Button>

          <p className="mt-1 text-center text-[0.68rem] uppercase tracking-[0.18em] text-subtle">
            Référence&nbsp;
            <span className="text-muted">{reference}</span>
          </p>
        </form>
      )}
    </div>
  );
}
