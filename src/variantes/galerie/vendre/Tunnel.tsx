"use client";

// Tunnel d'estimation de la Galerie : cinq questions, une par écran, puis la
// confirmation. Il réutilise tel quel le tunnel de la refonte côté données :
// état `EstimationState`, validation `validateEstimationStep`, envoi par la
// Server Action `submitEstimation` (anti-spam, revalidation, `postEvaluation`).
// L'échéance, absente du modèle, part dans le champ `message`.
//
// Chaque question est une entrée d'historique (`?question=n`) : le retour du
// navigateur revient à la question précédente. Le focus va au titre de la
// question à chaque changement ; un envoi en cours bloque tout second envoi.

import Link from "next/link";
import {
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { submitEstimation } from "@/app/(galerie)/vendre/estimation/actions";
import { fr } from "@/components/owners/typo";
import { agency } from "@/lib/agency";
import { estimationStateToFormData } from "@/lib/estimation/form-data";
import { placeLabel } from "@/lib/estimation/recap";
import {
  INITIAL_RESULT,
  REFERER_FIELD,
  SENT_AT_FIELD,
} from "@/lib/estimation/result";
import {
  type EstimationErrors,
  type EstimationField,
  type EstimationPropertyType,
  type EstimationState,
  emptyEstimationState,
  formatRooms,
  formatSurface,
  LIMITS,
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPES,
  ROOMS,
  type Rooms,
  validateEstimationStep,
} from "@/lib/forms/estimation-schema";
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/forms/spam";
import { MESSAGES, normalizeEmail } from "@/lib/forms/validators";
import s from "../base.module.css";
import {
  ECHEANCES,
  type Echeance,
  echeanceLabel,
  echeanceMessage,
  VENDRE,
} from "./contenu";
import t from "./tunnel.module.css";

type Question = 1 | 2 | 3 | 4 | 5;
type Field = EstimationField | "echeance";
type Errors = Partial<Record<Field, string>>;

const TOTAL = 5;

const i = (n: number) => ({ "--i": n }) as CSSProperties;

const QUESTIONS: Record<Question, string> = {
  1: "Quel bien souhaitez-vous vendre ?",
  2: "Où se trouve-t-il ?",
  3: "Quelle est sa surface, et combien a-t-il de pièces ?",
  4: "Quand pensez-vous vendre ?",
  5: "Comment vous recontacter ?",
};

/** Champs de chaque question, dans l'ordre de l'écran. */
const FIELDS: Record<Question, readonly Field[]> = {
  1: ["propertyType"],
  2: ["address", "postalCode", "city"],
  3: ["surface", "rooms"],
  4: ["echeance"],
  5: ["firstName", "lastName", "email", "phone", "rgpd"],
};

const ECHEANCE_REQUISE = "Choisissez une échéance, même approximative.";

function questionOf(field: Field): Question {
  for (const q of [1, 2, 3, 4, 5] as const) {
    if (FIELDS[q].includes(field)) return q;
  }
  return 5;
}

/** Erreurs d'une question : la validation du site, ramenée à ses champs. */
function validate(
  q: Question,
  state: EstimationState,
  echeance: Echeance,
): Errors {
  if (q === 4) return echeance === "" ? { echeance: ECHEANCE_REQUISE } : {};
  const all: EstimationErrors = {
    ...validateEstimationStep(1, state),
    ...validateEstimationStep(2, state),
    ...validateEstimationStep(3, state),
    ...validateEstimationStep(4, state),
  };
  const errors: Errors = {};
  for (const field of FIELDS[q]) {
    const message = all[field as EstimationField];
    if (message) errors[field] = message;
  }
  return errors;
}

function firstInvalid(state: EstimationState, echeance: Echeance): Question {
  for (const q of [1, 2, 3, 4] as const) {
    if (Object.keys(validate(q, state, echeance)).length > 0) return q;
  }
  return 5;
}

function questionFromUrl(): Question {
  const n = Number(new URLSearchParams(window.location.search).get("question"));
  return n >= 1 && n <= TOTAL ? (n as Question) : 1;
}

function urlOf(q: Question): string {
  return q === 1 ? window.location.pathname : `?question=${q}`;
}

/** Page d'arrivée interne (chemin seul), sinon la page du tunnel. */
function internalReferrer(): string {
  try {
    if (document.referrer) {
      const url = new URL(document.referrer);
      if (url.origin === window.location.origin) return url.pathname;
    }
  } catch {}
  return window.location.pathname;
}

const fieldId = (field: Field) => `estimer-${field}`;

export function Tunnel() {
  const [q, setQ] = useState<Question>(1);
  const [state, setState] = useState<EstimationState>(() =>
    emptyEstimationState("ESTIMATION_VENTE"),
  );
  const [echeance, setEcheance] = useState<Echeance>("");
  const [errors, setErrors] = useState<Errors>({});
  const [result, dispatch, pending] = useActionState(
    submitEstimation,
    INITIAL_RESULT,
  );
  const [sent, setSent] = useState<EstimationState | null>(null);
  const sending = useRef(false);
  const lastAt = useRef(0);
  const meta = useRef({ startedAt: 0, referer: "" });
  const titre = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const update = (patch: Partial<EstimationState>) => {
    setState((prev) => ({ ...prev, ...patch }));
    // Une erreur corrigée disparaît dès la saisie.
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch)) delete next[key as Field];
      return next;
    });
  };

  // Arrivée : horodatage anti-spam, page d'origine, URL ramenée à la question 1
  // (les réponses ne sont pas conservées d'une visite à l'autre).
  useEffect(() => {
    meta.current = { startedAt: Date.now(), referer: internalReferrer() };
    if (window.location.search)
      window.history.replaceState(null, "", window.location.pathname);
  }, []);

  // Retour et avance du navigateur : jamais au-delà de la première question
  // incomplète.
  useEffect(() => {
    const onPop = () => {
      if (sent) return;
      const wanted = questionFromUrl();
      setQ(Math.min(wanted, firstInvalid(state, echeance)) as Question);
      setErrors({});
      moved.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [state, echeance, sent]);

  // Focus sur le titre de la question affichée (pas au premier affichage).
  // biome-ignore lint/correctness/useExhaustiveDependencies: à chaque changement de question
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    titre.current?.focus();
  }, [q]);

  // Résultat de l'envoi, traité une fois.
  useEffect(() => {
    if (result.status === "idle" || result.at === lastAt.current) return;
    lastAt.current = result.at;
    sending.current = false;
    if (result.status === "success") {
      setSent(state);
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }
    if (result.status === "invalid") {
      const fields = Object.keys(result.errors) as EstimationField[];
      const target = fields.length
        ? (Math.min(...fields.map(questionOf)) as Question)
        : 5;
      setErrors(result.errors);
      if (target !== q) {
        setQ(target);
        window.history.replaceState(null, "", urlOf(target));
        moved.current = true;
      }
    }
  }, [result, state, q]);

  function focusFirstError(found: Errors) {
    const first = FIELDS[q].find((f) => found[f]);
    if (!first) return;
    requestAnimationFrame(() => {
      const el =
        document.getElementById(fieldId(first)) ??
        document.querySelector<HTMLInputElement>(`[name="${first}"]`);
      el?.focus();
    });
  }

  function goTo(next: Question) {
    setErrors({});
    setQ(next);
    moved.current = true;
    window.history.pushState(null, "", urlOf(next));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(q, state, echeance);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      focusFirstError(found);
      return;
    }
    if (q < TOTAL) {
      goTo((q + 1) as Question);
      return;
    }
    if (sending.current || pending) return;
    sending.current = true;
    const data = estimationStateToFormData({
      ...state,
      message: echeanceMessage(echeance),
    });
    const trap = event.currentTarget.elements.namedItem(HONEYPOT_FIELD);
    data.set(
      HONEYPOT_FIELD,
      trap instanceof HTMLInputElement ? trap.value : "",
    );
    data.set(STARTED_AT_FIELD, String(meta.current.startedAt));
    data.set(SENT_AT_FIELD, String(Date.now()));
    data.set(REFERER_FIELD, meta.current.referer);
    startTransition(() => dispatch(data));
  }

  if (sent) return <Confirmation state={sent} />;

  const busy = pending || sending.current;
  const failed = result.status === "error" && !busy;

  const describedBy = (field: Field, extra?: string) =>
    [errors[field] ? `${fieldId(field)}-erreur` : null, extra ?? null]
      .filter(Boolean)
      .join(" ") || undefined;

  const err = (field: Field) =>
    errors[field] ? (
      <p id={`${fieldId(field)}-erreur`} className={t.erreur}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className={`${s.w} ${s.g} ${t.tunnel}`}>
      <aside className={`${s.cartel} ${t.recap}`} aria-label="Votre bien">
        <span className={s.ti}>Votre bien</span>
        <Recap state={state} echeance={echeance} />
      </aside>

      <div className={t.colonne}>
        <h1 className={t.h1}>Faire estimer votre bien</h1>
        <div className={t.progres}>
          <div className={t.traits} aria-hidden>
            {[1, 2, 3, 4, 5].map((n) => (
              <i key={n} data-fait={n <= q || undefined} />
            ))}
          </div>
          <p className={s.num}>
            Question {q}&nbsp;sur&nbsp;{TOTAL}
          </p>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          aria-labelledby="estimer-question"
          className={t.form}
        >
          <h2
            id="estimer-question"
            ref={titre}
            tabIndex={-1}
            className={t.question}
            key={q}
          >
            {fr(QUESTIONS[q])}
          </h2>

          {q === 1 ? (
            <Choix
              name="propertyType"
              options={PROPERTY_TYPES.map((value) => ({
                value,
                label: PROPERTY_TYPE_LABELS[value],
              }))}
              value={state.propertyType}
              onChange={(value) =>
                update({ propertyType: value as EstimationPropertyType })
              }
              error={err("propertyType")}
              describedBy={describedBy("propertyType")}
            />
          ) : null}

          {q === 2 ? (
            <div className={t.champs}>
              <Champ
                field="address"
                label="Adresse"
                optional
                error={err("address")}
              >
                <input
                  id={fieldId("address")}
                  name="address"
                  autoComplete="street-address"
                  maxLength={LIMITS.address}
                  value={state.address}
                  aria-invalid={errors.address ? true : undefined}
                  aria-describedby={describedBy("address")}
                  onChange={(e) => update({ address: e.target.value })}
                />
              </Champ>
              <div className={t.ligne}>
                <Champ
                  field="postalCode"
                  label="Code postal"
                  error={err("postalCode")}
                  className={t.cp}
                >
                  <input
                    id={fieldId("postalCode")}
                    name="postalCode"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    maxLength={5}
                    required
                    aria-required
                    value={state.postalCode}
                    aria-invalid={errors.postalCode ? true : undefined}
                    aria-describedby={describedBy("postalCode")}
                    onChange={(e) => update({ postalCode: e.target.value })}
                  />
                </Champ>
                <Champ
                  field="city"
                  label="Commune"
                  optional
                  error={err("city")}
                >
                  <input
                    id={fieldId("city")}
                    name="city"
                    autoComplete="address-level2"
                    maxLength={LIMITS.city}
                    value={state.city}
                    aria-invalid={errors.city ? true : undefined}
                    aria-describedby={describedBy("city")}
                    onChange={(e) => update({ city: e.target.value })}
                  />
                </Champ>
              </div>
            </div>
          ) : null}

          {q === 3 ? (
            <div className={t.champs}>
              <Champ
                field="surface"
                label="Surface habitable, en m²"
                error={err("surface")}
                className={t.court}
              >
                <input
                  id={fieldId("surface")}
                  name="surface"
                  inputMode="decimal"
                  required
                  aria-required
                  value={state.surface}
                  aria-invalid={errors.surface ? true : undefined}
                  aria-describedby={describedBy("surface")}
                  onChange={(e) => update({ surface: e.target.value })}
                />
              </Champ>
              <fieldset
                className={t.groupe}
                aria-describedby={describedBy("rooms")}
              >
                <legend>Nombre de pièces</legend>
                <div className={t.pastilles}>
                  {ROOMS.map((value) => (
                    <label key={value} className={t.pastille}>
                      <input
                        type="radio"
                        name="rooms"
                        value={value}
                        checked={state.rooms === value}
                        onChange={() => update({ rooms: value as Rooms })}
                        aria-invalid={errors.rooms ? true : undefined}
                      />
                      <span>{value === "5+" ? "5 ou plus" : value}</span>
                    </label>
                  ))}
                </div>
                {err("rooms")}
              </fieldset>
            </div>
          ) : null}

          {q === 4 ? (
            <Choix
              name="echeance"
              options={ECHEANCES}
              value={echeance}
              onChange={(value) => {
                setEcheance(value as Echeance);
                setErrors({});
              }}
              error={err("echeance")}
              describedBy={describedBy("echeance")}
            />
          ) : null}

          {q === 5 ? (
            <div className={t.champs}>
              <div className={t.ligne}>
                <Champ
                  field="firstName"
                  label="Prénom"
                  error={err("firstName")}
                >
                  <input
                    id={fieldId("firstName")}
                    name="firstName"
                    autoComplete="given-name"
                    maxLength={LIMITS.name}
                    required
                    aria-required
                    value={state.firstName}
                    aria-invalid={errors.firstName ? true : undefined}
                    aria-describedby={describedBy("firstName")}
                    onChange={(e) => update({ firstName: e.target.value })}
                  />
                </Champ>
                <Champ field="lastName" label="Nom" error={err("lastName")}>
                  <input
                    id={fieldId("lastName")}
                    name="lastName"
                    autoComplete="family-name"
                    maxLength={LIMITS.name}
                    required
                    aria-required
                    value={state.lastName}
                    aria-invalid={errors.lastName ? true : undefined}
                    aria-describedby={describedBy("lastName")}
                    onChange={(e) => update({ lastName: e.target.value })}
                  />
                </Champ>
              </div>
              <Champ field="email" label="E-mail" error={err("email")}>
                <input
                  id={fieldId("email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required
                  value={state.email}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={describedBy("email")}
                  onChange={(e) => update({ email: e.target.value })}
                />
              </Champ>
              <Champ
                field="phone"
                label="Téléphone"
                optional
                error={err("phone")}
                className={t.court}
              >
                <input
                  id={fieldId("phone")}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={state.phone}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={describedBy("phone")}
                  onChange={(e) => update({ phone: e.target.value })}
                />
              </Champ>
              <div className={t.accord}>
                <label className={t.case}>
                  <input
                    id={fieldId("rgpd")}
                    name="rgpd"
                    type="checkbox"
                    checked={state.rgpd}
                    aria-required
                    aria-invalid={errors.rgpd ? true : undefined}
                    aria-describedby={describedBy(
                      "rgpd",
                      `${fieldId("rgpd")}-precision`,
                    )}
                    onChange={(e) => update({ rgpd: e.target.checked })}
                  />
                  <span>
                    Vous acceptez que le {agency.name} utilise ces informations
                    pour vous recontacter au sujet de cette estimation. Elles ne
                    sont ni cédées ni utilisées à d’autres fins.
                  </span>
                </label>
                {err("rgpd")}
                <p id={`${fieldId("rgpd")}-precision`} className={t.aide}>
                  Vous pouvez les faire rectifier ou supprimer à tout moment
                  {agency.email ? (
                    <>
                      {" "}
                      en écrivant à{" "}
                      <a className={s.u} href={`mailto:${agency.email}`}>
                        {agency.email}
                      </a>
                    </>
                  ) : null}
                  . Le détail est dans notre{" "}
                  <Link className={s.u} href="/confidentialite">
                    politique de confidentialité
                  </Link>
                  .
                </p>
              </div>
              <div aria-hidden="true" className={t.piege}>
                <label htmlFor={HONEYPOT_FIELD}>Site web, ne pas remplir</label>
                <input
                  id={HONEYPOT_FIELD}
                  name={HONEYPOT_FIELD}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </div>
            </div>
          ) : null}

          <div className={t.alerte} role="alert">
            {failed && q === TOTAL ? <p>{MESSAGES.sendFailed}</p> : null}
          </div>

          <div className={t.actions}>
            <button
              type="submit"
              className={`${s.btn} ${t.envoyer}`}
              disabled={q === TOTAL && busy}
              aria-busy={q === TOTAL && busy ? true : undefined}
            >
              {q < TOTAL
                ? "Continuer"
                : busy
                  ? "Envoi en cours…"
                  : "Envoyer ma demande"}
            </button>
            {q > 1 ? (
              <button
                type="button"
                className={`${s.u} ${t.retour}`}
                onClick={() => window.history.back()}
              >
                Question précédente
              </button>
            ) : (
              <Link className={`${s.u} ${t.retour}`} href={VENDRE}>
                Revenir à la page Vendre
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

/** Choix exclusif : boutons radio natifs, l'étiquette entière est cliquable. */
function Choix({
  name,
  options,
  value,
  onChange,
  error,
  describedBy,
}: {
  name: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error: ReactNode;
  describedBy?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby="estimer-question"
      aria-describedby={describedBy}
      className={t.choix}
    >
      {options.map((option, n) => (
        <label key={option.value} className={t.option}>
          <input
            type="radio"
            id={n === 0 ? fieldId(name as Field) : undefined}
            name={name}
            value={option.value}
            checked={value === option.value}
            aria-invalid={error ? true : undefined}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
      {error}
    </div>
  );
}

function Champ({
  field,
  label,
  optional = false,
  error,
  className,
  children,
}: {
  field: Field;
  label: string;
  optional?: boolean;
  error: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${t.champ} ${className ?? ""}`}>
      <label htmlFor={fieldId(field)}>
        {label}
        {optional ? <span className={t.facultatif}> (facultatif)</span> : null}
      </label>
      {children}
      {error}
    </div>
  );
}

/** Le cartel se remplit à mesure des réponses. */
function Recap({
  state,
  echeance,
}: {
  state: EstimationState;
  echeance: Echeance;
}) {
  const lines = [
    state.propertyType ? PROPERTY_TYPE_LABELS[state.propertyType] : "",
    placeLabel(state),
    [formatSurface(state.surface), formatRooms(state.rooms)]
      .filter(Boolean)
      .join(", "),
    echeanceLabel(echeance),
  ].filter((line) => line.trim() !== "");
  if (lines.length === 0)
    return <span>Vos réponses s’inscrivent ici à mesure.</span>;
  return lines.map((line) => <span key={line}>{line}</span>);
}

function Confirmation({ state }: { state: EstimationState }) {
  const titre = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    titre.current?.focus();
  }, []);
  return (
    <div className={`${s.w} ${s.g} ${t.tunnel}`} data-rv>
      <div className={t.colonne}>
        <p className={`${t.h1} ${s.up}`}>Faire estimer votre bien</p>
        <h1
          ref={titre}
          tabIndex={-1}
          className={`${t.question} ${t.merci} ${s.up}`}
        >
          Votre demande est bien arrivée.
        </h1>
        <p className={`${t.chapo} ${s.up}`} style={i(1)}>
          Merci, {state.firstName.trim()}. Un e-mail de confirmation vient de
          vous être envoyé à{" "}
          <span className={t.email}>{normalizeEmail(state.email)}</span>.
        </p>
        <h2 className={`${t.h1} ${t.suite} ${s.up}`}>Ce qui va se passer</h2>
        <ol className={`${t.etapes} ${s.up}`} style={i(2)}>
          <li>Nous vous recontactons pour convenir d’une visite.</li>
          <li>Nous visitons le bien avec vous.</li>
          <li>
            Nous vous donnons notre estimation du prix de vente, et ce sur quoi
            elle repose.
          </li>
        </ol>
        <p className={`${t.liens} ${s.up}`} style={i(3)}>
          <Link className={s.u} href={VENDRE}>
            Revenir à la page Vendre
          </Link>
          <Link className={s.u} href="/biens">
            Voir les biens en vente
          </Link>
        </p>
      </div>
    </div>
  );
}
