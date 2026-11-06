"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  type FormEvent,
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { submitEstimation } from "@/app/(tunnel)/estimation/actions";
import { StepTransition } from "@/components/motion/StepTransition";
import { Button } from "@/components/ui/Button";
import { ErrorSummary } from "@/components/ui/ErrorSummary";
import { agency } from "@/lib/agency";
import {
  estimationStateToFormData,
  hasAnswers,
} from "@/lib/estimation/form-data";
import {
  INITIAL_RESULT,
  REFERER_FIELD,
  SENT_AT_FIELD,
} from "@/lib/estimation/result";
import {
  clearEstimation,
  loadEstimation,
  saveEstimation,
} from "@/lib/estimation/storage";
import {
  type EstimationErrors,
  type EstimationField,
  type EstimationState,
  type EstimationStep,
  emptyEstimationState,
  firstIncompleteStep,
  intentFromObjet,
  parseStep,
  stepOfField,
  validateEstimation,
  validateEstimationStep,
} from "@/lib/forms/estimation-schema";
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/forms/spam";
import { isBlank } from "@/lib/forms/validators";
import { Confirmation } from "./Confirmation";
import { StepFeatures } from "./StepFeatures";
import { StepProperty } from "./StepProperty";
import { StepReview } from "./StepReview";
import { StepYou } from "./StepYou";
import { fieldId } from "./shared";
import { TunnelProgress } from "./TunnelProgress";
import { TunnelShell } from "./TunnelShell";

// Tunnel d'estimation (doc 04 §3, A1, A17, A18, A23, A34 ; critères §9).
//
// - L'étape est dans l'URL (`?etape=`), poussée dans l'historique : le bouton
//   Précédent du navigateur revient à l'étape précédente. Une étape dont les
//   précédentes sont incomplètes ramène à la première étape incomplète.
// - Les réponses sont gardées en sessionStorage (300 ms après chaque
//   changement, et au masquage de la page) et reproposées au retour, avec
//   « Recommencer ». Effacées (`clearEstimation`) après un envoi réussi et
//   sur « Recommencer » ; un formulaire vierge n'est jamais enregistré.
// - `?objet=vente|loyer` pré-remplit l'objet de l'estimation (A1).
// - Envoi par la Server Action `submitEstimation` : un seul envoi à la fois
//   (verrou en mémoire + bouton désactivé), données conservées en cas
//   d'échec, champ piège et délai minimal de 4 s vérifiés sur le serveur.

const BASE_PATH = "/estimation";
const SAVE_DELAY_MS = 300;

type Meta = { startedAt: number; referer: string };

/** Page interne d'où vient le visiteur (`/vendre`), ou « ». */
function internalReferrer(): string {
  try {
    if (!document.referrer) return "";
    const url = new URL(document.referrer);
    if (url.origin !== window.location.origin) return "";
    return url.pathname === BASE_PATH ? "" : url.pathname;
  } catch {
    return "";
  }
}

function stepUrl(step: EstimationStep): string {
  return step === 1 ? BASE_PATH : `${BASE_PATH}?etape=${step}`;
}

function TunnelFallback() {
  return (
    <TunnelShell>
      <TunnelProgress step={1} />
      <noscript>
        <p className="t-ui">
          Ce formulaire a besoin de JavaScript pour passer d’une étape à
          l’autre. Vous pouvez aussi nous appeler au{" "}
          <span className="chiffres whitespace-nowrap">
            {agency.phone.display}
          </span>
          .
        </p>
      </noscript>
    </TunnelShell>
  );
}

export { TunnelFallback };

