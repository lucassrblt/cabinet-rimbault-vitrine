---
name: Wireframes — structure des pages
description: Liste des sections par page, ordre, contenu clé, CTA. Pas de design, pas d'implémentation technique.
---

# Wireframes — Cabinet Rimbault

> Document de structure produit. Pour chaque page : **quelles sections**, dans **quel ordre**, avec **quel contenu clé** et **quel CTA**.
>
> Ne traite ni du design (couleurs, typo, composants) ni de l'implémentation (Server/Client, fetch, cache). Ces aspects sont dans `cahier-des-charges.md` ou tranchés en fin de projet.
>
> À lire avec `cahier-des-charges.md` (positionnement, décisions verrouillées).

## Sommaire

- [Home](#home) — page d'accueil
- [Acheter](#acheter) — hub vente
- [Louer](#louer) — hub location
- [Fiche bien](#fiche-bien) — `/bien/[reference]`
- [Estimation / Vendre](#estimation--vendre) — couple parcours vendeur
- [Notre agence](#notre-agence) — `/a-propos`
- [Contact](#contact) — `/contact`
- [Honoraires](#honoraires) — `/honoraires`
- [404](#404) — page d'erreur custom

Pages non détaillées ici (structure purement légale, contenu rédigé par juriste) : `/mentions-legales`, `/politique-de-confidentialite`, `/cookies`.

**Hors scope MVP** : `/secteur/[commune]` reporté en **phase 2** (décision PO 2026-04-21 — cf. §15 CDC). Les liens "Secteurs" du header et des sections Home/A-propos renvoient en attendant vers `/acheter?commune=X`.

---

## Home

### Objectifs de la page

- Identifier **immédiatement** l'activité (agent immobilier indépendant, Île-de-France) et la personne.
- Permettre d'entrer dans les 3 parcours (acheter / louer / vendre) en ≤ 1 scroll visible.
- Rassurer sur la légitimité (ancienneté, zone, avis, biens vendus).

### Contraintes / décisions appliquées

- Parcours vendeur = lead le plus rentable → au moins un CTA "Estimer" visible sans scroll.
- Agent solo → home resserrée, pas de remplissage corporate.
- Pas de newsletter, pas de blog au MVP (décisions verrouillées).
- Bloc avis = Google Business. Pas de fallback au MVP : si pas d'avis ou pas de GBP actif, le bloc ne sort pas.

### Wireframe

**Convention de lecture** : chaque cadre représente une section pleine largeur (viewport desktop). `[...]` = zones cliquables / CTA. `H1`/`H2` = niveaux de titre. Les dimensions ne sont pas prescriptives — seul l'ordre et le contenu le sont.

#### Section 1 — Hero + recherche rapide

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  H1 — « Agence immobilière indépendante à [Commune(s)] »            │
│  Sous-titre 1 ligne — positionnement (un agent, X ans, X communes)  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  [ Acheter | Louer ]   [ Localisation ▾ ]  [ Budget ▾ ]  [🔍] │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  → Lien texte : « Estimer mon bien » → /estimation                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- **Toggle Acheter/Louer** : valeur par défaut = `Acheter`.
- **Localisation** : autocomplete sur les communes couvertes (liste statique au MVP).
- **Budget** : select de tranches (pas de champ libre).
- **Submit** : redirige vers `/acheter?...` ou `/louer?...` avec `searchParams` préremplis.
- Pas de carrousel d'images en fond (tranché côté design plus tard).

#### Section 2 — Biens à la une

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Sélection du moment »                                       │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                           │
│  │  PHOTO   │  │  PHOTO   │  │  PHOTO   │                           │
│  │ [badge]  │  │ [badge]  │  │ [badge]  │   ← card bien             │
│  │  Prix    │  │  Prix    │  │  Prix    │                           │
│  │  Ville   │  │  Ville   │  │  Ville   │                           │
│  │ Type·m²  │  │ Type·m²  │  │ Type·m²  │                           │
│  │  DPE     │  │  DPE     │  │  DPE     │                           │
│  └──────────┘  └──────────┘  └──────────┘                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                           │
│  │  PHOTO   │  │  PHOTO   │  │  PHOTO   │                           │
│  │   ...    │  │   ...    │  │   ...    │                           │
│  └──────────┘  └──────────┘  └──────────┘                           │
│                                                                     │
│  [ Voir tous les biens à vendre ]   [ Voir tous les biens à louer ] │
└─────────────────────────────────────────────────────────────────────┘
```

- 6 biens max. Mix vente + location (3 + 3) ou 6 vente si volume location faible. Source API : `GET /public/properties/recent`.
- **Card** : photo principale, badge conditionnel (`Exclusivité` / `Nouveauté` / `Sous compromis` / `Prix en baisse`), prix, ville, type + surface, DPE. Clic → `/bien/[reference]`.
- 2 CTAs bas de section : listes complètes vente / location.

#### Section 3 — L'agent

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Votre interlocuteur »  (ou variante ton 1re personne)       │
│                                                                     │
│  ┌──────────┐   Prénom NOM                                          │
│  │  PHOTO   │   Agent immobilier indépendant                        │
│  │ PORTRAIT │                                                       │
│  │  (HD)    │   Bio 3–4 lignes : expérience, zone, approche.        │
│  └──────────┘                                                       │
│                 ┌──────┐  ┌──────┐  ┌──────┐                        │
│                 │ X ans│  │X comm│  │X tran│  ← chiffres clés       │
│                 └──────┘  └──────┘  └──────┘     compacts           │
│                                                                     │
│                 [ En savoir plus sur l'agence ] → /a-propos         │
└─────────────────────────────────────────────────────────────────────┘
```

- Photo portrait pro (cf. infos à collecter §12 cahier des charges).
- 3 chiffres clés inline, pas de bloc stats séparé (volume solo ≠ réseau).
- Un seul CTA secondaire vers `/a-propos`.

#### Section 4 — Secteurs couverts

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Les communes où j'interviens »                              │
│  Sous-titre 1 ligne — légitimité territoriale                       │
│                                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ [Commune 1]│ │ [Commune 2]│ │ [Commune 3]│ │ [Commune 4]│        │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ [Commune 5]│ │ [Commune 6]│ │ [Commune 7]│ │ [Commune 8]│        │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- Liste visuelle des communes (pas de carte interactive au MVP).
- Chaque commune = lien vers `/acheter?commune=X` au MVP. Bascule vers `/secteur/[commune]` en phase 2.
- Rôle : maillage SEO interne + légitimité territoriale.

#### Section 5 — Biens récemment vendus / loués

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Mes dernières transactions »                                │
│  Sous-titre — preuve de compétence locale                           │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  PHOTO   │  │  PHOTO   │  │  PHOTO   │  │  PHOTO   │             │
│  │  VENDU   │  │  VENDU   │  │   LOUÉ   │  │  VENDU   │  ← badge    │
│  │          │  │          │  │          │  │          │    statut   │
│  │  Ville   │  │  Ville   │  │  Ville   │  │  Ville   │             │
│  │ Type·m²  │  │ Type·m²  │  │ Type·m²  │  │ Type·m²  │             │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘             │
│                                                                     │
│  (bloc masqué si moins de 4 biens vendus/loués disponibles)         │
└─────────────────────────────────────────────────────────────────────┘
```

- 4 à 6 biens, statut `vendu` ou `loué`. Source API : filtre statut côté admin (à confirmer dispo).
- **Pas de prix affiché** (confidentialité vendeur) et pas de lien vers `/bien/[ref]` — card non cliquable. Juste : photo, badge statut, ville, type, surface.
- **Conditionnel** : bloc retiré si stock vendus/loués < 4. Pas de fallback texte.

#### Section 6 — Parcours vendeur

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   H2 — « Vous envisagez de vendre ? »                               │
│                                                                     │
│   2–3 lignes : méthode, accompagnement, estimation gratuite, délai. │
│                                                                     │
│   [ Estimer mon bien ]   [ En savoir plus ]                         │
│    (primaire)             (secondaire)                              │
│     → /estimation          → /vendre                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- Bloc pleine largeur, visuellement accentué (traité côté design).
- 2 CTAs côte-à-côte, le primaire mène directement au formulaire.

#### Section 7 — Avis clients

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Ce que disent mes clients »                                 │
│  ★ 4,9/5 sur Google — X avis                                        │
│                                                                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │ ★★★★★         │  │ ★★★★★         │  │ ★★★★★         │            │
│  │ « Extrait     │  │ « Extrait     │  │ « Extrait     │            │
│  │   avis… »     │  │   avis… »     │  │   avis… »     │            │
│  │ — Prénom, date│  │ — Prénom, date│  │ — Prénom, date│            │
│  └───────────────┘  └───────────────┘  └───────────────┘            │
│                                                                     │
│  [ Voir tous les avis ] → fiche Google Business (nouvel onglet)     │
│                                                                     │
│  (section entière masquée si < 5 avis ou GBP inactif)               │
└─────────────────────────────────────────────────────────────────────┘
```

- Source : Google Business Profile.
- Pas de fallback si GBP indisponible : la section ne s'affiche simplement pas.

#### Section 8 — Contact rapide

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Discutons de votre projet »                                 │
│                                                                     │
│  ┌──────────────┐  ┌──────────────────────────────┐                 │
│  │              │  │ Formulaire court :           │                 │
│  │  📞 Appeler  │  │  - Nom                       │                 │
│  │   XX XX XX   │  │  - Téléphone                 │                 │
│  │   [tel:...]  │  │  - Message                   │                 │
│  │              │  │  [ Envoyer ] + mention RGPD  │                 │
│  └──────────────┘  └──────────────────────────────┘                 │
│                                                                     │
│  → Lien texte : « Coordonnées complètes & horaires » → /contact     │
└─────────────────────────────────────────────────────────────────────┘
```

- 2 moyens directs côte-à-côte (tel + mini-formulaire).
- Mention RGPD obligatoire sous le formulaire.
- Lien `/contact` pour adresse complète + horaires + carte.

### Récap ordre des sections

1. Hero + recherche rapide
2. Biens à la une
3. L'agent
4. Secteurs couverts
5. Biens récemment vendus / loués
6. Parcours vendeur
7. Avis clients *(conditionnel)*
8. Contact rapide

### Hors MVP (phase 2)

- Bloc actualités / articles blog.
- Bloc newsletter.
- Vidéo de présentation de l'agent.
- Alerte email depuis la home.

### Décalages assumés vs benchmarks

| Benchmark pattern | Notre choix | Raison |
|---|---|---|
| Bloc chiffres clés agence séparé (Junot, Consultants, Fair&Square) | Version inline dans le bloc "L'agent" | Volume d'un solo ≠ 25 agences — pas de gonflage artificiel |
| Bloc actus / journal (Junot, Fair&Square, Mansart) | Différé phase 2 | Cohérent avec l'absence de blog au MVP |
| Newsletter (Junot, Christine Mongin) | Absent | Décision verrouillée |
| Moteur avec 10+ filtres en hero | Moteur 3 champs | Simplicité mobile + redirection vers `/acheter` avec filtres complets |
| Fallback avis si pas de GBP actif | Aucun | Choix PO : plutôt masquer que faire semblant |

---

## Acheter

### Objectifs de la page

- Exposer la totalité du stock en vente, indexable et partageable.
- Permettre un filtrage intermédiaire efficace sans noyer l'utilisateur (petite agence, 6–20 biens actifs).
- Chaque bien listé = porte d'entrée vers sa fiche SEO.

### Contraintes / décisions appliquées

- **Grille pure** au MVP — pas de carte interactive (reportée au niveau fiche bien).
- Filtres en **URL `searchParams`** (SEO, URLs partageables, Server Components).
- **Pas de state client** pour les filtres : chaque changement = navigation serveur.
- Pagination serveur — pas de scroll infini au MVP (incompatible SEO + petit stock).

### Wireframe

#### Section 1 — En-tête de page

```
┌─────────────────────────────────────────────────────────────────────┐
│  Breadcrumb : Accueil > Acheter                                     │
│                                                                     │
│  H1 — « Biens à vendre en Île-de-France »                           │
│  Sous-titre — « X biens disponibles sur [communes couvertes] »      │
└─────────────────────────────────────────────────────────────────────┘
```

- H1 incorpore la géographie (ou le nom de la commune si `?commune=…` en URL — la H1 peut devenir dynamique).
- Compteur de biens = lu depuis la réponse API (`total`).

#### Section 2 — Barre de filtres

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Type ▾  │ │Commune▾ │ │Pièces ▾ │ │ Budget ▾ │ │Surface ▾ │      │
│  └─────────┘ └─────────┘ └─────────┘ └──────────┘ └──────────┘      │
│                                                                     │
│  [+ Plus de filtres]        [✕ Réinitialiser] (si filtres actifs)   │
│                                                                     │
│  ─── Chips filtres actifs ───                                       │
│  [ Appartement ✕ ]  [ Boulogne ✕ ]  [ 3+ pièces ✕ ]                 │
└─────────────────────────────────────────────────────────────────────┘
```

**Filtres visibles (intermédiaires)** :

| Filtre | Type | Valeurs |
|---|---|---|
| Type de bien | multi-select | Appartement, Maison, Terrain, Local pro, Parking, Autre |
| Commune | multi-select | liste des communes couvertes |
| Pièces | select min | 1+, 2+, 3+, 4+, 5+ |
| Budget | double select | min + max (tranches) |
| Surface | double select | min + max (tranches) |

**Filtres dans "Plus de filtres" (modal)** :

| Filtre | Type | Valeurs |
|---|---|---|
| DPE | multi-select | A, B, C, D, E, F, G |
| Extérieur | checkbox | Balcon, Terrasse, Jardin |
| Exclusivité | checkbox | Oui / Non |
| État | checkbox | À rénover / Récent |
| Étage | select | RDC, 1er+, 2e+, 3e+ |

- Chaque filtre appliqué modifie l'URL (`/acheter?type=appartement&commune=boulogne&pieces_min=3`).
- Chips d'actifs sous la barre, cliquables pour retrait.
- Mobile : barre scrollable horizontale + bouton `Filtres` pleine largeur qui ouvre un drawer plein écran.

#### Section 3 — Tri + compteur de résultats

```
┌─────────────────────────────────────────────────────────────────────┐
│  X résultats                                 Trier par : [ ▾ ]      │
│                                              · Plus récents (défaut)│
│                                              · Prix ↑               │
│                                              · Prix ↓               │
│                                              · Surface ↑            │
│                                              · Surface ↓            │
└─────────────────────────────────────────────────────────────────────┘
```

- Tri également en `searchParams` (`?sort=price_asc`).

#### Section 4 — Grille de biens

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                        │
│  │   PHOTO   │  │   PHOTO   │  │   PHOTO   │  ← card bien           │
│  │  [badge]  │  │  [badge]  │  │  [badge]  │    cliquable →         │
│  │   Prix    │  │   Prix    │  │   Prix    │   /bien/[ref]          │
│  │   Ville   │  │   Ville   │  │   Ville   │                        │
│  │  Type·m²  │  │  Type·m²  │  │  Type·m²  │                        │
│  │ Pièces·DPE│  │ Pièces·DPE│  │ Pièces·DPE│                        │
│  └───────────┘  └───────────┘  └───────────┘                        │
│                                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                        │
│  │    ...    │  │    ...    │  │    ...    │                        │
│  └───────────┘  └───────────┘  └───────────┘                        │
└─────────────────────────────────────────────────────────────────────┘
```

- Grille 3 colonnes desktop, 2 tablette, 1 mobile (responsive côté design).
- Card : photo principale + badges (`Exclusivité` / `Nouveauté` / `Prix en baisse` / `Sous compromis`), prix, ville, type, surface, pièces, DPE. Toute la card est cliquable.
- **État vide** : si aucun résultat, afficher un message + CTA `Réinitialiser les filtres` et `Me contacter pour un bien sur mesure` → `/contact`.

#### Section 5 — Pagination

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ‹ 1  2  3  4  5  ›                             │
└─────────────────────────────────────────────────────────────────────┘
```

- Pagination serveur. 12 biens par page par défaut (modifiable via `?per_page=`).
- `searchParams` incluent `page`. Accessible via clavier.

#### Section 6 — Bloc SEO + CTA contact (bas de page)

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Acheter un bien dans [zone couverte] »                      │
│                                                                     │
│  Paragraphe SEO (1 à 2 paragraphes) : marché local, spécificités,   │
│  approche de l'agent. Évite le remplissage générique.               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Vous ne trouvez pas le bien idéal ?                         │   │
│  │  [ Me contacter ] → /contact   [ Estimer mon bien ]          │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

- Le bloc SEO texte est **indispensable** pour le référencement de cette URL et des variantes (`?commune=...`).
- CTA final capture les visiteurs non servis par le stock actuel.

### Récap ordre des sections

1. En-tête (breadcrumb + H1 + compteur)
2. Barre de filtres + chips actifs
3. Tri + compteur
4. Grille de biens
5. Pagination
6. Bloc SEO + CTA contact

### Hors MVP (phase 2)

- Vue carte interactive (toggle grille/carte).
- Sauvegarde de recherche + alerte email.
- Favoris.
- Pagination infinie (client-side).
- Tri par pertinence / biens vus.

### Décalages assumés vs benchmarks

| Pattern benchmark | Notre choix | Raison |
|---|---|---|
| Toggle grille/carte (Marty, Consultants) | Grille pure | Stock faible (6–20 biens) — la carte apporte peu de valeur et beaucoup de complexité technique |
| Scroll infini | Pagination serveur | SEO + small dataset |
| Filtre "rayon autour d'une ville" | Absent | Multi-select commune plus adapté à notre géo fragmentée IDF |
| Filtre "dernières annonces" checkbox | Couvert par le tri `Plus récents` par défaut | Évite la redondance |
| Recherche par référence en hero listing | Absent (prévu dans le header ?) | À arbitrer plus tard — pas typique pour un petit stock |

---

## Louer

### Objectifs de la page

- Exposer la totalité du stock en location longue durée, indexable et partageable.
- Rendre immédiatement visibles les informations décisionnelles d'un candidat locataire : loyer charges comprises, charges séparées, dépôt de garantie, meublé/non meublé, DPE.
- Chaque bien listé = porte d'entrée vers sa fiche SEO.

### Contraintes / décisions appliquées

- Location **longue durée uniquement** (pas de saisonnier — hors scope MVP).
- **Grille pure** au MVP — pas de carte interactive.
- Filtres en **URL `searchParams`** (SEO, URLs partageables, Server Components).
- **Loyer CC** (charges comprises) = valeur primaire affichée. Détail des charges en second.
- **Obligation loi Climat** : pour les biens DPE F/G, mention claire des restrictions locatives (gel loyer, interdiction progressive) — visible **dès la card listing**, pas uniquement sur la fiche.

### Wireframe

#### Section 1 — En-tête de page

```
┌─────────────────────────────────────────────────────────────────────┐
│  Breadcrumb : Accueil > Louer                                       │
│                                                                     │
│  H1 — « Biens à louer en Île-de-France »                            │
│  Sous-titre — « X logements disponibles à la location sur           │
│                 [communes couvertes] »                              │
└─────────────────────────────────────────────────────────────────────┘
```

- H1 devient dynamique si `?commune=...` en URL.
- Compteur lu depuis `total` de la réponse API.

#### Section 2 — Barre de filtres

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Type ▾  │ │Commune▾ │ │Pièces ▾ │ │ Loyer ▾  │ │Surface ▾ │      │
│  └─────────┘ └─────────┘ └─────────┘ └──────────┘ └──────────┘      │
│                                                                     │
│  [+ Plus de filtres]        [✕ Réinitialiser] (si filtres actifs)   │
│                                                                     │
│  ─── Chips filtres actifs ───                                       │
│  [ Appartement ✕ ]  [ Meublé ✕ ]  [ 2+ pièces ✕ ]                   │
└─────────────────────────────────────────────────────────────────────┘
```

**Filtres visibles (intermédiaires)** :

| Filtre | Type | Valeurs |
|---|---|---|
| Type de bien | multi-select | Appartement, Maison, Studio, Local pro, Parking, Autre |
| Commune | multi-select | liste des communes couvertes |
| Pièces | select min | 1+, 2+, 3+, 4+, 5+ |
| Loyer (CC) | double select | min + max (tranches) |
| Surface | double select | min + max (tranches) |

**Filtres dans "Plus de filtres" (modal)** :

| Filtre | Type | Valeurs |
|---|---|---|
| Meublé | radio | Indifférent / Meublé / Non meublé |
| DPE | multi-select | A, B, C, D, E, F, G |
| Extérieur | checkbox | Balcon, Terrasse, Jardin |
| Étage | select | RDC, 1er+, 2e+, 3e+ |
| Masquer DPE F/G | checkbox | Oui / Non (décoché par défaut) |

- **Note** : `Exclusivité` et `À rénover` retirés (non pertinents en location).
- **Filtre "Masquer DPE F/G"** ajouté : permet au locataire de filtrer les biens soumis à restrictions loi Climat (pertinent depuis 2025).
- Mobile : barre scrollable horizontale + bouton `Filtres` pleine largeur qui ouvre un drawer plein écran.

#### Section 3 — Tri + compteur de résultats

```
┌─────────────────────────────────────────────────────────────────────┐
│  X résultats                                 Trier par : [ ▾ ]      │
│                                              · Plus récents (défaut)│
│                                              · Loyer ↑              │
│                                              · Loyer ↓              │
│                                              · Surface ↑            │
│                                              · Surface ↓            │
└─────────────────────────────────────────────────────────────────────┘
```

- Tri également en `searchParams` (`?sort=rent_asc`).

#### Section 4 — Grille de biens

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │      PHOTO       │  │      PHOTO       │  │      PHOTO       │   │
│  │   [Meublé] [Nv]  │  │     [Meublé]     │  │   [Nouveauté]    │   │
│  │                  │  │                  │  │                  │   │
│  │  1 450 € / mois  │  │  1 850 € / mois  │  │   950 € / mois   │   │
│  │   (CC)           │  │   (CC)           │  │   (CC)           │   │
│  │  + 80 € charges  │  │  + 120 € charges │  │  + 40 € charges  │   │
│  │                  │  │                  │  │                  │   │
│  │  Ville           │  │  Ville           │  │  Ville           │   │
│  │  Appart · 42 m²  │  │  Maison · 75 m²  │  │  Studio · 22 m²  │   │
│  │  2 pièces · DPE D│  │  4 pièces · DPE C│  │  1 pièce · DPE F │   │
│  │                  │  │                  │  │  ⚠ Loyer gelé    │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │       ...        │  │       ...        │  │       ...        │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

**Card location (distincte de la card vente)** :

- Photo principale.
- Badges statut (max 2) : `Meublé` / `Nouveauté` / `Nouveau loyer`.
- **Loyer CC** en gras = valeur principale affichée.
- **Détail charges** en second (`+ X € charges`) — indique au locataire le budget total.
- Ville, type, surface, pièces, DPE.
- **Si DPE F ou G** : bandeau visuel d'alerte en pied de card avec texte `Loyer gelé` (F) ou `Location limitée` (G dès 2025). Mention légale loi Climat.
- Toute la card est cliquable → `/bien/[reference]`.

**État vide** : si aucun résultat, afficher un message + CTA `Réinitialiser les filtres` et `Me signaler ma recherche` → `/contact` (pour alerte manuelle tant que l'alerte email n'est pas en phase 2).

#### Section 5 — Pagination

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ‹ 1  2  3  ›                                   │
└─────────────────────────────────────────────────────────────────────┘
```

- Pagination serveur, 12 biens par page (cohérent avec `/acheter`).
- Souvent invisible au MVP (stock location < 12), mais présente par défaut.

#### Section 6 — Bloc d'info locataire (spécifique location)

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Votre dossier locataire »                                   │
│                                                                     │
│  Paragraphe court : liste des pièces à préparer (identité, revenus, │
│  garant, justificatifs domicile…), délai moyen de traitement, mode  │
│  de soumission (DossierFacile accepté, dépôt sur place, email).     │
│                                                                     │
│  [ Voir la liste complète des pièces ] → ancre ou /contact          │
└─────────────────────────────────────────────────────────────────────┘
```

- **Différenciateur vs /acheter** : un locataire cherche de l'info procédurale (dossier, pièces, timing) que l'acheteur n'attend pas.
- Permet de réduire les questions répétitives à l'agent.
- Compatible avec un vrai PDF / lien externe si l'agent en fournit un.

#### Section 7 — Bloc SEO + CTA contact (bas de page)

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Louer un logement dans [zone couverte] »                    │
│                                                                     │
│  Paragraphe SEO (1 à 2 paragraphes) : marché locatif local, profil  │
│  des biens, approche de l'agent en tant qu'intermédiaire bailleur/  │
│  locataire. Pas de remplissage générique.                           │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Pas de bien qui correspond ?                                │   │
│  │  [ Me signaler ma recherche ] → /contact                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

- Bloc SEO indispensable pour le référencement de `/louer` et `/louer?commune=X`.
- CTA final capture les visiteurs qui n'ont pas trouvé dans le stock actuel (souvent vrai en location, stock plus volatile).

### Récap ordre des sections

1. En-tête (breadcrumb + H1 + compteur)
2. Barre de filtres + chips actifs
3. Tri + compteur
4. Grille de biens (card spécifique location)
5. Pagination
6. Bloc d'info locataire (dossier / pièces)
7. Bloc SEO + CTA contact

### Hors MVP (phase 2)

- Alerte email sur nouveaux biens en location (très attendu sur ce parcours).
- Favoris.
- Filtre "disponible à partir du [date]".
- Soumission de dossier en ligne.
- Vue carte interactive.

### Décalages assumés vs benchmarks

| Pattern benchmark | Notre choix | Raison |
|---|---|---|
| Card vente et card location identiques | Card location **distincte** (loyer + charges + statut meublé) | Décisions d'achat et de location ont des info-clés différentes |
| Mention DPE F/G reportée uniquement sur la fiche bien | Mention sur la card listing **et** la fiche | Obligation loi Climat à ne pas enterrer en profondeur — et utile au scan |
| Pas de bloc "dossier locataire" (absent chez tous les benchmarks analysés) | **Ajouté** | Petit gain UX concret pour un site de quartier ; réduit les relances de l'agent |
| Location saisonnière listée avec la LLD (Gounod, Donzacq) | Pas de saisonnier | Hors scope MVP (décision verrouillée) |
| Filtre "Exclusivité" (présent chez tous en vente) | Retiré en location | Notion peu opérante côté locataire |

---

## Fiche bien

`/bien/[reference]` — un seul template pour vente et location. Le contenu et les blocs s'adaptent selon le type de transaction lu depuis la data API.

### Objectifs de la page

- **Page SEO la plus critique du site** : chaque bien est une landing indexable (cf. §11 cahier des charges).
- Donner en ≤ 1 scroll tout ce qui déclenche ou bloque la prise de contact : photos, prix, surface, localisation approximative, DPE, disponibilité.
- Convertir l'intérêt en **lead qualifié** via un formulaire contextuel "je veux visiter ce bien".
- Respecter les obligations légales (DPE/GES, honoraires, loi Climat pour location F/G).

### Contraintes / décisions appliquées

- Server Component, fetch via `src/lib/api/properties.ts` (`getPropertyByReference`).
- `metadata` dynamique (titre, description, OG image = 1re photo).
- JSON-LD `RealEstateListing` (cf. §11 CDC — à implémenter côté technique).
- **Galerie** : image principale (carrousel) + miniatures cliquables + lightbox plein écran au clic.
- **Carte localisation** : cercle d'approximation ~500 m (protection confidentialité vendeur).
- **Formulaire contact contextuel** : différent du formulaire générique `/contact`, pensé pour une demande de visite.
- Prise de rendez-vous en ligne = phase 2.

### Wireframe

#### Section 1 — Breadcrumb

```
┌─────────────────────────────────────────────────────────────────────┐
│  Accueil > Acheter > [Commune] > [Type de bien]                     │
└─────────────────────────────────────────────────────────────────────┘
```

- Breadcrumb dynamique : `Acheter` ou `Louer` selon la transaction.
- Liens cliquables (`/acheter?commune=X` au MVP, bascule vers `/secteur/[commune]` en phase 2).

#### Section 2 — Galerie photos

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────┐  ┌─────────────┐  │
│  │                                              │  │  Miniature  │  │
│  │                                              │  │     #2      │  │
│  │                                              │  └─────────────┘  │
│  │           IMAGE PRINCIPALE                   │  ┌─────────────┐  │
│  │           (carrousel hero)                   │  │  Miniature  │  │
│  │                                              │  │     #3      │  │
│  │   ‹                                       ›  │  └─────────────┘  │
│  │                                              │  ┌─────────────┐  │
│  │                                              │  │  Miniature  │  │
│  │                                              │  │     #4      │  │
│  └──────────────────────────────────────────────┘  └─────────────┘  │
│                                                    ┌─────────────┐  │
│  ● ○ ○ ○ ○ ○   (indicateur position carrousel)     │ +N photos   │  │
│                                                    │ [Voir tout] │  │
│                                                    └─────────────┘  │
│                                                                     │
│  🔍 Clic sur l'image principale ou une miniature → LIGHTBOX         │
│     plein écran (navigation flèches + Esc pour fermer)              │
└─────────────────────────────────────────────────────────────────────┘
```

- **Image principale** : carrousel (flèches + swipe mobile + indicateurs de position).
- **Miniatures** : 3–4 visibles à droite sur desktop (bande verticale ou grille), cliquables → saut dans le carrousel principal.
- **Bouton `+N photos` / `Voir tout`** : ouvre directement la lightbox à la vue grille si > 4 photos.
- **Lightbox plein écran** : clic sur l'image principale ou une miniature. Navigation clavier (← → Esc) + swipe mobile + bouton de fermeture. Zoom au clic optionnel (post-MVP).
- Mobile : empilement — carrousel pleine largeur + miniatures en bandeau scrollable sous.

#### Section 3 — En-tête bien (titre + prix + caractéristiques clés)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Exclusivité] [Nouveauté]  ← badges statut                         │
│                                                                     │
│  H1 — « [Type] de [N] pièces à [Commune] »                          │
│  Sous-titre — « Référence : [XXXX] · Mis en ligne le [date] »       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  VENTE :     690 000 €                                       │   │
│  │              Honoraires inclus — charge acquéreur (ou autre) │   │
│  │                                                              │   │
│  │  LOCATION :  1 450 € / mois CC                               │   │
│  │              (Loyer 1 370 € + Charges 80 €)                  │   │
│  │              Dépôt de garantie : 1 370 € · Meublé : Non      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                   │
│  │ 75 m²│  │3 pces│  │2 chbs│  │ Ét. 3│  │ DPE D│   ← stats pills   │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘                   │
└─────────────────────────────────────────────────────────────────────┘
```

- Badges statut en haut (`Exclusivité`, `Nouveauté`, `Sous compromis`, `Prix en baisse`).
- **H1** intègre type + nb pièces + commune (SEO).
- **Référence** et date de mise en ligne sous le H1.
- **Bloc prix** adapté selon vente/location :
  - Vente : prix + mention `honoraires inclus / charge acquéreur` (obligatoire).
  - Location : loyer CC + détail loyer/charges + dépôt + meublé.
- **Stats pills** (5 max) : surface, pièces, chambres, étage, DPE — info de scan.

#### Section 4 — Description

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Description »                                               │
│                                                                     │
│  Texte libre rédigé par l'agent (2 à 8 paragraphes typiquement).    │
│  Affichage plein, pas de troncature. Contenu SEO.                   │
│                                                                     │
│  Paragraphe 1…                                                      │
│  Paragraphe 2…                                                      │
│  Paragraphe 3…                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

- Texte rédactionnel libre venant de l'admin.
- Pas de lecture "voir plus / voir moins" au MVP (nuit au SEO).

#### Section 5 — Caractéristiques détaillées

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Caractéristiques »                                          │
│                                                                     │
│  ┌────────────────────────────┐  ┌────────────────────────────┐     │
│  │  GÉNÉRAL                   │  │  INTÉRIEUR                 │     │
│  │  · Type : Appartement      │  │  · Chambres : 2            │     │
│  │  · Surface : 75 m²         │  │  · Salle de bain : 1       │     │
│  │  · Pièces : 3              │  │  · Cuisine : équipée       │     │
│  │  · Étage : 3e / 5e         │  │  · Chauffage : individuel  │     │
│  │  · Ascenseur : Oui         │  │  · Exposition : sud-ouest  │     │
│  └────────────────────────────┘  └────────────────────────────┘     │
│                                                                     │
│  ┌────────────────────────────┐  ┌────────────────────────────┐     │
│  │  EXTÉRIEUR                 │  │  COPROPRIÉTÉ (vente)       │     │
│  │  · Balcon : 8 m²           │  │  · Nb lots : 42            │     │
│  │  · Terrasse : Non          │  │  · Charges : 220 €/mois    │     │
│  │  · Jardin : Non            │  │  · Procédure : Non         │     │
│  │  · Parking : 1 box         │  │  · Année construction : 1975│     │
│  └────────────────────────────┘  └────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

- Regroupement en 4 rubriques : Général · Intérieur · Extérieur · Copropriété (vente) / Conditions (location).
- Seuls les champs renseignés côté API sont affichés (pas de "Non communiqué" partout).
- **Bloc Copropriété obligatoire pour la vente** si copropriété (loi ALUR) : nb lots, charges annuelles, procédures en cours.

#### Section 6 — Diagnostics DPE / GES

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Performance énergétique »                                   │
│                                                                     │
│  ┌─────────────────────────┐  ┌─────────────────────────┐           │
│  │  DPE                    │  │  GES                    │           │
│  │  ┌───┐                  │  │  ┌───┐                  │           │
│  │  │ A │                  │  │  │ A │                  │           │
│  │  ├───┤                  │  │  ├───┤                  │           │
│  │  │ B │                  │  │  │ B │                  │           │
│  │  ├───┤                  │  │  ├───┤                  │           │
│  │  │ C │                  │  │  │ C │                  │           │
│  │  ├───┤ ◄── D (valeur)   │  │  ├───┤ ◄── D (valeur)   │           │
│  │  │ D │   150 kWh/m²/an  │  │  │ D │   30 kg CO₂/m²   │           │
│  │  ├───┤                  │  │  ├───┤                  │           │
│  │  │ E │                  │  │  │ E │                  │           │
│  │  ├───┤                  │  │  ├───┤                  │           │
│  │  │ F │                  │  │  │ F │                  │           │
│  │  ├───┤                  │  │  ├───┤                  │           │
│  │  │ G │                  │  │  │ G │                  │           │
│  │  └───┘                  │  │  └───┘                  │           │
│  └─────────────────────────┘  └─────────────────────────┘           │
│                                                                     │
│  Montant estimé des dépenses annuelles d'énergie :                  │
│  Entre X € et Y € (date de référence énergie : 01/01/2021)          │
│                                                                     │
│  ⚠ Si DPE F ou G en location :                                      │
│  « Ce logement est classé [F/G]. Le loyer ne peut pas être          │
│    réévalué entre deux locataires. À partir du [date], la mise      │
│    en location sera interdite (loi Climat & Résilience). »          │
└─────────────────────────────────────────────────────────────────────┘
```

- **Obligation légale** : affichage DPE + GES + montant estimé dépenses énergie + date référence.
- Échelle visuelle A→G avec curseur sur la note.
- **Alerte loi Climat** conditionnelle : location + DPE F/G → bandeau textuel explicite.

#### Section 7 — Honoraires (vente uniquement)

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Honoraires »                                                │
│                                                                     │
│  Charge [acquéreur / vendeur] : X %                                 │
│  Prix hors honoraires : Y €                                         │
│                                                                     │
│  → Lien : « Consulter le barème complet » → /honoraires             │
└─────────────────────────────────────────────────────────────────────┘
```

- Obligatoire loi Hoguet / arrêté 2017.
- **Location** : rappel "Honoraires à la charge du locataire : X € TTC / m² dans la limite légale" + lien vers `/honoraires`.

#### Section 8 — Localisation

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Localisation »                                              │
│  Sous-titre — « Secteur [Commune] — quartier [X] »                  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │                   ╭─────────────╮                            │   │
│  │                ╭──╯             ╰──╮                         │   │
│  │              ╭─╯                   ╰─╮                       │   │
│  │             ╱    Zone approximative   ╲                      │   │
│  │            │       (cercle 500 m)      │    ← carte interact.│   │
│  │             ╲                         ╱                      │   │
│  │              ╰─╮                   ╭─╯                       │   │
│  │                ╰──╮             ╭──╯                         │   │
│  │                   ╰─────────────╯                            │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Mention : « Localisation approximative — l'adresse exacte          │
│  sera communiquée lors de la prise de contact. »                    │
└─────────────────────────────────────────────────────────────────────┘
```

- **Carte interactive** (TanStack Query + Leaflet/MapLibre — à trancher techniquement).
- **Cercle d'approximation de 500 m de rayon**, pas de pin précis.
- Pas d'adresse postale affichée.
- Mention explicite de l'approximation sous la carte.
- Fond de carte épuré (pas de POI tape-à-l'œil).

#### Section 9 — Demande de visite (formulaire contextuel)

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Ce bien vous intéresse ? »                                  │
│                                                                     │
│  ┌───────────────────────────┐  ┌──────────────────────────────┐    │
│  │  AGENT                    │  │  DEMANDE DE VISITE           │    │
│  │  ┌────┐                   │  │                              │    │
│  │  │PHOTO│  Prénom NOM      │  │  Votre profil :              │    │
│  │  └────┘  Agent indépendant│  │   ( ) Acquéreur              │    │
│  │                           │  │   ( ) Investisseur           │    │
│  │  📞 [Appeler]             │  │   ( ) Juste curieux          │    │
│  │  ✉ [Email]                │  │  (ou : Locataire si /louer)  │    │
│  │                           │  │                              │    │
│  │  Référence bien : XXXX    │  │  Financement (achat) :       │    │
│  │                           │  │   ( ) Accordé / en cours     │    │
│  │                           │  │   ( ) À étudier              │    │
│  │                           │  │   ( ) Comptant               │    │
│  │                           │  │                              │    │
│  │                           │  │  Disponibilités pour visite :│    │
│  │                           │  │   ☐ Matin   ☐ Après-midi     │    │
│  │                           │  │   ☐ Soir    ☐ Samedi         │    │
│  │                           │  │                              │    │
│  │                           │  │  Nom · Téléphone · Email     │    │
│  │                           │  │  Message (optionnel)         │    │
│  │                           │  │                              │    │
│  │                           │  │  ☐ J'accepte la politique    │    │
│  │                           │  │    de confidentialité (RGPD) │    │
│  │                           │  │                              │    │
│  │                           │  │  [ Envoyer ma demande ]      │    │
│  └───────────────────────────┘  └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

- **Colonne gauche** : identité agent + moyens de contact directs (tel, email).
- **Colonne droite** : formulaire contextuel lié au bien.
- **Référence du bien transmise automatiquement** en champ caché → le lead arrive côté agent avec le bien déjà identifié.
- **Profil + Financement + Disponibilités** : qualification en amont = gain de temps pour l'agent.
- **Champ `Financement`** conditionnel (achat uniquement), pas affiché en location.
- **Mention RGPD obligatoire** + case à cocher explicite.
- Confirmation après envoi (toast ou redirection vers page de confirmation — à trancher).

#### Section 10 — Biens similaires

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Autres biens qui pourraient vous plaire »                   │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                           │
│  │  PHOTO   │  │  PHOTO   │  │  PHOTO   │   ← 3 biens similaires    │
│  │  Prix    │  │  Prix    │  │  Prix    │                           │
│  │  Ville   │  │  Ville   │  │  Ville   │                           │
│  │ Type·m²  │  │ Type·m²  │  │ Type·m²  │                           │
│  └──────────┘  └──────────┘  └──────────┘                           │
│                                                                     │
│  [ Voir tous les biens à la vente ] → /acheter  (ou /louer)         │
└─────────────────────────────────────────────────────────────────────┘
```

- 3 biens max, même transaction (vente/location), priorité : même commune > même type > proche en prix/surface.
- Si moins de 3 biens disponibles, fallback `Voir tous les biens à la vente`.

#### Section 11 — Mentions légales en pied de page

```
┌─────────────────────────────────────────────────────────────────────┐
│  Cabinet Rimbault · Carte professionnelle T n°… · CCI de …          │
│  Garant financier : [nom + adresse] · Médiateur : [nom]             │
│  → [Mentions légales complètes] → /mentions-legales                 │
└─────────────────────────────────────────────────────────────────────┘
```

- Rappel compact obligatoire en fin de fiche (en plus du footer global du site).
- Rend la page auto-suffisante au regard des obligations loi Hoguet.

### Récap ordre des sections

1. Breadcrumb
2. Galerie photos (carrousel + miniatures + lightbox)
3. En-tête bien (titre + prix + badges + stats pills)
4. Description
5. Caractéristiques détaillées
6. Diagnostics DPE / GES
7. Honoraires
8. Localisation (carte cercle 500 m)
9. Demande de visite (formulaire contextuel)
10. Biens similaires
11. Mentions légales compactes

### Hors MVP (phase 2)

- Prise de rendez-vous en ligne (type Calendly — remplace ou complète le formulaire).
- Bouton "Ajouter aux favoris".
- Partage social (Email / WhatsApp / lien court).
- Signalement de changement de prix / suivi alertes.
- Visite virtuelle / plan interactif.
- Commentaires du quartier (transports, écoles, commerces) via POI.
- Simulateur mensualités pour la vente.

### Décalages assumés vs benchmarks

| Pattern benchmark | Notre choix | Raison |
|---|---|---|
| Adresse précise (pin) sur la carte (Fair&Square minoritaire) | Cercle 500 m | Confidentialité vendeur — pattern dominant + plus sain |
| Pas de formulaire contextuel, juste un contact général (majorité benchmarks) | **Formulaire "demande de visite"** avec qualification | Gain de temps pour un solo : leads pré-qualifiés |
| Carte absente (Christine Mongin, Les Toits) | **Carte présente** | Attendu par les acheteurs — une absence se remarque |
| Bouton favoris (Les Toits, Mansart, Junot) | Différé phase 2 | Cohérent avec l'absence de compte utilisateur MVP |
| Simulateur crédit intégré (Junot, Consultants) | Absent | Sort du scope d'un solo ; alourdit sans valeur incrémentale forte |
| Biens similaires algorithmiques (Junot, Consultants) | Logique simple : commune → type → prix | Pas de moteur de reco à construire pour 6–20 biens |

---

## Estimation / Vendre

Deux pages distinctes, couplées sur le parcours vendeur. `/vendre` expose la méthode, `/estimation` capte le lead.

### /vendre

#### Objectifs de la page

- Rassurer le vendeur sur la **méthode** et la **valeur ajoutée** de l'agent avant qu'il ne se lance dans l'estimation.
- **Pédagogie pure** : pas de formulaire de capture sur cette page. Conversion déléguée à `/estimation` ou au contact direct.
- Ranker sur des requêtes type "vendre son appartement à [commune]", "comment vendre avec un agent immobilier".

#### Contraintes / décisions appliquées

- Aucun formulaire lead sur cette page.
- CTA final clair : `/estimation` en primaire, téléphone en secondaire.
- Ton humain, 1re personne (cohérent positionnement "l'agent est la marque").

#### Wireframe

##### Section 1 — Hero

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  Breadcrumb : Accueil > Vendre                                      │
│                                                                     │
│  H1 — « Vendre votre bien avec un accompagnement humain »           │
│  Sous-titre 1–2 lignes — promesse : estimation gratuite, transpa-   │
│  rence, suivi personnalisé, connaissance du quartier.               │
│                                                                     │
│  [ Estimer mon bien ] (primaire)  [ Me contacter ] (secondaire)     │
│        → /estimation                     → /contact                 │
└─────────────────────────────────────────────────────────────────────┘
```

##### Section 2 — Les étapes de la vente

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Comment ça se passe, concrètement »                         │
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │   Étape 1  │  │   Étape 2  │  │   Étape 3  │  │   Étape 4  │     │
│  │            │  │            │  │            │  │            │     │
│  │  Rencontre │  │ Estimation │  │   Mise en  │  │Compromis & │     │
│  │   & visite │  │  & mandat  │  │ commercial.│  │   signature│     │
│  │            │  │            │  │            │  │            │     │
│  │  Délai :…  │  │  Délai :…  │  │  Délai :…  │  │  Délai :…  │     │
│  │            │  │            │  │            │  │            │     │
│  │  Ce que je │  │  Ce que je │  │  Ce que je │  │  Ce que je │     │
│  │  fais : …  │  │  fais : …  │  │  fais : …  │  │  fais : …  │     │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

- 4 étapes type : rencontre → estimation/mandat → commercialisation → signature.
- Chaque étape : titre, délai moyen indicatif, 2–3 lignes sur le rôle de l'agent.
- Pas d'icônes folkloriques au MVP (ambiance sobre).

##### Section 3 — Ce que j'apporte

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Ce que j'apporte à votre vente »                            │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ Connaissance     │  │ Estimation juste │  │ Suivi              │ │
│  │ du marché local  │  │ & transparente   │  │ personnalisé     │   │
│  │                  │  │                  │  │                  │   │
│  │ 2–3 lignes       │  │ 2–3 lignes       │  │ 2–3 lignes       │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ Visites          │  │ Négociation      │  │ Réseau local     │   │
│  │ qualifiées       │  │                  │  │ (notaire, diag.) │   │
│  │                  │  │                  │  │                  │   │
│  │ 2–3 lignes       │  │ 2–3 lignes       │  │ 2–3 lignes       │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

- 6 "promesses" concrètes (pas de corporate fluff type "passion, excellence, engagement").
- Chaque bloc : titre + 2–3 lignes descriptives.

##### Section 4 — Honoraires (transparence)

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Honoraires : tout est clair »                               │
│                                                                     │
│  Paragraphe court : principe d'honoraires au succès, pas d'avance,  │
│  barème public consultable en 1 clic.                               │
│                                                                     │
│  [ Consulter le barème complet ] → /honoraires                      │
└─────────────────────────────────────────────────────────────────────┘
```

- Bloc court, renvoi vers `/honoraires` (obligation Hoguet).
- Sert aussi la réassurance "pas de mauvaise surprise".

##### Section 5 — Questions fréquentes

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Questions fréquentes »                                      │
│                                                                     │
│  ▸ Quel est le bon moment pour vendre ?                             │
│  ▸ Dois-je choisir un mandat exclusif ?                             │
│  ▸ Combien coûte une estimation ?                                   │
│  ▸ Quels diagnostics sont obligatoires ?                            │
│  ▸ Combien de temps dure une vente ?                                │
│  ▸ Quels documents dois-je préparer ?                               │
│                                                                     │
│  (Accordéon déployable — réponses courtes 3–5 lignes chacune)       │
└─────────────────────────────────────────────────────────────────────┘
```

- 5 à 7 questions, réponses courtes.
- Intérêt **SEO fort** (featured snippets + JSON-LD `FAQPage` à prévoir techniquement).
- Accordéon côté UI. Toutes les réponses présentes dans le HTML (indexables même fermées).

##### Section 6 — CTA final

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   H2 — « Prêt à estimer votre bien ? »                              │
│                                                                     │
│   1 ligne : invitation, rappel gratuité + délai de retour.          │
│                                                                     │
│   [ Estimer mon bien ] (primaire)                                   │
│    → /estimation                                                    │
│                                                                     │
│   Ou contactez-moi directement :                                    │
│   📞 [Téléphone]    ✉ [Email]                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- CTA primaire `/estimation`.
- Contacts directs visibles en-dessous (alternative à ceux qui ne veulent pas remplir de formulaire).

#### Récap ordre des sections `/vendre`

1. Hero + CTAs
2. Les étapes de la vente (4 étapes)
3. Ce que j'apporte (6 promesses)
4. Honoraires (lien /honoraires)
5. FAQ
6. CTA final + contacts

---

### /estimation

#### Objectifs de la page

- Capter un lead qualifié en **minimisant l'abandon**.
- Donner à l'agent assez d'info pour préparer sa réponse (localisation, taille, état, intention, délai).
- **Pas d'estimation algorithmique** : le retour est humain, fait par l'agent.

#### Contraintes / décisions appliquées

- **Split léger en 2 étapes** (cf. §9 CDC).
- Progress bar visible (`1 / 2` → `2 / 2`).
- **Pas d'étape 0 type "estimation instantanée gratuite"** : on assume que l'utilisateur sait ce qu'il fait sur cette page.
- Mention RGPD obligatoire + case à cocher explicite.
- Confirmation post-envoi : page ou toast + message "je vous recontacte sous 24–48 h".

#### Wireframe

##### Section 1 — Hero court

```
┌─────────────────────────────────────────────────────────────────────┐
│  Breadcrumb : Accueil > Estimation                                  │
│                                                                     │
│  H1 — « Estimation gratuite de votre bien »                         │
│  Sous-titre — « Réponse personnalisée sous 24–48 h. Pas d'algo,     │
│  juste mon avis sur votre bien après analyse. »                     │
└─────────────────────────────────────────────────────────────────────┘
```

- Pas de visuel lourd, on va droit au formulaire.
- Promesse délai explicite dans le hero.

##### Section 2 — Formulaire étape 1 — Votre bien

```
┌─────────────────────────────────────────────────────────────────────┐
│  ●━━━━━━━━━━━━━━━━○     Étape 1 / 2 — Votre bien                    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Adresse du bien                                              │  │
│  │  [______________________________________________________]     │  │
│  │  (autocomplete adresse, ou champ libre au MVP)                │  │
│  │                                                               │  │
│  │  Type de bien *                                               │  │
│  │  ( ) Appartement   ( ) Maison   ( ) Terrain   ( ) Autre       │  │
│  │                                                               │  │
│  │  Surface habitable (m²) *         Nombre de pièces *          │  │
│  │  [__________]                      [  ▾ ]                     │  │
│  │                                                               │  │
│  │  Étage (si appartement)            Année de construction      │  │
│  │  [  ▾ ]                            [__________]               │  │
│  │                                                               │  │
│  │  Extérieur                                                    │  │
│  │  ☐ Balcon  ☐ Terrasse  ☐ Jardin  ☐ Aucun                      │  │
│  │                                                               │  │
│  │  État général *                                               │  │
│  │  ( ) Neuf / refait   ( ) Bon état                             │  │
│  │  ( ) À rafraîchir    ( ) À rénover                            │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│                              [ Suivant → ]                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Champs étape 1** :

| Champ | Type | Obligatoire | Notes |
|---|---|---|---|
| Adresse | texte (autocomplete phase 2) | Oui | Champ libre au MVP |
| Type | radio | Oui | Appartement / Maison / Terrain / Autre |
| Surface | number (m²) | Oui | Validation numérique |
| Pièces | select | Oui | 1 à 8+ |
| Étage | select | Non | Conditionnel si Appartement |
| Année construction | number | Non | |
| Extérieur | checkboxes | Non | Multi-sélection |
| État général | radio | Oui | 4 valeurs |

- Validation Zod côté formulaire.
- Le bouton `Suivant` est désactivé tant que les champs `*` ne sont pas remplis.

##### Section 3 — Formulaire étape 2 — Votre projet

```
┌─────────────────────────────────────────────────────────────────────┐
│  ●━━━━━━━━━━━━━━━━●     Étape 2 / 2 — Votre projet                  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Quelle est votre intention ? *                               │  │
│  │  ( ) Je veux vendre                                           │  │
│  │  ( ) Je veux mettre en location                               │  │
│  │  ( ) Je me renseigne, c'est juste une idée                    │  │
│  │                                                               │  │
│  │  Délai envisagé *                                             │  │
│  │  ( ) Moins de 3 mois                                          │  │
│  │  ( ) 3 à 6 mois                                               │  │
│  │  ( ) 6 à 12 mois                                              │  │
│  │  ( ) Plus tard / pas encore décidé                            │  │
│  │                                                               │  │
│  │  Prénom *                       Nom *                         │  │
│  │  [__________]                   [__________]                  │  │
│  │                                                               │  │
│  │  Téléphone *                    Email *                       │  │
│  │  [__________]                   [__________]                  │  │
│  │                                                               │  │
│  │  Message (optionnel)                                          │  │
│  │  [__________________________________________]                 │  │
│  │  [__________________________________________]                 │  │
│  │                                                               │  │
│  │  ☐ J'accepte la politique de confidentialité (RGPD) *         │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│           [ ← Retour ]              [ Envoyer ma demande ]          │
└─────────────────────────────────────────────────────────────────────┘
```

**Champs étape 2** :

| Champ | Type | Obligatoire | Notes |
|---|---|---|---|
| Intention | radio | Oui | Vendre / Louer / Juste une idée |
| Délai | radio | Oui | 4 valeurs |
| Prénom | texte | Oui | |
| Nom | texte | Oui | |
| Téléphone | tel | Oui | Validation format FR |
| Email | email | Oui | |
| Message | textarea | Non | 300 caractères max |
| RGPD | checkbox | Oui | Renvoie vers `/politique-de-confidentialite` |

- Bouton `Retour` préserve l'état de l'étape 1.
- Submit final → `POST /api/public/evaluation` (endpoint admin).

##### Section 4 — Confirmation

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                              ✓                                      │
│                                                                     │
│   H1 — « Votre demande a bien été envoyée »                         │
│                                                                     │
│   Je vous recontacte personnellement sous 24–48 h au numéro         │
│   que vous m'avez indiqué.                                          │
│                                                                     │
│   En attendant :                                                    │
│   [ Découvrir mon approche ] → /vendre                              │
│   [ Voir les biens à vendre ] → /acheter                            │
│                                                                     │
│   📞 Besoin de me joindre directement ? [Téléphone]                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- Soit page dédiée (`/estimation/confirmation`), soit remplacement du contenu de `/estimation` après soumission — tranchée côté technique.
- Pas de redirection vers la home : on occupe le moment post-conversion avec des parcours cohérents.
- Rappel du délai de retour.
- Alternative contact direct si l'utilisateur veut accélérer.

### Récap structure globale

- **`/vendre`** : 6 sections pédagogiques, pas de formulaire, CTA vers `/estimation`.
- **`/estimation`** : 1 hero + 2 étapes formulaire + 1 confirmation.

### Hors MVP (phase 2)

- Estimation algorithmique préliminaire (tunnel Hosman-like) — coût/valeur trop faible pour un solo au MVP.
- Autocomplete d'adresse via API gouvernementale ou Google Places.
- Upload de photos par le vendeur dans le formulaire.
- Relance automatique email si abandon en cours de formulaire.
- Signature électronique du mandat en ligne.

### Décalages assumés vs benchmarks

| Pattern benchmark | Notre choix | Raison |
|---|---|---|
| `/vendre` avec formulaire intégré (Fair&Square, L'Agencerie) | `/vendre` pédagogique pur, renvoi vers `/estimation` | Split assumé au CDC : surface SEO distincte + pédagogie vs transactionnel |
| Estimation mono-page (CDC initial) | **2 étapes** (split léger) | Réduction de l'abandon : info bien avant info perso |
| Estimation algorithmique avec prix instantané (Hosman-like) | Estimation humaine 24–48 h | Cohérence positionnement humain + scope solo |
| Upload photos dans le formulaire (certains réseaux) | Absent MVP | Friction trop élevée, valeur faible pour un lead initial |
| FAQ JSON-LD sur `/vendre` (rare chez les indés) | **Présente** | Gain SEO différenciant, coût de rédaction modéré |

---

## Notre agence

`/a-propos` — incarnation de la marque. Positionnement différenciant : **l'agent est la marque**, pas un réseau anonyme.

### Objectifs de la page

- Présenter la personne : parcours, approche, ancrage territorial.
- Rassurer sur la **légitimité professionnelle** (ancienneté, carte pro, garanties).
- Donner la **preuve sociale longue** : avis clients détaillés.
- Pousser vers la conversion sans transformer la page en tunnel commercial.

### Contraintes / décisions appliquées

- **Bio fluide** (texte long en 1re personne, plusieurs paragraphes), pas de fiche CV sectionnée.
- **Avis longs** (6–10 avis, plus détaillés que le bloc home). Source Google Business.
- Pas de fallback avis au MVP (cohérent avec la home) : si pas d'avis Google, la section est retirée.
- **Pas de bloc "équipe"** : c'est un solo, on n'invente pas une équipe.
- Rappel des mentions pro visibles ici en plus du footer (cohérent obligations Hoguet).

### Wireframe

#### Section 1 — Hero / Portrait

```
┌─────────────────────────────────────────────────────────────────────┐
│  Breadcrumb : Accueil > L'agence                                    │
│                                                                     │
│  ┌──────────────┐   H1 — « [Prénom NOM] — Votre agent immobilier    │
│  │              │              indépendant en [zone] »              │
│  │   PORTRAIT   │                                                   │
│  │     HD       │   Sous-titre — « Implanté à [commune] depuis X    │
│  │              │   ans. J'accompagne vendeurs, acheteurs et        │
│  │              │   locataires sur [communes]. »                    │
│  │              │                                                   │
│  │              │   📞 [Appeler]    ✉ [Email]                       │
│  └──────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

- Portrait pro HD (photo fournie par l'agent).
- H1 nominatif (SEO : nom de l'agent + zone).
- Contacts directs visibles dès le hero.

#### Section 2 — Bio fluide

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Mon parcours, mon approche » (ou formulation plus neutre)   │
│                                                                     │
│  Paragraphe 1 — parcours personnel / professionnel (2-4 lignes).    │
│                                                                     │
│  Paragraphe 2 — pourquoi l'immobilier, pourquoi indépendant.        │
│                                                                     │
│  Paragraphe 3 — approche du métier : accompagnement, transparence,  │
│  connaissance du terrain, relation long terme.                      │
│                                                                     │
│  Paragraphe 4 — ancrage territorial : pourquoi ces communes,        │
│  ce que je connais spécifiquement du secteur.                       │
│                                                                     │
│  Paragraphe 5 (optionnel) — touche personnelle : engagements        │
│  associatifs, hors boulot, ce qui fait qu'on se souvient de moi.    │
└─────────────────────────────────────────────────────────────────────┘
```

- **Texte libre en 1re personne**, rédigé par l'agent (ou avec son accord).
- 4 à 6 paragraphes. Pas de liste à puce, pas de sectionnement en cards — on veut un ton de lettre, pas de CV.
- **SEO fort** via occurrences naturelles (nom agent + zone + métier + années).
- Italique / gras possible côté design, ponctuel, pas pour découper en rubriques.

#### Section 3 — Chiffres clés

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « En quelques chiffres »                                      │
│                                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐       │
│  │    X     │    │    X     │    │    X     │    │    X     │       │
│  │  années  │    │ communes │    │  trans.  │    │  avis    │       │
│  │d'expérien│    │ couvertes│    │ réalisées│    │  Google  │       │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

- 4 stats max, lisibles en scan.
- Compact — pas d'animation de comptage fantaisiste au MVP.
- Variantes possibles selon ce que l'agent valide (ex. "taux de biens vendus en < 3 mois", "note moyenne").

#### Section 4 — Zone d'intervention

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Les communes où j'interviens »                              │
│  Sous-titre 1 ligne — géographie et spécificités du secteur         │
│                                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ Commune 1  │ │ Commune 2  │ │ Commune 3  │ │ Commune 4  │        │
│  │ → /acheter │ │ → /acheter │ │ → /acheter │ │ → /acheter │        │
│  │  ?commune= │ │  ?commune= │ │  ?commune= │ │  ?commune= │        │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │
│  │ Commune 5  │ │ Commune 6  │ │ Commune 7  │ │ Commune 8  │        │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │
│                                                                     │
│  2–3 lignes : commentaire sur la cohérence territoriale             │
│  (transports, profil des biens, typologies dominantes…).            │
└─────────────────────────────────────────────────────────────────────┘
```

- Réutilisation visuelle du bloc "Secteurs" de la home, mais avec **commentaire territorial** en plus (différenciation de l'expert local vs un listing plat).
- Chaque commune → `/acheter?commune=X` au MVP. Bascule vers `/secteur/[commune]` en phase 2.

#### Section 5 — Avis clients (version longue)

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Ce que disent mes clients »                                 │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  ★ 4,9 / 5                         Basé sur X avis Google  │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                     │
│  ┌────────────────────────────┐  ┌────────────────────────────┐     │
│  │ ★★★★★                      │  │ ★★★★★                      │     │
│  │ « Extrait d'avis complet,  │  │ « Extrait d'avis complet,  │     │
│  │   4–6 lignes, sans         │  │   4–6 lignes, sans         │     │
│  │   troncature. »            │  │   troncature. »            │     │
│  │                            │  │                            │     │
│  │ — Prénom L., Boulogne      │  │ — Prénom D., Neuilly       │     │
│  │ Vendu en mars 2026         │  │ Acheté en janvier 2026     │     │
│  └────────────────────────────┘  └────────────────────────────┘     │
│                                                                     │
│  ┌────────────────────────────┐  ┌────────────────────────────┐     │
│  │ ★★★★★                      │  │ ★★★★★                      │     │
│  │ « Extrait… »               │  │ « Extrait… »               │     │
│  │ — Prénom M., Vincennes     │  │ — Prénom R., Saint-Maur    │     │
│  │ Loué en février 2026       │  │ Vendu en novembre 2025     │     │
│  └────────────────────────────┘  └────────────────────────────┘     │
│                                                                     │
│  ┌────────────────────────────┐  ┌────────────────────────────┐     │
│  │ ★★★★★                      │  │ ★★★★★                      │     │
│  │ « Extrait… »               │  │ « Extrait… »               │     │
│  │ — Prénom P., Boulogne      │  │ — Prénom S., Issy          │     │
│  │ Acheté en octobre 2025     │  │ Vendu en septembre 2025    │     │
│  └────────────────────────────┘  └────────────────────────────┘     │
│                                                                     │
│  [ Voir tous les avis sur Google ] → fiche GBP (nouvel onglet)      │
│                                                                     │
│  (section entière masquée si < 6 avis Google)                       │
└─────────────────────────────────────────────────────────────────────┘
```

- **6 avis** affichés d'un coup (min 6, max 10 selon volume GBP). Pas de pagination / "voir plus" — on montre tout ce qu'on a.
- **Contenu par avis** : étoiles, extrait non tronqué, prénom + initiale, commune (si déduite), type de transaction + date (si structurable côté data).
- **En-tête** : note agrégée + nombre total d'avis.
- **CTA bas** : renvoi vers la fiche Google Business complète.
- Source : Google Business Profile. Si < 6 avis ou GBP indisponible → bloc retiré (pas de fallback, cohérent avec la home).

#### Section 6 — Engagement pro & garanties

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Mon engagement professionnel »                              │
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐   │
│  │  Carte professionnelle T    │  │  Garant financier           │   │
│  │  n° …                       │  │  [Nom] — [Adresse]          │   │
│  │  Délivrée par la CCI de …   │  │                             │   │
│  └─────────────────────────────┘  └─────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐   │
│  │  Médiateur consommation     │  │  Forme juridique            │   │
│  │  [Nom du médiateur]         │  │  [SIRET / RCS]              │   │
│  └─────────────────────────────┘  └─────────────────────────────┘   │
│                                                                     │
│  → [ Mentions légales complètes ] → /mentions-legales               │
│  → [ Barème honoraires ] → /honoraires                              │
└─────────────────────────────────────────────────────────────────────┘
```

- Rappel visuel des garanties pro (loi Hoguet). Présent aussi en footer global, mais dédoublé ici car c'est **le** lieu de la confiance.
- Liens vers les pages `/mentions-legales` et `/honoraires`.

#### Section 7 — CTA final

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   H2 — « Parlons de votre projet »                                  │
│                                                                     │
│   1–2 lignes — invitation à entrer en contact.                      │
│                                                                     │
│   [ Estimer mon bien ] (primaire)   [ Me contacter ] (secondaire)   │
│     → /estimation                     → /contact                    │
│                                                                     │
│   📞 Ou directement : [Téléphone]                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- Deux entrées : vendeur (`/estimation`) et générique (`/contact`).
- Téléphone cliquable toujours disponible.

### Récap ordre des sections

1. Hero / Portrait (H1 + bio courte + contacts)
2. Bio fluide (4–6 paragraphes 1re personne)
3. Chiffres clés (4 stats)
4. Zone d'intervention (communes + commentaire territorial)
5. Avis clients (version longue, 6–10)
6. Engagement pro & garanties
7. CTA final

### Hors MVP (phase 2)

- Vidéo de présentation de l'agent.
- Timeline parcours (interactive).
- Articles de l'agent mis en avant (cohérent avec blog phase 2).
- Filtrage des avis par type de transaction (vendu / acheté / loué).
- Widget live Google (avec rafraîchissement auto).

### Décalages assumés vs benchmarks

| Pattern benchmark | Notre choix | Raison |
|---|---|---|
| Bio structurée en sous-sections (Junot, Fair&Square) | **Bio fluide** 1re personne | Positionnement "la personne est la marque", ton proche, pas corporate |
| Page dédiée "Avis clients" (Fair&Square, Centrimmo, Donzacq) | Bloc long intégré à `/a-propos` | Pas de volume suffisant pour justifier une page séparée ; économie de maillage |
| Widget Google live (Gounod) | Rendu serveur des avis (Server Component + cache) | SEO prioritaire, pas de JS lourd |
| Certif Opinion System (Consultants, Mansart) | Google Business Profile | Gratuit + déjà largement crédible |
| Bloc "équipe" avec plusieurs portraits (Junot, Consultants) | Absent (solo) | On n'invente pas une équipe fictive |
| Timeline interactive, vidéo, animation (Junot) | Absent MVP | Ambiance sobre, coût/valeur faible pour un solo |

---

## Contact

`/contact` — page transactionnelle simple. Objectif : rendre **chaque mode de contact immédiatement accessible** et trier les demandes en amont pour réduire le tri manuel de l'agent.

### Objectifs de la page

- Afficher en clair tous les moyens de joindre l'agent (téléphone, email, adresse, horaires).
- Proposer un **formulaire typé** (sélecteur de sujet) pour pré-qualifier les messages entrants.
- Permettre un accès physique à l'agence (carte, transports).

### Contraintes / décisions appliquées

- **Formulaire typé** avec sélecteur de sujet — différenciateur pour un solo (gain de temps de tri).
- **WhatsApp** proposé en contact alternatif (pattern Donzacq — efficace pour les locataires).
- Carte interactive au MVP = statique + lien Google Maps (pas de tile dynamique — pas de valeur incrémentale ici).
- Mention RGPD obligatoire sous le formulaire.

### Wireframe

#### Section 1 — Hero / Coordonnées visibles immédiatement

```
┌─────────────────────────────────────────────────────────────────────┐
│  Breadcrumb : Accueil > Contact                                     │
│                                                                     │
│  H1 — « Me contacter »                                              │
│  Sous-titre — « Disponible par téléphone, email, ou directement     │
│  à l'agence. Réponse sous 24 h en semaine. »                        │
│                                                                     │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│  │  📞 Téléphone │  │  ✉ Email      │  │ 📱 WhatsApp   │            │
│  │  XX XX XX XX  │  │  [cliquable]  │  │  [cliquable]  │            │
│  │  [tel:]       │  │               │  │               │            │
│  └───────────────┘  └───────────────┘  └───────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

- 3 moyens directs en tête de page (tel, email, WhatsApp).
- Tous cliquables (`tel:`, `mailto:`, `https://wa.me/...`).
- Délai de réponse annoncé (24 h ouvrées).

#### Section 2 — Formulaire typé

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « M'envoyer un message »                                      │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Sujet de votre demande *                                     │  │
│  │  ( ) Information sur un bien en vente                         │  │
│  │  ( ) Information sur un bien en location                      │  │
│  │  ( ) Estimation de mon bien                                   │  │
│  │  ( ) Prendre rendez-vous                                      │  │
│  │  ( ) Partenariat / autre                                      │  │
│  │                                                               │  │
│  │  Référence du bien (si applicable)                            │  │
│  │  [__________]                                                 │  │
│  │                                                               │  │
│  │  Prénom *                       Nom *                         │  │
│  │  [__________]                   [__________]                  │  │
│  │                                                               │  │
│  │  Téléphone *                    Email *                       │  │
│  │  [__________]                   [__________]                  │  │
│  │                                                               │  │
│  │  Votre message *                                              │  │
│  │  [______________________________________________]             │  │
│  │  [______________________________________________]             │  │
│  │  [______________________________________________]             │  │
│  │                                                               │  │
│  │  ☐ J'accepte la politique de confidentialité (RGPD) *         │  │
│  │                                                               │  │
│  │                             [ Envoyer ]                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Champs** :

| Champ | Type | Obligatoire | Notes |
|---|---|---|---|
| Sujet | radio | Oui | 5 valeurs (bien vente, bien location, estimation, RDV, autre) |
| Référence bien | texte | Non | Visible seulement si sujet = info bien |
| Prénom, Nom | texte | Oui | |
| Téléphone | tel | Oui | Validation format FR |
| Email | email | Oui | |
| Message | textarea | Oui | 500 caractères max |
| RGPD | checkbox | Oui | Renvoie vers `/politique-de-confidentialite` |

- **Sujet en premier** : conditionne implicitement la qualification côté agent (un tri par sujet permet de rediriger les estimations vers le formulaire dédié s'il n'a pas encore été rempli).
- **Référence du bien** : champ conditionnel affiché uniquement si le sujet le justifie.
- Confirmation post-envoi (toast ou bandeau) : "Message reçu. Je vous réponds sous 24 h."

#### Section 3 — Venir à l'agence

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Venir à l'agence »                                          │
│                                                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐     │
│  │                          │  │  Adresse                     │     │
│  │                          │  │  [Nom agence]                │     │
│  │                          │  │  [Rue]                       │     │
│  │        CARTE             │  │  [CP Ville]                  │     │
│  │      (statique ou        │  │                              │     │
│  │       simple embed)      │  │  Horaires                    │     │
│  │                          │  │  Lun–Ven : 9h–19h            │     │
│  │                          │  │  Sam : 10h–13h (sur RDV)     │     │
│  │                          │  │                              │     │
│  │  [ Ouvrir dans Maps ]    │  │  Transports                  │     │
│  │                          │  │  🚇 [Métro] — ligne X        │     │
│  └──────────────────────────┘  │  🚌 [Bus] — lignes X, Y      │     │
│                                │  🅿 Parking rue accessible   │     │
│                                └──────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

- **Carte** : tile statique au MVP (image générée depuis Mapbox Static API ou équivalent) + CTA `Ouvrir dans Google Maps`. Pas de carte dynamique à ce niveau (valeur incrémentale faible).
- **Colonne droite** : adresse, horaires explicites (mention "sur RDV" si applicable), transports (métro, bus, parking).

#### Section 4 — Réseaux sociaux

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Me suivre »                                                 │
│                                                                     │
│  [ Instagram ]   [ LinkedIn ]   [ Google Business ]                 │
└─────────────────────────────────────────────────────────────────────┘
```

- Bloc sobre, 1 ligne.
- Google Business en 3e icône pour pousser les avis (cohérent avec positionnement).

### Récap ordre des sections

1. Hero + 3 moyens directs (tel, email, WhatsApp)
2. Formulaire typé
3. Venir à l'agence (carte + adresse + horaires + transports)
4. Réseaux sociaux

### Hors MVP (phase 2)

- Prise de rendez-vous en ligne (Calendly-like).
- Carte interactive (swap tile statique → tile dynamique).
- Chat live.
- Bouton "Appeler rappel" (callback asynchrone).

### Décalages assumés vs benchmarks

| Pattern benchmark | Notre choix | Raison |
|---|---|---|
| Formulaire générique sans sujet (majorité) | **Sélecteur de sujet** (pattern L'Agencerie) | Gain de tri pour un solo |
| Pas de WhatsApp (majorité) | **WhatsApp présent** (pattern Donzacq) | Canal efficace pour locataires et urgences douces |
| Carte Google Maps embed live | Tile statique + lien Maps | SEO + perf + pas de JS lourd, zéro perte fonctionnelle |
| Pas d'horaires explicites (Christine Mongin) | **Horaires explicites** (pattern Mansart, Donzacq) | Réduit la friction "puis-je venir maintenant ?" |

---

## Honoraires

`/honoraires` — page réglementaire pure. Obligation loi Hoguet + arrêté du 10 janvier 2017 : affichage des honoraires sur le site et **sur chaque support commercial** (fiche bien incluse).

### Objectifs de la page

- Afficher le barème complet **vente + location + gestion** (si service proposé).
- Permettre à un visiteur (ou un contrôle) de consulter le barème en ≤ 2 clics depuis n'importe quelle page (lien permanent en footer).
- Respecter strictement l'arrêté 2017 (TTC, qui paie, date d'effet).

### Contraintes / décisions appliquées

- Contenu rédactionnel **fourni par l'agent** (barèmes + date d'effet). Non négociable côté web.
- Contenu purement tabulaire. Pas de storytelling, pas de copy commerciale.
- **TTC obligatoire** dans toutes les tables.
- Indication **qui paie** obligatoire (charge acquéreur / vendeur / locataire / bailleur).
- Lien permanent depuis chaque fiche bien (déjà câblé dans le wireframe `/bien/[reference]`).

### Wireframe

#### Section 1 — En-tête

```
┌─────────────────────────────────────────────────────────────────────┐
│  Breadcrumb : Accueil > Honoraires                                  │
│                                                                     │
│  H1 — « Barème d'honoraires »                                       │
│  Sous-titre — « Barème applicable depuis le [date]. Tous nos        │
│  honoraires sont indiqués TTC (TVA à 20 % incluse). »               │
└─────────────────────────────────────────────────────────────────────┘
```

- Date d'effet explicite (obligatoire).
- Mention TTC explicite en sous-titre.

#### Section 2 — Honoraires de transaction (vente)

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Vente »                                                     │
│  Charge : [acquéreur / vendeur] — à indiquer par l'agent            │
│                                                                     │
│  ┌──────────────────────────────────┬─────────────────────────────┐ │
│  │  Tranche de prix (FAI*)          │  Honoraires TTC             │ │
│  ├──────────────────────────────────┼─────────────────────────────┤ │
│  │  Jusqu'à 100 000 €               │  Forfait 5 000 € TTC (ex.)  │ │
│  │  De 100 000 à 300 000 €          │  5 % TTC                    │ │
│  │  De 300 000 à 500 000 €          │  4 % TTC                    │ │
│  │  De 500 000 à 1 000 000 €        │  3 % TTC                    │ │
│  │  Au-delà de 1 000 000 €          │  2 % TTC                    │ │
│  └──────────────────────────────────┴─────────────────────────────┘ │
│                                                                     │
│  * FAI = Frais d'Agence Inclus (prix net vendeur + honoraires)      │
│                                                                     │
│  Note : en cas de mandat exclusif, le barème peut être ajusté.      │
│  Contactez-moi pour un devis personnalisé.                          │
└─────────────────────────────────────────────────────────────────────┘
```

- Données exactes à fournir par l'agent.
- Bloc "note" pour la mention mandat exclusif si l'agent applique une modulation.

#### Section 3 — Honoraires de location

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Location (longue durée) »                                   │
│                                                                     │
│  Honoraires à la charge du **bailleur** (honoraires de négociation) │
│  ─ Mandat de recherche de locataire : [montant ou %]                │
│                                                                     │
│  Honoraires partagés avec le **locataire** (selon loi ALUR) :       │
│                                                                     │
│  ┌──────────────────────────────────┬─────────────────────────────┐ │
│  │  Prestation                      │  Plafond TTC / m²           │ │
│  ├──────────────────────────────────┼─────────────────────────────┤ │
│  │  Visite, dossier, bail           │  Zone tendue : 10 €/m²      │ │
│  │                                  │  Zone très tendue : 12 €/m² │ │
│  │                                  │  Hors zone tendue : 8 €/m²  │ │
│  │  État des lieux d'entrée         │  3 €/m² (partagé)           │ │
│  └──────────────────────────────────┴─────────────────────────────┘ │
│                                                                     │
│  Dépôt de garantie : 1 mois de loyer (non meublé) / 2 mois (meublé) │
│                                                                     │
│  Les honoraires à la charge du locataire ne peuvent pas dépasser    │
│  ceux à la charge du bailleur (loi ALUR).                           │
└─────────────────────────────────────────────────────────────────────┘
```

- Plafonds légaux zone tendue rappelés (cadre arrêté 2014 loi ALUR).
- Plafonds réels appliqués par l'agent à confirmer.
- Mention loi ALUR obligatoire (honoraires locataire ≤ honoraires bailleur).

#### Section 4 — Honoraires de gestion *(conditionnel)*

```
┌─────────────────────────────────────────────────────────────────────┐
│  H2 — « Gestion locative »                                          │
│                                                                     │
│  (section affichée uniquement si l'agent propose la gestion —       │
│   décision CDC : hors scope MVP, donc section absente par défaut)   │
│                                                                     │
│  ┌──────────────────────────────────┬─────────────────────────────┐ │
│  │  Prestation                      │  Tarif TTC                  │ │
│  ├──────────────────────────────────┼─────────────────────────────┤ │
│  │  Gestion courante                │  X % des loyers encaissés   │ │
│  │  Mise en location                │  X € ou X mois de loyer     │ │
│  │  Garantie loyers impayés (opt.)  │  X % des loyers             │ │
│  └──────────────────────────────────┴─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

- **Absente du MVP** (gestion locative hors scope).
- À réactiver si l'agent développe le service (phase 2).

#### Section 5 — Mentions légales / médiation

```
┌─────────────────────────────────────────────────────────────────────┐
│  Cabinet Rimbault · Carte professionnelle T n°… · CCI de …          │
│  Garant financier : [Nom + adresse]                                 │
│                                                                     │
│  En cas de litige relatif à une transaction, après une réclamation  │
│  écrite restée sans réponse satisfaisante, le client consommateur   │
│  peut saisir le médiateur de la consommation :                      │
│  [Nom du médiateur] — [Adresse / site web]                          │
│                                                                     │
│  → [ Mentions légales complètes ] → /mentions-legales               │
└─────────────────────────────────────────────────────────────────────┘
```

- Rappel carte T + garant + **médiateur consommation** (Code de la consommation, 2016).
- Lien vers `/mentions-legales` pour le détail.

### Récap ordre des sections

1. En-tête (H1 + date d'effet + mention TTC)
2. Vente (table barème + note mandat exclusif)
3. Location (table plafonds + dépôt + loi ALUR)
4. Gestion locative *(hors MVP)*
5. Mentions légales + médiateur

### Hors MVP (phase 2)

- PDF téléchargeable du barème (pattern Junot, Fair&Square).
- Section gestion locative (si l'agent développe le service).
- Simulateur interactif d'honoraires vente (saisie d'un prix → calcul instantané).

### Décalages assumés vs benchmarks

| Pattern benchmark | Notre choix | Raison |
|---|---|---|
| PDF téléchargeable du barème (Junot, Fair&Square) | Page web uniquement au MVP | Version web déjà conforme ; PDF ajouté plus tard si besoin |
| Simulateur calcul honoraires (aucun benchmark ne le fait bien) | Absent MVP | Coût/valeur faible, complexité réglementaire (tranches, exclusif, forfait min) |
| Bloc gestion (10/12 benchmarks l'ont) | **Absent** | Cohérent avec décision CDC "pas de gestion MVP" |
| Rappel médiateur uniquement sur `/mentions-legales` (courant) | **Rappel aussi sur `/honoraires`** | Obligation Code conso, et pertinent au moment où le client consulte les tarifs |

---

## 404

Page d'erreur servie par Next.js quand une URL ne correspond à aucune route (y compris `/bien/[reference]` introuvable ou retiré).

### Objectifs de la page

- Ne pas laisser le visiteur sur une impasse.
- Proposer des portes de sortie vers les parcours principaux (acheter, louer, contact).
- Préserver le ton humain (pas de message technique sec).

### Contraintes / décisions appliquées

- **Server Component** rendant un statut HTTP `404` correct (important SEO).
- Réutilise le layout global (Header, Footer, MobileBottomBar) — pas de page nue.
- Pas d'illustration custom ou d'image lourde au MVP (ambiance sobre, design ultérieur).

### Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   H1 — « Cette page n'existe pas (ou plus) »                        │
│                                                                     │
│   Sous-titre — « Le bien que vous cherchiez a peut-être été vendu   │
│   ou loué. Voici quelques pistes pour continuer votre recherche. »  │
│                                                                     │
│   ┌───────────────────────────────────────────────────────────┐     │
│   │                                                           │     │
│   │  🔎  Moteur de recherche compact                          │     │
│   │       [ Acheter | Louer ]  [ Commune ▾ ]  [ 🔍 ]          │     │
│   │                                                           │     │
│   └───────────────────────────────────────────────────────────┘     │
│                                                                     │
│   Ou accédez directement :                                          │
│                                                                     │
│   [ Voir les biens à vendre ]   → /acheter                          │
│   [ Voir les biens à louer ]    → /louer                            │
│   [ Estimer mon bien ]          → /estimation                       │
│   [ Me contacter ]              → /contact                          │
│                                                                     │
│   📞 Besoin d'aide ? [Téléphone cliquable]                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

- **H1** explicite, ton humain. Mention "ou plus" anticipe le cas du bien retiré (usage majoritaire d'un 404 sur ce site).
- **Moteur de recherche compact** (2 champs) pour rebondir immédiatement.
- **4 CTAs** vers les parcours principaux.
- **Téléphone** accessible en bas pour les cas où le visiteur ne veut pas re-chercher.

### Hors MVP (phase 2)

- Suggestions de biens similaires si l'URL correspondait à un bien vendu/loué récemment (fallback intelligent sur la référence).
- Illustration custom (cohérente avec le design system finalisé).

