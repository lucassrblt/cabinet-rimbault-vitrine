"use client";

import Image from "next/image";
import { useState } from "react";
import { Rating } from "@/components/ui/Rating";
import type { GoogleReview } from "@/lib/reviews/types";
import { cn } from "@/lib/utils";
import { GoogleGlyph } from "./GoogleGlyph";

/** Au-delà de ce seuil, la variante « full » propose un toggle « Lire plus ». */
const LONG_TEXT_THRESHOLD = 260;

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Bloc auteur (photo Google ou initiales + nom + date). */
function ReviewAuthor({ review }: { review: GoogleReview }) {
  return (
    <>
      {review.avatarUrl ? (
        <Image
          src={review.avatarUrl}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 font-display text-sm font-semibold text-primary-700"
        >
          {getInitials(review.authorName)}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-primary">
          {review.authorName}
        </p>
        <p className="text-xs text-muted">{review.relativeTime}</p>
      </div>
    </>
  );
}

export function ReviewCard({
  review,
  variant = "full",
}: {
  review: GoogleReview;
  variant?: "full" | "compact";
}) {
  const [expanded, setExpanded] = useState(false);
  const canExpand =
    variant === "full" && review.text.length > LONG_TEXT_THRESHOLD;

  return (
    <article className="group flex h-full flex-col rounded-lg border border-subtle bg-card p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-default hover:shadow-md md:p-7">
      <div className="flex items-center justify-between gap-3">
        <Rating value={review.rating} />
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-subtle">
          <GoogleGlyph className="h-3.5 w-3.5" />
          Google
        </span>
      </div>

      <blockquote className="mt-4 flex-1">
        <span
          aria-hidden="true"
          className="mb-3 block h-0.5 w-8 rounded-full bg-primary-600/30 transition-colors duration-300 group-hover:bg-primary-600/60"
        />
        <p
          className={cn(
            "whitespace-pre-line text-[15px] leading-relaxed text-body",
            !expanded &&
              (variant === "compact" ? "line-clamp-3" : "line-clamp-5"),
          )}
        >
          {review.text}
        </p>
      </blockquote>

      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 self-start text-sm font-medium text-primary-600 underline underline-offset-4 transition-colors hover:text-primary-700"
        >
          {expanded ? "Lire moins" : "Lire plus"}
        </button>
      )}

      <footer className="mt-5 border-t border-subtle pt-4">
        {review.authorUrl ? (
          <a
            href={review.authorUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <ReviewAuthor review={review} />
          </a>
        ) : (
          <div className="flex items-center gap-3">
            <ReviewAuthor review={review} />
          </div>
        )}
      </footer>
    </article>
  );
}
