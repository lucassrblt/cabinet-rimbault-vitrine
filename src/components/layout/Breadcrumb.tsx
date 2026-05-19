import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  tone = "default",
}: {
  items: BreadcrumbItem[];
  tone?: "default" | "light";
}) {
  const isLight = tone === "light";
  return (
    <nav
      aria-label="Fil d'Ariane"
      className={isLight ? "text-sm text-white/70" : "text-sm text-body"}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={`${item.label}-${item.href ?? "end"}`}
              className="flex items-center"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={
                    isLight
                      ? "transition-colors hover:text-white"
                      : "hover:text-primary"
                  }
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLight ? "text-white" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={isLight ? "mx-2 text-white/40" : "mx-2 text-muted"}
                >
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
