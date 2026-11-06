import type { ReactNode } from "react";
import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/utils";

// État vide rédigé d'une liste de biens (doc 04 §2.2, Maldini §5.1) : une
// phrase vraie, puis des sorties utiles. Jamais un cadre vide ni « 0 bien ».

export type EmptyStateExit = {
  question: string;
  answer: string;
  href: string;
  link: string;
};

type PropertyEmptyStateProps = {
  message: ReactNode;
  exits?: readonly EmptyStateExit[];
  className?: string;
};

export function PropertyEmptyState({
  message,
  exits = [],
  className,
}: PropertyEmptyStateProps) {
  return (
    <div className={cn("max-w-[40rem]", className)}>
      <p className="t-chapo text-encre">{message}</p>
      {exits.length ? (
        <ul className="mt-6 border-t border-filet">
          {exits.map((exit) => (
            <li key={exit.href} className="t-ui border-b border-filet py-4">
              <span className="text-encre">{exit.question}</span>{" "}
              {exit.answer ? (
                <>
                  <span className="text-encre-douce">{exit.answer}</span>{" "}
                </>
              ) : null}
              <TextLink href={exit.href} className="whitespace-nowrap">
                {exit.link}
              </TextLink>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
