import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  as: Heading = "h2",
  id,
  className,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex w-full items-end justify-between gap-4">
        <div className={cn(align === "center" && "w-full")}>
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {eyebrow}
            </p>
          )}
          <Heading
            id={id}
            className={cn(
              "text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl",
              Heading === "h1" && "text-3xl md:text-4xl",
            )}
          >
            {title}
          </Heading>
        </div>
        {action && <div className="hidden md:block">{action}</div>}
      </div>
      {lede && <p className="max-w-2xl text-base text-zinc-600">{lede}</p>}
      {action && <div className="md:hidden">{action}</div>}
    </div>
  );
}
