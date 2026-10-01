import { Phone } from "lucide-react";
import Link from "next/link";
import { agency } from "@/lib/agency";
import { Logo } from "./Logo";

export function SiteHeader({ base }: { base: string }) {
  return (
    <header className="en-tete sticky top-0 z-30 border-b border-filet bg-blanc">
      <div className="en-tete-barre conteneur flex h-[4.5rem] items-center justify-between gap-6">
        <Link href={base} aria-label="Cabinet Rimbault, accueil">
          <span className="sm:hidden">
            <Logo compact />
          </span>
          <span className="hidden sm:inline">
            <Logo />
          </span>
        </Link>
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-8 md:flex"
        >
          <Link href={`${base}#biens`} className="lien">
            Nos biens
          </Link>
          <Link href={`${base}#agence`} className="lien">
            L’agence
          </Link>
          <Link href={`${base}#contact`} className="lien">
            Contact
          </Link>
        </nav>
        <a
          href={agency.phone.href}
          className="bouton bouton-secondaire min-h-10 px-4"
        >
          <Phone size={16} aria-hidden />
          <span className="hidden lg:inline">{agency.phone.display}</span>
          <span className="lg:hidden">Appeler</span>
        </a>
      </div>
    </header>
  );
}
