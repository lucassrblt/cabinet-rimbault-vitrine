# TASK-01 — Intégration des vraies informations de l'agent

**Priorité : 🔴 BLOQUANT**
**Phase : Contenu client**
**Statut : 🟡 Partiellement livré — en attente des dernières infos**

---

## Ce qui est fait (PR #11)

- [x] Nom / prénom / raison sociale → Xavier Rimbault, CABINET RIMBAULT (SAS)
- [x] Forme juridique → SAS (champ `legal.legalForm` ajouté)
- [x] SIREN → 511 484 586 (vérifié annuaire-entreprises)
- [x] SIRET → 511 484 586 00025 (vérifié)
- [x] RCS → Nanterre B 511 484 586 (vérifié)
- [x] Capital → 4 000 € (vérifié)
- [x] NAF → 68.31Z (vérifié)
- [x] Adresse professionnelle → 117 Boulevard Voltaire, 92600 Asnières-sur-Seine (vérifié)
- [x] Horaires → Lundi–Samedi 9h–19h (vérifié Mappy)
- [x] CCI émettrice → CCI Hauts-de-Seine (département 92)
- [x] Communes couvertes → recentrées autour d'Asnières (8 communes)
- [x] Reviews → noms et communes mis à jour (toujours fictifs)
- [x] Bio → réécriture cohérente avec les vraies infos
- [x] Mentions légales et politique de confidentialité → refactorisées sur `AGENT.*`
- [x] Toutes les mentions "Île-de-France" → remplacées par ville du config

## Ce qui reste à collecter auprès de l'agent

- [ ] Téléphone pro (E.164 + format affichage)
- [ ] Email pro (confirmer `contact@cabinet-rimbault.fr` ou autre)
- [ ] N° carte professionnelle **T** (transaction) — format CPI
- [ ] N° carte professionnelle **G** (si gestion)
- [ ] Garant financier : nom + adresse + montant garantie (QBE, Galian, MMA…)
- [ ] Médiateur consommation désigné (CNPM, Medimmoconso…)
- [ ] Assurance RCP : compagnie + n° contrat
- [ ] Handles Instagram / LinkedIn pro
- [ ] URL Google Business Profile
- [ ] URL WhatsApp
- [ ] Barème d'honoraires réels (vente + location)
- [ ] Portrait pro HD → placeholder dans le code, pas d'image réelle
- [ ] Logo HD → `public/logo-cabinet-rimbault.png` existe (à valider qualité)
- [ ] Stats réelles : nb transactions, nb avis Google, note, taux de réussite mandat
- [ ] Confirmation GBP actif (nb d'avis)

## Implémentation

Quand les infos seront fournies, il suffit de mettre à jour un seul fichier :

**`src/lib/config/agent.ts`** — remplacer les valeurs `"TODO"` par les vraies données.

Les pages suivantes s'adapteront automatiquement (import `AGENT`) :
- Footer, Header, MobileBottomBar
- `/mentions-legales`, `/politique-de-confidentialite`
- `/agence`, `/contact`, `/vendre`, `/honoraires`
- Fiche bien (`/bien/[reference]`)
- Hero homepage, metadata globale
- Pages `/acheter`, `/louer`
- Tous les formulaires

## Notes légales

Le footer réglementaire (carte T, RCS, garant, médiateur) est affiché sur **toutes les pages**
via `Footer.tsx` et `LegalStrip` dans la fiche bien. Obligation Loi Hoguet — non négociable.
