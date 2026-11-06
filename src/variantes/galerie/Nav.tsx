"use client";

// En-tête : marque, quatre liens, téléphone. Sur mobile, un bouton « Menu »
// déplie la liste (fermée à chaque changement de page).
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
      document.getElementById("chaude-menu-btn")?.focus();
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
      <button
        type="button"
        id="chaude-menu-btn"
        className={s.menuBtn}
        aria-expanded={open}
        aria-controls="chaude-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Fermer" : "Menu"}
      </button>
      <nav aria-label="Navigation principale" style={{ display: "contents" }}>
        <ul id="chaude-menu" className={s.navList} data-open={open}>
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
