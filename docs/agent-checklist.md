# Checklist des informations à récolter auprès de l'agent

> Document à transmettre au client (agent immobilier) **avant ou pendant l'implémentation**.
> Permet d'éviter le blocage en fin de projet par absence d'info.
> À maintenir à jour : cocher les items reçus, noter la date de réception.

---

## Légende de priorité

- 🔴 **CRITIQUE** — bloque la mise en ligne. Obligation légale ou information présente sur toutes les pages. À récolter **immédiatement**, même avant l'implémentation.
- 🟠 **IMPORTANT** — utilisé sur plusieurs pages, impact direct sur l'UX ou le SEO. À récolter **pendant l'implémentation**.
- 🟡 **UTILE** — enrichit la page mais le site fonctionne sans. À récolter **avant la mise en ligne**.
- 🟢 **BONUS** — phase 2 ou nice-to-have. À garder en tête mais non urgent.

---

## 1. 🔴 Obligations légales (loi Hoguet + arrêtés)

Sans ces informations, le site ne peut **pas** être mis en ligne sous peine d'infraction.

| # | Info | Format attendu | Où c'est utilisé |
|---|---|---|---|
| 1.1 | N° carte professionnelle **T** (Transaction) | Numéro complet (ex. `CPI 9201 2022 000 000 000`) | Footer global, `/a-propos`, `/honoraires`, `/mentions-legales`, chaque fiche bien |
| 1.2 | **CCI émettrice** de la carte T | Nom de la CCI (ex. `CCI Paris Île-de-France`) | Même que 1.1 |
| 1.3 | **Date de validité** de la carte T | Date d'expiration | `/mentions-legales` |
| 1.4 | N° carte professionnelle **G** (Gestion) — **si vous proposez la gestion locative** | Numéro complet ou `N/A` explicite | Footer, mentions légales |
| 1.5 | **Garant financier** : nom complet | Ex. `QBE Insurance`, `Galian`, `MMA`, `CGAIM`… | Footer, `/a-propos`, `/mentions-legales` |
| 1.6 | **Garant financier** : adresse complète | Adresse postale | `/mentions-legales` |
| 1.7 | **Garant financier** : montant de la garantie | Montant en € | `/mentions-legales` |
| 1.8 | Indication : **manipulation de fonds** ou **non-manipulation** ? | Mention obligatoire distincte selon le cas | `/mentions-legales` |
| 1.9 | **Médiateur consommation** désigné | Nom + adresse + site web du médiateur (ex. `MEDIMMOCONSO`, `MCP`) | Footer, `/honoraires`, `/mentions-legales` |
| 1.10 | **Assurance RC professionnelle** | Nom compagnie + n° de contrat | `/mentions-legales` |

## 2. 🔴 Identité juridique

| # | Info | Format | Usage |
|---|---|---|---|
| 2.1 | **Forme juridique** | EI, EURL, SARL, SAS, SASU… | Footer, mentions légales |
| 2.2 | **Raison sociale exacte** | Nom commercial complet | Partout |
| 2.3 | **Prénom + nom** du dirigeant | | `/a-propos`, `/contact` |
| 2.4 | **RCS** | Ville d'immatriculation + n° RCS | Footer, mentions légales |
| 2.5 | **SIRET** | 14 chiffres | Mentions légales |
| 2.6 | **N° TVA intracommunautaire** — si société | Format `FR XX XXXXXXXXX` | Mentions légales |
| 2.7 | **Capital social** — si société | Montant en € | Mentions légales |
| 2.8 | **Directeur de publication** du site | Nom (souvent = dirigeant) | Mentions légales |

## 3. 🔴 Coordonnées professionnelles

| # | Info | Format | Usage |
|---|---|---|---|
| 3.1 | **Adresse complète** du cabinet | Rue + code postal + ville | Footer, `/contact`, `/a-propos`, fiches biens |
| 3.2 | **Téléphone pro** | Format FR (+33 X XX XX XX XX) | Header, footer, `/contact`, toutes pages mobile (bottom bar) |
| 3.3 | **Email pro** | Adresse | Footer, `/contact`, réception leads |
| 3.4 | **Horaires d'ouverture** | Format précis (lun-ven 9h-19h, sam 10h-13h sur RDV, dim fermé) | `/contact`, footer |
| 3.5 | **Transports à proximité** | Métro ligne X, bus Y/Z, parking | `/contact` section "Venir à l'agence" |
| 3.6 | **WhatsApp pro** ? | Oui/non + numéro (si différent du 3.2) | `/contact`, bouton direct |
| 3.7 | **Accessibilité PMR** du cabinet | Oui / non / partielle | `/contact` (information utile) |

