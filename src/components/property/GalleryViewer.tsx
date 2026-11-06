"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import {
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useMarquerHydratation } from "@/components/motion/hydration";
import { mouvementAutorise } from "@/components/motion/reducedMotion";
import { DUREES, EASE_SOBRE } from "@/components/motion/tokens";
import type { PropertyImageView } from "@/lib/property/view";

// Visionneuse plein écran (doc 04 §2.3-1, brief §7, doc 06 §7).
// - <dialog> modal sur fond encre, `mv-panneau` : fondu d'ouverture et de
//   fermeture de 180 ms. Échap est natif ; à la fermeture, le focus revient
//   au déclencheur (comportement natif de showModal, vérifié par Iniesta).
// - Photos au ratio natif (`contain`) dans une piste à défilement aimanté :
//   au toucher, la photo suit le doigt (scroll-snap natif).
// - Clavier (flèches) et boutons : la photo d'arrivée est posée d'un coup
//   sous la photo de départ, qui s'efface en 180 ms (fondu enchaîné, sans
//   déplacement). Sous `reduce` : changement immédiat.
// - Compteur « 3 / 12 » annoncé poliment.

export type GalleryViewerHandle = { open: (index: number) => void };

type GalleryViewerProps = {
  images: readonly PropertyImageView[];
  ref?: Ref<GalleryViewerHandle>;
};

export function GalleryViewer({ images, ref }: GalleryViewerProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  /** Les photos ne sont rendues (donc téléchargées) qu'à la première ouverture. */
  const [opened, setOpened] = useState(false);
  /** Position à atteindre sans animation de défilement (ouverture, clavier). */
  const jumpTo = useRef<number | null>(null);
  const total = images.length;
  useMarquerHydratation();

  const scrollToIndex = useCallback((target: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: target * el.clientWidth, behavior: "instant" });
  }, []);

  useImperativeHandle(ref, () => ({
    open(start: number) {
      const el = dialog.current;
      if (!el || el.open) return;
      jumpTo.current = start;
      setOpened(true);
      setIndex(start);
      setOutgoing(null);
      document.documentElement.style.setProperty("overflow", "hidden");
      el.showModal();
      scrollToIndex(start);
    },
  }));

  // Saut instantané vers la photo demandée, avant la peinture.
  useLayoutEffect(() => {
    if (jumpTo.current === null) return;
    scrollToIndex(jumpTo.current);
    jumpTo.current = null;
  });

  // Fondu de la photo de départ, posée par-dessus la piste.
  useLayoutEffect(() => {
    const el = overlay.current;
    if (outgoing === null || !el) return;
    const animation = el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: DUREES.fonduPhoto,
      easing: EASE_SOBRE,
      fill: "forwards",
    });
    animation.finished.then(
      () => setOutgoing(null),
      () => {},
    );
    return () => animation.cancel();
  }, [outgoing]);

  const go = useCallback(
    (step: number) => {
      if (total < 2) return;
      const next = (index + step + total) % total;
      if (mouvementAutorise()) setOutgoing(index);
      jumpTo.current = next;
      setIndex(next);
    },
    [index, total],
  );

  // Défilement au doigt : l'index suit la photo aimantée.
  const onScroll = () => {
    const el = track.current;
    if (!el || jumpTo.current !== null || el.clientWidth === 0) return;
    const current = Math.round(el.scrollLeft / el.clientWidth);
    if (current !== index && current >= 0 && current < total) {
      setOutgoing(null);
      setIndex(current);
    }
  };

  // Redimensionnement (rotation d'un téléphone) : on garde la même photo.
  useEffect(() => {
    const onResize = () => {
      if (dialog.current?.open) scrollToIndex(index);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index, scrollToIndex]);

  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      aria-label="Photos du bien"
      className="mv-panneau fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-encre p-0 text-creme"
      onClose={() => {
        const root = document.documentElement;
        root.style.removeProperty("overflow");
        if (!root.getAttribute("style")) root.removeAttribute("style");
        setOutgoing(null);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(-1);
        }
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 shrink-0 items-center justify-between px-5 md:px-8">
          <p className="t-ui chiffres" aria-live="polite" aria-atomic="true">
            <span className="sr-only">Photo </span>
            {index + 1}
            <span aria-hidden="true"> / </span>
            <span className="sr-only"> sur </span>
            {total}
          </p>
          <button
            type="button"
            onClick={close}
            className="t-ui -mr-3 inline-flex h-12 items-center gap-2 px-3 font-medium"
          >
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
            Fermer
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          <div
            ref={track}
            onScroll={onScroll}
            className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {(opened ? images : []).map((image, i) => (
              <div
                key={image.url}
                className="relative h-full w-full shrink-0 snap-center"
                aria-hidden={i === index ? undefined : true}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="100vw"
                  loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
          {outgoing !== null && images[outgoing] ? (
            <div
              ref={overlay}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-encre"
            >
              <Image
                src={images[outgoing].url}
                alt=""
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          ) : null}
        </div>

        <div className="flex h-20 shrink-0 items-center justify-center gap-2 md:gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={total < 2}
            className="t-ui inline-flex h-12 items-center gap-2 px-4 disabled:opacity-40"
          >
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
            Photo précédente
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={total < 2}
            className="t-ui inline-flex h-12 items-center gap-2 px-4 disabled:opacity-40"
          >
            Photo suivante
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </dialog>
  );
}
