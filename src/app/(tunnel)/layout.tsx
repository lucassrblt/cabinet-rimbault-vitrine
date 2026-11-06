import { SkipLink } from "@/components/layout/SkipLink";
import { TunnelFooter } from "@/components/layout/TunnelFooter";
import { TunnelHeader } from "@/components/layout/TunnelHeader";

// Mise en page du tunnel d'estimation (doc 04 §3.2) : en-tête réduit, sans
// navigation principale, et pied réduit.

export default function TunnelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <TunnelHeader />
      <main id="contenu" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <TunnelFooter />
    </div>
  );
}
