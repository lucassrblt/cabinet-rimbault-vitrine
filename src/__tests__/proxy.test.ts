// Tests unitaires de la porte de maintenance et du périmètre de `src/proxy.ts`,
// lancés par Node seul (aucun serveur, aucune API) :
//   npm run test:unit   (ou node --test --import ./src/__tests__/register.mjs src/__tests__/proxy.test.ts)
// Le matcher et les redirections sont évalués par les utilitaires de test de
// Next (`next/experimental/testing/server`), avec la configuration réelle.

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  getRedirectUrl,
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import nextConfig from "../../next.config";
import { config, porteMaintenance, proxy } from "../proxy";

const BASE = "https://cabinet-rimbault.fr";
const JETON = "jeton-de-test-0123456789";

function requete(
  chemin: string,
  init: { method?: string; cookie?: string } = {},
) {
  const headers = new Headers();
  if (init.cookie) headers.set("cookie", init.cookie);
  return new NextRequest(new URL(chemin, BASE), {
    method: init.method ?? "GET",
    headers,
  });
}

const ENV = [
  "MAINTENANCE_MODE",
  "MAINTENANCE_BYPASS_TOKEN",
  "PUBLIC_API_URL",
  "PUBLIC_API_KEY",
] as const;
let sauvegarde: Record<string, string | undefined> = {};

beforeEach(() => {
  sauvegarde = Object.fromEntries(ENV.map((k) => [k, process.env[k]]));
  // Sans API : le contrôle des biens disparus laisse décider la page.
  delete process.env.PUBLIC_API_URL;
  delete process.env.PUBLIC_API_KEY;
});

afterEach(() => {
  for (const k of ENV) {
    if (sauvegarde[k] === undefined) delete process.env[k];
    else process.env[k] = sauvegarde[k];
  }
});

describe("porte fermée (MAINTENANCE_MODE absente)", () => {
  beforeEach(() => {
    delete process.env.MAINTENANCE_MODE;
    process.env.MAINTENANCE_BYPASS_TOKEN = JETON;
  });

  it("laisse passer les pages", async () => {
    for (const chemin of ["/", "/biens", "/contact", `/?preview=${JETON}`]) {
      assert.equal(porteMaintenance(requete(chemin)), null, chemin);
      const res = await proxy(requete(chemin));
      assert.equal(isRewrite(res), false, chemin);
      assert.equal(getRedirectUrl(res), null, chemin);
    }
  });

  it("/maintenance tapée telle quelle : 404 générale", () => {
    const res = porteMaintenance(requete("/maintenance"));
    assert.ok(res);
    assert.equal(res.status, 404);
    assert.equal(new URL(getRewrittenUrl(res) ?? "").pathname, "/introuvable");
  });

  it("garde le contrôle des biens disparus", async () => {
    const res = await proxy(requete("/biens-introuvable"));
    assert.equal(res.status, 404);
    assert.equal(new URL(getRewrittenUrl(res) ?? "").pathname, "/introuvable");
  });
});

