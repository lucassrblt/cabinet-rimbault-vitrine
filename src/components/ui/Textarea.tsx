import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Zone de texte : mêmes états que Input, 160 px de haut au moins,
// redimensionnable verticalement.

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  ref?: React.Ref<HTMLTextAreaElement>;
};

export function Textarea({ className, rows = 6, ...rest }: TextareaProps) {
  return (
    <textarea rows={rows} className={cn("ui-input", className)} {...rest} />
  );
}