## 4. 🔴 Barèmes d'honoraires

Obligation arrêté du 10 janvier 2017. Doit être accessible à tout moment depuis le site.

| # | Info | Format | Usage |
|---|---|---|---|
| 4.1 | **Barème vente** complet | Tranches de prix + % ou forfait TTC par tranche | `/honoraires` |
| 4.2 | Honoraires **à charge de** | Acquéreur / Vendeur / Partagé | `/honoraires`, chaque fiche bien vente |
| 4.3 | **Forfait minimum** vente | Montant en € TTC (si applicable) | `/honoraires` |
| 4.4 | Mention **mandat exclusif** | Barème différencié si exclusif ? | `/honoraires` |
| 4.5 | **Honoraires location — locataire** | Plafond en €/m² TTC (zone tendue / très tendue / hors zone) | `/honoraires`, chaque fiche bien location |
| 4.6 | **Honoraires location — bailleur** | Montant ou % (mise en location) | `/honoraires` |
| 4.7 | **État des lieux** | Plafond en €/m² TTC (partagé) | `/honoraires` |
| 4.8 | **Dépôt de garantie** pratique | 1 mois (non meublé) / 2 mois (meublé) | Fiches biens location, `/honoraires` |
| 4.9 | **Date d'effet** du barème | Date | `/honoraires` |

## 5. 🔴 Périmètre géographique

| # | Info | Format | Usage |
|---|---|---|---|
| 5.1 | **Liste exhaustive des communes couvertes** | Commune + code postal pour chacune | Header dropdown "Secteurs", home §4, `/a-propos` §4, filtres `/acheter` et `/louer` |
| 5.2 | Hiérarchie | Commune principale vs secondaires, ou toutes égales ? | Ordre d'affichage |
| 5.3 | **Quartiers spécifiques** ciblés dans une commune | Ex. "Boulogne Billancourt — quartier Parchamp / Jean Jaurès" | Optionnel — peut enrichir le SEO phase 2 |

---

## 6. 🟠 Présence en ligne existante

| # | Info | Format | Usage |
|---|---|---|---|
| 6.1 | **Google Business Profile** — lien de la fiche | URL complète | `/a-propos`, home, `/contact`, lien vers les avis |
| 6.2 | GBP — **nombre d'avis actuels** | Chiffre + confirmation ≥ 5 | Active ou non le bloc avis home + `/a-propos` |
| 6.3 | GBP — **note moyenne** | Chiffre (ex. 4,9/5) | Bloc avis |
| 6.4 | **Instagram pro** — handle | `@nom_du_compte` | Footer, `/contact` |
| 6.5 | **LinkedIn pro** — URL | URL complète | Footer, `/contact` |
| 6.6 | **Facebook pro** — URL (si actif) | URL | Footer, `/contact` |
| 6.7 | Autres réseaux actifs (YouTube, TikTok…) | URL | Optionnel |
| 6.8 | Site existant à reprendre ? | URL + accès admin | Analyse de contenu migrable |
| 6.9 | Articles / contenus existants (LinkedIn, Medium, PDF) | Liens ou fichiers | Réutilisable pour phase 2 blog |

## 7. 🟠 Identité visuelle

| # | Item | Format attendu | Usage |
|---|---|---|---|
| 7.1 | **Logo** | SVG **OU** PNG transparent en HD (min 1024 px côté le + long) | Header, footer, favicon, OG images |
| 7.2 | Logo — variantes | Version couleur + version monochrome (N&B) | Dark mode, impression |
| 7.3 | **Portrait agent** | Photo HD (min 1920 × 1920 px), cadrage portrait et buste | `/a-propos` hero, home section Agent |
| 7.4 | Photo(s) du cabinet | 2–4 photos HD (intérieur, enseigne) | `/contact`, optionnel `/a-propos` |
| 7.5 | **Favicon** | Fichier .ico ou source SVG haute qualité pour génération | Onglet navigateur, raccourcis |
| 7.6 | Préférences couleurs | Palette si déjà existante (charte) ou envies (clair/sombre, sobre/coloré) | Design system fin de projet |
| 7.7 | Polices de caractères | Police déjà utilisée sur supports print / carte de visite ? | Design system |

