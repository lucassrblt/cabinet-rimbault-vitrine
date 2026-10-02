import type { Metadata } from "next";
import { Instrument_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-source-serif",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Cabinet Rimbault, agence immobilière à Asnières-sur-Seine",
    template: "%s | Cabinet Rimbault",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${sourceSerif.variable} ${instrumentSans.variable}`}
      // La classe « js » est posée avant l'hydratation (cf. script ci-dessous).
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: script statique, sans donnée utilisateur
          dangerouslySetInnerHTML={{
            // Classe « js » et style de comparaison des maquettes, avant le rendu.
            __html:
              "document.documentElement.classList.add('js');try{var q=new URLSearchParams(location.search).get('style');if(q)localStorage.setItem('style-maquette',q);var s=q||localStorage.getItem('style-maquette');if(s&&s!=='actuelle')document.documentElement.dataset.style=s}catch(e){}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
