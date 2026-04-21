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
      <section aria-labelledby="editeur" className="text-sm text-zinc-700">
        <h2 id="editeur" className="text-xl font-semibold tracking-tight">
          Éditeur du site
        </h2>
        <p className="mt-3">
          Raison sociale, forme juridique, RCS, SIRET, adresse, téléphone,
          email, directeur de la publication — à renseigner.
        </p>
      </section>

      <section aria-labelledby="carte" className="mt-8 text-sm text-zinc-700">
        <h2 id="carte" className="text-xl font-semibold tracking-tight">
          Activité réglementée
        </h2>
        <p className="mt-3">
          Carte professionnelle T (transaction), G (gestion si applicable), CCI
          émettrice, garant financier (nom + adresse) — à renseigner.
        </p>
      </section>

      <section
        aria-labelledby="hebergeur"
        className="mt-8 text-sm text-zinc-700"
      >
        <h2 id="hebergeur" className="text-xl font-semibold tracking-tight">
          Hébergeur
        </h2>
        <p className="mt-3">Hébergeur du site — à renseigner.</p>
      </section>

      <section
        aria-labelledby="mediateur"
        className="mt-8 text-sm text-zinc-700"
      >
        <h2 id="mediateur" className="text-xl font-semibold tracking-tight">
          Médiateur de la consommation
        </h2>
        <p className="mt-3">
          Désignation du médiateur compétent — à renseigner.
        </p>
      </section>

      <section
        aria-labelledby="propriete"
        className="mt-8 text-sm text-zinc-700"
      >
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
