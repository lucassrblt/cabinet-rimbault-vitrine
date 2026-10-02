"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { agency } from "@/lib/agency";
import { type OpeningStatus, openingStatus } from "@/lib/opening";
import { cn } from "@/lib/utils";

/**
 * Variantes du statut d'ouverture, comparées via `?bandeau=` :
 * - `aucun`   : pas de statut dans l'en-tête ;
 * - `bouton`  : le statut sous le numéro, dans le bouton d'appel ;
 * - `barre`   : le statut en texte simple, à côté du bouton d'appel ;
 * - `affiche` : un bandeau au-dessus, composé comme une affichette.
 */
export type Bandeau = "aucun" | "bouton" | "barre" | "affiche";
const BANDEAUX: Bandeau[] = ["aucun", "bouton", "barre", "affiche"];

export function SiteHeader({ base }: { base: string }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<OpeningStatus | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bandeau, setBandeau] = useState<Bandeau>("bouton");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("bandeau");
    if (BANDEAUX.includes(param as Bandeau)) setBandeau(param as Bandeau);
    // Le statut est calculé dans le navigateur : les pages sont mises en cache.
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
  const fade = cn(
    "transition-opacity duration-500",
    status ? "opacity-100" : "opacity-0",
  );

  return (
    <header className="en-tete sticky top-0 z-30 bg-blanc">
      {bandeau === "affiche" && (
        <div className="border-b border-filet bg-pierre">
          <p
            className={cn(
              "conteneur titre py-2 text-center text-[0.9375rem] italic",
              fade,
            )}
            aria-live="polite"
          >
            {status ? `${status.label}, au ${agency.address.street}.` : " "}
          </p>
        </div>
      )}

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

        <div className="hidden items-center gap-5 md:flex">
          {bandeau === "barre" && (
            <span className={cn("text-[0.875rem] text-gris", fade)}>
              {status?.short}
            </span>
          )}
          <a
            href={agency.phone.href}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full border border-encre/80 font-medium transition-colors duration-200 hover:bg-encre hover:text-blanc",
              bandeau === "bouton"
                ? "py-1.5 pr-5 pl-4"
                : "px-5 py-2.5 text-[0.9375rem]",
            )}
          >
            <Phone size={16} aria-hidden />
            {bandeau === "bouton" ? (
              <span className="flex flex-col leading-tight">
                <span className="text-[0.9375rem]">{agency.phone.display}</span>
                <span
                  className={cn("text-[0.75rem] font-normal opacity-70", fade)}
                >
                  {status?.short ?? " "}
                </span>
              </span>
            ) : (
              agency.phone.display
            )}
          </a>
        </div>

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
            {status && bandeau !== "aucun" && (
              <p className="mt-3 text-center text-mention text-gris">
                {status.label}
              </p>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
