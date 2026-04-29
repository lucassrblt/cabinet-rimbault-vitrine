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
  { href: "/vendre", label: "Vendre" },
  { href: "/a-propos", label: "L'agence" },
];

export function Header() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

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
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-subtle bg-header"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center px-4 md:px-8">
        <Link
          href="/"
          className="shrink-0"
          aria-label="Cabinet Rimbault — Accueil"
        >
          <Image
            src="/logo-cabinet-rimbault.png"
            alt="Cabinet Rimbault"
            width={180}
            height={60}
            priority
            className="h-12 w-auto"
          />
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-12 md:flex">
          <nav
            aria-label="Navigation principale"
            className="flex items-center gap-8"
          >
            <NavLinks items={navItems} />
          </nav>

          <Link
            href="/estimation"
            className="shrink-0 rounded-sm bg-primary-600 px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors duration-150 hover:bg-primary-700"
          >
            Estimer mon bien
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end md:hidden">
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}
