"use client";

import { useEffect } from "react";
import { agency } from "@/lib/agency";

// Erreur du layout racine (doc 04 §2.11) : document autonome, sans globals.css
// ni polices (Next les ignore ici). Styles en ligne, palette du brief §3.1.

const page = {
  margin: 0,
  minHeight: "100vh",
  background: "#F8F2E9",
  color: "#251C19",
  fontFamily: 'Georgia, "Times New Roman", serif',
} as const;

const box = {
  maxWidth: "40rem",
  margin: "0 auto",
  padding: "4rem 1.25rem",
  lineHeight: 1.6,
} as const;

const link = { color: "#5F1A24" } as const;

export default function GlobalError({
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
    <html lang="fr">
      <body style={page}>
        <title>Cabinet Rimbault</title>
        <main style={box}>
          <h1 style={{ fontWeight: 400, fontSize: "2rem", lineHeight: 1.2 }}>
            Un problème technique empêche l’affichage de cette page.
          </h1>
          <p>
            Vous pouvez réessayer dans un instant, ou nous appeler au{" "}
            <a href={agency.phone.href} style={link}>
              {agency.phone.display}
            </a>
            .
          </p>
          <p>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                ...link,
                font: "inherit",
                background: "none",
                border: 0,
                padding: 0,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Réessayer
            </button>
          </p>
        </main>
      </body>
    </html>
  );
}
