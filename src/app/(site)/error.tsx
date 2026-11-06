"use client";

import { useEffect } from "react";
import { ServiceError } from "@/components/layout/ServiceError";
import { Button } from "@/components/ui/Button";

// Erreur inattendue dans une page publique (doc 04 §2.11). L'en-tête et le pied
// du layout (site) restent affichés. Le contenu (titre, chapô, téléphone) est
// partagé avec la fiche d'un bien en panne d'API : `ServiceError` (D8).
// « Réessayer » en bouton secondaire : l'appel reste la sortie principale.
// Next 16.3 : `retry` refait la requête.

export default function SiteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ServiceError
      action={
        <Button
          variant="secondaire"
          onClick={() => retry()}
          className="mt-10 md:mt-12"
        >
          Réessayer
        </Button>
      }
    />
  );
}
