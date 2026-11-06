import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { agency } from "@/lib/agency";
import { getProperty } from "@/lib/api/properties";
import {
  type PropertyView,
  referenceLabel,
  toPropertyView,
} from "@/lib/property/view";
import { pageMetadata } from "@/lib/seo/metadata";
import s from "@/variantes/galerie/base.module.css";
import f from "@/variantes/galerie/contact/contact.module.css";
import {
  type BienCite,
  FormulaireContact,
} from "@/variantes/galerie/contact/FormulaireContact";
import { isObjet, type Objet } from "@/variantes/galerie/contact/sujets";
import { ficheHref, serifSpaces } from "@/variantes/galerie/data";

// Contact : une seule salle. La phrase serif et le numéro en grand (le plus
// simple est d'appeler), puis la devanture en vraie couleur dans son
// passe-partout crème, avec son cartel « passez nous voir » (adresse,
// horaires, itinéraire), et le formulaire en lignes fines.
// Sous 900 px : appeler, écrire, puis la devanture.
// Depuis une fiche (`?ref=10.131`) : l'objet « Un bien en particulier » est
// choisi, la référence et le message de visite remplis, le bien rappelé en
// petit au-dessus du formulaire. `?objet=` (bien, vente, location, autre)
// présélectionne l'objet ; `?bien=` reste accepté comme sur /contact.

export const metadata: Metadata = pageMetadata({
  title: "Contacter le Cabinet Rimbault, 117 boulevard Voltaire, Asnières",
  description: `Appeler le ${agency.phone.display} ou nous écrire : les coordonnées du ${agency.name}, ${agency.address.street} à ${agency.address.city}.`,
  path: "/contact",
});

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Référence d'annonce plausible : chiffres, lettres, point, tiret. */
function lireReference(raw: string | string[] | undefined): string | undefined {
  const value = (typeof raw === "string" ? raw : "").trim();
  return /^[\p{L}\d.\-_/ ]{1,40}$/u.test(value) ? value : undefined;
}

/** « l’appartement », « la maison » : repris de la fiche du site. */
function objetVisite(view: PropertyView): string {
  switch (view.propertyType) {
    case "APPARTEMENT":
      return view.head === "Studio" ? "le studio" : "l’appartement";
    case "MAISON":
      return "la maison";
    case "VILLA":
      return "la villa";
    case "LOFT":
      return "le loft";
    default:
      return "le bien";
  }
}

async function bienCite(reference: string | undefined) {
  if (!reference) return null;
  try {
    const property = await getProperty(reference);
    return property ? toPropertyView(property) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ContactGalerie({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const reference = lireReference(params.ref ?? params.bien);
  const objetParam = typeof params.objet === "string" ? params.objet : "";
  const objet: Objet | undefined = isObjet(objetParam)
    ? objetParam
    : reference
      ? "bien"
      : undefined;
  const view = await bienCite(reference);

  const bien: BienCite | null = view
    ? {
        reference: view.reference,
        referenceLabel: referenceLabel(view.reference),
        title: view.title,
        place: view.place,
        priceLabel: serifSpaces(view.priceLabel),
        href: ficheHref(view.reference),
        image: view.images[0]
          ? { src: view.images[0].url, alt: view.images[0].alt }
          : null,
      }
    : null;
  const message = view
    ? `Bonjour, je souhaite visiter ${objetVisite(view)} ${referenceLabel(view.reference).replace("Réf.", "réf.")}.`
    : undefined;

  return (
    <div className={f.page}>
      <div className={`${s.w} ${s.g} ${f.intro}`} data-rv>
        <div className={f.introTexte}>
          <h1 className={s.up}>Nous contacter</h1>
          <p className={`${f.phrase} ${s.up}`} style={i(1)}>
            Le plus simple est de nous appeler.
          </p>
        </div>
        <div className={f.introTel}>
          <a
            className={`${f.tel} ${s.num} ${s.up}`}
            style={i(2)}
            href={agency.phone.href}
          >
            {agency.phone.display}
          </a>
          <p className={s.up} style={i(3)}>
            Vous pouvez aussi nous écrire avec le formulaire ci-dessous.
          </p>
        </div>
      </div>

      <div className={`${s.w} ${s.g} ${f.corps}`}>
        <section className={f.mur} aria-labelledby="devanture" data-rv>
          <div className={`${f.cadre} ${s.fade}`}>
            <div className={`${s.ph} ${f.photo}`}>
              <Image
                src="/devanture.jpg"
                alt={`La devanture grenat du cabinet, ${agency.address.street}`}
                fill
                sizes="(min-width: 900px) 26vw, 70vw"
              />
            </div>
          </div>
          <div className={`${s.cartel} ${s.num} ${f.cartel}`}>
            <h2 id="devanture" className={`${s.ti} ${s.up}`} style={i(1)}>
              Passez nous voir
            </h2>
            <address className={s.up} style={i(1)}>
              {agency.address.street}
              <br />
              {agency.address.postalCode} {agency.address.city}
            </address>
            <dl className={`${f.heures} ${s.up}`} style={i(2)}>
              {agency.hours.map((h) => (
                <div key={h.days}>
                  <dt>{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
            {agency.hoursConfirmed ? null : (
              <span className={`${s.tbc} ${s.up}`} style={i(2)}>
                [horaires à confirmer]
              </span>
            )}
            {agency.email ? (
              <a
                className={`${s.u} ${s.up}`}
                style={i(3)}
                href={`mailto:${agency.email}`}
              >
                {agency.email}
              </a>
            ) : null}
            <a
              className={`${s.u} ${f.itineraire} ${s.up}`}
              style={i(3)}
              href={agency.mapsDirections}
            >
              Itinéraire
            </a>
          </div>
        </section>

        <div className={f.ecrire} data-rv>
          <div className={s.up}>
            <FormulaireContact
              key={`${objet ?? ""}|${reference ?? ""}`}
              objet={objet}
              reference={reference}
              message={message}
              bien={bien}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
