import { ContactTrigger } from "@/components/contact/ContactTrigger";
import { LinkButton } from "@/components/ui/Button";

/**
 * État vide des pages listing, en deux variantes :
 * - `filtered` : des filtres sont actifs et aucun bien ne matche → inviter à
 *   élargir la recherche ou à créer une alerte.
 * - `empty` : aucun filtre, le portefeuille est réellement vide → message
 *   assumé (sélection restreinte) + capture du lead (alerte, estimation).
 */
export function ListingEmptyState({
  mode,
  filtered,
  basePath,
}: {
  mode: "sale" | "rent";
  filtered: boolean;
  basePath: string;
}) {
  const contactSubject = mode === "rent" ? "location" : "vente";

  if (filtered) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-sm border border-subtle bg-card p-6">
        <p className="text-base font-medium text-primary">
          Aucun bien ne correspond à vos critères.
        </p>
        <div className="flex flex-wrap gap-3">
          <LinkButton href={basePath} variant="secondary" size="sm">
            Réinitialiser les filtres
          </LinkButton>
          <ContactTrigger subject={contactSubject} variant="primary" size="sm">
            Être alerté des nouveaux biens
          </ContactTrigger>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-4 rounded-sm border border-subtle bg-card p-6 md:p-8">
      <div>
        <p className="text-base font-medium text-primary">
          {mode === "rent"
            ? "Aucun bien en location pour le moment."
            : "Aucun bien en vente pour le moment."}
        </p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-body">
          Notre portefeuille est volontairement restreint et évolue chaque
          semaine. Laissez-nous vos critères&nbsp;: nous vous prévenons en
          priorité dès qu'un bien correspond.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <ContactTrigger subject={contactSubject} variant="primary" size="sm">
          Être alerté des nouveaux biens
        </ContactTrigger>
        <LinkButton href="/estimation" variant="secondary" size="sm">
          {mode === "rent"
            ? "Propriétaire ? Confiez-nous votre bien"
            : "Vous vendez ? Estimation gratuite"}
        </LinkButton>
      </div>
    </div>
  );
}
