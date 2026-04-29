# TASK-03 — JSON-LD structured data (Phase 1.5 SEO)

**Priorité : 🟡 Important**
**Phase : 1.5**
**Statut : ⏳ À faire**
**Dépendances : TASK-01 (vraies infos agent)**

---

## Pourquoi

Chaque fiche bien est une landing page SEO. JSON-LD permet aux moteurs de recherche
d'afficher des résultats enrichis (prix, surface, photos). C'est la priorité SEO la plus
impactante après les métadonnées dynamiques (déjà en place).

## À implémenter

### 1. `RealEstateListing` — `/bien/[reference]`

Dans `src/app/bien/[reference]/page.tsx`, ajouter un `<script type="application/ld+json">` :

```tsx
function JsonLd({ property }: { property: Property }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.shortDescription ?? property.description.slice(0, 300),
    url: `${SITE_URL}/bien/${property.reference}`,
    image: property.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      price: property.finance?.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    floorSize: property.characteristics?.surface
      ? { "@type": "QuantitativeValue", value: property.characteristics.surface, unitCode: "MTK" }
      : undefined,
    numberOfRooms: property.characteristics?.rooms,
    address: property.location
      ? {
          "@type": "PostalAddress",
          addressLocality: property.location.city,
          postalCode: property.location.postalCode,
          addressCountry: "FR",
        }
      : undefined,
    datePosted: property.publishedAt ?? property.createdAt,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Injecter dans `<head>` via la prop `metadata` ou directement dans le JSX de la page
(avec `<head>` exporté ou via `generateMetadata`).

**Recommandation** : passer par `metadata` de Next.js qui injecte proprement dans `<head>`.
Sinon, placer le composant `<JsonLd />` en tête du JSX retourné par la page (Next.js le
remonte automatiquement dans `<head>` via React).

### 2. `RealEstateAgent` + `Place` — home `/` et `/a-propos`

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Cabinet Rimbault",
  "url": "https://cabinet-rimbault.fr",
  "telephone": "+33612345678",
  "email": "contact@cabinet-rimbault.fr",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "14 rue du Marché",
    "postalCode": "92100",
    "addressLocality": "Boulogne-Billancourt",
    "addressCountry": "FR"
  },
  "areaServed": ["Boulogne-Billancourt", "Issy-les-Moulineaux", "Meudon", "..."],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "47"
  }
}
```

Les valeurs doivent venir de `AGENT` (après TASK-01).

### 3. `FAQPage` — `/vendre`

La page `/vendre` a déjà `SELLING_FAQ` dans `src/lib/config/agent.ts`.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quel est le bon moment pour vendre ?",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

## Fichiers à modifier

- `src/app/bien/[reference]/page.tsx` — ajouter `RealEstateListing`
- `src/app/page.tsx` — ajouter `RealEstateAgent`
- `src/app/a-propos/page.tsx` — ajouter `RealEstateAgent`
- `src/app/vendre/page.tsx` — ajouter `FAQPage`

## Validation

Tester avec [Google Rich Results Test](https://search.google.com/test/rich-results)
et [Schema.org Validator](https://validator.schema.org/).
