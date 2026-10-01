import { Instrument_Serif, Schibsted_Grotesk } from "next/font/google";
import Link from "next/link";
import { agency } from "@/lib/agency";
import "./b.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-b-sans",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-b-serif",
});

export default function DirectionBLayout({
  children,
}: LayoutProps<"/exploration/b">) {
  return (
    <div className={`dir-b ${schibsted.variable} ${instrument.variable}`}>
      <header className="b-wrap flex items-center justify-between gap-6 py-5">
        <Link
          href="/exploration/b"
          className="flex items-center gap-3"
          aria-label="Cabinet Rimbault, accueil"
        >
          <span className="b-mark text-[1.1rem]" aria-hidden />
          <span className="flex flex-col leading-none">
            <span className="b-logo-name">Cabinet Rimbault</span>
            <span className="b-italic mt-1 text-[0.95rem] text-(--b-muted)">
              {agency.tagline}
            </span>
          </span>
        </Link>
        <nav
          className="hidden items-center gap-8 text-[0.9375rem] md:flex"
          aria-label="Navigation principale"
        >
          <Link href="/exploration/b#biens" className="b-link">
            Nos biens
          </Link>
          <Link href="/exploration/b#agence" className="b-link">
            L’agence
          </Link>
          <Link href="/exploration/b#contact" className="b-link">
            Contact
          </Link>
          <a href={agency.phone.href} className="b-button py-2!">
            {agency.phone.display}
          </a>
        </nav>
        <span className="md:hidden">
          <a href={agency.phone.href} className="b-button py-2!">
            Appeler
          </a>
        </span>
      </header>

      {children}

      <footer className="bg-(--b-fog)">
        <div className="b-wrap grid gap-10 py-14 text-sm md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="flex items-center gap-2">
              <span className="b-mark" aria-hidden />
              <span className="b-logo-name">Cabinet Rimbault</span>
            </p>
            <p className="mt-3 text-(--b-muted)">
              {agency.address.street}, {agency.address.postalCode}{" "}
              {agency.address.city}
            </p>
            <p className="mt-2">
              <a href={agency.phone.href} className="b-link">
                {agency.phone.display}
              </a>
            </p>
          </div>
          <div className="text-(--b-muted) md:col-span-5">
            <p className="text-(--b-ink)">Informations réglementaires</p>
            <p className="mt-3">{agency.legal.card}</p>
            <p className="mt-1">{agency.legal.guarantor}</p>
            <p className="mt-1">{agency.legal.company}</p>
            <p className="mt-1 text-(--b-red)">
              Médiateur de la consommation : à compléter
            </p>
          </div>
          <ul className="space-y-2 md:col-span-3">
            <li>
              <span className="b-link">Barème des honoraires</span>
            </li>
            <li>
              <span className="b-link">Mentions légales</span>
            </li>
            <li>
              <span className="b-link">Confidentialité</span>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
