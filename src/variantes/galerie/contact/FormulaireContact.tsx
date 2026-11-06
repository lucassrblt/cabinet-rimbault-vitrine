"use client";

// Formulaire de contact de la Galerie : le comportement de `ContactForm`
// (/contact), dessiné en lignes fines comme un registre.
// - Validation à la sortie d'un champ déjà rempli, puis à l'envoi ; jamais
//   pendant la frappe (une erreur affichée s'efface dès que la saisie est juste).
// - La Server Action revalide tout ; ses erreurs reviennent sous le bon champ.
// - Un seul envoi à la fois ; échec de l'API : saisie conservée, téléphone donné.
// - Confirmation en place, focus sur son titre. Aucun délai de réponse annoncé.
// - Sans JavaScript : envoi par `action`, champ référence ouvert par la CSS (:has).
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type FormEvent,
  type ReactNode,
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  envoyerContact,
  type ResultatContact,
} from "@/app/(galerie)/contact/actions";
import { Honeypot } from "@/components/forms/Honeypot";
import { agency } from "@/lib/agency";
import { CONTACT_MESSAGE_MAX } from "@/lib/forms/contact-schema";
import s from "../base.module.css";
import f from "./contact.module.css";
import {
  type Champ,
  type Erreurs,
  OBJET_LABELS,
  OBJETS,
  type Objet,
  type Saisie,
  saisieVide,
  valider,
} from "./sujets";

/** Bien cité depuis une fiche (`?ref=`), réduit à ce que le cartel affiche. */
export type BienCite = {
  reference: string;
  referenceLabel: string;
  title: string;
  place: string;
  priceLabel: string;
  href: string;
  image: { src: string; alt: string } | null;
};

const INITIAL: ResultatContact = {
  status: "idle",
  errors: {},
  values: null,
  attempt: 0,
};

/** Ordre des champs, donc du résumé d'erreurs. */
const ORDRE: Champ[] = [
  "objet",
  "propertyReference",
  "firstName",
  "lastName",
  "email",
  "phone",
  "message",
  "rgpd",
];

const ID: Record<Champ, string> = {
  objet: "contact-objet",
  propertyReference: "contact-reference",
  firstName: "contact-prenom",
  lastName: "contact-nom",
  email: "contact-email",
  phone: "contact-telephone",
  message: "contact-message",
  rgpd: "contact-accord",
};

const entier = new Intl.NumberFormat("fr-FR");

