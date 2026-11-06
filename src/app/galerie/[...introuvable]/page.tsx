import { notFound } from "next/navigation";

// Toute adresse sans page sous /galerie affiche la 404 de la variante
// (not-found.tsx), dans son en-tête et son pied.
export default function Introuvable() {
  notFound();
}
