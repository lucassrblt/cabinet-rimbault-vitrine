// Fin de la page Nos biens : laisser sa recherche à l'agence.
// Le seul moment sombre de la page (test de goût du 2026-10-02).
import { Bouton } from "./Action";

export function SearchRequest() {
  return (
    <section
      data-reveal="monte"
      className="rounded-carte bg-encre px-6 py-10 text-blanc md:grid md:grid-cols-12 md:items-center md:gap-10 md:px-14 md:py-16"
    >
      <div className="md:col-span-5">
        <h2 className="titre text-[1.75rem] leading-tight md:text-section">
          Vous ne trouvez pas votre bien ?
        </h2>
        <p className="mt-3 max-w-[40ch] text-blanc/65">
          Certains biens partent avant d’être publiés. Dites-nous ce que vous
          cherchez, nous vous appelons dès qu’un bien correspond.
        </p>
      </div>
      <form className="mt-8 space-y-3 md:col-span-7 md:mt-0">
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="sr-only">Ce que vous cherchez</span>
            <input
              className="h-12 w-full rounded-full bg-blanc/10 px-5 text-blanc placeholder:text-blanc/45 transition-colors focus:bg-blanc/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-blanc/40"
              placeholder="Ex. 3 pièces avec balcon"
            />
          </label>
          <label>
            <span className="sr-only">Votre téléphone</span>
            <input
              type="tel"
              autoComplete="tel"
              className="h-12 w-full rounded-full bg-blanc/10 px-5 text-blanc placeholder:text-blanc/45 transition-colors focus:bg-blanc/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-blanc/40"
              placeholder="Votre téléphone"
            />
          </label>
        </div>
        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[38ch] text-[0.8125rem] text-blanc/50">
            Votre numéro sert uniquement à vous rappeler pour cette recherche.
          </p>
          <Bouton as="button" clair className="self-start sm:self-auto">
            Être rappelé
          </Bouton>
        </div>
      </form>
    </section>
  );
}
