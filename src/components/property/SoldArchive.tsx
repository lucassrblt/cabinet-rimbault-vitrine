import Image from "next/image";
import { ImageFade } from "@/components/motion/ImageFade";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { glueHyphens } from "@/lib/property/text";
import type { PropertyView } from "@/lib/property/view";

// Archive « Récemment vendus et loués » (brief A14 et A22, doc 04 §2.2).
// Section conditionnelle : ne rend rien si la liste est vide. Photo sans
// aucun traitement (ni filtre, ni voile, ni désaturation) ; la différence
// avec les biens disponibles vient de la taille (4 par rangée à partir de
// 1024 px, 2 en dessous) et du badge « Vendu » ou « Loué », sans année.
// Sans prix, non cliquable (la fiche d'un bien vendu n'existe plus).
// Interface figée (doc 04 §7) : `items`, `limit` ; `title` facultatif.

type SoldArchiveProps = {
  items: readonly PropertyView[];
  limit?: number;
  title?: string;
  id?: string;
};

const SIZES = "(min-width: 1280px) 282px, (min-width: 1024px) 25vw, 50vw";

export function SoldArchive({
  items,
  limit = 12,
  title = "Récemment vendus et loués",
  id = "archive",
}: SoldArchiveProps) {
  const shown = items.slice(0, Math.max(0, limit));
  if (shown.length === 0) return null;
  const headingId = `${id}-titre`;

  return (
    <Section separation="filet" id={id} aria-labelledby={headingId}>
      <Heading level={2} id={headingId}>
        {title}
      </Heading>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-12 md:gap-x-6 lg:grid-cols-4">
        {shown.map((view) => {
          const photo = view.images[0];
          return (
            <li key={view.reference} className="min-w-0">
              {photo ? (
                <ImageFade className="relative aspect-[4/3] overflow-hidden bg-creme-soutenu">
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    sizes={SIZES}
                    className="object-cover"
                  />
                </ImageFade>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-creme-soutenu">
                  <p className="t-petit text-gris">Photos à venir</p>
                </div>
              )}
              {view.statusLabel ? (
                <Tag variant="archive" className="mt-3">
                  {view.statusLabel}
                </Tag>
              ) : null}
              <p className="t-petit mt-2 text-encre">
                {view.city
                  ? `${view.head}, ${glueHyphens(view.city)}`
                  : view.head}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
