"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brush,
  Building2,
  CalendarClock,
  CalendarRange,
  Check,
  Clock3,
  Hammer,
  HelpCircle,
  Home,
  KeyRound,
  Loader2,
  Minus,
  Phone,
  Plus,
  Search,
  Sparkles,
  Sprout,
  Tag,
  Trees,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useState, useTransition } from "react";
import { submitEvaluation } from "@/app/actions/leads";
import {
  AddressAutocomplete,
  type AddressSuggestion,
} from "@/components/forms/estimation/AddressAutocomplete";
import { ChoiceCard } from "@/components/forms/estimation/ChoiceCard";
import { Button } from "@/components/ui/Button";
import { Field, TextareaInput, TextInput } from "@/components/ui/FormField";
import { AGENT } from "@/lib/config/agent";
import { cn } from "@/lib/utils";
import {
  type EstimationStep1,
  type EstimationStep2,
  estimationStep1Schema,
  estimationStep2Schema,
} from "@/lib/validation";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

type FormState = {
  type: EstimationStep1["type"] | "";
  address: AddressSuggestion | null;
  surface: string;
  rooms: string;
  floor: string;
  year: string;
  outdoor: string[];
  condition: EstimationStep1["condition"] | "";
  intent: EstimationStep2["intent"] | "";
  delay: EstimationStep2["delay"] | "";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  rgpd: boolean;
};

const INITIAL: FormState = {
  type: "",
  address: null,
  surface: "",
  rooms: "",
  floor: "",
  year: "",
  outdoor: [],
  condition: "",
  intent: "",
  delay: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  message: "",
  rgpd: false,
};

const STORAGE_KEY = "cr-estimation-draft-v1";

const STEPS = [
  { phase: 1, label: "Votre bien" },
  { phase: 1, label: "Votre bien" },
  { phase: 1, label: "Votre bien" },
  { phase: 1, label: "Votre bien" },
  { phase: 2, label: "Votre projet" },
  { phase: 2, label: "Votre projet" },
  { phase: 2, label: "Votre projet" },
] as const;
const TOTAL = STEPS.length;

