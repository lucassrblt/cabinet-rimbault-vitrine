import type { FaqEntry } from "./faq-types";

// Questions fréquentes de la page Vendre (doc 04 §2.5, lot 4).
// Non publiées tant que l'agent n'a pas répondu (brief §10, points 9 et 12) :
// « Combien coûte une estimation ? », « Combien de temps prend une vente ? »,
// « Faut-il signer un mandat exclusif ? ».

export const faqVente: readonly FaqEntry[] = [
  {
    question: "Faut-il signer un mandat pour vendre avec vous ?",
    answer: [
      "Oui. La loi impose un mandat écrit avant toute mise en vente par une agence (loi Hoguet du 2 janvier 1970). Il fixe le prix de mise en vente, la durée de notre mission et le montant de nos honoraires.",
    ],
  },
  {
    question: "Qui paie les honoraires ?",
    answer: [
      "Le mandat précise s’ils sont à la charge du vendeur ou de l’acquéreur. L’annonce l’indique toujours, avec leur montant toutes taxes comprises ; lorsqu’ils sont à la charge de l’acquéreur, elle donne aussi leur pourcentage et le prix hors honoraires (arrêté du 10 janvier 2017).",
    ],
  },
  {
    question: "Quels documents préparer ?",
    answer: [
      "Le titre de propriété, le dernier avis de taxe foncière et le dossier de diagnostic technique : diagnostic de performance énergétique, état des risques et, selon l’âge et la situation du bien, les diagnostics amiante, plomb, électricité, gaz, termites ou assainissement.",
      "Pour une maison classée E, F ou G au DPE, un audit énergétique s’y ajoute.",
      "Pour un appartement s’y ajoutent le mesurage de la surface privative (loi Carrez), le règlement de copropriété, les procès-verbaux des assemblées générales des trois dernières années et le montant des charges des deux derniers exercices.",
    ],
  },
  {
    question: "Que se passe-t-il une fois l’offre acceptée ?",
    answer: [
      "Vous signez avec l’acquéreur un avant-contrat, le plus souvent un compromis de vente. L’acquéreur dispose alors d’un délai de rétractation de dix jours. Le compromis prévoit en général des conditions suspensives, dont l’obtention de son prêt.",
      "La vente est conclue par la signature de l’acte authentique chez le notaire.",
    ],
  },
  {
    question: "Intervenez-vous en dehors d’Asnières-sur-Seine ?",
    answer: [
      "Dans les communes voisines, oui. Au-delà, nous préférons vous adresser à quelqu’un dont c’est le terrain.",
    ],
  },
];
