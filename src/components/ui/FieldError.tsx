import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

// Message d'erreur sous un champ (doc 03 §6.3) : icône CircleAlert 16 px et
// texte qui dit quoi faire. Apparition sans mouvement (brief §7).

type FieldErrorProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function FieldError({ id, children, className }: FieldErrorProps) {
  return (
    <p id={id} className={cn("ui-erreur", className)}>
      <CircleAlert aria-hidden="true" strokeWidth={1.5} />
      <span>{children}</span>
    </p>
  );
}
