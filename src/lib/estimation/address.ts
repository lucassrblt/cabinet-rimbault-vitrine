// Autocomplétion d'adresse : Base Adresse Nationale, servie par la
// Géoplateforme de l'IGN (`data.geopf.fr/geocodage`, successeur
// d'api-adresse.data.gouv.fr, qui y redirige et sera retiré). Appel direct
// depuis le navigateur : service public, sans clé ni cookie. Les résultats
// sont rapprochés d'Asnières-sur-Seine (`lat`/`lon`). En cas d'échec (réseau,
// réponse non 2xx), `searchAddresses` lève une erreur : le tunnel le dit, et
// le champ reste une saisie libre, rien ne bloque.

const ENDPOINT = "https://data.geopf.fr/geocodage/search/";

/** Centre d'Asnières-sur-Seine, pour classer d'abord les adresses proches. */
const NEAR = { lat: "48.9146", lon: "2.2856" };

export const ADDRESS_MIN_CHARS = 3;

export type AddressSuggestion = {
  id: string;
  /** Voie et numéro : « 12 Rue de la Station ». */
  name: string;
  postcode: string;
  city: string;
};

type Feature = {
  properties?: {
    id?: unknown;
    name?: unknown;
    postcode?: unknown;
    city?: unknown;
    type?: unknown;
  };
};

const KEPT_TYPES = new Set(["housenumber", "street", "locality"]);

export async function searchAddresses(
  query: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const q = query.trim();
  if (q.length < ADDRESS_MIN_CHARS) return [];
  const params = new URLSearchParams({
    q,
    limit: "5",
    autocomplete: "1",
    ...NEAR,
  });
  const res = await fetch(`${ENDPOINT}?${params}`, { signal });
  if (!res.ok) throw new Error(`Géoplateforme ${res.status}`);
  const json = (await res.json()) as { features?: Feature[] };
  const seen = new Set<string>();
  const out: AddressSuggestion[] = [];
  for (const feature of json.features ?? []) {
    const p = feature.properties ?? {};
    if (
      typeof p.id !== "string" ||
      typeof p.name !== "string" ||
      typeof p.postcode !== "string" ||
      typeof p.city !== "string" ||
      !KEPT_TYPES.has(String(p.type)) ||
      !/^\d{5}$/.test(p.postcode)
    )
      continue;
    const key = `${p.name}|${p.postcode}|${p.city}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ id: p.id, name: p.name, postcode: p.postcode, city: p.city });
  }
  return out;
}

const HOUSE_NUMBER = /^\s*(\d{1,4}(?:\s?(?:bis|ter|quater|[a-d])\b)?)[\s,]+\S/i;

/**
 * Voie retenue sans perdre le numéro : quand le service ne connaît que la rue
 * (« Rue de la Station ») alors que l'internaute a tapé « 12 rue de la
 * Station », on garde son numéro (« 12 Rue de la Station »).
 */
export function streetWithNumber(
  query: string,
  suggestion: AddressSuggestion,
): string {
  if (/^\d/.test(suggestion.name)) return suggestion.name;
  const typed = HOUSE_NUMBER.exec(query)?.[1];
  return typed
    ? `${typed.replace(/\s+/g, " ")} ${suggestion.name}`
    : suggestion.name;
}
