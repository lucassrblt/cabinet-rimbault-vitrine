"use client";

// Galerie de la fiche : la grande photo au mur, la suivante en fondu enchaîné
// au clic seulement (550 ms), vignettes avec filet sous la photo active.
// Aucun défilement automatique, rien ne suit la souris.
import Image from "next/image";
import {
  type KeyboardEvent,
  type SyntheticEvent,
  useEffect,
  useState,
} from "react";
import type { PropertyImageView } from "@/lib/property/view";
import s from "./base.module.css";
import f from "./fiche.module.css";

export function Galerie({ images }: { images: readonly PropertyImageView[] }) {
  const n = images.length;
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [ready, setReady] = useState(true);
  // Largeur maximale d'affichage : la plus petite largeur native vue, pour
  // qu'aucune photo ne soit agrandie au-delà de sa résolution.
  const [cap, setCap] = useState<number | null>(null);

  const onLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const frame = img.parentElement;
    if (frame && img.naturalWidth > 0) {
      const w = frame.getBoundingClientRect().width;
      if (img.naturalWidth < w - 1) {
        setCap((c) =>
          Math.min(c ?? Number.POSITIVE_INFINITY, img.naturalWidth),
        );
      }
    }
    setReady(true);
  };

  // Une fois la nouvelle photo affichée, l'ancienne est retirée.
  useEffect(() => {
    if (!ready || prev === null) return;
    const t = window.setTimeout(() => setPrev(null), 600);
    return () => window.clearTimeout(t);
  }, [ready, prev]);

  if (n === 0) {
    return <div className={`${s.ph} ${f.main}`} />;
  }

  const go = (i: number) => {
    const k = (i + n) % n;
    if (k === cur) return;
    setPrev(cur);
    setCur(k);
    setReady(false);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(cur + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(cur - 1);
    }
  };

  const image = images[cur];
  const under = prev !== null ? images[prev] : null;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: flèches du clavier pour les boutons de la galerie
    <div
      className={f.gal}
      onKeyDown={onKey}
      style={cap ? { maxWidth: cap } : undefined}
    >
      <figure className={`${s.ph} ${s.fade} ${f.main}`}>
        {under ? (
          <Image
            key={`u-${prev}`}
            src={under.url}
            alt=""
            fill
            sizes="(min-width: 900px) 62vw, 100vw"
          />
        ) : null}
        <Image
          key={`c-${cur}`}
          className={`${f.cur} ${ready ? f.show : ""}`}
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 900px) 62vw, 100vw"
          loading={cur === 0 ? "eager" : undefined}
          fetchPriority={cur === 0 ? "high" : undefined}
          onLoad={onLoad}
        />
        {n > 1 ? (
          <button
            type="button"
            className={f.next}
            onClick={() => go(cur + 1)}
            aria-label={`Photo suivante, ${((cur + 1) % n) + 1} sur ${n}`}
          />
        ) : null}
      </figure>

      {n > 1 ? (
        <div className={`${f.thumbs} ${s.up}`} style={{ "--i": 3 } as never}>
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              aria-current={i === cur}
              aria-label={`Photo ${i + 1} sur ${n}`}
              onClick={() => go(i)}
            >
              <span className={s.ph}>
                <Image src={img.url} alt="" fill sizes="64px" loading="eager" />
              </span>
            </button>
          ))}
          <span className={`${f.count} ${s.num}`} aria-live="polite">
            {cur + 1} / {n}
          </span>
        </div>
      ) : null}

      {n > 1 ? (
        <div className={`${f.mMeta} ${s.num}`}>
          <span>Touchez la photo pour la suivante</span>
          <span className={f.dots} aria-hidden>
            {images.map((img, i) => (
              <i key={img.url} data-on={i === cur || undefined} />
            ))}
          </span>
        </div>
      ) : null}
    </div>
  );
}
