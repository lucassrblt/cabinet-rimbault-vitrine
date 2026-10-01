import { Libre_Caslon_Text, Public_Sans } from "next/font/google";
import Link from "next/link";
import { agency } from "@/lib/agency";
import "./a.css";

const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-a-serif",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-a-sans",
});

export default function DirectionALayout({
  children,
}: LayoutProps<"/exploration/a">) {
  return (
    <div className={`dir-a ${caslon.variable} ${publicSans.variable}`}>
      <header className="a-band">
        <div className="a-wrap flex items-center justify-between gap-6 py-4">
          <Link
            href="/exploration/a"
            className="a-logo a-header-logo"
            aria-label="Cabinet Rimbault, accueil"
          >
            <span className="a-logo-name">Cabinet Rimbault</span>
            <span className="a-logo-tagline">{agency.tagline}</span>
          </Link>
          <nav
            className="hidden items-center gap-7 text-[0.9375rem] md:flex"
            aria-label="Navigation principale"
          >
            <Link href="/exploration/a#biens" className="a-navlink">
              Nos biens
            </Link>
            <Link href="/exploration/a#agence" className="a-navlink">
              L’agence
            </Link>
            <Link href="/exploration/a#contact" className="a-navlink">
              Contact
            </Link>
            <a href={agency.phone.href} className="a-navphone">
              {agency.phone.display}
            </a>
          </nav>
          <a href={agency.phone.href} className="a-navphone md:hidden">
            Appeler
          </a>
        </div>
      </header>

      {children}

      <footer className="border-t border-(--a-line) bg-(--a-stone)">
        <div className="a-wrap grid gap-10 py-14 text-sm md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="a-logo-name text-(--a-red) text-xl">
              Cabinet Rimbault
            </p>
            <p className="mt-3 max-w-xs text-(--a-muted)">
              {agency.address.street}
              <br />
              {agency.address.postalCode} {agency.address.city}
            </p>
            <p className="mt-3">
              <a href={agency.phone.href} className="a-link">
                {agency.phone.display}
              </a>
            </p>
          </div>
          <div className="text-(--a-muted)">
            <p className="font-medium text-(--a-ink)">
              Informations réglementaires
            </p>
            <p className="mt-3">{agency.legal.card}</p>
            <p className="mt-2">{agency.legal.guarantor}</p>
            <p className="mt-2">{agency.legal.company}</p>
            <p className="mt-2 text-(--a-red)">
              Médiateur de la consommation : à compléter
            </p>
          </div>
          <ul className="space-y-2">
            <li>
              <span className="a-link">Barème des honoraires</span>
            </li>
            <li>
              <span className="a-link">Mentions légales</span>
            </li>
            <li>
              <span className="a-link">Confidentialité</span>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
