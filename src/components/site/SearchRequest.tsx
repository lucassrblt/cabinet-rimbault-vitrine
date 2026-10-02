// Fin de la page Nos biens : laisser sa recherche à l'agence.
// Quatre versions à comparer via `?fin=` sur /maquettes/biens.
import Image from "next/image";
import { agency } from "@/lib/agency";
import { CallButton } from "./CallButton";
import { OpeningNote } from "./OpeningNote";

const RGPD =
  "Vos coordonnées servent uniquement à vous rappeler pour cette recherche.";

/** Champ « à compléter » posé dans une phrase, souligné comme sur papier. */
function Blank({
  label,
  placeholder,
  width,
  type = "text",
  tight,
}: {
  label: string;
  placeholder: string;
  width: string;
  type?: string;
  /** Suivi d'une ponctuation : pas de marge à droite. */
  tight?: boolean;
}) {
  return (
    <label className="inline-block align-baseline">
      <span className="sr-only">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className={`titre ${tight ? "ml-1" : "mx-1"} border-0 border-b-2 border-encre/70 bg-transparent px-1 pb-0.5 text-rouge placeholder:text-encre/35 focus:border-rouge focus:outline-none`}
        style={{ width }}
      />
    </label>
  );
}

/** A. La phrase à compléter : la recherche s'écrit comme on la dirait à l'agent. */
export function FinPhrase() {
  return (
    <section
      data-reveal="monte"
      className="border-y border-encre py-12 md:py-16"
    >
      <h2 className="text-mention text-gris">
        Votre bien n’est pas dans la liste ?
      </h2>
      <form className="mt-6">
        <p className="titre max-w-[30ch] text-[1.625rem] leading-[1.7] md:max-w-none md:text-[2.25rem] md:leading-[1.6]">
          Je cherche
          <Blank label="Type de bien" placeholder="un 3 pièces" width="6.4em" />
          à
          <Blank
            label="Ville ou quartier"
            placeholder="Asnières"
            width="5em"
            tight
          />
          , pour
          <Blank label="Budget maximum" placeholder="400 000 €" width="5.6em" />
          au plus. Rappelez‑moi au
          <Blank
            label="Votre téléphone"
            placeholder="06 …"
            width="6em"
            type="tel"
            tight
          />
          .
        </p>
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <span className="bouton bouton-principal self-start">
            Envoyer ma recherche
          </span>
          <p className="max-w-[46ch] text-mention text-gris">
            Certains biens partent avant d’être publiés : nous vous appelons dès
            qu’un bien correspond. {RGPD}
          </p>
        </div>
      </form>
    </section>
  );
}

/** B. Le prochain bien : un emplacement vide, au rythme de la liste. */
export function FinProchain() {
  return (
    <section
      data-reveal="monte"
      className="md:grid md:grid-cols-12 md:items-center md:gap-10"
    >
      <div className="relative -mx-4 flex aspect-[4/3] items-center justify-center overflow-hidden bg-pierre md:col-span-7 md:mx-0 md:aspect-[3/2] md:rounded-photo">
        <div
          className="absolute inset-4 rounded-[4px] border-2 border-dashed border-encre/20 md:inset-6"
          aria-hidden
        />
        <p className="titre relative px-8 text-center text-[1.75rem] leading-tight text-encre/50 md:text-[2.5rem]">
          Le prochain bien
          <br />
          est peut-être le vôtre.
        </p>
      </div>
      <div className="mt-6 md:col-span-5 md:mt-0">
        <h2 className="titre text-[1.625rem] leading-tight md:text-section">
          Il n’est pas encore en ligne
        </h2>
        <p className="mt-3 text-gris">
          Certains biens partent avant d’être publiés. Dites-nous ce que vous
          cherchez, nous vous appelons en premier.
        </p>
        <form className="mt-6 space-y-3">
          <input className="champ" placeholder="Ex. 3 pièces avec balcon" />
          <input className="champ" placeholder="Votre téléphone" type="tel" />
          <p className="text-[0.75rem] text-gris">{RGPD}</p>
          <span className="bouton bouton-principal">
            Être rappelé en premier
          </span>
        </form>
      </div>
    </section>
  );
}

