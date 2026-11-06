import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ProsePage } from "@/components/layout/ProsePage";
import { amount, cityLine, streetLine } from "@/components/layout/typo";
import { TextLink } from "@/components/ui/TextLink";
import {
  addressLookup,
  DATABASE_LOCATION,
  dataRetention,
  ESTIMATION_DRAFT,
  LEGAL_UPDATED_AT,
  PRIVACY_TOC,
  processors,
  siteHost,
} from "@/content/legal";
import { agency } from "@/lib/agency";
import { pageMetadata } from "@/lib/seo/metadata";

// Confidentialité (lot 7, doc 04 §2.10) : information RGPD art. 13 pour les
// deux formulaires du site (estimation, contact). Champs relevés dans
// `lib/forms/*-schema.ts` et `lib/estimation/payload.ts` ; prestataires et
// transferts sourcés dans `content/legal.ts`. Une donnée inconnue masque sa
// phrase, sans marqueur ; check-launch bloque la mise en production.

export const metadata: Metadata = pageMetadata({
  title: "Confidentialité et données personnelles",
  description:
    "Comment nous utilisons les informations envoyées par les formulaires du site, combien de temps nous les conservons et comment exercer vos droits.",
  path: "/confidentialite",
});

const { legal } = agency;

function Nowrap({ children }: { children: ReactNode }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

function EmailLink() {
  return agency.email ? (
    <TextLink href={`mailto:${agency.email}`}>{agency.email}</TextLink>
  ) : null;
}

export default function Page() {
  return (
    <ProsePage
      title="Confidentialité"
      updatedAt={LEGAL_UPDATED_AT}
      toc={PRIVACY_TOC}
    >
      <p>
        Cette page explique ce que nous faisons des informations que vous nous
        confiez par les formulaires du site, et comment garder la main sur
        elles.
      </p>

      <h2 id="responsable">Responsable du traitement</h2>
      <p>
        Le responsable du traitement est le {agency.name}, {legal.legalForm} au
        capital de <Nowrap>{amount(legal.capital)}</Nowrap>,{" "}
        <Nowrap>{legal.rcs}</Nowrap>, {streetLine()},{" "}
        <Nowrap>{cityLine()}</Nowrap>, téléphone{" "}
        <TextLink href={agency.phone.href}>
          <Nowrap>{agency.phone.display}</Nowrap>
        </TextLink>
        {agency.email ? (
          <>
            , e-mail <EmailLink />
          </>
        ) : null}
        .
      </p>

      <h2 id="donnees">Données collectées</h2>
      <p>
        Nous ne recueillons que ce que vous saisissez dans nos deux formulaires.
        Seuls les champs signalés comme obligatoires doivent être remplis.
      </p>
      <h3>Demande d’estimation</h3>
      <ul>
        <li>
          ce que vous souhaitez faire estimer : le prix de vente ou le loyer ;
        </li>
        <li>
          votre bien : son type, son code postal et, si vous les indiquez, son
          adresse et sa ville ;
        </li>
        <li>
          ses caractéristiques : surface, nombre de pièces et, si vous les
          indiquez, chambres, salles d’eau, niveaux, étage, ascenseur, surface
          du terrain, extérieurs et annexes, état général, époque de
          construction, travaux récents ;
        </li>
        <li>
          vous : prénom, nom, adresse e-mail et, si vous les indiquez,
          téléphone, façon et moment préférés pour être recontacté, message.
        </li>
      </ul>
      <h3>Message envoyé depuis la page Contact ou la fiche d’un bien</h3>
      <ul>
        <li>
          l’objet de votre message et, le cas échéant, la référence du bien ;
        </li>
        <li>
          vous : prénom, nom, adresse e-mail, téléphone si vous l’indiquez,
          message.
        </li>
      </ul>
      <p>
        Avec chaque demande, nous enregistrons aussi sa date, votre accord (la
        case cochée avant l’envoi), le type de navigateur utilisé et l’adresse
        de la page d’où provient la demande.
      </p>
      <p>
        Comme tout serveur, ceux qui hébergent le site tiennent par ailleurs des
        journaux techniques (adresse IP, date, page demandée), utilisés pour la
        sécurité et le bon fonctionnement du service.
      </p>

      <h2 id="finalites">Finalités et base légale</h2>
      <p>Ces informations nous servent uniquement à :</p>
      <ul>
        <li>
          {
            "répondre à votre demande et vous recontacter comme vous l’avez choisi ;"
          }
        </li>
        <li>préparer l’estimation de votre bien ;</li>
        <li>vous renseigner sur un bien ou organiser une visite ;</li>
        <li>assurer le suivi de nos échanges.</li>
      </ul>
      <p>
        Elles ne sont ni vendues ni cédées, et ne servent à aucune autre fin,
        notamment publicitaire.
      </p>
      <p>
        Leur traitement repose sur votre consentement, donné en cochant la case
        prévue avant l’envoi (article 6, paragraphe 1, a du RGPD). Vous pouvez
        le retirer à tout moment, sans remettre en cause ce qui a été fait
        auparavant. Lorsque votre demande porte sur la vente ou la location d’un
        bien, ce traitement est aussi nécessaire aux mesures précontractuelles
        prises à votre demande (article 6, paragraphe 1, b). Les journaux
        techniques reposent sur notre intérêt légitime à protéger le site
        (article 6, paragraphe 1, f).
      </p>

      <h2 id="destinataires">Destinataires</h2>
      <p>
        Vos demandes sont lues uniquement par le cabinet. Nous ne les
        transmettons à aucun tiers à des fins commerciales.
      </p>
      <p>
        Pour fonctionner, le site s’appuie sur des prestataires techniques qui
        traitent ces données pour notre compte, sur nos instructions, sans
        pouvoir les utiliser pour eux-mêmes :
      </p>
      <ul>
        {siteHost ? <li>{siteHost.name} : hébergement du site ;</li> : null}
        <li>
          {processors.api.name} (États-Unis) : hébergement du serveur qui reçoit
          les formulaires ;
        </li>
        <li>
          {processors.database.name} (Singapour) : base de données où les
          demandes sont enregistrées, sur des serveurs situés{" "}
          {DATABASE_LOCATION} ;
        </li>
        <li>
          {processors.email.brand} ({processors.email.name}, États-Unis) : envoi
          de l’accusé de réception qui vous est adressé et de la notification
          reçue par le cabinet.
        </li>
      </ul>
      <p>
        Certains de ces prestataires sont établis hors de l’Union européenne.
        Les transferts de données vers eux sont encadrés par les clauses
        contractuelles types adoptées par la Commission européenne, prévues dans
        leurs contrats de sous-traitance, et, pour {processors.email.brand}, par
        le cadre de protection des données entre l’Union européenne et les
        États-Unis.
      </p>
      <p>
        Pendant que vous saisissez l’adresse du bien, ce que vous tapez est
        envoyé à la {addressLookup.service} de l’{addressLookup.name}{" "}
        <Nowrap>({addressLookup.shortName})</Nowrap>, service public, pour vous
        proposer des adresses existantes. Aucune autre information du formulaire
        n’est transmise.
      </p>

      <h2 id="conservation">Durée de conservation</h2>
      {dataRetention ? (
        <p>Vos demandes sont conservées {dataRetention}, puis supprimées.</p>
      ) : (
        <p>
          Vos demandes sont conservées le temps nécessaire pour y répondre et
          assurer le suivi de nos échanges, puis supprimées.
        </p>
      )}
      <p>
        Si vous nous confiez ensuite un mandat, les informations qui s’y
        rapportent sont conservées pendant les durées imposées par la
        réglementation des professions immobilières.
      </p>

      <h2 id="droits">Vos droits</h2>
      <p>
        Vous disposez d’un droit d’accès, de rectification, d’effacement, de
        limitation et d’opposition sur vos données, ainsi que d’un droit à leur
        portabilité. Vous pouvez aussi retirer votre consentement à tout moment
        et définir des directives sur le sort de vos données après votre décès.
      </p>
      <p>
        Pour exercer ces droits, écrivez-⁠nous
        {agency.email ? (
          <>
            {" "}
            par e-mail à <EmailLink />,
          </>
        ) : null}{" "}
        par courrier au {agency.name}, {streetLine()},{" "}
        <Nowrap>{cityLine()}</Nowrap>, ou par le{" "}
        <TextLink href="/contact">formulaire de contact</TextLink>. Nous vous
        répondons dans un délai d’un mois, comme le prévoit le RGPD.
      </p>
      <p>
        Si vous estimez, après nous avoir contactés, que vos droits ne sont pas
        respectés, vous pouvez adresser une réclamation à la Commission
        nationale de l’informatique et des libertés (CNIL),{" "}
        <Nowrap>3 place</Nowrap> de Fontenoy, TSA 80715,{" "}
        <Nowrap>75334 Paris</Nowrap> Cedex 07, ou en ligne sur{" "}
        <TextLink
          href="https://www.cnil.fr/fr/plaintes"
          className="whitespace-nowrap"
        >
          cnil.fr
        </TextLink>
        .
      </p>

      <h2 id="demarchage">Démarchage téléphonique</h2>
      <p>
        Nous n’utilisons votre numéro que pour répondre à votre demande. Si vous
        ne souhaitez pas faire l’objet de prospection commerciale par téléphone,
        vous pouvez vous inscrire gratuitement sur la liste d’opposition au
        démarchage téléphonique Bloctel, sur{" "}
        <TextLink
          href="https://www.bloctel.gouv.fr"
          className="whitespace-nowrap"
        >
          bloctel.gouv.fr
        </TextLink>
        .
      </p>

      <h2 id="cookies">Cookies et stockage dans le navigateur</h2>
      <p>
        Ce site ne dépose aucun cookie et n’utilise aucun traceur ni outil de
        mesure d’audience : aucun bandeau ne vous demande donc votre accord. Les
        polices de caractères sont servies par le site lui-même, sans appel à un
        service tiers.
      </p>
      <p>
        Pendant que vous remplissez le formulaire d’estimation, vos réponses
        sont gardées dans le stockage de session de votre navigateur, pour que
        vous puissiez revenir en arrière sans rien perdre. Elles ne nous sont
        transmises qu’à l’envoi. Elles sont effacées à la fermeture de l’onglet,
        dès l’envoi de la demande, ou si vous choisissez{" "}
        <Nowrap>« Recommencer »</Nowrap>. Au-delà de{" "}
        <Nowrap>{ESTIMATION_DRAFT.maxHours} heures</Nowrap>, elles ne sont plus
        reprises. Ce stockage, strictement nécessaire au service que vous
        demandez, ne requiert pas votre accord.
      </p>
    </ProsePage>
  );
}
