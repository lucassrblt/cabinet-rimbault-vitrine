import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Liens (doc 03 §6.2).
// - texte : grenat, soulignement à 45 % qui devient plein au survol. Crème
//   dans un parent `.sur-grenat`.
// - discret : couleur héritée, trait de 1 px qui se dessine au survol ; page
//   active en grenat avec le trait (passer aria-current="page").
// Tous les liens s'ouvrent dans le même onglet, sans icône (brief A16) :
// `target` n'est pas accepté.

type TextLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target"
> & {
  href: string;
  variant?: "texte" | "discret";
};

export function TextLink({
  href,
  variant = "texte",
  className,
  children,
  ...rest
}: TextLinkProps) {
  const classes = cn(
    variant === "texte" ? "ui-lien" : "ui-lien-discret",
    className,
  );
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}
