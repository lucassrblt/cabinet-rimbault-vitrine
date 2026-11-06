// Données de la variante « Galerie chaude » : uniquement des dérivés de
// l'API (`getProperties`, `toPropertyView`) et d'`agency.ts`. Rien n'est
// inventé : une valeur absente disparaît de l'affichage.
import "server-only";
import { agency } from "@/lib/agency";
import { getProperties } from "@/lib/api/properties";
import {
  type PropertyView,
  sortForListing,
  toPropertyView,
} from "@/lib/property/view";
import { type GoogleReview, getGoogleReviews } from "@/lib/reviews/google";

/** Base des URL internes de la variante. */
export const BASE = "/galerie";

export function ficheHref(reference: string): string {
  return `${BASE}/biens/${encodeURIComponent(reference)}`;
}

/** Biens visibles, dans l'ordre de la liste ; `null` si l'API ne répond pas. */
export async function listViews(): Promise<PropertyView[] | null> {
  try {
    return sortForListing((await getProperties()).map(toPropertyView));
  } catch (error) {
    console.error(error);
    return null;
  }
}

const NOMBRES = [
  "zéro",
  "un",
  "deux",
  "trois",
  "quatre",
  "cinq",
  "six",
  "sept",
  "huit",
  "neuf",
  "dix",
  "onze",
  "douze",
];

/** « cinq », « douze » ; au-delà, le chiffre. */
export function enLettres(n: number): string {
  return NOMBRES[n] ?? String(n);
}

export function majuscule(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** « à Asnières-sur-Seine et à Levallois-Perret » (villes saisies, sans doublon). */
export function villesPhrase(views: readonly PropertyView[]): string | null {
  const villes = [
    ...new Set(views.map((v) => v.city).filter((c): c is string => !!c)),
  ];
  if (!villes.length) return null;
  const a = villes.map((v) => `à ${v}`);
  if (a.length === 1) return a[0];
  return `${a.slice(0, -1).join(", ")} et ${a[a.length - 1]}`;
}

/**
 * Photo d'accrochage choisie à l'œil pour la démonstration (06/11/2026) :
 * référence → fin du nom de fichier. En production, ce choix revient à
 * l'agent, par la « photo principale » de l'admin (`isMain`, rang 0), que
 * l'on retrouve ici en repli : supprimer cette table une fois les photos
 * principales revues dans l'admin.
 */
const PHOTO_CHOISIE: Readonly<Record<string, string>> = {
  "10129": "6zqbw-11.jpg", // le jardin arboré, plutôt que la terrasse dallée
  "10.130": "4szmjd-3.jpg", // le séjour et sa cuisine ouverte sur la terrasse
  "10.131": "xp9udt-1.jpg", // le séjour et ses deux baies
};

/** Photo à accrocher : le choix éditorial s'il existe, sinon la principale. */
export function photoAccrochage(
  view: PropertyView,
): PropertyView["images"][number] | undefined {
  const fin = PHOTO_CHOISIE[view.reference];
  return (
    (fin && view.images.find((img) => img.url.endsWith(fin))) || view.images[0]
  );
}

/** Photos de la fiche : celle de l'accrochage d'abord, pour que la fiche
 * s'ouvre sur l'image cliquée dans la salle, puis les autres dans l'ordre. */
export function photosFiche(
  view: PropertyView,
): PropertyView["images"][number][] {
  const une = photoAccrochage(view);
  return une ? [une, ...view.images.filter((img) => img !== une)] : [];
}

/** Titre de cartel : le titre de l'agent remis en casse, sinon le titre composé. */
export function titreCartel(view: PropertyView): string {
  return view.subtitle ?? view.head;
}

/** Ligne « 92,2 m², 4 chambres » à partir des seules valeurs connues. */
export function mesuresCartel(view: PropertyView): string | null {
  const chambres = view.facts.find((f) => f.label.startsWith("Chambre"));
  const parts = [
    view.surfaceLabel,
    chambres ? `${chambres.value} ${chambres.label.toLowerCase()}` : null,
  ].filter((x): x is string => !!x);
  return parts.length ? parts.join(", ") : null;
}

/** Mois courant, pour le sous-titre de la salle (« novembre 2026 »). */
export function moisCourant(): string {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date());
}

/**
 * Dans Newsreader, l'espace fine des milliers (U+202F) se lit à peine
 * (« 280000 € ») : les prix en serif reçoivent une espace insécable pleine.
 */
export function serifSpaces(text: string): string {
  return text.replace(/\u202f/g, "\u00a0");
}

/**
 * Note et nombre d'avis Google : la fiche Google si elle répond, sinon les
 * valeurs d'`agency.ts`. Une seule source pour l'accueil et le cabinet.
 */
export async function avisGoogle(): Promise<{
  note: string;
  nombre: number;
  avis: GoogleReview | null;
}> {
  const r = await getGoogleReviews();
  return {
    note: r ? r.rating.toFixed(1).replace(".", ",") : agency.google.rating,
    nombre: r?.totalCount ?? agency.google.count,
    avis: r?.reviews.find((x) => x.rating >= 4 && x.text.trim()) ?? null,
  };
}
