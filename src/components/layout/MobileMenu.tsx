"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AGENT, isPlaceholder } from "@/lib/config/agent";
import { EASE, HERO, heroContainer, heroLine } from "@/lib/motion";

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: NavItem[];
  /** Teinte du hamburger fermé — `light` sur le hero transparent de la home. */
  tone?: "dark" | "light";
  /** Appelé quand le panneau a fini son animation de repli (header resync). */
  onExited?: () => void;
}

/** Barre du hamburger — `bg-current` hérite de la teinte du bouton. */
const BAR = "block h-[2px] w-6 rounded-full bg-current";

export function MobileMenu({
  open,
  onOpenChange,
  items,
  tone = "dark",
  onExited,
}: MobileMenuProps) {
  const pathname = usePathname();
  const panelId = useId();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Verrou du scroll body pendant l'ouverture.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus : 1er lien à l'ouverture, retour au hamburger à la fermeture.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 160);
    return () => {
      window.clearTimeout(t);
      buttonRef.current?.focus();
    };
  }, [open]);

  // Échap + piège à focus (Tab cycle dans le panneau).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const close = () => onOpenChange(false);
  const hasPhone = !isPlaceholder(AGENT.phoneE164);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={`relative -mr-2 inline-flex h-11 w-11 items-center justify-center md:hidden ${
          tone === "light" ? "text-white" : "text-primary"
        }`}
      >
        <span className="flex h-[14px] w-6 flex-col justify-between">
          <motion.span
            className={BAR}
            animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
          <motion.span
            className={BAR}
            animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        </span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence onExitComplete={onExited}>
            {open && (
              <motion.div
                ref={panelRef}
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navigation"
                className="fixed inset-x-0 bottom-0 top-20 z-50 flex flex-col bg-header md:hidden"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.42, ease: EASE }}
              >
                <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-2 pb-[calc(2rem+env(safe-area-inset-bottom))] scrollbar-hide">
                  <motion.nav
                    aria-label="Navigation principale"
                    variants={heroContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col"
                  >
                    {items.map((item, i) => {
                      const active =
                        item.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.href);
                      return (
                        <motion.div key={item.href} variants={heroLine}>
                          <Link
                            ref={i === 0 ? firstLinkRef : undefined}
                            href={item.href}
                            onClick={close}
                            aria-current={active ? "page" : undefined}
                            className="group flex items-center gap-4 border-b border-subtle py-5 transition-transform duration-200 active:translate-x-1"
                          >
                            <span className="text-[0.68rem] font-medium tabular-nums uppercase tracking-[0.18em] text-subtle">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={`flex-1 font-display text-3xl font-medium leading-tight tracking-tight ${
                                active ? "text-link" : "text-primary"
                              }`}
                            >
                              {item.label}
                            </span>
                            <ArrowRight
                              aria-hidden="true"
                              className={`h-5 w-5 transition-all duration-200 ${
                                active
                                  ? "translate-x-0 text-link opacity-100"
                                  : "-translate-x-2 text-subtle opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                              }`}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.nav>

                  <motion.div
                    className="mt-auto pt-8"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: HERO.duration,
                      delay:
                        HERO.contentDelay + items.length * HERO.contentStagger,
                      ease: EASE,
                    }}
                  >
                    <Link
                      href="/estimation"
                      onClick={close}
                      className="block rounded-lg bg-primary-600 px-5 py-3.5 text-center text-base font-semibold text-on-primary shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md active:translate-y-0"
                    >
                      Estimer mon bien
                    </Link>
                    {hasPhone && (
                      <a
                        href={`tel:${AGENT.phoneE164}`}
                        className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-default py-3 text-sm font-semibold text-primary transition-colors hover:bg-section"
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        {AGENT.phoneDisplay}
                      </a>
                    )}
                    <div className="mt-6 flex items-start gap-2.5 text-sm text-muted">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-subtle"
                        aria-hidden="true"
                      />
                      <div>
                        <p>
                          {AGENT.address.line1}, {AGENT.address.postalCode}{" "}
                          {AGENT.address.city}
                        </p>
                        <p className="mt-0.5 text-subtle">
                          {AGENT.hours.weekdays}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
