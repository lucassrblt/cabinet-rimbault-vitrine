import type { Metadata } from "next";
import Image from "next/image";
import { agency } from "@/lib/agency";
import s from "@/variantes/galerie/base.module.css";
import { galerieFonts } from "@/variantes/galerie/fonts";
import m from "@/variantes/galerie/maintenance.module.css";

// Page de la porte de maintenance (`MAINTENANCE_MODE=on`), servie par
// `src/proxy.ts` à la place de toute adresse tant que le visiteur n'a pas le
// cookie `site-preview`. Hors du groupe (galerie) : pas de navigation, dont
// chaque lien ramènerait ici. En-tête simplifié (marque, téléphone), texte de
// la page de maintenance de main, devanture, adresse.
//
// Pas de `Mur` : il lit le chemin AFFICHÉ (l'adresse demandée, la réécriture
// la conserve) et peindrait le mur en grenat sur `/le-cabinet`.
// Porte ouverte, le proxy renvoie `/maintenance` vers la 404 générale.

export const metadata: Metadata = {
  title: "Site en cours de développement",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className={`${galerieFonts} ${s.site}`} data-mur="blanc">
      <header className={`${s.w} ${s.g} ${s.nav}`}>
        <span className={s.brand}>{agency.name}</span>
        <a className={`${m.tel} ${s.num}`} href={agency.phone.href}>
          {agency.phone.display}
        </a>
      </header>
      <main className={`${s.main} ${s.w} ${s.g} ${m.salle}`}>
        <div className={m.texte}>
          <h1>Site en cours de développement</h1>
          <p>
            Nous travaillons actuellement sur notre nouveau site web. Il sera
            bientôt disponible avec de nombreuses améliorations.
          </p>
          <p className={m.bientot}>Revenez bientôt.</p>
          <div className={`${m.cartel} ${s.num}`}>
            <h2>Passez nous voir</h2>
            <address>
              {agency.address.street}
              <br />
              {agency.address.postalCode} {agency.address.city}
            </address>
            <a className={s.u} href={agency.phone.href}>
              {agency.phone.display}
            </a>
          </div>
        </div>
        <div className={`${s.ph} ${m.photo}`}>
          <Image
            src="/devanture.jpg"
            alt={`La devanture grenat du cabinet, ${agency.address.street}`}
            fill
            priority
            sizes="(min-width: 900px) 30vw, 80vw"
          />
        </div>
      </main>
    </div>
  );
}
