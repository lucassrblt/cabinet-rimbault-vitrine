import { Illustration } from "@/components/illustrations/Illustration";
import { streetLine } from "@/components/layout/typo";
import { HomeOpening } from "@/components/motion/HomeOpening";
import { ASNIERES } from "@/components/owners/typo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";

// Ouverture de l'accueil (doc 04 §2.1-1, brief §4, §6.3, A19). Composition
// asymétrique, alignée à gauche, jamais centrée :
// - desktop : texte sur les colonnes 1 à 7 (1 à 6 dès 1280 px, doc 04
//   autorise 6 à 7), ILL-01 sur les colonnes restantes,
//   prolongée jusqu'au bord droit de la fenêtre (l'immeuble, coupé par le
//   cadre du dessin, l'est alors par l'écran) ; le texte et le dessin sont
//   calés sur la même ligne de base (le bas du bouton, le trottoir) ;
// - dessous : texte, puis le dessin, toujours prolongé jusqu'au bord droit.
//   Sous 768 px, le quart gauche du dessin (réserve vide) est retiré pour
//   que les deux façades gardent une taille lisible à 320 px ;
// - la ligne factuelle ferme la section, en phrase, avec des virgules.
// - sous 400 px, h1 en 30/36 : « à Asnières-sur-Seine. » est insécable.
// Le seul bouton grenat du premier écran est « Faire estimer votre bien »
// (celui de l'en-tête est secondaire, A19).
// Mouvement (brief §7, doc 06 §3) : titre, puis suite (+80 ms), puis
// l'illustration (+160 ms), par <HomeOpening> ; ILL-01 est préchargée
// (`priority`), jamais enveloppée dans un fondu au décodage.

type OpeningProps = {
  /** Nombre de biens en ligne ; `null` si l'API ne répond pas. */
  listingCount: number | null;
  /** Note et nombre d'avis Google à afficher (API Places, sinon agency.ts). */
  rating: string;
  reviewCount: number;
};

const integer = new Intl.NumberFormat("fr-FR");

/** Prolonge un élément de la grille jusqu'au bord droit de la fenêtre. */
const BORD_DROIT =
  "mr-[calc(-1*var(--marge)-max(0px,(100vw-var(--container-site)-2*var(--marge))/2))]";

export function Opening({ listingCount, rating, reviewCount }: OpeningProps) {
  const biens =
    listingCount && listingCount > 0
      ? `Voir nos biens (${listingCount})`
      : "Voir nos biens";

  return (
    <HomeOpening
      as="section"
      aria-labelledby="ouverture-titre"
      className="overflow-x-clip pt-16 pb-16 md:pt-32 md:pb-24"
    >
      <Container>
        <Grid className="gap-y-12 md:gap-y-16 lg:items-end">
          <div className="col-span-full lg:col-span-7 xl:col-span-6">
            <h1
              id="ouverture-titre"
              data-ouverture="titre"
              className="t-display max-w-[11em] max-[399px]:text-[30px] max-[399px]:leading-[36px]"
            >
              Vendre, louer,
              <br />
              faire estimer à{"\u00A0"}
              {ASNIERES}.
            </h1>
            <div data-ouverture="suite">
              <p className="t-chapo mesure-chapo mt-6 text-pretty text-encre-douce md:mt-8">
                Un cabinet indépendant, installé à Asnières depuis{" "}
                {agency.since}. La même personne vous suit du premier
                rendez-vous à la signature.
              </p>
              <div className="mt-10 flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-8 md:mt-12">
                <ButtonLink href="/estimation" className="max-sm:w-full">
                  Faire estimer votre bien
                </ButtonLink>
                <ButtonLink
                  href="/biens"
                  variant="tertiaire"
                  className="self-start sm:self-auto"
                >
                  {biens}
                </ButtonLink>
              </div>
            </div>
          </div>

          <div
            data-ouverture="illustration"
            className={`col-span-full flex justify-end lg:col-span-5 lg:col-start-8 xl:col-span-6 xl:col-start-7 ${BORD_DROIT}`}
          >
            {/* Cadre qui retire la part gauche, vide, du dessin (1 520 px de
                large, façade du pavillon à 29 %) : un sixième à partir de
                768 px, un quart en dessous. Dès 1024 px, le dessin descend de
                5,6 % de sa hauteur : la réserve vide sous le trottoir
                (57 px sur 1 014) est rognée par le cadre, et le trottoir se
                pose sur le bas du cadre, donc sur le bas du bouton
                (`lg:items-end`), à toute largeur. */}
            <div className="w-full max-w-[760px] overflow-hidden">
              <Illustration
                name="ILL-01"
                priority
                sizes="(min-width: 1024px) 912px, (min-width: 768px) 120vw, 134vw"
                className="max-md:-ml-[33.333%] max-md:w-[133.333%] max-md:max-w-none md:-ml-[20%] md:w-[120%] md:max-w-none lg:translate-y-[5.6%]"
              />
            </div>
          </div>
        </Grid>

        <p
          data-ouverture="suite"
          className="t-ui mt-10 text-encre-douce md:mt-12"
        >
          <span className="whitespace-nowrap">{streetLine()}</span>,{" "}
          <TextLink
            href={agency.phone.href}
            variant="discret"
            className="chiffres whitespace-nowrap text-encre"
          >
            {agency.phone.display}
          </TextLink>
          , <span className="whitespace-nowrap">avis Google{"\u202F"}:</span>{" "}
          <span className="chiffres whitespace-nowrap">
            {rating}
            {" "}sur 5
          </span>{" "}
          <span className="chiffres whitespace-nowrap">
            ({integer.format(reviewCount)}
            {" "}avis)
          </span>
        </p>
      </Container>
    </HomeOpening>
  );
}