export function FormulaireContact({
  objet,
  reference,
  message,
  bien,
}: {
  objet?: Objet;
  reference?: string;
  message?: string;
  bien: BienCite | null;
}) {
  const pathname = usePathname();
  const [result, formAction, pending] = useActionState(envoyerContact, INITIAL);
  const [values, setValues] = useState<Saisie>(
    () =>
      result.values ?? {
        ...saisieVide(objet ?? "", reference ?? ""),
        message: message ?? "",
      },
  );
  const [errors, setErrors] = useState<Erreurs>(result.errors);
  const [summary, setSummary] = useState(result.status === "invalid");
  const [summaryAttempt, setSummaryAttempt] = useState(0);
  const [referer, setReferer] = useState("");
  const submitting = useRef(false);
  // Appui sur « Envoyer » : la sortie du champ en cours ne valide pas (le
  // message inséré décalerait le bouton sous le pointeur).
  const pressedAt = useRef(0);

  // Nouvelle réponse de la Server Action : ses erreurs remplacent les nôtres.
  const [seen, setSeen] = useState(result.attempt);
  if (result.attempt !== seen) {
    setSeen(result.attempt);
    setErrors(result.errors);
    if (result.status === "invalid") {
      setSummary(true);
      setSummaryAttempt((n) => n + 1);
    }
  }

  useEffect(() => {
    if (result.attempt > 0) submitting.current = false;
  }, [result]);

  useEffect(() => {
    setReferer(document.referrer);
  }, []);

  function update<K extends Champ>(field: K, value: Saisie[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Choix d'un objet ou case cochée : la réponse est complète, on valide.
    if (errors[field] || field === "objet" || field === "rgpd") {
      const message = valider(next)[field];
      setErrors((current) => ({ ...current, [field]: message }));
    }
  }

  function onBlur(field: Champ) {
    if (Date.now() - pressedAt.current < 1000) return;
    const raw = values[field];
    const filled = typeof raw === "string" ? raw.trim() !== "" : Boolean(raw);
    if (!filled && !errors[field]) return;
    const message = valider(values)[field];
    setErrors((current) => ({ ...current, [field]: message }));
  }

  // Avec JavaScript, l'envoi passe par l'appel direct de l'action : React ne
  // remet pas le formulaire à zéro (la case cochée resterait décochée).
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || pending) return;
    const next = valider(values);
    if (Object.values(next).some(Boolean)) {
      setErrors(next);
      setSummary(true);
      setSummaryAttempt((n) => n + 1);
      return;
    }
    submitting.current = true;
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  if (result.status === "success") return <Confirmation />;

  const liste = ORDRE.flatMap((field) => {
    const message = errors[field];
    return message ? [{ id: ID[field], message }] : [];
  });
  const citeBien =
    bien &&
    values.objet === "bien" &&
    values.propertyReference === bien.reference
      ? bien
      : null;

  const champ = (field: Champ) => ({
    id: ID[field],
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": describedBy(field, errors),
    onBlur: () => onBlur(field),
  });

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      className={f.form}
      aria-busy={pending || undefined}
      aria-labelledby="ecrire"
    >
      <h2 id="ecrire" className={f.titreForm}>
        Nous écrire
      </h2>

      {summary && liste.length > 0 ? (
        <Resume erreurs={liste} attempt={summaryAttempt} />
      ) : null}

      {citeBien ? <Cite bien={citeBien} /> : null}

      <p className={f.oblig}>
        Tous les champs sont obligatoires, sauf ceux marqués{" "}
        <span className={f.nowrap}>« facultatif »</span>.
      </p>

      <input type="hidden" name="page" value={pathname ?? ""} />
      <input type="hidden" name="referer" value={referer} />
      <Honeypot />

      <fieldset
        className={f.objets}
        id={ID.objet}
        tabIndex={-1}
        aria-invalid={errors.objet ? true : undefined}
        aria-describedby={errors.objet ? `${ID.objet}-erreur` : undefined}
      >
        <legend>Objet de votre message</legend>
        <div className={f.pastilles}>
          {OBJETS.map((o) => (
            <label key={o} className={f.pastille}>
              <input
                type="radio"
                name="objet"
                value={o}
                checked={values.objet === o}
                onChange={() => update("objet", o)}
              />
              <span>{OBJET_LABELS[o]}</span>
            </label>
          ))}
        </div>
        <Erreur id={`${ID.objet}-erreur`} message={errors.objet} />
        {values.objet === "vente" ? (
          <p className={f.aide}>
            Vous souhaitez faire estimer un bien ? La page{" "}
            <Link className={s.u} href="/vendre">
              Vendre
            </Link>{" "}
            est plus adaptée.
          </p>
        ) : null}
      </fieldset>

      <div className={f.lignes}>
        {/* Affiché pour « Un bien en particulier » : par l'état React, et
            par la CSS (:has) quand JavaScript manque. */}
        <Ligne
          field="propertyReference"
          label="Référence du bien"
          optional
          hint="Elle figure sur l’annonce, par exemple 10.131."
          errors={errors}
          className={`${f.reference} ${values.objet === "bien" ? f.ouverte : ""}`}
        >
          <input
            {...champ("propertyReference")}
            className={`${f.champ} ${f.court} ${s.num}`}
            name="propertyReference"
            autoComplete="off"
            spellCheck={false}
            value={values.propertyReference}
            onChange={(e) => update("propertyReference", e.currentTarget.value)}
          />
        </Ligne>

        <div className={f.deux}>
          <Ligne field="firstName" label="Prénom" errors={errors}>
            <input
              {...champ("firstName")}
              className={f.champ}
              name="firstName"
              autoComplete="given-name"
              value={values.firstName}
              onChange={(e) => update("firstName", e.currentTarget.value)}
            />
          </Ligne>
          <Ligne field="lastName" label="Nom" errors={errors}>
            <input
              {...champ("lastName")}
              className={f.champ}
              name="lastName"
              autoComplete="family-name"
              value={values.lastName}
              onChange={(e) => update("lastName", e.currentTarget.value)}
            />
          </Ligne>
        </div>

        <Ligne field="email" label="Adresse e-mail" errors={errors}>
          <input
            {...champ("email")}
            className={f.champ}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            value={values.email}
            onChange={(e) => update("email", e.currentTarget.value)}
          />
        </Ligne>

        <Ligne
          field="phone"
          label="Téléphone"
          optional
          hint="Si vous préférez que nous vous rappelions."
          errors={errors}
        >
          <input
            {...champ("phone")}
            className={`${f.champ} ${s.num}`}
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.currentTarget.value)}
          />
        </Ligne>

        <Ligne
          field="message"
          label="Votre message"
          hint={
            <Compteur
              length={values.message.length}
              fieldError={Boolean(errors.message)}
            />
          }
          errors={errors}
        >
          <textarea
            {...champ("message")}
            className={`${f.champ} ${f.zone}`}
            name="message"
            rows={6}
            value={values.message}
            onChange={(e) => update("message", e.currentTarget.value)}
          />
        </Ligne>
      </div>

      <div className={f.accord}>
        <input
          {...champ("rgpd")}
          type="checkbox"
          name="rgpd"
          value="on"
          aria-required
          checked={values.rgpd}
          onChange={(e) => update("rgpd", e.currentTarget.checked)}
        />
        <label htmlFor={ID.rgpd}>
          Vous acceptez que le {agency.name} utilise ces informations pour
          répondre à votre message. Elles ne sont ni cédées ni utilisées à
          d’autres fins (voir notre{" "}
          <Link className={s.u} href="/confidentialite">
            politique de confidentialité
          </Link>
          ).
        </label>
        <Erreur id={`${ID.rgpd}-erreur`} message={errors.rgpd} />
      </div>

      {result.status === "failed" ? (
        <div role="alert" className={f.alerte}>
          Votre message n’a pas pu être envoyé. Ce que vous avez écrit est
          conservé : réessayez dans un instant, ou appelez-nous au{" "}
          <a className={`${s.u} ${s.num} ${f.nowrap}`} href={agency.phone.href}>
            {agency.phone.display}
          </a>
          .
        </div>
      ) : null}

      <div>
        <button
          type="submit"
          className={`${s.btn} ${f.envoyer}`}
          aria-disabled={pending}
          onPointerDown={() => {
            pressedAt.current = Date.now();
          }}
        >
          {pending ? "Envoi en cours…" : "Envoyer le message"}
        </button>
      </div>
    </form>
  );
}

