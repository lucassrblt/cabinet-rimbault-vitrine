import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ProsePage } from "@/components/layout/ProsePage";
import { amount, cityLine, streetLine } from "@/components/layout/typo";
import { TextLink } from "@/components/ui/TextLink";
import {
  DATABASE_LOCATION,
  LEGAL_UPDATED_AT,
  MENTIONS_TOC,
  type Provider,
  processors,
  siteHost,
} from "@/content/legal";
import { agency } from "@/lib/agency";
import { pageMetadata } from "@/lib/seo/metadata";

// Mentions légales (lot 7, doc 04 §2.10) : LCEN art. 1-1 (éditeur, directeur
// de la publication, hébergeur), loi Hoguet (carte, garant), Code de la
// consommation L.612-1 (médiateur), arrêté du 10 janvier 2017 (barème).
// Une donnée inconnue (`null` dans agency.ts ou legal.ts) masque sa phrase,
// sans marqueur ; check-launch bloque la mise en production.

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales",
  description:
    "Mentions légales du site du Cabinet Rimbault : éditeur, carte professionnelle, garant financier, réclamations, hébergement et crédits.",
  path: "/mentions-legales",
});

const { legal } = agency;

/** « RCS Nanterre 511 484 586 » → greffe et numéro, pour la phrase complète. */
const rcs = (() => {
  const match = /^RCS (\S+) (.+)$/.exec(legal.rcs);
  return match ? { city: match[1], number: match[2] } : null;
})();

