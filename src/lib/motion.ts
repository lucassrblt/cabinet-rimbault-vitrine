/**
 * Tokens d'animation partagés — source unique de vérité pour le timing.
 *
 * Évite la duplication de l'easing à travers les composants `motion` et
 * synchronise le séquencement d'entrée du hero (HeroBackdrop / HeroContent /
 * HeroSearch lisent les mêmes valeurs : pas d'arbre `motion` commun, mais un
 * rendu orchestré).
 */

/** Ease-out signature du site (easeOutQuart : départ vif, glissé final doux). */
export const EASE = [0.25, 1, 0.5, 1] as const;

/** Réglage de viewport commun aux révélations au scroll. */
export const VIEWPORT = { once: true, margin: "-80px 0px" } as const;

/** Écart de délai (en secondes) entre deux éléments d'une cascade. */
export const STAGGER_STEP = 0.08;

/**
 * Timeline d'entrée du hero, en secondes. Réglée « smooth mais pas lente » :
 * l'ensemble est perçu vivant dès la première frame, posé en ~1,3 s.
 */
export const HERO = {
  /** Durée du « settle » (léger dézoom) de l'image de fond. */
  imageSettle: 1.1,
  /** Retard avant la première ligne de texte. */
  contentDelay: 0.15,
  /** Écart entre chaque ligne de texte du hero. */
  contentStagger: 0.11,
  /** Durée d'une révélation de ligne / de la barre de recherche. */
  duration: 0.65,
  /** Retard de la barre de recherche — elle « atterrit » après le texte. */
  searchDelay: 0.6,
} as const;
