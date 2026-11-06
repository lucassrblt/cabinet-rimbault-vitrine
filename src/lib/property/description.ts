// Description saisie par l'agent → paragraphes lisibles (doc 04 §2.3-5).
// Les descriptions réelles n'ont pas de retour à la ligne : les segments sont
// séparés par « - » (« 2 PIECES- Rue Collange- A proximité… ») et les
// paragraphes voulus par deux espaces après une fin de phrase. Pur.
//
// 1. Découpe sur un tiret collé au mot précédent puis suivi d'une espace
//    (« PIECES- Rue ») : jamais sur un trait d'union (« vis-à-vis »).
// 2. Le premier segment est retiré s'il répète le titre saisi (« 2 PIECES ») :
//    ce titre est déjà affiché en sous-titre.
// 3. Les segments courts consécutifs (moins de 80 signes) forment un seul
//    paragraphe, en phrases (« Quartier des Impressionnistes. Comète… »).
// 4. Chaque segment est normalisé (capitales, accents, typographie).

import { foldKey, normalizeSegment } from "./text";

const SHORT = 80;

function sameText(a: string, b: string): boolean {
  const key = (s: string) => foldKey(s).replace(/[^a-z0-9]/g, "");
  return key(a) !== "" && key(a) === key(b);
}

function endSentence(text: string): string {
  return /[.!?…»)]$/.test(text) ? text : `${text}.`;
}

/** Paragraphes prêts à afficher ; `[]` si la description est vide. */
export function descriptionParagraphs(
  description: string | null | undefined,
  rawTitle?: string | null,
): string[] {
  const text = (description ?? "").replace(/\r\n?/g, "\n").trim();
  if (!text) return [];

  // Blocs explicites : retours à la ligne, ou deux espaces après une phrase.
  const blocks = text
    .split(/\n\s*\n|\n|(?<=[.!?])\s{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const segments: string[] = [];
  for (const block of blocks) {
    for (const part of block.split(/(?<=\S)-\s+(?=\S)/)) {
      const s = part.trim();
      if (s) segments.push(s);
    }
  }
  if (rawTitle && segments.length > 1 && sameText(segments[0], rawTitle)) {
    segments.shift();
  }

  const paragraphs: string[] = [];
  let pending: string[] = [];
  const flush = () => {
    if (pending.length) paragraphs.push(pending.join(" "));
    pending = [];
  };
  for (const segment of segments) {
    const sentence = endSentence(normalizeSegment(segment));
    if (segment.length < SHORT) {
      pending.push(sentence);
    } else {
      flush();
      paragraphs.push(sentence);
    }
  }
  flush();
  return paragraphs;
}

/** Texte brut d'une longueur maximale, coupé sur un mot (meta description). */
export function excerpt(paragraphs: readonly string[], max = 155): string {
  const text = paragraphs.join(" ").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : cut.length).replace(/[\s,;:. ]+$/, "")}…`;
}
