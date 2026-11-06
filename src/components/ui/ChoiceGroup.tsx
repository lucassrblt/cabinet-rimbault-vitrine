import { Check } from "lucide-react";
import { type ChangeEvent, useId } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";

// Choix en rangées (doc 03 §6.3, brief A18) : radios ou cases dans des
// options de 56 px au moins, fond lait, bordure filet fort, toute la rangée
// cliquable. Option cochée : bordure grenat doublée et point grenat de 10 px
// dans un rond de 18 px (radio), ou case grenat cochée (checkbox).
// Une colonne, ou deux à partir de 600 px (`columns={2}`), séparées de 24 px
// comme les champs (C-P7). Pas de tuile à icône. L'état coché est rendu en
// CSS (:has), sans JavaScript.

export type ChoiceOption = {
  value: string;
  label: string;
  /** Précision sous le libellé, 14 px gris. */
  detail?: string;
  disabled?: boolean;
};

type ChoiceGroupProps = {
  legend: React.ReactNode;
  legendClassName?: string;
  name: string;
  options: ChoiceOption[];
  type?: "radio" | "checkbox";
  columns?: 1 | 2;
  /** Contrôlé : valeur (radio) ou valeurs (checkbox). */
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  hint?: React.ReactNode;
  error?: string | null;
  /** Identifiant du premier contrôle, cible des liens du résumé d'erreurs. */
  id?: string;
  className?: string;
};

function includes(selection: string | string[] | undefined, value: string) {
  if (selection === undefined) return undefined;
  return Array.isArray(selection)
    ? selection.includes(value)
    : selection === value;
}

export function ChoiceGroup({
  legend,
  legendClassName,
  name,
  options,
  type = "radio",
  columns = 1,
  value,
  defaultValue,
  onChange,
  hint,
  error,
  id,
  className,
}: ChoiceGroupProps) {
  const generated = useId();
  const baseId = id ?? `choix-${generated}`;
  const hintId = hint ? `${baseId}-aide` : undefined;
  const errorId = error ? `${baseId}-erreur` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset
      className={cn("ui-fieldset", className)}
      aria-describedby={describedBy}
    >
      <legend className={cn("ui-legend ui-label", legendClassName)}>
        {legend}
      </legend>
      {hint ? (
        <p id={hintId} className="ui-aide -mt-1.5 mb-3">
          {hint}
        </p>
      ) : null}
      <div
        className={cn("ui-choix", columns === 2 && "ui-choix--2")}
        data-invalide={error ? "" : undefined}
      >
        {options.map((option, index) => {
          const inputId = index === 0 ? baseId : `${baseId}-${index}`;
          return (
            <label key={option.value} className="ui-option" htmlFor={inputId}>
              <input
                id={inputId}
                type={type}
                name={name}
                value={option.value}
                disabled={option.disabled}
                checked={includes(value, option.value)}
                defaultChecked={
                  value === undefined
                    ? includes(defaultValue, option.value)
                    : undefined
                }
                onChange={onChange}
                aria-invalid={error ? true : undefined}
              />
              {type === "radio" ? (
                <span className="ui-rond" aria-hidden="true" />
              ) : (
                <span className="ui-case" aria-hidden="true">
                  <Check strokeWidth={2} />
                </span>
              )}
              <span className="ui-option__texte">
                <span>{option.label}</span>
                {option.detail ? (
                  <span className="ui-option__detail">{option.detail}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error && errorId ? (
        <FieldError id={errorId} className="mt-2">
          {error}
        </FieldError>
      ) : null}
    </fieldset>
  );
}
