# Cahier des charges — Site vitrine Cabinet Rimbault

> Document produit de référence. À lire avant toute tâche produit / UX / contenu.
> Mis à jour au fil des décisions validées avec le product owner.

---

## 1. Contexte & positionnement

**Client** : agent immobilier **indépendant** (un seul agent, pas un réseau, pas une franchise), opérant comme **agence de quartier** en Île-de-France sur **plusieurs communes limitrophes**.

**Objectif** : moderniser tranquillement la présence en ligne d'un agent solo établi. Ce n'est **pas** un site de réseau (type iad/SAFTI), **pas** un site luxe (type Barnes/Féau), **pas** un site pure-player digital (type Hosman/Welmo).

**Différenciateur clé** : la personne. L'agent **est** la marque. Proximité, humain, territorialité, suivi personnalisé. Ton : propre, humain, professionnel, sans corporate.

**Benchmarks d'inspiration** : Junot (indépendant premium), Consultants Immobilier (ton humain), Welmo/Hosman (UX tunnel estimation, pas le ton).

**Benchmarks à éviter** : templates Swixim/Capifrance génériques.

## 2. Architecture existante

Le projet s'insère dans un écosystème déjà en place :

- **Back-office** : `cabinet-rimbault-admin` (Next.js 15 full-stack, PostgreSQL via Prisma, NextAuth). Déjà déployé.
- **API publique consommée** : `GET /api/public/properties/{sale,rent,recent}`, `GET /api/public/properties/[reference]`, `GET /api/public/properties` (recherche avancée), `POST /api/public/evaluation`.
- **Auth API** : header `X-API-Key` (env `PUBLIC_API_KEY`, jamais préfixée `NEXT_PUBLIC_`).
- **Réponse** : `{ success, count, total, data, filters }`.

**Ce projet** : `cabinet-rimbault-vitrine` — site public qui consomme cette API.

## 3. Stack

