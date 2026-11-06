import { Checkbox } from "@/components/ui/Checkbox";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";

// Consentement RGPD (doc 03 §6.3, doc 04 §3.8) : case jamais précochée,
// obligatoire, juste au-dessus du bouton d'envoi, avec la finalité et le lien
// vers la politique de confidentialité. Rédigé à la deuxième personne : le
// site ne dit jamais « je » (brief §1). Aucune durée de conservation tant
// qu'elle n'est pas validée par l'agent (brief §10-15).

type ConsentFieldProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | null;
  /** Ce à quoi servent les informations : « répondre à votre message ». */
  purpose?: string;
};

export function ConsentField({
  id,
  checked,
  onChange,
  error,
  purpose = "répondre à votre message",
}: ConsentFieldProps) {
  return (
    <Checkbox
      id={id}
      name="rgpd"
      value="on"
      checked={checked}
      onChange={(event) => onChange(event.currentTarget.checked)}
      error={error}
      aria-required
    >
      Vous acceptez que le {agency.name} utilise ces informations pour {purpose}
      . Elles ne sont ni cédées ni utilisées à d’autres fins (voir notre{" "}
      <TextLink href="/confidentialite">politique de confidentialité</TextLink>
      ).
    </Checkbox>
  );
}
