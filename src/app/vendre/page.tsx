import { Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Accordion } from "@/components/ui/Accordion";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  AGENT,
  AGENT_ENGAGEMENTS,
  SELLING_FAQ,
  SELLING_STEPS,
} from "@/lib/config/agent";

export const metadata: Metadata = {
  title: "Vendre votre bien",
  description:
    "Méthode, étapes, engagements et FAQ. Un agent immobilier indépendant pour accompagner votre vente en Île-de-France.",
};

export default function VendrePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <Breadcrumb
            items={[{ label: "Accueil", href: "/" }, { label: "Vendre" }]}
          />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Vendre votre bien avec un accompagnement humain
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-600 md:text-lg">
            Estimation gratuite, transparence sur la méthode, un seul
            interlocuteur du premier rendez-vous à la signature. Je défends
            votre intérêt, pas le mien.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/estimation">Estimer mon bien</LinkButton>
            <LinkButton href="/contact" variant="secondary">
              Me contacter
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader
            title="Comment ça se passe, concrètement"
            lede="Quatre étapes claires, avec des délais indicatifs et ce que je fais précisément à chacune."
          />
          <ol className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {SELLING_STEPS.map((s) => (
              <li
                key={s.title}
                className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5"
              >
                <p className="text-base font-semibold text-zinc-900">
                  {s.title}
                </p>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  {s.duration}
                </p>
                <p className="text-sm text-zinc-700">{s.role}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader
            title="Ce que j'apporte à votre vente"
            lede="Pas de promesses abstraites — des engagements concrets, vérifiables."
          />
          <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {AGENT_ENGAGEMENTS.map((e) => (
              <li
                key={e.title}
                className="rounded-xl border border-zinc-200 bg-white p-5"
              >
                <p className="text-base font-semibold text-zinc-900">
                  {e.title}
                </p>
                <p className="mt-2 text-sm text-zinc-700">{e.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader
            title="Honoraires : tout est clair"
            lede="Pas d'avance. Les honoraires ne sont dus qu'en cas de vente. Le barème complet est publié."
          />
          <div className="mt-6">
            <LinkButton href="/honoraires" variant="secondary">
              Consulter le barème complet
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader title="Questions fréquentes" />
          <div className="mt-6 max-w-3xl">
            <Accordion
              items={SELLING_FAQ.map((q, i) => ({
                id: `faq-${i}`,
                question: q.question,
                answer: q.answer,
              }))}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center md:px-6 md:py-16">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Prêt à estimer votre bien ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-zinc-600">
            L&apos;estimation est gratuite et sans engagement. Réponse
            personnalisée sous 24 à 48 h.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton href="/estimation">Estimer mon bien</LinkButton>
          </div>
          <p className="mt-8 text-sm text-zinc-600">
            Ou directement :{" "}
            <a
              href={`tel:${AGENT.phoneE164}`}
              className="inline-flex items-center gap-1 font-medium text-zinc-900 underline underline-offset-4"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />{" "}
              {AGENT.phoneDisplay}
            </a>{" "}
            ·{" "}
            <a
              href={`mailto:${AGENT.email}`}
              className="inline-flex items-center gap-1 font-medium text-zinc-900 underline underline-offset-4"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> {AGENT.email}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
