// Barème d'honoraires du cabinet (doc 04 §2.8, lot 4). Obligatoire (arrêté du
// 10 janvier 2017) et bloquant pour la mise en ligne (brief §10, point 2).
//
// Tant que `feeSchedule` vaut `null`, la page /honoraires et les résumés de
// Vendre et Louer affichent une formulation neutre et vraie, sans tableau, et
// `scripts/check-launch.ts` fait échouer le build de production (marqueur
// ci-dessous). Pour publier le barème : remplir l'objet en recopiant le
// barème remis par l'agent, mot pour mot, puis retirer le marqueur.
//
// Saisie : texte tapé avec des espaces ordinaires (la typographie française
// est posée au rendu). Montants TTC.

export type SaleFeeRow = {
  /** Tranche de prix, telle qu'écrite sur le barème : « Jusqu'à 100 000 € ». */
  range: string;
  /** Honoraires TTC de la tranche : « 6 % », « 5 000 € ». */
  fee: string;
};

export type RentalFeeRow = {
  /** Prestation : « Visite, constitution du dossier et rédaction du bail ». */
  service: string;
  /** Part du locataire : « 12 € par m² de surface habitable ». */
  tenant: string;
  /** Part du propriétaire. */
  landlord: string;
};

export type FeeSchedule = {
  /** Date d'effet du barème, au format AAAA-MM-JJ. */
  effectiveDate: string;
  sale: {
    rows: readonly SaleFeeRow[];
    /** Qui paie, en une phrase : « Honoraires à la charge du vendeur, sauf mention contraire sur l'annonce. » */
    payer: string;
    /** Exemple de calcul, facultatif. */
    example?: string;
    /** Résumé en une phrase pour la page Vendre. */
    summary: string;
  };
  rental: {
    rows: readonly RentalFeeRow[];
    /** Résumé en une phrase pour la page Louer. */
    summary: string;
  };
  /** Mentions complémentaires (une phrase par élément). */
  notes?: readonly string[];
};

// [À FOURNIR] barème vente et location, avec sa date d'effet (brief §10-2).
export const feeSchedule: FeeSchedule | null = null;
