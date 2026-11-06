// Tests unitaires du lot 2 (lib/property) sur les données réelles du mock
// (e2e/fixtures, capture anonymisée du 30/10/2026) et sur les cas limites.
//   node --test --import ./src/lib/property/__tests__/register.mjs src/lib/property/__tests__/*.test.ts

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type { Property, PropertyFinance } from "@/lib/api/types";
import { realEstateListingJsonLd } from "@/lib/seo/jsonld";
import { descriptionParagraphs, excerpt } from "../description";
import { energyCosts, energyLabels } from "../energy";
import { priceInfo } from "../fees";
import { formatEuros, formatLongDate, formatSurface, ordinal } from "../format";
import { neighborhoodPhrase, normalizeCapitals, normalizePlace } from "../text";
import {
  composeTitle,
  pageTitle,
  sortForListing,
  subtitleFromRaw,
  toPropertyView,
} from "../view";

const fixtures = (name: string) =>
  JSON.parse(
    readFileSync(
      new URL(`../../../../e2e/fixtures/${name}`, import.meta.url),
      "utf8",
    ),
  ).properties;

const DETAILS = fixtures("details.json") as Record<string, Property>;
const EDGE = fixtures("edge-cases.json") as Property[];
const real = (ref: string) => toPropertyView(DETAILS[ref]);

