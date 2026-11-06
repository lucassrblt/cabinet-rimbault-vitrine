# 08 — Revue finale du site complet (Zidane)

# Revue finale n° 4

> 31/10/2026. Banc : `npm run build` puis `next start` port 3406 (`.next-agent-c6`, supprimé ensuite), **sans** `E2E_NO_CACHE`, comme en ligne ; mock partagé 3101 (basculé en `error` le temps de D8, remis en `default`, puis **arrêté** en fin de passage). Aucun POST vers la production, aucun POST de formulaire.
> Pièces lues : revue n° 3 ci-dessous, recette 07 (tour 5), journal (sections Xavi, Bergkamp, Pirlo et Maldini de la revue n° 3).
> Captures, toutes regardées : `docs/refonte/captures/revue-finale-4/` (`<page>-{1440,390}.png` pour 16 URL, `parcours/d8-*`, `parcours/cb6-*`, `parcours/cp7-*`), plus celles des lots : `captures/lot-2-D8/`, `captures/lot-4-C-B6/`, `captures/lot-P-C-P7/`, `captures/T/recette/pages/fiche-error-*`.

## Verdict : **approuvé côté vitrine**

Les quatre corrections de la revue n° 3 sont faites et vérifiées sur le site réel en production. Je mettrais le site en ligne tel quel. La mise en ligne reste conditionnée aux seules informations à fournir par l'agent (§5 de la revue n° 3, inchangé ; `check-launch --strict` les refuse toujours).

| Point | Vérification sur le site (3406, production) | État |
|---|---|---|
| **D8** | Mock en `error` : `/biens/88.888` répond **200**, un seul `h1` « Un problème technique empêche l’affichage de cette page. », en-tête, pied, lien `tel:` dans le contenu, `meta robots` `noindex, nofollow`, aucun débordement, à 1440 et 390. Pendant la panne, la fiche pré-rendue `/biens/10.131` reste servie (200). Mock revenu en `default` : `/biens/10.131` → 200. Spec `80` « frontière » en production : réussie. Captures `parcours/d8-error-88888-{1440,390}.png` | Clos |
| **C-B6** | « Nos honoraires / de vente » en deux lignes à 1024, 1280 et 1440 ; écart au texte 86 px (1024) et 166 px (1280, 1440). Titres de Vendre et Louer à 1440 : minimum 72 px (« Questions fréquentes »). Captures `parcours/cb6-vendre-honoraires-{1024,1280,1440}.png` | Clos |
| **C-P7** | Étapes 1 et 2, à 1024 et 1440 : gouttière horizontale des options = celle des champs = **24 px** ; fin de la 1re colonne d'options = fin du champ de gauche (664 à 1024, 912 à 1440), écart 0 px ; écart vertical des options 8 px. « Nombre de pièces » reste en une colonne, comme voulu. Captures `parcours/cp7-etape{1,2}-{1024,1440}.png` | Clos |
| **C-X10** | `npm run build` : aucune route `/design-system` ; `/biens/[reference]` en SSG, révalidation 10 min. `npx tsc --noEmit` propre, `npm run lint` propre (196 fichiers). `tsconfig.json` ne cite plus aucun `.next-agent-*` ; aucun dossier `.next-agent-*` restant | Clos |

## Dernier passage, 16 URL à 1440 et 390 (production)

- Statuts : 200 partout ; 404 pour `/biens-introuvable`, l'URL inconnue, `/biens/99.999` et `/design-system`.
- Un seul `h1` par page, aucun débordement horizontal, aucune erreur console hors la 404 attendue.
- Aucune chaîne interdite (`TODO`, `undefined`, `NaN`, `null`, `À CONFIRMER`, `À FOURNIR`, « Découvrez », « N’hésitez », `·`, `Lorem`), aucune apostrophe droite dans le contenu, aucun élément `fixed` visible au repos.
- À l'œil (accueil, Vendre, contact, fiche 10.131, D8, tunnel) : une seule main, grille et rythme tenus, grenat réservé. Rien à reprendre.

## Points relevés, sans action vitrine

- **Spec `80` complète en production** (sans filtre) : 76 réussis, 30 ignorés, **20 échecs, tous des tests qui changent le scénario du mock sur `/` et `/biens`**, pages statiques générées au build en `default` (ISR 5 min). Ce n'est pas un défaut du site (c'est même le comportement voulu : la liste reste servie quand l'API tombe), et la recette de production de Maldini les exclut par filtre. Hygiène de spec, pour Maldini quand il repassera : les ignorer en production avec leur raison, comme « Louer : renvoi du locataire ».
- **État d'erreur de D8 mis en cache ISR** : au plus une période de révalidation (10 min) après le retour de l'API, documenté au journal (Pirlo). Accepté.
- Louer à 1024 : « Comment se passe une location » finit à 39 px de la colonne 5 (le contrôle C-B6 vaut à 1440). Visuellement sans contact. Accepté.

## Ménage

