import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { pickReviews } from "@/components/agency/reviewExcerpt";
import { hoursLine } from "@/components/layout/typo";
import { agency, commitments } from "@/lib/agency";
import { getGoogleReviews } from "@/lib/reviews/google";
import a from "@/variantes/galerie/accueil.module.css";
import s from "@/variantes/galerie/base.module.css";
import { Cartel, Photo } from "@/variantes/galerie/Cartel";
import {
  BASE,
  enLettres,
  ficheHref,
  listViews,
  moisCourant,
  photoAccrochage,
} from "@/variantes/galerie/data";

// Accueil de la Galerie chaude, composé comme le parcours d'une galerie :
// 1. l'agence d'abord : texte d'entrée et devanture accrochée avec son cartel ;
// 2. l'exposition en cours : trois biens au plus en petit accrochage ;
// 3. ce que nous faisons : trois cartels textuels (mur crème) ;
// 4. notre façon de travailler : les engagements d'`agency.ts` ;
// 5. ce que disent nos clients : avis Google réels (mur poudré) ;
// 6. passez nous voir : adresse, téléphone, horaires, itinéraire.
// Puis le pied grenat. Le mur grenat reste réservé à la page Le cabinet.
//
// Textes : repris du site existant sans changer les faits (accueil
// `Opening`, `Services`, `Commitments`, `FindUs`, page Le cabinet,
// `ReviewsSummary`). Rien n'est inventé.

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Trois métiers : textes de `src/components/home/Services.tsx`. */
const METIERS = [
  {
    titre: "Vente",
    texte:
      "Nous vendons des appartements et des maisons à Asnières-sur-Seine et dans les communes voisines, de la première visite jusqu’à la signature chez le notaire.",
    href: "/vendre",
    lien: "Vendre avec nous",
  },
  {
    titre: "Location",
    texte:
      "Pour les propriétaires, nous estimons le loyer, trouvons le locataire et préparons le bail.",
    href: "/louer",
    lien: "Louer avec nous",
  },
  {
    titre: "Estimation",
    texte:
      "Nous ne donnons pas de prix en ligne. Nous venons voir votre bien, puis nous vous disons à quel prix nous pensons pouvoir le vendre, ou à quel loyer le louer.",
    href: "/estimation",
    lien: "Faire estimer",
  },
] as const;

/** Positions du petit accrochage (trois biens au plus). */
const PETIT = ["pa", "pb", "pc"] as const;

const integer = new Intl.NumberFormat("fr-FR");

