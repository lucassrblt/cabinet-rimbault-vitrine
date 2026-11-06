import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

// Message d'échec d'un envoi (API indisponible) : même dessin que le résumé
// d'erreurs (filet erreur sur quatre côtés, icône CircleAlert), annoncé par
// `role="alert"`. Apparition sans mouvement (brief §7). La saisie est
// conservée : le message dit quoi faire, et donne le téléphone.

type FormAlertProps = {
  children: React.ReactNode;
  className?: string;
};

export function FormAlert({ children, className }: FormAlertProps) {
  return (
    <div role="alert" className={cn("ui-resume", className)}>
      <p className="ui-resume__titre t-ui">
        <CircleAlert aria-hidden="true" strokeWidth={1.5} />
        <span>{children}</span>
      </p>
    </div>
  );
}
