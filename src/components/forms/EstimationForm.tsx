"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { submitEvaluation } from "@/app/actions/leads";
import { Button, LinkButton } from "@/components/ui/Button";
import {
  Field,
  FieldLabel,
  SelectInput,
  TextareaInput,
  TextInput,
} from "@/components/ui/FormField";
import { AGENT } from "@/lib/config/agent";
import {
  type EstimationStep1,
  type EstimationStep2,
  estimationStep1Schema,
  estimationStep2Schema,
} from "@/lib/validation";

type Step = 1 | 2 | "done";

export function EstimationForm() {
  const [step, setStep] = useState<Step>(1);
  const [step1Data, setStep1Data] = useState<EstimationStep1 | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <Progress step={step === "done" ? 2 : step} />
      {step === 1 && (
        <Step1
          initial={step1Data}
          onNext={(data) => {
            setStep1Data(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && step1Data && (
        <Step2
          step1={step1Data}
          onBack={() => setStep(1)}
          onDone={(id) => {
            setLeadId(id);
            setStep("done");
          }}
        />
      )}
      {step === "done" && <Confirmation leadId={leadId} />}
    </div>
  );
}

function Progress({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={
          step >= 1
            ? "h-2 w-8 rounded-full bg-inverse"
            : "h-2 w-8 rounded-full bg-neutral-200"
        }
      />
      <div
        className={
          step >= 2
            ? "h-2 w-8 rounded-full bg-inverse"
            : "h-2 w-8 rounded-full bg-neutral-200"
        }
      />
      <p className="text-sm font-medium text-body">
        Étape {step} / 2 —{" "}
        <span className="text-muted">
          {step === 1 ? "Votre bien" : "Votre projet"}
        </span>
      </p>
    </div>
  );
}

function Step1({
  initial,
  onNext,
}: {
  initial: EstimationStep1 | null;
  onNext: (data: EstimationStep1) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EstimationStep1>({
    resolver: zodResolver(estimationStep1Schema),
    defaultValues: initial ?? {
      address: "",
      postalCode: "",
      type: "appartement",
      surface: "",
      rooms: "",
      floor: "",
      year: "",
      outdoor: [],
      condition: "bon",
    },
  });
  const type = watch("type");

  const onSubmit = handleSubmit((data) => onNext(data));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Field
        label="Adresse du bien"
        required
        htmlFor="es-address"
        error={errors.address?.message}
      >
        <TextInput
          id="es-address"
          autoComplete="street-address"
          {...register("address")}
        />
      </Field>

      <Field
        label="Code postal"
        required
        htmlFor="es-postal"
        error={errors.postalCode?.message}
      >
        <TextInput
          id="es-postal"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          {...register("postalCode")}
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <FieldLabel required>Type de bien</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "appartement", label: "Appartement" },
            { value: "maison", label: "Maison" },
            { value: "terrain", label: "Terrain" },
            { value: "autre", label: "Autre" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 rounded-sm border border-subtle px-3 py-1.5 text-sm hover:border-default"
            >
              <input
                type="radio"
                value={opt.value}
                className="h-4 w-4"
                {...register("type")}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Surface habitable (m²)"
          required
          htmlFor="es-surface"
          error={errors.surface?.message}
        >
          <TextInput
            id="es-surface"
            type="number"
            inputMode="numeric"
            min={0}
            {...register("surface")}
          />
        </Field>
        <Field
          label="Nombre de pièces"
          required
          htmlFor="es-rooms"
          error={errors.rooms?.message}
        >
          <SelectInput id="es-rooms" {...register("rooms")}>
            <option value="">—</option>
            {["1", "2", "3", "4", "5", "6", "7", "8+"].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {type === "appartement" && (
          <Field label="Étage" htmlFor="es-floor" error={errors.floor?.message}>
            <SelectInput id="es-floor" {...register("floor")}>
              <option value="">—</option>
              <option value="rdc">Rez-de-chaussée</option>
              <option value="1">1er</option>
              <option value="2">2e</option>
              <option value="3">3e</option>
              <option value="4+">4e et plus</option>
            </SelectInput>
          </Field>
        )}
        <Field
          label="Année de construction"
          htmlFor="es-year"
          error={errors.year?.message}
        >
          <TextInput
            id="es-year"
            type="number"
            inputMode="numeric"
            min={1800}
            max={new Date().getFullYear() + 1}
            {...register("year")}
          />
        </Field>
      </div>

      <fieldset className="flex flex-col gap-2">
        <FieldLabel>Extérieur</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "balcon", label: "Balcon" },
            { value: "terrasse", label: "Terrasse" },
            { value: "jardin", label: "Jardin" },
            { value: "aucun", label: "Aucun" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 rounded-sm border border-subtle px-3 py-1.5 text-sm hover:border-default"
            >
              <input
                type="checkbox"
                value={opt.value}
                className="h-4 w-4"
                {...register("outdoor")}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <FieldLabel required>État général</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "neuf", label: "Neuf / refait" },
            { value: "bon", label: "Bon état" },
            { value: "rafraichir", label: "À rafraîchir" },
            { value: "renover", label: "À rénover" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 rounded-sm border border-subtle px-3 py-1.5 text-sm hover:border-default"
            >
              <input
                type="radio"
                value={opt.value}
                className="h-4 w-4"
                {...register("condition")}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end">
        <Button type="submit">Suivant →</Button>
      </div>
    </form>
  );
}

function Step2({
  step1,
  onBack,
  onDone,
}: {
  step1: EstimationStep1;
  onBack: () => void;
  onDone: (id: string) => void;
}) {
  const [rootError, setRootError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EstimationStep2>({
    resolver: zodResolver(estimationStep2Schema),
    defaultValues: {
      intent: "vendre",
      delay: "3-6m",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      message: "",
      rgpd: false,
      website: "",
    },
  });

  const submit = handleSubmit((values) => {
    setRootError(null);
    startTransition(async () => {
      const res = await submitEvaluation({ step1, step2: values });
      if (res.ok) {
        onDone(res.id);
        return;
      }
      setRootError(res.error);
      if (res.fields) {
        for (const [path, message] of Object.entries(res.fields)) {
          const field = path.split(".").pop() as keyof EstimationStep2;
          setError(field, { type: "server", message });
        }
      }
    });
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
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
        <FieldLabel required>Quelle est votre intention ?</FieldLabel>
        <div className="grid grid-cols-1 gap-1.5">
          {[
            { value: "vendre", label: "Je veux vendre" },
            { value: "louer", label: "Je veux mettre en location" },
            {
              value: "renseigne",
              label: "Je me renseigne, c'est juste une idée",
            },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-sm border border-subtle px-3 py-2 text-sm hover:border-default"
            >
              <input
                type="radio"
                value={opt.value}
                className="h-4 w-4"
                {...register("intent")}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <FieldLabel required>Délai envisagé</FieldLabel>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {[
            { value: "3m", label: "Moins de 3 mois" },
            { value: "3-6m", label: "3 à 6 mois" },
            { value: "6-12m", label: "6 à 12 mois" },
            { value: "plus-tard", label: "Plus tard / pas encore décidé" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-sm border border-subtle px-3 py-2 text-sm hover:border-default"
            >
              <input
                type="radio"
                value={opt.value}
                className="h-4 w-4"
                {...register("delay")}
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
          htmlFor="es2-fn"
          error={errors.firstName?.message}
        >
          <TextInput
            id="es2-fn"
            autoComplete="given-name"
            {...register("firstName")}
          />
        </Field>
        <Field
          label="Nom"
          required
          htmlFor="es2-ln"
          error={errors.lastName?.message}
        >
          <TextInput
            id="es2-ln"
            autoComplete="family-name"
            {...register("lastName")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Téléphone"
          required
          htmlFor="es2-phone"
          error={errors.phone?.message}
        >
          <TextInput
            id="es2-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...register("phone")}
          />
        </Field>
        <Field
          label="Email"
          required
          htmlFor="es2-email"
          error={errors.email?.message}
        >
          <TextInput
            id="es2-email"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
        </Field>
      </div>

      <Field label="Message" htmlFor="es2-msg" error={errors.message?.message}>
        <TextareaInput id="es2-msg" rows={3} {...register("message")} />
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

      <div className="flex items-center justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          ← Retour
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Envoi…" : "Envoyer ma demande"}
        </Button>
      </div>
    </form>
  );
}

function Confirmation({ leadId }: { leadId: string | null }) {
  return (
    <div
      data-lead-id={leadId ?? undefined}
      className="flex flex-col items-center gap-4 rounded-sm border border-emerald-200 bg-emerald-50 p-8 text-center text-emerald-900"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Check className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-semibold">
        Votre demande a bien été envoyée
      </h2>
      <p className="max-w-md text-sm">
        Je vous recontacte personnellement sous 24–48 h au numéro que vous
        m&apos;avez indiqué.
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <LinkButton href="/vendre" variant="secondary" size="sm">
          Découvrir mon approche
        </LinkButton>
        <LinkButton href="/acheter" variant="secondary" size="sm">
          Voir les biens à vendre
        </LinkButton>
      </div>
      <p className="mt-2 text-xs text-emerald-800">
        Besoin de me joindre directement ?{" "}
        <a
          href={`tel:${AGENT.phoneE164}`}
          className="font-medium underline underline-offset-2"
        >
          {AGENT.phoneDisplay}
        </a>
      </p>
    </div>
  );
}
