import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Cookies",
  description:
    "Politique relative aux cookies utilisés sur le site du Cabinet Rimbault.",
  robots: { index: true, follow: false },
};

export default function CookiesPage() {
  return (
    <PageShell
      title="Cookies"
      breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Cookies" }]}
    >
      <section className="space-y-6 text-sm text-body">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Qu&apos;est-ce qu&apos;un cookie
          </h2>
          <p className="mt-3">
            Un cookie est un petit fichier déposé sur votre terminal lors de la
            consultation d&apos;un site. Il permet d&apos;enregistrer des
            informations relatives à votre navigation.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Cookies utilisés
          </h2>
          <p className="mt-3">
            Le site utilise uniquement des cookies strictement nécessaires à son
            bon fonctionnement. Aucun cookie de mesure d&apos;audience ou
            publicitaire n&apos;est déposé à ce jour.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Gestion des cookies
          </h2>
          <p className="mt-3">
            Vous pouvez configurer votre navigateur pour accepter ou refuser les
            cookies. Cette section sera mise à jour si des cookies tiers
            (analytics, etc.) sont introduits ultérieurement.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
