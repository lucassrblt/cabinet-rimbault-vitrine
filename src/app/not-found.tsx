import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";

// 404 des URL hors groupe (doc 04 §2.11), rendue dans le layout racine : elle
// pose donc elle-même l'en-tête, son <main> et le pied (même structure que
// `(site)/layout.tsx`). Les 404 levées dans (site) passent par
// `(site)/not-found.tsx`, sans <main> (celui du layout de groupe suffit).
//
// Aucune API dynamique ici (`headers()`, `cookies()`) : ce composant est la
// limite 404 de TOUTES les routes, et une lecture d'en-tête rendrait tout le
// site dynamique (vérifié au build, journal lot 0). La variante « bien
// disparu » est servie par `src/proxy.ts` et `(site)/biens-introuvable`.

// `robots: null` : Next pose lui-même `<meta name="robots" content="noindex">`
// sur cette page (404). `null` retire celui du layout racine (`index, follow`
// en production) sans en ajouter un second (recette D2 : deux balises robots
// en build + start avec `{ index: false, follow: false }`).
export const metadata: Metadata = {
  title: "Page introuvable",
  robots: null,
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader />
      <main id="contenu" tabIndex={-1} className="flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </div>
  );
}
