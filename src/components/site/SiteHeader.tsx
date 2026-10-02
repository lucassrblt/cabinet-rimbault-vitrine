"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { agency } from "@/lib/agency";
import { type OpeningStatus, openingStatus } from "@/lib/opening";
import { cn } from "@/lib/utils";

/**
 * En-tête « affichette » : un bandeau dit en direct si l'agence est ouverte,
 * comme l'affichette des horaires sur la porte du boulevard Voltaire.
 * Le statut est calculé dans le navigateur (les pages sont mises en cache).
 */
export function SiteHeader({ base }: { base: string }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<OpeningStatus | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setStatus(openingStatus());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // Le menu se referme quand on change de page.
  // biome-ignore lint/correctness/useExhaustiveDependencies: le changement de page est le déclencheur
  useEffect(() => setMenuOpen(false), [pathname]);

  const links = [
    { href: `${base}/biens`, label: "Nos biens" },
    { href: `${base}/agence`, label: "L’agence" },
    { href: `${base}/contact`, label: "Contact" },
  ];
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="en-tete sticky top-0 z-30 bg-blanc">
      <div className="bg-pierre">
        <div className="conteneur flex h-9 items-center justify-between gap-4 text-[0.8125rem]">
          <p className="flex items-center gap-2" aria-live="polite">
            <span
              className={cn(
                "size-2 rounded-full transition-colors duration-500",
                status?.open ? "bg-[#2f7d4f]" : "bg-gris",
              )}
              aria-hidden
            />
            <span
              className={cn(
                "transition-opacity duration-500",
                status ? "opacity-100" : "opacity-0",
              )}
            >
              {status?.label ?? "Horaires de l’agence"}
            </span>
          </p>
          <a
            href={agency.mapsDirections}
            className="hidden text-gris transition-colors hover:text-encre sm:inline"
          >
            {agency.address.street}, {agency.address.city}
          </a>
        </div>
      </div>

      <div className="en-tete-barre conteneur flex h-[4.25rem] items-center justify-between gap-4">
        <Link
          href={base}
          className="text-[1.0625rem] font-medium tracking-tight"
        >
          Cabinet Rimbault
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-1 md:flex"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-[0.9375rem] transition-colors duration-200 hover:bg-pierre",
                isActive(l.href) && "font-medium text-rouge",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <a
          href={agency.phone.href}
          className="hidden items-center gap-2 rounded-full border border-encre/80 px-5 py-2.5 text-[0.9375rem] font-medium transition-colors duration-200 hover:bg-encre hover:text-blanc md:inline-flex"
        >
          <Phone size={16} aria-hidden />
          {agency.phone.display}
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex size-11 items-center justify-center rounded-full bg-pierre transition-colors hover:bg-filet md:hidden"
        >
          {menuOpen ? (
            <X size={20} aria-hidden />
          ) : (
            <Menu size={20} aria-hidden />
          )}
        </button>
      </div>

      <div
        id="menu-mobile"
        className={cn(
          "grid border-filet transition-[grid-template-rows] duration-500 ease-[var(--ease-site)] md:hidden",
          menuOpen ? "grid-rows-[1fr] border-b" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Navigation mobile"
            className="conteneur flex flex-col gap-1 pt-2 pb-6"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "titre rounded-[var(--radius-carte)] px-3 py-3 text-intertitre transition-colors hover:bg-pierre",
                  isActive(l.href) && "text-rouge",
                )}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={agency.phone.href}
              className="bouton bouton-principal mt-4 rounded-full"
            >
              <Phone size={17} aria-hidden />
              Appeler le {agency.phone.display}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
