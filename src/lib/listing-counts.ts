import "server-only";

import { searchProperties } from "@/lib/api/properties";
import type { SearchFilters, TransactionType } from "@/lib/api/types";
import { COMMUNES } from "@/lib/config/communes";

export type CommuneCounts = Record<string, number>;

type BaseFilters = Omit<
  SearchFilters,
  "city" | "postalCode" | "limit" | "offset" | "sortBy" | "transactionType"
>;

/**
 * Compte le nombre de biens disponibles par commune pour le périmètre donné,
 * en respectant les autres filtres actifs (type, budget, etc.) — la commune
 * elle-même est exclue pour que les compteurs reflètent « combien si je passe
 * à cette commune ». Chaque appel API est mis en cache par Next.js via le
 * tag `properties`. Compteurs « coarse » et non critiques (hors chemin de rendu
 * bloquant, streamés vers le popover) → revalidate long (1 h) pour que les 11
 * appels restent quasi toujours chauds.
 */
export async function getCommuneCounts(
  transactionType: TransactionType,
  baseFilters: BaseFilters,
): Promise<CommuneCounts> {
  const results = await Promise.all(
    COMMUNES.map(async (commune): Promise<readonly [string, number]> => {
      const cityFilter = commune.slug === "paris" ? "Paris" : commune.name;
      try {
        const res = await searchProperties(
          {
            ...baseFilters,
            transactionType,
            postalCode: commune.postalCode,
            city: cityFilter,
            limit: 1,
          },
          { revalidate: 3600 },
        );
        return [commune.slug, res.total ?? res.data?.length ?? 0] as const;
      } catch {
        return [commune.slug, 0] as const;
      }
    }),
  );
  return Object.fromEntries(results);
}
