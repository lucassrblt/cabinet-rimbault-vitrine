"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/acheter", label: "Acheter" },
  { href: "/louer", label: "Louer" },
  { href: "/agence", label: "L'agence" },
];

export function Header() {
  const [hidden, setHidden] = useState(false);
  // `menuOpen` pilote l'AnimatePresence du menu ; `menuVisible` reste vrai tant
  // que le panneau est à l'écran (repli compris) pour resync l'apparence du header.
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { scrollY } = useScroll();

  const handleMenuOpenChange = (next: boolean) => {
    setMenuOpen(next);
    if (next) setMenuVisible(true);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header
      animate={{ y: hidden && !menuVisible ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-subtle bg-header transition-colors duration-200"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center px-gutter">
        <Link
          href="/"
          className="shrink-0"
          aria-label="Cabinet Rimbault — Accueil"
        >
          <Image
            src="/cr-logo.png"
            alt="Cabinet Rimbault"
            width={600}
            height={200}
            priority
            sizes="(min-width: 768px) 132px, 120px"
            className="h-10 w-auto md:h-11"
          />
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-12 md:flex">
          <nav
            aria-label="Navigation principale"
            className="flex items-center gap-8"
          >
            <NavLinks items={navItems} tone="dark" />
          </nav>

          <Link
            href="/estimation"
            className="shrink-0 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md active:translate-y-0 active:duration-75"
          >
            Estimer mon bien
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end md:hidden">
          <MobileMenu
            open={menuOpen}
            onOpenChange={handleMenuOpenChange}
            onExited={() => setMenuVisible(false)}
            items={navItems}
            tone="dark"
          />
        </div>
      </div>
    </motion.header>
  );
}
