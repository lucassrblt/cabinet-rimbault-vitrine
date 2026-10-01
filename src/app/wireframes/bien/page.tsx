import { biens } from "../data";
import { Button, Footer, Header, Photo, Section } from "../wf";

const PHOTOS = [
  "Jardin privatif depuis le séjour",
  "Séjour, baie vitrée ouverte sur la terrasse",
  "Jardin, vue vers la résidence",
  "Terrasse en bois",
];

const LEGEND = [
  ["Surface", "92,2 m²"],
  ["Pièces", "5"],
  ["Chambres", "4"],
  ["Étage", "RDC"],
];

const ATOUTS = ["Terrasse", "Jardin", "Parking", "Cave", "Ascenseur"];

export default function BienWireframe() {
  return (
    <>
      <Section name="En-tête">
        <Header />
      </Section>

      <Section n={1} name="Galerie" className="md:px-10 md:pt-6">
        {/* Mobile : défilement au doigt, plein largeur. */}
        <div className="md:hidden">
          <div className="wf-scroll">
            {PHOTOS.map((label) => (
              <Photo
                key={label}
                label={label}
                className="aspect-[4/3] w-full"
              />
            ))}
          </div>
        </div>
        <p className="px-4 pt-2 text-[0.8125rem] text-[#666] md:hidden">
          1 / {PHOTOS.length}, touchez pour agrandir
        </p>
        {/* Desktop : une grande photo et deux petites. */}
        <div className="hidden gap-3 md:grid md:grid-cols-3 md:grid-rows-2">
          <Photo
            label={PHOTOS[0]}
            className="col-span-2 row-span-2 min-h-[30rem]"
          />
          <Photo label={PHOTOS[1]} />
          <div className="relative">
            <Photo label={PHOTOS[2]} className="h-full" />
            <span className="absolute bottom-3 right-3 bg-white px-3 py-1.5 text-[0.8125rem]">
              Voir les {PHOTOS.length} photos
            </span>
          </div>
        </div>
      </Section>

      <div className="md:grid md:grid-cols-12 md:gap-10 md:px-10">
        <div className="md:col-span-8">
          <Section
            n={2}
            name="L’essentiel"
            className="px-4 pt-6 md:px-0 md:pt-10"
          >
            <p className="text-[0.875rem] text-[#666]">
              Quartier des Impressionnistes, Asnières-sur-Seine
            </p>
            <h1 className="mt-1 text-[1.75rem] font-semibold leading-tight md:text-[2.25rem]">
              Appartement 5 pièces
            </h1>
            <p className="mt-2 text-[1.5rem]">644 000 €</p>
            <p className="text-[0.8125rem] text-[#666]">
              Honoraires à la charge du vendeur
            </p>
            <dl className="mt-6 grid grid-cols-4 gap-2 border-y border-[#ddd] py-4">
              {LEGEND.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[0.75rem] text-[#666]">{label}</dt>
                  <dd className="text-[1.125rem] font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section n={4} name="Le bien" className="px-4 pt-10 md:px-0">
            <ul className="flex flex-wrap gap-2">
              {ATOUTS.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-2 border border-[#ccc] px-3 py-1.5 text-[0.875rem]"
                >
                  <span className="size-4 bg-[#ccc]" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-5 line-clamp-4 max-w-[38rem]">
              Dans une résidence récente de 2012, de bon standing, au
              rez-de-jardin, très beau 5 pièces au calme, en double exposition.
              Entrée avec placard, cuisine ouverte sur séjour de 33 m² avec
              accès à la terrasse et au jardin en jouissance exclusive, quatre
              chambres dont une avec salle d’eau…
            </p>
            <span className="mt-2 inline-block text-[0.9375rem] underline">
              Lire la description complète
            </span>
          </Section>

          <Section n={5} name="Énergie" className="px-4 pt-10 md:px-0">
            <h2 className="text-[1.125rem] font-semibold">Énergie</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                ["DPE", "D", "189 kWh/m²/an"],
                ["GES", "B", "6 kg CO₂/m²/an"],
              ].map(([k, c, v]) => (
                <div key={k} className="border border-[#ddd] p-4">
                  <p className="text-[0.8125rem] text-[#666]">{k}</p>
                  <div className="mt-2 flex gap-1" aria-hidden>
                    {"ABCDEFG".split("").map((l) => (
                      <span
                        key={l}
                        className={`flex h-7 flex-1 items-center justify-center text-[0.75rem] ${l === c ? "bg-[#333] text-white" : "bg-[#e5e5e5]"}`}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-[0.8125rem]">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.8125rem] text-[#666]">
              Dépenses annuelles d’énergie estimées entre 1 150 € et 1 600 €
              (prix 2021)
            </p>
          </Section>

          <Section n={6} name="Détails" className="px-4 pt-10 md:px-0">
            {[
              "Caractéristiques complètes",
              "Copropriété et charges",
              "Honoraires et frais",
            ].map((t) => (
              <details key={t} className="border-b border-[#ddd] py-4">
                <summary className="font-semibold">{t}</summary>
                <p className="mt-3 text-[0.9375rem] text-[#666]">
                  Liste clé / valeur, sur deux colonnes.
                </p>
              </details>
            ))}
          </Section>

          <Section n={7} name="Secteur" className="pt-10 md:pt-12">
            <div className="px-4 md:px-0">
              <h2 className="text-[1.125rem] font-semibold">Le quartier</h2>
              <p className="mt-1 text-[0.9375rem] text-[#666]">
                Métro Gabriel Péri, commerces, écoles et parc à proximité
              </p>
            </div>
            <Photo
              label="Carte du quartier, zone approximative d’environ 1 km, sans l’adresse exacte"
              className="mt-4 aspect-[16/9]"
            />
          </Section>

          <Section n={8} name="Visite" className="px-4 pt-12 md:px-0">
            <div id="visite" className="bg-[#f0f0f0] p-5 md:p-8">
              <h2 className="text-[1.125rem] font-semibold">
                Demander une visite
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["Prénom et nom", "Téléphone", "E-mail"].map((f) => (
                  <div
                    key={f}
                    className={f === "E-mail" ? "md:col-span-2" : undefined}
                  >
                    <p className="text-[0.8125rem] text-[#666]">{f}</p>
                    <div className="mt-1 h-11 border border-[#ccc] bg-white" />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[0.75rem] text-[#666]">
                Mention RGPD, une ligne
              </p>
              <Button primary className="mt-4">
                Demander une visite
              </Button>
            </div>
          </Section>
        </div>

        <Section
          n={3}
          name="Contact immédiat"
          className="hidden md:col-span-4 md:block md:pt-10"
        >
          <div className="sticky top-6 border border-[#ddd] p-6">
            <p className="text-[1.5rem]">644 000 €</p>
            <p className="text-[0.8125rem] text-[#666]">Référence 10129</p>
            <div className="mt-5 flex flex-col gap-3">
              <Button primary>Appeler l’agence</Button>
              <Button>WhatsApp</Button>
              <Button>Demander une visite</Button>
            </div>
          </div>
        </Section>
      </div>

      <Section n={9} name="Autres biens" className="mt-16 px-4 md:px-10">
        <h2 className="text-[1.125rem] font-semibold">Dans le même quartier</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
          {biens.slice(1).map((b) => (
            <div key={b.reference}>
              <Photo label={b.photo} className="aspect-[4/3]" />
              <p className="mt-2 text-[0.9375rem] font-semibold">{b.title}</p>
              <p className="text-[0.9375rem]">{b.price}</p>
            </div>
          ))}
        </div>
      </Section>

      <Footer n={null} />

      <Section
        n={3}
        name="Contact immédiat (mobile)"
        className="fixed! inset-x-0 bottom-0 z-10 md:hidden"
      >
        <div className="grid grid-cols-3 gap-2 border-t border-[#ddd] bg-white p-3">
          <Button primary>Appeler</Button>
          <Button>WhatsApp</Button>
          <Button>Visite</Button>
        </div>
      </Section>
      <div className="h-20 md:hidden" />
    </>
  );
}
