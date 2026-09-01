import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { AGENT, isPlaceholder } from "@/lib/config/agent";

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
          Cabinet Rimbault — {AGENT.legal.legalForm} {AGENT.fullName}
          <br />
          {AGENT.address.line1}, {AGENT.address.postalCode} {AGENT.address.city}
          <br />
          Téléphone : {AGENT.phoneDisplay}
          <br />
          Email : {AGENT.email}
          <br />
          {AGENT.legal.siret} — {AGENT.legal.rcs}
          <br />
          Directeur de la publication : {AGENT.fullName}
        </p>
      </section>

      <section aria-labelledby="carte" className="mt-8 text-sm text-body">
        <h2 id="carte" className="text-xl font-semibold tracking-tight">
          Activité réglementée
        </h2>
        <p className="mt-3">
          {AGENT.legal.carteT}, délivrée par la {AGENT.legal.cci}.
        </p>
        <p className="mt-2">Garant financier : {AGENT.legal.garant}.</p>
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
          Netlify, Inc. — 44 Montgomery Street, Suite 300, San Francisco, CA
          94104, États-Unis — https://www.netlify.com
        </p>
      </section>

      <section aria-labelledby="mediateur" className="mt-8 text-sm text-body">
        <h2 id="mediateur" className="text-xl font-semibold tracking-tight">
          Médiateur de la consommation
        </h2>
        <p className="mt-3">
          {isPlaceholder(AGENT.legal.mediator)
            ? "Coordonnées du médiateur de la consommation disponibles sur demande auprès de l'agence."
            : AGENT.legal.mediator}
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
