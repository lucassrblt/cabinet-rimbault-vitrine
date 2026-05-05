import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Providers } from "./providers";
import "lenis/dist/lenis.css";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
  variable: "--font-fraunces",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "Cabinet Rimbault — Agent immobilier en Île-de-France",
    template: "%s | Cabinet Rimbault",
  },
  description:
    "Cabinet Rimbault — Agent immobilier indépendant en Île-de-France. Vente, location, estimation et accompagnement personnalisé.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${manrope.variable} lenis lenis-scrolling lenis-smooth h-full antialiased`}
    >
      <body className="flex min-h-full flex-col pt-20 pb-14 md:pb-0">
        <Providers>
          <SmoothScroll>
            <Header />
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
            <MobileBottomBar />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
