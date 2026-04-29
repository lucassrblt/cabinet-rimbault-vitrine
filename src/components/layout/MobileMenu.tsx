"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const items: { href: string; label: string }[] = [
  { href: "/", label: "Accueil" },
  { href: "/acheter", label: "Acheter" },
  { href: "/louer", label: "Louer" },
  { href: "/vendre", label: "Vendre" },
  { href: "/a-propos", label: "L'agence" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col bg-card p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Menu</span>
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-4 text-lg">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-1"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/estimation"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-sm bg-primary-600 px-4 py-2 text-center text-base font-medium text-on-primary hover:bg-primary-700"
            >
              Estimer mon bien
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
