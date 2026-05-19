import Image from "next/image";

/**
 * Photo du hero (colonne droite) — intérieur clair, en miroir de la promesse
 * « réponse soignée, sans pression ».
 */
export function HeroImage() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-subtle bg-neutral-100 md:aspect-auto md:h-[420px]">
      <Image
        src="/hero-estimation.png"
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
