import Link from "next/link";
import { agency } from "@/lib/agency";
import s from "./base.module.css";
import t from "./texte/texte.module.css";

// Contenu des pages 404 de la Galerie, sans <main> (celui du cadre) : la 404
// générale (`app/not-found.tsx`) et la variante « bien disparu »
// (`(galerie)/biens-introuvable`). Textes repris de la refonte.
export function Introuvable({
  title = "Cette page n’existe pas ou n’existe plus.",
  lead,
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <div className={`${s.w} ${s.g} ${t.introuvable}`}>
      <div className={t.introuvableTexte}>
        <h1>{title}</h1>
        {lead ? <p>{lead}</p> : null}
        <ul className={s.num}>
          <li>
            <Link className={s.u} href="/">
              Accueil
            </Link>
          </li>
          <li>
            <Link className={s.u} href="/biens">
              Nos biens
            </Link>
          </li>
          <li>
            <a className={s.u} href={agency.phone.href}>
              {agency.phone.display}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
