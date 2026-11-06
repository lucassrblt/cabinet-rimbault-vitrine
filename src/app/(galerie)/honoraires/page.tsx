import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fr, frNode, phoneLabel } from "@/components/owners/typo";
import { feeSchedule } from "@/content/honoraires";
import { agency } from "@/lib/agency";
import { pageMetadata } from "@/lib/seo/metadata";
import { Imprimer } from "@/variantes/galerie/texte/Imprimer";
import { Lien, PageTexte } from "@/variantes/galerie/texte/Texte";
import t from "@/variantes/galerie/texte/texte.module.css";

// Nos honoraires (thème Galerie, texte de la refonte, doc 04 §2.8, lot 4).
// Barème en tableaux accessibles, imprimable (règles d'impression de
// `texte.module.css`, portée `[data-bareme]`). Tant que le barème n'est pas
// fourni (`feeSchedule` à `null`, brief §10-2), la page n'affiche aucun
// tableau : seulement ce qui est vrai quel que soit le barème, et le moyen de
// l'obtenir. `check-launch` bloque alors la mise en production.

export const metadata: Metadata = pageMetadata({
  title: "Nos honoraires de vente et de location",
  // Sans barème publié, la description ne l'annonce pas (brief §10-2).
  description: feeSchedule
    ? "Le barème des honoraires du Cabinet Rimbault pour la vente et la location d’appartements et de maisons à Asnières-sur-Seine."
    : "Les honoraires du Cabinet Rimbault pour la vente et la location à Asnières-sur-Seine : qui les paie, ce que la loi encadre, comment obtenir notre barème.",
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
      .replace(/ /g, " "),
  );
}

const RENTAL_LAW = [
  "Les honoraires de mise en location sont à la charge du propriétaire, à l'exception de la visite, de la constitution du dossier, de la rédaction du bail et de l'état des lieux, partagés avec le locataire.",
  "La loi plafonne la part du locataire : elle ne peut dépasser celle du propriétaire, ni un montant par mètre carré de surface habitable fixé par décret (loi du 6 juillet 1989, article 5).",
];

function Contact({ start = false }: { start?: boolean }) {
  return (
    <>
      {start ? "Appelez-⁠nous" : "appelez-⁠nous"} au{" "}
      <Lien href={agency.phone.href}>{phoneLabel(agency.phone.display)}</Lien>
    </>
  );
}

const LEAD =
  "Chaque annonce indique qui paie nos honoraires et, lorsqu’ils sont à la charge de l’acquéreur ou du locataire, leur montant toutes taxes comprises.";

export default function Page() {
  if (!feeSchedule) {
    return (
      <PageTexte title="Nos honoraires" lead={<p>{fr(LEAD)}</p>}>
        <h2 id="vente">Vente</h2>
        <p>
          {fr(
            "À la vente, ils sont à la charge du vendeur ou de l'acquéreur, selon ce que prévoit le mandat. Lorsqu'ils sont à la charge de l'acquéreur, l'annonce donne aussi leur pourcentage et le prix hors honoraires.",
          )}
        </p>
        <p>
          Pour recevoir notre barème complet, <Contact />.
        </p>
        <h2 id="location">Location</h2>
        {RENTAL_LAW.map((p) => (
          <p key={p}>{fr(p)}</p>
        ))}
      </PageTexte>
    );
  }

  const { sale, rental, notes } = feeSchedule;
  return (
    <PageTexte
      data-bareme=""
      title="Nos honoraires"
      lead={
        <p>
          Barème en vigueur depuis le{" "}
          {effectiveDateLabel(feeSchedule.effectiveDate)}. Honoraires toutes
          taxes comprises, TVA à{" "}20{" "}%.
        </p>
      }
    >
      <h2 id="vente">Vente</h2>
      <table>
        <caption>Honoraires de vente, selon le prix de vente</caption>
        <thead>
          <tr>
            <th scope="col">Prix de vente</th>
            <th scope="col" className={t.fin}>
              Honoraires TTC
            </th>
          </tr>
        </thead>
        <tbody>
          {sale.rows.map((row) => (
            <tr key={row.range}>
              <th scope="row">{fr(row.range)}</th>
              <td className={t.fin} data-label="Honoraires TTC">
                {fr(row.fee)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{fr(sale.payer)}</p>
      {sale.example ? <p>{fr(sale.example)}</p> : null}

      <h2 id="location">Location</h2>
      <table>
        <caption>Honoraires de location</caption>
        <thead>
          <tr>
            <th scope="col">Prestation</th>
            <th scope="col" className={t.fin}>
              Part du locataire
            </th>
            <th scope="col" className={t.fin}>
              Part du propriétaire
            </th>
          </tr>
        </thead>
        <tbody>
          {rental.rows.map((row) => (
            <tr key={row.service}>
              <th scope="row">{fr(row.service)}</th>
              <td className={t.fin} data-label="Part du locataire">
                {fr(row.tenant)}
              </td>
              <td className={t.fin} data-label="Part du propriétaire">
                {fr(row.landlord)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {RENTAL_LAW.map((p) => (
        <p key={p}>{fr(p)}</p>
      ))}

      <h2 id="mentions">Bon à savoir</h2>
      <p>{fr("Les honoraires sont indiqués sur chaque annonce.")}</p>
      {notes?.map((note) => (
        <p key={note}>{fr(note)}</p>
      ))}
      <p className={t.ecran}>
        Une question sur nos honoraires{" "}? <Contact start />.
      </p>
      <Imprimer />
    </PageTexte>
  );
}
