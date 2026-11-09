"use client";

// En-tête : marque, cinq liens, téléphone. Sur mobile, un bouton « Menu »
// déplie la liste (fermée à chaque changement de page) ; un bouton d'appel
// (icône téléphone) le précède.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { agency } from "@/lib/agency";
import s from "./base.module.css";

export function Nav({ count }: { count: number | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refermer à chaque navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Échap referme le menu et rend le focus au bouton.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      document.getElementById("galerie-menu-btn")?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string, exact = false) =>
    (exact ? pathname === href : pathname.startsWith(href))
      ? ("page" as const)
      : undefined;

  return (
    <header className={`${s.w} ${s.g} ${s.nav}`}>
      <Link className={s.brand} href="/">
        {agency.name}
      </Link>
      {/* Sous 900 px, là où le numéro de l'en-tête est replié : appeler en un geste. */}
      {/* biome-ignore lint/a11y/useAnchorContent: nom accessible donné par aria-label (Biome ne lit pas une valeur calculée) */}
      <a
        className={s.appel}
        href={agency.phone.href}
        aria-label={`Appeler le cabinet, ${agency.phone.display}`}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5.5 3.5h3l1.6 4.2-2.1 1.4a11 11 0 0 0 6.9 6.9l1.4-2.1 4.2 1.6v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
        </svg>
      </a>
      <button
        type="button"
        id="galerie-menu-btn"
        className={s.menuBtn}
        aria-expanded={open}
        aria-controls="galerie-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Fermer" : "Menu"}
      </button>
      <nav aria-label="Navigation principale" style={{ display: "contents" }}>
        <ul id="galerie-menu" className={s.navList} data-open={open}>
          <li>
            <Link href="/" aria-current={current("/", true)}>
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/biens" aria-current={current("/biens")}>
              Biens
              {count ? (
                <sup className={s.num}>
                  {count}
                  <span className={s.sr}> en vente</span>
                </sup>
              ) : null}
            </Link>
          </li>
          <li>
            <Link href="/vendre" aria-current={current("/vendre")}>
              Vendre
            </Link>
          </li>
          <li>
            <Link
              href="/le-cabinet"
              aria-current={current("/le-cabinet", true)}
            >
              Le cabinet
            </Link>
          </li>
          <li>
            <Link href="/contact" aria-current={current("/contact")}>
              Contact
            </Link>
          </li>
          <li>
            <a className={`${s.navTel} ${s.num}`} href={agency.phone.href}>
              {agency.phone.display}
            </a>
          </li>
        </ul>
      </nav>
      <a className={`${s.tel} ${s.num}`} href={agency.phone.href}>
        {agency.phone.display}
      </a>
    </header>
  );
}
