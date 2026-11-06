// Barre de progression du tunnel (planche de Pirlo, `.etapes`) : un segment
// de 3 px par étape. Fait = encre, en cours = grenat, à venir = filet.
//
// Mouvement (brief §7) : le segment en cours se remplit, `scaleX` de 0 à 1
// depuis la gauche, en 300 ms. C'est une transition CSS déclenchée par le
// changement d'étape : le rendu serveur est déjà dans l'état final (rien
// n'est masqué sans JavaScript), le premier affichage ne s'anime pas, et
// un retour arrière vide le segment quitté par le même mouvement inversé.
//
// Composant serveur ou client, sans état. Le texte « Étape 2 sur 4, ses
// caractéristiques » reste à la charge de la page (lot 5).

type Props = {
  /** Étape en cours, de 1 à `total`. */
  etape: number;
  /** Nombre d'étapes (4 dans le tunnel). */
  total: number;
  /**
   * Libellés des étapes, lus par les lecteurs d'écran (un par segment).
   * Absent : la barre est décorative (`aria-hidden`).
   */
  libelles?: readonly string[];
  className?: string;
};

export function ProgressBar({ etape, total, libelles, className }: Props) {
  const segments = Array.from({ length: total }, (_, i) => i + 1);
  const lisible = libelles !== undefined && libelles.length === total;

  return (
    <ol
      className={["mv-progression", className].filter(Boolean).join(" ")}
      aria-label={lisible ? "Progression" : undefined}
      aria-hidden={lisible ? undefined : true}
    >
      {segments.map((n) => {
        const etat = n < etape ? "fait" : n === etape ? "encours" : "avenir";
        return (
          <li
            key={n}
            data-etat={etat}
            aria-current={n === etape ? "step" : undefined}
          >
            <span className="mv-progression-remplissage" />
            {lisible ? (
              <span className="sr-only">
                {libelles[n - 1]}
                {etat === "fait" ? ", terminée" : ""}
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
