"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CallButton } from "./CallButton";

/**
 * En-tête éditorial : le nom, la navigation en texte simple (page active en
 * rouge), un bouton d'appel. Pas de statut d'ouverture ici : il apparaît à
 * côté des boutons d'appel, là où il sert.
 */
export function SiteHeader({ base }: { base: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="en-tete sticky top-0 z-30 border-b border-filet bg-blanc">
      <div className="en-tete-barre conteneur flex h-[4.5rem] items-center justify-between gap-6">
        <Link
          href={base}
          className="text-[1.0625rem] font-medium tracking-tight"
        >
          Cabinet Rimbault
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-9 md:flex"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn(
                "text-[0.9375rem] transition-colors duration-200",
                isActive(l.href)
                  ? "text-rouge"
                  : "text-encre/75 hover:text-encre",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <CallButton variant="discret" />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          className="flex h-10 items-center gap-2 rounded-controle border border-filet px-3 text-[0.9375rem] md:hidden"
        >
          {menuOpen ? (
            <X size={18} aria-hidden />
          ) : (
            <Menu size={18} aria-hidden />
          )}
          {menuOpen ? "Fermer" : "Menu"}
        </button>
      </div>

      <div
        id="menu-mobile"
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-[var(--ease-site)] md:hidden",
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Navigation mobile"
            className="conteneur flex flex-col pb-6"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "titre border-b border-filet py-4 text-intertitre",
                  isActive(l.href) && "text-rouge",
                )}
              >
                {l.label}
              </Link>
            ))}
            <CallButton className="mt-6" />
          </nav>
        </div>
      </div>
    </header>
  );
}