/* -------------------------------------------------------------------------- */
/*                                MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

export function EstimationForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [done, setDone] = useState<string | null>(null);
  const [data, setData] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [rootError, setRootError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Restore from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormState> & {
          __step?: number;
        };
        const { __step, ...rest } = parsed;
        setData((d) => ({ ...d, ...rest }));
        if (typeof __step === "number" && __step >= 0 && __step < TOTAL) {
          setStep(__step);
        }
      }
    } catch {
      /* noop */
    }
  }, []);

  // Persist on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (done) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...data, __step: step }),
      );
    } catch {
      /* noop */
    }
  }, [data, step, done]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateStep(s: number): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (s === 0) {
      if (!data.type) e.type = "Sélectionnez un type de bien";
    } else if (s === 1) {
      if (!data.address) e.address = "Indiquez une adresse";
      else if (!data.address.postalCode)
        e.address = "Adresse incomplète, choisissez une suggestion";
    } else if (s === 2) {
      if (data.type !== "terrain") {
        if (!data.surface) e.surface = "Surface requise";
        else if (
          Number.isNaN(Number(data.surface)) ||
          Number(data.surface) <= 0
        )
          e.surface = "Surface invalide";
        if (!data.rooms) e.rooms = "Indiquez le nombre de pièces";
      } else {
        if (!data.surface) e.surface = "Surface du terrain requise";
        else if (
          Number.isNaN(Number(data.surface)) ||
          Number(data.surface) <= 0
        )
          e.surface = "Surface invalide";
      }
    } else if (s === 3) {
      if (!data.condition) e.condition = "Indiquez l'état général";
    } else if (s === 4) {
      if (!data.intent) e.intent = "Choisissez votre intention";
    } else if (s === 5) {
      if (!data.delay) e.delay = "Choisissez un délai";
    } else if (s === 6) {
      if (!data.firstName || data.firstName.length < 2)
        e.firstName = "Prénom requis";
      if (!data.lastName || data.lastName.length < 2) e.lastName = "Nom requis";
      if (!data.phone) e.phone = "Téléphone requis";
      else if (!/^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(data.phone))
        e.phone = "Format invalide (ex. 06 12 34 56 78)";
      if (!data.email) e.email = "Email requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        e.email = "Email invalide";
      if (!data.rgpd) e.rgpd = "Vous devez accepter la politique";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    // skip "étage" subset already merged; handle "terrain" skipping nothing else
    setDirection(1);
    setStep((s) => Math.min(TOTAL - 1, s + 1));
  }

  function prev() {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
    setRootError(null);
  }

  function submit() {
    if (!validateStep(6)) return;
    setRootError(null);
    startTransition(async () => {
      const street = data.address?.street ?? data.address?.label ?? "";
      const step1: EstimationStep1 = {
        address: street,
        postalCode: data.address?.postalCode ?? "",
        type: data.type as EstimationStep1["type"],
        surface: data.surface,
        rooms: data.type === "terrain" ? data.rooms || "1" : data.rooms,
        floor: data.floor || undefined,
        year: data.year || undefined,
        outdoor: data.outdoor,
        condition: data.condition as EstimationStep1["condition"],
      };
      const step2: EstimationStep2 = {
        intent: data.intent as EstimationStep2["intent"],
        delay: data.delay as EstimationStep2["delay"],
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        message: data.message || undefined,
        rgpd: data.rgpd,
        website: "",
      };
      const v1 = estimationStep1Schema.safeParse(step1);
      const v2 = estimationStep2Schema.safeParse(step2);
      if (!v1.success || !v2.success) {
        setRootError(
          "Quelques informations doivent être ajustées avant l'envoi.",
        );
        return;
      }
      const res = await submitEvaluation({ step1, step2 });
      if (res.ok) {
        setDone(res.id);
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          /* noop */
        }
        return;
      }
      setRootError(res.error);
    });
  }

  const progress = useMemo(() => {
    return Math.round(((step + 1) / TOTAL) * 100);
  }, [step]);

  if (done) {
    return <Confirmation leadId={done} firstName={data.firstName} />;
  }

  const current = STEPS[step];

  return (
    <div className="flex flex-col">
      <ProgressHeader step={step} progress={progress} phase={current.phase} />

      <div className="relative min-h-[420px] overflow-hidden px-1 sm:px-2">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction === 1 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 1 ? -40 : 40 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="pt-2"
          >
            {step === 0 && (
              <StepType
                value={data.type}
                onChange={(v) => update("type", v)}
                error={errors.type}
              />
            )}
            {step === 1 && (
              <StepAddress
                type={data.type as EstimationStep1["type"] | ""}
                value={data.address}
                onChange={(v) => update("address", v)}
                error={errors.address}
              />
            )}
            {step === 2 && (
              <StepSurface
                type={data.type as EstimationStep1["type"]}
                surface={data.surface}
                rooms={data.rooms}
                floor={data.floor}
                year={data.year}
                onChange={update}
                errors={errors}
              />
            )}
            {step === 3 && (
              <StepCondition
                condition={data.condition}
                outdoor={data.outdoor}
                type={data.type as EstimationStep1["type"]}
                onChange={update}
                errors={errors}
              />
            )}
            {step === 4 && (
              <StepIntent
                value={data.intent}
                onChange={(v) => update("intent", v)}
                error={errors.intent}
              />
            )}
            {step === 5 && (
              <StepDelay
                value={data.delay}
                onChange={(v) => update("delay", v)}
                error={errors.delay}
              />
            )}
            {step === 6 && (
              <StepContact
                data={data}
                update={update}
                errors={errors}
                rootError={rootError}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Nav
        step={step}
        onPrev={prev}
        onNext={next}
        onSubmit={submit}
        isPending={isPending}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              PROGRESS HEADER                               */
/* -------------------------------------------------------------------------- */

function ProgressHeader({
  step,
  progress,
  phase,
}: {
  step: number;
  progress: number;
  phase: 1 | 2;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:mb-10">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
          {phase === 1 ? "Votre bien" : "Votre projet"}
        </p>
        <p className="font-display text-sm tracking-tight text-muted">
          <span className="text-primary">{step + 1}</span>
          <span className="mx-1.5 text-subtle">/</span>
          <span>{TOTAL}</span>
        </p>
      </div>
      <div
        className="relative h-1 w-full overflow-hidden rounded-full bg-neutral-200/70"
        aria-hidden="true"
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-primary-600"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                NAV BAR                                     */
/* -------------------------------------------------------------------------- */

function Nav({
  step,
  onPrev,
  onNext,
  onSubmit,
  isPending,
}: {
  step: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isPending: boolean;
}) {
  const isLast = step === TOTAL - 1;
  return (
    <div className="mt-8 flex flex-col-reverse items-stretch gap-3 border-t border-subtle pt-5 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={step === 0}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium transition",
          step === 0
            ? "cursor-not-allowed text-subtle"
            : "text-body hover:text-primary",
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Retour
      </button>
      {isLast ? (
        <Button
          type="button"
          size="lg"
          onClick={onSubmit}
          disabled={isPending}
          className="sm:min-w-[14rem]"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Envoi en cours…
            </>
          ) : (
            <>
              Envoyer ma demande
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          size="lg"
          onClick={onNext}
          className="sm:min-w-[12rem]"
        >
          Continuer
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              STEP HEADINGS                                 */
/* -------------------------------------------------------------------------- */

function StepHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <h2 className="font-display text-2xl font-semibold leading-[1.15] tracking-tight text-primary sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-[15px] leading-[1.6] text-body">
          {description}
        </p>
      )}
    </div>
  );
}

function ErrorMsg({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-3 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*                                STEP 0 — TYPE                               */
/* -------------------------------------------------------------------------- */

function StepType({
  value,
  onChange,
  error,
}: {
  value: FormState["type"];
  onChange: (v: EstimationStep1["type"]) => void;
  error?: string;
}) {
  const options: {
    value: EstimationStep1["type"];
    label: string;
    icon: typeof Home;
    description: string;
  }[] = [
    {
      value: "appartement",
      label: "Appartement",
      icon: Building2,
      description: "Studio, T2, T3 et plus",
    },
    {
      value: "maison",
      label: "Maison",
      icon: Home,
      description: "Pavillon, maison de ville",
    },
    {
      value: "terrain",
      label: "Terrain",
      icon: Trees,
      description: "À bâtir ou loisir",
    },
    {
      value: "autre",
      label: "Autre",
      icon: HelpCircle,
      description: "Loft, local, immeuble…",
    },
  ];
  return (
    <div>
      <StepHeading
        title="Quel type de bien souhaitez-vous estimer ?"
        description="Choisissez la catégorie qui correspond le mieux. Cela oriente l'analyse comparable du cabinet."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <ChoiceCard
              key={opt.value}
              selected={value === opt.value}
              onClick={() => onChange(opt.value)}
              icon={<Icon className="h-5 w-5" aria-hidden="true" />}
              title={opt.label}
              description={opt.description}
            />
          );
        })}
      </div>
      <ErrorMsg message={error} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              STEP 1 — ADDRESS                              */
/* -------------------------------------------------------------------------- */

function StepAddress({
  type,
  value,
  onChange,
  error,
}: {
  type: EstimationStep1["type"] | "";
  value: AddressSuggestion | null;
  onChange: (v: AddressSuggestion | null) => void;
  error?: string;
}) {
  return (
    <div>
      <StepHeading
        title={
          type === "terrain"
            ? "Où se situe ce terrain ?"
            : "Où se situe votre bien ?"
        }
        description="Le cabinet s'appuie sur les transactions récentes de la même rue ou du même secteur. L'adresse exacte reste confidentielle."
      />
      <AddressAutocomplete
        autoFocus
        value={value}
        onChange={onChange}
        error={error}
      />
      {value && (
        <div className="mt-4 flex items-start gap-3 rounded-sm border border-subtle bg-neutral-50 px-4 py-3 text-sm">
          <Check
            className="mt-0.5 h-4 w-4 shrink-0 text-success"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-primary">{value.label}</span>
            <span className="text-xs text-muted">
              {value.postalCode} {value.city}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         STEP 2 — SURFACE / ROOMS / FLOOR                   */
/* -------------------------------------------------------------------------- */

function StepSurface({
  type,
  surface,
  rooms,
  floor,
  year,
  onChange,
  errors,
}: {
  type: EstimationStep1["type"];
  surface: string;
  rooms: string;
  floor: string;
  year: string;
  onChange: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  errors: Partial<Record<keyof FormState, string>>;
}) {
  const isTerrain = type === "terrain";
  const isApt = type === "appartement";

  function bumpRooms(delta: number) {
    const current = Number.parseInt(rooms || "0", 10) || 0;
    const next = Math.max(1, Math.min(8, current + delta));
    onChange("rooms", next >= 8 ? "8+" : String(next));
  }

  return (
    <div>
      <StepHeading
        title={isTerrain ? "Quelle est sa superficie ?" : "Surface et pièces"}
        description={
          isTerrain
            ? "Indiquez la surface totale du terrain."
            : "La surface habitable carrez et le nombre de pièces sont les principaux facteurs de prix."
        }
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label={isTerrain ? "Surface totale (m²)" : "Surface habitable (m²)"}
            required
            htmlFor="es-surface"
            error={errors.surface}
          >
            <div className="relative">
              <TextInput
                id="es-surface"
                type="number"
                inputMode="numeric"
                min={0}
                value={surface}
                onChange={(e) => onChange("surface", e.target.value)}
                className="pr-12 text-lg"
                placeholder="65"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">
                m²
              </span>
            </div>
          </Field>

          {!isTerrain && (
            <Field
              label="Nombre de pièces"
              required
              htmlFor="es-rooms"
              error={errors.rooms}
            >
              <div className="flex items-stretch overflow-hidden rounded-sm border border-default bg-card">
                <button
                  type="button"
                  onClick={() => bumpRooms(-1)}
                  aria-label="Retirer une pièce"
                  className="flex w-10 items-center justify-center text-muted transition hover:bg-neutral-50 hover:text-primary"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <div className="flex flex-1 items-center justify-center text-lg font-semibold text-primary">
                  {rooms || "—"}
                </div>
                <button
                  type="button"
                  onClick={() => bumpRooms(1)}
                  aria-label="Ajouter une pièce"
                  className="flex w-10 items-center justify-center text-muted transition hover:bg-neutral-50 hover:text-primary"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </Field>
          )}
        </div>

        {!isTerrain && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {isApt && (
              <fieldset className="flex flex-col gap-2">
                <span className="text-sm font-medium text-primary">Étage</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { v: "rdc", l: "RDC" },
                    { v: "1", l: "1ᵉʳ" },
                    { v: "2", l: "2ᵉ" },
                    { v: "3", l: "3ᵉ" },
                    { v: "4+", l: "4ᵉ +" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => onChange("floor", opt.v)}
                      className={cn(
                        "rounded-sm border px-3.5 py-1.5 text-sm transition-colors",
                        floor === opt.v
                          ? "border-primary-600 text-primary"
                          : "border-default text-body hover:border-neutral-400",
                      )}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            <Field
              label="Année de construction (facultatif)"
              htmlFor="es-year"
              error={errors.year}
            >
              <TextInput
                id="es-year"
                type="number"
                inputMode="numeric"
                min={1800}
                max={new Date().getFullYear() + 1}
                placeholder="1975"
                value={year}
                onChange={(e) => onChange("year", e.target.value)}
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                       STEP 3 — CONDITION + OUTDOOR                         */
/* -------------------------------------------------------------------------- */

function StepCondition({
  condition,
  outdoor,
  type,
  onChange,
  errors,
}: {
  condition: FormState["condition"];
  outdoor: string[];
  type: EstimationStep1["type"];
  onChange: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  errors: Partial<Record<keyof FormState, string>>;
}) {
  const isTerrain = type === "terrain";
  const conditions: {
    value: EstimationStep1["condition"];
    label: string;
    icon: typeof Sparkles;
    description: string;
  }[] = [
    {
      value: "neuf",
      label: "Neuf / refait",
      icon: Sparkles,
      description: "Rien à prévoir",
    },
    {
      value: "bon",
      label: "Bon état",
      icon: Check,
      description: "Quelques petits travaux",
    },
    {
      value: "rafraichir",
      label: "À rafraîchir",
      icon: Brush,
      description: "Peintures, sols, cuisine…",
    },
    {
      value: "renover",
      label: "À rénover",
      icon: Hammer,
      description: "Travaux importants",
    },
  ];

  const outdoorOpts: { value: string; label: string; icon: typeof Sprout }[] = [
    { value: "balcon", label: "Balcon", icon: Sprout },
    { value: "terrasse", label: "Terrasse", icon: Sprout },
    { value: "jardin", label: "Jardin", icon: Trees },
    { value: "aucun", label: "Aucun", icon: HelpCircle },
  ];

  function toggleOutdoor(v: string) {
    if (v === "aucun") {
      onChange("outdoor", outdoor.includes("aucun") ? [] : ["aucun"]);
      return;
    }
    const cleaned = outdoor.filter((o) => o !== "aucun");
    if (cleaned.includes(v)) {
      onChange(
        "outdoor",
        cleaned.filter((o) => o !== v),
      );
    } else {
      onChange("outdoor", [...cleaned, v]);
    }
  }

  return (
    <div>
      <StepHeading
        title={
          isTerrain
            ? "Quelques précisions sur le terrain"
            : "État général et extérieur"
        }
        description={
          isTerrain
            ? "Ces informations affinent l'analyse."
            : "Travaux à prévoir et extérieurs influencent fortement le prix."
        }
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-primary">
          État général <span className="text-red-600">*</span>
        </legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {conditions.map((opt) => {
            const Icon = opt.icon;
            return (
              <ChoiceCard
                key={opt.value}
                selected={condition === opt.value}
                onClick={() => onChange("condition", opt.value)}
                icon={<Icon className="h-4 w-4" aria-hidden="true" />}
                title={opt.label}
                description={opt.description}
                layout="horizontal"
                size="sm"
              />
            );
          })}
        </div>
        <ErrorMsg message={errors.condition} />
      </fieldset>

      {!isTerrain && (
        <fieldset className="mt-6 flex flex-col gap-3">
          <legend className="text-sm font-medium text-primary">
            Extérieur (facultatif)
          </legend>
          <div className="flex flex-wrap gap-2">
            {outdoorOpts.map((opt) => {
              const Icon = opt.icon;
              const selected = outdoor.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleOutdoor(opt.value)}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm transition-colors",
                    selected
                      ? "border-primary-600 text-primary"
                      : "border-default text-body hover:border-neutral-400",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              STEP 4 — INTENT                               */
/* -------------------------------------------------------------------------- */

function StepIntent({
  value,
  onChange,
  error,
}: {
  value: FormState["intent"];
  onChange: (v: EstimationStep2["intent"]) => void;
  error?: string;
}) {
  const options: {
    value: EstimationStep2["intent"];
    label: string;
    icon: typeof Tag;
    description: string;
  }[] = [
    {
      value: "vendre",
      label: "Je veux vendre",
      icon: Tag,
      description: "Mise en vente envisagée",
    },
    {
      value: "louer",
      label: "Je veux louer",
      icon: KeyRound,
      description: "Mise en location envisagée",
    },
    {
      value: "renseigne",
      label: "Je me renseigne",
      icon: Search,
      description: "Juste une idée du prix",
    },
  ];
  return (
    <div>
      <StepHeading
        title="Quel est votre projet ?"
        description="Pour adapter la réponse du cabinet à votre situation. Aucun engagement à cette étape."
      />
      <div className="grid grid-cols-1 gap-2.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <ChoiceCard
              key={opt.value}
              selected={value === opt.value}
              onClick={() => onChange(opt.value)}
              icon={<Icon className="h-4 w-4" aria-hidden="true" />}
              title={opt.label}
              description={opt.description}
              layout="horizontal"
              size="sm"
            />
          );
        })}
      </div>
      <ErrorMsg message={error} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               STEP 5 — DELAY                               */
/* -------------------------------------------------------------------------- */

function StepDelay({
  value,
  onChange,
  error,
}: {
  value: FormState["delay"];
  onChange: (v: EstimationStep2["delay"]) => void;
  error?: string;
}) {
  const options: {
    value: EstimationStep2["delay"];
    label: string;
    icon: typeof Clock3;
    description: string;
  }[] = [
    {
      value: "3m",
      label: "Moins de 3 mois",
      icon: Clock3,
      description: "Projet urgent",
    },
    {
      value: "3-6m",
      label: "3 à 6 mois",
      icon: CalendarClock,
      description: "À court terme",
    },
    {
      value: "6-12m",
      label: "6 à 12 mois",
      icon: CalendarRange,
      description: "À moyen terme",
    },
    {
      value: "plus-tard",
      label: "Plus tard",
      icon: HelpCircle,
      description: "Pas encore décidé",
    },
  ];
  return (
    <div>
      <StepHeading
        title="Sous quel délai ?"
        description="Une simple indication. Vous restez maître du calendrier."
      />
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <ChoiceCard
              key={opt.value}
              selected={value === opt.value}
              onClick={() => onChange(opt.value)}
              icon={<Icon className="h-4 w-4" aria-hidden="true" />}
              title={opt.label}
              description={opt.description}
              layout="horizontal"
              size="sm"
            />
          );
        })}
      </div>
      <ErrorMsg message={error} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              STEP 6 — CONTACT                              */
/* -------------------------------------------------------------------------- */

function StepContact({
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

/* -------------------------------------------------------------------------- */
/*                              CONFIRMATION                                  */
/* -------------------------------------------------------------------------- */

function Confirmation({
  leadId,
  firstName,
}: {
  leadId: string;
  firstName: string;
}) {
  const hasPhone = AGENT.phoneE164 && AGENT.phoneE164 !== "TODO";
  return (
    <motion.div
      data-lead-id={leadId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
        Demande envoyée
      </p>
      <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.15] tracking-tight text-primary md:text-4xl">
        {firstName ? `Merci ${firstName}.` : "Merci."}
        <br />
        <span className="text-muted">À très vite.</span>
      </h2>
      <p className="mt-5 max-w-md text-[15px] leading-[1.7] text-body">
        Le Cabinet Rimbault prend connaissance de votre dossier et revient vers
        vous avec une première estimation.
      </p>
      <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/vendre"
          className="inline-flex flex-1 items-center justify-center gap-2 border border-primary-600 px-4 py-2.5 text-sm font-medium text-primary-600 transition-colors hover:bg-primary-600 hover:text-on-primary"
        >
          Découvrir notre méthode
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/acheter"
          className="inline-flex flex-1 items-center justify-center gap-2 border border-default px-4 py-2.5 text-sm font-medium text-body transition-colors hover:border-neutral-400 hover:text-primary"
        >
          Voir les biens à vendre
        </Link>
      </div>
      {hasPhone && (
        <a
          href={`tel:${AGENT.phoneE164}`}
          className="mt-8 inline-flex items-center gap-2 text-sm text-muted underline-offset-4 hover:text-primary hover:underline"
        >
          <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          Joindre le cabinet directement au {AGENT.phoneDisplay}
        </a>
      )}
      <p className="mt-10 text-xs tracking-wide text-subtle">
        Référence&nbsp;: {leadId}
      </p>
    </motion.div>
  );
}
