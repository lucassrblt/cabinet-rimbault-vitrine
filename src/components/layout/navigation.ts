// Entrées de navigation (brief A2, A20) : source unique pour l'en-tête, le
// menu mobile et le pied de page.

export type NavEntry = { href: string; label: string };

/** Les 5 entrées de l'en-tête et du menu mobile, dans cet ordre (A2). */
export const MAIN_NAV: readonly NavEntry[] = [
  { href: "/biens", label: "Nos biens" },
  { href: "/vendre", label: "Vendre" },
  { href: "/louer", label: "Louer" },
  { href: "/le-cabinet", label: "Le cabinet" },
  { href: "/contact", label: "Contact" },
];

export const ESTIMATION_HREF = "/estimation";

/** Colonne « Le site » du pied (A20). */
export const FOOTER_SITE_NAV: readonly NavEntry[] = [
  { href: "/biens", label: "Nos biens" },
  { href: "/vendre", label: "Vendre" },
  { href: "/louer", label: "Louer" },
  { href: ESTIMATION_HREF, label: "Faire estimer" },
  { href: "/le-cabinet", label: "Le cabinet" },
  { href: "/contact", label: "Contact" },
];

/** Colonne « Informations » du pied (A20), avant la ligne des avis Google. */
export const FOOTER_INFO_NAV: readonly NavEntry[] = [
  { href: "/honoraires", label: "Nos honoraires" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
];

/** Une fiche (`/biens/10.131`) active « Nos biens » (doc 04 §4.1). */
export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
