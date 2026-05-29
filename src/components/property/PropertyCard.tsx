// La PropertyCard officielle du site est désormais la variante éditoriale.
// Les anciens noms (Sale/Rent/Auto/Sold) sont conservés en alias pour ne pas
// casser les imports existants — `PropertyCardEditorial` est unifiée et gère
// vente/location/vendu en interne (cf. `cards/shared.ts`).
export {
  PropertyCardEditorial as PropertyCard,
  PropertyCardEditorial as SalePropertyCard,
  PropertyCardEditorial as RentPropertyCard,
  PropertyCardEditorial as AutoPropertyCard,
  PropertyCardEditorial as SoldPropertyCard,
} from "./cards/PropertyCardEditorial";
