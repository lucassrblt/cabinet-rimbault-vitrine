"use client";

// Tunnel d'estimation de la Galerie : six questions, une par écran, puis la
// confirmation (audit du site en ligne, §2.4). Côté données, il réutilise le
// tunnel de la refonte : état `EstimationState`, validation
// `validateEstimationStep`, envoi par la Server Action `submitEstimation`
// (anti-spam, revalidation, `postEvaluation`). L'échéance, hors de l'état,
// part à part et finit dans la colonne `timeframe` de l'API.
//
// Repris du tunnel de main : une phrase d'aide sous chaque question, la saisie
// automatique de l'adresse, la question de l'état du bien, le mot libre, le
// brouillon de session (24 h, « Recommencer ») et l'avance au clic sur les
// questions à choix unique (à la souris seulement : au clavier, les flèches
// ne font que changer le choix, Entrée passe à la suite).
// Gardé de la Galerie : chaque question est une entrée d'historique
// (`?question=n`), le focus va au titre de la question, un envoi en cours
// bloque tout second envoi, et aucun prix n'est promis sans visite.

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
import {
  ECHEANCE_FIELD,
  ECHEANCES,
  type Echeance,
  echeanceLabel,
} from "@/lib/estimation/echeance";
import {
  estimationStateToFormData,
  hasAnswers,
} from "@/lib/estimation/form-data";
import { placeLabel } from "@/lib/estimation/recap";
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
  type Condition,
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
import { Adresse } from "./Adresse";
import { ETATS, etatLabel, VENDRE } from "./contenu";
import t from "./tunnel.module.css";

type Question = 1 | 2 | 3 | 4 | 5 | 6;
type Field = EstimationField | "echeance";
type Errors = Partial<Record<Field, string>>;

const TOTAL = 6;
const NUMEROS = [1, 2, 3, 4, 5, 6] as const;

/** Pause entre le clic sur un choix et la question suivante : le choix se voit. */
const AVANCE_MS = 280;

const i = (n: number) => ({ "--i": n }) as CSSProperties;

const QUESTIONS: Record<Question, string> = {
  1: "Quel bien souhaitez-vous vendre ?",
  2: "Où se trouve-t-il ?",
  3: "Quelle est sa surface, et combien a-t-il de pièces ?",
  4: "Dans quel état est-il ?",
  5: "Quand pensez-vous vendre ?",
  6: "Comment vous recontacter ?",
};

/** Phrase d'aide sous chaque question (tunnel de main, au ton de la Galerie). */
const AIDES: Record<Question, string> = {
  1: "Cela oriente notre comparaison avec les biens vendus près de chez vous.",
  2: "Nous nous appuyons sur les ventes récentes de la même rue ou du même secteur. L'adresse exacte reste confidentielle.",
  3: "La surface et le nombre de pièces sont les principaux facteurs de prix. Une surface approximative suffit.",
  4: "Votre impression suffit : nous le verrons ensemble.",
  5: "Aucun engagement à cette étape.",
  6: "Nous vous rappelons pour convenir d'une visite.",
};

/** Champs de chaque question, dans l'ordre de l'écran. */
const FIELDS: Record<Question, readonly Field[]> = {
  1: ["propertyType"],
  2: ["address", "postalCode", "city"],
  3: ["surface", "rooms"],
  4: ["condition"],
  5: ["echeance"],
  6: ["firstName", "lastName", "email", "phone", "message", "rgpd"],
};

const ETAT_REQUIS = "Choisissez l’état qui s’en approche le plus.";
const ECHEANCE_REQUISE = "Choisissez une échéance, même approximative.";

function questionOf(field: Field): Question {
  for (const q of NUMEROS) {
    if (FIELDS[q].includes(field)) return q;
  }
  return 6;
}

/** Erreurs d'une question : la validation du site, ramenée à ses champs. */
function validate(
  q: Question,
  state: EstimationState,
  echeance: Echeance,
): Errors {
  if (q === 4) return state.condition === "" ? { condition: ETAT_REQUIS } : {};
  if (q === 5) return echeance === "" ? { echeance: ECHEANCE_REQUISE } : {};
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
  for (const q of [1, 2, 3, 4, 5] as const) {
    if (Object.keys(validate(q, state, echeance)).length > 0) return q;
  }
  return 6;
}

