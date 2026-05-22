import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

export function PageShell({
  title,
  lede,
  breadcrumb,
  children,
}: {
  title: string;
  lede?: string;
  breadcrumb?: BreadcrumbItem[];
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-gutter py-6 md:py-10">
      {breadcrumb && breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        {lede && <p className="mt-3 max-w-2xl text-base text-body">{lede}</p>}
      </header>
      {children}
    </main>
  );
}
