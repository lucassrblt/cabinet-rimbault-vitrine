export interface Commune {
  slug: string;
  name: string;
  // Optionnel : absent pour les périmètres regroupés (ex. Paris intra-muros)
  // où le filtre s'applique via la ville (contains insensible) sans CP fixe.
  postalCode?: string;
}

export const COMMUNES: Commune[] = [
  {
    slug: "asnieres-sur-seine",
    name: "Asnières-sur-Seine",
    postalCode: "92600",
  },
  { slug: "gennevilliers", name: "Gennevilliers", postalCode: "92230" },
  { slug: "colombes", name: "Colombes", postalCode: "92700" },
  { slug: "courbevoie", name: "Courbevoie", postalCode: "92400" },
  { slug: "bois-colombes", name: "Bois-Colombes", postalCode: "92270" },
  { slug: "clichy", name: "Clichy", postalCode: "92110" },
  { slug: "levallois-perret", name: "Levallois-Perret", postalCode: "92300" },
  { slug: "neuilly-sur-seine", name: "Neuilly-sur-Seine", postalCode: "92200" },
  // Paris intra-muros : regroupe les 20 arrondissements. L'API filtre par
  // `city contains "Paris"` (insensible), donc on n'envoie pas de postalCode.
  { slug: "paris", name: "Paris (intra-muros)" },
];

export const COMMUNES_COMMENT =
  "Un périmètre resserré sur le nord-ouest parisien et les communes limitrophes d'Asnières-sur-Seine, choisi pour sa cohérence : typologies de biens proches, accès rapide depuis Paris, marché dynamique et acheteurs qualifiés.";

export function findCommuneBySlug(slug: string): Commune | undefined {
  return COMMUNES.find((c) => c.slug === slug);
}
