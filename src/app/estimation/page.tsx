import type { Metadata } from "next";
import { EstimationForm } from "@/components/forms/EstimationForm";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export const metadata: Metadata = {
  title: "Estimation gratuite de votre bien",
  description:
    "Demandez une estimation gratuite de votre bien. Réponse personnalisée sous 24 à 48 h — pas d'algorithme, une analyse humaine.",
};

export default function EstimationPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-12">
          <Breadcrumb
            items={[{ label: "Accueil", href: "/" }, { label: "Estimation" }]}
          />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Estimation gratuite de votre bien
          </h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-600">
            Réponse personnalisée sous 24 à 48 h. Pas d&apos;algorithme :
            j&apos;analyse votre bien et je vous donne mon avis argumenté.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 md:py-12">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 md:p-8">
            <EstimationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
