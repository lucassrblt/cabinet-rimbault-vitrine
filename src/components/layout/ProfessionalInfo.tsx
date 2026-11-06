import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import { cn } from "@/lib/utils";
import { amount } from "./typo";

// Mentions professionnelles (brief A20, doc 04 §4.2) : carte professionnelle
// et CCI, garant, forme sociale et capital, RCS, médiateur. Jamais repliées.
// Les identifiants ne se coupent jamais en fin de ligne (revue du lot P).
// Une valeur inconnue (`null` dans agency.ts) n'est pas affichée : le
// médiateur reste masqué tant qu'il n'est pas fourni, et check-launch bloque
// la mise en production sans lui (brief §10-1).

const { legal } = agency;

/** Espace fine insécable devant les deux-points (doc 03 §3.3). */
const DEUX_POINTS = " :";

function Nowrap({ children }: { children: React.ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

/** Carte professionnelle et CCI, seule ligne reprise par le pied du tunnel. */
export function ProfessionalCard() {
  return (
    <>
      Carte professionnelle <Nowrap>{legal.cardNumber}</Nowrap>, délivrée par la{" "}
      <Nowrap>{legal.cardIssuer}</Nowrap>.
    </>
  );
}

export function ProfessionalInfo({ className }: { className?: string }) {
  const mediator = legal.mediator;
  return (
    <div className={cn("t-legal", className)}>
      <h2 className="font-medium">Mentions professionnelles</h2>
      <p className="mt-1">
        <ProfessionalCard />
      </p>
      <p>
        Garant financier{DEUX_POINTS} <Nowrap>{legal.guarantorName}</Nowrap>
        {legal.guarantorAddress ? `, ${legal.guarantorAddress}` : ""}.
      </p>
      <p>
        {legal.legalForm} au capital de <Nowrap>{amount(legal.capital)}</Nowrap>
        , <Nowrap>{legal.rcs}</Nowrap>.
      </p>
      {mediator ? (
        <p>
          Médiateur de la consommation{DEUX_POINTS} {mediator.name},{" "}
          {mediator.address},{" "}
          <TextLink href={mediator.url}>{mediator.url}</TextLink>.
        </p>
      ) : null}
    </div>
  );
}
