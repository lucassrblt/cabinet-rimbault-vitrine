import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ASNIERES, fr, phoneLabel } from "@/components/owners/typo";
import { faqVente } from "@/content/faq-vente";
import { feeSchedule } from "@/content/honoraires";
import { agency } from "@/lib/agency";
import { pageMetadata } from "@/lib/seo/metadata";
import s from "@/variantes/galerie/base.module.css";
import { DEROULE, ESTIMATION } from "@/variantes/galerie/vendre/contenu";
import v from "@/variantes/galerie/vendre/vendre.module.css";

// Vendre : la salle du vendeur. Une phrase d'entrée (la façon d'estimer du
// cabinet), le déroulé d'une vente accroché en six cartels numérotés, puis
// trois salles de texte (estimation, honoraires, questions) et un mur crème
// qui mène au tunnel `/vendre/estimation`. Textes de la refonte
// (`src/app/(site)/vendre`, `src/content/faq-vente.ts`, `honoraires.ts`).

export const metadata: Metadata = pageMetadata({
  title: "Vendre votre appartement ou votre maison à Asnières-sur-Seine",
  description:
    "Vendre un appartement ou une maison à Asnières-sur-Seine avec le Cabinet Rimbault : le déroulé de la vente, notre façon d’estimer, nos honoraires et les réponses à vos questions.",
  path: "/vendre",
});

const i = (n: number) => ({ "--i": n }) as CSSProperties;

const HONORAIRES_NEUTRE =
  "Leur montant, toutes taxes comprises, est fixé dans le mandat que nous signons ensemble.";

function Telephone() {
  return (
    <a
      className={`${s.u} ${s.num}`}
      href={agency.phone.href}
      aria-label={`Appeler le cabinet au ${agency.phone.display}`}
    >
      {phoneLabel(agency.phone.display)}
    </a>
  );
}

export default function VendreGalerie() {
  return (
    <div className={v.vendre}>
      <section className={`${s.w} ${s.g} ${v.entree}`} data-rv>
        <div className={v.entreeTexte}>
          <h1 className={s.up}>{`Vendre votre bien à ${ASNIERES}`}</h1>
          <p className={`${v.phrase} ${s.up}`} style={i(1)}>
            {fr(
              "Nous commençons toujours par une visite. Le prix que nous vous donnons est celui auquel nous pensons pouvoir vendre, pas celui qui ferait plaisir.",
            )}
          </p>
          <div className={`${v.actions} ${s.up}`} style={i(2)}>
            <Link className={s.btn} href={ESTIMATION}>
              Faire estimer votre bien
            </Link>
            <Telephone />
          </div>
        </div>
      </section>

      <section
        className={`${s.w} ${v.deroule}`}
        aria-labelledby="deroule"
        data-rv
      >
        <h2 id="deroule" className={`${v.titre} ${s.up} ${s.flotte}`}>
          Comment se passe une vente
        </h2>
        <ol className={v.etapes}>
          {DEROULE.map((etape, n) => (
            <li key={etape.titre} className={s.up} style={i(n + 1)}>
              <span className={`${v.chiffre} ${s.num}`} aria-hidden>
                {n + 1}
              </span>
              <span className={v.etapeTitre}>{etape.titre}</span>
              <span className={v.etapeTexte}>{fr(etape.texte)}</span>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={`${s.w} ${s.g} ${v.salle}`}
        aria-labelledby="estimation"
        data-rv
      >
        <h2 id="estimation" className={`${v.titre} ${s.up} ${s.flotte}`}>
          Notre estimation
        </h2>
        <div className={`${v.prose} ${s.up}`} style={i(1)}>
          <p>
            {fr(
              "Nous ne donnons pas de prix en ligne : un prix sérieux demande de voir le bien. Pendant la visite, nous regardons ce qui fait sa valeur : la surface, l'étage, l'exposition, l'état, la copropriété et les ventes récentes du quartier.",
            )}
          </p>
          <p>
            {fr(
              "Si le prix que vous espérez nous paraît trop haut, nous vous le disons, quitte à ne pas prendre le mandat. Un prix trop haut fait perdre des mois et finit par décoter le bien.",
            )}
          </p>
          <p>
            Pour demander une visite d’estimation,{" "}
            <Link className={s.u} href={ESTIMATION}>
              décrivez-nous votre bien
            </Link>{" "}
            ou appelez-⁠nous au <Telephone />.
          </p>
        </div>
      </section>

      <section
        className={`${s.w} ${s.g} ${v.salle}`}
        aria-labelledby="honoraires"
        data-rv
      >
        <h2 id="honoraires" className={`${v.titre} ${s.up} ${s.flotte}`}>
          Nos honoraires de vente
        </h2>
        <div className={`${v.prose} ${s.up}`} style={i(1)}>
          {feeSchedule ? (
            <>
              <p>{fr(feeSchedule.sale.summary)}</p>
              <p>
                <Link className={s.u} href="/honoraires">
                  Consulter notre barème d’honoraires
                </Link>
              </p>
            </>
          ) : (
            <p>
              {fr(HONORAIRES_NEUTRE)}{" "}
              <span className={s.tbc}>[barème à fournir]</span>
            </p>
          )}
        </div>
      </section>

      <section
        className={`${s.w} ${s.g} ${v.salle}`}
        aria-labelledby="questions"
        data-rv
      >
        <h2 id="questions" className={`${v.titre} ${s.up} ${s.flotte}`}>
          Questions fréquentes
        </h2>
        <div className={`${v.faq} ${s.up}`} style={i(1)}>
          {faqVente.map((entry) => (
            <details key={entry.question}>
              <summary>{fr(entry.question)}</summary>
              <div className={v.reponse}>
                {entry.answer.map((paragraph) => (
                  <p key={paragraph}>{fr(paragraph)}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className={v.fin} aria-labelledby="parlons" data-rv>
        <div className={`${s.w} ${s.g} ${v.finIn}`}>
          <div className={v.finTexte}>
            <h2 id="parlons" className={`${v.phrase} ${s.up}`}>
              Parlons de votre bien
            </h2>
            <p className={s.up} style={i(1)}>
              {fr(
                "Appelez-nous, ou décrivez-nous votre bien en ligne : nous vous recontactons pour convenir d'une visite.",
              )}
            </p>
          </div>
          <div className={`${v.finActions} ${s.up}`} style={i(2)}>
            <Link className={s.btn} href={ESTIMATION}>
              Faire estimer votre bien
            </Link>
            <Telephone />
          </div>
        </div>
      </section>
    </div>
  );
}
