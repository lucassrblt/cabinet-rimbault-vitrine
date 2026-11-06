import type { GoogleReview } from "@/lib/reviews/google";

// Extraits d'avis Google (doc 04 §7, revue du lot 3). Le texte de l'auteur
// n'est jamais réécrit : on en garde le début, coupé à la dernière phrase
// complète. Le titre que certains auteurs mettent en première ligne, sans
// ponctuation (« Avis positif sur agent immobilier lors d'une vente »), n'est
// pas repris : collé à la citation, il se lisait comme une phrase tronquée.

/** Longueur au-delà de laquelle un avis est coupé. */
const MAX_CHARS = 320;
/** En dessous, une coupe à la phrase laisserait un extrait trop maigre. */
const MIN_SENTENCE_CUT = 120;
/** Un titre d'avis : une première ligne courte, sans ponctuation finale. */
const MAX_TITLE_CHARS = 90;

const SENTENCE_END = /[.!?…]["»”)]?$/;

type Excerpt = {
  text: string;
  /** 0 : avis entier ; 1 : titre retiré ou coupé à la phrase ; 2 : coupé au mot. */
  quality: 0 | 1 | 2;
};

function normalize(text: string): string {
  // Les retours à la ligne de l'auteur sont gardés ; les autres suites
  // d'espaces sont réduites.
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

function withoutTitle(text: string): { body: string; hadTitle: boolean } {
  const newline = text.indexOf("\n");
  if (newline === -1) return { body: text, hadTitle: false };
  const first = text.slice(0, newline).trim();
  const isTitle = first.length <= MAX_TITLE_CHARS && !/[.!?…:;,]$/.test(first);
  return isTitle
    ? { body: text.slice(newline + 1).trim(), hadTitle: true }
    : { body: text, hadTitle: false };
}

export function reviewExcerpt(raw: string): Excerpt {
  const { body, hadTitle } = withoutTitle(normalize(raw));
  if (body.length <= MAX_CHARS) {
    return { text: body, quality: hadTitle ? 1 : 0 };
  }

  const window = body.slice(0, MAX_CHARS + 1);
  // Dernière fin de phrase (ponctuation suivie d'une espace ou d'un retour).
  let sentenceCut = -1;
  for (const match of window.matchAll(/[.!?…]["»”)]?(?=\s)/g)) {
    sentenceCut = match.index + match[0].length;
  }
  if (sentenceCut >= MIN_SENTENCE_CUT) {
    // « […] » : convention française de la coupe dans une citation.
    return { text: `${body.slice(0, sentenceCut)} […]`, quality: 1 };
  }

  const cut = body.slice(0, MAX_CHARS);
  const lastSpace = Math.max(cut.lastIndexOf(" "), cut.lastIndexOf("\n"));
  const text = cut
    .slice(0, lastSpace > 200 ? lastSpace : MAX_CHARS)
    .replace(/[\s,;:.!?–-]+$/, "");
  // Même marque de coupe que ci-dessus : la mention sous la note annonce
  // « […] » pour les avis abrégés (revue finale C-P3).
  return { text: `${text} […]`, quality: SENTENCE_END.test(text) ? 1 : 2 };
}

/**
 * Composition typographique d'une citation, sans changer un seul mot (revue
 * finale C-P3) : apostrophe droite → U+2019 ; espace fine insécable U+202F
 * devant « ! ? ; : » et « », et après « ». Une espace existante est
 * remplacée ; une espace absente n'est ajoutée qu'entre une lettre et une
 * ponctuation suivie d'une espace ou de la fin, pour ne toucher ni une
 * heure (« 10:30 »), ni une adresse, ni un « ?! ».
 */
export function typesetQuote(text: string): string {
  return text
    .replace(/'/g, "\u2019")
    .replace(/[ \u00A0\u202F]+([!?;:»])/g, "\u202F$1")
    .replace(/(\p{L})([!?;:]+)(?=\s|$|[)»”])/gu, "$1\u202F$2")
    .replace(/(\p{L}|[.!?…])»/gu, "$1\u202F»")
    .replace(/«[ \u00A0\u202F]*/g, "«\u202F");
}

export type ReviewWithExcerpt = GoogleReview & { excerpt: string };

/**
 * Les `count` avis montrés. Ils ne sont pas choisis pour leur note : l'ordre
 * de Google est gardé, sauf que les avis lisibles en entier passent devant
 * ceux qu'il faut couper (tri stable).
 */
export function pickReviews(
  reviews: readonly GoogleReview[],
  count: number,
): ReviewWithExcerpt[] {
  if (count <= 0) return [];
  return reviews
    .map((review) => {
      const { text, quality } = reviewExcerpt(review.text);
      return {
        review: { ...review, excerpt: typesetQuote(text) },
        quality,
      };
    })
    .sort((a, b) => a.quality - b.quality)
    .slice(0, count)
    .map(({ review }) => review);
}
