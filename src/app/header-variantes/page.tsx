import Image from "next/image";
import type { ReactNode } from "react";
import {
  HeaderBanne,
  HeaderCapsule,
  HeaderOuvert,
  HeaderRail,
  HeaderVitre,
} from "./variants";

export const metadata = { title: "Variantes d’en-tête" };

const PHOTO = "/maquettes/ouverture-quai-dervaux.jpg";

// Horaires de l'agence (à confirmer) : lundi sur rendez-vous, mardi-vendredi 9-19 h, samedi 9-18 h.
function openingStatus() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }),
  );
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  if (day >= 2 && day <= 5)
    return { openNow: hour >= 9 && hour < 19, today: "9 h – 19 h" };
  if (day === 6)
    return { openNow: hour >= 9 && hour < 18, today: "9 h – 18 h" };
  if (day === 1) return { openNow: false, today: "sur rendez-vous" };
  return { openNow: false, today: "réouverture mardi à 9 h" };
}

function Frame({
  children,
  mobile,
}: {
  children: ReactNode;
  mobile?: boolean;
}) {
  return (
    <div
      className={`@container relative overflow-hidden rounded-[10px] bg-pierre ${mobile ? "h-[300px] w-[390px] shrink-0" : "h-[300px] min-w-0 flex-1"}`}
    >
      <Image
        src={PHOTO}
        alt=""
        fill
        sizes={mobile ? "390px" : "70vw"}
        className="object-cover"
      />
      {children}
    </div>
  );
}

const VARIANTS = [
  {
    name: "1. La capsule",
    text: "Une barre arrondie qui flotte au-dessus de la photo, détachée des bords. Moderne et légère : la photo d’ouverture reste visible jusqu’en haut de l’écran.",
    node: <HeaderCapsule />,
  },
  {
    name: "2. La vitre",
    text: "Transparente sur la photo, avec des pastilles givrées. La plus immersive. Elle devient blanche dès qu’on défile.",
    node: <HeaderVitre />,
  },
  {
    name: "3. L’affichette « ouvert »",
    text: "Un bandeau qui dit, en direct, si l’agence est ouverte aujourd’hui, comme l’affichette des horaires sur la porte. Un vrai détail de commerce de quartier.",
    node: null,
  },
  {
    name: "4. La banne",
    text: "Une feuille blanche suspendue, coins inférieurs arrondis, nom au centre, comme le store d’une boutique. La plus singulière.",
    node: <HeaderBanne />,
  },
  {
    name: "5. Le rail",
    text: "La navigation dans un rail arrondi, l’onglet actif en relief. Très lisible, on sait toujours où l’on est.",
    node: <HeaderRail />,
  },
];

export default function HeaderVariantes() {
  const status = openingStatus();

  return (
    <main className="conteneur py-12 md:py-16">
      <h1 className="titre text-section">En-têtes</h1>
      <p className="mt-2 max-w-[60ch] text-gris">
        Sans logo (le nom en simple texte tient sa place), sans soulignés.
        L’onglet « Nos biens » est montré comme page active. Desktop à gauche,
        mobile à droite.
      </p>

      <div className="mt-12 space-y-16">
        {VARIANTS.map((v) => {
          const node = v.node ?? <HeaderOuvert {...status} />;
          return (
            <section key={v.name}>
              <h2 className="titre text-intertitre">{v.name}</h2>
              <p className="mt-1 max-w-[70ch] text-mention text-gris">
                {v.text}
              </p>
              <div className="mt-5 flex flex-col gap-4 xl:flex-row">
                <Frame>{node}</Frame>
                <Frame mobile>{node}</Frame>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
