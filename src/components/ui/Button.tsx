import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Boutons (doc 03 §6.1, brief A19).
// - principal : grenat plein. UN seul par écran, toujours dans le contenu.
// - secondaire : contour encre (contour crème dans un parent `.sur-grenat`).
// - tertiaire : texte souligné d'un filet, sans cadre.
// - taille compacte : 40 px (bouton « Faire estimer » de l'en-tête, A19).
// Libellé = verbe qui dit ce qui se passe, jamais de flèche ajoutée.

export type ButtonVariant = "principal" | "secondaire" | "tertiaire";
export type ButtonSize = "normal" | "compact";

export type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Pleine largeur (menu mobile, boutons de la fiche en mobile). */
  fullWidth?: boolean;
  /** Icône de la liste fermée (doc 03 §7), à gauche du libellé, 18 px. */
  icon?: ReactNode;
};

export function buttonClassName({
  variant = "principal",
  size = "normal",
  fullWidth = false,
  className,
}: Omit<ButtonStyleProps, "icon"> & { className?: string }) {
  return cn(
    "ui-btn",
    `ui-btn--${variant}`,
    size === "compact" && variant !== "tertiaire" && "ui-btn--compact",
    fullWidth && "ui-btn--large",
    className,
  );
}

type ButtonProps = ButtonStyleProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: React.Ref<HTMLButtonElement>;
  };

export function Button({
  variant,
  size,
  fullWidth,
  icon,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, fullWidth, className })}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
