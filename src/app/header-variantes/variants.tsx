// Variantes d'en-tête. Elles réagissent à la largeur de leur cadre
// (container queries) pour montrer desktop et mobile côte à côte.
import { Menu, Phone } from "lucide-react";
import { agency } from "@/lib/agency";
import { cn } from "@/lib/utils";

const NAV = ["Nos biens", "L’agence", "Contact"];
const ACTIVE = "Nos biens";

/** Emplacement du futur logo : le nom, sans traitement. */
function Name({ className }: { className?: string }) {
  return (
    <span className={cn("text-[1rem] font-medium tracking-tight", className)}>
      Cabinet Rimbault
    </span>
  );
}

function MenuButton({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-11 items-center justify-center rounded-full @3xl:hidden",
        className,
      )}
      aria-hidden
    >
      <Menu size={20} />
    </span>
  );
}

/** 1. Capsule flottante, détachée des bords, posée sur la photo. */
export function HeaderCapsule() {
  return (
    <div className="absolute inset-x-0 top-0 z-10 p-3 @3xl:p-5">
      <div className="mx-auto flex max-w-[72rem] items-center justify-between gap-4 rounded-full bg-blanc/85 py-1.5 pr-1.5 pl-5 shadow-[0_8px_30px_-12px_rgb(36_31_30/0.35)] backdrop-blur-md">
        <Name />
        <nav className="hidden items-center gap-1 @3xl:flex">
          {NAV.map((n) => (
            <span
              key={n}
              className={cn(
                "rounded-full px-4 py-2 text-[0.9375rem] transition-colors hover:bg-pierre",
                n === ACTIVE && "bg-pierre",
              )}
            >
              {n}
            </span>
          ))}
        </nav>
        <span className="hidden items-center gap-2 rounded-full bg-rouge px-5 py-2.5 text-[0.9375rem] font-medium text-blanc @3xl:inline-flex">
          <Phone size={16} aria-hidden />
          {agency.phone.display}
        </span>
        <MenuButton className="bg-pierre" />
      </div>
    </div>
  );
}

/** 2. Vitre : transparent sur la photo, pastilles givrées. Devient blanc au défilement. */
export function HeaderVitre() {
  return (
    <div className="absolute inset-x-0 top-0 z-10 bg-encre/25 text-blanc">
      <div className="mx-auto flex max-w-[76rem] items-center justify-between gap-4 px-4 py-4 @3xl:px-10">
        <Name className="text-blanc" />
        <nav className="hidden items-center gap-2 @3xl:flex">
          {NAV.map((n) => (
            <span
              key={n}
              className={cn(
                "rounded-full px-4 py-2 text-[0.9375rem] backdrop-blur-md transition-colors hover:bg-blanc/25",
                n === ACTIVE ? "bg-blanc/30" : "bg-blanc/10",
              )}
            >
              {n}
            </span>
          ))}
        </nav>
        <span className="hidden items-center gap-2 rounded-full bg-blanc px-5 py-2.5 text-[0.9375rem] font-medium text-encre @3xl:inline-flex">
          <Phone size={16} aria-hidden />
          Appeler
        </span>
        <MenuButton className="bg-blanc/20 backdrop-blur-md" />
      </div>
    </div>
  );
}

/** 3. Deux niveaux : un bandeau « ouvert aujourd'hui », comme sur la porte de l'agence. */
export function HeaderOuvert({
  openNow,
  today,
}: {
  openNow: boolean;
  today: string;
}) {
  return (
    <div className="absolute inset-x-0 top-0 z-10 bg-blanc">
      <div className="bg-pierre">
        <div className="mx-auto flex max-w-[76rem] items-center justify-between gap-4 px-4 py-2 text-[0.8125rem] @3xl:px-10">
          <span className="flex items-center gap-2">
            <span
              className={cn(
                "size-2 rounded-full",
                openNow ? "bg-[#2f7d4f]" : "bg-gris",
              )}
              aria-hidden
            />
            {openNow ? "Ouvert" : "Fermé"} aujourd’hui, {today}
          </span>
          <span className="hidden text-gris @3xl:inline">
            {agency.address.street}, {agency.address.city}
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-[76rem] items-center justify-between gap-4 px-4 py-3 @3xl:px-10">
        <Name />
        <nav className="hidden items-center gap-1 @3xl:flex">
          {NAV.map((n) => (
            <span
              key={n}
              className={cn(
                "rounded-full px-4 py-2 text-[0.9375rem] transition-colors hover:bg-pierre",
                n === ACTIVE && "font-medium text-rouge",
              )}
            >
              {n}
            </span>
          ))}
        </nav>
        <span className="hidden items-center gap-2 rounded-full border border-encre/80 px-5 py-2.5 text-[0.9375rem] font-medium @3xl:inline-flex">
          <Phone size={16} aria-hidden />
          {agency.phone.display}
        </span>
        <MenuButton className="bg-pierre" />
      </div>
    </div>
  );
}

/** 4. La banne : une feuille blanche suspendue, aux coins inférieurs arrondis, nom au centre. */
export function HeaderBanne() {
  return (
    <div className="absolute inset-x-0 top-0 z-10 px-3 @3xl:px-8">
      <div className="mx-auto grid max-w-[72rem] grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-b-[1.75rem] bg-blanc px-5 py-4 shadow-[0_14px_40px_-20px_rgb(36_31_30/0.4)] @3xl:px-8 @3xl:py-5">
        <nav className="hidden items-center gap-1 @3xl:flex">
          {NAV.slice(0, 2).map((n) => (
            <span
              key={n}
              className={cn(
                "rounded-full px-4 py-2 text-[0.9375rem] transition-colors hover:bg-pierre",
                n === ACTIVE && "bg-pierre",
              )}
            >
              {n}
            </span>
          ))}
        </nav>
        <MenuButton className="-ml-2 bg-pierre" />
        <Name className="text-center text-[1.0625rem]" />
        <div className="flex items-center justify-end gap-1">
          <span className="hidden rounded-full px-4 py-2 text-[0.9375rem] transition-colors hover:bg-pierre @3xl:inline">
            Contact
          </span>
          <span
            className="flex size-11 items-center justify-center rounded-full bg-rouge text-blanc"
            aria-hidden
          >
            <Phone size={17} aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}

/** 5. Rail : la navigation dans un rail arrondi, l'onglet actif en relief. */
export function HeaderRail() {
  return (
    <div className="absolute inset-x-0 top-0 z-10 bg-blanc">
      <div className="mx-auto flex max-w-[76rem] items-center justify-between gap-4 px-4 py-3.5 @3xl:px-10">
        <Name />
        <nav className="hidden items-center rounded-full bg-pierre p-1 @3xl:flex">
          {NAV.map((n) => (
            <span
              key={n}
              className={cn(
                "rounded-full px-5 py-2 text-[0.9375rem] transition-all",
                n === ACTIVE
                  ? "bg-blanc shadow-[0_2px_8px_-2px_rgb(36_31_30/0.25)]"
                  : "text-gris hover:text-encre",
              )}
            >
              {n}
            </span>
          ))}
        </nav>
        <span className="hidden items-center gap-3 @3xl:inline-flex">
          <span className="text-[0.9375rem] tabular-nums">
            {agency.phone.display}
          </span>
          <span
            className="flex size-11 items-center justify-center rounded-full bg-rouge text-blanc"
            aria-hidden
          >
            <Phone size={17} />
          </span>
        </span>
        <MenuButton className="bg-pierre" />
      </div>
    </div>
  );
}
