import type { Metadata } from "next";
import { Introuvable } from "@/variantes/galerie/Introuvable";

// Fiche disparue, servie par `src/proxy.ts` (décision Zidane, journal lot 0) :
// une référence absente de la liste de l'API est réécrite ici avec le statut
// 404. Page statique en HTML complet, lisible sans JavaScript, contrairement
// à un notFound() levé depuis la fiche (enveloppe `__next_error__` vide en
// Next 16.3). Jamais atteinte directement : le proxy renvoie `/biens-introuvable`
// tapé tel quel vers la 404 générale. Pas de <main> : celui du cadre Galerie.

// Titre commun à toutes les 404 (décision du 06/11/2026) : servie par la
// réécriture du proxy avec le statut 404, la page reçoit de toute façon les
// métadonnées de la 404 générale (Next 16.3). Le corps dit « bien disparu ».
export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

export default function BienIntrouvable() {
  return (
    <Introuvable
      title="Ce bien n’est plus en ligne."
      lead="Il a peut-être été vendu ou loué."
    />
  );
}
