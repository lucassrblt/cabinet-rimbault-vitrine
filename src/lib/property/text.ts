// Normalisation des textes saisis par l'agent (doc 02 §5.5 à 5.8) : capitales,
// accents perdus, lieux mal orthographiés, typographie française. Pur.
//
// Règle des capitales : une suite de mots entièrement en capitales (« TRES
// BELLE LUMINOSITE ») est ramenée en casse normale si elle compte au moins un
// mot de 4 lettres ou plus ; un mot isolé de 3 lettres ou moins est un sigle
// (« WC », « RER ») et reste tel quel. Les accents perdus à la saisie sont
// rétablis par un lexique fermé, propre au vocabulaire des annonces : un mot
// inconnu garde son orthographe, rien n'est deviné.

/** Mots dont la saisie en capitales perd l'accent, ou noms propres. */
const LEXIQUE: Record<string, string> = {
  agreable: "agréable",
  appartement: "appartement",
  batiment: "bâtiment",
  degagee: "dégagée",
  degage: "dégagé",
  dernier: "dernier",
  eleve: "élevé",
  elevee: "élevée",
  entierement: "entièrement",
  etage: "étage",
  etages: "étages",
  exposee: "exposée",
  expose: "exposé",
  gabriel: "Gabriel",
  impressionnistes: "Impressionnistes",
  lumineuse: "lumineuse",
  luminosite: "luminosité",
  peri: "Péri",
  piece: "pièce",
  pieces: "pièces",
  proximite: "proximité",
  refait: "refait",
  renove: "rénové",
  renovee: "rénovée",
  securise: "sécurisé",
  securisee: "sécurisée",
  sejour: "séjour",
  tres: "très",
};

/** Lieux connus, saisis de façon hétérogène (clé : sans accents, minuscules). */
const LIEUX: Record<string, string> = {
  "asnieres-sur-seine": "Asnières-sur-Seine",
  "asnieres sur seine": "Asnières-sur-Seine",
  asnieres: "Asnières-sur-Seine",
  "bois-colombes": "Bois-Colombes",
  clichy: "Clichy",
  colombes: "Colombes",
  courbevoie: "Courbevoie",
  gennevilliers: "Gennevilliers",
  "la garenne-colombes": "La Garenne-Colombes",
  "levallois-perret": "Levallois-Perret",
  "villeneuve-la-garenne": "Villeneuve-la-Garenne",
  // Quartiers
  "gabriel peri": "Gabriel Péri",
  impressionnistes: "Impressionnistes",
  collange: "Collange",
};

/**
 * Article des quartiers connus (clé : comme `LIEUX`), pour la phrase
 * « quartier des Impressionnistes » (doc 04 §2.3-8). Table fermée : un
 * quartier absent s'écrit « quartier » suivi de son nom, sans article deviné.
 */
const ARTICLES_QUARTIER: Record<string, string> = {
  impressionnistes: "des",
};

/** « quartier des Impressionnistes », « quartier Gabriel Péri ». */
export function neighborhoodPhrase(name: string): string {
  const article = ARTICLES_QUARTIER[foldKey(name)];
  return article ? `quartier ${article} ${name}` : `quartier ${name}`;
}

/**
 * Affichage seulement : colle chaque trait d'union au mot qui le suit (gluon
 * U+2060, le même que `fr()` et `placeLabel`), pour que « Asnières-sur-Seine »
 * ne se coupe jamais au trait d'union. Jamais pour une valeur réutilisée
 * ailleurs (`<title>`, meta description, `alt`, JSON-LD, comparaisons).
 */
export function glueHyphens(value: string): string {
  return value.replace(/-/g, "-\u2060");
}