/** Champs accompagnés d'une aide (référence, téléphone, compteur). */
const AVEC_AIDE: ReadonlySet<Champ> = new Set([
  "propertyReference",
  "phone",
  "message",
]);

function describedBy(field: Champ, errors: Erreurs): string | undefined {
  const ids = [
    AVEC_AIDE.has(field) ? `${ID[field]}-aide` : null,
    errors[field] ? `${ID[field]}-erreur` : null,
  ].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

function Ligne({
  field,
  label,
  optional = false,
  hint,
  errors,
  className,
  children,
}: {
  field: Champ;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  errors: Erreurs;
  className?: string;
  children: ReactNode;
}) {
  const aide = hint ? (
    <span id={`${ID[field]}-aide`} className={f.aide}>
      {hint}
    </span>
  ) : null;
  return (
    <div
      className={`${f.ligne} ${className ?? ""}`}
      data-erreur={errors[field] ? "" : undefined}
    >
      <label htmlFor={ID[field]} className={f.label}>
        {label}
        {optional ? <span className={f.facultatif}> facultatif</span> : null}
      </label>
      {/* Une aide écrite se lit avant la saisie ; le compteur suit le champ. */}
      {typeof hint === "string" ? aide : null}
      {children}
      {hint && typeof hint !== "string" ? aide : null}
      <Erreur id={`${ID[field]}-erreur`} message={errors[field]} />
    </div>
  );
}

function Erreur({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} className={f.erreur}>
      {message}
    </span>
  );
}

