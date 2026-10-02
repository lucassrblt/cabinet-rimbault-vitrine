import { Phone } from "lucide-react";
import { agency } from "@/lib/agency";
import { cn } from "@/lib/utils";

/**
 * Le numéro comme bouton d'appel.
 * - `plaque` : bouton principal plein (une fois par écran) ;
 * - `discret` : dans l'en-tête, sans fond, une petite plaque porte l'icône.
 */
export function CallButton({
  variant = "plaque",
  label = "Appeler le cabinet",
  className,
}: {
  variant?: "plaque" | "discret";
  label?: string;
  className?: string;
}) {
  if (variant === "discret") {
    return (
      <a
        href={agency.phone.href}
        className={cn("group inline-flex items-center gap-3", className)}
      >
        <span className="flex size-9 items-center justify-center rounded-plaque bg-rouge text-blanc shadow-[inset_0_0_0_2px_var(--color-rouge),inset_0_0_0_3px_rgb(255_255_255/0.28)] transition-colors group-hover:bg-rouge-fonce">
          <Phone size={15} aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block text-[0.75rem] text-gris">{label}</span>
          <span className="titre block text-[1rem] font-semibold tracking-[0.02em] tabular-nums">
            {agency.phone.display}
          </span>
        </span>
      </a>
    );
  }

  return (
    <a
      href={agency.phone.href}
      className={cn("bouton bouton-principal bouton-appel", className)}
    >
      <Phone size={18} aria-hidden />
      <span>
        <span className="appel-libelle">{label}</span>
        <span className="appel-numero">{agency.phone.display}</span>
      </span>
    </a>
  );
}
