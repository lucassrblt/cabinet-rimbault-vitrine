import s from "@/variantes/galerie/base.module.css";
import f from "@/variantes/galerie/fiche.module.css";

// Squelette de la fiche pendant que l'API répond : la photo au mur et le
// cartel détaillé, aux mêmes places que la fiche.
export default function ChargementFiche() {
  const ligne = (width: string) => (
    <span className={`${s.sq} ${s.sqL}`} style={{ width }} />
  );
  return (
    <div className={f.fiche} aria-busy="true">
      <p className={s.sr}>Chargement du bien…</p>
      <div className={`${s.w} ${s.g} ${f.sub}`}>{ligne("8em")}</div>
      <div className={`${s.w} ${s.g} ${f.mur}`}>
        <div className={f.gal}>
          <div className={`${s.ph} ${s.sq} ${f.main}`} />
        </div>
        <div className={f.cartelD}>
          {ligne("35%")}
          <span className={`${s.sq} ${s.sqL}`} style={{ height: "1.6em" }} />
          {ligne("70%")}
          {ligne("55%")}
          {ligne("80%")}
          {ligne("60%")}
        </div>
      </div>
    </div>
  );
}
