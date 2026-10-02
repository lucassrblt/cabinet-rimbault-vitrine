import type { Metadata } from "next";
import { ListeBiens, TitreBiens } from "@/components/site/Listing";
import { FinCarte } from "@/components/site/ListingVariants";
import { getProperties } from "@/lib/api/properties";

export const metadata: Metadata = {
  title: "Nos biens à vendre à Asnières-sur-Seine",
};

export default async function NosBiens() {
  const items = [...(await getProperties())].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <main className="conteneur pt-12 pb-28 md:pt-20 md:pb-36">
      <TitreBiens items={items} />
      <div className="mt-16 md:mt-24">
        {items.length === 0 ? (
          <p className="max-w-[52ch]">Aucun bien en ligne en ce moment.</p>
        ) : (
          <ListeBiens items={items} />
        )}
      </div>
      <div className="mt-24 md:mt-32">
        <FinCarte />
      </div>
    </main>
  );
}
