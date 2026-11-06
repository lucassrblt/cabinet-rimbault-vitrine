// Textes de la page Vendre de la Galerie. Les phrases du déroulé sont celles
// de la refonte (`src/app/(site)/vendre/page.tsx`), mot pour mot ; seuls les
// intitulés courts des cartels sont nouveaux. Pur, partagé serveur et client.

export const VENDRE = "/vendre";
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
 * État du bien (question 4 du tunnel) : les quatre choix du tunnel de main
 * (`StepCondition.tsx`), libellés et aides repris, rangés sur l'enum
 * `PropertyCondition` de l'API.
 */
export const ETATS = [
  { value: "NEUF", label: "Neuf ou refait", aide: "Rien à prévoir" },
  { value: "BON_ETAT", label: "Bon état", aide: "Quelques petits travaux" },
  {
    value: "A_RAFRAICHIR",
    label: "À rafraîchir",
    aide: "Peintures, sols, cuisine…",
  },
  { value: "A_RENOVER", label: "À rénover", aide: "Travaux importants" },
] as const;

export type Etat = (typeof ETATS)[number]["value"];

export function etatLabel(value: string): string {
  return ETATS.find((e) => e.value === value)?.label ?? "";
}
