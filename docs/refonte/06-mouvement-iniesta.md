# 06 — Mouvement (Iniesta, lot I)

> API du système de mouvement pour Xavi (lots 1, 3, 5) et Pirlo (lots 2, 6). La règle reste le brief §7 (liste fermée) : ce document dit seulement **comment** appliquer chaque ligne.
> Démonstration vivante : `/design-system/mouvement` (noindex). Captures : `docs/refonte/captures/lot-I/`.

## 0. Principes appliqués partout

- Aucune bibliothèque d'animation. Il n'y a que du CSS, la Web Animations API et `<ViewTransition>` de React.
- Seules `opacity`, `transform` et les couleurs sont animées, plus `stroke-dashoffset` pour la coche. Jamais `height`, `width` ni `top`.
- Courbe unique : `--ease-sobre` (`@theme`, Pirlo), copiée en JS dans `motion/tokens.ts` (`EASE_SOBRE`).
- Tout mouvement est écrit sous `prefers-reduced-motion: no-preference`. Sous `reduce`, il n'existe pas. Seules les transitions de couleur au survol gardent leurs 180 ms. Vérifié : avec `reduce`, aucune transition hors couleur ne dépasse 0 ms, et aucune animation ne joue au chargement.
- Sans JavaScript, tout est visible (vérifié). Un état invisible n'est posé qu'après l'hydratation : par JS pour `ImageFade`, et par `:root[data-mv-hydrate]` pour les apparitions CSS. L'ouverture de l'accueil fait exception, voir §3.
- Jetons CSS (`:root`, bloc MOUVEMENT de `globals.css`) : `--mv-duree-couleur` 180, `--mv-duree-page-sortie` 160, `--mv-duree-page-entree` 220, `--mv-decalage-page-entree` 80, `--mv-duree-ouverture` 340, `--mv-decalage-ouverture` 80, `--mv-duree-image` 300, `--mv-duree-carte` 600, `--mv-duree-panneau` 180, `--mv-duree-apparition` 180, `--mv-duree-progression` 300, `--mv-duree-coche` 400 (ms).

## 1. Changement de page — `src/app/(site)/template.tsx` (déjà en place)

