"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

type Tone = "dark" | "light";

export function NavLinks({
  items,
  tone = "dark",
}: {
  items: NavItem[];
  tone?: Tone;
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        const toneClasses =
          tone === "light"
            ? isActive
              ? "active text-white"
              : "text-white/85 hover:text-white"
            : isActive
              ? "active text-primary"
              : "text-body hover:text-primary";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link text-sm font-semibold tracking-wide transition-colors duration-150 ${toneClasses}`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
