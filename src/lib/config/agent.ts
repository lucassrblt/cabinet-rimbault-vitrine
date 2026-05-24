export const AGENT = {
  firstName: "Xavier",
  lastName: "Rimbault",
  fullName: "Xavier Rimbault",
  title: "Agent immobilier",
  phoneE164: "0173645610",
  phoneDisplay: "0173645610",
  email: "xrimbault@numericable.fr",
  whatsappUrl: "TODO",
  instagram: "TODO",
  linkedin: "TODO",
  googleBusinessUrl: "TODO",
  address: {
    line1: "117 Boulevard Voltaire",
    postalCode: "92600",
    city: "Asnières-sur-Seine",
  },
  hours: {
    monday: "Lundi : sur RDV",
    weekdays: "Mardi – Vendredi : 9h – 19h",
    saturday: "Samedi : 9h – 18h",
  },
  transports: [
    { icon: "metro" as const, label: "Métro ligne 13 — station Gabriel Péri" },
    { icon: "bus" as const, label: "Bus 165, 238, 175" },
    { icon: "parking" as const, label: "Parking Voltaire (100 m)" },
  ],
  stats: {
    years: 17,
    communesCount: 8,
    transactions: 315,
    reviewsCount: 47,
    rating: 4.9,
    mandateSuccessRate: 98,
  },
  legal: {
    siren: "511 484 586",
    legalForm: "SAS",
    capital: "4 000 €",
    naf: "68.31Z",
    carteT: "CPI 9201 2018 000 024 838",
    cci: "CCI Paris Ile-de-France",
    garant: "LLOYD'S France",
    mediator: "TODO",
    siret: "SIRET 511 484 586 00025",
    rcs: "RCS Nanterre B 511 484 586",
  },
} as const;

/** true tant que la valeur est un placeholder non renseigné (`"TODO"` ou vide). */
export const isPlaceholder = (v: string | undefined): boolean =>
  !v || v === "TODO";

export const AGENT_BIO_PARAGRAPHS: string[] = [
  "Je suis Xavier Rimbault, agent immobilier, installé à Asnières-sur-Seine depuis 2009. Après plusieurs années dans de grandes enseignes immobilières franciliennes, j'ai fondé le Cabinet Rimbault pour offrir un accompagnement plus humain, plus réactif et ancré dans la réalité du terrain.",
  "Mon approche repose sur une conviction simple : chaque projet est singulier. Que vous cherchiez votre premier appartement, que vous mettiez en vente un bien familial ou que vous investissiez dans le locatif, je m'investis avec la même rigueur. Un seul interlocuteur, du premier rendez-vous à la signature chez le notaire.",
  "Je concentre volontairement mon activité sur un périmètre resserré — Asnières-sur-Seine, Gennevilliers, Colombes, Courbevoie et les communes limitrophes — pour maîtriser chaque rue, chaque copropriété, chaque évolution de prix. Cette connaissance fine du terrain me permet de vous conseiller avec honnêteté, qu'il s'agisse d'une estimation, d'une négociation ou d'un choix de quartier.",
  "J'ai accompagné plus de 185 transactions à ce jour, avec un taux de satisfaction client de 4,9/5 sur Google. Ce qui compte pour moi, ce n'est pas le volume : c'est que chaque dossier aboutisse dans de bonnes conditions, au juste prix, dans un délai maîtrisé.",
  "En dehors du cabinet, je suis investi dans la vie locale à Asnières. C'est la même logique qui m'anime : des liens durables, de la disponibilité, et le sens du service.",
];

export const AGENT_ENGAGEMENTS: { title: string; description: string }[] = [
  {
    title: "Connaissance du marché local",
    description:
      "Je suis les transactions récentes, les tendances par rue et par copropriété. Je m'appuie sur des comparables, pas sur des moyennes abstraites.",
  },
  {
    title: "Estimation juste et transparente",
    description:
      "Je vous explique comment j'arrive au prix, avec des arguments concrets. Je préfère un 'non' clair à une estimation gonflée pour décrocher un mandat.",
  },
  {
    title: "Suivi personnalisé",
    description:
      "Un seul interlocuteur de A à Z. Retours après chaque visite, point hebdomadaire, et disponibilité réactive.",
  },
  {
    title: "Visites qualifiées",
    description:
      "Je filtre les demandes et prépare chaque visite pour limiter le passage et maximiser les chances de concrétiser.",
  },
  {
    title: "Négociation",
    description:
      "Défense argumentée du prix, gestion des contre-propositions, accompagnement jusqu'au compromis.",
  },
  {
    title: "Réseau local",
    description:
      "Notaires, diagnostiqueurs, artisans, courtiers : un réseau éprouvé pour fluidifier votre projet.",
  },
];

export const SELLING_STEPS: {
  title: string;
  duration: string;
  role: string;
}[] = [
  {
    title: "1. Rencontre & visite du bien",
    duration: "Délai : 1ʳᵉ semaine",
    role: "Je viens sur place, j'écoute votre projet, je regarde le bien en détail et je vous explique la méthode et le calendrier.",
  },
  {
    title: "2. Estimation & mandat",
    duration: "Délai : sous 7 jours",
    role: "Je vous présente une estimation argumentée, on choisit ensemble la stratégie de prix et le type de mandat adapté.",
  },
  {
    title: "3. Mise en commercialisation",
    duration: "Délai : 2 à 8 semaines",
    role: "Photos, annonce, diffusion portails + réseau, visites qualifiées, reporting régulier.",
  },
  {
    title: "4. Compromis & signature",
    duration: "Délai : 3 mois en moyenne",
    role: "Négociation, rédaction du compromis, suivi des conditions suspensives jusqu'à la signature chez le notaire.",
  },
];

export const SELLING_FAQ: { question: string; answer: string }[] = [
  {
    question: "Quel est le bon moment pour vendre ?",
    answer:
      "Il n'y a pas de saison idéale universelle, mais certains mois sont plus dynamiques (mars-juin et septembre-octobre). Le vrai paramètre reste la qualité du dossier et le juste prix au moment de la mise en ligne.",
  },
  {
    question: "Dois-je choisir un mandat exclusif ?",
    answer:
      "L'exclusivité n'est pas obligatoire, mais elle permet une communication ciblée et un engagement fort de ma part. À l'inverse, un mandat simple peut convenir pour un bien très recherché. Je vous explique les implications concrètes avant de signer.",
  },
  {
    question: "Combien coûte une estimation ?",
    answer:
      "Rien. L'estimation est gratuite et sans engagement. Elle n'implique ni mandat, ni obligation de mise en vente.",
  },
  {
    question: "Quels diagnostics sont obligatoires ?",
    answer:
      "DPE, amiante, plomb, électricité, gaz, ERP, métrage Carrez en copropriété, diagnostic termites selon zone. Je vous oriente vers un diagnostiqueur agréé et vérifie la conformité du dossier avant compromis.",
  },
  {
    question: "Combien de temps dure une vente ?",
    answer:
      "Comptez 3 mois en moyenne entre la signature du compromis et la signature définitive chez le notaire, auxquels s'ajoute la durée de commercialisation (2 à 8 semaines selon le bien et le marché).",
  },
  {
    question: "Quels documents dois-je préparer ?",
    answer:
      "Titre de propriété, taxe foncière, dernier procès-verbal d'AG et règlement de copropriété le cas échéant, diagnostics en cours de validité, factures de gros travaux récents. Je vous fournis une checklist complète après notre première rencontre.",
  },
];
