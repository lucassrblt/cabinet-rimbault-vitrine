import Link from "next/link";
import { agency } from "@/lib/agency";
import s from "@/variantes/galerie/base.module.css";
import { BASE } from "@/variantes/galerie/data";
import f from "@/variantes/galerie/fiche.module.css";

// 404 de la variante : rendue dans le layout de la variante (en-tête, mur,
// pied), pour une fiche à référence inconnue ou une adresse sans page sous
// /galerie.
export default function IntrouvableChaude() {
  return (
    <div className={`${s.w} ${f.erreur}`}>
      <h1>Ce bien n’est plus en ligne.</h1>
      <p>
        Il a peut-être été vendu, ou l’adresse est incomplète.{" "}
        <Link className={s.u} href={`${BASE}/biens`}>
          Voir les biens en vente
        </Link>{" "}
        ou appeler le cabinet au{" "}
        <a className={`${s.u} ${s.num}`} href={agency.phone.href}>
          {agency.phone.display}
        </a>
        .
      </p>
    </div>
  );
}
