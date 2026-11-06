import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { agency } from "@/lib/agency";
import { getProperty } from "@/lib/api/properties";
import type { Property } from "@/lib/api/types";
import { ordinal, plural } from "@/lib/property/format";
import {
  type Fact,
  type PropertyView,
  pageTitle,
  referenceLabel,
  toPropertyView,
} from "@/lib/property/view";
import s from "@/variantes/galerie/base.module.css";
import { BASE, listViews, serifSpaces } from "@/variantes/galerie/data";
import { Energie } from "@/variantes/galerie/Energie";
import f from "@/variantes/galerie/fiche.module.css";
import { Galerie } from "@/variantes/galerie/Galerie";
import { type Onglet, Onglets } from "@/variantes/galerie/Onglets";

// Fiche : la grande photo au mur, le cartel détaillé à côté (référence,
// titre, lieu, prix et honoraires tels que l'API les donne, l'essentiel,
// demande de visite). Dessous, les onglets changent la couleur du mur ; le DPE
// et le GES restent visibles à droite.

type Props = { params: Promise<{ reference: string }> };

const i = (n: number) => ({ "--i": n }) as CSSProperties;

async function readReference(params: Props["params"]): Promise<string> {
  const { reference } = await params;
  try {
    return decodeURIComponent(reference);
  } catch {
    return reference;
  }
}

