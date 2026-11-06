// Jetons du mouvement côté JavaScript (Web Animations API). Ils recopient
// ceux du bloc « MOUVEMENT — Iniesta » de globals.css : toute modification se
// fait aux deux endroits. Liste fermée : brief §7.

/** Courbe unique du site (`--ease-sobre`). */
export const EASE_SOBRE = "cubic-bezier(0.2, 0, 0, 1)";

/** Durées en millisecondes. */
export const DUREES = {
  /** Tunnel : sortie de l'étape courante. */
  etapeSortie: 120,
  /** Tunnel : entrée de la nouvelle étape. */
  etapeEntree: 220,
  /** Visionneuse : fondu enchaîné entre deux photos. */
  fonduPhoto: 180,
} as const;

/** Translation horizontale de l'étape entrante, en pixels. */
export const DECALAGE_ETAPE = 12;
