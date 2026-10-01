import { agency } from "@/lib/agency";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="bg-pierre">
      <div className="conteneur grid gap-10 py-14 text-mention md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-5 text-gris">
            {agency.address.street}
            <br />
            {agency.address.postalCode} {agency.address.city}
          </p>
          <p className="mt-2">
            <a href={agency.phone.href} className="lien">
              {agency.phone.display}
            </a>
          </p>
        </div>
        <div className="text-gris md:col-span-5">
          <p className="text-encre">Informations réglementaires</p>
          <p className="mt-3">{agency.legal.card}</p>
          <p className="mt-1">{agency.legal.guarantor}</p>
          <p className="mt-1">{agency.legal.company}</p>
          <p className="mt-1">
            Médiateur de la consommation :{" "}
            {agency.legal.mediator ?? (
              <span className="text-rouge">à compléter</span>
            )}
          </p>
        </div>
        <ul className="space-y-2 md:col-span-3">
          <li>
            <span className="lien">Barème des honoraires</span>
          </li>
          <li>
            <span className="lien">Mentions légales</span>
          </li>
          <li>
            <span className="lien">Confidentialité</span>
          </li>
        </ul>
      </div>
    </footer>
  );
}
