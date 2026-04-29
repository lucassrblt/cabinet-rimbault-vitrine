import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Cabinet Rimbault.",
  robots: { index: true, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <PageShell
      title="Mentions légales"
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Mentions légales" },
      ]}
    >
      <section aria-labelledby="editeur" className="text-sm text-body">
        <h2 id="editeur" className="text-xl font-semibold tracking-tight">
          Éditeur du site
        </h2>
        <p className="mt-3">
          Cabinet Rimbault — EI Sophie Rimbault
          <br />
          14 rue du Marché, 92100 Boulogne-Billancourt
          <br />
          Téléphone : 06 12 34 56 78
          <br />
          Email : contact@cabinet-rimbault.fr
          <br />
          SIRET : 923 456 789 00012 — RCS Nanterre B 923 456 789
          <br />
          Directrice de la publication : Sophie Rimbault
        </p>
      </section>

      <section aria-labelledby="carte" className="mt-8 text-sm text-body">
        <h2 id="carte" className="text-xl font-semibold tracking-tight">
          Activité réglementée
        </h2>
        <p className="mt-3">
          Carte professionnelle Transaction n° CPI 9201 2024 000 012 345,
          délivrée par la CCI Hauts-de-Seine.
        </p>
        <p className="mt-2">
          Garant financier : CEGC — Caisse d&apos;Épargne, 16 rue de Wagram,
          75017 Paris — garantie 110 000 €.
        </p>
        <p className="mt-2">
          Assurance responsabilité civile professionnelle : MMA IARD, contrat n°
          147 923 456.
        </p>
        <p className="mt-2">
          Ne détient aucun fonds, effet ou valeur. Ne reçoit aucun mandat de
          gestion.
        </p>
      </section>

      <section aria-labelledby="hebergeur" className="mt-8 text-sm text-body">
        <h2 id="hebergeur" className="text-xl font-semibold tracking-tight">
          Hébergeur
        </h2>
        <p className="mt-3">
          Vercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis —
          https://vercel.com
        </p>
      </section>

      <section aria-labelledby="mediateur" className="mt-8 text-sm text-body">
        <h2 id="mediateur" className="text-xl font-semibold tracking-tight">
          Médiateur de la consommation
        </h2>
        <p className="mt-3">
          CNPM Médiation Consommation — 27 avenue de la Libération, 42400
          Saint-Chamond — www.cnpm-mediation-consommation.eu
        </p>
      </section>

      <section aria-labelledby="propriete" className="mt-8 text-sm text-body">
        <h2 id="propriete" className="text-xl font-semibold tracking-tight">
          Propriété intellectuelle
        </h2>
        <p className="mt-3">
          L&apos;ensemble du contenu du site (textes, photos, logos) est protégé
          par le droit de la propriété intellectuelle.
        </p>
      </section>
    </PageShell>
  );
}
