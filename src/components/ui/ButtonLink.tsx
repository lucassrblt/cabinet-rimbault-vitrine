import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { type ButtonStyleProps, buttonClassName } from "./Button";

// Lien qui a l'apparence d'un bouton (doc 03 §6.1).
// Lien interne : next/link. `tel:`, `mailto:` et liens externes : <a> simple,
// dans le même onglet et sans icône d'ouverture (brief A16).

type ButtonLinkProps = ButtonStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export function ButtonLink({
  href,
  variant,
  size,
  fullWidth,
  icon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonClassName({ variant, size, fullWidth, className });
  if (isInternal(href)) {
    return (
      <Link href={href} className={classes} {...rest}>
        {icon}
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...rest}>
      {icon}
      {children}
    </a>
  );
}
