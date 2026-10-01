import { biens } from "../data";
import { HomeLowerSections } from "../home-sections";
import { Button, Footer, Header, Photo, Section } from "../wf";

/** Accueil validé (« Le quartier ») : on ouvre sur une photo maîtrisée d'Asnières. */
export default function AccueilWireframe() {
  const [a, b, c] = biens;

  return (
    <>
      <Section n={1} name="En-tête">
        <Header />
      </Section>

      <Section n={2} name="Ouverture">
        <div className="md:grid md:grid-cols-12">
          <Photo
            shot
            label="une rue d’Asnières ou les bords de Seine, lumière de fin de journée, sans personne au premier plan"
            className="aspect-[4/3] md:col-span-9 md:col-start-1 md:row-start-1 md:aspect-auto md:min-h-[40rem]"
          />
          <div className="relative mr-10 ml-4 -mt-20 bg-white p-5 shadow-[0_0_0_1px_#ddd] md:col-span-4 md:col-start-9 md:row-start-1 md:mx-0 md:mt-0 md:mr-10 md:-mb-16 md:self-end md:p-8">
            <p className="text-[0.8125rem] text-[#666]">Logotype</p>
            <p className="mt-2 text-[1.25rem] font-semibold leading-snug md:mt-3 md:text-[1.75rem]">
              Agence immobilière à Asnières-sur-Seine, depuis 2009.
            </p>
            <p className="mt-3 text-[0.875rem] text-[#666]">
              4,9 sur 5, 32 avis Google
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button primary>Voir nos biens</Button>
              <Button>Appeler</Button>
            </div>
          </div>
        </div>
      </Section>

      <Section n={3} name="Les biens" className="mt-10 px-4 md:mt-32 md:px-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[1.25rem] font-semibold">En vente</h2>
          <span className="text-[0.9375rem] underline">Voir les 5 biens</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-12 md:gap-x-10">
          <Bien
            {...a}
            className="col-span-2 md:col-span-6"
            ratio="aspect-[4/3] md:aspect-[4/5]"
          />
          <Bien
            {...b}
            className="md:col-span-5 md:col-start-8 md:mt-24"
            ratio="aspect-[4/5] md:aspect-[4/3]"
          />
          <Bien
            {...c}
            className="mt-10 md:col-span-4 md:col-start-8 md:-mt-40"
            ratio="aspect-[4/5] md:aspect-[4/3]"
          />
        </div>
      </Section>

      <HomeLowerSections />
      <Footer />
    </>
  );
}

function Bien({
  title,
  surface,
  price,
  photo,
  className,
  ratio,
}: typeof import("../data").biens[number] & {
  className?: string;
  ratio: string;
}) {
  return (
    <div className={className}>
      <Photo label={photo} className={ratio} />
      <p className="mt-2 text-[0.9375rem] font-semibold leading-snug">
        {title}, {surface}
      </p>
      <p className="text-[0.9375rem]">{price}</p>
    </div>
  );
}
