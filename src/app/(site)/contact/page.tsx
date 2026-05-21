import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AGENT } from "@/lib/config/agent";
import type { ContactInput } from "@/lib/validation";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export const metadata: Metadata = {
  title: `Contact — agent immobilier à ${AGENT.address.city}`,
  description:
    "Téléphone, email, WhatsApp, adresse et horaires du Cabinet Rimbault. Formulaire typé pour une prise en charge rapide.",
};

const SUBJECT_VALUES: ContactInput["subject"][] = [
  "vente",
  "location",
  "estimation",
  "rdv",
  "autre",
];

function resolveSubject(
  v: string | undefined,
): ContactInput["subject"] | undefined {
  return SUBJECT_VALUES.find((s) => s === v);
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const rawSubject = typeof sp.subject === "string" ? sp.subject : undefined;
  const defaultSubject = resolveSubject(rawSubject);
  const defaultReference = typeof sp.ref === "string" ? sp.ref : undefined;
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-subtle bg-neutral-50/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <Breadcrumb
            items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
          />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Me contacter
          </h1>
          <p className="mt-3 max-w-2xl text-base text-body">
            Disponible par téléphone, email, ou directement à l&apos;agence.
            Réponse sous 24 h en semaine.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <a
              href={`tel:${AGENT.phoneE164}`}
              className="flex flex-col items-start gap-2 rounded-sm border border-subtle bg-card p-5 hover:border-strong"
            >
              <Phone className="h-5 w-5 text-muted" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                Téléphone
              </span>
              <span className="text-base font-semibold text-primary">
                {AGENT.phoneDisplay}
              </span>
            </a>
            <a
              href={`mailto:${AGENT.email}`}
              className="flex flex-col items-start gap-2 rounded-sm border border-subtle bg-card p-5 hover:border-strong"
            >
              <Mail className="h-5 w-5 text-muted" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                Email
              </span>
              <span className="text-base font-semibold text-primary">
                {AGENT.email}
              </span>
            </a>
            <a
              href={AGENT.whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex flex-col items-start gap-2 rounded-sm border border-subtle bg-card p-5 hover:border-strong"
            >
              <MessageCircle
                className="h-5 w-5 text-muted"
                aria-hidden="true"
              />
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                WhatsApp
              </span>
              <span className="text-base font-semibold text-primary">
                Démarrer une conversation
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-subtle">
        <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader title="M'envoyer un message" />
          <div className="mt-6 rounded-sm border border-subtle bg-card p-6 md:p-8">
            <ContactForm
              defaultSubject={defaultSubject}
              defaultReference={defaultReference}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-subtle bg-neutral-50/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeader title="Venir à l'agence" />
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-sm border border-subtle bg-section">
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted">
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
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-4"
                >
                  Ouvrir dans Maps
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Adresse
                </p>
                <address className="mt-1 not-italic text-sm text-primary">
                  {AGENT.address.line1}
                  <br />
                  {AGENT.address.postalCode} {AGENT.address.city}
                </address>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Horaires
                </p>
                <ul className="mt-1 text-sm text-primary">
                  <li>{AGENT.hours.weekdays}</li>
                  {AGENT.hours.saturday && <li>{AGENT.hours.saturday}</li>}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  Transports
                </p>
                <ul className="mt-1 space-y-0.5 text-sm text-primary">
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
              className="inline-flex items-center gap-2 rounded-sm border border-default px-4 py-2 text-sm font-medium hover:border-strong"
            >
              Instagram
            </a>
            <a
              href={AGENT.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-sm border border-default px-4 py-2 text-sm font-medium hover:border-strong"
            >
              LinkedIn
            </a>
            <a
              href={AGENT.googleBusinessUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-sm border border-default px-4 py-2 text-sm font-medium hover:border-strong"
            >
              Google Business
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
