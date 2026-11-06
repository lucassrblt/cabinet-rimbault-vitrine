import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { type BreadcrumbItem, breadcrumbJsonLd } from "@/lib/seo/jsonld";

// Fil d'Ariane (doc 04 §4.3) : sur la fiche bien uniquement, seule page à
// deux niveaux (« Nos biens › Appartement 3 pièces »). Une ligne, le dernier
// élément tronqué si besoin. Émet aussi le JSON-LD `BreadcrumbList` à partir
// des mêmes éléments : une seule source pour l'écran et les moteurs.

type BreadcrumbProps = {
  /** Du plus haut au plus bas ; le dernier est la page courante. */
  items: readonly BreadcrumbItem[];
  /** false si la page publie déjà son propre `BreadcrumbList`. */
  jsonLd?: boolean;
};

export function Breadcrumb({ items, jsonLd = true }: BreadcrumbProps) {
  if (items.length === 0) return null;
  const last = items.length - 1;
  return (
    <Container>
      <nav aria-label="Fil d’Ariane" className="t-petit pt-6 md:pt-8">
        <ol className="flex min-w-0 items-center gap-2 text-encre-douce">
          {items.map((item, index) => (
            <li
              key={item.path}
              className={
                index === last
                  ? "min-w-0 truncate"
                  : "flex shrink-0 items-center gap-2"
              }
            >
              {index === last ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <>
                  <TextLink href={item.path} variant="discret">
                    {item.name}
                  </TextLink>
                  <span aria-hidden="true" className="text-gris">
                    ›
                  </span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {jsonLd ? <JsonLd data={breadcrumbJsonLd(items)} /> : null}
    </Container>
  );
}
