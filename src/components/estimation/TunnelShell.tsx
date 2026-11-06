import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Heading } from "@/components/ui/Heading";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import { cn } from "@/lib/utils";

// Gabarit du tunnel (doc 03 §6.3, doc 04 §3.2). Desktop (≥ 1024 px) : titre
// et chapô sur les colonnes 1 à 4, cadre lait sur les colonnes 5 à 12 (une
// colonne de saisie d'environ 690 px). Mobile : titre puis tunnel pleine
// largeur, sans cadre. Composant serveur ou client, sans état : il sert aussi
// au repli affiché avant le chargement du tunnel.

type TunnelShellProps = {
  /** Masque le chapô en mobile (étapes 2 à 4 : la saisie remonte). */
  compactIntro?: boolean;
  children: ReactNode;
};

export function TunnelShell({
  compactIntro = false,
  children,
}: TunnelShellProps) {
  return (
    <Container className="pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20">
      <Grid className="gap-y-8 md:gap-y-12">
        <div className="col-span-full lg:col-span-4">
          <Heading level={1} className="max-w-[12em]">
            Faire estimer votre bien
          </Heading>
          <p
            className={cn(
              "t-ui mt-4 max-w-[34em] text-encre-douce md:mt-6 lg:t-chapo",
              compactIntro && "hidden md:block",
            )}
          >
            Nous ne calculons aucun prix en ligne. Vos réponses préparent la
            visite&#8239;: nous venons voir le bien avant de vous donner notre
            estimation.
          </p>
          <p className="t-petit mt-6 hidden text-encre-douce lg:block">
            Une question&#8239;? Appelez-nous au{" "}
            <TextLink
              href={agency.phone.href}
              className="chiffres whitespace-nowrap"
            >
              {agency.phone.display}
            </TextLink>
            .
          </p>
        </div>
        <div className="col-span-full lg:col-span-8 lg:col-start-5">
          <div className="md:rounded-[2px] md:border md:border-filet md:bg-lait md:p-12">
            {children}
          </div>
        </div>
      </Grid>
    </Container>
  );
}
