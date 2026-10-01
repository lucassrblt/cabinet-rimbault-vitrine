// Sections basses de l'accueil, communes aux deux variantes.
// Elles cassent la grille : décalages, photos qui débordent, rythme varié.
import { avis } from "./data";
import { Button, Photo, Section } from "./wf";

export function HomeLowerSections() {
  return (
    <>
      <Section n={4} name="Avis" className="mt-20 md:mt-32">
        <div className="md:grid md:grid-cols-12 md:items-start md:gap-10 md:px-10">
          <div className="px-4 md:col-span-3 md:px-0 md:pt-10">
            <p className="text-[3.5rem] font-semibold leading-none md:text-[5rem]">
              4,9
            </p>
            <p className="mt-2 text-[0.9375rem] text-[#666]">
              sur 5, 32 avis Google
            </p>
            <p className="mt-4 text-[0.9375rem] underline">
              Lire tous les avis
            </p>
          </div>
          <div className="wf-scroll mt-6 bg-[#f0f0f0] px-4 py-8 md:col-span-9 md:mt-0 md:mr-[-2.5rem] md:px-8 md:py-10">
            {avis.map((a) => (
              <figure
                key={a.when}
                className="w-[78%] bg-white p-5 md:w-[22rem]"
              >
                <p className="text-[0.75rem]">★★★★★</p>
                <blockquote className="mt-2 text-[0.9375rem]">
                  {a.text}
                </blockquote>
                <figcaption className="mt-3 text-[0.8125rem] text-[#666]">
                  {a.name}, {a.when}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      <Section n={5} name="La méthode en bref" className="mt-20 md:mt-32">
        <div className="md:grid md:grid-cols-12 md:items-center md:gap-10">
          <div className="px-4 md:col-span-6 md:col-start-2 md:px-0">
            <ul className="space-y-5 text-[1.25rem] font-semibold leading-snug md:text-[1.625rem]">
              <li>Nous refusons les estimations gonflées.</li>
              <li className="md:pl-12">
                Un seul interlocuteur, du premier rendez-vous au notaire.
              </li>
              <li className="md:pl-24">
                Asnières et ses voisines, connues rue par rue.
              </li>
            </ul>
            <p className="mt-6 text-[0.9375rem] underline">
              Notre façon de travailler
            </p>
          </div>
          <Photo
            shot
            label="la vitrine de l’agence vue de près, annonces affichées, reflet de la rue"
            className="mt-8 ml-12 aspect-[3/4] md:col-span-4 md:col-start-9 md:mt-0 md:ml-0"
          />
        </div>
      </Section>

      <Section n={6} name="Nous trouver" className="mt-20 md:mt-32">
        <div className="relative md:grid md:grid-cols-12">
          <Photo
            shot
            label="la devanture de face, de jour, vitrine éclairée, store rouge bien visible"
            className="aspect-[4/3] md:col-span-8 md:col-start-1 md:row-start-1 md:aspect-[16/10]"
          />
          <div className="relative mx-4 -mt-12 bg-white p-5 shadow-[0_0_0_1px_#ddd] md:col-span-4 md:col-start-8 md:row-start-1 md:mx-0 md:mt-0 md:mb-12 md:-ml-10 md:self-end md:p-8">
            <p className="font-semibold">117 boulevard Voltaire</p>
            <p>92600 Asnières-sur-Seine</p>
            <p className="mt-3 text-[0.9375rem] text-[#666]">
              Mardi au vendredi 9 h – 19 h, samedi 9 h – 18 h, lundi sur
              rendez-vous
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button primary>Appeler</Button>
              <Button>Itinéraire</Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
