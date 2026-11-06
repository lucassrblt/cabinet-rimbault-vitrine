// Prix et honoraires (doc 04 §2.3, doc 03 §6.6, note du client). Pur, testé.
//
// Vente, honoraires à la charge de l'acquéreur (prix affiché honoraires
// inclus) :
//   198 000 €
//   Soit 189 000 € honoraires exclus
//   Honoraires de 4,76 % TTC à la charge de l’acquéreur
// Vente, honoraires à la charge du vendeur : une ligne.
// Location : loyer mensuel, charges, dépôt de garantie, honoraires du
// locataire, selon ce qui est saisi.
// `honoraires = -1` est une sentinelle de saisie : traité comme absent.
// Jamais « -1 € », « null », « NaN », ni « CC ».

import type { PropertyFinance } from "@/lib/api/types";
import { formatEuros, formatPercent, isPositive, NNBSP } from "./format";

export type Transaction = "VENTE" | "LOCATION";

export type PriceInfo = {
  /** « 198 000 € », « 1 250 € par mois charges comprises ». `null` sans prix. */
  priceLabel: string | null;
  /** Le montant seul (« 1 250 € ») et la suite du libellé (« par mois charges comprises »). */
  amount: string | null;
  suffix: string | null;
  /** Lignes sous le prix (honoraires, charges, dépôt). */
  feeLines: string[];
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function salePrice(f: PropertyFinance): PriceInfo {
  const price = f.price;
  const priceLabel = formatEuros(price);
  const payer = f.honorairesType;

  if (payer === "acquereur") {
    const fees =
      isPositive(f.honoraires) && f.honoraires < price ? f.honoraires : null;
    const net = fees === null ? null : price - fees;
    const pct = isPositive(f.honorairesPct)
      ? f.honorairesPct
      : fees !== null && net !== null
        ? round2((fees / net) * 100)
        : null;
    const lines: string[] = [];
    if (net !== null) lines.push(`Soit ${formatEuros(net)} honoraires exclus`);
    if (pct !== null) {
      lines.push(
        `Honoraires de ${formatPercent(pct)} TTC à la charge de l’acquéreur`,
      );
    } else if (fees !== null) {
      lines.push(
        `Honoraires de ${formatEuros(fees)} TTC à la charge de l’acquéreur`,
      );
    }
    return { priceLabel, amount: priceLabel, suffix: null, feeLines: lines };
  }
  if (payer === "vendeur") {
    return {
      priceLabel,
      amount: priceLabel,
      suffix: null,
      feeLines: ["Honoraires à la charge du vendeur"],
    };
  }
  // Charge non saisie : aucune ligne inventée (le lien vers le barème suit).
  return { priceLabel, amount: priceLabel, suffix: null, feeLines: [] };
}

function rentPrice(f: PropertyFinance): PriceInfo {
  const rent = formatEuros(f.price);
  const charges = isPositive(f.charges) ? f.charges : null;
  const lines: string[] = [];
  let suffix: string;

  if (f.chargesIncluses === true) {
    suffix = "par mois charges comprises";
    if (charges !== null) {
      lines.push(`Dont ${formatEuros(charges)} de provisions sur charges`);
    }
  } else if (charges !== null) {
    suffix = "par mois hors charges";
    lines.push(
      `Plus ${formatEuros(charges)} de provisions sur charges par mois`,
    );
  } else {
    suffix = "par mois";
  }
  if (isPositive(f.depot)) {
    lines.push(`Dépôt de garantie${NNBSP}: ${formatEuros(f.depot)}`);
  }
  if (isPositive(f.honoraires) && f.honorairesType === "locataire") {
    lines.push(
      `Honoraires de location de ${formatEuros(f.honoraires)} TTC à la charge du locataire`,
    );
  }
  return {
    priceLabel: `${rent} ${suffix}`,
    amount: rent,
    suffix,
    feeLines: lines,
  };
}

/** Bloc prix d'un bien. */
export function priceInfo(
  transaction: Transaction,
  finance: PropertyFinance | null | undefined,
): PriceInfo {
  if (!finance || !isPositive(finance.price)) {
    return { priceLabel: null, amount: null, suffix: null, feeLines: [] };
  }
  return transaction === "LOCATION" ? rentPrice(finance) : salePrice(finance);
}
