import { FieldError } from "@/components/ui/FormField";

/**
 * En-tête d'une étape du tunnel : titre + description optionnelle.
 */
export function StepHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-7 flex flex-col gap-2.5 sm:mb-8">
      <h2 className="font-display text-2xl font-semibold leading-[1.15] tracking-tight text-primary sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-[15px] leading-[1.6] text-body">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Erreur de niveau étape (après une grille de choix). Réutilise `FieldError`
 * avec une marge supérieure adaptée à un bloc plutôt qu'à un champ isolé.
 */
export function StepError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mt-3">
      <FieldError message={message} />
    </div>
  );
}
