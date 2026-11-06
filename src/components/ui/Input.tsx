import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Champ de saisie (doc 03 §6.3) : 48 px, fond lait, bordure filet fort,
// texte 16 px (pas de zoom iOS). Survol encre douce ; focus encre doublée
// (2 px visuels, sans halo) ; erreur via aria-invalid ; désactivé crème
// soutenu. À placer dans <Field>, qui pose les attributs d'accessibilité.

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
};

export function Input({ className, type = "text", ...rest }: InputProps) {
  return <input type={type} className={cn("ui-input", className)} {...rest} />;
}