function asQuestion(n: number): Question {
  return n >= 1 && n <= TOTAL ? (n as Question) : 1;
}

function questionFromUrl(): Question {
  return asQuestion(
    Number(new URLSearchParams(window.location.search).get("question")),
  );
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

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const fieldId = (field: Field) => `estimer-${field}`;

export function Tunnel() {
  const [q, setQ] = useState<Question>(1);
  const [state, setState] = useState<EstimationState>(() =>
    emptyEstimationState("ESTIMATION_VENTE"),
  );
  const [echeance, setEcheance] = useState<Echeance>("");
  const [errors, setErrors] = useState<Errors>({});
  const [repris, setRepris] = useState(false);
  const [result, dispatch, pending] = useActionState(
    submitEstimation,
    INITIAL_RESULT,
  );
  const [sent, setSent] = useState<EstimationState | null>(null);
  // Garde synchrone contre le double clic (ref) et état d'envoi affiché
  // (state) : remettre la ref à zéro dans un effet ne redessine rien, et le
  // bouton restait « Envoi en cours… » après un échec de l'API.
  const sending = useRef(false);
  const [enCours, setEnCours] = useState(false);
  const lastAt = useRef(0);
  const meta = useRef({ startedAt: 0, referer: "" });
  const pret = useRef(false);
  const haut = useRef<HTMLDivElement>(null);
  const titre = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const avance = useRef<number | undefined>(undefined);
  const qActuelle = useRef<Question>(1);
  qActuelle.current = q;

  const update = (patch: Partial<EstimationState>) => {
    setState((prev) => ({ ...prev, ...patch }));
    // Une erreur corrigée disparaît dès la saisie.
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch)) delete next[key as Field];
      return next;
    });
  };

  // Arrivée : brouillon de la session s'il y en a un (reprise à la question
  // où l'on s'était arrêté, jamais au-delà de la première incomplète), sinon
  // question 1. Horodatage anti-spam et page d'origine.
  useEffect(() => {
    const saved = loadEstimation();
    if (saved && (hasAnswers(saved.state) || saved.echeance !== "")) {
      // L'accord se redonne à chaque visite.
      const restored = { ...saved.state, rgpd: false };
      const target = Math.min(
        asQuestion(saved.question),
        firstInvalid(restored, saved.echeance),
      ) as Question;
      meta.current = {
        startedAt: saved.startedAt,
        referer: saved.referer || internalReferrer(),
      };
      setState(restored);
      setEcheance(saved.echeance);
      setQ(target);
      setRepris(true);
      window.history.replaceState(null, "", urlOf(target));
    } else {
      meta.current = { startedAt: Date.now(), referer: internalReferrer() };
      if (window.location.search)
        window.history.replaceState(null, "", window.location.pathname);
    }
    pret.current = true;
    return () => window.clearTimeout(avance.current);
  }, []);

  // Brouillon : chaque réponse est gardée dans la session (24 h au plus).
  useEffect(() => {
    if (!pret.current || sent) return;
    if (!hasAnswers(state) && echeance === "") return;
    saveEstimation({
      state: { ...state, rgpd: false },
      echeance,
      question: q,
      startedAt: meta.current.startedAt,
      referer: meta.current.referer,
    });
  }, [state, echeance, q, sent]);

  // Retour et avance du navigateur : jamais au-delà de la première question
  // incomplète.
  useEffect(() => {
    const onPop = () => {
      if (sent) return;
      window.clearTimeout(avance.current);
      const wanted = questionFromUrl();
      setQ(Math.min(wanted, firstInvalid(state, echeance)) as Question);
      setErrors({});
      moved.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [state, echeance, sent]);

  // À chaque question : la colonne remonte en haut de l'écran si la question
  // n'y est plus (mobile), puis le focus va au titre (pas au premier affichage).
  // biome-ignore lint/correctness/useExhaustiveDependencies: à chaque changement de question
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    const top = haut.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.4)
      haut.current?.scrollIntoView({
        block: "start",
        behavior: reducedMotion() ? "auto" : "smooth",
      });
    titre.current?.focus({ preventScroll: true });
  }, [q]);

  // Résultat de l'envoi, traité une fois.
  useEffect(() => {
    if (result.status === "idle" || result.at === lastAt.current) return;
    lastAt.current = result.at;
    sending.current = false;
    setEnCours(false);
    if (result.status === "success") {
      clearEstimation();
      setSent(state);
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }
    if (result.status === "invalid") {
      const fields = Object.keys(result.errors) as EstimationField[];
      const target = fields.length
        ? (Math.min(...fields.map(questionOf)) as Question)
        : 6;
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
    window.clearTimeout(avance.current);
    setErrors({});
    setRepris(false);
    setQ(next);
    moved.current = true;
    window.history.pushState(null, "", urlOf(next));
  }

  /** Choix fait à la souris ou au doigt : la question suivante, après une pause. */
  function avancer(depuis: Question) {
    window.clearTimeout(avance.current);
    avance.current = window.setTimeout(() => {
      if (qActuelle.current === depuis) goTo((depuis + 1) as Question);
    }, AVANCE_MS);
  }

  function recommencer() {
    window.clearTimeout(avance.current);
    clearEstimation();
    setState(emptyEstimationState("ESTIMATION_VENTE"));
    setEcheance("");
    setErrors({});
    setRepris(false);
    meta.current = { ...meta.current, startedAt: Date.now() };
    setQ(1);
    moved.current = true;
    window.history.replaceState(null, "", window.location.pathname);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.clearTimeout(avance.current);
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
    setEnCours(true);
    const data = estimationStateToFormData(state);
    data.set(ECHEANCE_FIELD, echeance);
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

  const busy = pending || enCours;
  const failed = result.status === "error" && !busy;
  const commence = hasAnswers(state) || echeance !== "";

  const describedBy = (field: Field, ...extra: string[]) =>
    [errors[field] ? `${fieldId(field)}-erreur` : null, ...extra]
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
        {q === 1 && !repris ? (
          <p className={t.intro}>
            {fr(
              "Six questions, deux minutes. Nous vous rappelons pour convenir d'une visite : un prix sérieux demande de voir le bien. Sans engagement.",
            )}
          </p>
        ) : null}
        <div className={t.progres} ref={haut}>
          <div className={t.traits} aria-hidden>
            {NUMEROS.map((n) => (
              <i key={n} data-fait={n <= q || undefined} />
            ))}
          </div>
          <div className={t.etat}>
            <p className={s.num}>
              Question {q}&nbsp;sur&nbsp;{TOTAL}
            </p>
            {commence ? (
              <button
                type="button"
                className={`${s.u} ${t.recommencer}`}
                onClick={recommencer}
              >
                Recommencer
              </button>
            ) : null}
          </div>
          <output className={t.repris}>
            {repris
              ? "Nous avons repris vos réponses là où vous les aviez laissées."
              : ""}
          </output>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          aria-labelledby="estimer-question"
          aria-describedby="estimer-aide"
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
          <p id="estimer-aide" className={t.consigne} key={`aide-${q}`}>
            {fr(AIDES[q])}
          </p>

          {q === 1 ? (
            <>
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
                onPick={() => avancer(1)}
                error={err("propertyType")}
                describedBy={describedBy("propertyType")}
              />
              <p className={t.autre}>
                Un terrain, un local, un immeuble&#8239;? Appelez-nous au{" "}
                <a
                  className={`${s.u} ${s.num}`}
                  href={agency.phone.href}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {agency.phone.display}
                </a>
                .
              </p>
            </>
          ) : null}

          {q === 2 ? (
            <div className={t.champs}>
              <Champ
                field="address"
                label="Adresse"
                optional
                error={err("address")}
              >
                <Adresse
                  id={fieldId("address")}
                  value={state.address}
                  maxLength={LIMITS.address}
                  invalid={Boolean(errors.address)}
                  describedBy={describedBy(
                    "address",
                    `${fieldId("address")}-aide`,
                  )}
                  onChange={(address) => update({ address })}
                  onPick={(picked) => update(picked)}
                />
                <p id={`${fieldId("address")}-aide`} className={t.note}>
                  Le numéro et la rue&#8239;; des adresses vous sont proposées
                  au fil de la saisie.
                </p>
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
              name="condition"
              options={ETATS}
              value={state.condition}
              onChange={(value) => update({ condition: value as Condition })}
              onPick={() => avancer(4)}
              error={err("condition")}
              describedBy={describedBy("condition")}
            />
          ) : null}

          {q === 5 ? (
            <Choix
              name="echeance"
              options={ECHEANCES}
              value={echeance}
              onChange={(value) => {
                setEcheance(value as Echeance);
                setErrors({});
              }}
              onPick={() => avancer(5)}
              error={err("echeance")}
              describedBy={describedBy("echeance")}
            />
          ) : null}

          {q === 6 ? (
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
                  aria-describedby={describedBy(
                    "phone",
                    `${fieldId("phone")}-aide`,
                  )}
                  onChange={(e) => update({ phone: e.target.value })}
                />
                <p id={`${fieldId("phone")}-aide`} className={t.note}>
                  Le plus simple pour convenir d’une visite.
                </p>
              </Champ>
              <Champ
                field="message"
                label="Un mot à ajouter ?"
                optional
                error={err("message")}
              >
                <textarea
                  id={fieldId("message")}
                  name="message"
                  rows={3}
                  maxLength={LIMITS.message}
                  value={state.message}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={describedBy(
                    "message",
                    `${fieldId("message")}-aide`,
                  )}
                  onChange={(e) => update({ message: e.target.value })}
                />
                <p id={`${fieldId("message")}-aide`} className={t.note}>
                  Travaux récents, copropriété, particularités…
                </p>
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

/**
 * Choix exclusif : boutons radio natifs, l'étiquette entière est cliquable.
 * Un choix fait au pointeur (souris, doigt) appelle `onPick`, même s'il était
 * déjà coché ; au clavier, les flèches et Espace ne font que choisir.
 */
function Choix({
  name,
  options,
  value,
  onChange,
  onPick,
  error,
  describedBy,
}: {
  name: string;
  options: readonly { value: string; label: string; aide?: string }[];
  value: string;
  onChange: (value: string) => void;
  onPick: () => void;
  error: ReactNode;
  describedBy?: string;
}) {
  // Heure du dernier appui au pointeur : un appui sans clic (défilement au
  // doigt) ne doit pas faire avancer un choix fait ensuite au clavier.
  const pointeur = useRef(0);
  return (
    <div
      role="radiogroup"
      aria-labelledby="estimer-question"
      aria-describedby={describedBy}
      className={t.choix}
    >
      {options.map((option, n) => (
        // biome-ignore lint/a11y/useKeyWithClickEvents: au clavier, le choix ne fait pas avancer (Entrée envoie l'écran)
        <label
          key={option.value}
          className={t.option}
          onPointerDown={() => {
            pointeur.current = Date.now();
          }}
          onClick={() => {
            // Un clic sur l'étiquette en déclenche un second sur le radio :
            // seul le premier compte.
            if (Date.now() - pointeur.current > 1500) return;
            pointeur.current = 0;
            onChange(option.value);
            onPick();
          }}
        >
          <input
            type="radio"
            id={n === 0 ? fieldId(name as Field) : undefined}
            name={name}
            value={option.value}
            checked={value === option.value}
            aria-invalid={error ? true : undefined}
            onChange={() => onChange(option.value)}
          />
          <span className={t.libelle}>
            {option.label}
            {option.aide ? (
              <span className={t.precision}>{option.aide}</span>
            ) : null}
          </span>
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
        {fr(label)}
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
    state.address.trim(),
    placeLabel(state),
    [formatSurface(state.surface), formatRooms(state.rooms)]
      .filter(Boolean)
      .join(", "),
    etatLabel(state.condition),
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
        <p className={`${t.chapo} ${t.repli} ${s.up}`} style={i(3)}>
          Une question d’ici là&#8239;? Appelez-nous au{" "}
          <a
            className={`${s.u} ${s.num}`}
            href={agency.phone.href}
            style={{ whiteSpace: "nowrap" }}
          >
            {agency.phone.display}
          </a>
          .
        </p>
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
