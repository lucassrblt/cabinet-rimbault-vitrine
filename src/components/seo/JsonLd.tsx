import type { JsonLdObject } from "@/lib/seo/jsonld";

/**
 * Injecte un bloc JSON-LD côté serveur. `<` est échappé pour qu'aucune donnée
 * saisie (titre, description) ne puisse fermer la balise script.
 */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON sérialisé et échappé, aucun HTML
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
