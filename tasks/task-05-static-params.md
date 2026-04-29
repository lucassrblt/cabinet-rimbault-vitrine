# TASK-05 — generateStaticParams sur `/bien/[reference]`

**Priorité : 🟢 Nice-to-have**
**Phase : 1.5 SEO**
**Statut : ⏳ À faire (optionnel)**

---

## Contexte

Actuellement, `/bien/[reference]` est rendu en ISR (`dynamic = "auto"`, `revalidate: 60`).
Le premier visiteur d'un bien déclenche le rendu serveur ; les suivants reçoivent la page
en cache. C'est correct pour le MVP.

`generateStaticParams` pré-génère les pages au build depuis l'API, ce qui améliore le TTFB
pour les robots d'indexation qui visitent la page pour la première fois.

## Implémentation

Dans `src/app/bien/[reference]/page.tsx`, ajouter :

```ts
export async function generateStaticParams(): Promise<{ reference: string }[]> {
  try {
    const res = await searchProperties({ limit: 100, offset: 0 });
    const data = res.data ?? [];
    return data.map((p) => ({ reference: p.reference }));
  } catch {
    return [];
  }
}
```

Si `total > 100`, paginer :

```ts
export async function generateStaticParams() {
  const PER_PAGE = 100;
  const all: { reference: string }[] = [];
  for (let offset = 0; ; offset += PER_PAGE) {
    const res = await searchProperties({ limit: PER_PAGE, offset }).catch(() => null);
    if (!res) break;
    all.push(...res.data.map((p) => ({ reference: p.reference })));
    if (all.length >= (res.total ?? 0) || res.data.length === 0) break;
  }
  return all;
}
```

## Arbitrage

- **Pour** : indexation immédiate par Googlebot, meilleur TTFB sur toutes les fiches.
- **Contre** : augmente le temps de build proportionnellement au nombre de biens.
  Pour un agent solo (< 50 biens actifs), le coût est négligeable.
- **Verdict** : à implémenter dès que le déploiement (TASK-02) est opérationnel.

## Compatibilité

ISR et `generateStaticParams` sont compatibles : les pages pré-générées se revalident
quand même via `revalidate: 60`. Les nouvelles références non générées au build
sont rendues à la demande (fallback dynamique par défaut en Next.js 16).
