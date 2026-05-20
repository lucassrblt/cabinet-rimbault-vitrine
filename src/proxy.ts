import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "site-preview";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours
const QUERY_PARAM = "preview";
const MAINTENANCE_PATH = "/maintenance";

/**
 * Gate « Site en cours de développement » (proxy Next 16, ex-middleware).
 *
 * Actif seulement si `MAINTENANCE_MODE=on`. Sinon : no-op total.
 *
 * Bypass : visiter une URL avec `?preview=<MAINTENANCE_BYPASS_TOKEN>` pose un
 * cookie httpOnly (30 j), puis l'utilisateur navigue normalement. Sans le
 * cookie, toutes les requêtes sont rewrite vers `/maintenance` (l'URL d'origine
 * reste visible dans la barre d'adresse).
 */
export function proxy(req: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== "on") {
    return NextResponse.next();
  }

  const token = process.env.MAINTENANCE_BYPASS_TOKEN;
  const url = req.nextUrl;

  // 1) ?preview=TOKEN → pose le cookie + redirige sans le query param.
  const preview = url.searchParams.get(QUERY_PARAM);
  if (token && preview && preview === token) {
    const clean = new URL(url);
    clean.searchParams.delete(QUERY_PARAM);
    const res = NextResponse.redirect(clean);
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return res;
  }

  // 2) Cookie valide → laisse passer.
  if (token && req.cookies.get(COOKIE_NAME)?.value === token) {
    return NextResponse.next();
  }

  // 3) Sinon → rewrite vers /maintenance.
  return NextResponse.rewrite(new URL(MAINTENANCE_PATH, req.url));
}

export const config = {
  matcher: [
    // Tout sauf : assets Next, route API, page maintenance, fichiers statiques courants.
    "/((?!_next/|api/|maintenance|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2?|css|js)$).*)",
  ],
};
