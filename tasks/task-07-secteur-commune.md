# TASK-07 — Pages `/secteur/[commune]` (Phase 2)

**Priorité : ⚪ Phase 2**
**Phase : 2**
**Statut : ⏳ Dépriorisé — voir décision du 2026-04-21**

---

## Contexte

Ces pages sont la **pierre angulaire du SEO local** pour un agent de quartier.
Une URL propre par commune avec contenu éditorial + listings filtrés.

**Décision du 2026-04-21** : reportées de Phase 1.5 à Phase 2 pour éviter le thin content.
Le dropdown "Secteurs" du header renvoie vers `/acheter?commune=X` en attendant.

## Prérequis avant implémentation

1. **Contenu éditorial** : chaque page commune nécessite ~200-300 mots de contenu unique
   (marché local, quartiers, transports, prix moyens). Sans ça → thin content → pénalité SEO.
2. **Volume de biens** : idéalement ≥ 5 biens actifs par commune pour que la page soit utile.
3. **Liste définitive des communes** → TASK-01 (confirmer avec l'agent).

## Architecture

```
src/app/secteur/[commune]/page.tsx
```

```ts
// generateStaticParams : une route par commune dans COMMUNES
export async function generateStaticParams() {
  return COMMUNES.map((c) => ({ commune: c.slug }));
}

// Page : Server Component
export default async function SecteurPage({ params }) {
  const { commune } = await params;
  const communeData = COMMUNES.find((c) => c.slug === commune);
  if (!communeData) notFound();

  const res = await searchProperties({
    city: communeData.name,
    limit: 9,
    sortBy: "date",
  });

  return (
    <main>
      <HeroSecteur commune={communeData} />
      <ListingsSection properties={res.data} />
      <ContentEditorialSecteur commune={communeData} />
      <CtaSecteur commune={communeData} />
    </main>
  );
}
```

## Métadonnées SEO

```ts
export async function generateMetadata({ params }) {
  return {
    title: `Immobilier à ${commune.name} — Vente et location`,
    description: `Appartements et maisons à vendre ou à louer à ${commune.name}. Cabinet Rimbault, votre agent immobilier de quartier.`,
  };
}
```

## Contenu éditorial par commune

Créer `src/lib/config/secteurs.ts` avec :

```ts
export interface SecteurContent {
  slug: string;
  headline: string;
  paragraphs: string[];
  highlights: { label: string; value: string }[];
}
```

## Mise à jour navigation

Quand les pages secteur sont livrées :
- Header dropdown "Secteurs" → liens vers `/secteur/[commune]` (au lieu de `/acheter?commune=X`)
- Footer colonne "L'agence" → liste des liens commune
- `sitemap.ts` → ajouter les routes `/secteur/[commune]`
- JSON-LD `RealEstateAgent.areaServed` → déjà préparé (TASK-03)

## Estimation de charge

~1 jour de dev + 1 à 2 jours de rédaction (contenu éditorial par commune).
À planifier quand TASK-01 est terminé et les vraies communes confirmées.