## 8. 🟠 Chiffres clés & crédibilité

Affichés sur la home (section Agent) et `/a-propos` (section "En quelques chiffres").

| # | Info | Format | Usage |
|---|---|---|---|
| 8.1 | **Nombre d'années d'expérience** | Nombre entier | Home, `/a-propos` |
| 8.2 | **Nombre de transactions réalisées** | Total ou total sur X années | `/a-propos` |
| 8.3 | **Nombre de communes couvertes** | Déduit du 5.1 | Home, `/a-propos` |
| 8.4 | Taux de biens vendus en < 3 mois | % | Optionnel, fort argument si ≥ 70 % |
| 8.5 | Note moyenne d'avis clients | Déduit du 6.3 | Home, `/a-propos` |
| 8.6 | Prix moyen de vente sur la zone | Ordre de grandeur | Optionnel, enrichit bloc SEO |

---

## 9. 🟠 Contenu rédactionnel

À rédiger **par l'agent** (avec ton humain, 1re personne) ou à drafter avec lui.

| # | Item | Volume attendu | Page cible |
|---|---|---|---|
| 9.1 | **Bio fluide de l'agent** | 4–6 paragraphes (800–1500 mots) | `/a-propos` §2 |
| 9.2 | **Positionnement 1 phrase** (hero home) | 1 phrase accrocheuse | Home hero |
| 9.3 | **Sous-titre home** | 1–2 lignes | Home hero |
| 9.4 | **Méthode de vente — 4 étapes** | Pour chaque : titre + délai + 2–3 lignes sur le rôle de l'agent | `/vendre` §2 |
| 9.5 | **Ce que j'apporte à la vente — 6 promesses** | Pour chaque : titre + 2–3 lignes | `/vendre` §3 |
| 9.6 | **FAQ `/vendre`** | 5–7 questions + réponses 3–5 lignes chacune | `/vendre` §5 |
| 9.7 | **Paragraphe SEO `/acheter`** | 1–2 paragraphes (150–300 mots) | `/acheter` §6 |
| 9.8 | **Paragraphe SEO `/louer`** | 1–2 paragraphes (150–300 mots) | `/louer` §7 |
| 9.9 | **Commentaire territorial** | 2–3 lignes sur la cohérence des communes | `/a-propos` §4 |
| 9.10 | **Bloc "Dossier locataire"** | Liste des pièces + modalités | `/louer` §6 |

## 10. 🟠 Opérations / réception des leads

| # | Info | Format | Usage |
|---|---|---|---|
| 10.1 | **Email de réception** des leads estimation | Email | API admin, config |
| 10.2 | **Email de réception** des leads contact générique | Email (même ou autre ?) | API admin |
| 10.3 | **Email de réception** des leads fiche bien | Email (même ou autre ?) | API admin |
| 10.4 | Notification Slack / SMS / WhatsApp souhaitée ? | Oui/non + canal | Config |
| 10.5 | **Délai de réponse engagé** | 24 h / 48 h / en heures ouvrées | Affiché sur chaque formulaire |
| 10.6 | Réponse automatique pendant congés ? | Message type | Config |

---

## 11. 🟡 Conformité RGPD & cookies

| # | Info | Format | Usage |
|---|---|---|---|
| 11.1 | **DPO (délégué protection données)** | Nom + email (souvent = dirigeant pour un solo) | `/politique-de-confidentialite` |
| 11.2 | **Durée de conservation** des leads | En mois (recommandé : 3 ans max pour les prospects) | `/politique-de-confidentialite` |
| 11.3 | **Destinataires** des données | Agent uniquement ? Sous-traitants ? | `/politique-de-confidentialite` |
| 11.4 | **Sous-traitants** | Hébergeur (Vercel), emails (Resend/Mailjet), analytics | `/politique-de-confidentialite` |
| 11.5 | **Analytics** souhaités ? | Plausible (sans consentement) / GA4 (avec bannière) / aucun | `/cookies`, techniquement |
| 11.6 | Cookie banner souhaité ? | Dépend du 11.5 | `/cookies` |
| 11.7 | Champ libre : que souhaitez-vous faire figurer dans la politique de confidentialité ? | Texte | `/politique-de-confidentialite` |

## 12. 🟡 Données sur les biens (côté API admin)

À vérifier avec la team admin, pas forcément avec l'agent.

