import type { FaqEntry } from "./faq-types";

// Questions fréquentes de la page Louer (doc 04 §2.6, lot 4).
// Non publiées tant que l'agent n'a pas répondu (brief §10, point 10) :
// « Assurez-vous la gestion locative ? », « Qui réalise l'état des lieux ? »,
// « Proposez-vous une garantie de loyers impayés ? », « En combien de temps
// trouvez-vous un locataire ? ».

export const faqLocation: readonly FaqEntry[] = [
  {
    question: "Comment fixez-vous le loyer ?",
    answer: [
      "Nous visitons d’abord le logement. Nous fixons ensuite le loyer d’après les loyers pratiqués pour des logements comparables du quartier, l’état du logement et les règles qui encadrent l’évolution des loyers.",
    ],
  },
  {
    question: "Quelles pièces demandez-vous aux candidats ?",
    answer: [
      "Seulement celles que la loi autorise (décret du 5 novembre 2015) : une pièce d’identité, un justificatif de domicile, des justificatifs de situation professionnelle et de ressources. Les mêmes pièces peuvent être demandées à la personne qui se porte garante.",
    ],
  },
  {
    question: "Quel dépôt de garantie demander ?",
    answer: [
      "Pour un logement vide, il ne peut dépasser un mois de loyer hors charges ; pour un logement meublé, deux mois.",
      "Il est restitué dans le mois qui suit la remise des clés si l’état des lieux de sortie est conforme à celui d’entrée, dans les deux mois sinon.",
    ],
  },
  {
    question: "L’état des lieux est-il obligatoire ?",
    answer: [
      "Oui. Il est établi à l’entrée et à la sortie du locataire, en présence des deux parties ou de leurs représentants, et joint au bail. C’est la comparaison des deux qui permet de retenir sur le dépôt de garantie le coût d’éventuelles réparations.",
    ],
  },
  {
    question: "Quels diagnostics joindre au bail ?",
    answer: [
      "Le diagnostic de performance énergétique, l’état des risques et, selon l’âge du logement et de ses installations, les constats plomb, électricité et gaz.",
      "Depuis le 1er janvier 2025, un logement classé G ne peut plus faire l’objet d’un nouveau bail. Ce sera le cas des logements classés F en 2028, puis E en 2034.",
    ],
  },
];
