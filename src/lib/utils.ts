export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const priceFormat = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const numberFormat = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

export function formatPrice(value: number) {
  return priceFormat.format(value);
}

export function formatNumber(value: number) {
  return numberFormat.format(value);
}

export function formatSurface(value: number) {
  return `${numberFormat.format(value)}\u00a0m²`;
}
