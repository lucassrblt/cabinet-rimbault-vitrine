import Image from "next/image";
import { ImageFade } from "@/components/motion/ImageFade";

// Illustrations du cabinet (lot C, doc 05 §3). Une seule encre #251C19 sur fond
// transparent : la crème vient de la page. Sources : PNG 2× à palette dans
// public/illustrations/ (scripts/illustrations/finals.py) ; next/image les sert
// en WebP aux bonnes largeurs.
//
// - Décoratives : alt="" et aria-hidden. Seule ILL-03 (la devanture réelle)
//   porte une information, donc un texte alternatif.
// - `priority` : illustration d'ouverture qui est l'élément LCP : ILL-01
//   (accueil), ILL-05 (Louer), ILL-09 (Vendre), et ILL-08 sur la 404.
//   Préchargée (`preload`, qui remplace `priority` en Next 16) et JAMAIS
//   enveloppée dans <ImageFade> : le LCP n'attend aucune animation. L'entrée
//   d'ILL-01 est jouée par <HomeOpening> ; les autres s'affichent d'emblée.
// - Sinon : fondu d'opacité au décodage par <ImageFade> (Iniesta, brief §7),
//   et rien d'autre. Le cadre n'a jamais de fond : un dessin détouré n'a pas de
//   bord, une réserve crème soutenu n'y apparaîtrait que pour s'effacer (elle
//   est réservée aux photos, dont le cadre opaque reste). Sans JavaScript, image
//   en cache ou mouvement réduit : pas de fondu.
// - ILL-04 (même maison qu'ILL-01, A27) et ILL-07 (carte, en attente des
//   communes) n'existent pas ici : on ne peut pas les appeler.

const ILLUSTRATIONS = {
  "ILL-01": {
    // Accueil, ouverture : colonnes 7 à 12, pleine largeur sous 768 px.
    src: "/illustrations/ill-01.png",
    width: 760,
    maxW: "max-w-[760px]",
    height: 507,
    sizes: "(min-width: 1024px) 760px, (min-width: 768px) 50vw, 100vw",
    alt: "",
  },
  "ILL-02": {
    // Balcon en fer forgé. Réserve depuis le lot C (Vendre reçoit ILL-09).
    src: "/illustrations/ill-02.png",
    width: 280,
    maxW: "max-w-[280px]",
    height: 350,
    sizes: "280px",
    alt: "",
  },
  "ILL-03": {
    // Devanture du cabinet : Accueil, Le cabinet, Contact.
    src: "/illustrations/ill-03.png",
    width: 360,
    maxW: "max-w-[360px]",
    height: 480,
    sizes: "360px",
    alt: "Dessin de la devanture du Cabinet Rimbault, 117 boulevard Voltaire, à Asnières-sur-Seine.",
  },
  "ILL-05": {
    // Louer, en-tête (PageIntro) : colonnes 9 à 12 dès 1024 px, sinon
    // largeur du conteneur (marges de 20 px sous 768 px), plafonnée à 400 px.
    // `calc()` et non `100vw` nu : Next ne retire alors pas les largeurs sous
    // 640 px du srcset (384 px servis à 390 px en 1×, 750 en 2×).
    src: "/illustrations/ill-05.png",
    width: 400,
    maxW: "max-w-[400px]",
    height: 500,
    sizes: "(min-width: 440px) 400px, calc(100vw - 40px)",
    alt: "",
  },
  "ILL-06": {
    // Le cabinet, en-tête pleine largeur (10:3).
    src: "/illustrations/ill-06.png",
    width: 1200,
    maxW: "max-w-[1200px]",
    height: 360,
    sizes: "(min-width: 1280px) 1200px, 100vw",
    alt: "",
  },
  "ILL-08": {
    // 404.
    src: "/illustrations/ill-08.png",
    width: 240,
    maxW: "max-w-[240px]",
    height: 300,
    sizes: "240px",
    alt: "",
  },
  "ILL-09": {
    // Vendre, en-tête (colonnes 9 à 12, aligné en bas) : pavillon en meulière,
    // différent d'ILL-01. Recadré sur le sujet, ratio natif proche de 4:3.
    src: "/illustrations/ill-09.png",
    width: 320,
    maxW: "max-w-[320px]",
    height: 245,
    sizes: "320px",
    alt: "",
  },
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;

type Props = {
  name: IllustrationName;
  /** Classes du cadre de l'illustration (marges, alignement). Le cadre occupe la largeur du parent, plafonnée à la taille du dessin. */
  className?: string;
  /** Illustration d'ouverture qui est l'élément LCP (ILL-01, ILL-05, ILL-09 ; ILL-08 sur la 404) : préchargement, sans fondu. */
  priority?: boolean;
  /** Remplace l'attribut `sizes` par défaut quand la mise en page diffère du doc 05 §3. */
  sizes?: string;
};

export function Illustration({
  name,
  className,
  priority = false,
  sizes,
}: Props) {
  const ill = ILLUSTRATIONS[name];
  const cadre = `block w-full ${ill.maxW}${className ? ` ${className}` : ""}`;
  const image = (
    <Image
      src={ill.src}
      width={ill.width}
      height={ill.height}
      sizes={sizes ?? ill.sizes}
      alt={ill.alt}
      aria-hidden={ill.alt === "" || undefined}
      preload={priority}
      className={priority ? `h-auto ${cadre}` : "block h-auto w-full"}
    />
  );

  if (priority) return image;

  return <ImageFade className={cadre}>{image}</ImageFade>;
}
