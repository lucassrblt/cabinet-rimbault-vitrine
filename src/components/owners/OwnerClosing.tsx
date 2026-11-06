import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { agency } from "@/lib/agency";
import { OwnerSection } from "./OwnerSection";
import { fr, phoneLabel } from "./typo";

// Fin des pages Vendre et Louer (doc 04 §2.5-7 et §2.6-6) : une phrase, le
// bouton principal vers le tunnel (le seul bouton grenat de cet écran) et le
// téléphone en bouton secondaire.

type OwnerClosingProps = {
  title: string;
  text: string;
  estimationHref: string;
  estimationLabel: string;
};

export function OwnerClosing({
  title,
  text,
  estimationHref,
  estimationLabel,
}: OwnerClosingProps) {
  return (
    <OwnerSection id="parlons" title={title}>
      <p className="t-texte mesure">{fr(text)}</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink href={estimationHref}>{estimationLabel}</ButtonLink>
        <ButtonLink
          href={agency.phone.href}
          variant="secondaire"
          icon={<Phone aria-hidden="true" strokeWidth={1.5} />}
          className="chiffres"
          aria-label={`Appeler le cabinet au ${agency.phone.display}`}
        >
          {phoneLabel(agency.phone.display)}
        </ButtonLink>
      </div>
    </OwnerSection>
  );
}
