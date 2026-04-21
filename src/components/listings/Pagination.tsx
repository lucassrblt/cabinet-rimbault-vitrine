import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
  params: Record<string, string | undefined>;
}

function buildHref(
  basePath: string,
  params: Record<string, string | undefined>,
  page: number,
): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && k !== "page") sp.set(k, v);
  }
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  params,
}: Props) {
  if (totalPages <= 1) return null;
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1"
    >
      <PageLink
        disabled={currentPage === 1}
        href={buildHref(basePath, params, Math.max(1, currentPage - 1))}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </PageLink>
      {pages.map((p) => (
        <PageLink
          key={p}
          active={p === currentPage}
          href={buildHref(basePath, params, p)}
          aria-label={`Page ${p}`}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </PageLink>
      ))}
      <PageLink
        disabled={currentPage === totalPages}
        href={buildHref(
          basePath,
          params,
          Math.min(totalPages, currentPage + 1),
        )}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  children,
  href,
  disabled,
  active,
  ...rest
}: {
  children: React.ReactNode;
  href: string;
  disabled?: boolean;
  active?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"a">, "children" | "href">) {
  const cls = cn(
    "inline-flex h-9 min-w-9 items-center justify-center rounded border px-2 text-sm",
    active
      ? "border-zinc-900 bg-zinc-900 text-white"
      : "border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900",
    disabled && "pointer-events-none opacity-40",
  );
  if (disabled) {
    return (
      <span className={cls} aria-disabled="true" {...rest}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