export default async function AccueilChaude() {
  const [views, google] = await Promise.all([listViews(), getGoogleReviews()]);
  const note = google
    ? google.rating.toFixed(1).replace(".", ",")
    : agency.google.rating;
  const nombre = google?.totalCount ?? agency.google.count;
  const avis = google ? pickReviews(google.reviews, 3) : [];
  const avisHref =
    google?.sourceUrl || agency.google.profileUrl || agency.google.href;
  const expo = views?.slice(0, 3) ?? [];
  const n = views?.length ?? 0;
  const { street, postalCode, city } = agency.address;

  return (
    <div className={a.accueil}>
      {/* 1. L'agence d'abord */}
      <section
        className={`${s.w} ${s.g} ${a.entree}`}
        aria-labelledby="entree-t"
        data-rv
      >
        <div className={a.entreeTexte}>
          <h1 id="entree-t" className={s.up}>
            Agent immobilier indépendant, au {street} à{" "}
            <span className={a.insec}>{city}</span> depuis {agency.since}.
          </h1>
          <p className={s.up} style={i(1)}>
            Nous vendons et louons des appartements et des maisons dans la ville
            et les communes voisines. La même personne vous suit du premier
            rendez-vous à la signature.
          </p>
          <div className={`${a.actions} ${s.up}`} style={i(2)}>
            <Link className={s.btn} href="/estimation">
              Faire estimer votre bien
            </Link>
            <Link className={s.u} href={`${BASE}/biens`}>
              {n > 0 ? `Voir les biens (${n})` : "Voir les biens"}
            </Link>
          </div>
          <p className={`${a.note} ${s.num} ${s.up}`} style={i(3)}>
            <a href={avisHref} target="_blank" rel="noopener">
              Avis Google{"\u202f"}: {note} sur 5 ({integer.format(nombre)}{" "}
              avis)
            </a>
          </p>
        </div>

        <figure className={a.devanture}>
          <div className={`${a.cadre} ${s.fade}`}>
            <div className={`${s.ph} ${a.photo}`}>
              <Image
                src="/variantes/devanture.jpg"
                alt={`La devanture grenat du cabinet, ${street}`}
                fill
                sizes="(min-width: 900px) 24vw, 70vw"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
          <figcaption className={`${s.cartel} ${a.devCartel}`}>
            <span className={`${s.ti} ${s.up}`} style={i(2)}>
              La devanture
            </span>
            <span className={s.up} style={i(2)}>
              {street}, {city}
            </span>
            <span className={s.up} style={i(3)}>
              Photographie provisoire{" "}
              <span className={s.tbc}>[nouvelle prise de vue à prévoir]</span>
            </span>
          </figcaption>
        </figure>
      </section>

      {/* 2. L'exposition en cours (absente sans bien ou si l'API échoue) */}
      {expo.length > 0 ? (
        <section className={`${s.w} ${a.expo}`} aria-labelledby="expo-t">
          <div className={`${s.g} ${a.tete}`} data-rv>
            <h2 id="expo-t" className={s.up}>
              Nos biens du moment
              <small className={s.num}>
                {n} {n > 1 ? "biens en vente" : "bien en vente"},{" "}
                {moisCourant()}
              </small>
            </h2>
            {n > expo.length ? (
              <Link
                className={`${s.u} ${s.up} ${a.teteLien}`}
                style={i(1)}
                href={`${BASE}/biens`}
              >
                Voir les {enLettres(n)} biens
              </Link>
            ) : null}
          </div>
          <div className={`${s.g} ${a.petit}`} data-n={expo.length}>
            {expo.map((v, k) => (
              <Link
                key={v.reference}
                href={ficheHref(v.reference)}
                className={`${s.oeuvre} ${a.po} ${a[PETIT[k]]}`}
                data-m={k}
                data-rv
              >
                <Photo
                  className={a.poPh}
                  src={photoAccrochage(v)?.url}
                  alt={photoAccrochage(v)?.alt ?? v.title}
                  sizes="(min-width: 900px) 30vw, 80vw"
                />
                <Cartel view={v} className={a.poCartel} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* 3. Ce que nous faisons */}
      <section className={`${a.mur} ${a.creme}`} aria-labelledby="metiers-t">
        <div className={`${s.w} ${s.g} ${a.bloc}`} data-rv>
          <h2 id="metiers-t" className={`${a.blocT} ${s.up}`}>
            Ce que nous faisons
          </h2>
          <ul className={a.metiers}>
            {METIERS.map((m, k) => (
              <li key={m.titre} className={s.up} style={i(k + 1)}>
                <h3>{m.titre}</h3>
                <p>{m.texte}</p>
                <Link className={s.u} href={m.href}>
                  {m.lien}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Notre façon de travailler */}
      <section className={a.mur} aria-labelledby="facon-t">
        <div className={`${s.w} ${s.g} ${a.bloc}`} data-rv>
          <h2 id="facon-t" className={`${a.blocT} ${s.up}`}>
            Notre façon de travailler
          </h2>
          <ul className={a.engagements}>
            {commitments.map((c, k) => (
              <li key={c.title} className={s.up} style={i(k + 1)}>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
          <Link
            className={`${s.u} ${s.up} ${a.blocLien}`}
            style={i(4)}
            href={`${BASE}/le-cabinet`}
          >
            Mieux connaître le cabinet
          </Link>
        </div>
      </section>

      {/* 5. Ce que disent nos clients */}
      <section className={`${a.mur} ${a.poudre}`} aria-labelledby="avis-t">
        <div className={`${s.w} ${s.g} ${a.bloc}`} data-rv>
          <div className={a.blocT}>
            <h2 id="avis-t" className={s.up}>
              Ce que disent nos clients
            </h2>
            <p className={`${a.noteAvis} ${s.num} ${s.up}`} style={i(1)}>
              {note} sur 5, note moyenne de nos clients sur Google, sur{" "}
              {integer.format(nombre)} avis.
            </p>
          </div>
          {avis.length > 0 ? (
            <ul className={a.avis}>
              {avis.map((r, k) => (
                <li key={r.id} className={s.up} style={i(k + 1)}>
                  <figure>
                    <blockquote>
                      <p>« {r.excerpt} »</p>
                    </blockquote>
                    <figcaption className={s.num}>
                      {r.authorName}, {r.rating} sur 5
                      {r.relativeTime ? `, ${r.relativeTime}` : ""}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : null}
          <div className={`${a.avisPied} ${s.up}`} style={i(4)}>
            {avis.length > 0 ? (
              <p>
                Extraits des avis que Google affiche en premier, cités sans
                retouche et parfois abrégés […].
              </p>
            ) : null}
            <a className={s.u} href={avisHref}>
              Lire tous les avis sur Google
            </a>
          </div>
        </div>
      </section>

      {/* 6. Passez nous voir */}
      <section className={a.mur} aria-labelledby="venir-t">
        <div className={`${s.w} ${s.g} ${a.bloc} ${a.venir}`} data-rv>
          <h2 id="venir-t" className={`${a.blocT} ${s.up}`}>
            Passez nous voir
          </h2>
          <address className={`${a.adresse} ${s.up}`} style={i(1)}>
            <span className={a.lab}>Adresse</span>
            {street}
            <br />
            {postalCode} {city}
            <a className={s.u} href={agency.mapsDirections}>
              Itinéraire
            </a>
          </address>
          <div className={`${a.adresse} ${s.num} ${s.up}`} style={i(2)}>
            <span className={a.lab}>Téléphone</span>
            <a className={a.telGrand} href={agency.phone.href}>
              {agency.phone.display}
            </a>
          </div>
          <div className={`${a.adresse} ${s.num} ${s.up}`} style={i(3)}>
            <span className={a.lab}>Horaires</span>
            {agency.hoursConfirmed ? (
              <dl className={a.horaires}>
                {agency.hours.map((h) => (
                  <div key={h.days}>
                    <dt>{h.days}</dt>
                    <dd>{hoursLine(h.time)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <span className={s.tbc}>[horaires à confirmer]</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
