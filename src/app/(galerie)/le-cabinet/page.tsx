import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { agency } from "@/lib/agency";
import { pageMetadata } from "@/lib/seo/metadata";
import s from "@/variantes/galerie/base.module.css";
import c from "@/variantes/galerie/cabinet.module.css";
import { avisGoogle } from "@/variantes/galerie/data";
import { Note } from "@/variantes/galerie/Note";

// Le cabinet : le seul mur grenat du site. La devanture en vraie couleur dans
// un passe-partout crème, son cartel, le texte de salle en serif, puis trois
// repères (depuis 2009, la note Google, un avis).

export const metadata: Metadata = pageMetadata({
  title:
    "Le Cabinet Rimbault, agence immobilière indépendante à Asnières depuis 2009",
  description: `Installé au ${agency.address.street} à ${agency.address.city} depuis ${agency.since}, le ${agency.name} vend et loue des appartements et des maisons. Notre façon de travailler, nos avis et nos informations professionnelles.`,
  path: "/le-cabinet",
});

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Premier avis réel s'il est disponible, coupé à la fin d'une phrase. */
function extrait(text: string, max = 140): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "));
  return end > 40 ? cut.slice(0, end + 1) : `${cut.trimEnd()}…`;
}

export default async function CabinetGalerie() {
  const { note, nombre, avis } = await avisGoogle();

  return (
    <div className={c.cab}>
      <div className={`${s.w} ${s.g} ${c.accro}`} data-rv>
        <div className={`${c.cadre} ${s.fade}`}>
          <div className={`${s.ph} ${c.photo}`}>
            <Image
              src="/devanture.jpg"
              alt={`La devanture grenat du cabinet, ${agency.address.street}`}
              fill
              sizes="(min-width: 900px) 28vw, 80vw"
              loading="eager"
            />
          </div>
        </div>
        <div className={`${s.cartel} ${c.cartel}`}>
          <span className={`${s.ti} ${s.up}`} style={i(2)}>
            La devanture
          </span>
          <span className={s.up} style={i(2)}>
            {agency.address.street}, {agency.address.city}
          </span>
          <span className={s.up} style={i(3)}>
            Photographie provisoire{" "}
            <span className={s.tbc}>[nouvelle prise de vue à prévoir]</span>
          </span>
        </div>
        <div className={c.texte}>
          <h1 className={s.up} style={i(1)}>
            Le cabinet
          </h1>
          <p className={s.up} style={i(2)}>
            Depuis {agency.since}, le cabinet occupe la devanture grenat du{" "}
            {agency.address.street}, à {agency.address.city}.
          </p>
          <p className={s.up} style={i(3)}>
            Agent immobilier indépendant, nous ne présentons jamais plus d’une
            dizaine de biens à la fois. Chacun est visité, photographié et
            décrit par nous, et c’est encore nous qui ouvrons la porte le jour
            de la visite.
          </p>
          <p className={s.up} style={i(4)}>
            Si vous vendez, venez en parler au cabinet
            {agency.hoursConfirmed ? (
              "."
            ) : (
              <>
                {" "}
                <span className={s.tbc}>[horaires à confirmer]</span>.
              </>
            )}
          </p>
        </div>
      </div>

      <div className={`${s.w} ${s.g} ${s.num} ${c.faits}`} data-rv>
        <div className={s.up}>
          <b>{agency.since}</b>
          au {agency.address.street}
        </div>
        <div className={s.up} style={i(1)}>
          <b>
            <Note value={note} />
            /5
          </b>
          <a href={agency.google.href} target="_blank" rel="noopener">
            sur Google, {nombre} avis
          </a>
        </div>
        <div className={s.up} style={i(2)}>
          {avis ? (
            <figure className={c.avis}>
              <blockquote>
                <q>{extrait(avis.text)}</q>
              </blockquote>
              <figcaption>{avis.authorName}, sur Google</figcaption>
            </figure>
          ) : (
            <figure className={c.avis}>
              <blockquote>
                <q>Des visites préparées, des réponses le jour même.</q>
              </blockquote>
              <figcaption className={s.tbc}>[avis exemple]</figcaption>
            </figure>
          )}
          <Link className={s.u} href="/vendre">
            Nous confier votre bien
          </Link>
        </div>
      </div>
    </div>
  );
}
