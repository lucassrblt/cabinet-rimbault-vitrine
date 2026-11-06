import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";

// Renvoi des locataires en tête de /louer (doc 04 §2.6-0, brief §6.3) : une
// ligne sur filet, avant l'en-tête de la page qui s'adresse aux propriétaires.
// Nombre réel de biens en location, accordé, jamais « 0 bien » :
// 0 : « Nous n'avons aucun logement à louer en ce moment. »
// 1 : « Nous avons un logement à louer en ce moment. »
// n : « Nous avons 3 logements à louer en ce moment. »
// `null` (API indisponible) : aucune phrase de nombre, seulement le lien.
// Lien : avec 0, « Nous dire ce que vous cherchez » vers /contact?objet=location
// (même sortie que l'état vide de /biens) ; sinon « Voir nos logements à
// louer » vers /biens#location.

export function rentalCountSentence(count: number): string {
  if (count <= 0) return "Nous n’avons aucun logement à louer en ce moment.";
  if (count === 1) return "Nous avons un logement à louer en ce moment.";
  return `Nous avons ${count} logements à louer en ce moment.`;
}

export function TenantRedirect({ count }: { count: number | null }) {
  const link =
    count === 0
      ? {
          href: "/contact?objet=location",
          label: "Nous dire ce que vous cherchez",
        }
      : { href: "/biens#location", label: "Voir nos logements à louer" };
  return (
    <div className="border-filet border-b">
      <Container>
        <p className="t-ui flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 text-encre-douce">
          <span>
            <span className="font-medium text-encre">
              Vous cherchez un logement{" "}?
            </span>{" "}
            {count === null ? null : rentalCountSentence(count)}
          </span>
          <TextLink href={link.href} className="whitespace-nowrap">
            {link.label}
          </TextLink>
        </p>
      </Container>
    </div>
  );
}
