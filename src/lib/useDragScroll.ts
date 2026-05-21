import { type RefObject, useEffect } from "react";

/* ── Réglages (ajustables) ──────────────────────────────────────────── */
/** Déplacement (px) au-delà duquel un mouvement compte comme un drag. */
const DRAG_THRESHOLD = 6;
/** Friction appliquée à la vélocité à chaque frame d'inertie. */
const FRICTION = 0.94;
/** Vélocité (px/frame) sous laquelle l'inertie s'arrête. */
const MIN_VELOCITY = 0.3;
/** Au-delà de ce délai (ms) depuis le dernier mouvement, pas d'inertie. */
const STALE_MS = 80;

/**
 * Ajoute le drag-to-scroll **souris** (avec inertie) à un conteneur à scroll
 * horizontal natif. Le tactile / stylet est laissé au scroll natif, déjà fluide.
 *
 * - Snap CSS désactivé pendant le drag, réactivé une fois le mouvement reposé.
 * - Un glissé n'entraîne pas la navigation des liens enfants (clic supprimé en
 *   phase capture) ; un vrai clic (sans déplacement) reste fonctionnel.
 * - `prefers-reduced-motion` : pas d'inertie au relâchement.
 * - Pendant le drag, `body.is-grabbing` force le curseur `grabbing` (cf. globals.css).
 */
export function useDragScroll<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScrollLeft = 0;
    let lastX = 0;
    let lastMoveTime = 0;
    let velocity = 0;
    let momentumId = 0;

    const stopMomentum = () => {
      if (momentumId) cancelAnimationFrame(momentumId);
      momentumId = 0;
    };

    const runMomentum = () => {
      el.scrollLeft += velocity;
      velocity *= FRICTION;
      if (Math.abs(velocity) > MIN_VELOCITY) {
        momentumId = requestAnimationFrame(runMomentum);
      } else {
        momentumId = 0;
        el.style.scrollSnapType = "";
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      stopMomentum();
      dragging = true;
      moved = false;
      startX = e.clientX;
      lastX = e.clientX;
      lastMoveTime = e.timeStamp;
      startScrollLeft = el.scrollLeft;
      velocity = 0;
      el.setPointerCapture(e.pointerId);
      el.style.scrollSnapType = "none";
      document.body.classList.add("is-grabbing");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > DRAG_THRESHOLD) moved = true;
      el.scrollLeft = startScrollLeft - dx;
      velocity = lastX - e.clientX;
      lastX = e.clientX;
      lastMoveTime = e.timeStamp;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
      document.body.classList.remove("is-grabbing");
      const stale = e.timeStamp - lastMoveTime > STALE_MS;
      if (!reduced && !stale && Math.abs(velocity) > MIN_VELOCITY) {
        momentumId = requestAnimationFrame(runMomentum);
      } else {
        el.style.scrollSnapType = "";
      }
    };

    // Un glissé ne doit pas déclencher la navigation du lien sous le curseur.
    const onClickCapture = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    const onDragStart = (e: Event) => {
      e.preventDefault();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("dragstart", onDragStart);

    return () => {
      stopMomentum();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("dragstart", onDragStart);
      document.body.classList.remove("is-grabbing");
    };
  }, [ref]);
}
