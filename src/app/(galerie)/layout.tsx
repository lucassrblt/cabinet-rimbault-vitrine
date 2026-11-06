import type { ReactNode } from "react";
import { Cadre } from "@/variantes/galerie/Cadre";

// Layout des pages du site (thème Galerie, maquette v4). Titres, descriptions
// et robots : `pageMetadata` dans chaque page, gabarit du layout racine.
export default function GalerieLayout({ children }: { children: ReactNode }) {
  return <Cadre>{children}</Cadre>;
}
