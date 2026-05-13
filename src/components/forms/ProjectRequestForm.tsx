"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { submitProjectRequest } from "@/app/actions/leads";
import { Button } from "@/components/ui/Button";
import {
  Field,
  SelectInput,
  TextareaInput,
  TextInput,
} from "@/components/ui/FormField";
import { COMMUNES } from "@/lib/config/communes";
import {
  type ProjectRequestInput,
  projectRequestSchema,
} from "@/lib/validation";

export type ProjectRequestMode = "sale" | "rent";

interface Props {
  mode: ProjectRequestMode;
  prefill?: {
    commune?: string;
    propertyType?: string;
    budgetMax?: string;
    piecesMin?: string;
  };
  onSuccess?: () => void;
}

const SALE_TYPES = [
  { value: "", label: "Sans préférence" },
  { value: "APPARTEMENT", label: "Appartement" },
  { value: "MAISON", label: "Maison" },
  { value: "TERRAIN", label: "Terrain" },
  { value: "LOCAL_COMMERCIAL", label: "Local professionnel" },
  { value: "PARKING", label: "Parking" },
  { value: "AUTRE", label: "Autre" },
];

const RENT_TYPES = [
  { value: "", label: "Sans préférence" },
  { value: "APPARTEMENT", label: "Appartement" },
  { value: "MAISON", label: "Maison" },
  { value: "LOCAL_COMMERCIAL", label: "Local professionnel" },
  { value: "PARKING", label: "Parking" },
  { value: "AUTRE", label: "Autre" },
];

const PIECES = [
  { value: "", label: "Sans préférence" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

export function ProjectRequestForm({ mode, prefill, onSuccess }: Props) {
  const [sent, setSent] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProjectRequestInput>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      mode,
      commune: prefill?.commune ?? "",
      propertyType: prefill?.propertyType ?? "",
      budgetMax: prefill?.budgetMax ?? "",
      piecesMin: prefill?.piecesMin ?? "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      message: "",
      rgpd: false,
      website: "",
    },
  });

  const types = mode === "sale" ? SALE_TYPES : RENT_TYPES;
  const budgetLabel = mode === "sale" ? "Budget maximum" : "Loyer maximum";
  const budgetPlaceholder = mode === "sale" ? "500 000" : "1 500";

  const onSubmit = handleSubmit((values) => {
    setRootError(null);
    startTransition(async () => {
      const res = await submitProjectRequest(values);
      if (res.ok) {
        setSent(true);
        onSuccess?.();
        return;
      }
      setRootError(res.error);
      if (res.fields) {
        for (const [path, message] of Object.entries(res.fields)) {
          const field = path.split(".").pop() as keyof ProjectRequestInput;
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
        <p className="font-medium">Demande reçue.</p>
        <p className="mt-1">
          Je reviens vers vous sous 48 h ouvrées avec une première sélection.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <input type="hidden" {...register("mode")} />
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

      <fieldset className="flex flex-col gap-3">
        <legend className="text-xs font-semibold uppercase tracking-wider text-muted">
          Votre recherche
        </legend>
        <Field
          label="Commune"
          required
          error={errors.commune?.message}
          htmlFor="pr-commune"
        >
          <SelectInput id="pr-commune" {...register("commune")}>
            <option value="">Choisir une commune</option>
            {COMMUNES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </SelectInput>
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Type de bien"
            error={errors.propertyType?.message}
            htmlFor="pr-type"
          >
            <SelectInput id="pr-type" {...register("propertyType")}>
              {types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field
            label="Pièces min."
            error={errors.piecesMin?.message}
            htmlFor="pr-pieces"
          >
            <SelectInput id="pr-pieces" {...register("piecesMin")}>
              {PIECES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>
        <Field
          label={budgetLabel}
          error={errors.budgetMax?.message}
          htmlFor="pr-budget"
          hint="En euros, sans espaces ni symbole."
        >
          <TextInput
            id="pr-budget"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            placeholder={budgetPlaceholder}
            {...register("budgetMax")}
          />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-xs font-semibold uppercase tracking-wider text-muted">
          Vos coordonnées
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Prénom"
            required
            error={errors.firstName?.message}
            htmlFor="pr-firstname"
          >
            <TextInput
              id="pr-firstname"
              autoComplete="given-name"
              {...register("firstName")}
            />
          </Field>
          <Field
            label="Nom"
            required
            error={errors.lastName?.message}
            htmlFor="pr-lastname"
          >
            <TextInput
              id="pr-lastname"
              autoComplete="family-name"
              {...register("lastName")}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label="Téléphone"
            required
            error={errors.phone?.message}
            htmlFor="pr-phone"
          >
            <TextInput
              id="pr-phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="06 12 34 56 78"
              {...register("phone")}
            />
          </Field>
          <Field
            label="Email"
            required
            error={errors.email?.message}
            htmlFor="pr-email"
          >
            <TextInput
              id="pr-email"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
          </Field>
        </div>
      </fieldset>

      <Field
        label="Précisions"
        error={errors.message?.message}
        htmlFor="pr-message"
        hint="Ex. : calme, lumineux, proche métro, jardin, etc."
      >
        <TextareaInput id="pr-message" rows={3} {...register("message")} />
      </Field>

      <label className="flex gap-2 text-xs leading-relaxed text-body">
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
          </Link>{" "}
          et autorise Cabinet Rimbault à me recontacter.
        </span>
      </label>
      {errors.rgpd && (
        <p role="alert" className="text-xs text-red-600">
          {errors.rgpd.message}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        <Mail className="h-4 w-4" aria-hidden="true" />
        {isPending ? "Envoi…" : "Envoyer ma demande"}
      </Button>
    </form>
  );
}
