import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { AGENT } from "@/lib/config/agent";

export function ContactSidebar() {
  return (
    <aside className="rounded-lg border border-subtle bg-card p-6 md:sticky md:top-24 md:p-8">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-600">
        Le Cabinet
      </p>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-primary">
        En un coup d&apos;œil
      </p>

      <div className="mt-8 space-y-7">
        <InfoBlock
          icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
          label="Adresse"
        >
          <address className="not-italic text-[15px] leading-relaxed text-body">
            {AGENT.address.line1}
            <br />
            {AGENT.address.postalCode} {AGENT.address.city}
          </address>
        </InfoBlock>

        <InfoBlock
          icon={<Clock className="h-4 w-4" aria-hidden="true" />}
          label="Horaires"
        >
          <ul className="space-y-0.5 text-[15px] leading-relaxed text-body">
            {AGENT.hours.monday && <li>{AGENT.hours.monday}</li>}
            <li>{AGENT.hours.weekdays}</li>
            {AGENT.hours.saturday && <li>{AGENT.hours.saturday}</li>}
          </ul>
        </InfoBlock>
      </div>

      <div className="mt-8 border-t border-subtle pt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Joindre directement
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <a
            href={`tel:${AGENT.phoneE164}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary-700"
          >
            <Phone
              className="h-4 w-4 text-primary-600 transition group-hover:scale-110"
              aria-hidden="true"
            />
            {AGENT.phoneDisplay}
          </a>
          <a
            href={`mailto:${AGENT.email}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary-700"
          >
            <Mail
              className="h-4 w-4 text-primary-600 transition group-hover:scale-110"
              aria-hidden="true"
            />
            {AGENT.email}
          </a>
        </div>
      </div>
    </aside>
  );
}

function InfoBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </p>
        <div className="mt-1.5">{children}</div>
      </div>
    </div>
  );
}
