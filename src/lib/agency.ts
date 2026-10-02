// Informations de l'agence. Les valeurs marquées « à confirmer » attendent
// la validation de l'agent (cf. docs/brief.md §9).
export const agency = {
  name: "Cabinet Rimbault",
  tagline: "Transactions immobilières",
  since: 2009,
  address: {
    street: "117 boulevard Voltaire",
    postalCode: "92600",
    city: "Asnières-sur-Seine",
  },
  phone: { display: "01 73 64 56 10", href: "tel:+33173645610" },
  // à confirmer
  hours: [
    { days: "Lundi", time: "sur rendez-vous" },
    { days: "Mardi au vendredi", time: "9 h – 19 h" },
    { days: "Samedi", time: "9 h – 18 h" },
  ],
  google: {
    rating: "4,9",
    count: 32,
    href: "https://www.google.com/maps/search/Cabinet+Rimbault+Asni%C3%A8res",
  },
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=117+boulevard+Voltaire+92600+Asni%C3%A8res-sur-Seine",
  // À fournir par l'agent (cf. docs/brief.md §9).
  whatsapp: null as string | null,
  legal: {
    card: "Carte professionnelle CPI 9201 2018 000 024 838, CCI Paris Île-de-France",
    company: "SAS au capital de 4 000 €, RCS Nanterre 511 484 586",
    guarantor: "Garant financier : LLOYD’S France",
    mediator: null as string | null,
  },
} as const;

export const commitments = [
  {
    title: "Nous refusons les estimations gonflées.",
    text: "Un prix trop haut fait perdre des mois et décote le bien. Si nous ne croyons pas au prix espéré, nous le disons, quitte à ne pas prendre le mandat.",
  },
  {
    title: "Un seul interlocuteur, du premier rendez-vous au notaire.",
    text: "La personne qui estime votre bien est celle qui le fait visiter, le négocie et vous suit jusqu’à la signature. Pas de transfert de dossier, pas de standard.",
  },
  {
    title: "Un périmètre que nous connaissons rue par rue.",
    text: "Asnières-sur-Seine et les communes voisines. Au-delà, nous préférons vous adresser à quelqu’un dont c’est le terrain.",
  },
];
