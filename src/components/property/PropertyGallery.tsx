"use client";

import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { PropertyImage } from "@/lib/api/types";
import { cn, PHOTO_BLUR_DATA_URL } from "@/lib/utils";

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
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-sm border border-subtle bg-section text-muted">
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
          className="group relative aspect-[16/10] overflow-hidden rounded-sm border border-subtle bg-section"
          aria-label="Agrandir les photos"
        >
          <Image
            src={current.url}
            alt={current.alt ?? title}
            fill
            sizes="(min-width: 768px) 720px, 100vw"
            placeholder="blur"
            blurDataURL={PHOTO_BLUR_DATA_URL}
            className="object-cover"
            priority
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
                "relative aspect-[4/3] shrink-0 basis-24 overflow-hidden rounded-sm border bg-section md:basis-auto",
                i === index ? "border-strong" : "border-subtle",
              )}
              aria-label={`Afficher la photo ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${title} — ${i + 1}`}
                fill
                sizes="(min-width: 768px) 180px, 25vw"
                placeholder="blur"
                blurDataURL={PHOTO_BLUR_DATA_URL}
                className="object-cover"
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
              className="flex aspect-[4/3] shrink-0 basis-24 items-center justify-center rounded-sm border border-subtle bg-card text-xs font-medium text-body hover:border-strong md:basis-auto"
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
              className="rounded-sm p-1 hover:bg-white/10"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center p-4">
            <div className="relative h-full w-full">
              <Image
                src={current.url}
                alt={current.alt ?? title}
                fill
                sizes="100vw"
                placeholder="blur"
                blurDataURL={PHOTO_BLUR_DATA_URL}
                className="object-contain"
              />
            </div>
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
          : "bg-white/90 text-primary hover:bg-white",
      )}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
