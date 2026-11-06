import { Check } from "lucide-react";
import { type InputHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";

// Case à cocher isolée (consentement RGPD du tunnel et du contact, doc 03
// §6.3) : jamais précochée, case de 18 px sur une cible de 44 px, libellé en
// 15 px qui peut contenir un lien (politique de confidentialité).

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  children: React.ReactNode;
  error?: string | null;
  ref?: React.Ref<HTMLInputElement>;
};

export function Checkbox({
  id,
  children,
  error,
  className,
  ...rest
}: CheckboxProps) {
  const generated = useId();
  const inputId = id ?? `case-${generated}`;
  const errorId = error ? `${inputId}-erreur` : undefined;
  return (
    <div className={cn("ui-field", className)}>
      <label className="ui-checkbox" htmlFor={inputId}>
        <input
          id={inputId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...rest}
        />
        <span className="ui-case" aria-hidden="true">
          <Check strokeWidth={2} />
        </span>
        <span className="min-w-0">{children}</span>
      </label>
      {error && errorId ? (
        <FieldError id={errorId} className="pl-[30px]">
          {error}
        </FieldError>
      ) : null}
    </div>
  );
}
