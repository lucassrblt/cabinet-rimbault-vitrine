import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Liste déroulante native (chambres, salles d'eau, objet du message).
// Apparence du système retirée pour s'aligner sur Input ; chevron dessiné en
// CSS dans le conteneur. Les attributs passés (id, aria-*) vont au <select>.

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  ref?: React.Ref<HTMLSelectElement>;
  wrapperClassName?: string;
};

export function Select({
  className,
  wrapperClassName,
  children,
  ...rest
}: SelectProps) {
  return (
    <span className={cn("ui-select", wrapperClassName)}>
      <select className={cn("ui-input", className)} {...rest}>
        {children}
      </select>
    </span>
  );
}
