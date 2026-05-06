import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { AGENT } from "@/lib/config/agent";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du Cabinet Rimbault — traitement des données personnelles conformément au RGPD.",
  robots: { index: true, follow: false },
};

export default function ConfidentialitePage() {
  return (
    <PageShell
      title="Politique de confidentialité"
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Confidentialité" },
      ]}
    >
      <section className="space-y-6 text-sm text-body">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Responsable de traitement
          </h2>
          <p className="mt-3">
            {AGENT.fullName} — Cabinet Rimbault
            <br />
            {AGENT.address.line1}, {AGENT.address.postalCode}{" "}
            {AGENT.address.city}
            <br />
            Email : {AGENT.email} — Tél. : {AGENT.phoneDisplay}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Données collectées
          </h2>
          <p className="mt-3">
            Nom, prénom, email, téléphone, informations sur le bien (surface,
            adresse, type), via les formulaires d&apos;estimation et de contact.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Finalités et base légale
          </h2>
          <p className="mt-3">
            Traitement des demandes de contact et d&apos;estimation — exécution
            précontractuelle et intérêt légitime.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Durée de conservation
          </h2>
          <p className="mt-3">
            Les données sont conservées pour la durée nécessaire aux finalités
            indiquées, et au plus trois ans après le dernier contact.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Vos droits</h2>
          <p className="mt-3">
            Droit d&apos;accès, de rectification, d&apos;effacement,
            d&apos;opposition et de portabilité. Exercez-les par email à
            l&apos;adresse {AGENT.email}. En cas de litige, vous pouvez saisir
            la CNIL.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