export function EstimationTunnel() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const urlStep = parseStep(searchParams.get("etape"));

  const [ready, setReady] = useState(false);
  const [state, setState] = useState<EstimationState>(() =>
    emptyEstimationState(intentFromObjet(searchParams.get("objet"))),
  );
  const meta = useRef<Meta>({ startedAt: 0, referer: "" });
  const [restored, setRestored] = useState(false);
  const [errors, setErrors] = useState<EstimationErrors>({});
  const [attempt, setAttempt] = useState(0);
  const [returnToReview, setReturnToReview] = useState(false);
  const [confirmed, setConfirmed] = useState<EstimationState | null>(null);
  const [result, dispatch, pending] = useActionState(
    submitEstimation,
    INITIAL_RESULT,
  );
  const sending = useRef(false);
  const sentState = useRef<EstimationState | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  // `?objet=` lu à l'arrivée (l'URL est ensuite ramenée à `?etape=`).
  const initialObjet = useRef(searchParams.get("objet"));

  // Étape affichée : celle de l'URL, sans jamais sauter une étape incomplète.
  // Pendant la confirmation, l'URL fait foi : un retour arrière la referme.
  const guarded = ready && !confirmed;
  const step: EstimationStep = guarded
    ? (Math.min(urlStep, firstIncompleteStep(state)) as EstimationStep)
    : urlStep;

  // Sens de la transition et remise à zéro des erreurs à chaque changement
  // d'étape (mise à jour pendant le rendu, motif recommandé par React).
  const [shownStep, setShownStep] = useState(step);
  const [sens, setSens] = useState<"avant" | "arriere">("avant");
  // Erreurs à montrer sur l'étape d'arrivée (refus du serveur sur une autre étape).
  const [carriedErrors, setCarriedErrors] = useState<EstimationErrors | null>(
    null,
  );
  if (step !== shownStep) {
    setShownStep(step);
    setSens(step > shownStep ? "avant" : "arriere");
    setErrors(carriedErrors ?? {});
    setCarriedErrors(null);
    setRestored(false);
    if (step === 4) setReturnToReview(false);
    if (confirmed) setConfirmed(null);
  }

  // 1. Reprise : sessionStorage, puis `?objet=` qui l'emporte s'il est donné.
  useEffect(() => {
    const saved = loadEstimation();
    const objet = initialObjet.current;
    let next = saved?.state ?? emptyEstimationState(intentFromObjet(objet));
    if (saved && (objet === "vente" || objet === "loyer"))
      next = { ...next, intent: intentFromObjet(objet) };
    meta.current = {
      startedAt: saved?.startedAt ?? Date.now(),
      referer: saved?.referer || internalReferrer(),
    };
    setState(next);
    setRestored(saved !== null && hasAnswers(saved.state));
    setReady(true);
  }, []);

  // 2. L'URL suit l'étape réellement affichée (arrivée directe sur
  // `?etape=3` incomplète, `?objet=` retiré après lecture).
  useEffect(() => {
    if (!ready || confirmed) return;
    const target = stepUrl(step);
    const current = `${pathname}${searchParams.size ? `?${searchParams}` : ""}`;
    if (current !== target) window.history.replaceState(null, "", target);
  }, [ready, step, pathname, searchParams, confirmed]);

  // 3. Sauvegarde différée, et immédiate quand la page est masquée. Un
  // formulaire vierge (arrivée, ou juste après « Recommencer ») n'écrit rien :
  // le stockage reste vide tant qu'aucune réponse n'est donnée.
  const save = useCallback(() => {
    if (!ready || confirmed) return;
    if (hasAnswers(state)) saveEstimation({ state, ...meta.current });
    else clearEstimation();
  }, [ready, confirmed, state]);
  useEffect(() => {
    if (!ready || confirmed) return;
    const timer = window.setTimeout(save, SAVE_DELAY_MS);
    window.addEventListener("pagehide", save);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", save);
    };
  }, [ready, confirmed, save]);

  // 4. Réponse de la Server Action.
  // biome-ignore lint/correctness/useExhaustiveDependencies: réagit à chaque nouvelle réponse.
  useEffect(() => {
    if (result.status === "idle") return;
    sending.current = false;
    if (result.status === "success" && sentState.current) {
      clearEstimation();
      setConfirmed(sentState.current);
      setState(emptyEstimationState(sentState.current.intent));
      meta.current = { startedAt: Date.now(), referer: meta.current.referer };
      sentState.current = null;
    } else if (result.status === "invalid") {
      const fields = Object.keys(result.errors) as EstimationField[];
      const target = fields.length ? stepOfField(fields[0]) : 4;
      setAttempt((n) => n + 1);
      if (target !== step) {
        setCarriedErrors(result.errors);
        navigate(target, "push");
      } else setErrors(result.errors);
    }
  }, [result]);

  function navigate(target: EstimationStep, mode: "push" | "replace") {
    const top = frame.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollBy({ top: top - 24, behavior: "instant" });
    if (mode === "push") window.history.pushState(null, "", stepUrl(target));
    else window.history.replaceState(null, "", stepUrl(target));
  }

  function update(patch: Partial<EstimationState>) {
    const next = { ...state, ...patch };
    setState(next);
    // Une erreur affichée disparaît dès que la réponse devient valable.
    if (Object.keys(errors).length === 0) return;
    const now = validateEstimationStep(step, next);
    const kept: EstimationErrors = {};
    for (const [key, message] of Object.entries(errors)) {
      if (now[key as EstimationField]) kept[key as EstimationField] = message;
    }
    if (Object.keys(kept).length !== Object.keys(errors).length)
      setErrors(kept);
  }

  // Validation à la sortie d'un champ : on signale une saisie fausse, jamais
  // un champ simplement laissé vide (signalé à « Continuer »).
  function onBlurField(field: EstimationField) {
    const value = state[field];
    const message = validateEstimationStep(step, state)[field];
    setErrors((current) => {
      if (message && typeof value === "string" && !isBlank(value))
        return { ...current, [field]: message };
      if (!message && current[field]) {
        const { [field]: _removed, ...rest } = current;
        return rest;
      }
      return current;
    });
  }

  function restart() {
    clearEstimation();
    const fresh = emptyEstimationState(intentFromObjet(initialObjet.current));
    setState(fresh);
    meta.current = { startedAt: Date.now(), referer: meta.current.referer };
    setErrors({});
    setRestored(false);
    setReturnToReview(false);
    if (step !== 1) navigate(1, "push");
    else
      frame.current?.querySelector<HTMLElement>("[data-titre-etape]")?.focus();
  }

  function onContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 4) return submit(event.currentTarget);
    const stepErrors = validateEstimationStep(step, state);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setAttempt((n) => n + 1);
      return;
    }
    save();
    const next: EstimationStep =
      returnToReview && firstIncompleteStep(state) === 4
        ? 4
        : ((step + 1) as EstimationStep);
    navigate(next, "push");
  }

  function submit(form: HTMLFormElement) {
    if (sending.current || pending) return;
    const allErrors = validateEstimation(state);
    const fields = Object.keys(allErrors) as EstimationField[];
    if (fields.length > 0) {
      const target = stepOfField(fields[0]);
      if (target !== 4) {
        setCarriedErrors(validateEstimationStep(target, state));
        return navigate(target, "push");
      }
      setErrors(allErrors);
      setAttempt((n) => n + 1);
      return;
    }
    sending.current = true;
    sentState.current = state;
    const data = estimationStateToFormData(state);
    const trap = form.elements.namedItem(HONEYPOT_FIELD);
    data.set(
      HONEYPOT_FIELD,
      trap instanceof HTMLInputElement ? trap.value : "",
    );
    data.set(STARTED_AT_FIELD, String(meta.current.startedAt));
    data.set(SENT_AT_FIELD, String(Date.now()));
    data.set(REFERER_FIELD, meta.current.referer);
    startTransition(() => dispatch(data));
  }

  function onEdit(target: EstimationStep) {
    setReturnToReview(true);
    navigate(target, "push");
  }

  if (confirmed) return <Confirmation state={confirmed} />;
  if (!ready) return <TunnelFallback />;

  const summaryErrors = Object.entries(errors).map(([field, message]) => ({
    fieldId: fieldId(field as EstimationField),
    message: message as string,
  }));
  // Rendu par chaque étape sous son titre (h2), pour l'ordre h1, h2, h3.
  const summary =
    summaryErrors.length > 0 ? (
      <ErrorSummary
        errors={summaryErrors}
        attempt={attempt}
        level={3}
        className="mb-8"
      />
    ) : null;
  const stepProps = { state, errors, update, onBlurField, summary };
  const failedAt = result.status === "error" ? result.at : null;
  const busy = pending;

  return (
    <TunnelShell compactIntro={step > 1}>
      <div ref={frame} className="scroll-mt-6">
        <TunnelProgress step={step} />
        {restored ? (
          <div className="t-petit mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-y border-filet py-2 text-encre-douce">
            <p>Nous avons retrouvé vos réponses.</p>
            <button
              type="button"
              className="ui-btn ui-btn--tertiaire t-petit"
              onClick={restart}
            >
              Recommencer
            </button>
          </div>
        ) : null}
        <StepTransition etape={step} sens={sens}>
          <form noValidate onSubmit={onContinue} aria-labelledby="titre-etape">
            {step === 1 ? <StepProperty {...stepProps} /> : null}
            {step === 2 ? <StepFeatures {...stepProps} /> : null}
            {step === 3 ? <StepYou {...stepProps} /> : null}
            {step === 4 ? (
              <>
                <StepReview
                  {...stepProps}
                  onEdit={onEdit}
                  failedAt={failedAt}
                />
                <div
                  aria-hidden="true"
                  className="absolute -left-[10000px] h-px w-px overflow-hidden"
                >
                  <label htmlFor={HONEYPOT_FIELD}>
                    Site web, ne pas remplir
                  </label>
                  <input
                    id={HONEYPOT_FIELD}
                    name={HONEYPOT_FIELD}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    defaultValue=""
                  />
                </div>
              </>
            ) : null}
            <div className="mt-10 flex flex-col gap-2 border-t border-filet pt-6 sm:flex-row-reverse sm:items-center sm:justify-between sm:gap-6">
              <Button
                type="submit"
                fullWidth
                className="sm:w-auto"
                disabled={step === 4 && busy}
                aria-busy={step === 4 && busy ? true : undefined}
              >
                {step === 4
                  ? busy
                    ? "Envoi en cours…"
                    : "Envoyer la demande"
                  : returnToReview && firstIncompleteStep(state) === 4
                    ? "Revenir à la vérification"
                    : "Continuer"}
              </Button>
              {step > 1 ? (
                <Button
                  variant="tertiaire"
                  icon={<ChevronLeft aria-hidden="true" strokeWidth={1.5} />}
                  className="self-start"
                  onClick={() => navigate((step - 1) as EstimationStep, "push")}
                >
                  Retour
                </Button>
              ) : null}
            </div>
          </form>
        </StepTransition>
      </div>
    </TunnelShell>
  );
}
