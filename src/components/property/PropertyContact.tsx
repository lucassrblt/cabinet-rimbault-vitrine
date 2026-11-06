import { ContactForm } from "@/components/forms/ContactForm";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import { type PropertyView, referenceLabel } from "@/lib/property/view";
import { FicheSection } from "./FicheSection";

// « Votre interlocuteur » puis « Demander une visite » (doc 04 §2.3-9 et 10).
// Aucune photo, aucun nom (brief §1, A9). Le formulaire est celui du lot 6
// (`ContactForm`, Server Action `submitContact`), avec l'objet imposé
// (BIEN_SALE ou BIEN_RENT) et la référence du bien dans la charge utile.

function visitObject(view: PropertyView): string {
  switch (view.propertyType) {
    case "APPARTEMENT":
      return view.head === "Studio" ? "le studio" : "l’appartement";
    case "MAISON":
      return "la maison";
    case "VILLA":
      return "la villa";
    case "LOFT":
      return "le loft";
    default:
      return "le bien";
  }
}

export function PropertyContact({ view }: { view: PropertyView }) {
  const isRent = view.transaction === "LOCATION";
  const until = isRent
    ? "des visites jusqu’à la signature du bail"
    : "des visites jusqu’à la signature chez le notaire";
  const defaultMessage = `Bonjour, je souhaite visiter ${visitObject(view)} ${referenceLabel(view.reference).replace("Réf.", "réf.")}.`;

  return (
    <>
      <FicheSection id="interlocuteur" title="Votre interlocuteur">
        <p className="t-texte mesure text-encre">
          Une seule personne s’occupe de ce bien, {until}. Appelez le cabinet au
          {" "}
          <TextLink
            href={agency.phone.href}
            className="chiffres whitespace-nowrap"
          >
            {agency.phone.display}
          </TextLink>{" "}
          ou écrivez-nous ci-dessous en citant la référence{" "}
          <span className="chiffres whitespace-nowrap">{view.reference}</span>.
        </p>
      </FicheSection>

      <FicheSection id="contact" title="Demander une visite">
        <ContactForm
          subject={isRent ? "BIEN_RENT" : "BIEN_SALE"}
          propertyReference={view.reference}
          defaultMessage={defaultMessage}
          source="vitrine/fiche"
          headingLevel={3}
          idPrefix="visite"
          className="mesure-bloc"
        />
      </FicheSection>
    </>
  );
}