Le gabarit enveloppe le contenu du `<main>` dans `<PageTransition>` (`<ViewTransition key={pathname}>`). L'ancien contenu s'efface en 160 ms. Le nouveau apparaît en 220 ms, avec 80 ms de décalage pour que les deux textes ne se superposent pas lisiblement.
- **En-tête (lot 1, Xavi)** : l'élément `<header>` du site porte l'attribut `data-mv-entete` (rien d'autre). Il reçoit alors son propre groupe (`view-transition-name: mv-entete`, posé par `globals.css`), au-dessus de tout et sans animation : l'ancien contenu, figé à sa position défilée, ne passe jamais sur l'en-tête, collant ou non. Un seul élément du document peut porter cet attribut (l'en-tête réduit du tunnel aussi, s'il est seul).
- **Pied** : à chaque changement de page, défilée ou non, l'instantané racine (fond, pied) fond lui aussi : 220 ms, décalé de 80 ms comme le nouveau contenu, fondu enchaîné complémentaire en `plus-lighter` (le fond crème ne bouge pas). Aucun pied n'apparaît ni ne disparaît d'un coup, et le nouveau pied ne devient visible qu'une fois l'ancien contenu presque effacé (160 ms) : aucun ancien texte lisible sur lui. Rien à poser sur le pied. Séquences figées (0, 30, 80, 120, 160, 220, 300 ms ; depuis le haut d'une longue page, depuis le bas, et l'inverse) : `captures/lot-I-tour-3/sequence-{haut,bas,inverse}-{1440,390}.png`.
- **Rien à faire côté pages.** Ne pas ajouter d'autre `<ViewTransition>` sans m'en parler.
- Le premier chargement, la navigation sans JavaScript et les navigateurs sans View Transitions affichent la page sans aucun fondu.
- Le `<main>` reste dans `(site)/layout.tsx` (lot 0). Son premier enfant est `div.mv-page`.

## 2. `ImageFade` — fondu d'une image au décodage (A25)

```tsx
import { ImageFade } from "@/components/motion/ImageFade";
// Image à dimensions fixes : enveloppe sans boîte
<ImageFade><Image src={…} alt={…} width={…} height={…} /></ImageFade>
// Image `fill` : ImageFade EST le cadre positionné (Next exige un parent direct positionné)
<ImageFade className="relative aspect-[4/3] overflow-hidden bg-creme-soutenu">
  <Image src={…} alt={…} fill sizes={…} className="object-cover" />
</ImageFade>
```
Props : `className?` (le cadre ; sans lui, `display: contents`) et `as?: "div" | "span"`. Le fondu dure 300 ms, en opacité seule. Une image déjà chargée ou en erreur ne bouge pas.
**Ne jamais envelopper une image `priority`** (ILL-01, photo principale de la fiche) : le LCP n'attend jamais une animation. L'effet porte sur les `<img>` présentes au montage. Après un changement de `src`, changer la `key` d'`ImageFade`.

## 3. `HomeOpening` — ouverture de l'accueil (lot 3)

```tsx
<HomeOpening as="section" aria-labelledby="ouverture-titre" className="…">
  <h1 data-ouverture="titre" id="ouverture-titre">…</h1>
  <div data-ouverture="suite">{chapô + actions}</div>
  <div data-ouverture="illustration"><Illustration name="ILL-01" priority /></div>
</HomeOpening>
```
Le titre monte de 8 px en apparaissant. La suite fait de même, 80 ms plus tard. L'illustration apparaît en fondu seul, 160 ms plus tard. Chaque animation dure 340 ms : 500 ms au total. La séquence ne joue qu'au premier chargement du document, jamais après une navigation côté client : `data-mv-ouverture` vaut `serveur` dans le HTML du serveur (gardé tel quel à l'hydratation, grâce à `suppressHydrationWarning` sur l'enveloppe seule) et `client` quand l'accueil est monté après une navigation ; la CSS n'anime que `serveur`. Aucune lecture d'état pendant le rendu : `HomeOpening` peut être placé sous un `loading.tsx` ou une frontière `<Suspense>` sans désaccord d'hydratation (vérifié avec un `loading.tsx` temporaire : attribut `serveur`, animation jouée, aucun avertissement). **Écart assumé au brief §7** (voir journal) : c'est une animation CSS qui part à la première peinture, et non un état posé après l'hydratation, sinon le contenu déjà peint clignoterait. Elle est désactivée sans JavaScript (`@media (scripting: enabled)`) et sous `reduce`. Elle finit toujours visible.

## 4. Liens et boutons (Pirlo, déjà dans `globals.css`)

- Navigation : `.ui-lien-discret` (ou `<TextLink variant="discret">`). Le trait de 1 px se dessine en 180 ms. Avec `aria-current="page"`, le trait est présent.
- Liens dans le texte : `.ui-lien`. Le soulignement passe de 45 % à 100 % en 180 ms.
- Boutons : `ui-btn`. Seul le fond change, en 180 ms. Je n'ajoute aucune classe : sous `reduce`, je ramène le trait de navigation à 0 ms.

## 5. Carte de bien (lot 2, Pirlo)

Classes à poser : `mv-carte` sur le lien de la carte, `mv-carte-photo` sur l'`<img>`, `mv-carte-titre` sur le titre. Le cadre de la photo doit avoir `overflow: hidden` (ou `<ImageFade className="relative aspect-[4/3] overflow-hidden …">`). La photo passe à l'échelle 1,02 en 600 ms et le titre se souligne (filet fort) en 180 ms. Les deux effets sont réservés à `@media (hover: hover)`. Sous `reduce`, seul le soulignement reste. La combinaison avec `ImageFade` sur la même `<img>` est gérée.

## 6. Menu mobile (lot 1, Xavi)

Le panneau garde l'attribut `hidden` quand il est fermé et reçoit la classe `mv-panneau`. Le panneau entier s'ouvre et se ferme en fondu de 180 ms, sans glissement ni cascade des entrées. Il n'y a rien à faire en JS : on bascule simplement `hidden`. Le piège du focus et `Échap` restent au lot 1.

## 7. Visionneuse (lot 2, Pirlo)

- Ouverture et fermeture : `<dialog className="mv-panneau …">` avec `showModal()` / `close()`. Fondu de 180 ms. `Échap` est natif et le focus revient au déclencheur (vérifié).
- Changement de photo au clavier ou par les boutons : `<CrossFade cle={index} className="min-h-0 flex-1" calqueClassName="place-items-stretch">…photo…</CrossFade>`. Fondu enchaîné de 180 ms, sans déplacement. Par défaut, les calques centrent leur contenu ; un utilitaire passé en `calqueClassName` l'emporte.
- Au toucher, la galerie défile en scroll-snap natif, sans `CrossFade` : la photo suit le doigt.

## 8. Tunnel (lot 5, Xavi)

```tsx
<ProgressBar etape={2} total={4} libelles={["Le bien", "Ses caractéristiques", "Vous", "Vérification"]} />
<p>Étape 2 sur 4, ses caractéristiques</p>            {/* texte : lot 5 */}
<StepTransition etape={etape} sens={sens /* "avant" | "arriere" */} focusTitre onEntree={…}>
  <h2 data-titre-etape>Ses caractéristiques</h2> …
</StepTransition>
```
- `ProgressBar` : composant serveur ou client, sans état. Segments de 3 px : encre pour les étapes faites, grenat pour l'étape en cours, filet pour les étapes à venir. Le segment en cours se remplit en 300 ms (`scaleX`). Sans `libelles`, la barre est `aria-hidden`.
- `StepTransition` : l'étape quittée sort en fondu (120 ms) et garde son dernier contenu pendant ce temps. La nouvelle entre en 220 ms avec 12 px de translation : depuis la droite pour `avant`, depuis la gauche pour `arriere`. Le focus passe ensuite sur `[data-titre-etape]` (sinon sur le premier `h1`/`h2`), qui reçoit `tabindex="-1"`. Au montage, il n'y a ni animation ni focus. Sous `reduce`, l'échange et le focus sont immédiats. Pour le bouton Précédent du navigateur, calculer `sens` en comparant l'ancienne et la nouvelle étape.
- Champs liés au type : classe `mv-apparition` sur le champ ajouté (ou dont on retire `hidden`). Fondu de 180 ms, la place est prise d'un coup.
- Confirmation : `mv-apparition` sur le bloc, et `<ConfirmationCheck taille={40} />` dans le bloc. La coche se trace une seule fois en 400 ms quand le bloc est monté côté client (`data-mv-rendu="client"`). Rendue par le serveur (`data-mv-rendu="serveur"`, gardé à l'hydratation), elle est simplement dessinée. Même mécanisme que `HomeOpening` : aucune lecture d'état pendant le rendu, robuste à une frontière `<Suspense>`. La couleur est `--color-succes`.
- Message d'erreur : aucune classe. Il s'affiche sans mouvement (0 ms).

## 9. Ancres internes

`scroll-behavior: smooth` ne s'applique que sous `no-preference` **et** si `<html>` porte `data-scroll-behavior="smooth"`. Avec cet attribut, Next 16 repasse en défilement instantané pendant un changement de page. Sinon, le retour en haut de page serait animé. **Demande à Xavi (lot 0)** : ajouter cet attribut dans `src/app/layout.tsx`. Sans lui, le défilement des ancres reste instantané, ce qui est sûr.

## 10. Fichiers du lot

`src/components/motion/` : `tokens.ts`, `hydration.ts` (`useMarquerHydratation()`, `LIEU_DE_RENDU`), `reducedMotion.ts` (`useReducedMotion()`, `mouvementAutorise()`), `PageTransition.tsx`, `ImageFade.tsx`, `HomeOpening.tsx`, `StepTransition.tsx`, `ProgressBar.tsx`, `CrossFade.tsx`, `ConfirmationCheck.tsx`. S'y ajoutent `src/app/(site)/template.tsx`, le bloc « MOUVEMENT — Iniesta » de `globals.css` et la page de test `src/app/design-system/mouvement/*`.
