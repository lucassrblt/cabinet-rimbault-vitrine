// Données des pages Mentions légales et Confidentialité (lot 7, doc 04 §2.10).
//
// Les informations du cabinet (raison sociale, carte, garant, médiateur,
// directeur de la publication) restent dans `src/lib/agency.ts`, source unique.
// Ici : hébergement, prestataires techniques, conservation des données.
//
// Règle : une valeur inconnue vaut `null`. La page masque alors la phrase qui
// en dépend, sans jamais afficher de marqueur, et `scripts/check-launch.ts`
// bloque la mise en production (demande inter-lots au lot 0, journal).
//
// Ce fichier n'importe rien : `check-launch` peut le lire tel quel avec `node`.
// Espaces typographiques déjà posées : U+202F (fine insécable), U+00A0.

/** Date de dernière modification des deux pages (ISO). */
export const LEGAL_UPDATED_AT = "2026-10-31";

export type Provider = {
  /** Raison sociale, telle qu'elle figure dans les conditions du prestataire. */
  name: string;
  /** Adresse postale du siège ou de l'établissement contractant. */
  address: string;
  /** Téléphone, s'il est publié (exigé par la LCEN pour l'hébergeur du site). */
  phone: string | null;
  /** Site, affiché sans protocole. */
  url: string;
  /** Nom commercial, s’il diffère de la raison sociale. */
  brand?: string;
};

/**
 * Hébergeur du site (brief §10-4). Mention obligatoire (LCEN, art. 1-1) : si
 * elle vaut `null`, la phrase est masquée et `check-launch` refuse la mise en
 * production. Netlify : en-têtes `server: Netlify` du site en ligne ; raison
 * sociale et adresse des conditions de Netlify, lues le 06/11/2026 (le site de
 * main citait une ancienne adresse, 44 Montgomery Street). Netlify ne publie
 * pas de numéro de téléphone, que la LCEN demande : `phone` reste `null`.
 */
export const siteHost: Provider | null = {
  name: "Netlify, Inc.",
  address: "101 2nd Street, San Francisco, CA 94105, États-Unis",
  phone: null,
  url: "netlify.com",
};

/**
 * Prestataires qui traitent les données des formulaires pour le compte du
 * cabinet (sous-traitants, RGPD art. 28). Vérifiés le 31/10/2026 :
 * - Railway : `cabinet-rimbault-api/railway.json` ; raison sociale et adresse
 *   de l'annexe du DPA (railway.com/legal/dpa).
 * - Supabase : base PostgreSQL de l'API, région AWS eu-west-1 (Irlande) lue
 *   dans l'URL de connexion ; raison sociale et adresse des conditions
 *   (supabase.com/terms, supabase.com/legal/dpa).
 * - Resend : `cabinet-rimbault-api/src/lib/resend.ts` ; raison sociale et
 *   adresse de l'annexe B du DPA (resend.com/legal/dpa).
 * Transferts hors UE : clauses contractuelles types 2021 dans les trois DPA,
 * et, pour Resend (certification déclarée dans son DPA, § 11.1), le cadre de
 * protection des données UE–États-Unis. La certification de Railway n'est pas
 * vérifiée : la page ne la revendique pas.
 */
export const processors = {
  api: {
    name: "Railway Corporation",
    address: "548 Market St PMB 68956, San Francisco, CA 94104, États-Unis",
    phone: null,
    url: "railway.com",
  },
  database: {
    name: "Supabase Pte. Ltd.",
    address: "65 Chulia Street #38-02/03, OCBC Centre, Singapour 049513",
    phone: null,
    url: "supabase.com",
  },
  email: {
    name: "Plus Five Five, Inc.",
    brand: "Resend",
    address: "2261 Market Street #5039, San Francisco, CA 94114, États-Unis",
    phone: null,
    url: "resend.com",
  },
} as const satisfies Record<string, Provider>;

/**
 * Service public d'autocomplétion d'adresse appelé directement depuis le
 * navigateur à l'étape 1 du tunnel d'estimation (`lib/estimation/address.ts`,
 * `data.geopf.fr/geocodage`). Ce n'est pas un sous-traitant du cabinet : il
 * reçoit seulement le texte saisi dans le champ adresse, sans clé ni cookie.
 * Vérifié le 31/10/2026 dans le code de la vitrine.
 */
export const addressLookup = {
  name: "Institut national de l’information géographique et forestière",
  shortName: "IGN",
  service: "Géoplateforme",
  url: "geoplateforme.fr",
  endpoint: "https://data.geopf.fr/geocodage/search/",
} as const;

/** Lieu de stockage de la base de données (région AWS eu-west-1). */
export const DATABASE_LOCATION = "en Irlande, dans l’Union européenne";

/**
 * Durée de conservation des demandes envoyées par les formulaires (brief
 * §10-15, proposition : « 3 ans après notre dernier échange »). Complète la
 * phrase « Vos demandes sont conservées … ». Tant qu'elle vaut `null`, la page
 * énonce le critère de durée (RGPD art. 13-2-a) sans chiffre, et la mise en
 * production doit être refusée par `check-launch`.
 */
// Proposition issue du site en ligne, à valider par le client :
// "trois ans après notre dernier échange"
export const dataRetention: string | null = null;

/** Brouillon du tunnel d'estimation dans le navigateur (doc 04 §3.5). */
export const ESTIMATION_DRAFT = {
  storage: "sessionStorage",
  key: "cr:estimation:v1",
  maxHours: 24,
} as const;

/** Sommaires (les `h2` des pages portent ces `id`). */
export const MENTIONS_TOC = [
  { id: "editeur", title: "Éditeur du site" },
  { id: "activite", title: "Activité réglementée" },
  { id: "reclamations", title: "Réclamations" },
  { id: "hebergement", title: "Hébergement" },
  { id: "propriete", title: "Propriété intellectuelle et crédits" },
  { id: "donnees", title: "Données personnelles" },
] as const;

export const PRIVACY_TOC = [
  { id: "responsable", title: "Responsable du traitement" },
  { id: "donnees", title: "Données collectées" },
  { id: "finalites", title: "Finalités et base légale" },
  { id: "destinataires", title: "Destinataires" },
  { id: "conservation", title: "Durée de conservation" },
  { id: "droits", title: "Vos droits" },
  { id: "demarchage", title: "Démarchage téléphonique" },
  { id: "cookies", title: "Cookies et stockage dans le navigateur" },
] as const;
