// Textes de la page Vendre de la Galerie. Les phrases du déroulé sont celles
// de la refonte (`src/app/(site)/vendre/page.tsx`), mot pour mot ; seuls les
// intitulés courts des cartels sont nouveaux. Pur, partagé serveur et client.

export const VENDRE = "/galerie/vendre";
export const ESTIMATION = `${VENDRE}/estimation`;

export const DEROULE = [
  {
    titre: "L’estimation",
    texte:
      "Nous visitons votre bien et vous donnons le prix auquel nous pensons pouvoir le vendre.",
  },
  {
    titre: "Le mandat",
    texte:
      "Nous convenons ensemble du prix de mise en vente et signons le mandat.",
  },
  {
    titre: "L’annonce",
    texte:
      "Nous rédigeons l'annonce et réunissons avec vous les documents de la vente, dont les diagnostics obligatoires.",
  },
  {
    titre: "Les visites",
    texte: "Nous faisons visiter votre bien nous-mêmes.",
  },
  {
    titre: "Les offres",
    texte:
      "Nous recevons les offres, les négocions et vous les présentons par écrit.",
  },
  {
    titre: "Chez le notaire",
    texte:
      "Une fois l'accord trouvé, nous suivons le dossier avec les notaires, du compromis jusqu'à la signature de l'acte.",
  },
] as const;

/**
 * Échéance du projet (question 4 du tunnel). Absente du modèle `Evaluation` :
 * elle part en tête du champ `message`, sous la forme « Échéance du projet : … ».
 * [à confirmer] : liste à valider par l'agent.
 */
export const ECHEANCES = [
  { value: "des-que-possible", label: "Dès que possible" },
  { value: "3-mois", label: "Dans les trois mois" },
  { value: "3-6-mois", label: "Dans trois à six mois" },
  { value: "plus-tard", label: "Dans plus de six mois" },
  { value: "je-ne-sais-pas", label: "Je ne sais pas encore" },
] as const;

export type Echeance = (typeof ECHEANCES)[number]["value"] | "";

export function echeanceLabel(value: Echeance): string {
  return ECHEANCES.find((e) => e.value === value)?.label ?? "";
}

/** Ligne ajoutée au message envoyé à l'agent. */
export function echeanceMessage(value: Echeance): string {
  const label = echeanceLabel(value);
  return label === ""
    ? ""
    : `Échéance du projet : ${label.charAt(0).toLowerCase()}${label.slice(1)}`;
}
