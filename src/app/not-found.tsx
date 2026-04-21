import { Phone } from "lucide-react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { LinkButton } from "@/components/ui/Button";
import { AGENT } from "@/lib/config/agent";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-14 md:px-6 md:py-24">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Cette page n&apos;existe pas (ou plus)
      </h1>
      <p className="mt-3 max-w-xl text-base text-zinc-600">
        Le bien que vous cherchiez a peut-être été vendu ou loué. Voici quelques
        pistes pour continuer votre recherche.
      </p>

      <div className="mt-8">
        <HeroSearch />
      </div>

      <div className="mt-8">
        <p className="text-sm font-medium text-zinc-900">
          Ou accédez directement à :
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <LinkButton href="/acheter" variant="secondary">
            Voir les biens à vendre
          </LinkButton>
          <LinkButton href="/louer" variant="secondary">
            Voir les biens à louer
          </LinkButton>
          <LinkButton href="/estimation" variant="secondary">
            Estimer mon bien
          </LinkButton>
          <LinkButton href="/contact" variant="secondary">
            Me contacter
          </LinkButton>
        </div>
      </div>

      <p className="mt-10 text-sm text-zinc-600">
        Besoin d&apos;aide ?{" "}
        <a
          href={`tel:${AGENT.phoneE164}`}
          className="inline-flex items-center gap-1 font-medium text-zinc-900 underline underline-offset-4"
        >
          <Phone className="h-4 w-4" aria-hidden="true" /> {AGENT.phoneDisplay}
        </a>
      </p>
    </main>
  );
}
