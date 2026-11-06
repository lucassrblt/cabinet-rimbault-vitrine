import { cn } from "@/lib/utils";

// Tableau de données (barème d'honoraires) : <caption>, <th scope="col"> et
// <th scope="row"> pour la première colonne, chiffres tabulaires. Sous 640 px
// (`stack`, par défaut), chaque rangée devient un bloc dont les cellules
// portent leur libellé : lisible à 320 px sans défilement horizontal.

export type TableColumn = {
  key: string;
  label: string;
  align?: "start" | "end";
};

type TableProps = {
  caption: string;
  /** La première colonne sert d'en-tête de rangée. */
  columns: TableColumn[];
  rows: Record<string, React.ReactNode>[];
  stack?: boolean;
  className?: string;
};

// Clé de rangée : le texte de l'en-tête de rangée s'il est simple, sinon
// l'index (un nœud React donnerait « [object Object] » pour chaque rangée).
function rowKey(cell: React.ReactNode, index: number) {
  return typeof cell === "string" || typeof cell === "number"
    ? `${cell}-${index}`
    : index;
}

export function Table({
  caption,
  columns,
  rows,
  stack = true,
  className,
}: TableProps) {
  const [head, ...rest] = columns;
  return (
    <table className={cn("ui-table", stack && "ui-table--empile", className)}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              data-align={column.align === "end" ? "end" : undefined}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={rowKey(row[head.key], index)}>
            <th scope="row">{row[head.key]}</th>
            {rest.map((column) => (
              <td
                key={column.key}
                data-label={column.label}
                data-align={column.align === "end" ? "end" : undefined}
              >
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
