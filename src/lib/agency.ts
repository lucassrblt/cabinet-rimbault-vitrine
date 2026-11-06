// Informations du cabinet : source unique pour l'en-tête, le pied, les pages,
// le JSON-LD et le contrôle de mise en ligne (scripts/check-launch.ts).
//
// Règle : une valeur inconnue vaut `null` et n'est jamais affichée telle quelle.
// Les composants masquent la ligne correspondante ; `check-launch` bloque la mise
// en production tant qu'une valeur obligatoire manque (brief Zidane §10).
//
// Ce fichier n'importe rien : il est lu tel quel par `node` dans check-launch.

export const agency = {
  name: "Cabinet Rimbault",
  tagline: "Transactions immobilières",
  since: 2009,
  address: {
    street: "117 boulevard Voltaire",
    postalCode: "92600",
    city: "Asnières-sur-Seine",
    country: "FR",
  },
  phone: { display: "01 73 64 56 10", href: "tel:+33173645610" },
  /** E-mail public sur le domaine du cabinet. À fournir par l'agent (brief §10-3). */
  email: null as string | null,
  /**
   * Horaires tels que saisis aujourd'hui. Non validés par l'agent (brief §10-7) :
   * tant que `hoursConfirmed` est faux, ils ne vont ni dans le JSON-LD ni dans
   * un état « ouvert / fermé » présenté comme certain.
   */
  hoursConfirmed: false,
  hours: [
    { days: "Lundi", time: "sur rendez-vous" },
    { days: "Mardi au vendredi", time: "9 h – 19 h" },
    { days: "Samedi", time: "9 h – 18 h" },
  ],
  /** Communes du secteur (ILL-07, JSON-LD areaServed, note « hors secteur »). À fournir (brief §10-8). */
  sector: null as readonly string[] | null,
  google: {
    rating: "4,9",
    count: 32,
    href: "https://www.google.com/maps/search/Cabinet+Rimbault+Asni%C3%A8res",
    /**
     * URL de la fiche Google du cabinet (et non d'une recherche). À fournir par
     * l'agent : tant qu'elle vaut `null`, le JSON-LD ne publie pas de `sameAs`.
     */
    profileUrl: null as string | null,
  },
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=117+boulevard+Voltaire+92600+Asni%C3%A8res-sur-Seine",
  /** Aucun affiché par défaut (brief §10-14). */
  whatsapp: null as string | null,
  legal: {
    /** Libellés prêts à afficher (pied de page, A20). */
    card: "Carte professionnelle CPI 9201 2018 000 024 838, CCI Paris Île-de-France",
    company: "SAS au capital de 4 000 €, RCS Nanterre 511 484 586",
    guarantor: "Garant financier : LLOYD’S France",
    /** Données brutes pour les mentions légales et le JSON-LD. */
    cardNumber: "CPI 9201 2018 000 024 838",
    cardIssuer: "CCI Paris Île-de-France",
    legalForm: "SAS",
    capital: "4 000 €",
    rcs: "RCS Nanterre 511 484 586",
    siren: "511484586",
    guarantorName: "LLOYD’S France",
    /** Adresse du garant. À fournir (brief §10-6). */
    guarantorAddress: null as string | null,
    /**
     * Médiateur de la consommation : nom, adresse, site. Mention obligatoire,
     * bloquante pour la mise en ligne (brief §10-1). Tant qu'il est `null`,
     * le pied de page masque la ligne et check-launch échoue en production.
     */
    mediator: null as {
      name: string;
      address: string;
      url: string;
    } | null,
    /** Directeur de la publication : mentions légales uniquement (brief §1, §10-6). */
    publicationDirector: null as string | null,
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

/** Adresse sur une ligne, avec des virgules (jamais de point médian, brief §6.2). */
export function agencyAddressLine(): string {
  const { street, postalCode, city } = agency.address;
  return `${street}, ${postalCode} ${city}`;
}
