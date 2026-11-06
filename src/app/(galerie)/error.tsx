"use client";

import { useEffect } from "react";
import { agency } from "@/lib/agency";
import s from "@/variantes/galerie/base.module.css";
import t from "@/variantes/galerie/texte/texte.module.css";

// Erreur inattendue dans une page du site : l'en-tête et le pied du cadre
// Galerie restent affichés. Texte repris de la refonte (`ServiceError`).
// « Réessayer » en lien discret : l'appel reste la sortie principale.
// Next 16.3 : `retry` refait la requête.

export default function GalerieError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={`${s.w} ${s.g} ${t.introuvable}`}>
      <div className={t.introuvableTexte}>
        <h1>Un problème technique empêche l’affichage de cette page.</h1>
        <p>
          Vous pouvez réessayer dans un instant, ou nous appeler au{" "}
          <a className={`${s.u} ${s.num}`} href={agency.phone.href}>
            {agency.phone.display}
          </a>
          .
        </p>
        <ul>
          <li>
            <button
              type="button"
              className={t.boutonTexte}
              onClick={() => retry()}
            >
              Réessayer
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
