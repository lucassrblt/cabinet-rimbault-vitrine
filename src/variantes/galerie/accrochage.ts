// Accrochage de la salle « Biens » : un motif de cinq biens qui se répète,
// pour tenir de 1 à 12 biens (et au-delà) sans composition codée en dur.
//
//   grande   : une grande photo à gauche, cartel à droite
//   décalée  : une photo moyenne décalée à droite, cartel à sa gauche
//   duo      : deux petites en quinconce (paysage basse, portrait haute)
//   centre   : une photo moyenne au centre
//
// Un cycle = grande, décalée, duo, centre (1 + 1 + 2 + 1 = 5 biens). Le cycle
// suivant est accroché en miroir (gauche ↔ droite) pour que la répétition ne
// se voie pas. Si le duo n'a plus qu'un bien, il devient une pièce « centre ».
//
//   n = 1  : grande
//   n = 2  : grande, décalée
//   n = 3  : grande, décalée, centre
//   n = 4  : grande, décalée, duo
//   n = 5  : grande, décalée, duo, centre
//   n = 12 : [cycle] [cycle miroir] grande, décalée

export type Forme = "grande" | "decalee" | "duo" | "centre";

export type Piece<T> = {
  forme: Forme;
  items: T[];
  miroir: boolean;
  /** Rang du premier bien de la pièce dans la liste (pour l'accrochage mobile). */
  rang: number;
};

const CYCLE: readonly Forme[] = ["grande", "decalee", "duo", "centre"];

export function accrocher<T>(items: readonly T[]): Piece<T>[] {
  const pieces: Piece<T>[] = [];
  let i = 0;
  let pas = 0;
  while (i < items.length) {
    const forme = CYCLE[pas % CYCLE.length];
    const miroir = Math.floor(pas / CYCLE.length) % 2 === 1;
    if (forme === "duo") {
      const paire = items.slice(i, i + 2);
      pieces.push({
        forme: paire.length === 2 ? "duo" : "centre",
        items: paire,
        miroir,
        rang: i,
      });
      i += paire.length;
    } else {
      pieces.push({ forme, items: [items[i]], miroir, rang: i });
      i += 1;
    }
    pas += 1;
  }
  return pieces;
}
