// Échéance du projet de vente (question 5 du tunnel de la Galerie). Pur,
// partagé entre le tunnel et la Server Action.
//
// Elle part dans la colonne `timeframe` de `Evaluation` (texte libre côté API,
// `cabinet-rimbault-api/src/lib/public-forms/evaluation.ts`) : on y envoie le
// libellé lisible, que l'agent comprend sans table de correspondance. Elle fixe
// aussi `situation` : « vente », ou « renseignement » quand le vendeur ne sait
// pas encore (l'API ramène toute autre valeur à RENSEIGNEMENT).
// [à confirmer] : liste à valider par l'agent.

export const ECHEANCES = [
  { value: "des-que-possible", label: "Dès que possible" },
  { value: "3-mois", label: "Dans les trois mois" },
  { value: "3-6-mois", label: "Dans trois à six mois" },
  { value: "plus-tard", label: "Dans plus de six mois" },
  { value: "je-ne-sais-pas", label: "Je ne sais pas encore" },
] as const;

export type Echeance = (typeof ECHEANCES)[number]["value"] | "";

/** Nom du champ dans le FormData envoyé à la Server Action. */
export const ECHEANCE_FIELD = "echeance";

export function isEcheance(value: unknown): value is Echeance {
  return (
    value === "" ||
    ECHEANCES.some((e) => e.value === (value as string | undefined))
  );
}

export function echeanceLabel(value: Echeance): string {
  return ECHEANCES.find((e) => e.value === value)?.label ?? "";
}

/** Champs `timeframe` et `situation` du corps de `POST /evaluation`. */
export function echeancePayload(value: Echeance): {
  timeframe?: string;
  situation?: "vente" | "renseignement";
} {
  if (value === "") return {};
  return {
    timeframe: echeanceLabel(value),
    situation: value === "je-ne-sais-pas" ? "renseignement" : "vente",
  };
}