const NNBSP = " ";
const NBSP = " ";
const FORBIDDEN = /null|undefined|NaN|-1\s?€|\bCC\b|\[À|TODO/;

function finance(over: Partial<PropertyFinance>): PropertyFinance {
  return {
    price: 300000,
    charges: null,
    chargesIncluses: null,
    honoraires: null,
    honorairesPct: null,
    honorairesType: null,
    honorairesCharge: null,
    depot: null,
    taxeFonciere: null,
    ...over,
  };
}

describe("format", () => {
  it("écrit les prix avec U+202F et U+00A0", () => {
    assert.equal(formatEuros(198000), `198${NNBSP}000${NBSP}€`);
    assert.equal(formatSurface(59.5), `59,5${NBSP}m²`);
    assert.equal(formatSurface(33.16), `33,16${NBSP}m²`);
  });
  it("écrit « 1er » pour le premier du mois, la date telle que saisie", () => {
    assert.equal(
      formatLongDate("2021-01-01T00:00:00.000Z"),
      `1er${NBSP}janvier 2021`,
    );
    assert.equal(
      formatLongDate("2026-09-18T00:00:00.000Z"),
      `18${NBSP}septembre 2026`,
    );
    assert.equal(formatLongDate("pas une date"), null);
  });
});

describe("composeTitle (A33)", () => {
  it("virgule pour l'affiche, « de » pour la phrase", () => {
    const v = real("10.130");
    assert.equal(
      composeTitle(v, "affiche"),
      `Appartement 3${NBSP}pièces, 59,5${NBSP}m²`,
    );
    assert.equal(
      composeTitle(v, "phrase"),
      `Appartement 3${NBSP}pièces de 59,5${NBSP}m²`,
    );
    assert.equal(v.title, composeTitle(v, "affiche"));
  });
  it("« Studio » pour un appartement d'une pièce", () => {
    assert.equal(real("09.362").title, `Studio, 33,16${NBSP}m²`);
  });
  it("le titre saisi n'est jamais le titre affiché", () => {
    for (const ref of Object.keys(DETAILS)) {
      assert.doesNotMatch(real(ref).title, /[A-Z]{3,}|\+/);
    }
  });
  it("<title> de la fiche", () => {
    assert.equal(
      pageTitle(real("10.130")),
      `Appartement 3${NBSP}pièces de 59,5${NBSP}m² à Asnières-sur-Seine, 375${NNBSP}000${NBSP}€`,
    );
  });
});

describe("sous-titre et lieux", () => {
  it("compose le sous-titre en casse normale", () => {
    assert.equal(
      subtitleFromRaw("3 PIÈCES + 1 TERRASSE + 1 PARKING + 1 CAVE"),
      `3${NBSP}pièces, terrasse, parking et cave`,
    );
    assert.equal(
      subtitleFromRaw(
        "5 PIÈCES + 2 TERRASSES + 2 JARDINS + 1 PARKING + 1 CAVE",
      ),
      `5${NBSP}pièces, 2${NBSP}terrasses, 2${NBSP}jardins, parking et cave`,
    );
    assert.equal(subtitleFromRaw("2 PIECES"), null);
  });
  it("normalise villes et quartiers", () => {
    assert.equal(normalizePlace("Asnieres-sur-Seine"), "Asnières-sur-Seine");
    assert.equal(normalizePlace("collange"), "Collange");
    assert.equal(normalizePlace("Gabriél Péri"), "Gabriel Péri");
    assert.equal(normalizePlace(null), null);
    assert.equal(real("09.362").place, "Asnières-sur-Seine, Gabriel Péri");
    assert.equal(real("10.130").place, "Asnières-sur-Seine");
  });
  it("article du quartier : table fermée, rien de deviné", () => {
    assert.equal(
      neighborhoodPhrase("Impressionnistes"),
      "quartier des Impressionnistes",
    );
    assert.equal(neighborhoodPhrase("Gabriel Péri"), "quartier Gabriel Péri");
    assert.equal(neighborhoodPhrase("Collange"), "quartier Collange");
  });
  it("ville absente : aucune ville inventée", () => {
    const base = DETAILS["09.362"];
    const noCity = (neighborhood: string | null) =>
      toPropertyView({
        ...base,
        location: { ...base.location, city: null, neighborhood },
      } as unknown as Property);
    const v = noCity("Gabriel Péri");
    assert.equal(v.city, null);
    assert.equal(v.place, "Gabriel Péri");
    assert.equal(noCity(null).place, "");
    assert.doesNotMatch(pageTitle(v), / à /);
    assert.equal(pageTitle(v).startsWith(`Studio de 33,16${NBSP}m²`), true);
    for (const image of v.images) {
      assert.doesNotMatch(image.alt, / à /);
      assert.match(image.alt, /^Studio de 33,16\u00a0m², photo \d+ sur \d+$/);
    }
    const ld = realEstateListingJsonLd({
      name: composeTitle(v, "phrase"),
      description: "",
      path: v.href,
      images: [],
      price: 1,
      transaction: v.transaction,
      available: true,
      propertyType: "APPARTEMENT",
      surface: v.surface,
      rooms: v.rooms,
      postalCode: v.postalCode,
      city: v.city,
      datePosted: v.createdAt,
    });
    const address = (ld.about as { address: Record<string, unknown> }).address;
    assert.equal("addressLocality" in address, false);
  });
  it("ne lit jamais l'adresse exacte", () => {
    for (const ref of Object.keys(DETAILS)) {
      assert.doesNotMatch(JSON.stringify(real(ref)), /adresse masquée/);
    }
  });
});

describe("fees (note client)", () => {
  it("09.362 : trois lignes, honoraires acquéreur", () => {
    const v = real("09.362");
    assert.equal(v.priceLabel, `198${NNBSP}000${NBSP}€`);
    assert.deepEqual(v.feeLines, [
      `Soit 189${NNBSP}000${NBSP}€ honoraires exclus`,
      `Honoraires de 4,76${NNBSP}% TTC à la charge de l’acquéreur`,
    ]);
  });
  it("calcule le pourcentage s'il manque", () => {
    const info = priceInfo(
      "VENTE",
      finance({
        price: 280000,
        honoraires: 10000,
        honorairesType: "acquereur",
      }),
    );
    assert.equal(
      info.feeLines[1],
      `Honoraires de 3,7${NNBSP}% TTC à la charge de l’acquéreur`,
    );
  });
  it("10.131 (-1) : une ligne vendeur, jamais « -1 € »", () => {
    assert.deepEqual(real("10.131").feeLines, [
      "Honoraires à la charge du vendeur",
    ]);
  });
  it("charge inconnue : aucune ligne", () => {
    assert.deepEqual(priceInfo("VENTE", finance({})).feeLines, []);
  });
  it("location : charges comprises en toutes lettres", () => {
    const loc = toPropertyView(EDGE[0]);
    assert.equal(loc.transaction, "LOCATION");
    assert.equal(
      loc.priceLabel,
      `1${NNBSP}250${NBSP}€ par mois charges comprises`,
    );
    assert.ok(loc.feeLines.some((l) => l.startsWith("Dépôt de garantie")));
    assert.ok(loc.feeLines.some((l) => l.includes("à la charge du locataire")));
  });
  it("sans prix : aucun libellé", () => {
    assert.deepEqual(priceInfo("VENTE", finance({ price: 0 })), {
      priceLabel: null,
      amount: null,
      suffix: null,
      feeLines: [],
    });
  });
});

describe("energy (A29)", () => {
  const lead = `Montant estimé des dépenses annuelles d’énergie pour un usage standard${NNBSP}:`;
  it("(1) coûts et date : 10.130", () => {
    const c = real("10.130").energy.costs;
    assert.equal(
      c.sentence,
      `${lead} entre 830${NBSP}€ et 1${NNBSP}190${NBSP}€ par an. Prix moyens des énergies indexés au 1er${NBSP}janvier 2021 (abonnements compris).`,
    );
    assert.ok(c.note);
  });
  it("(2) coûts sans date", () => {
    const energy = DETAILS["10.130"].energy;
    assert.ok(energy);
    const c = energyCosts({ ...energy, dateReferenceEnergie: null });
    assert.equal(
      c.sentence,
      `${lead} entre 830${NBSP}€ et 1${NNBSP}190${NBSP}€ par an, abonnements compris.`,
    );
  });
  it("(3) coûts absents : 09.345 et 10.131", () => {
    for (const ref of ["09.345", "10.131"]) {
      const c = real(ref).energy.costs;
      assert.equal(c.sentence, `${lead} non communiqué.`);
      assert.equal(c.note, null);
    }
  });
  it("aucune date ISO ni « 2021, 2022 et 2023 »", () => {
    for (const ref of Object.keys(DETAILS)) {
      const s = real(ref).energy.costs.sentence;
      assert.doesNotMatch(s, /\d{4}-\d{2}-\d{2}|2022 et 2023/);
    }
  });
  it("classe et valeur", () => {
    const { dpe, ges } = real("09.362").energy;
    assert.equal(dpe.value, `Classe E, 264${NBSP}kWh/m²/an`);
    assert.equal(ges.value, `Classe B, 8${NBSP}kg CO₂/m²/an`);
  });
  it("DPE vierge", () => {
    const { dpe } = energyLabels(EDGE[1].energy);
    assert.equal(dpe.value, "DPE vierge");
    assert.equal(dpe.imageUrl, null);
  });
});

describe("copropriété (A32)", () => {
  it("09.362 : lots, charges, procédure, taxe foncière", () => {
    assert.deepEqual(real("09.362").copro, [
      { label: "Bien soumis au statut de la copropriété", value: "Oui" },
      { label: "Nombre de lots", value: "96" },
      { label: "Charges annuelles moyennes", value: `1${NNBSP}124${NBSP}€` },
      { label: "Procédure en cours sur la copropriété", value: "Aucune" },
      { label: "Taxe foncière", value: `1${NNBSP}196${NBSP}€` },
    ]);
  });
  it("maison hors copropriété", () => {
    const maison = toPropertyView(EDGE[2]);
    assert.equal(maison.copro[0].value, "Non");
  });
});

describe("L'essentiel", () => {
  it("accorde les libellés et n'affiche que le connu", () => {
    const facts = real("09.362").facts;
    const labels = facts.map((f) => f.label);
    assert.ok(labels.includes("Pièce"));
    assert.ok(!labels.includes("Chambre") && !labels.includes("Chambres"));
    assert.deepEqual(
      facts.find((f) => f.label === "Étage"),
      { label: "Étage", value: "1\u1d49\u02b3 sur 6" },
    );
    // Une seule forme d'ordinal, en lettres supérieures : « 1ᵉʳ », « 3ᵉ ».
    assert.equal(ordinal(1), "1\u1d49\u02b3");
    assert.equal(ordinal(3), "3\u1d49");
    assert.equal(
      real("10129").facts.find((f) => f.label === "Chambres")?.value,
      "4",
    );
  });
});

describe("description", () => {
  it("découpe, retire le titre répété, normalise", () => {
    const p = descriptionParagraphs(
      DETAILS["09.345"].description,
      DETAILS["09.345"].title,
    );
    assert.ok(p.length >= 2);
    assert.ok(p[0].startsWith("Rue Collange. À proximité"));
    const all = p.join(" ");
    assert.match(all, /dernier étage avec ascenseur/);
    assert.match(
      all,
      /Parquet, très belle luminosité, vue dégagée, faibles charges/,
    );
    assert.match(all, /vis-à-vis/);
    assert.doesNotMatch(all, /2 PIECES/);
  });
  it("garde les sigles", () => {
    assert.equal(
      normalizeCapitals("salle d’eau avec WC"),
      "salle d’eau avec WC",
    );
  });
  it("vide : aucun paragraphe", () => {
    assert.deepEqual(descriptionParagraphs(null), []);
  });
  it("extrait de 155 signes au plus", () => {
    const text = excerpt(real("10129").paragraphs);
    assert.ok(text.length <= 155);
  });
});

describe("garde-fous", () => {
  it("aucune chaîne interdite dans les vues", () => {
    for (const p of [...Object.values(DETAILS), ...EDGE]) {
      const v = toPropertyView(p);
      const visible = [
        v.title,
        v.subtitle ?? "",
        v.place,
        v.priceLabel,
        ...v.feeLines,
        ...v.facts.map((f) => `${f.label} ${f.value}`),
        ...v.copro.map((f) => `${f.label} ${f.value}`),
        v.energy.costs.sentence,
        v.energy.dpe.value,
        v.energy.ges.value,
        ...v.images.map((i) => i.alt),
      ].join("\n");
      assert.doesNotMatch(visible, FORBIDDEN, p.reference);
      assert.doesNotMatch(visible, /·/, p.reference);
    }
  });
  it("trie les disponibles d'abord", () => {
    const sorted = sortForListing(EDGE.map(toPropertyView));
    assert.equal(sorted[0].status, "DISPONIBLE");
    assert.notEqual(sorted[sorted.length - 1].status, "DISPONIBLE");
  });
  it("alt des photos : phrase, rang et total", () => {
    const v = real("10.131");
    assert.equal(
      v.images[1].alt,
      `Appartement 2${NBSP}pièces de 46,6${NBSP}m² à Asnières-sur-Seine, photo 2 sur 4`,
    );
  });
});
