"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// `useLayoutEffect` côté client (résout `complete` avant le paint → pas de flash
// du shimmer si l'image est déjà en cache) ; `useEffect` au rendu serveur pour
// ne pas déclencher l'avertissement React.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * `next/image` avec placeholder « shimmer » : un bloc animé occupe la surface
 * tant que la photo n'est pas chargée, puis se fond en fondu pour la révéler.
 *
 * Le conteneur parent doit être positionné (`relative`) et dimensionné — le
 * shimmer se cale en `absolute inset-0`.
 */
export function ShimmerImage({ className, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Avec un `placeholder="blur"` (import statique local), `next/image` affiche
  // déjà un aperçu flou du contenu : le shimmer gris deviendrait redondant et
  // masquerait le blur natif. On le désactive dans ce cas.
  const hasBlur = props.placeholder === "blur";

  // Image déjà en cache avant l'hydratation → `onLoad` ne se déclenche pas.
  useIsomorphicLayoutEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <>
      <Image
        {...props}
        ref={ref}
        onLoad={() => setLoaded(true)}
        className={className}
      />
      {!hasBlur && (
        <span
          aria-hidden="true"
          className={cn(
            "skeleton-shimmer pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out",
            loaded ? "opacity-0" : "opacity-100",
          )}
        />
      )}
    </>
  );
}
