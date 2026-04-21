export interface Commune {
  slug: string;
  name: string;
  postalCode: string;
}

export const COMMUNES: Commune[] = [
  {
    slug: "boulogne-billancourt",
    name: "Boulogne-Billancourt",
    postalCode: "92100",
  },
  { slug: "neuilly-sur-seine", name: "Neuilly-sur-Seine", postalCode: "92200" },
  {
    slug: "issy-les-moulineaux",
    name: "Issy-les-Moulineaux",
    postalCode: "92130",
  },
  { slug: "levallois-perret", name: "Levallois-Perret", postalCode: "92300" },
  { slug: "vincennes", name: "Vincennes", postalCode: "94300" },
  {
    slug: "saint-maur-des-fosses",
    name: "Saint-Maur-des-Fossés",
    postalCode: "94100",
  },
  { slug: "versailles", name: "Versailles", postalCode: "78000" },
  { slug: "saint-cloud", name: "Saint-Cloud", postalCode: "92210" },
];

export const COMMUNES_COMMENT =
  "Un périmètre resserré sur l'ouest parisien et quelques communes limitrophes, choisi pour sa cohérence : typologies de biens proches, accès rapide depuis Paris, marché dynamique et acheteurs qualifiés.";

export function findCommuneBySlug(slug: string): Commune | undefined {
  return COMMUNES.find((c) => c.slug === slug);
}
