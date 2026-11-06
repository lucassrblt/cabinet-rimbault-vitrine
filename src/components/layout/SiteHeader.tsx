"use client";

import { Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logotype } from "@/components/brand/Logotype";
import { useMarquerHydratation } from "@/components/motion/hydration";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { agency } from "@/lib/agency";
import { MobileMenu } from "./MobileMenu";
import { ESTIMATION_HREF, isActive, MAIN_NAV } from "./navigation";

// En-tête du site (brief A2 à A5, A19 ; doc 03 §6.8 ; doc 04 §4.1).
// - ≥ 1024 px : statique, 80 px filet compris. Logotype et sous-titre,
//   5 entrées, téléphone, « Faire estimer » en secondaire compact.
// - < 1024 px : collant en permanence, 64 px filet compris, sans masquage,
//   ombre ni changement de fond. Logotype, « Faire estimer » (« Estimer »
//   sous 380 px), bouton texte « Menu ».
// - `data-mv-entete` : groupe de transition au-dessus du contenu pendant le
//   fondu de page (doc 06 §1). Un seul élément du document le porte.
// Composant client : la page active se lit avec usePathname.

export const MOBILE_MENU_ID = "menu-mobile";

export function SiteHeader() {
  useMarquerHydratation();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Le menu se ferme à chaque navigation, y compris Précédent / Suivant.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const restoreFocus = useRef(false);
  const close = useCallback((restore: boolean) => {
    restoreFocus.current = restore;
    setOpen(false);
  }, []);

  // Le nettoyage du menu (en-tête rendu à nouveau focusable) passe avant cet
  // effet : React exécute tous les nettoyages avant les nouveaux effets.
  useEffect(() => {
    if (open || !restoreFocus.current) return;
    restoreFocus.current = false;
    menuButton.current?.focus();
  }, [open]);

  return (
    <>
      <header
        data-mv-entete
        className="sticky top-0 z-10 border-b border-filet bg-creme lg:static"
      >
        <Container className="flex h-[63px] items-center justify-between gap-2 sm:gap-6 lg:h-[79px]">
          <Link
            href="/"
            className="flex shrink-0 flex-col text-grenat no-underline"
          >
            <Logotype className="h-auto w-[142px] min-[380px]:w-[150px] min-[400px]:w-[158px] lg:w-[182px]" />
            <span className="t-legal mt-1 hidden leading-4 text-encre-douce min-[480px]:block">
              {agency.address.city}, depuis {agency.since}
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="t-nav flex gap-7">
              {MAIN_NAV.map((entry) => (
                <li key={entry.href}>
                  <TextLink
                    href={entry.href}
                    variant="discret"
                    aria-current={
                      isActive(pathname, entry.href) ? "page" : undefined
                    }
                  >
                    {entry.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-6">
            <TextLink
              href={agency.phone.href}
              variant="discret"
              className="t-nav chiffres hidden items-center gap-2 whitespace-nowrap text-encre lg:inline-flex"
            >
              <Phone aria-hidden="true" size={16} strokeWidth={1.5} />
              {agency.phone.display}
            </TextLink>
            <ButtonLink
              href={ESTIMATION_HREF}
              variant="secondaire"
              size="compact"
              className="max-[380px]:px-3"
            >
              <span className="max-[380px]:hidden">Faire estimer</span>
              <span className="min-[380px]:hidden">Estimer</span>
            </ButtonLink>
            <button
              ref={menuButton}
              type="button"
              aria-expanded={open}
              aria-controls={MOBILE_MENU_ID}
              onClick={() => setOpen(true)}
              className="-mr-2 inline-flex h-12 min-w-12 cursor-pointer items-center justify-center px-1 font-sans text-[15px] leading-none font-medium text-encre min-[380px]:-mr-1 lg:hidden"
            >
              Menu
            </button>
          </div>
        </Container>
      </header>
      <MobileMenu
        id={MOBILE_MENU_ID}
        open={open}
        pathname={pathname}
        onClose={close}
      />
    </>
  );
}
