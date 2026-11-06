"use client";

import t from "./texte.module.css";

// « Imprimer le barème » : la feuille d'impression de la page tient lieu de
// PDF. Masqué à l'impression.
export function Imprimer() {
  return (
    <button
      type="button"
      className={t.boutonTexte}
      onClick={() => window.print()}
    >
      Imprimer le barème
    </button>
  );
}
