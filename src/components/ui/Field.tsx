import { cloneElement, isValidElement, type ReactElement, useId } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";

// Champ complet (doc 03 §6.3) : libellé Hanken 500 15 px au-dessus, contrôle,
// message d'erreur, puis aide en 14 px gris. Le placeholder ne remplace jamais
// le libellé. Tous les champs sont obligatoires par défaut : un champ
// facultatif porte « (facultatif) » dans son libellé, sans astérisque.
//
// `children` est soit le contrôle (Input, Textarea, Select), auquel Field
// ajoute id, aria-describedby, aria-invalid et aria-required ; soit une
// fonction qui reçoit ces attributs.

export type FieldControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
};

type FieldProps = {
  label: string;
  /** Identifiant du contrôle (sinon généré). Cible des liens du résumé. */
  id?: string;
  hint?: React.ReactNode;
  error?: string | null;
  optional?: boolean;
  className?: string;
  children:
    | ReactElement<Partial<FieldControlProps>>
    | ((control: FieldControlProps) => React.ReactNode);
};

export function Field({
  label,
  id,
  hint,
  error,
  optional = false,
  className,
  children,
}: FieldProps) {
  const generated = useId();
  const controlId = id ?? `champ-${generated}`;
  const hintId = hint ? `${controlId}-aide` : undefined;
  const errorId = error ? `${controlId}-erreur` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const control: FieldControlProps = {
    id: controlId,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
    "aria-required": optional ? undefined : true,
  };

  return (
    <div className={cn("ui-field", className)}>
      <label htmlFor={controlId} className="ui-label">
        {label}
        {optional ? (
          <span className="ui-label__facultatif"> (facultatif)</span>
        ) : null}
      </label>
      {typeof children === "function"
        ? children(control)
        : isValidElement(children)
          ? cloneElement(children, control)
          : children}
      {error && errorId ? <FieldError id={errorId}>{error}</FieldError> : null}
      {hint ? (
        <p id={hintId} className="ui-aide">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
