// Apparitions : chaque bloc `data-rv`, et chacun de ses `.up` et `.fade`,
// reçoit `data-in` une fois, à sa propre entrée à l'écran.
//
// Une page diffusée derrière un `loading.tsx` est hydratée après le reste :
// poser `data-in` sur son HTML avant son hydratation la ferait diverger du
// rendu serveur. Ces pages marquent leur racine `data-rv-local` et y montent
// `<Revele />` ; l'observateur du mur (`Mur`) ne touche pas à cette zone.
import s from "./base.module.css";

const CIBLES = ["[data-rv]", `[data-rv] .${s.up}`, `[data-rv] .${s.fade}`];
const TOUTES = CIBLES.join(", ");
const RESTANTES = CIBLES.map((c) => `${c}:not([data-in])`).join(", ");
export const ZONE_LOCALE = "data-rv-local";

/**
 * Observe les apparitions sous `racine`. `horsZones` : ignorer les zones
 * locales (observateur du mur). Renvoie la fonction d'arrêt.
 */
export function observerApparitions(
  racine: ParentNode,
  { horsZones = false }: { horsZones?: boolean } = {},
): () => void {
  const garder = (el: Element) => !horsZones || !el.closest(`[${ZONE_LOCALE}]`);

  if (!("IntersectionObserver" in window)) {
    for (const el of racine.querySelectorAll(TOUTES)) {
      if (garder(el)) el.setAttribute("data-in", "");
    }
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      }
    },
    // Dès que le bloc touche l'écran : rien ne reste masqué en bas de page.
    { threshold: 0.01, rootMargin: "0px 0px -2% 0px" },
  );
  const scan = () => {
    for (const el of racine.querySelectorAll(RESTANTES)) {
      if (garder(el)) io.observe(el);
    }
  };
  scan();
  const mo = new MutationObserver(scan);
  mo.observe(racine, { childList: true, subtree: true });
  return () => {
    mo.disconnect();
    io.disconnect();
  };
}
