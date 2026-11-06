import { cn } from "@/lib/utils";

// Question dépliable (FAQ de Vendre et Louer), sur details/summary natifs :
// fonctionne sans JavaScript, contenu trouvable par la recherche du
// navigateur. Question en Spectral 500 (échelle h3) dans un vrai titre pour
// la hiérarchie ; signe + / − dessiné en CSS ; filet sous chaque question.

type DisclosureProps = {
  summary: string;
  /** Niveau du titre de la question dans la page. */
  level?: 2 | 3 | 4;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Disclosure({
  summary,
  level = 3,
  defaultOpen,
  className,
  children,
}: DisclosureProps) {
  const Title = `h${level}` as const;
  return (
    <details className={cn("ui-disclosure", className)} open={defaultOpen}>
      <summary>
        <Title className="ui-disclosure__titre t-h3">{summary}</Title>
        <span className="ui-disclosure__signe" aria-hidden="true" />
      </summary>
      <div className="ui-disclosure__contenu">{children}</div>
    </details>
  );
}
