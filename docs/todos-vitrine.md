# Tracker des TODO de la vitrine

Suivi des valeurs placeholder (`"TODO"`) en attente des informations de
l'agent. **Tous les TODO sont centralisés dans `src/lib/config/agent.ts`.**

Périmètre identique à la checklist §12 du `cahier-des-charges.md` (« Infos
bloquantes à collecter auprès de l'agent »).

## Procédure

Quand une valeur est fournie :

1. Remplacer le `"TODO"` correspondant dans `src/lib/config/agent.ts`.
2. Cocher la ligne ci-dessous et reporter la valeur.
3. Lancer `npm run typecheck` et `npm run lint`.

Les liens optionnels (réseaux sociaux, WhatsApp, Google Business) sont
**automatiquement masqués** tant que leur valeur vaut `"TODO"`, via le helper
`isPlaceholder()` exporté par `src/lib/config/agent.ts`. Aucun lien cassé ne
s'affiche donc en attendant ces valeurs.

## Légende du verdict

- **Légal** — obligatoire par le §7 du cahier des charges (non négociable).
- **Bloquant lancement** — pas strictement légal, mais s'affiche « TODO »
  sur des pages publiques ; doit être renseigné avant la mise en ligne.
- **Optionnel** — confort UX ; le lien est masqué tant que la valeur manque.

## Suivi

### Obligatoires — légal (§7 cahier des charges)

- [ ] **`legal.carteT`** — `agent.ts:40` — _verdict : Légal_
  N° de carte professionnelle T (Loi Hoguet). Affiché sur **chaque page**
  (Footer, fiche bien, `/honoraires`, `/mentions-legales`). La CCI émettrice
  (`cci`) est déjà renseignée.
  Valeur fournie : `__________`

- [ ] **`legal.garant`** — `agent.ts:42` — _verdict : Légal_
  Garant financier — nom + adresse (QBE, Galian, MMA…). Loi Hoguet.
  Valeur fournie : `__________`

- [ ] **`legal.mediator`** — `agent.ts:43` — _verdict : Légal_
  Médiateur de la consommation désigné (Code de la consommation, 2016).
  Remplacer le `TODO` dans `"Médiateur de la consommation : TODO"`.
  Valeur fournie : `__________`

### Obligatoires — bloquant pour la mise en ligne

- [ ] **`phoneE164`** — `agent.ts:6` — _verdict : Bloquant lancement_
  Téléphone au format international E.164 pour les liens `tel:`
  (ex. `+33612345678`). Affiché dans Footer, barre mobile, formulaires,
  pages erreur/404, pages légales. **Non masqué** : s'affiche « TODO ».
  Valeur fournie : `__________`

- [ ] **`phoneDisplay`** — `agent.ts:7` — _verdict : Bloquant lancement_
  Téléphone en format lisible (ex. `06 12 34 56 78`). À fournir avec
  `phoneE164`.
  Valeur fournie : `__________`

### Optionnels — masqués tant que vides

- [ ] **`whatsappUrl`** — `agent.ts:9` — _verdict : Optionnel_
  URL WhatsApp (`https://wa.me/33…`). Bouton sur `/contact`.
  Valeur fournie : `__________`

- [ ] **`instagram`** — `agent.ts:10` — _verdict : Optionnel_
  URL du profil Instagram. Bouton sur `/contact`.
  Valeur fournie : `__________`

- [ ] **`linkedin`** — `agent.ts:11` — _verdict : Optionnel_
  URL du profil LinkedIn. Bouton sur `/contact`.
  Valeur fournie : `__________`

- [ ] **`googleBusinessUrl`** — `agent.ts:12` — _verdict : Optionnel_
  URL Google Business Profile. Boutons sur `/contact` et `/agence`.
  Conditionnel : lié à l'intégration des avis Google (§10 — GBP actif avec
  ≥ 5 avis, à confirmer avec l'agent).
  Valeur fournie : `__________`

## Hors périmètre

Les `placeholder` des champs de formulaire (« Camille », « Dupont »,
`vous@exemple.fr`, `06 12 34 56 78`) et les `placeholder="blur"` des images
Next.js **ne sont pas des TODO** : ce sont des exemples UX intentionnels.