function Nowrap({ children }: { children: ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

/** « Raison sociale, adresse, tél., site » : une seule forme pour chaque prestataire. */
function ProviderLine({ provider }: { provider: Provider }) {
  return (
    <>
      <Nowrap>{provider.name}</Nowrap>, {provider.address}
      {provider.phone ? (
        <>
          , téléphone <Nowrap>{provider.phone}</Nowrap>
        </>
      ) : null}
      ,{" "}
      <TextLink href={`https://${provider.url}`} className="whitespace-nowrap">
        {provider.url}
      </TextLink>
    </>
  );
}

export default function Page() {
  const mediator = legal.mediator;
  const toc = MENTIONS_TOC.map((section) =>
    section.id === "reclamations" && mediator
      ? { ...section, title: "Réclamations et médiation" }
      : section,
  );
  const claimsTitle = toc.find((s) => s.id === "reclamations")?.title;

  return (
    <ProsePage title="Mentions légales" updatedAt={LEGAL_UPDATED_AT} toc={toc}>
      <h2 id="editeur">Éditeur du site</h2>
      <p>
        Ce site est édité par le {agency.name}, société par actions simplifiée (
        {legal.legalForm}) au capital de{" "}
        <Nowrap>{amount(legal.capital)}</Nowrap>,
        {rcs ? (
          <>
            {" "}
            immatriculée au registre du commerce et des sociétés de {rcs.city}{" "}
            sous le <Nowrap>numéro {rcs.number}</Nowrap>.
          </>
        ) : (
          <>
            {" "}
            <Nowrap>{legal.rcs}</Nowrap>.
          </>
        )}
      </p>
      <p>
        Siège social : {streetLine()}, <Nowrap>{cityLine()}</Nowrap>.
        <br />
        Téléphone :{" "}
        <TextLink href={agency.phone.href}>
          <Nowrap>{agency.phone.display}</Nowrap>
        </TextLink>
        .
        {agency.email ? (
          <>
            <br />
            E-mail :{" "}
            <TextLink href={`mailto:${agency.email}`}>{agency.email}</TextLink>.
          </>
        ) : null}
      </p>
      <p>
        Vous pouvez aussi nous écrire par le{" "}
        <TextLink href="/contact">formulaire de contact</TextLink>.
      </p>
      {legal.publicationDirector ? (
        <p>Directeur de la publication : {legal.publicationDirector}.</p>
      ) : null}

      <h2 id="activite">Activité réglementée</h2>
      <p>
        Le cabinet exerce une activité de transaction sur immeubles et fonds de
        commerce, encadrée par la loi <Nowrap>n° 70-9</Nowrap> du{" "}
        <Nowrap>2 janvier 1970</Nowrap>, dite loi Hoguet, et par son décret
        d’application <Nowrap>n° 72-678</Nowrap> du{" "}
        <Nowrap>20 juillet 1972</Nowrap>.
      </p>
      <ul>
        <li>
          Carte professionnelle mention « Transactions sur immeubles et fonds de
          commerce » <Nowrap>n° {legal.cardNumber}</Nowrap>, délivrée par la{" "}
          <Nowrap>{legal.cardIssuer}</Nowrap>.
        </li>
        <li>
          Garant financier : <Nowrap>{legal.guarantorName}</Nowrap>
          {legal.guarantorAddress ? `, ${legal.guarantorAddress}` : ""}.
        </li>
      </ul>
      <p>
        Nos honoraires sont présentés sur la page{" "}
        <TextLink href="/honoraires">Nos honoraires</TextLink>, conformément à
        l’arrêté du <Nowrap>10 janvier 2017</Nowrap> relatif à l’information des
        consommateurs par les professionnels intervenant dans une transaction
        immobilière.
      </p>

      <h2 id="reclamations">{claimsTitle}</h2>
      <p>
        Pour toute réclamation, écrivez-⁠nous : par courrier au {agency.name},{" "}
        {streetLine()}, <Nowrap>{cityLine()}</Nowrap>
        {agency.email ? (
          <>
            , par e-mail à{" "}
            <TextLink href={`mailto:${agency.email}`}>{agency.email}</TextLink>
          </>
        ) : null}
        , ou par le <TextLink href="/contact">formulaire de contact</TextLink>.
      </p>
      {mediator ? (
        <p>
          Si notre réponse ne vous satisfait pas, ou si vous n’en avez pas reçu,
          vous pouvez saisir gratuitement le médiateur de la consommation dont
          nous relevons, dans un délai d’un an à compter de votre réclamation
          écrite : {mediator.name}, {mediator.address},{" "}
          <TextLink href={mediator.url} className="break-all">
            {mediator.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </TextLink>
          .
        </p>
      ) : null}

      <h2 id="hebergement">Hébergement</h2>
      {siteHost ? (
        <p>
          Le site est hébergé par <ProviderLine provider={siteHost} />.
        </p>
      ) : null}
      <p>
        Les annonces et les demandes envoyées par les formulaires sont traitées
        par le serveur d’application du cabinet, hébergé par{" "}
        <ProviderLine provider={processors.api} />.
      </p>
      <p>
        Elles sont enregistrées dans une base de données fournie par{" "}
        <ProviderLine provider={processors.database} />, sur des serveurs situés{" "}
        {DATABASE_LOCATION}.
      </p>

      <h2 id="propriete">Propriété intellectuelle et crédits</h2>
      <p>
        Les textes, le logotype et les illustrations de ce site ont été créés
        pour le {agency.name}. Les photographies des biens sont publiées dans le
        cadre des mandats confiés au cabinet. Toute reproduction, même
        partielle, sans notre autorisation écrite est interdite.
      </p>
      <ul>
        <li>
          Illustrations : dessins au trait réalisés pour le cabinet, les uns à
          l’aide d’un outil de génération d’images puis retouchés, les autres
          tracés directement.
        </li>
        <li>
          Polices de caractères : Spectral et Hanken Grotesk, sous licence SIL
          Open Font License <Nowrap>1.1</Nowrap>.
        </li>
        <li>Icônes : Lucide, sous licence ISC.</li>
      </ul>

      <h2 id="donnees">Données personnelles</h2>
      <p>
        Ce site ne dépose aucun cookie et n’utilise aucun outil de mesure
        d’audience. L’usage que nous faisons des informations envoyées par nos
        formulaires, et la façon d’exercer vos droits, sont détaillés sur la
        page <TextLink href="/confidentialite">Confidentialité</TextLink>.
      </p>
    </ProsePage>
  );
}
