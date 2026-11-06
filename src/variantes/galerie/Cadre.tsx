import type { ReactNode } from "react";
import s from "./base.module.css";
import { listViews } from "./data";
import { galerieFonts } from "./fonts";
import { Mur } from "./Mur";
import { Nav } from "./Nav";
import { Pied } from "./Pied";

// Cadre de la Galerie : mur, en-tête, <main>, pied. Posé par le layout du
// groupe (galerie) et par la 404 racine (`app/not-found.tsx`), rendue hors de
// ce layout. Aucune API dynamique ici : la 404 racine doit rester statique.
export async function Cadre({ children }: { children: ReactNode }) {
  const views = await listViews();
  return (
    <Mur className={`${galerieFonts} ${s.site}`}>
      <Nav count={views?.length ?? null} />
      <main className={s.main}>{children}</main>
      <Pied />
    </Mur>
  );
}
