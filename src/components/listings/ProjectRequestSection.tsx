import type { ProjectRequestMode } from "@/components/forms/ProjectRequestForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ProjectRequestCta } from "./ProjectRequestCta";

interface Props {
  mode: ProjectRequestMode;
  prefill?: {
    commune?: string;
    propertyType?: string;
    budgetMax?: string;
    piecesMin?: string;
  };
}

export function ProjectRequestSection({ mode, prefill }: Props) {
  const isSale = mode === "sale";
  return (
    <section className="border-t border-subtle bg-section">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <ScrollReveal>
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.4fr_1fr] md:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
                Recherche personnalisée
              </p>
              <h2 className="mt-3 font-serif text-2xl font-medium leading-tight text-primary md:text-3xl">
                <span className="italic">
                  Vous ne trouvez pas exactement ce que vous cherchez&nbsp;?
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-body md:text-base">
                {isSale
                  ? "Confiez-moi votre projet d'acquisition. Je vous reviens sous 48 h ouvrées avec une sélection ciblée, y compris des biens off-market que je ne diffuse pas en ligne."
                  : "Confiez-moi votre projet locatif. Je vous propose en priorité les biens conformes à votre dossier, dès leur mise en ligne — et avant la diffusion publique pour les meilleurs."}
              </p>
            </div>
            <div className="md:justify-self-end">
              <div className="rounded-sm border border-default bg-card p-6 shadow-sm">
                <ul className="mb-5 flex flex-col gap-2.5 text-sm text-body">
                  <li className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600"
                    />
                    Réponse personnalisée sous 48 h ouvrées
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600"
                    />
                    {isSale
                      ? "Accès aux biens off-market"
                      : "Priorité sur les biens conformes à votre dossier"}
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600"
                    />
                    Aucun engagement, aucune diffusion à des tiers
                  </li>
                </ul>
                <ProjectRequestCta mode={mode} prefill={prefill} />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
