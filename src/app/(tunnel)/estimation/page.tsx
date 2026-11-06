import type { Metadata } from "next";
import { Suspense } from "react";
import {
  EstimationTunnel,
  TunnelFallback,
} from "@/components/estimation/EstimationTunnel";
import { pageMetadata } from "@/lib/seo/metadata";

// Tunnel d'estimation (lot 5, doc 04 §3). Page statique : `?etape=` et
// `?objet=` sont lus dans le navigateur (doc 04 §5), sous <Suspense>. Le
// repli (titre, progression, et un mot sans JavaScript) est dans le HTML.

export const metadata: Metadata = pageMetadata({
  title: "Faire estimer votre bien à Asnières-sur-Seine",
  description:
    "Demandez l’estimation du prix de vente ou du loyer de votre appartement ou de votre maison à Asnières-sur-Seine, en quatre étapes. Nous vous recontactons pour convenir d’une visite.",
  path: "/estimation",
});

export default function Page() {
  return (
    <Suspense fallback={<TunnelFallback />}>
      <EstimationTunnel />
    </Suspense>
  );
}
