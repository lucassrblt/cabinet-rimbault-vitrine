"use client";

import { Phone, RotateCw } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { AGENT } from "@/lib/config/agent";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-gutter py-14 md:py-24">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Une erreur est survenue
      </h1>
      <p className="mt-3 max-w-xl text-base text-body">
        Désolé, cette page n&apos;a pas pu s&apos;afficher correctement. Vous
        pouvez réessayer dans un instant, ou revenir à l&apos;accueil.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset}>
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Réessayer
        </Button>
        <LinkButton href="/" variant="secondary">
          Retour à l&apos;accueil
        </LinkButton>
      </div>

      <p className="mt-10 text-sm text-body">
        Besoin d&apos;aide ?{" "}
        <a
          href={`tel:${AGENT.phoneE164}`}
          className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4"
        >
          <Phone className="h-4 w-4" aria-hidden="true" /> {AGENT.phoneDisplay}
        </a>
      </p>

      {isDev && (
        <pre className="mt-10 max-w-full overflow-x-auto rounded-sm border border-subtle bg-neutral-50 p-4 text-xs text-body">
          {error.message}
          {error.digest ? `\n\ndigest: ${error.digest}` : ""}
        </pre>
      )}
    </main>
  );
}
