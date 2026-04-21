import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LinkButton } from "@/components/ui/Button";
import { AGENT } from "@/lib/config/agent";

export const metadata: Metadata = {
  title: "Barème d'honoraires",
  description:
    "Barème d'honoraires vente et location du Cabinet Rimbault. Conforme à l'arrêté du 10 janvier 2017 — honoraires TTC, qui paie, date d'effet.",
};

const SALE_TIERS: { range: string; fee: string }[] = [
  { range: "Jusqu'à 100 000 €", fee: "Forfait 5 000 € TTC" },
  { range: "De 100 000 € à 300 000 €", fee: "5 % TTC" },
  { range: "De 300 000 € à 500 000 €", fee: "4 % TTC" },
  { range: "De 500 000 € à 1 000 000 €", fee: "3 % TTC" },
  { range: "Au-delà de 1 000 000 €", fee: "2 % TTC" },
];

const RENT_TIERS: { label: string; amount: string }[] = [
  { label: "Visite, dossier, bail — zone tendue", amount: "10 €/m² TTC" },
  { label: "Visite, dossier, bail — zone très tendue", amount: "12 €/m² TTC" },
  { label: "Visite, dossier, bail — hors zone tendue", amount: "8 €/m² TTC" },
  { label: "État des lieux d'entrée (partagé)", amount: "3 €/m² TTC" },
];

export default function HonorairesPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-12">
          <Breadcrumb
            items={[{ label: "Accueil", href: "/" }, { label: "Honoraires" }]}
          />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Barème d&apos;honoraires
          </h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-600">
            Barème applicable depuis le 1ᵉʳ janvier 2026. Tous les honoraires
            sont indiqués TTC (TVA à 20 % incluse).
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-12">
          <h2 className="text-2xl font-semibold tracking-tight">Vente</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Charge acquéreur — sauf stipulation contraire au mandat.
          </p>
          <div className="mt-4 overflow-hidden rounded border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left text-zinc-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    Tranche de prix (FAI*)
                  </th>
                  <th className="px-4 py-3 font-semibold">Honoraires TTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {SALE_TIERS.map((t) => (
                  <tr key={t.range}>
                    <td className="px-4 py-3 text-zinc-800">{t.range}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {t.fee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            * FAI = Frais d&apos;Agence Inclus (prix net vendeur + honoraires).
          </p>
          <p className="mt-3 text-sm text-zinc-700">
            En cas de mandat exclusif, le barème peut être ajusté — me contacter
            pour un devis personnalisé.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-12">
          <h2 className="text-2xl font-semibold tracking-tight">
            Location (longue durée)
          </h2>
          <p className="mt-2 text-sm text-zinc-700">
            Honoraires de négociation à la charge du <strong>bailleur</strong> :
            un mois de loyer hors charges (ou selon mandat).
          </p>
          <p className="mt-3 text-sm text-zinc-700">
            Honoraires partagés avec le <strong>locataire</strong> (loi ALUR —
            plafonds légaux) :
          </p>
          <div className="mt-4 overflow-hidden rounded border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-zinc-100 text-left text-zinc-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Prestation</th>
                  <th className="px-4 py-3 font-semibold">Plafond TTC / m²</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {RENT_TIERS.map((t) => (
                  <tr key={t.label}>
                    <td className="px-4 py-3 text-zinc-800">{t.label}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {t.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-zinc-700">
            Dépôt de garantie : 1 mois de loyer hors charges (non meublé) · 2
            mois (meublé).
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Les honoraires à la charge du locataire ne peuvent pas dépasser ceux
            à la charge du bailleur (loi ALUR).
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-12">
          <h2 className="text-xl font-semibold tracking-tight">
            Mentions légales &amp; médiation
          </h2>
          <div className="mt-4 space-y-2 text-sm text-zinc-700">
            <p>
              Cabinet Rimbault · {AGENT.legal.carteT} · {AGENT.legal.cci}
            </p>
            <p>{AGENT.legal.garant}</p>
            <p>
              En cas de litige relatif à une transaction, après une réclamation
              écrite restée sans réponse satisfaisante, le client consommateur
              peut saisir le médiateur de la consommation :{" "}
              {AGENT.legal.mediator}.
            </p>
          </div>
          <div className="mt-6">
            <LinkButton href="/mentions-legales" variant="secondary" size="sm">
              Mentions légales complètes
            </LinkButton>
          </div>
        </div>
      </section>
    </main>
  );
}
