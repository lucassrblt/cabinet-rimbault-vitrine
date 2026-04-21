import { Phone } from "lucide-react";
import Link from "next/link";
import { MobileMenu } from "./MobileMenu";

const navItems: { href: string; label: string }[] = [
  { href: "/acheter", label: "Acheter" },
  { href: "/louer", label: "Louer" },
  { href: "/vendre", label: "Vendre" },
];

const AGENT_PHONE = "+33000000000";
const AGENT_PHONE_DISPLAY = "—";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight"
          aria-label="Cabinet Rimbault — Accueil"
        >
          Cabinet Rimbault
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-6 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-700 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
          <SectorsDropdown />
          <Link
            href="/a-propos"
            className="text-sm text-zinc-700 hover:text-zinc-900"
          >
            L&apos;agence
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${AGENT_PHONE}`}
            className="hidden items-center gap-1 text-sm text-zinc-700 md:flex"
            aria-label={`Appeler — ${AGENT_PHONE_DISPLAY}`}
          >
            <Phone className="h-4 w-4" />
            <span>{AGENT_PHONE_DISPLAY}</span>
          </a>
          <Link
            href="/estimation"
            className="hidden rounded border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white md:inline-block"
          >
            Estimer mon bien
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function SectorsDropdown() {
  return (
    <details className="group relative">
      <summary className="cursor-pointer list-none text-sm text-zinc-700 hover:text-zinc-900">
        Secteurs
      </summary>
      <div className="absolute left-0 top-full mt-2 min-w-[200px] rounded border border-zinc-200 bg-white p-2 shadow-sm">
        <p className="px-2 py-1 text-xs text-zinc-500">
          Communes à renseigner par l&apos;agent.
        </p>
      </div>
    </details>
  );
}
