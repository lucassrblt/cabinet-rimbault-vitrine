import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

// Fiche disparue (doc 04 §2.3, « Bien introuvable ») : statut 404, variante
// de la 404 du groupe (site). Pas de <main> : celui de `(site)/layout.tsx`
// l'enveloppe (un seul #contenu, journal lot 0). `robots` explicite.

export const metadata: Metadata = {
  title: "Bien introuvable",
  robots: { index: false, follow: false },
};

export default function PropertyNotFound() {
  return (
    <NotFoundContent
      title="Ce bien n’est plus en ligne."
      lead="Il a peut-être été vendu ou loué."
    />
  );
}
