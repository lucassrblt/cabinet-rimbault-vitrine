import { TextLink } from "@/components/ui/TextLink";
import { feeSchedule } from "@/content/honoraires";
import { fr } from "./typo";

// Résumé des honoraires sur Vendre et Louer (doc 04 §2.5-4 et §2.6-4).
// Barème renseigné : sa phrase de résumé et le lien vers /honoraires.
// Barème absent (brief §10-2) : uniquement des règles vraies quel que soit
// le barème (montant TTC fixé au mandat, plafonds légaux de la location), et
// aucun lien vers un barème qui n'est pas encore publié. Vente : une phrase,
// la charge (vendeur ou acquéreur) est dans la FAQ « Qui paie les honoraires ? ».

const NEUTRE = {
  vente: [
    "Leur montant, toutes taxes comprises, est fixé dans le mandat que nous signons ensemble.",
  ],
  location: [
    "Les honoraires de mise en location sont à la charge du propriétaire, à l'exception de la visite, de la constitution du dossier, de la rédaction du bail et de l'état des lieux, partagés avec le locataire.",
    "La loi plafonne la part du locataire : elle ne peut dépasser celle du propriétaire, ni un montant par mètre carré de surface habitable fixé par décret (loi du 6 juillet 1989, article 5).",
  ],
} as const;

export function FeesSummary({ kind }: { kind: "vente" | "location" }) {
  const paragraphs = feeSchedule
    ? [kind === "vente" ? feeSchedule.sale.summary : feeSchedule.rental.summary]
    : NEUTRE[kind];
  return (
    <div className="ui-prose">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{fr(paragraph)}</p>
      ))}
      {feeSchedule ? (
        <p>
          <TextLink href="/honoraires">
            Consulter notre barème d’honoraires
          </TextLink>
        </p>
      ) : null}
    </div>
  );
}
