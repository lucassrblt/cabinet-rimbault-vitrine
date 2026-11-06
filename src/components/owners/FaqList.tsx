import { JsonLd } from "@/components/seo/JsonLd";
import { Disclosure } from "@/components/ui/Disclosure";
import { TextLink } from "@/components/ui/TextLink";
import type { FaqEntry } from "@/content/faq-types";
import { faqPageJsonLd } from "@/lib/seo/jsonld";
import { fr, frNode } from "./typo";

// Questions fréquentes (doc 04 §2.5 et §2.6) : details/summary natifs
// (`Disclosure`), questions en h3 sous le h2 de la section, et le JSON-LD
// `FAQPage` construit à partir des mêmes textes (aucune divergence possible).
// À l'écran, « 1er » a son exposant (`frNode`) ; le JSON-LD garde « 1er ».

/** Texte du JSON-LD : typographie française, sans les gluons invisibles. */
function plain(text: string): string {
  return fr(text).replace(/\u2060/g, "");
}

export function FaqList({ items }: { items: readonly FaqEntry[] }) {
  if (items.length === 0) return null;
  const jsonLd = faqPageJsonLd(
    items.map((item) => ({
      question: plain(item.question),
      answer: plain(item.answer.join(" ")),
    })),
  );
  return (
    <>
      <div className="border-filet border-t">
        {items.map((item) => (
          <Disclosure key={item.question} summary={fr(item.question)} level={3}>
            <div className="ui-prose">
              {item.answer.map((paragraph) => (
                <p key={paragraph}>{frNode(paragraph)}</p>
              ))}
              {item.link ? (
                <p>
                  <TextLink href={item.link.href}>
                    {frNode(item.link.label)}
                  </TextLink>
                </p>
              ) : null}
            </div>
          </Disclosure>
        ))}
      </div>
      <JsonLd data={jsonLd} />
    </>
  );
}
