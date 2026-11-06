import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { realEstateAgentJsonLd } from "@/lib/seo/jsonld";
import { baseMetadata } from "@/lib/seo/metadata";
import { fontVariables } from "./fonts";
import "./globals.css";

// Layout racine, commun aux groupes (site) et (tunnel).
// L'en-tête et le pied sont posés par chaque groupe (lot 1).

export const metadata: Metadata = baseMetadata();

export const viewport: Viewport = {
  themeColor: "#F8F2E9",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={fontVariables} data-scroll-behavior="smooth">
      <body>
        {children}
        <JsonLd data={realEstateAgentJsonLd()} />
      </body>
    </html>
  );
}
