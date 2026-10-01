import { cn } from "@/lib/utils";

/** Monogramme « CR » + nom : le logotype de l'en-tête. */
export function Logo({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className="titre flex size-10 shrink-0 items-center justify-center bg-rouge text-[1rem] font-bold tracking-wider text-blanc"
        aria-hidden
      >
        CR
      </span>
      <span className="flex flex-col leading-none">
        <span className="logo-nom text-[0.9rem]">Cabinet Rimbault</span>
        {!compact && (
          <span className="titre mt-1 text-[0.8rem] italic text-gris">
            Transactions immobilières
          </span>
        )}
      </span>
    </span>
  );
}

/** La plaque : l'enseigne en miniature, utilisée une seule fois en signature. */
export function Plaque({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex flex-col bg-rouge px-[0.95em] pt-[0.7em] pb-[0.6em] leading-none text-blanc",
        className,
      )}
    >
      <span className="logo-nom">Cabinet Rimbault</span>
      <span className="titre mt-[0.3em] text-[0.72em] italic">
        Transactions immobilières
      </span>
    </span>
  );
}
