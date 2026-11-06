import { cityLine, streetLine } from "@/components/layout/typo";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import { cn } from "@/lib/utils";
import { OpeningHours } from "./OpeningHours";

// Adresse du cabinet (doc 04 §7, interface figée) : adresse, téléphone,
// horaires facultatifs (masqués tant qu'ils ne sont pas validés), lien
// « Itinéraire » dans le même onglet, sans icône (A16). Utilisée par Le
// cabinet, Contact et l'accueil (« Nous trouver », lot 3).

type AgencyAddressProps = {
  showHours?: boolean;
  className?: string;
};

export function AgencyAddress({
  showHours = false,
  className,
}: AgencyAddressProps) {
  return (
    <div className={cn("t-texte", className)}>
      <address>
        {streetLine()}
        <br />
        <span className="whitespace-nowrap">{cityLine()}</span>
      </address>
      <p className="mt-2">
        <TextLink
          href={agency.phone.href}
          className="chiffres whitespace-nowrap"
        >
          {agency.phone.display}
        </TextLink>
      </p>
      {showHours ? <OpeningHours className="mt-4" /> : null}
      <p className="t-ui mt-4">
        <TextLink href={agency.mapsDirections}>Itinéraire</TextLink>
      </p>
    </div>
  );
}
