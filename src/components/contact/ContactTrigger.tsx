"use client";

import type { ButtonHTMLAttributes } from "react";
import { buttonClass, type Size, type Variant } from "@/components/ui/Button";
import type { ContactSubject } from "@/lib/validation";
import { useContact } from "./ContactProvider";

interface ContactTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type"> {
  /** Objet pré-rempli de la demande (selon le contexte du CTA). */
  subject?: ContactSubject;
  /** Référence d'un bien, le cas échéant. */
  reference?: string;
  /** Si fourni, applique le style bouton du design system (comme `LinkButton`). */
  variant?: Variant;
  size?: Size;
}

/**
 * Bouton réutilisable : ouvre le drawer de contact au lieu de naviguer.
 * Avec `variant`, reprend le style du design system (`buttonClass`) ; sinon le
 * `className` passé est utilisé tel quel (CTA au style custom).
 */
export function ContactTrigger({
  subject,
  reference,
  variant,
  size,
  className,
  children,
  ...rest
}: ContactTriggerProps) {
  const { open } = useContact();
  const classes = variant ? buttonClass(variant, size, className) : className;
  return (
    <button
      type="button"
      className={classes}
      onClick={() => open({ subject, reference })}
      {...rest}
    >
      {children}
    </button>
  );
}
