import { ParallaxImage } from "@/components/ui/ParallaxImage";

/**
 * Photo du hero (colonne droite) — intérieur clair, en miroir de la promesse
 * « réponse soignée, sans pression ». Parallaxe au scroll ; l'entrée est gérée
 * par le balayage `RevealMask` du parent, d'où `settle={false}`.
 */
export function HeroImage() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-subtle bg-neutral-100 md:aspect-auto md:h-[420px]">
      <ParallaxImage
        src="/hero-estimation.png"
        alt=""
        settle={false}
        sizes="(min-width: 768px) 50vw, 100vw"
      />
    </div>
  );
}
