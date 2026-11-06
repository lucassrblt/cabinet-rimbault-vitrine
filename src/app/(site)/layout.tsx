import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";

// Mise en page des pages publiques (doc 04 §6) : lien d'évitement, en-tête,
// <main>, pied. La colonne occupe au moins la hauteur de l'écran, pour que
// le pied grenat ne s'arrête jamais au milieu d'une page courte.

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader />
      <main id="contenu" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
