import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

// Page à concevoir : la structure validée est dans docs/brief.md §6.
export default function Page() {
  return (
    <main className="conteneur pt-10 pb-28 md:pt-16 md:pb-36">
      <h1 className="titre text-[2.25rem] leading-tight md:text-page">
        Contact
      </h1>
      <p className="mt-4 max-w-[52ch] text-gris">Page à concevoir.</p>
    </main>
  );
}
