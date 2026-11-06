// Forme d'une question fréquente (pages Vendre et Louer, lot 4).
// Les réponses sont en texte brut, une chaîne par paragraphe : elles servent
// telles quelles au JSON-LD `FAQPage`. Typographie posée au rendu (`fr()`).
//
// Règle de rédaction : une réponse ne contient que des faits vrais, soit
// sourcés (texte de loi cité), soit tirés de `src/lib/agency.ts`. Une question
// dont la réponse dépend d'une information à obtenir de l'agent (gratuité de
// l'estimation, mandat exclusif, délais, gestion locative…) n'est pas publiée :
// elle est listée dans docs/refonte/journal-implementation.md (lot 4).

export type FaqEntry = {
  question: string;
  answer: readonly string[];
  /** Lien interne facultatif, rendu après la réponse. */
  link?: { href: string; label: string };
};
