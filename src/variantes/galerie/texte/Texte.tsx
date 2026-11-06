import Link from "next/link";
import type { ReactNode } from "react";
import s from "../base.module.css";
import t from "./texte.module.css";

// Pages de texte de la Galerie (mentions légales, confidentialité,
// honoraires) : un titre discret, la date de mise à jour, un sommaire en
// ancres au-delà de quatre sections, puis une colonne de lecture sobre.
// Les `h2` du texte portent les `id` cités dans `toc`.

export type SectionTexte = { id: string; title: string };

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** « 1er octobre 2026 », « 31 octobre 2026 » ; null si la date est invalide. */
function dateLongue(iso: string): string | null {
  const match = ISO_DATE.exec(iso);
  if (!match) return null;
  const date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
  if (Number.isNaN(date.getTime()) || date.getUTCDate() !== +match[3]) {
    return null;
  }
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .formatToParts(date)
    .map((part) =>
      part.type === "day" && part.value === "1"
        ? "1er"
        : part.type === "literal"
          ? " "
          : part.value,
    )
    .join("");
}

export function PageTexte({
  title,
  updatedAt,
  lead,
  toc,
  children,
  ...rest
}: {
  title: string;
  /** Date ISO « AAAA-MM-JJ ». */
  updatedAt?: string;
  /** Chapô sous le titre. */
  lead?: ReactNode;
  toc?: readonly SectionTexte[];
  children: ReactNode;
  "data-bareme"?: string;
}) {
  const maj = updatedAt ? dateLongue(updatedAt) : null;
  const sommaire = toc !== undefined && toc.length > 4;
  return (
    <div className={`${s.w} ${s.g} ${t.page}`} {...rest}>
      <header className={t.tete}>
        <h1>{title}</h1>
        {lead ? <div className={t.chapo}>{lead}</div> : null}
        {maj && updatedAt ? (
          <p className={`${t.maj} ${s.num}`}>
            Mise à jour le <time dateTime={updatedAt}>{maj}</time>.
          </p>
        ) : null}
      </header>
      {sommaire ? (
        <nav aria-labelledby="sommaire" className={t.sommaire}>
          <h2 id="sommaire">Sommaire</h2>
          <ol>
            {toc.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <div className={t.prose}>{children}</div>
    </div>
  );
}

/** Lien du texte : `next/link` pour une page du site, `<a>` sinon. */
export function Lien({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = `${s.u} ${className ?? ""}`.trim();
  return href.startsWith("/") ? (
    <Link className={cls} href={href}>
      {children}
    </Link>
  ) : (
    <a className={cls} href={href}>
      {children}
    </a>
  );
}

/** Groupe de mots qui ne se coupe pas en fin de ligne. */
export function Insec({ children }: { children: ReactNode }) {
  return <span className={t.insec}>{children}</span>;
}
