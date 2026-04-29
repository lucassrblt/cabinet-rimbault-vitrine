import Link from "next/link";
import { AGENT } from "@/lib/config/agent";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-subtle bg-page">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <h3 className="text-sm font-semibold">Agence</h3>
          <address className="mt-3 not-italic text-sm text-body">
            <p>Cabinet Rimbault</p>
            <p>
              {AGENT.address.line1}, {AGENT.address.postalCode}{" "}
              {AGENT.address.city}
            </p>
            <p>
              <a href={`tel:${AGENT.phoneE164}`}>{AGENT.phoneDisplay}</a>
            </p>
            <p>
              <a href={`mailto:${AGENT.email}`}>{AGENT.email}</a>
            </p>
            <p>{AGENT.hours.weekdays}</p>
            <p>{AGENT.hours.saturday}</p>
          </address>
          <p className="mt-3 text-sm text-muted">
            Retrouvez-moi aussi sur les réseaux depuis la page{" "}
            <Link href="/contact" className="underline underline-offset-2">
              Contact
            </Link>
            .
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Services</h3>
          <ul className="mt-3 space-y-2 text-sm text-body">
            <li>
              <Link href="/acheter">Acheter</Link>
            </li>
            <li>
              <Link href="/louer">Louer</Link>
            </li>
            <li>
              <Link href="/vendre">Vendre</Link>
            </li>
            <li>
              <Link href="/estimation">Estimation</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">L&apos;agence</h3>
          <ul className="mt-3 space-y-2 text-sm text-body">
            <li>
              <Link href="/a-propos">À propos</Link>
            </li>
            <li>
              <span className="text-muted">Secteurs (à venir)</span>
            </li>
            <li>
              <Link href="/a-propos#avis">Avis clients</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Légal</h3>
          <ul className="mt-3 space-y-2 text-sm text-body">
            <li>
              <Link href="/mentions-legales">Mentions légales</Link>
            </li>
            <li>
              <Link href="/politique-de-confidentialite">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link href="/cookies">Cookies</Link>
            </li>
            <li>
              <Link href="/honoraires">Honoraires</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-subtle">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-muted md:px-6">
          <p className="font-medium text-body">Informations légales</p>
          <ul className="mt-2 space-y-1">
            <li>
              {AGENT.legal.carteT} — {AGENT.legal.cci}
            </li>
            <li>
              {AGENT.legal.rcs} · {AGENT.legal.siret}
            </li>
            <li>Garant financier : {AGENT.legal.garant}</li>
            <li>{AGENT.legal.mediator}</li>
          </ul>
          <p className="mt-3">
            <Link href="/mentions-legales" className="underline">
              Voir les mentions légales complètes
            </Link>
          </p>
          <p className="mt-2 text-muted">
            © {new Date().getFullYear()} Cabinet Rimbault. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
