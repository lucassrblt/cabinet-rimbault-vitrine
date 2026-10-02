import Link from "next/link";
import { agency } from "@/lib/agency";

// Pied de page clair : quatre colonnes, puis une ligne de mentions
// (test de goût du 2026-10-02 : « colonnes claires » + « une ligne »).
export function SiteFooter({ base = "/maquettes" }: { base?: string }) {
  return (
    <footer className="mt-auto bg-pierre">
      <div className="conteneur grid grid-cols-2 gap-x-6 gap-y-10 pt-14 pb-12 text-mention md:grid-cols-4 md:gap-10">
        <div>
          <p className="font-medium text-encre">Cabinet Rimbault</p>
          <p className="mt-3 text-gris">
            {agency.address.street}
            <br />
            {agency.address.postalCode} {agency.address.city}
          </p>
        </div>
        <div>
          <p className="font-medium text-encre">Nous joindre</p>
          <p className="mt-3">
            <a
              href={agency.phone.href}
              className="text-gris tabular-nums transition-colors hover:text-encre"
            >
              {agency.phone.display}
            </a>
          </p>
          <p className="mt-1">
            <a
              href={agency.mapsDirections}
              className="text-gris transition-colors hover:text-encre"
            >
              Itinéraire
            </a>
          </p>
        </div>
        <div>
          <p className="font-medium text-encre">Horaires</p>
          <dl className="mt-3 space-y-1 text-gris">
            {agency.hours.map((h) => (
              <div key={h.days}>
                <dt className="inline">{h.days} : </dt>
                <dd className="inline">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
        <nav aria-label="Pied de page">
          <p className="font-medium text-encre">Le site</p>
          <ul className="mt-3 space-y-1 text-gris">
            {[
              [`${base}/biens`, "Nos biens"],
              [`${base}/agence`, "L’agence"],
              [`${base}/contact`, "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="transition-colors hover:text-encre"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-filet">
        <div className="conteneur flex flex-col gap-3 py-5 text-[0.75rem] text-gris md:flex-row md:items-center md:justify-between">
          <p className="max-w-[90ch]">
            {agency.legal.card}. {agency.legal.guarantor}.{" "}
            {agency.legal.company}. Médiateur de la consommation :{" "}
            {agency.legal.mediator ?? (
              <span className="text-rouge">à compléter</span>
            )}
            .
          </p>
          <ul className="flex shrink-0 gap-5">
            {["Honoraires", "Mentions légales", "Confidentialité"].map((l) => (
              <li key={l}>
                <span className="cursor-pointer transition-colors hover:text-encre">
                  {l}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