const CHOIX = {
  Pièces: ["Studio", "2 pièces", "3 pièces", "4 et plus"],
  Budget: [
    "Moins de 250 000 €",
    "250 à 400 000 €",
    "400 à 600 000 €",
    "Plus de 600 000 €",
  ],
};

/** C. Les critères : des cases à cocher en forme de plaque, sans rien taper. */
export function FinCriteres() {
  return (
    <section
      data-reveal="monte"
      className="rounded-carte bg-pierre p-6 md:p-12"
    >
      <div className="md:grid md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <h2 className="titre text-[1.625rem] leading-tight md:text-section">
            Laissez-nous votre recherche
          </h2>
          <p className="mt-3 text-gris">
            Trois choix et un numéro. Nous vous appelons dès qu’un bien
            correspond, souvent avant sa mise en ligne.
          </p>
        </div>
        <form className="mt-8 space-y-7 md:col-span-8 md:mt-0">
          {Object.entries(CHOIX).map(([groupe, options]) => (
            <fieldset key={groupe}>
              <legend className="text-mention text-gris">{groupe}</legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {options.map((o) => (
                  <label
                    key={o}
                    className="cursor-pointer rounded-plaque bg-blanc px-4 py-2.5 text-[0.9375rem] shadow-[inset_0_0_0_1px_var(--color-filet)] transition-colors hover:shadow-[inset_0_0_0_1px_var(--color-encre)] has-checked:bg-rouge has-checked:text-blanc has-checked:shadow-[inset_0_0_0_3px_var(--color-rouge),inset_0_0_0_4px_rgb(255_255_255/0.3)]"
                  >
                    <input
                      type="radio"
                      name={groupe}
                      value={o}
                      className="sr-only"
                    />
                    {o}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <label className="flex-1">
              <span className="sr-only">Votre téléphone</span>
              <input
                className="champ"
                placeholder="Votre téléphone"
                type="tel"
              />
            </label>
            <span className="bouton bouton-principal">Être rappelé</span>
          </div>
          <p className="text-[0.75rem] text-gris">{RGPD}</p>
        </form>
      </div>
    </section>
  );
}

/** D. La vitrine : la devanture, le statut en direct, et deux façons de venir à nous. */
export function FinVitrine() {
  return (
    <section
      data-reveal="monte"
      className="md:grid md:grid-cols-12 md:items-stretch md:gap-0"
    >
      <div className="relative -mx-4 aspect-[4/3] overflow-hidden bg-pierre md:col-span-5 md:mx-0 md:aspect-auto md:rounded-l-photo">
        <Image
          src="/maquettes/devanture-provisoire.jpg"
          alt="La vitrine de l’agence, boulevard Voltaire"
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="border-filet py-8 md:col-span-7 md:rounded-r-carte md:border md:border-l-0 md:p-12">
        <h2 className="titre text-[1.625rem] leading-tight md:text-section">
          Tous nos biens ne sont pas en vitrine.
        </h2>
        <p className="mt-3 max-w-[48ch] text-gris">
          Certains partent avant d’être publiés. Passez au{" "}
          {agency.address.street}, appelez-nous, ou laissez votre recherche :
          nous vous rappelons.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <CallButton label="Parler de votre recherche" />
          <a href={agency.mapsDirections} className="lien text-[0.9375rem]">
            Venir à l’agence
          </a>
        </div>
        <OpeningNote className="mt-3" />
        <form className="mt-8 border-t border-filet pt-6">
          <p className="text-mention text-gris">Ou par écrit</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input className="champ" placeholder="Ce que vous cherchez" />
            <input
              className="champ sm:max-w-[13rem]"
              placeholder="Votre téléphone"
              type="tel"
            />
            <span className="bouton bouton-secondaire">Envoyer</span>
          </div>
          <p className="mt-2 text-[0.75rem] text-gris">{RGPD}</p>
        </form>
      </div>
    </section>
  );
}
