// Primitives des wireframes : gris, sans style de marque. Le but est de
// juger la structure, la hiérarchie et la quantité de texte.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Emplacement photo, avec la description de l'image à produire. */
export function Photo({
  label,
  shot,
  className,
}: {
  label: string;
  shot?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-end bg-[#d9d9d9] p-3 text-[0.8125rem] leading-snug text-[#555]",
        className,
      )}
    >
      <span className="max-w-[28ch]">
        {shot && <span className="font-semibold">Photo à prendre : </span>}
        {label}
      </span>
    </div>
  );
}

/** Repère de section, renvoie au numéro de la liste validée. */
export function Section({
  n,
  name,
  children,
  className,
}: {
  n?: number;
  name: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative", className)}>
      <p className="wf-annot">
        {n != null && `${n}. `}
        {name}
      </p>
      {children}
    </section>
  );
}

export function Button({
  children,
  primary,
  className,
}: {
  children: ReactNode;
  primary?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-4 py-3 text-[0.9375rem] font-medium",
        primary ? "bg-[#333] text-white" : "border border-[#333]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-[#ddd] px-4 py-3 md:px-10">
      <span className="text-[0.9375rem] font-semibold tracking-wide">
        LOGOTYPE
      </span>
      <nav className="hidden gap-6 text-[0.9375rem] md:flex">
        <span>Nos biens</span>
        <span>L’agence</span>
        <span>Contact</span>
      </nav>
      <Button className="py-2!">Appeler</Button>
    </header>
  );
}

export function Footer({ n = 7 }: { n?: number | null }) {
  return (
    <Section
      n={n ?? undefined}
      name="Pied de page"
      className="mt-16 border-t border-[#ddd] bg-[#f0f0f0]"
    >
      <div className="grid gap-6 px-4 py-10 text-[0.8125rem] text-[#666] md:grid-cols-3 md:px-10">
        <p>
          Cabinet Rimbault
          <br />
          117 boulevard Voltaire, 92600 Asnières-sur-Seine
          <br />
          01 73 64 56 10
        </p>
        <p>
          Carte professionnelle, garant financier, médiateur, RCS : mentions
          réglementaires
        </p>
        <p>
          Barème des honoraires
          <br />
          Mentions légales
          <br />
          Confidentialité
        </p>
      </div>
    </Section>
  );
}
