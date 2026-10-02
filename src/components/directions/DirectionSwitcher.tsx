"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const DIRECTIONS = [
  { href: "/maquettes", name: "Actuelle" },
  { href: "/directions/editoriale", name: "Éditoriale" },
  { href: "/directions/moderne", name: "Moderne" },
  { href: "/directions/hybride", name: "Hybride" },
];

/** Passe d'une direction d'accueil à l'autre. */
export function DirectionSwitcher() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Directions à comparer"
      className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-full bg-[#111]/92 p-1 font-sans text-[0.8125rem] text-white shadow-[0_12px_30px_-12px_rgb(0_0_0/0.6)] backdrop-blur-md [scrollbar-width:none] md:bottom-6"
    >
      {DIRECTIONS.map((d) => (
        <Link
          key={d.href}
          href={d.href}
          aria-current={pathname === d.href ? "page" : undefined}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-1.5 transition-colors",
            pathname === d.href ? "bg-white text-[#111]" : "hover:bg-white/15",
          )}
        >
          {d.name}
        </Link>
      ))}
    </nav>
  );
}
