"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { submitEvaluation } from "@/app/actions/leads";
import {
  type EstimationStep1,
  type EstimationStep2,
  estimationStep1Schema,
  estimationStep2Schema,
} from "@/lib/validation";
import {
  type FieldErrors,
  type FormState,
  INITIAL,
  STEPS,
  STORAGE_KEY,
  TOTAL,
} from "./estimation-funnel";

const PHONE_RE = /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Toute la logique du tunnel d'estimation : état centralisé, validation par
 * étape, navigation, persistance `sessionStorage` et soumission. Le rendu est
 * délégué à `EstimationForm` et aux composants d'étape.
 */
export function useEstimationFunnel() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [done, setDone] = useState<string | null>(null);
  const [data, setData] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [rootError, setRootError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Restauration depuis sessionStorage au montage
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

  // Persistance à chaque changement
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

  function selectAndAdvance<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setDirection(1);
    setStep((s) => Math.min(TOTAL - 1, s + 1));
  }

  function validateStep(s: number): boolean {
    const e: FieldErrors = {};
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
      if (!data.firstName || data.firstName.length < 2)
        e.firstName = "Prénom requis";
      if (!data.lastName || data.lastName.length < 2) e.lastName = "Nom requis";
      if (!data.phone) e.phone = "Téléphone requis";
      else if (!PHONE_RE.test(data.phone))
        e.phone = "Format invalide (ex. 06 12 34 56 78)";
      if (!data.email) e.email = "Email requis";
      else if (!EMAIL_RE.test(data.email)) e.email = "Email invalide";
      if (!data.rgpd) e.rgpd = "Vous devez accepter la politique";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /**
   * Prédicat « champs requis remplis » de l'étape — sans poser d'erreur.
   * Pilote l'état désactivé du bouton « Continuer ». La validation de format
   * (téléphone, e-mail, surface) reste effectuée au clic via `validateStep`.
   */
  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return Boolean(data.type);
      case 1:
        return Boolean(data.address?.postalCode);
      case 2:
        return data.type === "terrain"
          ? Boolean(data.surface)
          : Boolean(data.surface && data.rooms);
      case 3:
        return Boolean(data.condition);
      case 4:
        return Boolean(data.intent);
      case 5:
        return Boolean(
          data.firstName.trim().length >= 2 &&
            data.lastName.trim().length >= 2 &&
            data.phone &&
            data.email &&
            data.rgpd,
        );
      default:
        return false;
    }
  }, [step, data]);

  function next() {
    if (!validateStep(step)) return;
    setDirection(1);
    setStep((s) => Math.min(TOTAL - 1, s + 1));
  }

  function prev() {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
    setRootError(null);
  }

  function submit() {
    if (!validateStep(5)) return;
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

  const progress = useMemo(
    () => Math.round(((step + 1) / TOTAL) * 100),
    [step],
  );

  return {
    step,
    direction,
    data,
    errors,
    rootError,
    isPending,
    done,
    progress,
    canProceed,
    phase: STEPS[step].phase,
    update,
    selectAndAdvance,
    next,
    prev,
    submit,
  };
}
