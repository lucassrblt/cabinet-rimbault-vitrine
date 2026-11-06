import { type NextRequest, NextResponse } from "next/server";

// Fiche disparue lisible sans JavaScript (décision Zidane, journal lot 0).
// En Next 16.3, un notFound() levé depuis la fiche renvoie l'enveloppe
// `__next_error__` au corps vide, que seul le client remplit. Une URL sans
// page statique, elle, est rendue en HTML complet. Le proxy vérifie donc la
// référence AVANT le rendu et, si elle est inconnue, réécrit vers la page
// statique `(site)/biens-introuvable` (« Ce bien n'est plus en ligne. »,
// noindex) avec le statut 404 ; l'URL affichée reste celle de la fiche.
//
// Écart à la décision (en-tête `x-bien-introuvable` lu par `app/not-found.tsx`
// avec `headers()`) : `app/not-found.tsx` est la limite 404 de toutes les
// routes, et `headers()` y rendait tout le site dynamique au build (journal).
//
// - Lit la LISTE (`GET /properties?limit=100`), jamais la fiche : la fiche
//   incrémente `viewCount` dans l'API.
// - Liste gardée 300 s en mémoire du module (même durée que `REVALIDATE.list`).
//   `E2E_NO_CACHE=1` coupe cette mémoire, comme le cache de données.
// - Référence absente de la liste mémorisée : une relecture sans mémoire
//   avant de conclure (un bien publié à l'instant ne répond jamais 404,
//   recette D7). Une URL inconnue coûte donc une lecture de la liste.
// - Dans le doute, la page décide (`NextResponse.next()`) : API en erreur ou
//   lente, configuration absente, liste tronquée (plus de 100 biens).

export const config = {
  matcher: ["/biens/:reference", "/biens-introuvable"],
};

const TTL_MS = 300_000;
const TIMEOUT_MS = 3_000;
/** Page statique de la variante « bien disparu ». */
const PAGE_BIEN_INTROUVABLE = "/biens-introuvable";
/** Chemin sans route : 404 générale (`app/not-found.tsx`). */
const CHEMIN_SANS_ROUTE = "/introuvable";

type Liste = { references: Set<string>; complete: boolean };

let memoire: { liste: Liste; lue: number } | null = null;
let enCours: Promise<Liste | null> | null = null;

async function chargerListe(): Promise<Liste | null> {
  const base = process.env.PUBLIC_API_URL?.replace(/\/+$/, "");
  const cle = process.env.PUBLIC_API_KEY;
  if (!base || !cle) return null;
  try {
    const res = await fetch(`${base}/properties?limit=100`, {
      headers: { "X-API-Key": cle, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const corps = json as { data?: unknown; total?: unknown };
    if (!Array.isArray(corps.data)) return null;
    const references = new Set<string>();
    for (const bien of corps.data) {
      const ref = (bien as { reference?: unknown } | null)?.reference;
      if (typeof ref === "string") references.add(ref);
    }
    const complete =
      typeof corps.total !== "number" || corps.total <= corps.data.length;
    return { references, complete };
  } catch {
    return null;
  }
}

/** Liste mémorisée si elle a moins de `ageMax` ms, sinon relue. */
async function liste(ageMax = TTL_MS): Promise<Liste | null> {
  const sansCache = process.env.E2E_NO_CACHE === "1";
  if (!sansCache && memoire && Date.now() - memoire.lue < ageMax) {
    return memoire.liste;
  }
  // Une seule lecture à la fois : les requêtes simultanées l'attendent.
  enCours ??= chargerListe().finally(() => {
    enCours = null;
  });
  const resultat = await enCours;
  if (resultat && !sansCache) {
    memoire = { liste: resultat, lue: Date.now() };
  }
  return resultat;
}

function lireReference(pathname: string): string | null {
  const brut = pathname.slice("/biens/".length);
  try {
    return decodeURIComponent(brut);
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  // Les envois de formulaire (Server Actions, POST) passent sans contrôle.
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }
  // La variante n'existe pas comme adresse : tapée telle quelle, 404 générale.
  if (request.nextUrl.pathname === PAGE_BIEN_INTROUVABLE) {
    return reecrire404(request, CHEMIN_SANS_ROUTE);
  }
  const reference = lireReference(request.nextUrl.pathname);
  // Adresse mal encodée (`/biens/%E0`) : Next répondrait 500.
  if (reference === null) return reecrire404(request, CHEMIN_SANS_ROUTE);

  let biens = await liste();
  if (biens?.complete && !biens.references.has(reference)) {
    biens = await liste(0);
  }
  if (!biens || !biens.complete || biens.references.has(reference)) {
    return NextResponse.next();
  }

  return reecrire404(request, PAGE_BIEN_INTROUVABLE);
}

function reecrire404(request: NextRequest, chemin: string) {
  const cible = request.nextUrl.clone();
  cible.pathname = chemin;
  cible.search = "";
  return NextResponse.rewrite(cible, { status: 404 });
}
