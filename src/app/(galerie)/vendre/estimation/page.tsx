import type { Metadata } from "next";
import { agency } from "@/lib/agency";
import { pageMetadata } from "@/lib/seo/metadata";
import s from "@/variantes/galerie/base.module.css";
import { Tunnel } from "@/variantes/galerie/vendre/Tunnel";

// Tunnel d'estimation de la Galerie : six questions, envoi par la Server
// Action de la refonte (`submitEstimation` → `POST /evaluation`). Sans
// JavaScript, le téléphone du cabinet.

export const metadata: Metadata = pageMetadata({
  title: "Faire estimer votre bien à Asnières-sur-Seine",
  description:
    "Demandez l’estimation du prix de vente de votre appartement ou de votre maison à Asnières-sur-Seine. Nous vous recontactons pour convenir d’une visite.",
  path: "/vendre/estimation",
});

export default function EstimationGalerie() {
  return (
    <>
      <noscript>
        <p className={s.w} style={{ paddingTop: 24 }}>
          Ce formulaire a besoin de JavaScript. Vous pouvez aussi nous appeler
          au{" "}
          <a className={`${s.u} ${s.num}`} href={agency.phone.href}>
            {agency.phone.display}
          </a>
          .
        </p>
      </noscript>
      <Tunnel />
    </>
  );
}
