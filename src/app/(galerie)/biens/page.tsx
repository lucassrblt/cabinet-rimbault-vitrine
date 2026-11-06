import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { formatSurface } from "@/lib/property/format";
import type { PropertyView } from "@/lib/property/view";
import { pageMetadata } from "@/lib/seo/metadata";
import { accrocher, type Forme } from "@/variantes/galerie/accrochage";
import s from "@/variantes/galerie/base.module.css";
import b from "@/variantes/galerie/biens.module.css";
import { Cartel, Photo } from "@/variantes/galerie/Cartel";
import {
  ficheHref,
  listViews,
  majuscule,
  moisCourant,
  photoAccrochage,
  serifSpaces,
  titreCartel,
  villesPhrase,
} from "@/variantes/galerie/data";

// Page Biens : la salle d'exposition. Les biens sont accrochés selon un motif
// de cinq positions qui se répète (voir accrochage.ts), puis la liste des
// biens ferme la salle.

export const metadata: Metadata = pageMetadata({
  title: "Nos biens à vendre et à louer à Asnières-sur-Seine",
  description:
    "Tous les appartements et maisons que nous proposons en ce moment à la vente et à la location, à Asnières-sur-Seine et alentour.",
  path: "/biens",
});

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Largeur affichée de chaque forme, pour `sizes` de next/image. */
const SIZES: Record<Forme, string> = {
  grande: "(min-width: 900px) 62vw, 100vw",
  decalee: "(min-width: 900px) 40vw, 80vw",
  duo: "(min-width: 900px) 32vw, 70vw",
  centre: "(min-width: 900px) 48vw, 90vw",
};

function Oeuvre({
  view,
  className,
  sizes,
  rang,
  total,
}: {
  view: PropertyView;
  className: string;
  sizes: string;
  rang: number;
  total: number;
}) {
  const photo = photoAccrochage(view);
  return (
    <Link
      href={ficheHref(view.reference)}
      className={`${s.oeuvre} ${b.oeuvre} ${className}`}
      data-m={rang % 5}
      data-rv
    >
      <Photo
        className={b.ph}
        src={photo?.url}
        alt={photo?.alt ?? view.title}
        sizes={sizes}
        eager={rang === 0}
      />
      <Cartel view={view} className={b.cartel} place={{ n: rang + 1, total }} />
    </Link>
  );
}

function intro(views: PropertyView[]): string {
  const surfaces = views
    .map((v) => v.surface)
    .filter((x): x is number => x !== null);
  const villes = villesPhrase(views);
  const parts: string[] = [];
  if (surfaces.length > 1) {
    const min = Math.min(...surfaces);
    const max = Math.max(...surfaces);
    if (min !== max)
      parts.push(`De ${formatSurface(min)} à ${formatSurface(max)}`);
  }
  if (villes) parts.push(villes);
  const lead = parts.length ? `${majuscule(parts.join(", "))}. ` : "";
  return `${lead}Nous faisons visiter chaque bien nous-mêmes, sur rendez-vous.`;
}

export default async function BiensChaude() {
  const views = await listViews();
  const pieces = views ? accrocher(views) : [];
  const n = views?.length ?? 0;

  return (
    <div className={b.salle}>
      <div className={`${s.w} ${s.g} ${b.salleT}`} data-rv>
        <h1 className={s.up}>
          Biens en vente
          <small className={s.num}>
            {n === 0
              ? moisCourant()
              : `${n} ${n > 1 ? "biens" : "bien"}, ${moisCourant()}`}
          </small>
        </h1>
        <p className={s.up} style={i(1)}>
          {views === null
            ? "La liste des biens est momentanément indisponible. Appelez le cabinet, nous vous dirons ce qui est en vente."
            : n === 0
              ? "Aucun bien en vente en ce moment. Les prochains seront accrochés ici dès leur mise en vente."
              : intro(views)}
        </p>
        {n > 1 ? (
          <a className={`${s.u} ${s.up} ${b.plan}`} style={i(2)} href="#liste">
            Liste des biens
          </a>
        ) : null}
      </div>

      <div className={`${s.w} ${b.mur}`}>
        {pieces.map((p) =>
          p.forme === "duo" ? (
            <div
              key={p.items[0].reference}
              className={`${s.g} ${b.piece} ${b.duo}`}
              data-miroir={p.miroir || undefined}
            >
              <Oeuvre
                view={p.items[0]}
                className={b.duoA}
                sizes={SIZES.duo}
                rang={p.rang}
                total={n}
              />
              <Oeuvre
                view={p.items[1]}
                className={b.duoB}
                sizes="(min-width: 900px) 24vw, 60vw"
                rang={p.rang + 1}
                total={n}
              />
            </div>
          ) : (
            <div
              key={p.items[0].reference}
              className={`${s.g} ${b.piece} ${b[p.forme]}`}
              data-miroir={p.miroir || undefined}
            >
              <Oeuvre
                view={p.items[0]}
                className={b.seule}
                sizes={SIZES[p.forme]}
                rang={p.rang}
                total={n}
              />
            </div>
          ),
        )}
      </div>

      {n > 1 ? (
        <section className={b.liste} id="liste" aria-labelledby="liste-t">
          <div className={s.w}>
            <h2 id="liste-t">Liste des biens</h2>
            <ul className={`${b.rows} ${s.num}`}>
              {views?.map((v) => (
                <li key={v.reference}>
                  <Link className={b.row} href={ficheHref(v.reference)}>
                    <span className={b.cRef}>{v.reference}</span>
                    <span className={b.cType}>
                      {titreCartel(v)}
                      {v.statusLabel ? <em>{v.statusLabel}</em> : null}
                      {v.isExclusive ? <em>Exclusivité</em> : null}
                    </span>
                    <span className={b.cSurf}>{v.surfaceLabel}</span>
                    <span className={b.cVille}>{v.city}</span>
                    <span className={b.cPrix}>{serifSpaces(v.priceLabel)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <div className={b.finSalle} />
      )}
    </div>
  );
}
