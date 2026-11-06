"use client";

import { usePathname } from "next/navigation";
import {
  type FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  type ContactResult,
  type ContactSource,
  submitContact,
} from "@/app/(site)/contact/actions";
import { Button } from "@/components/ui/Button";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { ErrorSummary, type SummaryError } from "@/components/ui/ErrorSummary";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import {
  CONTACT_MESSAGE_MAX,
  CONTACT_TOPIC_LABELS,
  CONTACT_TOPICS,
  type ContactErrors,
  type ContactField,
  type ContactState,
  type ContactTopic,
  emptyContactState,
  validateContact,
} from "@/lib/forms/contact-schema";
import { cn } from "@/lib/utils";
import { ConsentField } from "./ConsentField";
import { FormAlert } from "./FormAlert";
import { Honeypot } from "./Honeypot";

// Formulaire de contact (doc 04 §3.8, interface figée §7). Utilisé sur
// /contact et en bas de la fiche bien (lot 2).
//
// - Sur /contact : l'objet est demandé (« Un bien en particulier » ouvre le
//   champ référence). Sur la fiche : `subject` (BIEN_SALE / BIEN_RENT) et
//   `propertyReference` sont imposés, l'objet n'est pas affiché.
// - Validation à la sortie d'un champ déjà rempli, puis à l'envoi ; jamais
//   pendant la frappe (une erreur affichée s'efface dès que la saisie est
//   juste). La Server Action revalide tout ; ses erreurs 400 reviennent sous
//   le bon champ (`fields["contact.email"]`).
// - Compteur de 500 caractères (limite de l'API), sans couper la saisie.
// - Un seul envoi à la fois (double clic) ; échec de l'API : saisie conservée.
// - Confirmation en place, focus sur son titre. Aucun délai annoncé tant que
//   l'agent ne l'a pas validé (brief §10-9).

type ContactFormProps = {
  subject?: "BIEN_SALE" | "BIEN_RENT" | "OTHER";
  propertyReference?: string;
  defaultMessage?: string;
  source: ContactSource;
  /** Objet présélectionné sur /contact (`?objet=`, `?bien=`). */
  initialTopic?: ContactTopic;
  /** Niveau des titres du résumé d'erreurs et de la confirmation. */
  headingLevel?: 2 | 3;
  /** Préfixe des identifiants des champs (un seul formulaire par page). */
  idPrefix?: string;
  className?: string;
};

const INITIAL_RESULT: ContactResult = {
  status: "idle",
  errors: {},
  values: null,
  attempt: 0,
};

/** Ordre des champs dans le formulaire, donc dans le résumé d'erreurs. */
const FIELD_ORDER: ContactField[] = [
  "topic",
  "propertyReference",
  "firstName",
  "lastName",
  "email",
  "phone",
  "message",
  "rgpd",
];

const FIELD_ID: Record<ContactField, string> = {
  subject: "objet",
  topic: "objet",
  propertyReference: "reference",
  firstName: "prenom",
  lastName: "nom",
  email: "email",
  phone: "telephone",
  message: "message",
  rgpd: "accord",
};

const integer = new Intl.NumberFormat("fr-FR");

function hasErrors(errors: ContactErrors) {
  return Object.values(errors).some(Boolean);
}