async function load(reference: string): Promise<Property | null | "erreur"> {
  try {
    return await getProperty(reference);
  } catch (error) {
    console.error(error);
    return "erreur";
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await load(await readReference(params));
  if (!property || property === "erreur") return { title: "Bien introuvable" };
  return { title: pageTitle(toPropertyView(property)) };
}

/** Lignes courtes du cartel : pièces, surface, extérieur, étage, énergie. */
function specsCartel(view: PropertyView): Fact[] {
  const fact = (prefix: string) =>
    view.facts.find((x) => x.label.startsWith(prefix));
  const out: Fact[] = [];
  const pieces = fact("Pièce");
  const chambres = fact("Chambre");
  if (pieces) {
    const n = Number(chambres?.value ?? 0);
    out.push({
      label: Number(pieces.value) > 1 ? "Pièces" : "Pièce",
      value: chambres
        ? `${pieces.value}, dont ${n} ${plural(n, "chambre")}`
        : pieces.value,
    });
  }
  if (view.surfaceLabel)
    out.push({ label: "Surface", value: view.surfaceLabel });
  const ext = fact("Extérieur");
  if (ext) out.push({ label: "Extérieur", value: ext.value });
  const etage = fact("Étage");
  if (etage) out.push(etage);
  const { dpe, ges } = view.energy;
  const energie = [
    dpe.grade ? `DPE ${dpe.grade}` : null,
    ges.grade ? `GES ${ges.grade}` : null,
  ].filter(Boolean);
  if (energie.length) out.push({ label: "Énergie", value: energie.join(", ") });
  return out;
}

function Specs({ items, className }: { items: Fact[]; className?: string }) {
  return (
    <dl className={`${f.specs} ${s.num} ${className ?? ""}`}>
      {items.map((x) => (
        <div key={x.label}>
          <dt>{x.label}</dt>
          <dd>{x.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function FicheChaude({ params }: Props) {
  const reference = await readReference(params);
  const property = await load(reference);
  if (property === "erreur") {
    return (
      <div className={`${s.w} ${f.erreur}`}>
        <h1>Cette fiche est momentanément indisponible.</h1>
        <p>
          Réessayez dans un instant, ou appelez le cabinet au{" "}
          <a className={s.u} href={agency.phone.href}>
            {agency.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }
  if (!property) notFound();

  const view = toPropertyView(property);
  const views = await listViews();
  const rang = views?.findIndex((v) => v.reference === view.reference) ?? -1;
  const visite =
    view.transaction === "LOCATION" ? "Visiter ce logement" : "Visiter ce bien";

  const onglets: Onglet[] = [];
  if (view.paragraphs.length) {
    onglets.push({
      id: "description",
      label: "Description",
      mur: "blanc",
      contenu: (
        <div className={f.texte}>
          {view.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      ),
    });
  }
  if (view.facts.length || view.copro.length) {
    onglets.push({
      id: "caracteristiques",
      label: "Pièces et surfaces",
      court: "Surfaces",
      mur: "creme",
      contenu: (
        <div className={f.caract}>
          {view.facts.length ? <Specs items={view.facts} /> : null}
          {view.copro.length ? (
            <>
              <h3>Copropriété et charges</h3>
              <Specs items={view.copro} />
            </>
          ) : null}
        </div>
      ),
    });
  }
  onglets.push({
    id: "visite",
    label: "Demander une visite",
    court: "Visite",
    mur: "poudre",
    contenu: (
      <div className={f.texte}>
        <p>
          Nous faisons visiter ce bien nous-mêmes, sur rendez-vous. Écrivez-nous
          en rappelant la{" "}
          {referenceLabel(view.reference).replace("Réf.", "référence")}, ou
          appelez le cabinet.
        </p>
        <div className={f.ctasRow}>
          <Link className={s.btn} href="/contact">
            Demander une visite
          </Link>
          <a
            className={`${s.btn} ${s.ghost} ${s.num}`}
            href={agency.phone.href}
          >
            {agency.phone.display}
          </a>
        </div>
      </div>
    ),
  });

  return (
    <div className={f.fiche}>
      <div className={`${s.w} ${s.g} ${f.sub}`}>
        <Link className={s.u} href={`${BASE}/biens`}>
          Retour aux biens
        </Link>
        {views && rang >= 0 ? (
          <span className={s.num}>
            {ordinal(rang + 1)} bien sur {views.length}
          </span>
        ) : null}
      </div>

      <div className={`${s.w} ${s.g} ${f.mur}`} data-rv>
        <Galerie images={view.images} />

        <div className={`${f.cartelD} ${s.num}`}>
          <span className={`${f.ref} ${s.up}`} style={i(1)}>
            {referenceLabel(view.reference)}
            {view.isExclusive ? <em> En exclusivité</em> : null}
            {view.statusLabel ? <em> {view.statusLabel}</em> : null}
          </span>
          <h1 className={s.up} style={i(1)}>
            {view.title}
          </h1>
          {view.subtitle ? (
            <p className={`${f.sousTitre} ${s.up}`} style={i(1)}>
              {view.subtitle}
            </p>
          ) : null}
          {view.place ? (
            <p className={`${f.lieu} ${s.up}`} style={i(2)}>
              {view.place}
            </p>
          ) : null}
          {view.priceAmount ? (
            <div className={s.up} style={i(2)}>
              <p className={f.prix}>
                {serifSpaces(view.priceAmount)}
                {view.priceSuffix ? <small> {view.priceSuffix}</small> : null}
              </p>
              {view.feeLines.length ? (
                <ul className={f.fees}>
                  {view.feeLines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
          <Specs items={specsCartel(view)} className={s.up} />
          <div className={`${f.ctas} ${s.up}`} style={i(4)}>
            <Link className={s.btn} href="/contact">
              Demander une visite
            </Link>
            <a
              className={`${s.btn} ${s.ghost} ${s.num}`}
              href={agency.phone.href}
            >
              {agency.phone.display}
            </a>
          </div>
        </div>
      </div>

      <Onglets
        onglets={onglets}
        aside={
          <Energie
            dpe={view.energy.dpe}
            ges={view.energy.ges}
            costs={view.energy.costs}
          />
        }
      >
        <div className={`${s.w} ${s.g} ${f.contact}`}>
          <h2>{visite}</h2>
          <p>
            Nous le faisons visiter nous-mêmes, sur rendez-vous. Appelez le
            cabinet ou passez au {agency.address.street}.
          </p>
          <a className={`${f.tel} ${s.num}`} href={agency.phone.href}>
            {agency.phone.display}
          </a>
        </div>
      </Onglets>

      {/* Mobile : la demande de visite et l'appel restent en bas de l'écran. */}
      <div className={f.mCta} data-barre-fixe>
        <Link className={s.btn} href="/contact">
          Demander une visite
        </Link>
        <a className={`${s.btn} ${s.ghost}`} href={agency.phone.href}>
          Appeler
        </a>
      </div>
    </div>
  );
}
