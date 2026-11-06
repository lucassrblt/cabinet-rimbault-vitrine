import { createElement, Fragment, type ReactNode } from "react";

// Typographie française des textes du lot 4 (doc 03 §3.3) : les contenus de
// `src/content/` sont tapés avec des espaces ordinaires, pour rester lisibles
// et modifiables ; `fr()` pose les espaces insécables au rendu (page et
// JSON-LD). Une seule fonction, appliquée à chaque chaîne affichée.
//
// - espace fine insécable (U+202F) avant « : ; ! ? » et à l'intérieur des
//   guillemets ;
// - apostrophe typographique ;
// - espace insécable (U+00A0) entre un nombre et le mot qui le suit
//   (« 10 jours », « 20 % », « 01 73 64 56 10 » ne se coupent jamais) ;
// - espace insécable entre « classé(e)(s) » et la classe énergétique
//   (« classé G » ne se coupe jamais) ;
// - « Asnières-sur-Seine » jamais coupé à ses traits d'union : gluon U+2060
//   après chaque trait (U+2011 n'existe pas dans Spectral ni Hanken) ; même
//   gluon dans les inversions (« est-il », « se passe-t-il », « Intervenez-vous »)
//   et devant « -même(s) » (« nous-mêmes »).

/** « Asnières-sur-Seine », insécable aux traits d'union. */
export const ASNIERES = "Asni\u00E8res-\u2060sur-\u2060Seine";

export function fr(text: string): string {
  return text
    .replace(/'/g, "’")
    .replace(/[  ]+([:;!?»])/g, " $1")
    .replace(/«[  ]+/g, "« ")
    .replace(/(\d(?:er)?) (?=\S)/g, "$1 ")
    .replace(/(class(?:é|ée|és|ées)) ([A-G])\b/g, "$1 $2")
    .replace(/Asnières-sur-Seine/g, ASNIERES)
    .replace(/-(?=(?:t-)?(?:il|elle|on|ils|elles|vous|nous)\b)/g, "-\u2060")
    .replace(/-(?=mêmes?(?!\p{L}))/gu, "-\u2060");
}

/**
 * `fr()`, puis « 1er » avec « er » en exposant (doc 03 §3.3) : « 1<sup>er</sup>
 * janvier 2025 ». Le `sup` (0,7 em, `line-height: 0`) ne modifie pas
 * l'interligne. Réservé à l'affichage : le JSON-LD garde « 1er » en texte.
 */
export function frNode(text: string): ReactNode {
  const parts = fr(text).split(/\b1er\b/);
  if (parts.length === 1) return parts[0];
  return parts.flatMap((part, index) =>
    index === 0
      ? [part]
      : [
          createElement(
            Fragment,
            { key: index },
            "1",
            createElement(
              "sup",
              { className: "text-[0.7em] leading-[0]" },
              "er",
            ),
          ),
          part,
        ],
  );
}

/** Téléphone du cabinet, groupes liés (jamais coupé en fin de ligne). */
export function phoneLabel(display: string): string {
  return display.replace(/ /g, " ");
}
