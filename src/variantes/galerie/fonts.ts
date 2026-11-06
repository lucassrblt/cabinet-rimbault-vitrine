// Polices de la variante « Galerie chaude » (maquette v4).
// Host Grotesk : texte, cartels, interface (11,5 à 13 px).
// Newsreader 300 : la voix du cabinet (phrase d'accueil, prix, texte de salle).
// next/font/google auto-héberge les fichiers : aucun appel à Google au runtime.
import { Host_Grotesk, Newsreader } from "next/font/google";

export const hostGrotesk = Host_Grotesk({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
  variable: "--chaude-sans",
});

export const newsreader = Newsreader({
  weight: ["300"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
  variable: "--chaude-serif",
});

export const chaudeFonts = `${hostGrotesk.variable} ${newsreader.variable}`;
