import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { ProfessionalCard } from "./ProfessionalInfo";

// Pied réduit du tunnel (doc 04 §3.2, §4.2) : mentions légales,
// confidentialité, carte professionnelle. Sur crème, sous un filet : le
// tunnel reste une seule colonne calme ; l'aplat grenat est celui du site.

export function TunnelFooter() {
  return (
    <footer id="pied" className="border-t border-filet">
      <Container className="t-legal flex flex-col gap-3 py-8 text-gris md:flex-row md:items-baseline md:justify-between md:gap-8">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <TextLink href="/mentions-legales" variant="discret">
              Mentions légales
            </TextLink>
          </li>
          <li>
            <TextLink href="/confidentialite" variant="discret">
              Confidentialité
            </TextLink>
          </li>
        </ul>
        <p>
          <ProfessionalCard />
        </p>
      </Container>
    </footer>
  );
}
