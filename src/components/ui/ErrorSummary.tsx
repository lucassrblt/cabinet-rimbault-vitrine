"use client";

import { CircleAlert } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

// Résumé des erreurs en tête de formulaire ou d'étape (doc 04 §3.5) : un lien
// par champ en erreur, qui place le focus dans le champ. Le résumé prend le
// focus à son apparition et à chaque nouvel envoi refusé (`attempt`).
// Apparition sans mouvement (brief §7).

export type SummaryError = {
  /** id du contrôle concerné (celui passé à <Field id>). */
  fieldId: string;
  message: string;
};

type ErrorSummaryProps = {
  errors: SummaryError[];
  title?: string;
  /** Change à chaque tentative d'envoi refusée, pour reprendre le focus. */
  attempt?: number;
  /** Niveau du titre du résumé, pour une hiérarchie continue. */
  level?: 2 | 3;
  className?: string;
};

// Titre court, sans verbe : il tient sur une ligne dès 320 px. Le nombre est
// lié au nom par une espace insécable (U+00A0).
function defaultTitle(count: number) {
  return count === 1
    ? "Une information à corriger."
    : `${count}\u00A0informations à corriger.`;
}

export function ErrorSummary({
  errors,
  title,
  attempt = 0,
  level = 2,
  className,
}: ErrorSummaryProps) {
  const ref = useRef<HTMLElement>(null);
  const titleId = useId();
  const Title = `h${level}` as const;
  const count = errors.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: le focus est repris à chaque tentative refusée.
  useEffect(() => {
    if (count > 0) ref.current?.focus();
  }, [count, attempt]);

  if (count === 0) return null;

  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-labelledby={titleId}
      className={cn("ui-resume", className)}
    >
      <Title id={titleId} className="ui-resume__titre t-ui font-medium">
        <CircleAlert aria-hidden="true" strokeWidth={1.5} />
        <span>{title ?? defaultTitle(count)}</span>
      </Title>
      <ul className="mt-2 space-y-1">
        {errors.map((error) => (
          <li key={error.fieldId} className="t-ui">
            <a
              href={`#${error.fieldId}`}
              className="ui-lien text-erreur decoration-erreur/45 hover:decoration-erreur"
              onClick={(event) => {
                const target = document.getElementById(error.fieldId);
                if (!target) return;
                event.preventDefault();
                target.scrollIntoView({ block: "center" });
                target.focus({ preventScroll: true });
              }}
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
