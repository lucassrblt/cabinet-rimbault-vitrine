"use client";

import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { PropertyImage } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface Props {
  images: PropertyImage[];
  title: string;
}

export function PropertyGallery({ images, title }: Props) {
  const ordered = [...images].sort((a, b) => {
    if (a.isMain !== b.isMain) return a.isMain ? -1 : 1;
    return a.order - b.order;
  });

  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = ordered.length;
  const hasImages = total > 0;

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total],
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, prev, next]);

  if (!hasImages) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded border border-zinc-200 bg-zinc-100 text-zinc-400">
        <ImageIcon className="h-10 w-10" aria-hidden="true" />
      </div>
    );
  }

  const current = ordered[index];

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px]">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group relative aspect-[16/10] overflow-hidden rounded border border-zinc-200 bg-zinc-100"
          aria-label="Agrandir les photos"
        >
          {/* biome-ignore lint/performance/noImgElement: remote image host not pre-configured */}
          <img
            src={current.url}
            alt={current.alt ?? title}
            className="h-full w-full object-cover"
          />
          {total > 1 && (
            <>
              <NavButton direction="prev" onClick={prev} />
              <NavButton direction="next" onClick={next} />
              <div
                className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"
                aria-hidden="true"
              >
                {ordered.map((img, i) => (
                  <span
                    key={img.id}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full bg-white/80",
                      i === index ? "bg-white" : "bg-white/50",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </button>

        <div className="flex flex-row gap-2 overflow-x-auto md:flex-col md:gap-3 md:overflow-y-auto">
          {ordered.slice(0, 4).map((img, i) => (
            <button
              type="button"
              key={img.id}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={cn(
                "relative aspect-[4/3] shrink-0 basis-24 overflow-hidden rounded border bg-zinc-100 md:basis-auto",
                i === index ? "border-zinc-900" : "border-zinc-200",
              )}
              aria-label={`Afficher la photo ${i + 1}`}
            >
              {/* biome-ignore lint/performance/noImgElement: remote image host not pre-configured */}
              <img
                src={img.url}
                alt={img.alt ?? `${title} — ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
          {total > 4 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className="flex aspect-[4/3] shrink-0 basis-24 items-center justify-center rounded border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:border-zinc-900 md:basis-auto"
            >
              + {total - 4} photos
            </button>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galerie photos"
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
        >
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-sm">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              aria-label="Fermer la galerie"
              onClick={() => setLightboxOpen(false)}
              className="rounded p-1 hover:bg-white/10"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center p-4">
            {/* biome-ignore lint/performance/noImgElement: remote image host not pre-configured */}
            <img
              src={current.url}
              alt={current.alt ?? title}
              className="max-h-full max-w-full object-contain"
            />
            {total > 1 && (
              <>
                <NavButton direction="prev" onClick={prev} dark />
                <NavButton direction="next" onClick={next} dark />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function NavButton({
  direction,
  onClick,
  dark,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  dark?: boolean;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={direction === "prev" ? "Photo précédente" : "Photo suivante"}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 rounded-full p-2 transition",
        direction === "prev" ? "left-3" : "right-3",
        dark
          ? "bg-white/10 text-white hover:bg-white/20"
          : "bg-white/90 text-zinc-900 hover:bg-white",
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
