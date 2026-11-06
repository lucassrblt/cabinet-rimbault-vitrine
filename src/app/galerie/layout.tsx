import type { Metadata } from "next";
import type { ReactNode } from "react";
import s from "@/variantes/galerie/base.module.css";
import { listViews } from "@/variantes/galerie/data";
import { chaudeFonts } from "@/variantes/galerie/fonts";
import { Mur } from "@/variantes/galerie/Mur";
import { Nav } from "@/variantes/galerie/Nav";
import { Pied } from "@/variantes/galerie/Pied";

// Variante « Galerie chaude » (maquette v4, docs/maquettes-2026-11-v4/chaude.html).
// Banc de démonstration : jamais indexé.
export const metadata: Metadata = {
  title: {
    default: "Galerie chaude",
    template: "%s, galerie chaude",
  },
  robots: { index: false, follow: false },
};

export default async function ChaudeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const views = await listViews();
  return (
    <Mur className={`${chaudeFonts} ${s.site}`}>
      <Nav count={views?.length ?? null} />
      <main className={s.main}>{children}</main>
      <Pied />
    </Mur>
  );
}
