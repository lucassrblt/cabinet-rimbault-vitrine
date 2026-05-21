import type { Metadata } from "next";
import { Familjen_Grotesk, Manrope } from "next/font/google";
import { AGENT } from "@/lib/config/agent";
import { Providers } from "./providers";
import "lenis/dist/lenis.css";
import "./globals.css";

const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-familjen",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export function generateMetadata(): Metadata {
  return {
    title: {
      default: `Agence immobilière à ${AGENT.address.city} — Cabinet Rimbault`,
      template: "%s | Cabinet Rimbault",
    },
    description: `Cabinet Rimbault — ${AGENT.title} à ${AGENT.address.city}. Vente, location, estimation et accompagnement personnalisé.`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${familjenGrotesk.variable} ${manrope.variable} lenis lenis-scrolling lenis-smooth h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
