// Imports statiques des photos hero locales : Next génère automatiquement un
// `blurDataURL` (aperçu flou inliné dans le HTML serveur) utilisable via
// `placeholder="blur"`. Centralisé ici pour éviter les chemins relatifs
// dispersés dans les points d'appel. Les fichiers restent dans /public car
// encore référencés en CSS (PropertyEstimationCTA).
import heroAgence from "../../public/hero-agence.jpg";
import heroEstimation from "../../public/hero-estimation.jpg";
import heroHome from "../../public/hero-home.jpg";

export const HERO_HOME = heroHome;
export const HERO_AGENCE = heroAgence;
export const HERO_ESTIMATION = heroEstimation;
