import type { Metadata } from "next";
import { Cadre } from "@/variantes/galerie/Cadre";
import { Introuvable } from "@/variantes/galerie/Introuvable";

// 404 de tout le site (URL sans page, `notFound()` levé dans une page),
// rendue dans le layout racine, hors du groupe (galerie) : elle pose donc
// elle-même le cadre de la Galerie (mur, en-tête, <main>, pied).
//
// Aucune API dynamique ici (`headers()`, `cookies()`) : ce composant est la
// limite 404 de TOUTES les routes, et une lecture d'en-tête rendrait tout le
// site dynamique (vérifié au build, journal lot 0). La variante « bien
// disparu » est servie par `src/proxy.ts` et `(galerie)/biens-introuvable`.

// `robots: null` : Next pose lui-même `<meta name="robots" content="noindex">`
// sur cette page (404). `null` retire celui du layout racine (`index, follow`
// en production) sans en ajouter un second (recette D2).
export const metadata: Metadata = {
  title: "Page introuvable",
  robots: null,
};

export default function NotFound() {
  return (
    <Cadre>
      <Introuvable />
    </Cadre>
  );
}
