"use client";

import { Button } from "@/components/ui/Button";

// « Imprimer le barème » (doc 04 §2.8-5) : la feuille d'impression de la page
// tient lieu de PDF. Masqué à l'impression.

export function PrintButton() {
  return (
    <Button
      variant="secondaire"
      onClick={() => window.print()}
      className="print:hidden"
    >
      Imprimer le barème
    </Button>
  );
}
