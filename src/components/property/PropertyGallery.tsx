"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageFade } from "@/components/motion/ImageFade";
import type { PropertyImageView } from "@/lib/property/view";
import { cn } from "@/lib/utils";
import { GalleryViewer, type GalleryViewerHandle } from "./GalleryViewer";

// Galerie de la fiche (doc 04 §2.3-1, brief §3.5, A30).
// - Desktop (≥ 1024 px) : photo principale en 3:2, puis jusqu'à 4 vignettes
//   en 4:3 et « Voir les 12 photos ». Chaque photo ouvre la visionneuse.
// - Mobile : toutes les photos en 4:3 dans une piste à défilement aimanté
//   (la photo suit le doigt), compteur « 1 / 4 » sous la piste, pas de
//   vignettes. Aucun texte posé sur une photo.
// Une seule liste d'images : sur desktop, les photos 2 et suivantes de la
// piste sont masquées (et, chargées en différé, jamais téléchargées).
// La photo principale est préchargée, sans fondu (LCP, doc 06 §2).

type PropertyGalleryProps = {
  images: readonly PropertyImageView[];
};

/** Photo principale : 8 colonnes en desktop, pleine largeur du contenu en mobile. */
const MAIN_SIZES =
  "(min-width: 1280px) 792px, (min-width: 1024px) 66vw, calc(100vw - 40px)";
const THUMB_SIZES = "(min-width: 1280px) 180px, 15vw";

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const viewer = useRef<GalleryViewerHandle>(null);
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const total = images.length;

  if (total === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-creme-soutenu lg:aspect-[3/2]">
        <p className="t-petit text-gris">Photos à venir</p>
      </div>
    );
  }

  const open = (index: number) => viewer.current?.open(index);
  const thumbs = images.slice(1, 5);

  const onScroll = () => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const step = first.offsetWidth + 8;
    const index = Math.min(total - 1, Math.round(el.scrollLeft / step));
    if (index !== current) setCurrent(index);
  };

  return (
    <div>
      <div
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <button
            key={image.url}
            type="button"
            onClick={() => open(index)}
            aria-label={`Agrandir la photo ${index + 1} sur ${total}`}
            className={cn(
              "relative block aspect-[4/3] w-full shrink-0 snap-start overflow-hidden bg-creme-soutenu lg:aspect-[3/2]",
              index > 0 && "lg:hidden",
            )}
          >
            {index === 0 ? (
              <Image
                src={image.url}
                alt={image.alt}
                fill
                preload
                sizes={MAIN_SIZES}
                className="object-cover"
              />
            ) : (
              <ImageFade className="absolute inset-0">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes={MAIN_SIZES}
                  className="object-cover"
                />
              </ImageFade>
            )}
          </button>
        ))}
      </div>

      {total > 1 ? (
        <div className="mt-3 flex items-center justify-between lg:hidden">
          <p className="t-petit chiffres text-encre-douce" aria-hidden="true">
            {current + 1} / {total}
          </p>
          <button
            type="button"
            onClick={() => open(current)}
            className="ui-btn ui-btn--tertiaire t-petit"
          >
            Voir les {total}
            {"\u00a0"}photos en grand
          </button>
        </div>
      ) : null}

      {thumbs.length ? (
        <div className="mt-6 hidden lg:block">
          <ul className="grid grid-cols-4 gap-6">
            {thumbs.map((image, i) => (
              <li key={image.url}>
                <button
                  type="button"
                  onClick={() => open(i + 1)}
                  aria-label={`Agrandir la photo ${i + 2} sur ${total}`}
                  className="block w-full"
                >
                  <ImageFade className="relative aspect-[4/3] overflow-hidden bg-creme-soutenu">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      sizes={THUMB_SIZES}
                      className="object-cover"
                    />
                  </ImageFade>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => open(0)}
            className="ui-btn ui-btn--tertiaire mt-2"
          >
            Voir les {total}
            {"\u00a0"}photos
          </button>
        </div>
      ) : null}

      <GalleryViewer ref={viewer} images={images} />
    </div>
  );
}
