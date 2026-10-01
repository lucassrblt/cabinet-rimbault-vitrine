# Brief — site Cabinet Rimbault

> Statut : **validé** (cadrage du 2026-10-01). Remplace tout cadrage antérieur.

## 1. Le projet

Site vitrine d'une agence immobilière indépendante tenue par un agent seul, installée depuis 2009 au 117 boulevard Voltaire à Asnières-sur-Seine (92). Activité : vente (80-90 %) et location longue durée, tous types de biens, Asnières et communes / arrondissements proches.

Aujourd'hui : aucune présence web hors SeLoger et la fiche Google (4,9/5, 32 avis). Les biens arrivent par le bouche-à-oreille et la vitrine sur rue.

**Le site prolonge l'agence de quartier sur internet.** Ce n'est pas un portail.

## 2. Les deux visiteurs

| Visiteur | Arrive par | Doit pouvoir |
|---|---|---|
| **Intéressé par un bien** | portail, vitrine, recommandation, Google | voir le bien en détail, contacter en un geste (téléphone, WhatsApp, formulaire) |
| **Propriétaire qui vérifie** | recherche du nom sur Google après une recommandation | se convaincre en 30 secondes : sérieux, ancien, clients satisfaits |

Pas de profil type : familles locales, jeunes actifs (premier achat, investissement). → Clarté pour tous, **mobile d'abord**.

Hors scope v1 : acquisition de mandats (prospection vendeurs, tunnel d'estimation). Prévu dans un second temps.

## 3. Principes

1. **Une sélection, pas un moteur de recherche.** 8 à 10 biens, montrés en grand. Pas de filtres. Vente et location dans une même liste, distinguées par un repère.
2. **La crédibilité est le cœur du site.** Chaque page doit rassurer : ancienneté, adresse physique, vrais avis, transparence (honoraires, DPE, copropriété).
3. **Simplicité.** Peu de pages, chacune avec un rôle clair. Pas de contenu « pour remplir ».
4. **Le cabinet parle, pas la personne.** Voix « nous », pas de photo ni de mise en avant de l'agent. On incarne par le lieu, le quartier, la méthode et les avis.
5. **Rien d'inventé.** Aucun chiffre, avis ou engagement non confirmé par l'agent.

## 4. Identité

- **Perçu visé** : professionnel, moderne, sérieux. **À proscrire** : clinquant, commercial, impersonnel.
- **Anti-modèle** : grandes enseignes en franchise (La Forêt, Century 21, Orpi…) — bandeau de recherche, visuels de stock, badges, promos, couleurs criardes.
- **Couleur** : rouge de l'enseigne, légèrement assombri, utilisé comme accent (logotype, actions principales), sur une base neutre chaude.
- **Logo** : aucun. Point de départ = l'enseigne (capitales à empattements « CABINET RIMBAULT », italique « Transactions Immobilières »). Logotype typographique à moderniser.
- **Répartition** : sérieux par la structure (grille, espace, hiérarchie) ; modernité par la retenue ; chaleur par les mots et le réel (photos de l'agence et du quartier, vrais avis).
- **Ton** : vouvoiement, chaleureux mais cordial, factuel, sans jargon.
- **Références** : hors immobilier — cabinets d'architectes / notaires récents, artisans haut de gamme, petits hôtels indépendants.

## 5. Contenu disponible

- **Biens** : saisis par l'agent dans le back-office, exposés par `cabinet-rimbault-api` (modifiable si besoin).
- **Photos** : iPhone. Retouche IA légère envisagée (lumière, couleurs, verticales uniquement), automatisée à l'upload avec original conservé, budget ~10-35 $/mois. Chantier back-office distinct. + fiche de prise de vue pour l'agent.
- **Agence** : quelques photos de la devanture (Google).
- **Textes** : ancienne version réutilisable sur le fond, à réécrire en « nous » et à purger de l'invérifié (voir §8).

## 6. Architecture

| Page | Rôle |
|---|---|
| **Accueil** | Preuve en 30 s : sélection de biens en grand, puis synthèse de la méthode, ancienneté, avis, adresse |
| **Nos biens** | Liste complète (8-10). Pas de filtres, repère vente / location |
| **Fiche bien** | Page la plus importante : photos, informations complètes et transparentes, contact immédiat |
| **L'agence** | Approfondissement, sans doublon avec l'accueil : la méthode détaillée (comment se passe une vente, une location), le périmètre, les avis complets, les honoraires en résumé |
| **Contact** | Téléphone, WhatsApp, e-mail, formulaire, plan, horaires |
| Honoraires · Mentions légales · Confidentialité | Obligatoires (cookies fusionnés dans Confidentialité tant qu'aucun traceur) |

Règle anti-doublon : l'accueil **affirme** (une phrase par engagement), l'agence **démontre** (le détail, les étapes, les preuves). Si un bloc de l'agence n'apporte rien de plus que l'accueil, il saute.

Estimation : pas de page en v1, sujet du formulaire de contact.

## 7. Contact

Canaux réels de l'agent : **téléphone, WhatsApp, e-mail**. + formulaire qui arrive dans sa boîte mail. Pas de prise de RDV en ligne, pas de chat.

## 8. Contraintes

- **Légal (non négociable)** : DPE/GES et coût énergétique sur chaque fiche, honoraires (barème public + mention sur fiche), infos copropriété, mentions RGPD sur tout formulaire, footer réglementaire (carte T, garant, médiateur, RCS/SIRET).
- **Hébergement** : Netlify, domaine prêt.
- **Délais** : aucune échéance — priorité à la qualité, livraison par étapes validées.
- **Stack** : Next.js 16 (App Router), Tailwind v4, Biome.

## 9. Points ouverts

### À confirmer par l'agent
- [ ] Médiateur de la consommation (**obligatoire, bloquant mise en ligne**)
- [ ] Adresse du garant financier (LLOYD'S France)
- [ ] Raison sociale exacte (SAS, capital 4 000 €)
- [ ] Numéro WhatsApp, lien fiche Google Business
- [ ] E-mail de contact (actuel : adresse personnelle fournisseur d'accès → recommander une adresse sur le domaine)
- [ ] Horaires (relevés : lundi sur RDV, mardi-vendredi 9h-19h, samedi 9h-18h)
- [ ] Délai de réponse réel (anciens textes contradictoires : 24 h / 24-48 h / 48-72 h)
- [ ] Nombre de transactions (anciens textes contradictoires : 185 vs 315) ; le « 98 % » n'a pas de source → retiré
- [ ] Périmètre exact des communes couvertes (« huit communes » ne correspond pas à la liste)
- [ ] Zone ALUR d'Asnières (tendue / très tendue) pour les honoraires location
- [ ] Barème : date d'effet, part bailleur en location

### Côté API
- [ ] **Aucune notification e-mail à l'agent** quand un formulaire est envoyé (seul l'expéditeur reçoit une confirmation) → à ajouter
- [ ] Adresse exacte, lat/lng et référence cadastrale exposées publiquement → ne pas afficher ; idéalement ne plus les exposer
- [ ] Pas d'anti-spam (ni rate limit, ni captcha) → au minimum un honeypot
- [ ] Pas de variantes d'image → redimensionnement côté site
- [ ] Biens vendus : listables mais fiche en 404 (utile si on veut afficher des ventes récentes)
- [ ] Pas de webhook de revalidation (fraîcheur par cache seulement)
