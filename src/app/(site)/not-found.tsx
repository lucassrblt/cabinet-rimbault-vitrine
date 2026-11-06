import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

// 404 levée dans le groupe (site) (`notFound()`, référence inconnue…). Pas de
// <main> ici : celui de `(site)/layout.tsx` l'enveloppe déjà (un seul #contenu).
// `robots` explicite : voir `app/not-found.tsx`.
export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

export default function SiteNotFound() {
  return <NotFoundContent />;
}
