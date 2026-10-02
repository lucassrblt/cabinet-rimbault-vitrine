import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { agency } from "@/lib/agency";
import { cn } from "@/lib/utils";

type Common = { children: ReactNode; className?: string };

/** Action principale : pilule sombre et pastille flèche. Une fois par écran. */
export function Bouton({
  href,
  children,
  className,
  clair,
  icone = "fleche",
  as = "a",
}: Common & {
  href?: string;
  clair?: boolean;
  icone?: "fleche" | "telephone";
  as?: "a" | "button";
}) {
  const inner = (
    <>
      {children}
      <span
        className={cn(
          "bouton-pastille",
          icone === "telephone" && "sans-rotation",
        )}
        aria-hidden
      >
        {icone === "telephone" ? (
          <Phone size={16} />
        ) : (
          <ArrowUpRight size={17} />
        )}
      </span>
    </>
  );
  const cls = cn(
    "bouton",
    clair ? "bouton-clair" : "bouton-principal",
    className,
  );
  if (as === "button") {
    return (
      <button type="button" className={cls}>
        {inner}
      </button>
    );
  }
  const url = href ?? "#";
  return url.startsWith("/") ? (
    <Link href={url} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={url} className={cls}>
      {inner}
    </a>
  );
}

/** Action secondaire : lien appuyé avec flèche. */
export function LienAppuye({
  href,
  children,
  className,
}: Common & { href: string }) {
  const inner = (
    <>
      {children}
      <ArrowRight size={16} aria-hidden />
    </>
  );
  return href.startsWith("/") ? (
    <Link href={href} className={cn("lien-appuye", className)}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cn("lien-appuye", className)}>
      {inner}
    </a>
  );
}

/** Appeler l'agence : le bouton principal, avec le numéro. */
export function BoutonAppel({
  className,
  clair,
  label,
}: {
  className?: string;
  clair?: boolean;
  label?: string;
}) {
  return (
    <Bouton
      href={agency.phone.href}
      icone="telephone"
      clair={clair}
      className={className}
    >
      <span className="tabular-nums">{label ?? agency.phone.display}</span>
    </Bouton>
  );
}