| # | Check | Statut |
|---|---|---|
| 12.1 | Endpoint `/public/properties/recent` opérationnel | À confirmer |
| 12.2 | `PUBLIC_API_KEY` transmise pour l'environnement vitrine | À confirmer |
| 12.3 | Au moins **10 biens publiés** au jour du lancement | Cible |
| 12.4 | Chaque bien a : **photos HD**, **DPE**, **GES**, **description ≥ 150 mots**, **prix**, **référence** | Audit des fiches |
| 12.5 | Filtre statut `vendu` / `loué` exposé dans l'API | Pour le bloc home "Biens vendus" |
| 12.6 | Champ "copropriété" (nb lots, charges, procédures) sur les biens en vente | Obligation ALUR |
| 12.7 | Champ "année de référence énergie" sur DPE | Obligation loi Climat |
| 12.8 | Coordonnées GPS approximatives (pour le cercle 500 m) | Ou calcul côté vitrine depuis l'adresse |

---

## 13. 🟢 Témoignages manuels (fallback si GBP < 5 avis)

Actuellement **pas de fallback prévu au MVP** (décision PO). Mais en cas de retournement :

| # | Item | Format |
|---|---|---|
| 13.1 | 5 à 10 témoignages clients | Extrait 3–5 lignes + prénom + initiale nom + commune + type transaction + date |
| 13.2 | Autorisation écrite des clients | Mail/SMS — obligatoire RGPD |

## 14. 🟢 Préparation phase 2

Non urgent, mais utile de collecter en amont pour planifier.

| # | Info | Usage phase 2 |
|---|---|---|
| 14.1 | L'agent envisage-t-il de proposer de la gestion locative ? | Page `/gestion`, menu |
| 14.2 | L'agent a-t-il envie d'écrire un blog ? | Phase 2 `/conseils` |
| 14.3 | Thèmes de blog envisagés | Production de contenu |
| 14.4 | Guide vendeur / acheteur existant ? | Contenu migrable |
| 14.5 | Appétence pour la vidéo (présentation, visites) ? | Home phase 2 |
| 14.6 | Souhait d'une prise de RDV en ligne ? | Phase 2 `/contact` |

## 15. 🟢 Business / positionnement (pour affiner les textes)

| # | Question | Usage |
|---|---|---|
| 15.1 | Qu'est-ce qui vous distingue des 10 agences de la rue d'à côté ? | Home + `/a-propos` copy |
| 15.2 | Quel est votre client type (âge, profil, projet) ? | Tonalité éditoriale |
| 15.3 | Types de biens dominants (appart, maison, neuf, ancien) ? | Priorité filtres, cards, SEO |
| 15.4 | Anecdote ou vente marquante — ce dont vous êtes fier ? | Bio fluide |
| 15.5 | Pourquoi être indépendant et pas en franchise ? | Bio fluide, argument fort vs concurrence |
| 15.6 | Engagements particuliers (écologie, associatif, local) ? | `/a-propos`, différenciateur |

---

## Format de restitution suggéré

Pour simplifier le ping-pong, on peut organiser la collecte en **3 rendez-vous** :

### RDV 1 — Infos juridiques et coordonnées (1 h) — priorité 🔴
- Sections 1, 2, 3, 5 de ce document
- Envoi préalable : extrait K-bis + copie carte pro T + attestation garant + désignation médiateur

### RDV 2 — Contenu éditorial et positionnement (1 h 30) — priorité 🟠 + 🟡
- Sections 4, 8, 9, 15
- Enregistrer la conversation : les morceaux d'interview nourrissent directement la bio fluide

### RDV 3 — Technique, visuel, opérations (45 min) — priorité 🟠 + 🟡
- Sections 6, 7, 10, 11
- Récupération des fichiers (logo, portrait, photos cabinet)

---

## Documents à recevoir (récap fichiers)

- [ ] Extrait **K-bis** récent (< 3 mois)
- [ ] Copie **carte professionnelle T** (+ G si applicable)
- [ ] **Attestation de garantie financière** en cours de validité
- [ ] Désignation du **médiateur consommation**
- [ ] Attestation **RC pro**
- [ ] **Logo HD** (SVG + PNG transparent)
- [ ] **Portrait** HD (photo pro)
- [ ] **Barème** d'honoraires signé
- [ ] Photos cabinet (optionnel)

---

## Journal de collecte

| Date | Section | Items reçus | Reste à récolter |
|---|---|---|---|
| | | | |
