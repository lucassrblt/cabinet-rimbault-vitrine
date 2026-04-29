"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link text-sm font-semibold tracking-wide transition-colors duration-150 ${
              isActive ? "active text-primary" : "text-body hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
