import { hoursLine } from "@/components/layout/typo";
import { agency } from "@/lib/agency";
import { cn } from "@/lib/utils";

// Horaires du cabinet. Masqués tant que l'agent ne les a pas validés
// (`agency.hoursConfirmed`, brief §10-7) : jamais d'horaire présenté comme
// certain s'il ne l'est pas. Pas d'état « ouvert maintenant » : la page est
// statique, l'état serait faux à la minute près (journal, lot 6).

export function OpeningHours({ className }: { className?: string }) {
  if (!agency.hoursConfirmed) return null;
  return (
    <dl
      className={cn(
        "t-ui grid grid-cols-[auto_1fr] gap-x-6 gap-y-1",
        className,
      )}
    >
      {agency.hours.map((line) => (
        <div key={line.days} className="contents">
          <dt className="text-encre-douce">{line.days}</dt>
          <dd className="chiffres">{hoursLine(line.time)}</dd>
        </div>
      ))}
    </dl>
  );
}
