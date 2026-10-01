"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { PropertyImage } from "@/lib/api/types";

type Props = { images: PropertyImage[]; title: string; status?: string | null };

/**
 * Mobile : défilement au doigt plein largeur, avec compteur.
 * Desktop : une grande photo et deux petites.
 * Partout : un tap ouvre toutes les photos en grand.
 */
export function Gallery({ images, title, status }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  const open = () => dialog.current?.showModal();
  const alt = (i: number) => images[i].alt ?? `${title}, photo ${i + 1}`;

  return (
    <>
      <div className="md:hidden">
        <div
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
          onScroll={(e) => {
            const el = e.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={open}
              className="relative aspect-[4/3] w-full shrink-0 snap-start bg-pierre"
            >
              <Image
                src={img.url}
                alt={alt(i)}
                fill
                preload={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <p className="conteneur mt-2 text-mention text-gris" aria-live="polite">
          {index + 1} / {images.length}
        </p>
      </div>

      <div className="hidden gap-3 md:grid md:h-[min(34rem,65vh)] md:grid-cols-3 md:grid-rows-2">
        {images.slice(0, 3).map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={open}
            className={`group relative overflow-hidden rounded-photo bg-pierre ${i === 0 ? "col-span-2 row-span-2" : ""} ${images.length < 3 && i === 1 ? "row-span-2" : ""}`}
          >
            <Image
              src={img.url}
              alt={alt(i)}
              fill
              preload={i === 0}
              sizes={i === 0 ? "60vw" : "30vw"}
              className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
            />
            {i === 0 && status && (
              <span className="absolute top-3 left-3 rounded-controle bg-blanc px-2.5 py-1 text-mention">
                {status}
              </span>
            )}
            {i === 2 && (
              <span className="absolute right-3 bottom-3 rounded-controle bg-blanc px-3 py-1.5 text-mention">
                Voir les {images.length} photos
              </span>
            )}
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="galerie m-0 h-full max-h-none w-full max-w-none bg-blanc p-0 backdrop:bg-encre/60"
        aria-label={`Photos : ${title}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-filet bg-blanc px-4 py-3 md:px-10">
          <p className="titre text-intertitre">{title}</p>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="bouton bouton-secondaire min-h-10 px-3"
            aria-label="Fermer"
          >
            <X size={18} aria-hidden />
          </button>
        </div>
        <ul className="mx-auto max-w-5xl space-y-3 p-3 md:p-10">
          {images.map((img, i) => (
            <li key={img.id}>
              <Image
                src={img.url}
                alt={alt(i)}
                width={2000}
                height={1500}
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="h-auto w-full rounded-photo"
              />
            </li>
          ))}
        </ul>
      </dialog>
    </>
  );
}
