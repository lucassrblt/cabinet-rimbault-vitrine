// Tests unitaires de `src/lib/site-url.ts` (URL publique et indexation),
// lancés par Node seul : npm run test:unit

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MISSING_SITE_URL_MESSAGE,
  netlifyBuildEnv,
  resolveIndexable,
  resolveSiteUrl,
  type SiteEnv,
} from "../lib/site-url";

const PROD = "https://cabinet-rimbault.fr";
const PREVIEW = "https://deploy-preview-15--cabinet-rimbault.netlify.app";
const NETLIFY_PROD: SiteEnv = {
  NODE_ENV: "production",
  NETLIFY: "true",
  CONTEXT: "production",
  URL: PROD,
  DEPLOY_PRIME_URL: "https://main--cabinet-rimbault.netlify.app",
};
const NETLIFY_PREVIEW: SiteEnv = {
  NODE_ENV: "production",
  NETLIFY: "true",
  CONTEXT: "deploy-preview",
  URL: PROD,
  DEPLOY_PRIME_URL: PREVIEW,
};

const href = (env: SiteEnv) => resolveSiteUrl(env).href;

describe("resolveSiteUrl : ordre de priorité", () => {
  it("NEXT_PUBLIC_SITE_URL prime sur Netlify et sur le repli local", () => {
    assert.equal(
      href({
        ...NETLIFY_PREVIEW,
        NEXT_PUBLIC_SITE_URL: "https://exemple.fr",
      }),
      "https://exemple.fr/",
    );
    assert.equal(
      href({ NODE_ENV: "development", NEXT_PUBLIC_SITE_URL: PROD }),
      `${PROD}/`,
    );
  });

  it("ne garde que l'origine et ignore les espaces", () => {
    assert.equal(
      href({
        NEXT_PUBLIC_SITE_URL: `  ${PROD}/biens/  `,
        NODE_ENV: "production",
      }),
      `${PROD}/`,
    );
  });

  it("Netlify production : URL", () => {
    assert.equal(href(NETLIFY_PROD), `${PROD}/`);
  });

  it("Netlify deploy preview et branch deploy : DEPLOY_PRIME_URL", () => {
    assert.equal(href(NETLIFY_PREVIEW), `${PREVIEW}/`);
    assert.equal(
      href({
        ...NETLIFY_PREVIEW,
        CONTEXT: "branch-deploy",
        DEPLOY_PRIME_URL: "https://seo--cabinet-rimbault.netlify.app",
      }),
      "https://seo--cabinet-rimbault.netlify.app/",
    );
  });

  it("variables Netlify ignorées hors Netlify (NETLIFY absente)", () => {
    assert.throws(
      () => href({ NODE_ENV: "production", CONTEXT: "production", URL: PROD }),
      { message: MISSING_SITE_URL_MESSAGE },
    );
  });

  it("repli localhost en développement et en test, sur PORT", () => {
    assert.equal(href({ NODE_ENV: "development" }), "http://localhost:3000/");
    assert.equal(
      href({ NODE_ENV: "development", PORT: "3310" }),
      "http://localhost:3310/",
    );
    assert.equal(href({ NODE_ENV: "test" }), "http://localhost:3000/");
  });

  it("http accepté pour un hôte local (build e2e de production)", () => {
    assert.equal(
      href({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3100",
      }),
      "http://localhost:3100/",
    );
  });
});

describe("resolveSiteUrl : erreurs", () => {
  it("build de production sans URL : erreur claire, pas de localhost", () => {
    assert.throws(() => href({ NODE_ENV: "production" }), {
      message: MISSING_SITE_URL_MESSAGE,
    });
    assert.throws(() => href({ NODE_ENV: "production", PORT: "3000" }), {
      message: /NEXT_PUBLIC_SITE_URL/,
    });
    // Environnement inconnu : même règle que la production.
    assert.throws(() => href({}), { message: MISSING_SITE_URL_MESSAGE });
  });

  it("Netlify sans l'URL du contexte : erreur en production", () => {
    assert.throws(() => href({ ...NETLIFY_PROD, URL: undefined }), {
      message: MISSING_SITE_URL_MESSAGE,
    });
  });

  it("URL illisible ou en http hors local : erreur qui nomme la variable", () => {
    assert.throws(
      () => href({ NODE_ENV: "development", NEXT_PUBLIC_SITE_URL: "cabinet" }),
      { message: /NEXT_PUBLIC_SITE_URL n’est pas une URL valide/ },
    );
    assert.throws(
      () =>
        href({
          NODE_ENV: "production",
          NEXT_PUBLIC_SITE_URL: "http://cabinet-rimbault.fr",
        }),
      { message: /NEXT_PUBLIC_SITE_URL doit être en https/ },
    );
    assert.throws(
      () => href({ ...NETLIFY_PROD, URL: "http://cabinet-rimbault.fr" }),
      { message: /URL \(Netlify, production\) doit être en https/ },
    );
  });
});

describe("resolveIndexable", () => {
  const ouvert: SiteEnv = {
    NODE_ENV: "production",
    NEXT_PUBLIC_ALLOW_INDEXING: "true",
  };

  it("fermé par défaut", () => {
    assert.equal(resolveIndexable({ NODE_ENV: "production" }), false);
    assert.equal(resolveIndexable(NETLIFY_PROD), false);
    assert.equal(
      resolveIndexable({ ...ouvert, NEXT_PUBLIC_ALLOW_INDEXING: "1" }),
      false,
    );
  });

  it("ouvert avec NEXT_PUBLIC_ALLOW_INDEXING=true hors Netlify", () => {
    assert.equal(resolveIndexable(ouvert), true);
  });

  it("Netlify : production seulement, jamais les deploy previews", () => {
    assert.equal(
      resolveIndexable({ ...NETLIFY_PROD, NEXT_PUBLIC_ALLOW_INDEXING: "true" }),
      true,
    );
    for (const CONTEXT of ["deploy-preview", "branch-deploy", "dev"]) {
      assert.equal(
        resolveIndexable({
          ...NETLIFY_PREVIEW,
          CONTEXT,
          NEXT_PUBLIC_ALLOW_INDEXING: "true",
        }),
        false,
        CONTEXT,
      );
    }
  });

  it("porte de maintenance posée : jamais indexable", () => {
    assert.equal(
      resolveIndexable({ ...ouvert, MAINTENANCE_MODE: "on" }),
      false,
    );
    assert.equal(
      resolveIndexable({
        ...NETLIFY_PROD,
        NEXT_PUBLIC_ALLOW_INDEXING: "true",
        MAINTENANCE_MODE: "on",
      }),
      false,
    );
  });
});

describe("netlifyBuildEnv", () => {
  it("recopie les variables Netlify sous des clés propres", () => {
    assert.deepEqual(netlifyBuildEnv({ ...NETLIFY_PREVIEW }), {
      SITE_NETLIFY: "true",
      SITE_NETLIFY_CONTEXT: "deploy-preview",
      SITE_NETLIFY_URL: PROD,
      SITE_NETLIFY_DEPLOY_PRIME_URL: PREVIEW,
    });
  });

  it("vide hors Netlify (rien de figé, rien d'écrasé)", () => {
    assert.deepEqual(netlifyBuildEnv({ URL: PROD, CONTEXT: "production" }), {});
  });
});
