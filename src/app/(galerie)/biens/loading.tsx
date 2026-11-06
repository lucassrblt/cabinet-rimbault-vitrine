import s from "@/variantes/galerie/base.module.css";
import b from "@/variantes/galerie/biens.module.css";

// Squelette de la salle pendant que l'API répond : le titre, puis les deux
// premières positions de l'accrochage (grande, décalée) avec leur cartel.

function Cartel() {
  return (
    <div className={`${s.cartel} ${b.cartel}`}>
      <span className={`${s.sq} ${s.sqL}`} style={{ width: "40%" }} />
      <span className={`${s.sq} ${s.sqL}`} style={{ width: "85%" }} />
      <span className={`${s.sq} ${s.sqL}`} style={{ width: "60%" }} />
      <span className={`${s.sq} ${s.sqL}`} style={{ width: "50%" }} />
    </div>
  );
}

export default function ChargementBiens() {
  return (
    <div className={b.salle} aria-busy="true">
      <p className={s.sr}>Chargement des biens…</p>
      <div className={`${s.w} ${s.g} ${b.salleT}`}>
        <h1>
          Biens en vente
          <small>
            <span className={`${s.sq} ${s.sqL}`} style={{ width: "9em" }} />
          </small>
        </h1>
        <p>
          <span className={`${s.sq} ${s.sqL}`} />
          <span className={`${s.sq} ${s.sqL}`} style={{ width: "70%" }} />
        </p>
      </div>
      <div className={`${s.w} ${b.mur}`}>
        {(["grande", "decalee"] as const).map((forme) => (
          <div key={forme} className={`${s.g} ${b.piece} ${b[forme]}`}>
            <div className={`${s.oeuvre} ${b.oeuvre} ${b.seule}`}>
              <div className={`${s.ph} ${s.sq} ${b.ph}`} />
              <Cartel />
            </div>
          </div>
        ))}
      </div>
      <div className={b.finSalle} />
    </div>
  );
}