describe("porte posée (MAINTENANCE_MODE=on)", () => {
  beforeEach(() => {
    process.env.MAINTENANCE_MODE = "on";
    process.env.MAINTENANCE_BYPASS_TOKEN = JETON;
  });

  it("réécrit toute page vers /maintenance, toutes méthodes", async () => {
    for (const method of ["GET", "HEAD", "POST", "PUT", "DELETE"]) {
      for (const chemin of [
        "/",
        "/biens/10.131",
        "/biens-introuvable",
        "/contact?x=1",
      ]) {
        const res = await proxy(requete(chemin, { method }));
        assert.equal(isRewrite(res), true, `${method} ${chemin}`);
        const cible = new URL(getRewrittenUrl(res) ?? "");
        assert.equal(cible.pathname, "/maintenance");
        assert.equal(cible.search, "");
        assert.equal(res.status, 200);
      }
    }
  });

  it("?preview=<jeton> : cookie posé et redirection sans le paramètre", () => {
    const res = porteMaintenance(
      requete(`/biens?preview=${JETON}&commune=Asnieres`),
    );
    assert.ok(res);
    const cible = new URL(getRedirectUrl(res) ?? "");
    assert.equal(cible.pathname, "/biens");
    assert.equal(cible.searchParams.get("preview"), null);
    assert.equal(cible.searchParams.get("commune"), "Asnieres");
    const cookie = res.headers.get("set-cookie") ?? "";
    assert.match(cookie, new RegExp(`^site-preview=${JETON}`));
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /Secure/i);
    assert.match(cookie, /SameSite=lax/i);
    assert.match(cookie, /Max-Age=2592000/);
    assert.match(cookie, /Path=\//);
  });

  it("mauvais jeton : page de maintenance", () => {
    const res = porteMaintenance(requete("/?preview=faux"));
    assert.ok(res && isRewrite(res));
    assert.equal(new URL(getRewrittenUrl(res) ?? "").pathname, "/maintenance");
  });

  it("cookie valide : le site, y compris le contrôle des biens disparus", async () => {
    const cookie = `site-preview=${JETON}`;
    assert.equal(porteMaintenance(requete("/", { cookie })), null);
    assert.equal(
      porteMaintenance(requete("/contact", { method: "POST", cookie })),
      null,
    );
    const res = await proxy(requete("/biens-introuvable", { cookie }));
    assert.equal(res.status, 404);
    assert.equal(new URL(getRewrittenUrl(res) ?? "").pathname, "/introuvable");
  });

  it("cookie d'un ancien jeton : page de maintenance", () => {
    const res = porteMaintenance(
      requete("/", { cookie: "site-preview=ancien" }),
    );
    assert.ok(res && isRewrite(res));
  });

  it("sans jeton configuré : aucun accès, même avec ?preview= vide", () => {
    delete process.env.MAINTENANCE_BYPASS_TOKEN;
    for (const chemin of ["/?preview=", "/?preview=undefined"]) {
      const res = porteMaintenance(
        requete(chemin, { cookie: "site-preview=" }),
      );
      assert.ok(res && isRewrite(res), chemin);
    }
  });
});

describe("matcher", () => {
  const couvre = (url: string) => unstable_doesMiddlewareMatch({ config, url });

  it("couvre les pages, fiches et la variante bien disparu", () => {
    for (const url of [
      "/",
      "/biens",
      "/biens/10.131",
      "/biens/ZZ",
      "/biens-introuvable",
      "/vendre/estimation",
      "/contact?ref=10.131",
      "/maintenance",
      "/mentions-legales",
    ]) {
      assert.equal(couvre(url), true, url);
    }
  });

  it("laisse les fichiers statiques et internes", () => {
    for (const url of [
      "/_next/static/chunks/main.js",
      "/_next/image?url=%2Fdevanture.jpg&w=640&q=75",
      "/devanture.jpg",
      "/variantes/galerie/photo.webp",
      "/icon.svg",
      "/apple-icon.png",
      "/opengraph-image.png",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml",
      "/api/x",
    ]) {
      assert.equal(couvre(url), false, url);
    }
  });
});

describe("redirections (next.config.ts)", () => {
  const cas = [
    ["/acheter?commune=Asnieres", "/biens?commune=Asnieres"],
    ["/louer", "/biens"],
    ["/bien/10.131", "/biens/10.131"],
    ["/agence", "/le-cabinet"],
    ["/politique-de-confidentialite", "/confidentialite"],
    ["/cookies", "/confidentialite#cookies"],
    ["/estimation", "/vendre/estimation"],
    ["/galerie", "/"],
    ["/galerie/biens/10.131", "/biens/10.131"],
  ] as const;
  for (const [depuis, vers] of cas) {
    it(`${depuis} → ${vers} (307)`, async () => {
      const res = await unstable_getResponseFromNextConfig({
        url: `${BASE}${depuis}`,
        nextConfig,
      });
      assert.equal(res.status, 307);
      const cible = new URL(getRedirectUrl(res) ?? "", BASE);
      assert.equal(`${cible.pathname}${cible.search}${cible.hash}`, vers);
    });
  }
});
