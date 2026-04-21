export const AGENT = {
  firstName: "Prénom",
  lastName: "NOM",
  fullName: "Prénom NOM",
  title: "Agent immobilier indépendant",
  phoneE164: "+33000000000",
  phoneDisplay: "— — — — —",
  email: "contact@cabinet-rimbault.fr",
  whatsappUrl: "https://wa.me/33000000000",
  instagram: "#",
  linkedin: "#",
  googleBusinessUrl: "#",
  address: {
    line1: "Adresse à renseigner",
    postalCode: "00000",
    city: "Commune",
  },
  hours: {
    weekdays: "Lundi – Vendredi : 9h – 19h",
    saturday: "Samedi : 10h – 13h (sur rendez-vous)",
  },
  transports: [
    { icon: "metro" as const, label: "Métro ligne — — station —" },
    { icon: "bus" as const, label: "Bus — —, —" },
    { icon: "parking" as const, label: "Parking rue accessible" },
  ],
  stats: {
    years: 12,
    communesCount: 8,
    transactions: 120,
    reviewsCount: 0,
    rating: 0,
  },
  legal: {
    carteT: "Carte professionnelle T n° —",
    cci: "CCI de —",
    garant: "Garant financier — (adresse)",
    mediator: "Médiateur consommation : —",
    siret: "SIRET —",
    rcs: "RCS —",
  },
} as const;

export const AGENT_BIO_PARAGRAPHS: string[] = [
  "Je suis agent immobilier indépendant, installé en Île-de-France depuis plus de dix ans. Mon métier consiste à accompagner les propriétaires, les acheteurs et les locataires avec la même exigence : prendre le temps de comprendre le projet avant de proposer la bonne solution.",
  "J'ai choisi l'indépendance après plusieurs années passées dans de grandes enseignes, pour construire une relation plus directe avec chaque client. Je ne gère pas un portefeuille à la chaîne : je suis l'interlocuteur unique, du premier contact à la signature.",
  "Ma conviction est simple : une transaction immobilière réussie repose sur une estimation juste, une communication claire et une maîtrise fine du terrain. J'ai vu trop de dossiers échouer faute d'anticipation — je consacre donc beaucoup de temps à la préparation, en amont de la mise en vente ou en location.",
  "Je concentre mon activité sur un périmètre resserré, pour rester pertinent sur chaque commune que je couvre. Je connais les rues, les profils de biens, les prix réels pratiqués, les copropriétés et les spécificités locales — c'est la condition pour conseiller honnêtement.",
  "En dehors de ce métier, je suis engagé dans mon quartier au sein d'une association locale. C'est la même logique : des liens longs, de la disponibilité, et le sens du service.",
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
