import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import type { PropertyImage } from "@/lib/api/types";
import { cn, PHOTO_BLUR_DATA_URL } from "@/lib/utils";

export type ImageEffect = "swap" | "zoom" | "desaturate";

interface Props {
  primary: PropertyImage | null;
  secondary: PropertyImage | null;
  alt: string;
  sizes?: string;
  /** Effet au hover :
   *  - "swap" : fade silencieux vers la 2e photo (fallback zoom si pas dispo)
   *  - "zoom" : scale léger
   *  - "desaturate" : grayscale au repos, retour à plein au hover */
  effect?: ImageEffect;
  className?: string;
}

/** Image partagée pour les 3 variantes de cartes.
 *  Le parent fournit le `aspect-*` (3:4, 4:3, 1:1).
 *  Le `group` qui déclenche le hover doit lui aussi vivre dans le parent. */
export function PropertyCardImage({
  primary,
  secondary,
  alt,
  sizes = "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw",
  effect = "swap",
  className,
}: Props) {
  if (!primary) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-section text-muted",
          className,
        )}
      >
        <ImageIcon className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }

  const canSwap = effect === "swap" && secondary != null;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <Image
        src={primary.url}
        alt={alt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={PHOTO_BLUR_DATA_URL}
        className={cn(
          "object-cover transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          // Swap : la primaire s'efface au hover (couverte par la secondaire au-dessus)
          canSwap && "group-hover:opacity-0",
          // Zoom : scale doux
          effect === "zoom" && "group-hover:scale-[1.04]",
          // Pas de swap dispo → zoom de secours pour avoir un mouvement
          effect === "swap" && !canSwap && "group-hover:scale-[1.03]",
          // Desaturate : grise au repos, plein au hover
          effect === "desaturate" &&
            "saturate-[0.7] group-hover:saturate-100 group-hover:scale-[1.02]",
        )}
      />
      {canSwap && secondary && (
        <Image
          src={secondary.url}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={PHOTO_BLUR_DATA_URL}
          className="object-cover opacity-0 transition-opacity duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
        />
      )}
    </div>
  );
}
