// Polices du site (lot P, Pirlo). Doc 03 §3.1, brief §3.2.
// Spectral : lecture (titres, chapôs, textes, prix, citations d'avis).
// Hanken Grotesk : interface et données.
// next/font/google auto-héberge les fichiers au build : aucun appel à Google
// au runtime (critère du brief §9).
//
// Les variables CSS exposées sont --font-spectral et --font-hanken ; globals.css
// les branche sur --font-serif et --font-sans dans un bloc `@theme inline`.
// (Nommer directement la variable next/font « --font-serif » créerait une
// référence circulaire avec le jeton Tailwind du même nom.)
import { Hanken_Grotesk, Spectral } from "next/font/google";

// Romain 300, 400, 500 : préchargés (titres et texte au premier écran).
export const spectral = Spectral({
  weight: ["300", "400", "500"],
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  variable: "--font-spectral",
});

// Italique 400 seule, réservée aux citations d'avis (doc 03 §3.3) : instance
// séparée pour ne pas charger les italiques 300 et 500, et non préchargée
// (elle n'apparaît jamais dans le premier écran).
export const spectralItalique = Spectral({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
  variable: "--font-spectral-italique",
});

// Variable : toutes les graisses dans un seul fichier.
export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
  variable: "--font-hanken",
});

/** Classes à poser sur <html> (layout racine) pour exposer les variables. */
export const fontVariables = [
  spectral.variable,
  spectralItalique.variable,
  hankenGrotesk.variable,
].join(" ");
