# Templates de section — Design System Éditorial

Templates réutilisables pour construire des pages cohérentes sur l'ensemble du site.
Tous utilisent les tokens CSS de `globals.css` (Fraunces serif, Manrope sans, palette primary/neutral).

---

## 1. Section Light (fond crème)

**Usage** : contenu narratif, formulaires, listes de features.

```tsx
<section className="bg-neutral-100">
  <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
    <ScrollReveal>
      {/* Eyebrow */}
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
        Eyebrow ici
      </p>
      {/* Titre */}
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-primary md:text-4xl">
        Titre de section
      </h2>
      {/* Rule décoratif */}
      <div className="mt-4 h-px w-12 bg-primary-600" />
    </ScrollReveal>

    {/* Contenu avec mt-14 */}
    <div className="mt-14">
      ...
    </div>
  </div>
</section>
```

**Variantes de fond** : `bg-neutral-100` (crème chaud) ou `bg-card` (blanc pur).

---

## 2. Section Dark (fond sombre)

**Usage** : section d'impact (chiffres, CTA), rupture visuelle.

```tsx
<section className="bg-neutral-900">
  <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
    <ScrollReveal>
      <div className="text-center">
        {/* Eyebrow — primaire clair sur fond sombre */}
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
          Eyebrow ici
        </p>
        {/* Titre blanc */}
        <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Titre de section
        </h2>
        {/* Rule centré */}
        <div className="mx-auto mt-4 h-px w-12 bg-primary-600" />
      </div>
    </ScrollReveal>

    <div className="mt-16">
      {/* Texte en text-neutral-400, valeurs en text-white */}
      {/* Bordures en border-neutral-700 */}
    </div>
  </div>
</section>
```

---

## 3. Section White (fond blanc)

**Usage** : tableaux, données structurées, honoraires.

```tsx
<section className="bg-card">
  <div className="mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
    <ScrollReveal>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
        Eyebrow
      </p>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-primary md:text-4xl">
        Titre
      </h2>
      {/* Sous-titre optionnel */}
      <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-body">
        Description contextuelle.
      </p>
      <div className="mt-4 h-px w-12 bg-primary-600" />
    </ScrollReveal>

    <div className="mt-14">
      ...
    </div>
  </div>
</section>
```

---

## 4. Hero Image

**Usage** : page agence, possiblement page vendre.

```tsx
<section className="relative overflow-hidden bg-neutral-900">
  <Image src="/hero-xxx.jpg" alt="..." fill priority className="object-cover" sizes="100vw" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15" />
  {/* Client component pour les animations staggerées */}
  <AgenceHeroContent agencyName="..." tagline="..." subtitle="..." />
</section>
```

Le composant hero utilise `min-h-[50vh] md:min-h-[65vh]` avec texte positionné en bas.

---

## Composants d'animation

### `ScrollReveal` — révélation de blocs

```tsx
<ScrollReveal delay={0.1} direction="up">
  {/* Bloc entier : titre, carte, tableau */}
</ScrollReveal>
```

- `direction` : `"up"` (défaut), `"left"`, `"right"`
- `delay` : en secondes, stagger avec `i * 0.1` ou `i * 0.15`
- Durée : 0.7s, easing `[0.22, 1, 0.36, 1]`

### `TextReveal` — révélation de texte (plus subtil)

```tsx
<TextReveal delay={i * 0.08}>
  <p>Paragraphe individuel</p>
</TextReveal>
```

- Translate 15px (vs 30px pour ScrollReveal)
- Durée 0.5s (vs 0.7s)
- Idéal pour paragraphes, labels, items de liste

---

## Pattern titre de section (récapitulatif)

```
Eyebrow  →  text-xs font-semibold uppercase tracking-[0.2em] text-primary-600
Titre    →  mt-3 font-serif text-3xl md:text-4xl font-semibold tracking-tight text-primary
Sous-titre → mt-4 max-w-lg text-[15px] leading-relaxed text-body  (optionnel)
Rule     →  mt-4 h-px w-12 bg-primary-600
Contenu  →  mt-14
```

Sur fond sombre : eyebrow `text-primary-400`, titre `text-white`, sous-titre `text-neutral-400`.

---

## Alternance de fonds recommandée

Pour un bon rythme visuel, alterner les types de section :

```
Hero (image/dark)
  ↓
Light (bg-neutral-100)
  ↓
Dark (bg-neutral-900)
  ↓
White (bg-card)
  ↓
Light (bg-neutral-100)
  ↓
Dark (bg-neutral-900)  ← CTA final
```

Éviter deux sections consécutives avec le même fond.

---

## Spacing

| Élément | Mobile | Desktop |
|---|---|---|
| Section padding vertical | `py-20` | `md:py-28` |
| Gap après le titre | `mt-14` | `mt-14` (uniforme) |
| Gap entre items staggerés | `gap-8` | `md:gap-14` |
| Grille 3 colonnes | `grid-cols-1` | `md:grid-cols-3` |
| Grille 2 colonnes | `grid-cols-1` | `md:grid-cols-2` |
| Max-width container | `max-w-6xl` | `max-w-6xl` |

---

## Typographie corps

- Taille texte body : `text-[15px]` (entre sm et base, plus éditorial)
- Line-height body : `leading-[1.7]` (aéré)
- Couleur body : `text-body` (#2e2d2a)
- Drop cap (premier §) : `first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:font-semibold first-letter:leading-none first-letter:text-primary-600`

---

## Footer

Le footer suit le même design system :
- Fond haut : `bg-neutral-100` (cohérent avec les sections light)
- Nom agence : `font-serif text-xl font-semibold` + rule décoratif `h-px w-10 bg-primary-600`
- Titres colonnes : eyebrow style `text-xs font-semibold uppercase tracking-[0.15em] text-muted`
- Fond bas (légal) : `bg-neutral-900` (dark, cohérent avec les sections impact)
- Labels légaux : `text-xs text-neutral-400/500`