- Serveur 3406 arrêté, `.next-agent-c6` supprimé, `next-env.d.ts` remis (le build l'avait réécrit), `tsconfig.json` intact.
- Mock 3101 arrêté. Seuls tournent encore 3000 et 3310, qui appartiennent au projet `y2k-shop`, non touchés.
- Trois dossiers de captures des lots, créés à la racine du dépôt (`captures/`), déplacés sous `docs/refonte/captures/` (`lot-2-D8`, `lot-4-C-B6`, `lot-P-C-P7`), là où le journal les cite.
- `git status` : rien de parasite dans les deux dépôts (vitrine : sources, `e2e/`, `scripts/`, `docs/refonte/` ; API : lot de notification). Fichiers ignorés : `.next`, `.next-e2e`, résultats Playwright.

---

# Historique : revue finale n° 3

> 31/10/2026. Banc : `next dev` port 3210 (`.next-agent-100`, supprimé ensuite), mock partagé 3101 en `default` (il tournait déjà ; non arrêté, seulement deux POST de recette `zidane-rf3-*`).
> Parcours :
> - 15 URL (dont `/design-system`), chacune à 1440, 1024, 390 et 320 px, en page entière, puis découpées ;
> - tunnel complet jusqu'à la confirmation à 1440 et 390 px : erreurs de l'étape 1, « 5 pièces ou plus », case RGPD oubliée, puis double clic ;
> - visionneuse au clavier (Entrée, flèche droite, Tab ×6, Échap) et au toucher en 390 ;
> - menu mobile à 390 et 320 (Échap, fermeture après navigation) ;
> - focus clavier de l'en-tête, 404 générale et fiche disparue.
>
> Pièces lues : brief 00 en entier, recette 07 (tour 4), journal (sections Xavi, Pirlo, Bergkamp et Maldini depuis la revue n° 2).
> Captures, toutes regardées : `docs/refonte/captures/revue-finale-3/`
> - `<page>-<largeur>.png` : pages entières ;
> - `decoupes/` : tranches de 1100 px (desktop), et trois tranches de 1300 px côte à côte (mobile) ;
> - `parcours/` : tunnel `t-*`, menu, visionneuse, focus, en-tête collant, images différées.

## Verdict : **non approuvé**, un défaut réel (D8) et deux retouches de finition

Les six corrections de la revue n° 2 sont toutes faites et vérifiées sur le site, **C-X1 comprise** :
- `src/app/design-system/` n'existe plus ;
- `/design-system`, `/design-system/mouvement` et `/design-system/mouvement/suite` répondent 404, avec la page dédiée.

Le site tient sa promesse. On croirait un cabinet sérieux dessiné par un studio, pas un site « vibe codé » :
- une seule main : grille de 12, marge à 120 px à 1440, mêmes filets, même rythme (titre en colonnes 1 à 4, contenu en colonnes 5 à 12) ;
- une typographie éditoriale ;
- une illustration retenue et un mouvement qu'on ne remarque pas.

L'approbation bloque encore sur deux points :
- **D8**, trouvé par Maldini au tour 4. En production, quand l'API est en panne, une fiche absente du build renvoie une page nue « Internal Server Error ». C'est exactement le « crash » que le §9 interdit.
- **Deux défauts de finition** visibles à l'œil, qui ne prennent que quelques minutes. Le client a demandé « rien laissé au hasard » : on les fait dans le même tour.

Contrôles automatiques de ce passage, sur les 15 URL et aux 4 largeurs :
- statut 200, ou 404 pour les trois URL d'erreur ;
- aucun débordement horizontal, y compris à 320 px ;
- un seul `h1` par page ;
- aucune erreur console hors la 404 attendue ;
- aucune chaîne `TODO`, `undefined`, `NaN`, `null`, `À CONFIRMER`, `À FOURNIR`, « Découvrez », « N'hésitez », `·`, `Lorem` ;
- aucune apostrophe droite ;
- aucun élément `fixed` hors menu et visionneuse ;
- au plus un bouton grenat dans le premier écran, et toujours dans le contenu.

Outils :
- `npm run lint` : propre (195 fichiers) ;
- `tsc` : aucune erreur dans les sources ; il échoue seulement sur `.next-agent-95/` et `.next-agent-96/` (voir C-X10).

## 1. La demande du client, point par point (brief §1)

| Exigence | Constat |
|---|---|
| Parler au nom du cabinet | Conforme. « Nous » partout. L'agent n'est nommé que dans les avis Google cités, tels quels |
| Aucune photo de l'agent | Conforme. On ne voit que des photos de biens, des illustrations au trait et des étiquettes DPE/GES |
| Vente, location, estimation | Conforme : `/vendre`, `/louer`, `/estimation`, plus une liste unique `/biens` (5 biens en vente ; l'état vide de la location est rédigé, avec ses deux sorties) |
| Pas de moteur ni de filtre | Conforme. Aucun champ de recherche, tri ni pagination |
| Tunnel jusqu'à la boîte de l'agent | Conforme côté vitrine. Un seul POST par double clic, à chaque largeur. Charge utile : `intent: "ESTIMATION_VENTE"`, `rooms: "5+"`, `surface: "59.5"` et `bedrooms: "1"` en chaînes, `rgpd: true`, `source: "vitrine/estimation"`, aucun `timeframe`. La case RGPD oubliée bloque l'envoi avec un résumé d'erreur. Après l'envoi, le focus est sur le `h1` et le `sessionStorage` est vide. Notification à l'agent : lot API, 45/45 |
| Grenat et crème | Conforme. Le grenat est réservé au logotype, au bouton d'action, aux liens, à l'option cochée et au pied |
| Moderne, sobre, sérieux, pas « vibe codé » | Oui, sous réserve de C-B6 et C-P7 ci-dessous |
| Belles images sans photos d'annonces | Conforme. ILL-01, 03, 05, 06, 08 et 09 ; seule ILL-03 apparaît sur plusieurs pages, comme prévu |

## 2. Interdits §6, mouvement §7, finition

- **Interdits §6** : aucun constaté.
  - Ni ombre ni dégradé hors étiquettes énergie, aucun hero centré, aucune carte à bordure.
  - Rien de fixe hors menu et visionneuse.
  - Aucune capitale espacée, aucune flèche dans les libellés, aucun point médian.
- **Mouvement §7** : rien ne se remarque.
  - La visionneuse est un `dialog`. Le focus est piégé (Tab ×6 reste dedans) et revient sur « Voir les 4 photos » après Échap.
  - Le menu se ferme après une navigation (`hidden`, `aria-expanded="false"`) et après Échap.
- **Focus** : contour encre net et décalé (logotype, navigation), conforme à la revue n° 2.
- **Cibles** :
  - « Menu » fait 48 × 48 ;
  - les boutons et les champs font 48 px ;
  - les liens de l'en-tête et du pied relèvent de l'exception d'espacement (déjà acceptée).
- **Césure** : elle est active dans le texte courant mobile (« jouis-sance », « copro-priété »), ce qui est voulu (lot P). À 320 px, le titre « Un seul interlocuteur, du premier rendez-/vous au notaire. » coupe sur le trait d'union réel : c'est accepté.
- **Images vides dans les captures pleine page** : les biens similaires, et ILL-03 dans la capture de l'accueil à 390, sont restés vides. C'est un **artefact de capture**, sans action à faire :
  - `ImageFade` attend le décodage, et Playwright ne charge pas les `loading="lazy"` d'une capture pleine page ;
  - en défilement réel, toutes les images s'affichent (`parcours/accueil-390-findus.png`, `fiche-1440-similaires.png`, `fiche-390-similaires.png` : `data-fondu="visible"`, opacité 1).

## 3. Corrections demandées (actionnables, par propriétaire)

### Pirlo (lot 2), avec Xavi (lots 0 et 1) : D8, **bloquant**

- **Constat** (recette 07, tour 4, reproduit par le journal du serveur) :
  - `(site)/biens/[reference]/page.tsx` l. 121 appelle `getProperty(reference)` sans garde ;
  - en production, quand une `ApiError` autre que 404 survient pendant le rendu à la demande d'une référence absente de `generateStaticParams`, Next renvoie 500 et 21 octets, « Internal Server Error », sans en-tête, pied ni téléphone ;
  - `generateMetadata` intercepte déjà l'erreur. Seule la page la laisse sortir.
- **Arbitrage** (piste 1 de Maldini, la plus sobre) :
  1. **Xavi** extrait le contenu de `(site)/error.tsx` (ouverture `PageIntro`, `h1` « Un problème technique… », téléphone en `TextLink`) dans un composant serveur partagé `src/components/layout/ServiceError.tsx` (lot 1). Il ne contient pas le bouton « Réessayer », qui exige du client ; `error.tsx` le garde et rend `ServiceError` à côté. Aucun changement visible sur `error.tsx`.
  2. **Pirlo** attrape, dans la page de la fiche, toute erreur de `getProperty` qui n'est pas un « introuvable ». La page rend `<ServiceError />` dans le gabarit `(site)`, donc avec l'en-tête et le pied. Une erreur de `getSimilarProperties` ne doit jamais faire tomber la fiche : la section est masquée, comme si la liste était vide.
  3. **Mise en cache** : lire d'abord `node_modules/next/dist/docs/01-app/02-guides/incremental-static-regeneration.md` (§ erreurs) et `01-app/01-getting-started/10-error-handling.md`. Si l'état d'erreur risque d'être mis en cache ISR au-delà de la période de revalidation, l'écrire au journal avec la durée maximale observée. Une fois l'API revenue, la fiche doit revenir au plus tard après une période de revalidation (10 min). On ne crée pas de route dynamique pour autant.
- **Acceptation** :
  - `E2E_SERVEUR=prod npx playwright test e2e/specs/80-pages.spec.ts -g "frontière"` passe ;
  - en production, avec le mock en `error`, `/biens/88.888` affiche l'en-tête, le pied, le `h1` et le téléphone ;
  - avec le mock revenu en `default`, `/biens/10.131` répond 200 ;
  - captures 1440 et 390 dans `captures/lot-2-D8/`.

### Bergkamp (lot 4)

- **C-B6 · « Nos honoraires de vente » colle au texte** (`(site)/vendre/page.tsx`, titre de section, `decoupes/vendre-1440-01.png`).
  - Constat, mesuré à 1440 : le titre tient sur une ligne et finit à x = 502, à 26 px de la colonne de texte (528). C'est la seule section du site où le titre touche la gouttière ; partout ailleurs, il reste à 48 px ou plus (« Questions fréquentes » 456, « Parlons de votre bien » 453). La sœur sur Louer est en deux lignes, « Nos honoraires / de location ». On lit « Nos honoraires de vente Leur montant… » comme une seule ligne.
  - Correction : composer « Nos honoraires / de vente » en deux lignes à partir de 1024, comme sur Louer, par une limite de mesure du titre dans `OwnerSection` (par exemple `lg:max-w-[21rem]`, soit 336 px) plutôt que par un `<br>`, pour que la règle vaille pour tout titre futur. Contrôler à 1024, 1280 et 1440 que les autres titres de Vendre et de Louer ne changent pas, et qu'à 390 rien ne bouge.

### Pirlo (lot P)

- **C-P7 · Deux gouttières dans le même formulaire** (`components/ui/ChoiceGroup`, tunnel, `estimation-1440-00.png`, `parcours/t-1440-2.png`).
  - Constat : en deux colonnes, les options sont séparées de 8 px, et les champs voisins (Code postal / Ville, Chambres / Salles de bains) de 24 px. À l'étape 1, la colonne gauche des options finit à 919 px, celle du code postal à 911 : deux bords qui se suivent à 8 px près. C'est la petite marque d'un assemblage, pas d'un dessin, et la planche porte le même écart.
  - Correction : en deux colonnes, l'espace **horizontal** entre options devient celui de la grille des champs (24 px dès `md`). L'espace vertical reste de 8 px, et une seule colonne ne change pas. Mettre la planche à jour (§ formulaires). Contrôler à 1024 et 1440 que les bords des options et des champs coïncident à ±1 px, aux étapes 1 et 2.

### Xavi (lot 0) ou Lucas

- **C-X10 · Ménage du banc** (non bloquant pour la vitrine, mais `tsc` échoue tant qu'il n'est pas fait) :
  - retirer de `tsconfig.json` les lignes `.next-agent-92`, `-95` et `-96`. Leurs types périmés citent encore `/design-system/mouvement` et font échouer `npx tsc --noEmit`. **Attention** : un `next dev` tourne encore sur le port 3202 ; vérifier à qui il appartient avant de toucher à `-92` ;
  - supprimer les dossiers `.next-agent-*` abandonnés, dont `-80` et `-82` (dernier reste de C-X1) et `-99` (Maldini) ;
  - enfin, `npm run build` doit lister les routes sans aucun `/design-system`. Le build n'a pas été relancé dans ce passage pour ne pas charger la machine des autres agents ; les sources n'en contiennent plus.

### Maldini (lot T)

Après D8, C-B6 et C-P7, relancer :
- `80` en dev et en production (frontière, avec D8) ;
- `90` en dev (tunnel) ;
- `npm run build`, qui ne doit plus lister `/design-system`.

Ajouter un contrôle : à 1440, sur toutes les pages, le texte de chaque titre de section en colonnes 1 à 4 finit au moins 40 px avant la colonne 5 (C-B6).

### Cantona, Iniesta
Aucune correction.

## 4. Points constatés et acceptés (aucune action vitrine)

- **Contact** : la seule mise en page en deux colonnes séparées par un filet vertical, formulaire à x = 679. C'est le gabarit validé au lot 6 : il n'y a pas de titre de section en colonnes 1 à 4. Les gabarits `ProsePage` (sommaire, texte en colonne 4) le sont aussi. Ils sont cohérents entre eux.
- **Vendre et Louer, bloc final** : un bouton grenat et un bouton secondaire. Il n'y a qu'un grenat par écran.
- **Avis** : le compteur est passé de 32 à 34 avis. C'est la donnée Google, pas une saisie.
- **Pied** : aucune ligne d'horaires dans « Nous trouver ». Les horaires ne sont pas validés (§10-7) et restent masqués, ce qui est juste.
- **Charge utile** : `address` vaut « Asnières-sur-Seine » quand l'adresse est vide, parce que la ville y est jointe (`payload.ts` l. 117). C'est voulu : l'API n'a pas de champ ville.

## 5. Bloquants de mise en ligne, côté agent et exploitation (brief §10)

La liste est inchangée : médiateur, barème, directeur de la publication, hébergeur de la vitrine, durée de conservation, `SITE_URL`, coûts d'énergie de 09.345 et 10.131. `check-launch --strict` les refuse.

Un complément sur les données :
- **09.345 a lui aussi les étiquettes d'outils.immo**, pas seulement 10.131. On y voit le filigrane `www.outils.immo` et le texte du bas de l'étiquette GES coupé sous la barre G (« …rtantes »). Il faut lancer `npm run backfill:energy-labels` après le déploiement de l'admin et avant celui de la vitrine.
- 10.131 : les incohérences signalées en revue n° 2 (2011 contre 2012, 1 235 € contre 1 239 €) sont toujours là. C'est à l'agent de trancher.

## 6. Suite

La revue finale n° 4 sera courte et ne portera que sur :
- les captures de D8 en production, avec la recette `80` de Maldini en dev et en production ;
- Vendre à 1024 et 1440 (C-B6) ;
- les étapes 1 et 2 du tunnel à 1024 et 1440 (C-P7) ;
- la sortie de `npm run build` et de `tsc`.

Si tout est conforme, **le site est approuvé côté vitrine**. La mise en ligne reste conditionnée au §5.

---

# Historique : revue finale n° 2

> 31/10/2026. Banc : `next dev` port 3204 (`.next-agent-94`, supprimé ensuite), mock partagé 3101 en `default` (il tournait déjà et n'a pas été touché, à part deux POST de recette `zidane-rf2-*`).
> Parcours :
> - 14 URL, chacune à 1440, 1024, 390 et 320 px, en page entière avec défilement préalable pour charger les images différées, puis découpées.
> - Tunnel complet jusqu'à la confirmation à 1440 et 390 px (erreurs, « 5 pièces ou plus », double clic), plus les étapes 1 à 4 à 320 px.
> - Visionneuse au clavier (Entrée, flèche droite, Échap, retour du focus) et au toucher en 390 px.
> - Menu mobile à 390 et 320 px (Échap, retour du focus, fermeture après navigation).
> - Focus clavier de l'en-tête, tailles des cibles, case RGPD au vrai clic.
> - 404 générale et fiche disparue.
>
> Pièces lues : brief 00 en entier, recette 07 (tour 2), journal (corrections de la revue n° 1 et demandes inter-lots).
> Captures, toutes regardées : `docs/refonte/captures/revue-finale-2/`
> - `<page>-<largeur>.png` : pages entières ;
> - `decoupes/` : tranches de 1100 px (desktop) et 1400 px (mobile) ;
> - `parcours/` : tunnel `t-*`, menu, visionneuse, focus.

## Verdict : **non approuvé**, cinq retouches courtes, dont un bloquant de principe

Le site est au niveau sur l'essentiel, et nettement. On croirait un cabinet sérieux dessiné par un studio, pas un site « vibe codé » :
- une seule main sur tout le site : grille de 12, marge à 120 px à 1440, mêmes filets, même rythme de sections (titre en colonnes 1 à 4, contenu en colonnes 5 à 12) ;
- une typographie éditoriale tenue, avec des espaces fines devant `: ; ? !` et dans les prix ;
- l'illustration est retenue et aucun ornement n'apparaît.

Les corrections de la revue n° 1 sont toutes vérifiées sur le site, sauf C-X1. Ce qui reste empêche l'approbation :
- `/design-system` est encore en ligne (C-X1) ;
- une affirmation sur les honoraires est fausse sur deux pages ;
- trois écarts de finition trahissent encore « deux mains ».

Aucune de ces retouches ne prend plus d'une heure.

Contrôles automatiques de ce passage, sur les 14 URL et aux 4 largeurs :
- statut 200, ou 404 pour les deux URL d'erreur ;
- aucun débordement horizontal, y compris à 320 px ;
- un seul `h1` par page ;
- aucune erreur console hors la 404 attendue ;
- aucune chaîne `TODO`, `undefined`, `NaN`, `null`, `À CONFIRMER`, « Découvrez », `·` ;
- aucune apostrophe droite ;
- au plus un bouton grenat dans le premier écran, et toujours dans le contenu.

`npm run lint` est désormais propre (202 fichiers, voir §4) et `tsc` ne signale rien sur les sources.

## 1. La demande du client, point par point (brief §1)

| Exigence | Constat |
|---|---|
| Parler au nom du cabinet | Conforme. « Nous » partout. L'agent n'est nommé que dans les avis Google cités (décision de la revue n° 1) |
| Aucune photo de l'agent | Conforme. Seules images : photos de biens, illustrations au trait et étiquettes DPE/GES |
| Vente, location, estimation | Conforme : `/vendre`, `/louer`, `/estimation`, et une liste unique `/biens` (5 en vente, état vide de location rédigé avec ses deux sorties) |
| Pas de moteur ni de filtre | Conforme. Ni champ de recherche, ni tri, ni pagination |
| Tunnel jusqu'à la boîte de l'agent | Conforme côté vitrine. Un POST par double clic. Charge utile : `intent: "ESTIMATION_VENTE"`, `rooms: "5+"`, `surface: "59.5"` en chaînes, `rgpd: true`, `source: "vitrine/estimation"`, aucun `timeframe`. Après l'envoi, le focus est sur le `h1` de confirmation et le `sessionStorage` est vide. Notification agent : lot API, 45/45 |
| Grenat et crème | Conforme. Le grenat est réservé au logotype, au bouton d'action, aux liens et au pied |
| Moderne, sobre, sérieux, pas « vibe codé » | Oui, sous réserve des points C-X8, C-X9 et C-B4 ci-dessous |
| Belles images sans photos d'annonces | Conforme. ILL-01, 03, 05, 06, 08, 09 ; seule ILL-03 figure sur plusieurs pages, comme prévu |

## 2. Interdits §6, mouvement §7, finition

- **Interdits §6** : aucun constaté. Ni ombre ni dégradé hors étiquettes énergie. Aucun hero centré, aucune tuile à icône, aucune carte à bordure. Rien de fixe hors menu et visionneuse. Aucune capitale espacée, aucune flèche dans les libellés, aucun point médian. Le cadre du tunnel en `lait` est prévu par la palette (§3.1).
- **Mouvement §7** : rien ne se remarque. L'ouverture de l'accueil est la seule séquence. La visionneuse est un `dialog` : focus piégé, retour sur « Voir les 4 photos ». Le menu se ferme après une navigation et rend le focus à « Menu » après Échap. Approuvé au lot I, tour 3 ; rien de nouveau.
- **Focus** : contour encre net, décalé, sur le lien d'évitement, la navigation et « Faire estimer » (`parcours/focus-1440-tab*.png`).
- **Cibles** : les liens de l'en-tête et du pied font 22 px de haut, avec 28 px de pas. Ils entrent dans l'exception d'espacement de WCAG 2.5.8. Les boutons et les champs font 48 px. La case RGPD est un libellé entier de 350 × 110 px à 390 ; elle fonctionne au vrai clic (le blocage vu en script venait du test).
- **Louer à 1440** (point laissé par Maldini) : environ 400 px de crème au-dessus du `h1`. **Accepté.** La règle « pied du dessin sur le bas du bouton » est désormais la même sur les trois pages sœurs, ce qui était le but de C-B1. Le vide en haut à gauche est la réserve voulue (§8bis, composition d'ILL-01). Réduire ILL-05 la rendrait illisible. Aucune action.
- **« 1er janvier 2021 »** : conforme à la lettre d'A29, qui écrit « 1er ». La règle est documentée dans `format.ts`. La recommandation de la revue n° 1 est retirée.

## 3. Corrections demandées (actionnables, par propriétaire)

### Xavi (lots 0 et 5)

- **C-X1 · Supprimer `src/app/design-system/**`** (page, `mouvement/`, `suite/`). La route répond encore 200 sur ce banc et entre dans le build de production. C-M1 est faite depuis le tour 2 : plus rien ne bloque. Il faut ensuite :
  - relancer `npm run build` et vérifier que les routes `/design-system*` ont disparu ;
  - retirer de `tsconfig.json` les lignes `.next-agent-80` et `.next-agent-82` (dossiers abandonnés dont les types générés citent encore `/design-system/mouvement` et font échouer `tsc`) ;
  - supprimer ces deux dossiers.

  **Bloquant.**
- **C-X8 · Cadre du tunnel hors grille à 1440** (`components/estimation/TunnelShell.tsx` l. 54, `max-w-[736px]`).
  - Constat : à 1024, le cadre finit sur le bord droit de la grille (992). À 1280 et au-delà, il s'arrête à 1264, alors que l'en-tête (« Quitter »), le pied et toutes les autres pages finissent à 1320. Il reste 56 px qui ne s'alignent sur rien (`parcours/t-1440-*.png`).
  - Correction : le cadre occupe les colonnes 5 à 12 à toutes les largeurs ≥ 1024, soit 792 px à 1440. On retire le `max-w`. La mesure des champs reste tenue par le `p-12` intérieur.
  - Contrôle : bord droit du cadre égal au bord droit de « Quitter », à ±1 px, à 1024, 1280 et 1440.
- **C-X9 · « Ce qui va se passer » sur la confirmation** (`components/estimation/Confirmation.tsx` l. 68).
  - Constat : la liste est en `list-decimal` (« 1. » avec un point, puce en retrait de 8 px sur le bord du tableau et du titre). Les déroulés de Vendre et de Louer, eux, numérotent sans point, en Hanken 500, dans une colonne de 2 rem alignée sur le bord. Ce sont deux conventions pour la même chose (A15) : la marque de deux mains.
  - Correction : reprendre la convention de `owners/StepsList.tsx`, au choix en important le composant ou en recopiant la grille et le compteur. Chiffre sans point et texte aligné sur le bord gauche du tableau. Les filets sont facultatifs dans ce bloc étroit, mais à décider une fois pour toutes.

### Pirlo (lot 6)

- **C-P6 · Affirmation inexacte sur les honoraires** (`(site)/le-cabinet/page.tsx` l. 113).
  - Constat : « Indiqués toutes taxes comprises sur chaque annonce » est faux. La fiche 10.130 (honoraires à la charge du vendeur) n'en indique aucun montant, ce qui est légal mais contredit la phrase.
  - Remplacer par : « Chaque annonce indique qui les paie et, lorsqu’ils sont à la charge de l’acquéreur ou du locataire, leur montant toutes taxes comprises. Ils sont présentés sur la page Nos honoraires. » Garder le lien. U+2019 dans les apostrophes.
  - **Bloquant** : c'est un engagement écrit que le site ne tient pas.

### Bergkamp (lot 4)

- **C-B4 · Même inexactitude dans le chapô de `/honoraires`** (`(site)/honoraires/page.tsx` l. 71).
  - Remplacer par : « Chaque annonce indique qui paie nos honoraires et, lorsqu’ils sont à la charge de l’acquéreur ou du locataire, leur montant toutes taxes comprises. » La section Vente dit déjà le reste.
  - **Bloquant**, même raison que C-P6.
- **C-B5 · Titre de section de Louer** (`(site)/louer/page.tsx` l. 91).
  - Constat : « Les honoraires de location », alors que Vendre dit « Nos honoraires de vente » et que la page s'appelle « Nos honoraires ».
  - Correction : écrire « Nos honoraires de location ». Vérifier à 1440 que le titre tient en deux lignes dans les colonnes 1 à 4, comme aujourd'hui.

### Clôtures sans correction

- **C-B3 · close par arbitrage.** Les deux phrases relevées par Maldini sont des faits déjà publiés et relus :
  - « Pas de transfert de dossier, pas de standard. » figure mot pour mot dans les engagements de l'accueil (`agency.ts`, relecture transverse de Bergkamp) ;
  - « nos loyers sur ceux de logements comparables » reprend la FAQ de location (`content/faq-location.ts` l. 13).

  Rien à retirer.
- **Maldini (lot T)** : après C-X1, C-X8, C-X9, C-P6, C-B4 et C-B5, ajouter deux contrôles, puis relancer `70`, `80` et `90` en dev, ainsi que le build de production :
  - à 1024 et 1440, le bord droit du cadre du tunnel est égal à celui de l'en-tête (±1 px) ;
  - les chaînes « toutes taxes comprises sur chaque annonce » sont absentes du DOM.
- **Cantona, Iniesta** : aucune correction.

## 4. Fait par Zidane dans ce passage

`biome.json` (demande ouverte par Xavi puis Maldini) : `files.includes` reçoit `"!docs"` et `"!tsconfig.json"`.
- `docs/` contient la planche HTML et les JSON d'illustration, qui sont des pièces de travail.
- `tsconfig.json` est réécrit à chaque `next dev` dans un format que Biome refuse.

Résultat : `npm run lint` passe sur 202 fichiers, sans erreur.

## 5. Points constatés et acceptés (aucune action vitrine)

- Le badge « N » visible en bas à gauche des captures est l'indicateur de `next dev`. Il est absent en production.
- La section « Notre secteur » est absente de Le cabinet : ILL-07 attend la liste des communes (§10-8). C'est le texte seul prévu, jamais un cadre vide.
- L'avis « Chaques petits problèmes… » et l'auteur « HBO MAX » sont des citations authentiques, gardées (revue n° 1).

## 6. Bloquants de mise en ligne, côté agent et exploitation (brief §10, complétés)

Liste inchangée de la revue n° 1 : médiateur, barème, directeur de la publication, hébergeur, durée de conservation, `SITE_URL`, coûts d'énergie de 09.345 et 10.131. `check-launch --strict` les refuse.

Tant que le barème n'est pas en ligne, la phrase des mentions légales « présentés sur la page Nos honoraires, conformément à l’arrêté du 10 janvier 2017 » n'est pas encore vraie. C'est une raison de plus de ne pas lancer sans lui.

Nouveaux constats sur les données, à transmettre à l'agent ; la vitrine les affiche fidèlement :
- **10.131, étiquettes DPE et GES** : ce sont encore les images importées d'outils.immo, avec le filigrane `www.outils.immo`. Sur l'étiquette GES, le texte « Fortes émissions » est coupé sous la barre G (`decoupes/fiche-10131-1440-02.png`). 10.130 a déjà les étiquettes générées. → Lancer `npm run backfill:energy-labels` après le déploiement de l'admin et avant celui de la vitrine (mémoire projet).
- **10.131, données contradictoires** :
  - « Année de construction : 2011 » contre « résidence récente de 2012 » dans la description ;
  - « Charges annuelles moyennes : 1 235 € » contre « 1 239 € » dans la description.

  L'agent doit trancher dans l'admin. Un acquéreur attentif le verra.

## 7. Suite

Revue finale n° 3, courte, sur :
- les seules captures des six corrections : tunnel à 1024 et 1440, confirmation, Le cabinet (informations professionnelles), `/honoraires`, Louer (section des honoraires) ;
- la sortie de `npm run build`, qui ne doit plus lister `/design-system` ;
- le rapport de Maldini.

Si tout est conforme, le site est approuvé côté vitrine. La mise en ligne reste conditionnée au §6.

---

# Historique : revue finale n° 1

<!-- revue n° 1 -->
> 31/10/2026. Banc : `next dev` port 3198 (`.next-agent-88`), mock **privé** 3298 (`default`, puis `edge` pour la grille et l'archive). Le mock partagé 3101 n'a pas été touché.
> Parcours : 15 URL × 1440, 1024, 390 et 320 px (pages entières et découpes), tunnel complet de bout en bout jusqu'à la confirmation à 1440 et 390 px (deux POST reçus par le mock), visionneuse au clavier (flèches, Échap, retour du focus), menu mobile, focus clavier de l'en-tête, 404 générale et fiche disparue, scénario `edge`.
> Pièces lues : brief 00 en entier, recette 07 de Maldini (D1 à D7), journal (demandes inter-lots et revues de lots encore ouvertes).
> Captures : `docs/refonte/captures/revue-finale-1/` (`<page>-<largeur>.png`, `decoupes/`, `parcours/`, `edge-*`).

## Verdict : **non approuvé**, à un tour près

Sur l'essentiel, le site est au niveau. On croirait un cabinet sérieux, dessiné par un studio, et pas un site « vibe codé ». La palette grenat et crème est tenue, et il n'y a qu'un bouton grenat par écran, toujours dans le contenu. La typographie est éditoriale et les titres sont composés. L'agent n'apparaît nulle part et tous les textes disent « nous ». Il n'y a ni moteur ni filtre. Les illustrations sont d'une seule main. Le mouvement ne se remarque pas. Le tunnel fait 4 étapes, se lit clairement et envoie une charge utile conforme (`intent`, chaînes, `rgpd: true`, aucun `timeframe`). Aucun débordement à 320 px, aucune erreur console hors HMR, un seul `h1` partout.

Le site n'est pas encore approuvable, pour trois raisons :
1. Six défauts de la recette sont encore ouverts : D1 à D5 et D7. D6 sera clos par la suppression de `/design-system`.
2. Trois incohérences de composition se voient encore : l'en-tête de Louer, les bords droits de la fiche et le même texte d'engagements sur deux pages.
3. Des retouches acceptées comme « non bloquantes » dans les revues de lots n'ont jamais été faites.

Aucune de ces corrections ne demande plus d'une demi-journée.

## 1. La demande du client, point par point (brief §1)

| Exigence | Constat |
|---|---|
| Parler au nom du cabinet | Conforme : « nous » partout. L'agent n'est nommé que dans les avis Google cités, qu'on ne retouche pas (voir C-P3) |
| Aucune photo de l'agent | Conforme. Seules images : photos de biens, illustrations au trait et étiquettes DPE/GES |
| Vente maison/appartement, location, estimation | Conforme : `/vendre`, `/louer`, `/estimation` et une liste unique `/biens` |
| Pas de moteur ni de filtres | Conforme. Les deux ancres « En vente / En location » de `/biens` sont des liens internes, pas des filtres |
| Tunnel jusqu'à la boîte de l'agent | Conforme côté vitrine : POST reçu, confirmation, focus sur le `h1`. Notification agent : lot API, 45/45 |
| Grenat et crème obligatoires | Conforme |
| Moderne, sobre, sérieux, pas « vibe codé » | Oui, sous réserve des points C-B1, C-P2 et C-P4 ci-dessous, qui sont des marques de « plusieurs mains » |
| Belles images sans photos d'annonces | Conforme : ILL-01, 03, 05, 06, 08 et 09, sans aucun doublon hors ILL-03 |

## 2. Interdits §6 et mouvement §7

- Aucun interdit structurel n'apparaît : ni ombre, ni dégradé, ni carte à bordure, ni élément fixe hors menu et visionneuse, ni hero centré, ni tuile à icône.
- Côté texte, aucune violation, à une exception près : « 1er janvier 2021 » est conforme à A29 tel qu'il est écrit. Recommandation non bloquante : composer « 1ᵉʳ » avec un exposant typographique (`ᵉʳ`), comme « 3ᵉ ».
- Le mouvement est conforme, au sens où personne ne le remarque, et il est approuvé au lot I, tour 3. La visionneuse boucle de la dernière photo à la première : c'est accepté.

## 3. Corrections demandées (actionnables, par propriétaire)

### Xavi (lots 0, 1 et 5)
- **C-X1 · Supprimer `/design-system`.** Supprimer tout `src/app/design-system/**`, y compris `mouvement/` et `suite/`. La page répond 200 et entrerait dans le build de production. Sa suppression clôt aussi D6. **À faire après C-M1** : la spec 20 dépend encore de `/design-system/mouvement`.
- **C-X2 · D2.** `app/not-found.tsx` : une seule `meta robots`. Vérifier sur `next build` + `next start`.
- **C-X3 · D3.** `(site)/error.tsx` : utiliser `Container`, `Heading` de niveau 1 et `Button` secondaire, avec la même ouverture que `PageIntro`. La marge gauche doit être de 120 px à 1440, comme le logotype.
- **C-X4 · D5.** `.gitignore` : ajouter `/.next-agent-*/` et `/.next-e2e-prod/`. Ensuite, `npm run lint` doit se terminer et être propre.
- **C-X5 · D7.** `src/proxy.ts` : si une référence est absente de la liste mémorisée, relire la liste une fois, sans mémoire, avant de réécrire en 404.
- **C-X6 · Lot 5, deux chaînes** (ouvertes depuis la revue du lot 5, tour 3, et D4) :
  - `estimation-schema.ts` l. 281 : écrire `${step} sur`. L'espace entre le chiffre et « sur » est encore ordinaire.
  - `recap.ts` l. 162 : écrire « E‑mail » (trait d'union insécable).
- **C-X7 · `src/app/layout.tsx`** : ajouter `data-scroll-behavior="smooth"` sur `<html>`. La demande est ouverte au journal depuis le lot I et l'attribut est toujours absent.

### Pirlo (lots 2 et 6)
- **C-P1 · D1.** La meta description de la fiche doit être unique. Elle commence par `composeTitle(view, "phrase")`, puis donne la ville et le prix, puis l'extrait. Aujourd'hui, 10.131 et 10.130 ont exactement le même texte.
- **C-P2 · Fiche, bords droits de la colonne principale** (1440, `fiche-10130-1440-0*.png`). On compte cinq largeurs différentes dans la même colonne : `KeyFacts` sur 8 colonnes (912 px), `CoproBlock` en `max-w-[36rem]` (696), le filet de la mention d'énergie et le formulaire en `max-w-[40rem]` (760), et la prose en `mesure` (≈ 728). Règle à appliquer :
  - les tableaux de données (`KeyFacts`, `CoproBlock`) occupent les 8 colonnes ;
  - tout ce qui se lit (description, emplacement, interlocuteur, mention d'énergie avec son filet, formulaire de visite) prend une seule mesure, `mesure` ;
  - les filets de section ne changent pas.

  Contrôler à 1024 et 1440.
- **C-P3 · Avis Google** (`ReviewsSummary` et `ReviewsList`, accueil et Le cabinet) :
  1. Ajouter une ligne d'information sur les avis, exigée par l'art. L111-7-2 du code de la consommation pour qui diffuse des avis, en `t-petit text-gris` sous la note : « Extraits des avis que Google affiche en premier, cités sans retouche et parfois abrégés […]. »
  2. Composer typographiquement les citations, sans changer un seul mot : apostrophe droite `'` → `’`, et espace devant `! ? ; :` et avant `»` → U+202F. Aujourd'hui, sur l'accueil, la citation de gauche a des apostrophes courbes et celle de droite des apostrophes droites.
  3. Décision : les extraits qui nomment « M. Rimbault » restent (A9 vise nos textes, pas les citations). L'auteur « HBO MAX » reste aussi : c'est un avis authentique, et le filtrer serait une sélection non déclarée.
- **C-P4 · Le cabinet, « Notre façon de travailler » = « Nos engagements » de l'accueil, mot pour mot** (`CommitmentsDetailed` dit pourtant « version développée »). Le visiteur clique sur « Mieux connaître le cabinet » et relit les trois mêmes paragraphes. La correction est de développer chaque engagement sur Le cabinet, en 2 ou 3 phrases tirées **uniquement** de faits déjà validés sur le site (visite avant tout prix, une seule personne de la visite à la signature, le secteur et le renvoi vers un confrère au-delà). Aucune promesse nouvelle, aucun délai, aucun chiffre. Le texte se place en local dans `CommitmentsDetailed` (prop `detail` ou tableau propre au lot 6) et ne touche pas à `agency.ts`. **Bergkamp relit avant de livrer.**
- **C-P5 · Retouches du lot 6, tour 2, jamais faites** :
  - `le-cabinet/page.tsx` l. 190 : `sizes="(min-width: 1024px) 360px, min(360px, calc(100vw - 40px))"`.
  - `contact/page.tsx` l. 26 : meta description « Appeler le … ou nous écrire : les coordonnées du Cabinet Rimbault, 117 boulevard Voltaire à Asnières-sur-Seine. » La version actuelle contient encore « venir au ».

### Bergkamp (lots 4 et 7)
- **C-B1 · En-tête de Louer** (`louer-1440.png`, `decoupes/louer-1440-00.png`). Le texte est calé en haut et ILL-05 descend 258 px sous le bouton, ce qui laisse un trou sous « Faire estimer le loyer ». Sur l'accueil et sur Vendre, au contraire, le pied du dessin tombe sur le bas du bouton (`lg:items-end`). Trois pages sœurs, trois compositions : c'est la marque de plusieurs mains. Correction : appliquer la composition de Vendre, c'est-à-dire la grille `lg:items-end`, le pied du trottoir d'ILL-05 sur le bas du bouton et l'illustration en colonnes 9 à 12. Contrôler à 1024, 1280 et 1440, puis à 390 px, où rien ne doit changer.
- **C-B2 · Confidentialité**, les deux retouches de la revue du lot 7, tour 2, jamais faites :
  - (1) « Aucune autre information du formulaire n'est transmise. »
  - (2) rétablir la mention « Recommencer » dans le paragraphe du brouillon.
- **C-B3** · relire le texte de C-P4 avant sa livraison.

### Maldini (lot T)
- **C-M1 · `e2e/specs/20-transition-page.spec.ts`** ne doit plus dépendre de `/design-system/mouvement`. Remplacer cette dépendance par des pages réelles, ou passer le test en `skip` avec sa raison. Prévenir Xavi pour C-X1.
- **C-M2** · Une fois les corrections faites, repasser la suite complète, puis vérifier en `build` + `start` que D1 à D7 sont clos. Ajouter deux contrôles :
  - aucune apostrophe droite `'` dans le texte visible, citations comprises (C-P3) ;
  - sur Vendre, Louer et l'accueil, à 1440, l'écart vertical entre le bas de l'illustration d'en-tête et le bas du bouton principal est inférieur à 8 px (C-B1).

### Cantona, Iniesta
Aucune correction.

## 4. Points constatés et acceptés (aucune action)
- Le serveur de dev bloque l'origine `127.0.0.1` (`allowedDevOrigins`). Le tunnel ne s'hydrate alors pas : c'est un artefact du banc et non du site, et il fonctionne sur `localhost`. Il faut lancer les captures sur `localhost`.
- Les vignettes de la fiche sont sur une grille de 4. Avec 4 photos, il n'y a que 3 vignettes et un vide à droite, ce qui reste conforme à « dernière rangée alignée à gauche ».
- Le « ² » de Spectral est haut sur le `h1`. L'apostrophe de Spectral est en coin : c'est le dessin de la police.
- Le pied nomme trois fois « Cabinet Rimbault » (phrase, logotype, ©). C'est la structure imposée par A20 et le §9.
- Les blocs de fin de page de Vendre, Louer et `/biens` ne relèvent pas d'A31, qui vise l'accueil seul.
- En `edge`, la grille A21, la carte horizontale de la location et l'archive sur 4 colonnes avec ses badges sont conformes.

## 5. Bloquants de mise en ligne (inchangés, côté agent, brief §10)
Médiateur, barème (la page Honoraires renvoie au téléphone, alors que l'arrêté du 10/01/2017 demande le barème en ligne), directeur de la publication, hébergeur, durée de conservation, `SITE_URL`, coûts d'énergie de 09.345 et 10.131. `check-launch --strict` les refuse, comme prévu.

## 6. Suite
Revue finale n° 2 après les corrections C-X1 à C-M2. Elle portera seulement sur les captures concernées et sur le rapport de la nouvelle recette de Maldini.
