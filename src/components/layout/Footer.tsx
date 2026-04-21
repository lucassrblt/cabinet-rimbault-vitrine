import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <h3 className="text-sm font-semibold">Agence</h3>
          <address className="mt-3 not-italic text-sm text-zinc-600">
            <p>Cabinet Rimbault</p>
            <p>Adresse à renseigner</p>
            <p>
              <a href="tel:+33000000000">Téléphone à renseigner</a>
            </p>
            <p>
              <a href="mailto:contact@cabinet-rimbault.fr">
                Email à renseigner
              </a>
            </p>
            <p>Horaires à renseigner</p>
          </address>
          <p className="mt-3 text-sm text-zinc-500">
            Retrouvez-moi aussi sur les réseaux depuis la page{" "}
            <Link href="/contact" className="underline underline-offset-2">
              Contact
            </Link>
            .
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Services</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
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
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            <li>
              <Link href="/a-propos">À propos</Link>
            </li>
            <li>
              <span className="text-zinc-400">Secteurs (à venir)</span>
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
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
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

      <div className="border-t border-zinc-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-zinc-500 md:px-6">
          <p className="font-medium text-zinc-700">Informations légales</p>
          <ul className="mt-2 space-y-1">
            <li>Carte professionnelle T n° — délivrée par la CCI de —</li>
            <li>Carte professionnelle G n° — (si gestion)</li>
            <li>RCS — · SIRET — · Forme juridique —</li>
            <li>Garant financier : — (adresse)</li>
            <li>Médiateur consommation : —</li>
          </ul>
          <p className="mt-3 text-zinc-500">
            © {new Date().getFullYear()} Cabinet Rimbault. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
