import {
  ArrowUpRight,
  Bus,
  ExternalLink,
  ParkingCircle,
  TrainFront,
} from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { RevealMask } from "@/components/ui/RevealMask";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextReveal } from "@/components/ui/TextReveal";
import { AGENT, isPlaceholder } from "@/lib/config/agent";

const TRANSPORT_ICONS = {
  metro: TrainFront,
  bus: Bus,
  parking: ParkingCircle,
} as const;

export function ContactMap() {
  const fullAddress = `${AGENT.address.line1}, ${AGENT.address.postalCode} ${AGENT.address.city}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;

  return (
    <section className="bg-header">
      <div className="mx-auto w-full max-w-6xl px-gutter py-16 md:py-20">
        <SectionHeader
          eyebrow="L'agence"
          title="Venir nous voir"
          lede={`${AGENT.address.line1} — ${AGENT.address.city}. Parking et accès transports à proximité.`}
        />

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr]">
          <RevealMask direction="up" delay={0.1}>
            <div className="relative overflow-hidden rounded-lg border border-subtle bg-neutral-100 aspect-[16/10] md:aspect-auto md:h-[440px]">
              <iframe
                src={embedUrl}
                title={`Carte — ${fullAddress}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </RevealMask>

          <div className="flex flex-col">
            <TextReveal delay={0.1}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Adresse
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-primary">
                {AGENT.address.line1}
                <br />
                {AGENT.address.postalCode} {AGENT.address.city}
              </p>
            </TextReveal>

            <TextReveal delay={0.2} className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Y accéder
              </p>
              <ul className="mt-3 space-y-3">
                {AGENT.transports.map((t) => {
                  const Icon = TRANSPORT_ICONS[t.icon];
                  return (
                    <li key={t.label} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-[15px] leading-relaxed text-body">
                        {t.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </TextReveal>

            <TextReveal delay={0.3} className="mt-8 flex flex-col gap-3">
              <LinkButton
                href={directionsUrl}
                variant="primary"
                size="md"
                external
              >
                Itinéraire Google Maps
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </LinkButton>

              {!isPlaceholder(AGENT.googleBusinessUrl) && (
                <a
                  href={AGENT.googleBusinessUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-muted underline underline-offset-4 transition hover:text-primary"
                >
                  Voir notre fiche Google Business
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </TextReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
