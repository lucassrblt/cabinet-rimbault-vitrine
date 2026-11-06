import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { realEstateAgentJsonLd } from "@/lib/seo/jsonld";
import { baseMetadata } from "@/lib/seo/metadata";
import { galerieFonts } from "@/variantes/galerie/fonts";
import "./globals.css";

// Layout racine. L'en-tête et le pied de la Galerie sont posés par le layout
// du groupe (galerie) et par la 404 racine (`not-found.tsx`).

export const metadata: Metadata = baseMetadata();

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={galerieFonts} data-scroll-behavior="smooth">
      <body>
        {children}
        <JsonLd data={realEstateAgentJsonLd()} />
      </body>
    </html>
  );
}
