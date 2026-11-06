import { Phone } from "lucide-react";
import Link from "next/link";
import { Logotype } from "@/components/brand/Logotype";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";

// En-tête réduit du tunnel d'estimation (doc 04 §3.2) : logotype vers
// l'accueil, téléphone, « Quitter ». Aucune navigation principale, aucun
// bouton : le seul bouton grenat de l'écran est « Continuer ». Statique à
// toutes les tailles (rien à garder sous la main pendant la saisie), même
// hauteur et même filet que l'en-tête du site.
// « Quitter » est un simple lien vers l'accueil, sans confirmation : les
// réponses restent en sessionStorage et sont proposées au retour (« Nous
// avons retrouvé vos réponses. », doc 04 §3.5). Rien n'est perdu.

export function TunnelHeader() {
  return (
    <header data-mv-entete className="border-b border-filet bg-creme">
      <Container className="flex h-[63px] items-center justify-between gap-4 lg:h-[79px]">
        <Link
          href="/"
          className="flex shrink-0 flex-col text-grenat no-underline"
        >
          <Logotype className="h-auto w-[142px] min-[380px]:w-[158px] lg:w-[182px]" />
          <span className="sr-only">, retour à l’accueil</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-8">
          <TextLink
            href={agency.phone.href}
            variant="discret"
            aria-label={`Appeler le cabinet, ${agency.phone.display}`}
            className="t-nav chiffres inline-flex h-12 min-w-12 items-center justify-center gap-2 whitespace-nowrap text-encre after:hidden sm:h-auto sm:min-w-0 sm:after:block"
          >
            <Phone aria-hidden="true" size={16} strokeWidth={1.5} />
            <span className="hidden sm:inline">{agency.phone.display}</span>
          </TextLink>
          <TextLink
            href="/"
            variant="discret"
            className="t-nav -mr-1 inline-flex h-12 items-center px-1 text-encre after:hidden sm:mr-0 sm:h-auto sm:px-0 sm:after:block"
          >
            Quitter
          </TextLink>
        </div>
      </Container>
    </header>
  );
}