/** Résumé des erreurs : prend le focus à chaque envoi refusé. */
function Resume({
  erreurs,
  attempt,
}: {
  erreurs: { id: string; message: string }[];
  attempt: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();
  const count = erreurs.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: le focus est repris à chaque tentative refusée.
  useEffect(() => {
    ref.current?.focus();
  }, [attempt]);

  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={f.resume}
    >
      <h3 id={titleId}>
        {count === 1
          ? "Une information à corriger."
          : `${count} informations à corriger.`}
      </h3>
      <ul>
        {erreurs.map((e) => (
          <li key={e.id}>
            <a className={s.u} href={`#${e.id}`}>
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Compteur visible ; annonce discrète près de la limite seulement. */
function Compteur({
  length,
  fieldError,
}: {
  length: number;
  fieldError: boolean;
}) {
  const over = length - CONTACT_MESSAGE_MAX;
  const remaining = -over;
  const alert = over > 0 && !fieldError;
  const pluriel = (n: number) => (n > 1 ? "s" : "");
  let announce = "";
  if (over > 0)
    announce = `${entier.format(over)} caractère${pluriel(over)} de trop.`;
  else if (remaining <= 50)
    announce = `Il reste ${entier.format(remaining)} caractère${pluriel(remaining)}.`;
  return (
    <>
      <span aria-hidden="true" className={`${s.num} ${alert ? f.trop : ""}`}>
        {alert
          ? `${entier.format(over)} caractère${pluriel(over)} de trop, ${entier.format(CONTACT_MESSAGE_MAX)} au plus.`
          : `${entier.format(length)} sur ${entier.format(CONTACT_MESSAGE_MAX)} caractères.`}
      </span>
      <span className={s.sr} aria-live="polite">
        {announce}
      </span>
      <span className={s.sr}>
        {`Message limité à ${entier.format(CONTACT_MESSAGE_MAX)} caractères.`}
      </span>
    </>
  );
}

/** Le bien cité depuis sa fiche : petite photo et cartel. */
function Cite({ bien }: { bien: BienCite }) {
  return (
    <div className={f.cite}>
      {bien.image ? (
        <div className={`${s.ph} ${f.citePhoto}`}>
          <Image src={bien.image.src} alt={bien.image.alt} fill sizes="96px" />
        </div>
      ) : null}
      <div className={`${s.cartel} ${s.num} ${f.citeCartel}`}>
        <span>Votre message concerne</span>
        <span className={s.ref}>{bien.referenceLabel}</span>
        <Link className={s.ti} href={bien.href}>
          {bien.title}
        </Link>
        {bien.place ? <span>{bien.place}</span> : null}
        {bien.priceLabel ? (
          <span className={f.citePrix}>{bien.priceLabel}</span>
        ) : null}
      </div>
    </div>
  );
}

function Confirmation() {
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    title.current?.focus();
  }, []);

  return (
    <div className={f.merci}>
      <p className={f.titreForm}>Nous écrire</p>
      <h2 ref={title} tabIndex={-1}>
        Votre message est bien arrivé.
      </h2>
      <p>
        Nous vous répondons par e-mail, ou par téléphone si vous nous avez
        laissé votre numéro. Pour une question pressante, appelez-nous au{" "}
        <a className={`${s.u} ${s.num} ${f.nowrap}`} href={agency.phone.href}>
          {agency.phone.display}
        </a>
        .
      </p>
    </div>
  );
}
