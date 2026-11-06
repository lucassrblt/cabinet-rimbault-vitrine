import { Illustration } from "@/components/illustrations/Illustration";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";

// Contenu des pages 404 (doc 04 §2.11), sans <main> : la 404 racine l'enveloppe
// dans son propre <main>, celle du groupe (site) dans celui du layout.
// Centré : avec la confirmation du tunnel, la seule exception à l'alignement
// à gauche (brief §3.3). ILL-08 (porte cochère fermée), puis le titre et trois
// sorties : Accueil, Nos biens, téléphone. ILL-08 est l'image principale de
// la page (LCP) : préchargée, sans fondu (`priority`). `title` et `lead`
// permettent la variante « bien disparu » de la fiche (lot 2).

type NotFoundContentProps = {
  title?: string;
  lead?: string;
};

export function NotFoundContent({
  title = "Cette page n’existe pas ou n’existe plus.",
  lead,
}: NotFoundContentProps) {
  return (
    <Container className="flex flex-col items-center pt-16 pb-16 text-center md:pt-24 md:pb-24">
      <Illustration name="ILL-08" priority />
      <Heading level={1} className="mt-10 max-w-[16em] md:mt-12">
        {title}
      </Heading>
      {lead ? (
        <p className="t-chapo mesure-chapo mt-6 text-encre-douce">{lead}</p>
      ) : null}
      <ul className="t-ui mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-8">
        <li>
          <TextLink href="/">Accueil</TextLink>
        </li>
        <li>
          <TextLink href="/biens">Nos biens</TextLink>
        </li>
        <li>
          <TextLink href={agency.phone.href} className="chiffres">
            {agency.phone.display}
          </TextLink>
        </li>
      </ul>
    </Container>
  );
}
