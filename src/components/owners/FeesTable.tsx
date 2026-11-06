import { Table } from "@/components/ui/Table";
import type { RentalFeeRow, SaleFeeRow } from "@/content/honoraires";
import { fr } from "./typo";

// Tableaux du barème (doc 04 §2.8) sur le composant `Table` de Pirlo :
// <caption>, <th scope="col">, première colonne en <th scope="row">, et sous
// 640 px chaque rangée devient un bloc libellé (lisible à 320 px, sans
// défilement horizontal).

export function SaleFeesTable({ rows }: { rows: readonly SaleFeeRow[] }) {
  return (
    <Table
      caption="Honoraires de vente, selon le prix de vente"
      columns={[
        { key: "range", label: "Prix de vente" },
        { key: "fee", label: "Honoraires TTC", align: "end" },
      ]}
      rows={rows.map((row) => ({ range: fr(row.range), fee: fr(row.fee) }))}
    />
  );
}

export function RentalFeesTable({ rows }: { rows: readonly RentalFeeRow[] }) {
  return (
    <Table
      caption="Honoraires de location"
      columns={[
        { key: "service", label: "Prestation" },
        { key: "tenant", label: "Part du locataire", align: "end" },
        { key: "landlord", label: "Part du propriétaire", align: "end" },
      ]}
      rows={rows.map((row) => ({
        service: fr(row.service),
        tenant: fr(row.tenant),
        landlord: fr(row.landlord),
      }))}
    />
  );
}
