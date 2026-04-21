import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AGENT } from "@/lib/config/agent";

export const metadata: Metadata = {
  title: "Me contacter",
  description:
    "Téléphone, email, WhatsApp, adresse et horaires du Cabinet Rimbault. Formulaire typé pour une prise en charge rapide.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <Breadcrumb
            items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
          />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Me contacter
          </h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-600">
            Disponible par téléphone, email, ou directement à l&apos;agence.
            Réponse sous 24 h en semaine.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <a
              href={`tel:${AGENT.phoneE164}`}
              className="flex flex-col items-start gap-2 rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-900"
            >
              <Phone className="h-5 w-5 text-zinc-500" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Téléphone
              </span>
              <span className="text-base font-semibold text-zinc-900">
                {AGENT.phoneDisplay}
              </span>
            </a>
            <a
              href={`mailto:${AGENT.email}`}
              className="flex flex-col items-start gap-2 rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-900"
            >
              <Mail className="h-5 w-5 text-zinc-500" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Email
              </span>
              <span className="text-base font-semibold text-zinc-900">
                {AGENT.email}
              </span>
            </a>
            <a
              href={AGENT.whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex flex-col items-start gap-2 rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-900"
            >
              <MessageCircle
                className="h-5 w-5 text-zinc-500"
                aria-hidden="true"
              />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                WhatsApp
              </span>
              <span className="text-base font-semibold text-zinc-900">
                Démarrer une conversation
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader title="M'envoyer un message" />
          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader title="Venir à l'agence" />
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-zinc-500">
                <MapPin className="h-8 w-8" aria-hidden="true" />
                <p className="text-sm">
                  {AGENT.address.line1}
                  <br />
                  {AGENT.address.postalCode} {AGENT.address.city}
                </p>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(
                    `${AGENT.address.line1} ${AGENT.address.postalCode} ${AGENT.address.city}`,
                  )}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 underline underline-offset-4"
                >
                  Ouvrir dans Maps
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Adresse
                </p>
                <address className="mt-1 not-italic text-sm text-zinc-800">
                  {AGENT.address.line1}
                  <br />
                  {AGENT.address.postalCode} {AGENT.address.city}
                </address>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Horaires
                </p>
                <ul className="mt-1 text-sm text-zinc-800">
                  <li>{AGENT.hours.weekdays}</li>
                  <li>{AGENT.hours.saturday}</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Transports
                </p>
                <ul className="mt-1 space-y-0.5 text-sm text-zinc-800">
                  {AGENT.transports.map((t) => (
                    <li key={t.label}>{t.label}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader title="Me suivre" />
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={AGENT.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded border border-zinc-300 px-4 py-2 text-sm font-medium hover:border-zinc-900"
            >
              Instagram
            </a>
            <a
              href={AGENT.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded border border-zinc-300 px-4 py-2 text-sm font-medium hover:border-zinc-900"
            >
              LinkedIn
            </a>
            <a
              href={AGENT.googleBusinessUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded border border-zinc-300 px-4 py-2 text-sm font-medium hover:border-zinc-900"
            >
              Google Business
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
