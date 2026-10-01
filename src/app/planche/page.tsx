import {
  ArrowUpDown,
  Car,
  ChevronDown,
  Fence,
  MessageCircle,
  Phone,
  Star,
  Sun,
  Warehouse,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

const PHOTO =
  "https://lutylerazlxnfxldziec.supabase.co/storage/v1/object/public/property-files";
const photos = {
  facade: `${PHOTO}/09.345/images/1769442323164-8ix8mj4-IMG_3895.jpg`,
  jardin: `${PHOTO}/10129/images/1769247663692-wju86nr-3.jpg`,
  sejour: `${PHOTO}/10129/images/1769247663692-uh0gyzx-1.jpg`,
  terrasse: `${PHOTO}/10.131/images/1769441286831-694nqz6-3.jpg`,
  chambre: `${PHOTO}/09.345/images/1769442323164-8yg90nj-1.jpg`,
};

const REDS = [
  {
    id: "red-1",
    name: "Enseigne",
    hex: "#B2222C",
    note: "Fidèle à la devanture",
  },
  {
    id: "red-2",
    name: "Enseigne assombri",
    hex: "#9B1C26",
    note: "Proposé au départ",
  },
  {
    id: "red-3",
    name: "Profond",
    hex: "#7F1A24",
    note: "Retenu",
  },
];

const NEUTRALS = [
  { name: "Blanc", hex: "#FFFFFF", varName: "--white" },
  { name: "Pierre", hex: "#F1EFEC", varName: "--stone" },
  { name: "Filet", hex: "#E2DED9", varName: "--line" },
  { name: "Gris", hex: "#6E6763", varName: "--muted" },
  { name: "Encre", hex: "#241F1E", varName: "--ink" },
];

function Board({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="wrap border-t border-(--line) py-14 md:py-20">
      <h2 className="board-title">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Logo({ size = 1, plate }: { size?: number; plate?: boolean }) {
  return (
    <span
      className={`logo ${plate ? "plate" : ""}`}
      style={{ fontSize: `${size}em` }}
    >
      <span className={`logo-name ${plate ? "" : "text-(--red)"}`}>
        Cabinet Rimbault
      </span>
      <span className="logo-tagline text-[0.72em]">
        Transactions immobilières
      </span>
    </span>
  );
}

function PropertyCard({
  src,
  title,
  price,
  place,
  ratio,
}: {
  src: string;
  title: string;
  price: string;
  place: string;
  ratio: string;
}) {
  return (
    <a href="#composants" className="group block">
      <div className={`photo ${ratio}`}>
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 30rem, 50vw"
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.015]"
        />
      </div>
      <p className="t-small mt-3 text-(--muted)">{place}</p>
      <p className="t-h3 mt-0.5 group-hover:text-(--red)">{title}</p>
      <p className="mt-0.5">{price}</p>
    </a>
  );
}

export default function Planche() {
  return (
    <main className="pb-24">
      <div className="sticky top-0 z-20 border-b border-(--line) bg-(--white)/95 backdrop-blur">
        <div className="wrap flex flex-wrap items-center gap-x-8 gap-y-2 py-3 text-[0.875rem]">
          <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="sr-only">Rouge</legend>
            <span className="mr-1 text-(--muted)">Rouge</span>
            {REDS.map((r) => (
              <label key={r.id} className="choice relative">
                <input
                  type="radio"
                  name="red"
                  id={r.id}
                  defaultChecked={r.id === "red-3"}
                />
                {r.name}
              </label>
            ))}
          </fieldset>
          <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="sr-only">Typographie</legend>
            <span className="mr-1 text-(--muted)">Typographie</span>
            <label className="choice relative">
              <input type="radio" name="type" id="type-1" />
              Caslon + Public Sans
            </label>
            <label className="choice relative">
              <input type="radio" name="type" id="type-2" defaultChecked />
              Source Serif + Instrument Sans
            </label>
          </fieldset>
        </div>
      </div>

      <header className="wrap pt-14 pb-6 md:pt-20">
        <p className="board-title">Planche de style, direction A révisée</p>
        <h1 className="t-display mt-4 max-w-[18ch]">
          Le rouge de l’enseigne, en petite quantité.
        </h1>
        <p className="mt-6 max-w-[52ch] text-(--muted)">
          Le rouge ne couvre plus de grandes surfaces : il signe le logotype et
          l’action principale. Les photos portent le reste.
        </p>
      </header>

      <Board title="Comparer les deux typographies">
        <div className="grid gap-10 md:grid-cols-2">
          {[
            {
              cls: "pair-source",
              name: "Source Serif + Instrument Sans",
              note: "Plus contemporaine, chiffres fins, se lit très bien en petit.",
            },
            {
              cls: "pair-caslon",
              name: "Caslon + Public Sans",
              note: "Plus classique, plus proche des lettres de l’enseigne, plus lourde en grand.",
            },
          ].map((pair) => (
            <div key={pair.cls} className={pair.cls}>
              <p className="font-medium">{pair.name}</p>
              <p className="t-small text-(--muted)">{pair.note}</p>
              <div className="mt-5 ring-1 ring-(--line)">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[0.85rem]">
                    <Logo size={1} plate />
                  </span>
                  <span className="t-small">Appeler</span>
                </div>
                <div className="photo aspect-[16/9]">
                  <Image
                    src={photos.facade}
                    alt=""
                    fill
                    sizes="36rem"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="t-small text-(--muted)">
                    Quartier des Impressionnistes, Asnières-sur-Seine
                  </p>
                  <p className="t-h2 mt-1">Appartement 5 pièces</p>
                  <p className="t-figure mt-3">644 000 €</p>
                  <dl className="mt-4 grid grid-cols-4 border-y border-(--line) py-3">
                    {[
                      ["Surface", "92,2\u00a0m²"],
                      ["Pièces", "5"],
                      ["Chambres", "4"],
                      ["Étage", "RDC"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="t-small text-(--muted)">{k}</dt>
                        <dd className="t-figure mt-1 text-[1.25rem]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4">
                    Au rez-de-jardin d’une résidence de 2012, un 5 pièces au
                    calme, ouvert sur une terrasse et un jardin privatifs.
                  </p>
                  <p className="t-h3 mt-6">
                    Nous refusons les estimations gonflées.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Board>

      <Board title="La plaque ou le monogramme, dans l’en-tête">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="font-medium">La plaque</p>
            <p className="t-small text-(--muted)">
              On reconnaît l’enseigne immédiatement. Plus large, elle prend de
              la place sur mobile.
            </p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between px-4 py-3 ring-1 ring-(--line)">
                <span className="text-[0.9rem]">
                  <Logo size={1} plate />
                </span>
                <span className="t-small hidden gap-5 min-[1700px]:flex">
                  <span>Nos biens</span>
                  <span>L’agence</span>
                  <span>Contact</span>
                </span>
                <span className="btn btn-secondary min-h-9! px-3!">
                  <Phone size={15} aria-hidden />
                  Appeler
                </span>
              </div>
              <div className="flex w-[390px] max-w-full items-center justify-between px-4 py-3 ring-1 ring-(--line)">
                <span className="text-[0.75rem]">
                  <Logo size={1} plate />
                </span>
                <span className="btn btn-secondary min-h-9! px-3!">
                  <Phone size={15} aria-hidden />
                  Appeler
                </span>
              </div>
              <p className="t-small text-(--muted)">
                Desktop, puis mobile (390 px).
              </p>
            </div>
          </div>
          <div>
            <p className="font-medium">Le monogramme</p>
            <p className="t-small text-(--muted)">
              Compact et net à toutes les tailles. Le nom en toutes lettres
              l’accompagne quand la place le permet.
            </p>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between px-4 py-3 ring-1 ring-(--line)">
                <span className="flex items-center gap-3">
                  <span className="serif flex size-10 items-center justify-center bg-(--red) text-[1rem] font-bold tracking-wider text-white">
                    CR
                  </span>
                  <span className="logo text-[0.9rem]">
                    <span className="logo-name">Cabinet Rimbault</span>
                    <span className="logo-tagline text-[0.72em] text-(--muted)">
                      Transactions immobilières
                    </span>
                  </span>
                </span>
                <span className="t-small hidden gap-5 min-[1700px]:flex">
                  <span>Nos biens</span>
                  <span>L’agence</span>
                  <span>Contact</span>
                </span>
                <span className="btn btn-secondary min-h-9! px-3!">
                  <Phone size={15} aria-hidden />
                  Appeler
                </span>
              </div>
              <div className="flex w-[390px] max-w-full items-center justify-between px-4 py-3 ring-1 ring-(--line)">
                <span className="flex items-center gap-2.5">
                  <span className="serif flex size-9 items-center justify-center bg-(--red) text-[0.9rem] font-bold tracking-wider text-white">
                    CR
                  </span>
                  <span className="logo-name text-[0.8rem]">
                    Cabinet Rimbault
                  </span>
                </span>
                <span className="btn btn-secondary min-h-9! px-3!">
                  <Phone size={15} aria-hidden />
                  Appeler
                </span>
              </div>
              <p className="t-small text-(--muted)">
                Desktop, puis mobile (390 px).
              </p>
            </div>
          </div>
        </div>
      </Board>

      <Board title="Logotype">
        <div className="grid gap-4 md:grid-cols-3">
          <figure>
            <div className="flex aspect-[4/3] items-center justify-center bg-(--white) ring-1 ring-(--line)">
              <Logo size={1.25} plate />
            </div>
            <figcaption className="t-small mt-3">
              <span className="font-medium">La plaque.</span> L’enseigne en
              miniature : le seul bloc rouge du site, à la taille d’un logo.
            </figcaption>
          </figure>
          <figure>
            <div className="flex aspect-[4/3] items-center justify-center bg-(--white) ring-1 ring-(--line)">
              <Logo size={1.25} />
            </div>
            <figcaption className="t-small mt-3">
              <span className="font-medium">Les lettres.</span> Capitales rouges
              sur blanc, plus discret.
            </figcaption>
          </figure>
          <figure>
            <div className="flex aspect-[4/3] items-center justify-center gap-8 bg-(--stone)">
              <span className="logo text-[1.5rem]">
                <span className="logo-name text-(--red)">Cabinet</span>
                <span className="logo-name text-(--red)">Rimbault</span>
              </span>
              <span className="serif flex size-14 items-center justify-center bg-(--red) text-[1.375rem] font-bold tracking-wider text-white">
                CR
              </span>
            </div>
            <figcaption className="t-small mt-3">
              <span className="font-medium">Empilé et monogramme.</span> Pied de
              page, icône d’onglet et de partage.
            </figcaption>
          </figure>
        </div>

        <div className="mt-10 ring-1 ring-(--line)">
          <div className="flex items-center justify-between gap-6 px-4 py-3 md:px-6">
            <span className="text-[0.8rem] md:text-[0.9rem]">
              <Logo size={1} plate />
            </span>
            <nav className="hidden gap-7 text-[0.9375rem] md:flex">
              <span className="link">Nos biens</span>
              <span className="link">L’agence</span>
              <span className="link">Contact</span>
            </nav>
            <span className="btn btn-secondary min-h-10! px-4!">
              <Phone size={16} aria-hidden />
              Appeler
            </span>
          </div>
        </div>
        <p className="t-small mt-3 text-(--muted)">
          La plaque dans l’en-tête : on reconnaît la devanture sans bandeau
          rouge sur toute la largeur.
        </p>
      </Board>

      <Board title="Couleur">
        <div className="grid gap-10 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="font-medium">Trois nuances de rouge</p>
            <ul className="mt-4 space-y-3">
              {REDS.map((r) => (
                <li key={r.id} className="flex items-center gap-4">
                  <span
                    className="size-12 shrink-0"
                    style={{ background: r.hex }}
                  />
                  <span>
                    {r.name}
                    <span className="t-small block text-(--muted)">
                      {r.hex}, {r.note.toLowerCase()}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium">Neutres</p>
            <ul className="mt-4 grid grid-cols-5 gap-2">
              {NEUTRALS.map((n) => (
                <li key={n.name}>
                  <span
                    className="block aspect-square ring-1 ring-(--line)"
                    style={{ background: `var(${n.varName})` }}
                  />
                  <span className="t-small mt-2 block">{n.name}</span>
                  <span className="t-small block text-(--muted)">{n.hex}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-medium">Proportions sur une page</p>
            <div
              className="mt-3 flex h-10"
              role="img"
              aria-label="Blanc et pierre 85 %, encre 11 %, rouge 4 %"
            >
              <span className="w-[62%] bg-(--white) ring-1 ring-(--line) ring-inset" />
              <span className="w-[23%] bg-(--stone)" />
              <span className="w-[11%] bg-(--ink)" />
              <span className="w-[4%] bg-(--red)" />
            </div>
            <p className="t-small mt-3 text-(--muted)">
              Le rouge sert au logotype, à l’action principale de chaque écran
              et aux états actifs. Jamais en fond de section.
            </p>
          </div>
        </div>
      </Board>

      <Board title="Typographie">
        <div className="grid gap-x-12 gap-y-8 md:grid-cols-[10rem_1fr]">
          {[
            [
              "Titre d’ouverture",
              "65 px",
              <p key="d" className="t-display max-w-[20ch]">
                Agence immobilière à Asnières-sur-Seine, depuis 2009.
              </p>,
            ],
            [
              "Titre de page",
              "52 px",
              <p key="h1" className="t-h1">
                Appartement 5 pièces
              </p>,
            ],
            [
              "Titre de section",
              "33 px",
              <p key="h2" className="t-h2">
                En vente
              </p>,
            ],
            [
              "Intertitre",
              "21 px",
              <p key="h3" className="t-h3">
                Nous refusons les estimations gonflées.
              </p>,
            ],
            [
              "Texte",
              "17 px",
              <p key="b" className="t-body max-w-[62ch]">
                Dans une résidence récente de 2012, au rez-de-jardin, très beau
                5 pièces au calme, en double exposition. Cuisine ouverte sur un
                séjour de 33 m² avec accès à la terrasse et au jardin en
                jouissance exclusive.
              </p>,
            ],
            [
              "Chiffres",
              "26 px",
              <p key="f" className="t-figure flex gap-10">
                <span>92,2 m²</span>
                <span>644 000 €</span>
              </p>,
            ],
            [
              "Mentions",
              "14 px",
              <p key="s" className="t-small max-w-[62ch] text-(--muted)">
                Honoraires à la charge du vendeur. Carte professionnelle CPI
                9201 2018 000 024 838, CCI Paris Île-de-France.
              </p>,
            ],
          ].map(([label, size, sample]) => (
            <div key={label as string} className="contents">
              <p className="t-small text-(--muted) md:pt-2">
                {label}
                <span className="block">{size}</span>
              </p>
              {sample}
            </div>
          ))}
        </div>
      </Board>

      <Board title="Photographie">
        <div className="md:grid md:grid-cols-12">
          <div className="photo aspect-[4/3] md:col-span-8 md:col-start-1 md:row-start-1 md:aspect-[16/10]">
            <Image
              src={photos.facade}
              alt=""
              fill
              sizes="(min-width: 768px) 50rem, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative mx-4 -mt-14 bg-(--white) p-6 ring-1 ring-(--line) md:col-span-5 md:col-start-8 md:row-start-1 md:mx-0 md:mt-0 md:mb-10 md:self-end md:p-8">
            <Logo size={0.8} plate />
            <p className="t-h2 mt-5">
              Agence immobilière à Asnières-sur-Seine, depuis 2009.
            </p>
            <p className="t-small mt-3 flex items-center gap-1.5 text-(--muted)">
              <Star
                size={14}
                className="fill-current text-(--ink)"
                aria-hidden
              />
              4,9 sur 5, 32 avis Google
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="btn btn-primary">Voir nos biens</span>
              <span className="btn btn-secondary">Appeler</span>
            </div>
          </div>
        </div>
        <p className="t-small mt-4 text-(--muted)">
          La carte chevauche la photo : c’est le seul texte posé sur une image.
          Ici, une façade d’un bien en attendant la vraie photo d’Asnières.
        </p>

        <div className="mt-14 grid grid-cols-6 gap-3 md:gap-6">
          <figure className="col-span-6 md:col-span-3">
            <div className="photo aspect-[4/3]">
              <Image
                src={photos.jardin}
                alt=""
                fill
                sizes="40rem"
                className="object-cover"
              />
            </div>
            <figcaption className="t-small mt-2 text-(--muted)">
              4:3, la photo principale d’un bien
            </figcaption>
          </figure>
          <figure className="col-span-3 md:col-span-2 md:mt-16">
            <div className="photo aspect-[4/5]">
              <Image
                src={photos.sejour}
                alt=""
                fill
                sizes="24rem"
                className="object-cover"
              />
            </div>
            <figcaption className="t-small mt-2 text-(--muted)">
              4:5, les intérieurs et les décalages
            </figcaption>
          </figure>
          <figure className="col-span-3 md:col-span-1 md:mt-32">
            <div className="photo aspect-[3/4]">
              <Image
                src={photos.chambre}
                alt=""
                fill
                sizes="16rem"
                className="object-cover"
              />
            </div>
            <figcaption className="t-small mt-2 text-(--muted)">
              3:4, en accent
            </figcaption>
          </figure>
        </div>
        <p className="t-small mt-6 max-w-[62ch] text-(--muted)">
          Coins nets, sans ombre ni filtre. Trois formats seulement, pour que
          les photos iPhone, en portrait comme en paysage, se recadrent toujours
          de la même façon.
        </p>
      </Board>

      <Board title="Composants">
        <div id="composants" className="grid gap-14 md:grid-cols-2">
          <div>
            <p className="font-medium">Actions</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="btn btn-primary">
                <Phone size={17} aria-hidden />
                Appeler l’agence
              </span>
              <span className="btn btn-secondary">
                <MessageCircle size={17} aria-hidden />
                WhatsApp
              </span>
              <span className="btn btn-secondary">Demander une visite</span>
            </div>
            <p className="mt-4">
              <span className="link">Voir les 5 biens</span>
            </p>
            <p className="t-small mt-3 text-(--muted)">
              Un seul bouton rouge par écran : l’action principale.
            </p>
          </div>

          <div>
            <p className="font-medium">L’essentiel d’un bien</p>
            <dl className="mt-4 grid grid-cols-4 border-y border-(--line) py-4">
              {[
                ["Surface", "92,2 m²"],
                ["Pièces", "5"],
                ["Chambres", "4"],
                ["Étage", "RDC"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="t-small text-(--muted)">{k}</dt>
                  <dd className="t-figure mt-1">{v}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-4 flex flex-wrap gap-2">
              {[
                [Sun, "Terrasse"],
                [Fence, "Jardin"],
                [Car, "Parking"],
                [Warehouse, "Cave"],
                [ArrowUpDown, "Ascenseur"],
              ].map(([Icon, label]) => {
                const I = Icon as typeof Sun;
                return (
                  <li
                    key={label as string}
                    className="t-small flex items-center gap-2 bg-(--stone) px-3 py-1.5"
                  >
                    <I size={15} aria-hidden />
                    {label as string}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-5">
            <PropertyCard
              src={photos.terrasse}
              title="Appartement 2 pièces, 46,6 m²"
              price="300 000 €"
              place="Impressionnistes, Asnières"
              ratio="aspect-[4/5]"
            />
            <div className="mt-12">
              <PropertyCard
                src={photos.facade}
                title="Appartement 2 pièces, 35,7 m²"
                price="280 000 €"
                place="Collange, Levallois-Perret"
                ratio="aspect-[4/5]"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className="font-medium">Énergie</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {[
                  [
                    "DPE",
                    "D",
                    "189 kWh/m²/an",
                    [
                      "#009c6d",
                      "#52b153",
                      "#a5cc74",
                      "#f4e70f",
                      "#f0b50f",
                      "#eb8235",
                      "#d7221f",
                    ],
                  ],
                  [
                    "GES",
                    "B",
                    "6 kg CO₂/m²/an",
                    [
                      "#f6edfd",
                      "#e4c7fa",
                      "#d4a9f6",
                      "#cb95f3",
                      "#ba72ef",
                      "#a74dea",
                      "#8a2be2",
                    ],
                  ],
                ].map(([k, c, v, colors]) => (
                  <div key={k as string}>
                    <p className="t-small text-(--muted)">{k as string}</p>
                    <div
                      className="mt-2 flex gap-0.5"
                      role="img"
                      aria-label={`${k} classe ${c}`}
                    >
                      {"ABCDEFG".split("").map((l, i) => (
                        <span
                          key={l}
                          className={`flex flex-1 items-center justify-center text-[0.75rem] font-semibold ${l === c ? "h-9 text-[#222]" : "h-6 self-end opacity-30"}`}
                          style={{ background: (colors as string[])[i] }}
                        >
                          {l === c ? l : ""}
                        </span>
                      ))}
                    </div>
                    <p className="t-small mt-2">{v as string}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {["Caractéristiques complètes", "Copropriété et charges"].map(
                (t) => (
                  <details key={t} className="border-b border-(--line) py-4">
                    <summary className="flex items-center justify-between font-medium">
                      {t}
                      <ChevronDown size={18} className="chevron" aria-hidden />
                    </summary>
                    <p className="t-small mt-3 text-(--muted)">
                      44 lots, charges annuelles 2 600 €, aucune procédure en
                      cours.
                    </p>
                  </details>
                ),
              )}
            </div>
          </div>

          <figure className="self-start bg-(--stone) p-6 md:p-8">
            <p className="flex gap-0.5" role="img" aria-label="5 étoiles sur 5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={15} className="fill-current" aria-hidden />
              ))}
            </p>
            <blockquote className="serif mt-4 text-[1.1875rem] leading-snug">
              « Extrait réel d’un avis Google, affiché tel quel et coupé à trois
              lignes. »
            </blockquote>
            <figcaption className="t-small mt-4 text-(--muted)">
              Prénom N., il y a 2 mois
            </figcaption>
          </figure>

          <form className="space-y-4">
            <p className="font-medium">Formulaire</p>
            <label className="t-small block">
              Prénom et nom
              <input className="field mt-1" autoComplete="name" />
            </label>
            <label className="t-small block">
              Téléphone
              <input className="field mt-1" type="tel" autoComplete="tel" />
            </label>
            <label className="t-small flex gap-3 text-(--muted)">
              <input type="checkbox" className="check" />
              J’accepte que mes coordonnées servent uniquement à répondre à ma
              demande.
            </label>
            <span className="btn btn-primary">Demander une visite</span>
          </form>
        </div>
      </Board>
    </main>
  );
}
