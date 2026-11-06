import Image from "next/image";
import Link from "next/link";
import { ImageFade } from "@/components/motion/ImageFade";
import { Tag } from "@/components/ui/Tag";
import { glueHyphens } from "@/lib/property/text";
import { type PropertyView, referenceLabel } from "@/lib/property/view";
import { cn } from "@/lib/utils";

// Carte de bien (doc 03 §6.5, doc 04 §2.2) : ni bordure, ni fond, ni ombre.
// Toute la carte est un seul lien (un seul arrêt de tabulation), titre en
// `h2`/`h3`. Photo 4:3 sans aucun traitement ; aucun texte posé sur la photo
// (doc 03 §9-13) : les badges suivent le lieu. Mouvement : `mv-carte*`
// (doc 06 §5).

export type CardLayout = "vertical" | "horizontal";

type PropertyCardProps = {
  view: PropertyView;
  headingLevel: 2 | 3 | 4;
  /** `horizontal` : bien seul dans sa liste (photo 7 colonnes, texte 5). */
  layout?: CardLayout;
  /** `sizes` de la photo, selon la grille. */
  sizes: string;
  /** Première rangée d'une liste en haut de page : chargement immédiat (LCP). */
  eager?: boolean;
  /**
   * Badge « En vente » / « À louer » (doc 03 §6.4) : seulement dans une liste
   * qui mêle vente et location. Il passe avant les autres badges ; deux au plus.
   */
  transactionBadge?: boolean;
};

export function PropertyCard({
  view,
  headingLevel,
  layout = "vertical",
  sizes,
  eager = false,
  transactionBadge = false,
}: PropertyCardProps) {
  const Heading = `h${headingLevel}` as const;
  const photo = view.images[0];
  const horizontal = layout === "horizontal";
  const badges = [
    transactionBadge ? (
      view.transaction === "LOCATION" ? (
        <Tag key="transaction" variant="location">
          À louer
        </Tag>
      ) : (
        <Tag key="transaction" variant="vente">
          En vente
        </Tag>
      )
    ) : null,
    view.statusLabel ? (
      <Tag key="statut" variant="offre">
        {view.statusLabel}
      </Tag>
    ) : null,
    view.isExclusive ? (
      <Tag key="exclusivite" variant="exclusivite">
        Exclusivité
      </Tag>
    ) : null,
  ]
    .filter(Boolean)
    .slice(0, 2);

  return (
    <Link
      href={view.href}
      className={cn(
        "mv-carte flex h-full flex-col",
        horizontal && "md:grid md:grid-cols-12 md:gap-x-6",
      )}
    >
      <div className={cn(horizontal && "md:col-span-7")}>
        {photo ? (
          <ImageFade className="relative aspect-[4/3] overflow-hidden bg-creme-soutenu">
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              sizes={sizes}
              loading={eager ? "eager" : undefined}
              className="mv-carte-photo object-cover"
            />
          </ImageFade>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-creme-soutenu">
            <p className="t-petit text-gris">Photos à venir</p>
          </div>
        )}
      </div>
      <div
        className={cn(
          "mt-4 flex flex-1 flex-col",
          horizontal && "md:col-span-5 md:mt-0",
        )}
      >
        <Heading
          className={cn(
            "mv-carte-titre t-titre-carte text-encre",
            horizontal && "md:t-etape",
          )}
        >
          {view.title}
        </Heading>
        {view.place ? (
          <p className="t-petit mt-1 text-encre-douce">
            {glueHyphens(view.place)}
          </p>
        ) : null}
        {badges.length ? (
          <div className="mt-3 flex flex-wrap gap-2">{badges}</div>
        ) : null}
        {/* Filet et prix alignés d'une carte à l'autre dans une rangée :
            l'espace de 16 px au moins s'allonge dans les cartes plus courtes. */}
        <div className={cn("min-h-4 flex-1", horizontal && "md:flex-none")} />
        <div className="flex items-baseline justify-between gap-4 border-t border-filet pt-3">
          {view.priceLabel ? (
            <p className="t-prix-carte min-w-0 text-encre">{view.priceLabel}</p>
          ) : (
            <span />
          )}
          <p className="t-legal chiffres shrink-0 text-gris">
            {referenceLabel(view.reference)}
          </p>
        </div>
      </div>
    </Link>
  );
}
