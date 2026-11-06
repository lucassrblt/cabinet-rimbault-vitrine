"use client";

import { useEffect } from "react";
import { agency } from "@/lib/agency";

// Erreur du layout racine (doc 04 §2.11) : document autonome, sans globals.css
// ni polices (Next les ignore ici). Styles en ligne aux couleurs de la
// Galerie : mur blanc chaud, encre brune, grenat pour les liens ; Host
// Grotesk si elle est installée, sinon la police système.

const page = {
  margin: 0,
  minHeight: "100vh",
  background: "#FAF7F2",
  color: "#2A1D1A",
  fontFamily:
    '"Host Grotesk", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
  fontSize: 14,
  WebkitFontSmoothing: "antialiased",
} as const;

const header = {
  maxWidth: 1440,
  margin: "0 auto",
  padding: "26px clamp(20px, 4.4vw, 72px)",
  fontSize: 13,
  fontWeight: 500,
} as const;

const box = {
  maxWidth: 1440,
  margin: "0 auto",
  padding: "96px clamp(20px, 4.4vw, 72px)",
  lineHeight: 1.6,
} as const;

const title = {
  margin: 0,
  maxWidth: "18em",
  fontFamily: '"Iowan Old Style", "Palatino Linotype", Georgia, serif',
  fontWeight: 300,
  fontSize: 30,
  lineHeight: 1.2,
} as const;

const link = { color: "#6E1A26" } as const;

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
        <title>{agency.name}</title>
        <header style={header}>{agency.name}</header>
        <main style={box}>
          <h1 style={title}>
            Un problème technique empêche l’affichage de cette page.
          </h1>
          <p style={{ margin: "14px 0 0" }}>
            Vous pouvez réessayer dans un instant, ou nous appeler au{" "}
            <a href={agency.phone.href} style={link}>
              {agency.phone.display}
            </a>
            .
          </p>
          <p style={{ margin: "32px 0 0" }}>
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
                textUnderlineOffset: 4,
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
