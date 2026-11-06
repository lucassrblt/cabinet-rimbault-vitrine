"use client";

// Photo au mur, en vraie couleur. Deux règles :
// - jamais agrandie au-delà de sa résolution : l'optimiseur de next/image
//   n'agrandit pas (`withoutEnlargement`), donc la largeur naturelle du fichier
//   reçu est la largeur maximale d'affichage ; le cadre est plafonné à cette
//   largeur (en px CSS), son ratio est conservé ;
// - le cadre garde le ton du mur pendant le chargement, la photo arrive en
//   fondu (une fois).
import Image from "next/image";
import { type SyntheticEvent, useState } from "react";
import s from "./base.module.css";

export function PhotoMur({
  src,
  alt,
  sizes,
  className,
  eager = false,
}: {
  src: string | undefined;
  alt: string;
  sizes: string;
  className?: string;
  eager?: boolean;
}) {
  const [cap, setCap] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const onLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const frame = img.parentElement;
    if (frame && img.naturalWidth > 0) {
      // Plafond seulement si le fichier est plus étroit que le cadre.
      const width = frame.getBoundingClientRect().width;
      if (img.naturalWidth < width - 1) setCap(img.naturalWidth);
    }
    setLoaded(true);
  };

  return (
    <div
      className={`${s.ph} ${s.fade} ${s.attente} ${className ?? ""}`}
      style={cap ? { maxWidth: cap } : undefined}
      data-loaded={loaded || undefined}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          onLoad={onLoad}
        />
      ) : null}
    </div>
  );
}
