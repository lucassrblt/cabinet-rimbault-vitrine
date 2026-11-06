// Pied de page grenat profond : coordonnées, horaires (non confirmés par
// l'agent), liens, mentions légales d'`agency.ts`. Une mention `null` (médiateur,
// e-mail) est masquée, comme sur le site.
import Link from "next/link";
import { agency, agencyAddressLine } from "@/lib/agency";
import s from "./base.module.css";

export function Pied() {
  const { legal } = agency;
  return (
    <footer className={s.pied}>
      <div className={`${s.w} ${s.g} ${s.piedIn} ${s.num}`}>
        <div className={s.piedCol}>
          <b>{agency.name}</b>
          <span>{agencyAddressLine()}</span>
          <span>Depuis {agency.since}</span>
        </div>
        <div className={s.piedCol}>
          <a className={s.u} href={agency.phone.href}>
            {agency.phone.display}
          </a>
          {agency.email ? (
            <a className={s.u} href={`mailto:${agency.email}`}>
              {agency.email}
            </a>
          ) : null}
          {agency.hours.map((h) => (
            <span key={h.days}>
              {h.days}, {h.time}
            </span>
          ))}
          {agency.hoursConfirmed ? null : (
            <span className={s.tbc}>[horaires à confirmer]</span>
          )}
        </div>
        <div className={s.piedCol}>
          <Link className={s.u} href="/biens">
            Les biens en vente
          </Link>
          <Link className={s.u} href="/vendre">
            Vendre avec nous
          </Link>
          <Link className={s.u} href="/vendre/estimation">
            Estimer mon bien
          </Link>
          <Link className={s.u} href="/le-cabinet">
            Le cabinet
          </Link>
          <Link className={s.u} href="/contact">
            Contact
          </Link>
        </div>
        <div className={s.piedCol}>
          <Link className={s.u} href="/mentions-legales">
            Mentions légales
          </Link>
          <Link className={s.u} href="/honoraires">
            Honoraires
          </Link>
          <Link className={s.u} href="/confidentialite">
            Confidentialité
          </Link>
          {legal.mediator ? (
            <span>
              Médiateur de la consommation : {legal.mediator.name},{" "}
              {legal.mediator.address}
            </span>
          ) : null}
        </div>
        <p className={s.legal}>
          <span>{legal.card}</span>
          <span>{legal.company}</span>
          <span>{legal.guarantor}</span>
        </p>
      </div>
    </footer>
  );
}
