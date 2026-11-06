import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import type { PropertyView } from "@/lib/property/view";

// Prix, honoraires et actions de la fiche (doc 03 §6.6, doc 04 §2.3-3, A6).
// Prix en Spectral 40/44, puis les lignes d'honoraires (note du client), le
// lien vers le barème, puis deux actions :
// - mobile : « Appeler le cabinet » (secondaire, `tel:`) puis « Demander une
//   visite » (principal), pleine largeur, juste sous le prix (A6) ;
// - desktop : « Demander une visite » (principal) puis le numéro.
// Aucune barre fixe en bas d'écran. Le seul bouton grenat de l'écran.

export function PriceBlock({ view }: { view: PropertyView }) {
  return (
    <div>
      {view.priceAmount ? (
        <p className="text-encre">
          <span className="t-prix-fiche block">{view.priceAmount}</span>
          {view.priceSuffix ? (
            <span className="t-chapo mt-1 block">{view.priceSuffix}</span>
          ) : null}
        </p>
      ) : null}
      {view.feeLines.length ? (
        <ul className="mt-3 font-sans text-[15px] leading-[22px] text-encre-douce">
          {view.feeLines.map((line) => (
            <li key={line} className="chiffres">
              {line}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="t-petit mt-3">
        <TextLink href="/honoraires">Consulter nos honoraires</TextLink>
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {/* Ordre du DOM = ordre visuel (tabulation) : deux éléments distincts
            plutôt qu'un `order-*` qui inverserait la lecture. */}
        <ButtonLink
          href={agency.phone.href}
          variant="secondaire"
          fullWidth
          icon={<Phone strokeWidth={1.5} aria-hidden="true" />}
          className="lg:hidden"
        >
          Appeler le cabinet
        </ButtonLink>
        <ButtonLink href="#contact" variant="principal" fullWidth>
          Demander une visite
        </ButtonLink>
        <ButtonLink
          href={agency.phone.href}
          variant="secondaire"
          fullWidth
          icon={<Phone strokeWidth={1.5} aria-hidden="true" />}
          className="hidden lg:flex"
        >
          <span className="chiffres">{agency.phone.display}</span>
        </ButtonLink>
      </div>
    </div>
  );
}
