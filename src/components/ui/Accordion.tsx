"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="divide-y divide-subtle rounded-sm border border-subtle bg-card">
      {items.map((item) => (
        <details key={item.id} className="group px-4 py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-primary">
            <span>{item.question}</span>
            <ChevronDown
              className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="mt-3 text-sm text-body">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
