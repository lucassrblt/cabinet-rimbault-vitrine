import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { AGENT } from "@/lib/config/agent";

const SERVICE_LINKS = [
  { href: "/acheter", label: "Acheter" },
  { href: "/louer", label: "Louer" },
  { href: "/vendre", label: "Vendre" },
  { href: "/estimation", label: "Estimation gratuite" },
] as const;

const AGENCE_LINKS = [
  { href: "/agence", label: "L'agence" },
  { href: "/agence#avis", label: "Avis clients" },
  { href: "/honoraires", label: "Honoraires" },
  { href: "/contact", label: "Contact" },
] as const;

const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-de-confidentialite", label: "Confidentialité" },
  { href: "/cookies", label: "Cookies" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-neutral-700 bg-inverse">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-serif text-xl font-semibold text-on-inverse">
              Cabinet Rimbault
            </p>
            <div className="mt-2 h-px w-10 bg-primary-600" />
            <address className="mt-5 space-y-3 not-italic text-sm leading-relaxed text-on-inverse">
              <p className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary-600"
                  aria-hidden="true"
                />
                <span>
                  {AGENT.address.line1}
                  <br />
                  {AGENT.address.postalCode} {AGENT.address.city}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone
                  className="h-4 w-4 shrink-0 text-primary-600"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${AGENT.phoneE164}`}
                  className="transition-colors hover:text-primary-300"
                >
                  {AGENT.phoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail
                  className="h-4 w-4 shrink-0 text-primary-600"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${AGENT.email}`}
                  className="transition-colors hover:text-primary-300"
                >
                  {AGENT.email}
                </a>
              </p>
            </address>
            <p className="mt-4 text-xs text-neutral-400">
              {AGENT.hours.weekdays}
              {AGENT.hours.saturday && (
                <>
                  <br />
                  {AGENT.hours.saturday}
                </>
              )}
            </p>
          </div>

          <FooterNav title="Services" links={SERVICE_LINKS} />
          <FooterNav title="L'agence" links={AGENCE_LINKS} />
          <FooterNav title="Légal" links={LEGAL_LINKS} />
        </div>
      </div>

      <div className="border-t border-neutral-700">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
            Informations réglementaires
          </p>
          <ul className="mt-3 space-y-1 text-xs leading-relaxed text-neutral-400">
            <li>
              {AGENT.legal.carteT} — {AGENT.legal.cci}
            </li>
            <li>
              {AGENT.legal.rcs} · {AGENT.legal.siret}
            </li>
            <li>Garant financier : {AGENT.legal.garant}</li>
            <li>{AGENT.legal.mediator}</li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/mentions-legales"
              className="inline-flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-primary-300"
            >
              Mentions légales complètes
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
            <p className="text-xs text-neutral-500">
              © {new Date().getFullYear()} Cabinet Rimbault. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterNav({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-neutral-300 transition-colors hover:text-primary-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
