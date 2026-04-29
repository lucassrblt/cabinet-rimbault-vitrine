# TASK-01 — Intégration des vraies informations de l'agent

**Priorité : 🔴 BLOQUANT**
**Phase : Contenu client**
**Statut : ⏳ En attente des infos**

---

## Problème

Tout `src/lib/config/agent.ts` est rempli de données **placeholder fictives** :
- Téléphone : `06 12 34 56 78` (faux)
- Email : `contact@cabinet-rimbault.fr` (à confirmer)
- Adresse : `14 rue du Marché, 92100 Boulogne-Billancourt` (fausse)
- SIRET : `923 456 789 00012` (faux)
- Carte T : `CPI 9201 2024 000 012 345` (fausse)
- Garant, médiateur, RCS : placeholders

Les avis dans `src/lib/config/reviews.ts` sont également fictifs (réalistes mais inventés).

Ces données apparaissent dans :
- Header / Footer / MobileBottomBar (téléphone)
- Toutes les pages (footer réglementaire)
- `/a-propos` (bio, engagements, stats)
- `/mentions-legales` / `/politique-de-confidentialite` / `/cookies`
- `/honoraires` (barème)
- Fiche bien (contact direct)

## Checklist §12 cahier des charges — à collecter auprès de l'agent

- [ ] Nom / prénom / raison sociale exacte
- [ ] Forme juridique (EI, EURL, SARL…) → absent de `agent.ts`
- [ ] N° carte professionnelle **T** (transaction) + **G** (si gestion) + CCI émettrice
- [ ] RCS + ville d'immatriculation + SIRET
- [ ] Adresse professionnelle complète
- [ ] Téléphone pro + email pro + horaires d'ouverture
- [ ] Garant financier : nom + adresse (QBE, Galian, MMA…)
- [ ] Médiateur consommation désigné (MCP, Medimmoconso…)
- [ ] Liste complète des communes couvertes → `src/lib/config/communes.ts`
- [ ] Handles Instagram / LinkedIn pro
- [ ] Logo HD → `public/logo-cabinet-rimbault.png` existe (à valider qualité)
- [ ] Portrait pro HD → placeholder dans le code, pas d'image réelle
- [ ] Confirmation GBP actif (nb d'avis)
- [ ] Barème d'honoraires réels (vente + location)

## Implémentation

### 1. Mettre à jour `src/lib/config/agent.ts`

Remplacer toutes les valeurs fictives. Ajouter le champ `formeJuridique` :

```ts
export const AGENT = {
  // ...
  legal: {
    formeJuridique: "EI", // ou EURL, SARL...
    carteT: "Carte professionnelle T n° ...",
    carteG: "Carte professionnelle G n° ...", // si gestion
    cci: "CCI ...",
    garant: "...",
    mediator: "...",
    siret: "SIRET ...",
    rcs: "RCS ...",
  },
} as const;
```

### 2. Mettre à jour `src/lib/config/communes.ts`

Vérifier que la liste correspond aux vraies communes couvertes.

### 3. Mettre à jour `src/lib/config/reviews.ts`

Remplacer les avis fictifs par les vrais (ou par les vrais extraits Google, si GBP actif).

### 4. Ajouter le portrait de l'agent

Placer l'image dans `public/portrait-agent.jpg` (ou `.webp`).
Remplacer le placeholder dans `src/app/page.tsx` → `AgentSection` et `src/app/a-propos/page.tsx`.
Utiliser `next/image` avec `alt`, `width`, `height`.

### 5. Vérifier le logo

`public/logo-cabinet-rimbault.png` est présent — vérifier qu'il est utilisé dans `Header.tsx` via `next/image`.

### 6. Vérifier `/honoraires`

La page doit afficher le vrai barème. Actuellement : contenu générique à personnaliser.

## Notes légales

Le footer réglementaire (carte T, RCS, garant, médiateur) est affiché sur **toutes les pages**
via `Footer.tsx` et `LegalStrip` dans la fiche bien. Obligation Loi Hoguet — non négociable.
