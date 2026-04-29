export const SALE_TIERS: { range: string; fee: string }[] = [
  { range: "Jusqu'à 100 000 €", fee: "Forfait 5 000 € TTC" },
  { range: "De 100 000 € à 300 000 €", fee: "5 % TTC" },
  { range: "De 300 000 € à 500 000 €", fee: "4 % TTC" },
  { range: "De 500 000 € à 1 000 000 €", fee: "3 % TTC" },
  { range: "Au-delà de 1 000 000 €", fee: "2 % TTC" },
];

export const RENT_TIERS: { label: string; amount: string }[] = [
  { label: "Visite, dossier, bail — zone tendue", amount: "10 €/m² TTC" },
  { label: "Visite, dossier, bail — zone très tendue", amount: "12 €/m² TTC" },
  { label: "Visite, dossier, bail — hors zone tendue", amount: "8 €/m² TTC" },
  { label: "État des lieux d'entrée (partagé)", amount: "3 €/m² TTC" },
];