/** Sans accents, minuscules : clé de comparaison. */
export function foldKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const UPPER_WORD = /^[A-ZÀ-ÖØ-Þ][A-ZÀ-ÖØ-Þ'’-]*$/;

function isUpperWord(word: string): boolean {
  const letters = word.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
  return letters.length > 0 && UPPER_WORD.test(letters);
}

function lowerWord(word: string): string {
  const lower = word.toLowerCase();
  return LEXIQUE[foldKey(lower)] ?? lower;
}

/**
 * Ramène les suites de capitales en casse normale. `sentenceStart` : la
 * chaîne ouvre une phrase, son premier mot reçoit une capitale initiale.
 */
export function normalizeCapitals(text: string): string {
  // Découpe en mots en gardant les séparateurs (espaces, ponctuation).
  const tokens = text.split(/([^A-Za-zÀ-ÖØ-öø-ÿ'’-]+)/);
  const out = [...tokens];
  let i = 0;
  while (i < tokens.length) {
    if (i % 2 === 0 && tokens[i] && isUpperWord(tokens[i])) {
      // Suite de mots en capitales séparés par des espaces ou une ponctuation
      // légère (« , »), sans chiffre ni minuscule entre eux.
      let j = i;
      const run: number[] = [];
      while (j < tokens.length) {
        if (j % 2 === 0) {
          if (tokens[j] && isUpperWord(tokens[j])) run.push(j);
          else break;
        } else if (!/^[\s,]+$/.test(tokens[j])) break;
        j += 1;
      }
      const hasLongWord = run.some((k) => tokens[k].length >= 4);
      const isSigle = run.length === 1 && tokens[run[0]].length <= 3;
      if (hasLongWord && !isSigle) {
        for (const k of run) out[k] = lowerWord(tokens[k]);
      }
      i = run[run.length - 1] + 1;
    } else {
      i += 1;
    }
  }
  return out.join("");
}

/** Capitale initiale (« luminosité » → « Luminosité »). */
export function capitalizeFirst(text: string): string {
  return text.replace(
    /^(\P{L}*)(\p{L})/u,
    (_, lead, first) => `${lead}${first.toUpperCase()}`,
  );
}

/**
 * Typographie française d'un texte saisi : apostrophe courbe, guillemets
 * français, espaces fines avant « ! ? ; : », unités liées au nombre
 * (« 33,65 m² »), « 6ème » → « 6ᵉ », espaces multiples réduites.
 */
export function frenchTypography(text: string): string {
  return text
    .replace(/'/g, "’")
    .replace(/"([^"]+)"/g, "« $1 »")
    .replace(/\s*([!?;])/g, " $1")
    .replace(/(\S)\s*:(?=\s|$)/g, "$1 :")
    .replace(/(\d)\s*m²/g, "$1 m²")
    .replace(/(\d)(?:ème|eme|e)(?![\p{L}\d])/gu, "$1ᵉ")
    .replace(/(\d) (?=[A-Za-zÀ-ÿ])/g, "$1 ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** « A proximité » saisi sans accent en tête de segment → « À proximité ». */
function fixLeadingA(text: string): string {
  return text.replace(/^A (?=\p{Ll})/u, "À ");
}

/** Capitale après une fin de phrase (« … électriques. parquet » → « Parquet »). */
function capitalizeSentences(text: string): string {
  return text.replace(
    /([.!?]\s+)(\p{Ll})/gu,
    (_, end, c) => `${end}${c.toUpperCase()}`,
  );
}

const euros = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/**
 * Montants saisis « 1124,00 Euros » → « 1 124 € » (seulement sans centimes :
 * rien n'est arrondi). « parking +une cave » → « parking et une cave ».
 */
function tidyAmounts(text: string): string {
  return text
    .replace(
      /(\d+)(?:,00)?\s*euros?\b/gi,
      (_, n) => `${euros.format(Number(n))}\u00a0€`,
    )
    .replace(/\s\+\s*(?=\p{L})/gu, " et ");
}

/** Segment de texte saisi → phrase lisible (casse, accents, typographie). */
export function normalizeSegment(text: string): string {
  return frenchTypography(
    tidyAmounts(
      capitalizeSentences(
        fixLeadingA(capitalizeFirst(normalizeCapitals(text.trim()))),
      ),
    ),
  );
}

/**
 * Lieu (ville ou quartier) : lieux connus corrigés, sinon capitale initiale
 * de chaque mot si la saisie est toute en minuscules (« collange »).
 */
export function normalizePlace(
  value: string | null | undefined,
): string | null {
  const raw = (value ?? "").replace(/\s+/g, " ").trim();
  if (!raw) return null;
  const known = LIEUX[foldKey(raw)];
  if (known) return known;
  if (raw === raw.toLowerCase() || raw === raw.toUpperCase()) {
    return raw
      .toLowerCase()
      .replace(/(^|[\s-])(\p{L})/gu, (_, sep, c) => `${sep}${c.toUpperCase()}`);
  }
  return raw;
}
