import type { Metadata } from "next";
import { amount, cityLine, streetLine } from "@/components/layout/typo";
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
import { Insec, Lien, PageTexte } from "@/variantes/galerie/texte/Texte";

// Mentions légales (thème Galerie, texte de la refonte, lot 7, doc 04
// §2.10) : LCEN art. 1-1 (éditeur, directeur de la publication, hébergeur), loi Hoguet (carte, garant), Code de la
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

/** « Raison sociale, adresse, tél., site » : une seule forme pour chaque prestataire. */
function ProviderLine({ provider }: { provider: Provider }) {
  return (
    <>
      <Insec>{provider.name}</Insec>, {provider.address}
      {provider.phone ? (
        <>
          , téléphone <Insec>{provider.phone}</Insec>
        </>
      ) : null}
      , <Lien href={`https://${provider.url}`}>{provider.url}</Lien>
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
    <PageTexte title="Mentions légales" updatedAt={LEGAL_UPDATED_AT} toc={toc}>
      <h2 id="editeur">Éditeur du site</h2>
      <p>
        Ce site est édité par le {agency.name}, société par actions simplifiée (
        {legal.legalForm}) au capital de <Insec>{amount(legal.capital)}</Insec>,
        {rcs ? (
          <>
            {" "}
            immatriculée au registre du commerce et des sociétés de {rcs.city}{" "}
            sous le <Insec>numéro {rcs.number}</Insec>.
          </>
        ) : (
          <>
            {" "}
            <Insec>{legal.rcs}</Insec>.
          </>
        )}
      </p>
      <p>
        Siège social : {streetLine()}, <Insec>{cityLine()}</Insec>.
        <br />
        Téléphone :{" "}
        <Lien href={agency.phone.href}>
          <Insec>{agency.phone.display}</Insec>
        </Lien>
        .
        {agency.email ? (
          <>
            <br />
            E-mail : <Lien href={`mailto:${agency.email}`}>{agency.email}</Lien>
            .
          </>
        ) : null}
      </p>
      <p>
        Vous pouvez aussi nous écrire par le{" "}
        <Lien href="/contact">formulaire de contact</Lien>.
      </p>
      {legal.publicationDirector ? (
        <p>Directeur de la publication : {legal.publicationDirector}.</p>
      ) : null}

      <h2 id="activite">Activité réglementée</h2>
      <p>
        Le cabinet exerce une activité de transaction sur immeubles et fonds de
        commerce, encadrée par la loi <Insec>n° 70-9</Insec> du{" "}
        <Insec>2 janvier 1970</Insec>, dite loi Hoguet, et par son décret
        d’application <Insec>n° 72-678</Insec> du <Insec>20 juillet 1972</Insec>
        .
      </p>
      <ul>
        <li>
          Carte professionnelle mention « Transactions sur immeubles et fonds de
          commerce » <Insec>n° {legal.cardNumber}</Insec>, délivrée par la{" "}
          <Insec>{legal.cardIssuer}</Insec>.
        </li>
        <li>
          Garant financier : <Insec>{legal.guarantorName}</Insec>
          {legal.guarantorAddress ? `, ${legal.guarantorAddress}` : ""}.
        </li>
      </ul>
      <p>
        Nos honoraires sont présentés sur la page{" "}
        <Lien href="/honoraires">Nos honoraires</Lien>, conformément à l’arrêté
        du <Insec>10 janvier 2017</Insec> relatif à l’information des
        consommateurs par les professionnels intervenant dans une transaction
        immobilière.
      </p>

      <h2 id="reclamations">{claimsTitle}</h2>
      <p>
        Pour toute réclamation, écrivez-⁠nous : par courrier au {agency.name},{" "}
        {streetLine()}, <Insec>{cityLine()}</Insec>
        {agency.email ? (
          <>
            , par e-mail à{" "}
            <Lien href={`mailto:${agency.email}`}>{agency.email}</Lien>
          </>
        ) : null}
        , ou par le <Lien href="/contact">formulaire de contact</Lien>.
      </p>
      {mediator ? (
        <p>
          Si notre réponse ne vous satisfait pas, ou si vous n’en avez pas reçu,
          vous pouvez saisir gratuitement le médiateur de la consommation dont
          nous relevons, dans un délai d’un an à compter de votre réclamation
          écrite : {mediator.name}, {mediator.address},{" "}
          <Lien href={mediator.url}>
            {mediator.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </Lien>
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
          Open Font License <Insec>1.1</Insec>.
        </li>
        <li>Icônes : Lucide, sous licence ISC.</li>
      </ul>

      <h2 id="donnees">Données personnelles</h2>
      <p>
        Ce site ne dépose aucun cookie et n’utilise aucun outil de mesure
        d’audience. L’usage que nous faisons des informations envoyées par nos
        formulaires, et la façon d’exercer vos droits, sont détaillés sur la
        page <Lien href="/confidentialite">Confidentialité</Lien>.
      </p>
    </PageTexte>
  );
}
