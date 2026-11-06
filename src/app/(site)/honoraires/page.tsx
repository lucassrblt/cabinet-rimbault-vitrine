import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { RentalFeesTable, SaleFeesTable } from "@/components/owners/FeesTable";
import { OwnerSection } from "@/components/owners/OwnerSection";
import { PrintButton } from "@/components/owners/PrintButton";
import { fr, frNode, phoneLabel } from "@/components/owners/typo";
import { TextLink } from "@/components/ui/TextLink";
import { feeSchedule } from "@/content/honoraires";
import { agency } from "@/lib/agency";
import { pageMetadata } from "@/lib/seo/metadata";
import "./impression.css";

// Nos honoraires (doc 04 §2.8, brief §9, lot 4). Barème en HTML, tableaux
// accessibles, feuille d'impression (impression.css). Tant que le barème n'est
// pas fourni (`feeSchedule` à `null`, brief §10-2), la page n'affiche aucun
// tableau : seulement ce qui est vrai quel que soit le barème, et le moyen de
// l'obtenir. `check-launch` bloque alors la mise en production.

export const metadata: Metadata = pageMetadata({
  title: "Nos honoraires de vente et de location",
  // Sans barème publié, la description ne l'annonce pas (brief §10-2).
  description: feeSchedule
    ? "Le barème des honoraires du Cabinet Rimbault pour la vente et la location d’appartements et de maisons à Asnières-sur-Seine."
    : "Les honoraires du Cabinet Rimbault pour la vente et la location à Asnières-sur-Seine : qui les paie, ce que la loi encadre, comment obtenir notre barème.",
  path: "/honoraires",
});

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** « 1er janvier 2026 » (« er » en exposant, `frNode`), chiffres liés. */
function effectiveDateLabel(iso: string): ReactNode {
  return frNode(
    dateFormat
      .format(new Date(`${iso}T00:00:00Z`))
      .replace(/^1 /, "1er ")
      .replace(/ /g, "\u00a0"),
  );
}

const RENTAL_LAW = [
  "Les honoraires de mise en location sont à la charge du propriétaire, à l'exception de la visite, de la constitution du dossier, de la rédaction du bail et de l'état des lieux, partagés avec le locataire.",
  "La loi plafonne la part du locataire : elle ne peut dépasser celle du propriétaire, ni un montant par mètre carré de surface habitable fixé par décret (loi du 6 juillet 1989, article 5).",
];

function Contact({ start = false }: { start?: boolean }) {
  return (
    <>
      {start ? "Appelez-\u2060nous" : "appelez-\u2060nous"} au{" "}
      <TextLink href={agency.phone.href} className="whitespace-nowrap">
        {phoneLabel(agency.phone.display)}
      </TextLink>
    </>
  );
}

export default function Page() {
  if (!feeSchedule) {
    return (
      <>
        <PageIntro
          title="Nos honoraires"
          lead={
            <p>
              {fr(
                "Chaque annonce indique qui paie nos honoraires et, lorsqu’ils sont à la charge de l’acquéreur ou du locataire, leur montant toutes taxes comprises.",
              )}
            </p>
          }
        />
        <OwnerSection id="vente" title="Vente">
          <div className="ui-prose">
            <p>
              {fr(
                "À la vente, ils sont à la charge du vendeur ou de l'acquéreur, selon ce que prévoit le mandat. Lorsqu'ils sont à la charge de l'acquéreur, l'annonce donne aussi leur pourcentage et le prix hors honoraires.",
              )}
            </p>
            <p>
              Pour recevoir notre barème complet, <Contact />.
            </p>
          </div>
        </OwnerSection>
        <OwnerSection id="location" title="Location">
          <div className="ui-prose">
            {RENTAL_LAW.map((p) => (
              <p key={p}>{fr(p)}</p>
            ))}
          </div>
        </OwnerSection>
      </>
    );
  }

  const { sale, rental, notes } = feeSchedule;
  return (
    <div data-bareme="">
      <PageIntro
        title="Nos honoraires"
        lead={
          <p>
            Barème en vigueur depuis le{" "}
            {effectiveDateLabel(feeSchedule.effectiveDate)}. Honoraires toutes
            taxes comprises, TVA à{" "}20{" "}%.
          </p>
        }
      />
      <OwnerSection id="vente" title="Vente">
        <SaleFeesTable rows={sale.rows} />
        <div className="ui-prose mt-8">
          <p>{fr(sale.payer)}</p>
          {sale.example ? <p>{fr(sale.example)}</p> : null}
        </div>
      </OwnerSection>
      <OwnerSection id="location" title="Location">
        <RentalFeesTable rows={rental.rows} />
        <div className="ui-prose mt-8">
          {RENTAL_LAW.map((p) => (
            <p key={p}>{fr(p)}</p>
          ))}
        </div>
      </OwnerSection>
      <OwnerSection id="mentions" title="Bon à savoir">
        <div className="ui-prose">
          <p>{fr("Les honoraires sont indiqués sur chaque annonce.")}</p>
          {notes?.map((note) => (
            <p key={note}>{fr(note)}</p>
          ))}
          <p className="print:hidden">
            Une question sur nos honoraires{" "}? <Contact start />.
          </p>
        </div>
        <div className="mt-8">
          <PrintButton />
        </div>
      </OwnerSection>
    </div>
  );
}