- Next.js 16 App Router, TypeScript, React 19
- Tailwind CSS v4 vanilla (pas de lib UI à l'init — design system en fin de projet)
- TanStack Query v5 (installé, Provider monté, mais usage différé aux pages client-side uniquement)
- Zod + react-hook-form (formulaires)
- lucide-react (icônes)
- next/image

**Stratégie de consommation API : SEO-first, hybride.**

- **Server Components par défaut** sur toutes les pages et pour tous les fetchs vers l'admin.
- Fonctions typées dans `src/lib/api/` appelables directement depuis les Server Components.
- **TanStack Query** uniquement quand une interactivité client sans reload est indispensable (auto-complétion, carte, pagination infinie).
- **Filtres de recherche** passent par `searchParams` URL + navigation serveur (SEO + URLs partageables).
- **Route Handler proxy** (`/app/api/...`) créé **à la demande**, pas à l'init.

## 4. Scope transactionnel (MVP)

| Périmètre | Inclus MVP |
|---|---|
| Vente | ✅ |
| Location longue durée | ✅ |
| Gestion locative (service bailleur) | ❌ (phase 2 si l'agent développe le service) |
| Location saisonnière | ❌ |
| Viager | ❌ (supportée par l'API, réintroduite si besoin) |

## 5. Sitemap v1 (MVP verrouillé)

```
/                           Home
/acheter                    Hub vente + recherche (filtres via URL)
/louer                      Hub location + recherche (filtres via URL)
/bien/[reference]           Fiche bien (vente ou location selon data)
/estimation                 Formulaire lead estimation
/vendre                     Landing vendeur (méthode, accompagnement)
/honoraires                 Barème (obligatoire loi Hoguet)
/a-propos                   Bio agent, carte T/G, avis Google
/contact                    Coordonnées + formulaire
/mentions-legales           Légal
/politique-de-confidentialite
/cookies
```

**11 pages statiques + 1 template dynamique (`/bien/[reference]`)**.

**Phase 2** : `/secteur/[commune]` (pages SEO hyperlocales), `/conseils` (blog), favoris, alertes mail, intégration avis plateforme payante.

**Décisions verrouillées** :
- `/vendre` et `/estimation` **séparées** (surface SEO, pédagogie vs formulaire).
- Pas de newsletter au MVP.
- Pas de bilingue (français uniquement).

## 6. Navigation globale

### Header (sticky desktop)

```
[Logo]  Acheter  Louer  Vendre  Secteurs▾  L'agence       ☎ [Estimer mon bien]
```

- **Logo** → `/`.
- **Items nav (5 max, pas de mega menu)** :
  - `Acheter` → `/acheter`
  - `Louer` → `/louer`
  - `Vendre` → `/vendre`
  - `Secteurs` → dropdown desktop listant les communes couvertes. Au MVP, chaque item renvoie vers `/acheter?commune=X` (listing filtré). Le renvoi vers `/secteur/[commune]` reprendra en phase 2, quand ces pages seront livrées.
  - `L'agence` → `/a-propos`
- **Zone droite** :
  - Téléphone cliquable (`tel:`) — desktop uniquement
  - CTA primaire : **Estimer mon bien** → `/estimation`
- **Sticky au scroll** : oui.
- **Breadcrumb** additionnel sur `/bien/[reference]` : `Accueil > Acheter > [Ville] > [Type]`.

### Mobile (≤ 768px)

- Top bar : logo + icône ☎ + hamburger ☰.
- Hamburger → drawer plein écran avec les 5 items + CTA Estimer + Contact.
- **Sticky bottom bar présente sur toutes les pages** :
  ```
  [📞 Appeler]  [✏️ Estimer]
  ```

### Footer (4 colonnes + bandeau réglementaire)

| Colonne | Contenu |
|---|---|
| **Agence** | Nom/Prénom, adresse, téléphone, email, horaires, Instagram, LinkedIn |
| **Services** | Acheter, Louer, Vendre, Estimation |
| **L'agence** | À propos, Secteurs (liste communes), Avis clients, Contact |
| **Légal** | Mentions légales, Politique de confidentialité, Cookies, Honoraires |

**Bandeau réglementaire (toutes les pages, sous les colonnes)** :
- Carte professionnelle T n°... — CCI de ...
- Carte G n°... si gestion
- RCS / SIRET / forme juridique
- Garant financier (nom + adresse)
- Médiateur consommation désigné

## 7. Obligations légales (rappel — non négociable)

Applicable à chaque page (pas uniquement `/mentions-legales`) :

| Mention | Fondement |
|---|---|
| N° carte pro T (transaction) et/ou G (gestion) | Loi Hoguet |
| CCI émettrice de la carte | Loi Hoguet |
| Garant financier (si manipulation de fonds) | Loi Hoguet |
| Médiateur consommation | Code de la consommation (2016) |
| RCS / SIRET / forme juridique | Code de commerce |
| Affichage honoraires | Arrêté 10 janvier 2017 |
| DPE/GES visibles sur chaque fiche bien | Loi Climat & Résilience |
| Mentions RGPD sur tous les formulaires | RGPD |

Pour les locations classées F ou G : indication claire des restrictions (loi Climat).

## 8. Parcours utilisateurs

### Parcours vendeur (lead à marge la plus élevée)
Home → `/vendre` (pédagogie) → `/estimation` (formulaire) → lead à l'agent.
CTA primaire du header pousse ce parcours.

### Parcours acheteur
Home → `/acheter` (hub + filtres URL) → `/bien/[ref]` (fiche SEO) → contact / téléphone.

### Parcours locataire
Home → `/louer` (hub + filtres URL) → `/bien/[ref]` → contact.

### Parcours découverte / confiance
Home → `/a-propos` (bio + avis Google) → `/contact`.

## 9. Estimation & capture de leads

**Forme retenue** : formulaire lead **split léger en 2 étapes** (pas d'estimation algorithmique).

- **Étape 1 — Votre bien** : adresse, type, surface, pièces, étage (conditionnel appartement), année de construction, extérieur, état général.
- **Étape 2 — Votre projet** : intention (vendre / louer / juste une idée), délai, prénom, nom, téléphone, email, message optionnel.
- Progress bar `1 / 2` → `2 / 2`, bouton `Retour` qui préserve l'état de l'étape 1.
- Confirmation utilisateur (page ou écran de remplacement) + notification agent (email/Slack — à définir côté technique).
- Mention RGPD explicite + case à cocher obligatoire.
- Détail exhaustif des champs et du wireframe dans `docs/wireframes.md`.

## 10. Avis clients

**Source retenue** : intégration Google Business Profile.

- Préreq : GBP actif avec ≥ 5 avis publiés. **À confirmer avec l'agent**.
- Option d'intégration : widget officiel ou pull via API Google Places (mini-coût).
- Affichage sur `/a-propos` et, en version résumée, sur la home.

## 11. SEO

- **Priorité absolue** : chaque fiche bien est une landing page indexable.
  - `metadata` dynamique (titre, description, OG).
  - JSON-LD `RealEstateListing` / `Residence` sur fiche bien.
  - JSON-LD `RealEstateAgent` + `Place` sur `/a-propos` et home.
- **Listes vente/location** : indexables, URLs partageables via `searchParams`.
- **Pages secteur** (phase 1.5) : pierre angulaire du SEO local, une URL propre par commune.
- **Sitemap dynamique** : généré à partir des biens publiés.
- **robots.txt** : tout ouvert sauf `/admin` (inexistant côté vitrine mais par sécurité).

## 12. Infos bloquantes à collecter auprès de l'agent

Sans ces données, le footer, les pages légales et certaines fonctionnalités ne peuvent pas être livrés :

- [ ] Nom / prénom / raison sociale exacte
- [ ] Forme juridique (EI, EURL, SARL…)
- [ ] N° carte professionnelle **T** (transaction) + **G** (si gestion) + CCI émettrice
- [ ] RCS + ville d'immatriculation + SIRET
- [ ] Adresse professionnelle complète
- [ ] Téléphone pro, email pro, horaires d'ouverture
- [ ] Garant financier : nom + adresse (QBE, Galian, MMA…)
- [ ] Médiateur consommation désigné (MCP, Medimmoconso…)
- [ ] **Liste complète des communes couvertes** (pour dropdown Secteurs + pages SEO)
- [ ] Handles Instagram / LinkedIn pro
- [ ] Logo HD (si existant)
- [ ] Portrait pro HD
- [ ] Confirmation existence + activité du Google Business Profile (nombre d'avis)
- [ ] Barème d'honoraires (vente + location)

## 13. Phases

| Phase | Contenu |
|---|---|
| **MVP (phase 1)** | Sitemap v1, nav complète, API client, 11 pages statiques + fiche bien, estimation lead, SEO de base |
| **Phase 1.5** | Sitemap XML dynamique, JSON-LD complet (`RealEstateListing`, `RealEstateAgent`, `FAQPage`) |
| **Phase 2** | Pages `/secteur/[commune]`, blog/conseils, favoris, alertes mail, gestion locative, newsletter, analytics avancé |

## 14. Hors scope

- Espace client / compte utilisateur
- Visite virtuelle 360°
- Chatbot
- Paiement en ligne (acompte, réservation)
- i18n (français uniquement)
- Application mobile
- Intégration flux portails (SeLoger, LeBonCoin) — si utilisé, c'est côté admin

## 15. Décisions verrouillées — journal

| Date | Décision | Raison |
|---|---|---|
| 2026-04-16 | Projet séparé de l'admin | Cycles déploiement distincts, pas de code partagé |
| 2026-04-16 | Stack Next.js + Tailwind + TanStack Query | SEO + flexibilité |
| 2026-04-16 | Server Components par défaut | SEO prioritaire |
| 2026-04-16 | Pas de shadcn/ui à l'init | Theming à la fin |
| 2026-04-16 | Vente + location au MVP | Les deux flux prioritaires |
| 2026-04-16 | Estimation = formulaire lead simple | Coût/valeur pour un solo |
| 2026-04-16 | Avis via Google Business | Gratuit + crédible |
| 2026-04-16 | Plusieurs communes limitrophes | Pages secteur nécessaires en phase 1.5 |
| 2026-04-16 | `/vendre` et `/estimation` séparées | Surface SEO + pédagogie distincte |
| 2026-04-16 | CTA header = "Estimer mon bien" | Push parcours vendeur |
| 2026-04-16 | Sticky bottom bar mobile sur toutes pages | Conversion mobile |
| 2026-04-16 | Dropdown Secteurs dans le header | SEO + liens internes |
| 2026-04-21 | Migration Next.js 16 (depuis 15) | Alignement sur la dernière stable, breaking changes pris en compte via `AGENTS.md` |
| 2026-04-21 | Biome remplace ESLint + Prettier, pre-commit via Husky | Outillage unifié, plus rapide, hygiène minimale avant push |
| 2026-04-21 | `/estimation` passe d'un formulaire mono-page à un **split léger 2 étapes** (Votre bien / Votre projet) | Réduction de l'abandon : commencer par l'info du bien (facile) avant l'info personnelle (frictionnelle) |
| 2026-04-21 | Pages `/secteur/[commune]` reportées de phase 1.5 à **phase 2** | Coût rédactionnel élevé + risque de thin content si pas de volume par commune ; 8/12 benchmarks solos ne le font pas. Le dropdown header "Secteurs" reste au MVP mais renvoie vers `/acheter?commune=X` au lieu des pages dédiées |
