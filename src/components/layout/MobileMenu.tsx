"use client";

import { Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Logotype } from "@/components/brand/Logotype";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { agency } from "@/lib/agency";
import { ESTIMATION_HREF, isActive, MAIN_NAV } from "./navigation";
import { cityLine, streetLine } from "./typo";

// Menu mobile (brief A4, A19 ; doc 03 §6.9 ; doc 04 §4.1 ; doc 06 §6).
// Panneau plein écran sur crème, frère de l'en-tête (jamais dans le <header>,
// qui porte un nom de transition de vue). Fermé : attribut `hidden`. Ouvert :
// seul élément `position: fixed` du site avec la visionneuse (brief §9).
// - Fondu de 180 ms par `.mv-panneau` (Iniesta), rien en JS.
// - Ouvert : le reste de la page est inerte, le défilement du corps est
//   bloqué, Tab boucle dans le panneau, Échap et « Fermer » ferment et
//   rendent le focus au bouton « Menu ».
// - Se ferme à chaque navigation (SiteHeader), jamais au clic sur un lien
//   (voir closeOnSamePage), et au passage en desktop.
// - Ouvert, le panneau porte `view-transition-name: mv-menu` : si l'on
//   navigue depuis le menu, il forme son propre groupe de transition, au-dessus
//   de l'ancien contenu de la page (fondu de sortie : bloc MOUVEMENT, lot I).
//   Fermé, il n'a pas de nom, et le nouvel état n'en a donc aucune image.
// - « Faire estimer votre bien » y redevient principal : le contenu de la
//   page est masqué, c'est le seul bouton grenat visible (A19).

/** Éléments de la page rendus inertes quand le menu est ouvert. */
const PAGE_SELECTOR = "#evitement, [data-mv-entete], #contenu, #pied";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type MobileMenuProps = {
  id: string;
  open: boolean;
  pathname: string;
  /** `true` : rendre le focus au bouton « Menu » (Échap, « Fermer »). */
  onClose: (restoreFocus: boolean) => void;
};

export function MobileMenu({ id, open, pathname, onClose }: MobileMenuProps) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // Un lien du menu ne ferme pas le panneau au clic : c'est le changement de
  // chemin (SiteHeader) qui le ferme, dans le même rendu que la nouvelle page.
  // L'ancien état de la transition de vue contient donc le panneau ouvert,
  // sous son nom `mv-menu`, au-dessus de l'ancien contenu. Fermé dès le clic,
  // il était déjà retombé dans le groupe `root`, sous l'ancien contenu.
  // Lien vers la page affichée (chemin inchangé) : fermeture immédiate.
  const closeOnSamePage = (href: string) => {
    if (href.split("?")[0] === pathname) onClose(false);
  };

  useEffect(() => {
    if (!open) return;

    const page = Array.from(
      document.querySelectorAll<HTMLElement>(PAGE_SELECTOR),
    );
    for (const element of page) element.inert = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose(true);
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const focusables = Array.from(
        panel.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (
        event.shiftKey &&
        (active === first || !panel.current.contains(active))
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // Passage en desktop (≥ 1024 px) : le panneau n'existe plus à l'écran.
    const desktop = window.matchMedia("(width >= 64rem)");
    const onDesktop = () => {
      if (desktop.matches) onClose(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
      for (const element of page) element.inert = false;
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      ref={panel}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      hidden={!open}
      style={open ? { viewTransitionName: "mv-menu" } : undefined}
      className="mv-panneau fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-creme lg:hidden"
    >
      <div className="conteneur pb-10">
        <div className="-mx-(--marge) flex h-[63px] items-center justify-between gap-2 border-b border-filet px-(--marge) min-[380px]:gap-6">
          <Link
            href="/"
            onClick={() => closeOnSamePage("/")}
            className="flex shrink-0 flex-col text-grenat no-underline"
          >
            <Logotype className="h-auto w-[142px] min-[380px]:w-[150px] min-[400px]:w-[158px]" />
            <span className="t-legal mt-1 hidden leading-4 text-encre-douce min-[480px]:block">
              {agency.address.city}, depuis {agency.since}
            </span>
          </Link>
          <button
            ref={closeButton}
            type="button"
            aria-expanded="true"
            aria-controls={id}
            onClick={() => onClose(true)}
            className="-mr-2 inline-flex h-12 min-w-12 cursor-pointer items-center justify-center px-1 font-sans text-[15px] leading-none font-medium text-encre min-[380px]:-mr-1"
          >
            Fermer
          </button>
        </div>

        <nav aria-label="Navigation principale" className="mt-6">
          <ul>
            {MAIN_NAV.map((entry) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  onClick={() => closeOnSamePage(entry.href)}
                  aria-current={
                    isActive(pathname, entry.href) ? "page" : undefined
                  }
                  className="flex min-h-12 items-center border-b border-filet py-3.5 font-serif text-[26px] leading-8 text-encre no-underline aria-[current=page]:text-grenat"
                >
                  {entry.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 grid gap-3">
          <ButtonLink
            href={ESTIMATION_HREF}
            fullWidth
            onClick={() => closeOnSamePage(ESTIMATION_HREF)}
          >
            Faire estimer votre bien
          </ButtonLink>
          <ButtonLink
            href={agency.phone.href}
            variant="secondaire"
            fullWidth
            icon={<Phone aria-hidden="true" strokeWidth={1.5} />}
          >
            <span className="chiffres">{agency.phone.display}</span>
          </ButtonLink>
        </div>

        <address className="t-petit mt-6 text-encre-douce">
          {streetLine()}
          <br />
          {cityLine()}
        </address>
      </div>
    </div>
  );
}
