import { TextLink } from "@/components/ui/TextLink";
import {
  capitalizeFirst,
  glueHyphens,
  neighborhoodPhrase,
} from "@/lib/property/text";
import type { PropertyView } from "@/lib/property/view";

// Emplacement (doc 04 §2.3-8) : ville, code postal et quartier, jamais
// l'adresse exacte ; pas de carte (coordonnées nulles, adresse non publique).
// Phrase : « Asnières-sur-Seine (92600), quartier des Impressionnistes. »
// Sans ville, le quartier seul ; sans rien, seule la phrase sur l'adresse.
// Lien Géorisques dans le même onglet, sans icône (A16).

const GEORISQUES = "https://www.georisques.gouv.fr/";

function placeSentence(view: PropertyView): string | null {
  const postal = view.postalCode ? ` (${view.postalCode})` : "";
  const quartier =
    view.neighborhood && view.neighborhood !== view.city
      ? neighborhoodPhrase(view.neighborhood)
      : null;
  if (view.city) {
    const city = glueHyphens(view.city);
    return quartier ? `${city}${postal}, ${quartier}.` : `${city}${postal}.`;
  }
  return quartier ? `${capitalizeFirst(quartier)}${postal}.` : null;
}

export function PropertyLocation({ view }: { view: PropertyView }) {
  const sentence = placeSentence(view);
  return (
    <div className="t-texte mesure space-y-[1lh] text-encre">
      <p>
        {sentence ? `${sentence} ` : null}
        L’adresse exacte vous est communiquée lors de la visite.
      </p>
      <p>
        Les informations sur les risques auxquels ce bien est exposé sont
        disponibles sur le site{" "}
        <TextLink href={GEORISQUES}>Géorisques</TextLink>.
      </p>
    </div>
  );
}