export function ContactForm({
  subject,
  propertyReference,
  defaultMessage,
  source,
  initialTopic,
  headingLevel = 3,
  idPrefix = "contact",
  className,
}: ContactFormProps) {
  const fixedSubject = subject === "BIEN_SALE" || subject === "BIEN_RENT";
  const requireTopic = !fixedSubject;
  const pathname = usePathname();
  const [result, formAction, pending] = useActionState(
    submitContact,
    INITIAL_RESULT,
  );

  const [values, setValues] = useState<ContactState>(
    () =>
      result.values ?? {
        ...emptyContactState(
          fixedSubject ? subject : "OTHER",
          propertyReference ?? "",
        ),
        topic: fixedSubject ? "" : (initialTopic ?? ""),
        message: defaultMessage ?? "",
      },
  );
  const [errors, setErrors] = useState<ContactErrors>(result.errors);
  const [showSummary, setShowSummary] = useState(result.status === "invalid");
  const [summaryAttempt, setSummaryAttempt] = useState(0);
  const [referer, setReferer] = useState("");
  const submitting = useRef(false);
  // Appui sur « Envoyer » : la sortie du champ en cours ne valide pas, sinon
  // le message d'erreur inséré décale le bouton sous le pointeur et le clic
  // se perd. L'envoi valide tout de toute façon.
  const pressedSubmitAt = useRef(0);

  // Nouvelle réponse de la Server Action : ses erreurs remplacent les nôtres
  // (ajustement pendant le rendu, sans effet).
  const [seenAttempt, setSeenAttempt] = useState(result.attempt);
  if (result.attempt !== seenAttempt) {
    setSeenAttempt(result.attempt);
    setErrors(result.errors);
    if (result.status === "invalid") {
      setShowSummary(true);
      setSummaryAttempt((n) => n + 1);
    }
  }

  useEffect(() => {
    // Une réponse est arrivée : un nouvel envoi redevient possible.
    if (result.attempt > 0) submitting.current = false;
  }, [result]);

  useEffect(() => {
    setReferer(document.referrer);
  }, []);

  const id = (field: ContactField) => `${idPrefix}-${FIELD_ID[field]}`;

  function errorsFor(next: ContactState) {
    return validateContact(next, { requireTopic });
  }

  function update<K extends ContactField>(field: K, value: ContactState[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Une erreur affichée s'efface dès que la saisie devient juste ; aucune
    // nouvelle erreur n'apparaît pendant la frappe.
    if (errors[field]) {
      const message = errorsFor(next)[field];
      setErrors((current) => ({ ...current, [field]: message }));
    }
    // Choix d'un objet ou case cochée : la réponse est complète, on valide.
    if (field === "topic" || field === "rgpd") {
      const message = errorsFor(next)[field];
      setErrors((current) => ({ ...current, [field]: message }));
    }
  }

  function validateOnBlur(field: ContactField) {
    if (Date.now() - pressedSubmitAt.current < 1000) return;
    const raw = values[field];
    const filled = typeof raw === "string" ? raw.trim() !== "" : Boolean(raw);
    if (!filled && !errors[field]) return;
    const message = errorsFor(values)[field];
    setErrors((current) => ({ ...current, [field]: message }));
  }

  // Avec JavaScript, l'envoi passe par l'appel direct de l'action : React
  // ne remet alors pas le formulaire à zéro (il décocherait la case RGPD dans
  // le DOM, état contrôlé resté coché). Sans JavaScript, `action` suffit.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || pending) return;
    const next = errorsFor(values);
    if (hasErrors(next)) {
      setErrors(next);
      setShowSummary(true);
      setSummaryAttempt((n) => n + 1);
      return;
    }
    submitting.current = true;
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  if (result.status === "success") {
    return <ContactConfirmation level={headingLevel} className={className} />;
  }

  const summary: SummaryError[] = FIELD_ORDER.flatMap((field) => {
    const message = errors[field];
    return message ? [{ fieldId: id(field), message }] : [];
  });

  const length = values.message.length;
  const over = length - CONTACT_MESSAGE_MAX;

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      className={cn("contact-form relative", className)}
      aria-busy={pending || undefined}
    >
      {showSummary ? (
        <ErrorSummary
          errors={summary}
          attempt={summaryAttempt}
          level={headingLevel}
          className="mb-8"
        />
      ) : null}

      <p className="t-petit text-gris">
        Tous les champs sont obligatoires, sauf ceux marqués{" "}
        <span className="whitespace-nowrap">{"« facultatif »"}</span>.
      </p>

      <div className="mt-6 flex flex-col gap-6">
        <input type="hidden" name="subject" value={values.subject} />
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="page" value={pathname ?? ""} />
        <input type="hidden" name="referer" value={referer} />
        <Honeypot />

        {requireTopic ? (
          <>
            <ChoiceGroup
              id={id("topic")}
              legend="Objet de votre message"
              name="topic"
              options={CONTACT_TOPICS.map((topic) => ({
                value: topic,
                label: CONTACT_TOPIC_LABELS[topic],
              }))}
              value={values.topic}
              onChange={(event) =>
                update("topic", event.currentTarget.value as ContactTopic)
              }
              error={errors.topic}
            />
            {/* Affiché seulement pour « Un bien en particulier » : par l'état
                React, et par la CSS (:has) quand JavaScript manque. */}
            <Field
              id={id("propertyReference")}
              label="Référence du bien"
              optional
              hint="Elle figure sur l’annonce, par exemple 10.131."
              error={errors.propertyReference}
              className={cn(
                "contact-form__reference",
                values.topic === "bien" && "contact-form__reference--ouverte",
              )}
            >
              <Input
                name="propertyReference"
                autoComplete="off"
                spellCheck={false}
                className="max-w-[240px] chiffres"
                value={values.propertyReference}
                onChange={(event) =>
                  update("propertyReference", event.currentTarget.value)
                }
                onBlur={() => validateOnBlur("propertyReference")}
              />
            </Field>
          </>
        ) : (
          <input
            type="hidden"
            name="propertyReference"
            value={values.propertyReference}
          />
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id={id("firstName")} label="Prénom" error={errors.firstName}>
            <Input
              name="firstName"
              autoComplete="given-name"
              value={values.firstName}
              onChange={(event) =>
                update("firstName", event.currentTarget.value)
              }
              onBlur={() => validateOnBlur("firstName")}
            />
          </Field>
          <Field id={id("lastName")} label="Nom" error={errors.lastName}>
            <Input
              name="lastName"
              autoComplete="family-name"
              value={values.lastName}
              onChange={(event) =>
                update("lastName", event.currentTarget.value)
              }
              onBlur={() => validateOnBlur("lastName")}
            />
          </Field>
        </div>

        <Field id={id("email")} label="Adresse e-mail" error={errors.email}>
          <Input
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            value={values.email}
            onChange={(event) => update("email", event.currentTarget.value)}
            onBlur={() => validateOnBlur("email")}
          />
        </Field>

        <Field
          id={id("phone")}
          label="Téléphone"
          optional
          hint="Si vous préférez que nous vous rappelions."
          error={errors.phone}
        >
          <Input
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            className="chiffres"
            value={values.phone}
            onChange={(event) => update("phone", event.currentTarget.value)}
            onBlur={() => validateOnBlur("phone")}
          />
        </Field>

        <Field
          id={id("message")}
          label="Votre message"
          error={errors.message}
          hint={
            <MessageCounter
              length={length}
              over={over}
              fieldError={Boolean(errors.message)}
            />
          }
        >
          <Textarea
            name="message"
            rows={7}
            value={values.message}
            onChange={(event) => update("message", event.currentTarget.value)}
            onBlur={() => validateOnBlur("message")}
          />
        </Field>

        <ConsentField
          id={id("rgpd")}
          checked={values.rgpd}
          onChange={(checked) => update("rgpd", checked)}
          error={errors.rgpd}
        />
      </div>

      {result.status === "failed" ? (
        <FormAlert className="mt-8">
          Votre message n’a pas pu être envoyé. Ce que vous avez écrit est
          conservé{" "}: réessayez dans un instant, ou appelez-nous au{" "}
          <span className="whitespace-nowrap">{agency.phone.display}</span>.
        </FormAlert>
      ) : null}

      <div className="mt-8">
        <Button
          type="submit"
          variant="principal"
          aria-disabled={pending}
          onPointerDown={() => {
            pressedSubmitAt.current = Date.now();
          }}
        >
          {pending ? "Envoi en cours…" : "Envoyer le message"}
        </Button>
      </div>
    </form>
  );
}

/**
 * Compteur visible, et annonce discrète près de la limite seulement.
 * La forme rouge (« 12 caractères de trop ») ne sert qu'avant l'erreur du
 * champ : une fois l'erreur affichée, le compteur repasse au neutre
 * (« 512 sur 500 caractères. ») pour ne pas enchaîner deux messages rouges.
 */
function MessageCounter({
  length,
  over,
  fieldError,
}: {
  length: number;
  over: number;
  fieldError: boolean;
}) {
  const alert = over > 0 && !fieldError;
  const remaining = -over;
  const liveId = useId();
  let announce = "";
  if (over > 0)
    announce = `${integer.format(over)} caractère${over > 1 ? "s" : ""} de trop.`;
  else if (remaining <= 50)
    announce = `Il reste ${integer.format(remaining)} caractère${remaining > 1 ? "s" : ""}.`;
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "chiffres",
          alert ? "font-medium text-erreur" : "text-gris",
        )}
      >
        {alert
          ? `${integer.format(over)} caractère${over > 1 ? "s" : ""} de trop, ${integer.format(CONTACT_MESSAGE_MAX)} au plus.`
          : `${integer.format(length)} sur ${integer.format(CONTACT_MESSAGE_MAX)} caractères.`}
      </span>
      <span id={liveId} className="sr-only" aria-live="polite">
        {announce}
      </span>
      <span className="sr-only">
        {`Message limité à ${integer.format(CONTACT_MESSAGE_MAX)}\u00A0caractères.`}
      </span>
    </>
  );
}

function ContactConfirmation({
  level,
  className,
}: {
  level: 2 | 3;
  className?: string;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  const Title = `h${level}` as const;

  useEffect(() => {
    title.current?.focus();
  }, []);

  return (
    <div className={cn("border-filet border-t pt-8", className)}>
      <Title ref={title} tabIndex={-1} className="t-h3 text-balance">
        Votre message est bien arrivé.
      </Title>
      <p className="t-texte mesure mt-4">
        Nous vous répondons par e-mail, ou par téléphone si vous nous avez
        laissé votre numéro. Pour une question pressante, appelez-nous au{" "}
        <TextLink
          href={agency.phone.href}
          className="chiffres whitespace-nowrap"
        >
          {agency.phone.display}
        </TextLink>
        .
      </p>
    </div>
  );
}
